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
  MarkerType
} from '@xyflow/react';
import { createWithEqualityFn } from 'zustand/traditional';
type nodes = 'achieve' | 'query' | 'perform';
export type RFState = {
  currentMode: 'none' | 'create' | 'edge';
  nodeType: nodes;
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  addNode: (position: XYPosition) => void;
  addConnection: (connection: Connection) => void;
  toggleCreationMode: (type: nodes) => void;
  toggleConnection: () => void;
};
 
const useStore = createWithEqualityFn<RFState>((set, get) => ({
  currentMode: 'create',
  nodeType: 'perform',
  nodes: [
    {
      id: 'root',
      type: 'goal',
      data: { label: 'React Flow Mind Map', goalType: 'achieve' },
      position: { x: 0, y: 0 },
    },
  ],
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
      type: 'goal',
      position,
      data: { label: 'New Node', goalType: get().nodeType },
      origin: [0.5,0.5]
    }
    set({ nodes: [...get().nodes, newNode] });
  },
  toggleCreationMode: (type: nodes) => {
    set({ currentMode: get().currentMode === 'create' && get().nodeType === type ? 'none' : 'create', nodeType: type  });
  },
  toggleConnection: () => {
    set({ currentMode: get().currentMode === 'edge' ? 'none' : 'edge'});
  },
  addConnection: (connection) => {
    set({ edges: addEdge(
      {
        ...connection, 
        type: 'floating',
        markerEnd: {type: MarkerType.Arrow}},
        get().edges)
      }
    );
  }
}));
 
export default useStore;