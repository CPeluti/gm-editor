import {
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  OnNodesChange,
  OnEdgesChange,
  applyNodeChanges,
  applyEdgeChanges,
  XYPosition,
  addEdge,
  Connection,
} from '@xyflow/react';
import { createWithEqualityFn } from 'zustand/traditional';
import {
  GoalModel,
  parseNodeToReactFlow,
  parseReactflowToNode,
} from './utils/goalModel';
type nodes = 'Achieve' | 'Query' | 'Perform';
type edgeType = 'Or' | 'And';

export interface DiagnosticItem {
  message: string;
  severity: 'error' | 'warning' | 'info';
  range?: {
    start: { line: number; character: number };
    end: { line: number; character: number };
  };
  source?: string;
  nodeId?: string;
}

export type RFState = {
  currentMode: 'none' | 'create' | 'edge';
  nodeType: nodes;
  edgeType: 'Or' | 'And';
  nodes: Node[];
  edges: Edge[];
  diagnostics: DiagnosticItem[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  addNode: (position: XYPosition) => void;
  addConnection: (connection: Connection) => void;
  toggleCreationMode: (type: nodes) => void;
  toggleConnection: (type: edgeType) => void;
  loadGoalModel: (model: string) => object;
  parseReactFlowToNode: () => string;
  setError: (
    id: string,
    type: 'edge' | 'node',
    level: 'warning' | 'error',
  ) => void;
  setDiagnostics: (diagnostics: DiagnosticItem[]) => void;
};

const useStore = createWithEqualityFn<RFState>((set, get) => ({
  currentMode: 'none',
  nodeType: 'Perform',
  edgeType: 'And',
  nodes: [],
  edges: [],
  diagnostics: [],
  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  addNode: (position: XYPosition) => {
    const newNode: Node = {
      id: crypto.randomUUID(),
      type: 'istar.Goal',
      position,
      data: { label: 'New Node', GoalType: `${get().nodeType}` },
      origin: [0.5, 0.5],
    };
    set({ nodes: [...get().nodes, newNode] });
  },
  toggleCreationMode: (type: nodes) => {
    set({
      currentMode:
        get().currentMode === 'create' && get().nodeType === type
          ? 'none'
          : 'create',
      nodeType: type,
    });
  },
  toggleConnection: (type: edgeType) => {
    if (get().currentMode === 'edge' && type === get().edgeType) {
      set({
        currentMode: 'none',
      });
    } else {
      set({
        currentMode: 'edge',
        edgeType: type,
      });
    }
  },
  addConnection: (connection) => {
    set({
      edges: addEdge(
        {
          ...connection,
          type: `istar.${get().edgeType}RefinementLink`,
        },
        get().edges,
      ),
    });
  },

  setError: (id: string, type: 'edge' | 'node', level: 'warning' | 'error') => {
    if (type === 'node') {
      set({
        nodes: get().nodes.map((node) =>
          node.id === id
            ? {
              ...node,
              data: {
                ...node.data,
                error: level,
              },
            }
            : node,
        ),
      });
    }

    if (type === 'edge') {
      set({
        edges: get().edges.map((edge) =>
          edge.id === id
            ? {
              ...edge,
              data: {
                ...edge.data,
                error: level,
              },
            }
            : edge,
        ),
      });
    }
  },
  setDiagnostics: (diagnostics: DiagnosticItem[]) => {
    const nodeErrorMap = new Map<
      string,
      { level: 'warning' | 'error'; messages: string[] }
    >();

    for (const diag of diagnostics) {
      if (diag.nodeId) {
        const level: 'warning' | 'error' =
          diag.severity === 'error' ? 'error' : 'warning';
        const existing = nodeErrorMap.get(diag.nodeId);
        if (!existing) {
          nodeErrorMap.set(diag.nodeId, { level, messages: [diag.message] });
        } else {
          if (level === 'error') {
            existing.level = 'error';
          }
          existing.messages.push(diag.message);
        }
      }
    }

    set({
      diagnostics,
      nodes: get().nodes.map((node) => {
        const err = nodeErrorMap.get(node.id);
        return {
          ...node,
          data: {
            ...node.data,
            error: err ? err.level : undefined,
            errorMessage: err ? err.messages.join('\n') : undefined,
            diagnostics: err ? err.messages : undefined,
          },
        };
      }),
    });
  },
  parseReactFlowToNode: () => {
    return parseReactflowToNode(get().nodes, get().edges);
  },
  loadGoalModel: async (model: string) => {
    //read file
    //TODO: Remove fetch when integrating to vscode.
    // const json = await fetch('/teste.json');
    const gm = await JSON.parse(model);
    const pistar = gm.tool == 'pistar.2.1.0';
    const parsedGm = GoalModel.parse(gm);
    //parse actors
    const actors: Array<Node> = parsedGm.actors
      .map((el) => parseNodeToReactFlow(el, pistar))
      .filter((el) => el != undefined);
    //parse goals and tasks
    let goals: Array<Node> = [];
    let tasks: Array<Node> = [];
    parsedGm.actors.forEach((actor) => {
      const nodes = actor.nodes
        .map((el) => parseNodeToReactFlow(el, pistar, actor.id))
        .filter((el) => el != undefined);
      goals = nodes.filter((el) => el.type == 'istar.Goal');
      tasks = nodes.filter((el) => el.type == 'istar.Task');
    });
    const parsedNodes = [...actors, ...goals, ...tasks];

    // Re-apply existing diagnostics if already received
    const currentDiagnostics = get().diagnostics;
    if (currentDiagnostics && currentDiagnostics.length > 0) {
      const nodeErrorMap = new Map<
        string,
        { level: 'warning' | 'error'; messages: string[] }
      >();
      for (const diag of currentDiagnostics) {
        if (diag.nodeId) {
          const level: 'warning' | 'error' =
            diag.severity === 'error' ? 'error' : 'warning';
          const existing = nodeErrorMap.get(diag.nodeId);
          if (!existing) {
            nodeErrorMap.set(diag.nodeId, { level, messages: [diag.message] });
          } else {
            if (level === 'error') existing.level = 'error';
            existing.messages.push(diag.message);
          }
        }
      }
      for (const node of parsedNodes) {
        const err = nodeErrorMap.get(node.id);
        if (err) {
          node.data = {
            ...node.data,
            error: err.level,
            errorMessage: err.messages.join('\n'),
            diagnostics: err.messages,
          };
        }
      }
    }

    set({ nodes: parsedNodes });
    set({ edges: parsedGm.links });
  },
}));

export default useStore;
