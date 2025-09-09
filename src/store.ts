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
  Connection
} from '@xyflow/react';
import { createWithEqualityFn } from 'zustand/traditional';
 
export type RFState = {
  currentMode: 'none' | 'create' | 'edge';
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  addNode: (position: XYPosition) => void;
  addConnection: (connection: Connection) => void;
  toggleCreationMode: () => void;
  toggleConnection: () => void;
};
 
const useStore = createWithEqualityFn<RFState>((set, get) => ({
  currentMode: 'create',
  nodes: [
    {
      id: 'root',
      type: 'goal',
      data: { label: 'React Flow Mind Map' },
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
    console.log('edge changes', changes);
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  addNode: (position: XYPosition) => {
    const newNode: Node = {
      id: crypto.randomUUID(),
      type: 'goal',
      position,
      data: { label: 'New Node' },
      origin: [0.5,0.5]
    }
    set({ nodes: [...get().nodes, newNode] });
  },
  toggleCreationMode: () => {
    set({ currentMode: get().currentMode === 'create' ? 'none' : 'create' });
  },
  toggleConnection: () => {
    set({ currentMode: get().currentMode === 'edge' ? 'none' : 'edge' });
  },
  addConnection: (connection) => {
    set({ edges: addEdge(connection, get().edges) });
  }
}));
 
export default useStore;