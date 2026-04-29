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
import { GoalModel, parseNodeToReactFlow } from './utils/goalModel';
type nodes = 'Achieve' | 'Query' | 'Perform';
type edgeType = 'Or' | 'And';

export type RFState = {
  currentMode: 'none' | 'create' | 'edge';
  nodeType: nodes;
  edgeType: 'Or' | 'And';
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  addNode: (position: XYPosition) => void;
  addConnection: (connection: Connection) => void;
  toggleCreationMode: (type: nodes) => void;
  toggleConnection: (type: edgeType) => void;
  loadGoalModel: () => object;
  setError: (
    id: string,
    type: 'edge' | 'node',
    level: 'warning' | 'error',
  ) => void;
};

const useStore = createWithEqualityFn<RFState>((set, get) => ({
  currentMode: 'none',
  nodeType: 'Perform',
  edgeType: 'And',
  nodes: [],
  edges: [],
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

  loadGoalModel: async () => {
    //read file
    //TODO: Remove fetch when integrating to vscode.
    const json = await fetch('/teste.json');
    const gm = await json.json();
    const parsedGm = GoalModel.parse(gm);
    //parse actors
    const actors: Array<Node> = parsedGm.actors
      .map((el) => parseNodeToReactFlow(el))
      .filter((el) => el != undefined);
    //parse goals and tasks
    let goals: Array<Node> = [];
    let tasks: Array<Node> = [];
    parsedGm.actors.forEach((actor) => {
      const nodes = actor.nodes
        .map((el) => parseNodeToReactFlow(el, actor.id))
        .filter((el) => el != undefined);
      goals = nodes.filter((el) => el.type == 'istar.Goal');
      tasks = nodes.filter((el) => el.type == 'istar.Task');
    });
    const parsedNodes = [...actors, ...goals, ...tasks];
    set({ nodes: parsedNodes });
    set({ edges: parsedGm.links });
  },
}));

export default useStore;
