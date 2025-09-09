import { useState, useCallback } from 'react'
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Background, Controls,useReactFlow, ReactFlowProvider } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import './App.css'
import Index from './index'
import GoalNode from './nodes/goal'


export default function App() {
  return (
      <ReactFlowProvider>
        <Index/>
      </ReactFlowProvider>
  );
}

