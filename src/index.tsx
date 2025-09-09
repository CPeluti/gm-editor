import { useState, useCallback, useRef, use } from 'react'
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Background, Controls, useReactFlow, Connection } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import './App.css'
import GoalNode from './nodes/goal'

import { shallow } from 'zustand/shallow';
import useStore, { RFState } from './store';
import Sidebar from './ui/sidebar'

const nodeTypes = {
  goal: GoalNode

}
const selector = (state: RFState) => ({
  currentMode: state.currentMode,
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  addNode: state.addNode,
  addConnection: state.addConnection
});

export default function Index() {
  const { screenToFlowPosition } = useReactFlow();
  const { nodes, edges, onNodesChange, onEdgesChange, addNode, currentMode, addConnection } = useStore(selector, shallow);

  const onClick = useCallback((event: React.MouseEvent) => {
    if(currentMode !== 'create') return;

    addNode(screenToFlowPosition({x: event.clientX, y: event.clientY}));
  },[currentMode, addNode, screenToFlowPosition]);
  const onConnect = useCallback((connection: Connection)=>{if(currentMode === 'edge') {addConnection(connection)}},[addConnection, currentMode])
  return (
    <div style={{ width: '100vw', height: '100vh', color: 'black', flexDirection: 'row', display: 'flex' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onPaneClick = {onClick}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          panOnDrag = {currentMode !== 'create'}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
        <Sidebar />
    </div>
  );
}

