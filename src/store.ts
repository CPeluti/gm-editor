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
  MarkerType,
} from "@xyflow/react";
import { createWithEqualityFn } from "zustand/traditional";
import { GoalModel, parseNodeToReactFlow } from "./utils/goalModel";
type nodes = "Achieve" | "Query" | "Perform";
export type RFState = {
  currentMode: "none" | "create" | "edge";
  nodeType: nodes;
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  addNode: (position: XYPosition) => void;
  addConnection: (connection: Connection) => void;
  toggleCreationMode: (type: nodes) => void;
  toggleConnection: () => void;
  loadGoalModel: () => object;
};

const useStore = createWithEqualityFn<RFState>((set, get) => ({
  currentMode: "create",
  nodeType: "Perform",
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
      type: "goal",
      position,
      data: { label: "New Node", goalType: get().nodeType },
      origin: [0.5, 0.5],
    };
    set({ nodes: [...get().nodes, newNode] });
  },
  toggleCreationMode: (type: nodes) => {
    set({
      currentMode:
        get().currentMode === "create" && get().nodeType === type
          ? "none"
          : "create",
      nodeType: type,
    });
  },
  toggleConnection: () => {
    set({ currentMode: get().currentMode === "edge" ? "none" : "edge" });
  },
  addConnection: (connection) => {
    set({
      edges: addEdge(
        {
          ...connection,
          type: "floating",
          markerEnd: { type: MarkerType.Arrow },
        },
        get().edges,
      ),
    });
  },
  loadGoalModel: async () => {
    //read file
    //TODO: Remove fetch when integrating to vscode.
    const json = await fetch("/teste.json");
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
      goals = nodes.filter((el) => el.type == "istar.Goal");
      tasks = nodes.filter((el) => el.type == "istar.Task");
    });
    const parsedNodes = [...actors, ...goals, ...tasks];
    set({ nodes: parsedNodes });
    set({ edges: parsedGm.links });
  },
}));

export default useStore;
