import { useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  useReactFlow,
  Connection,
  MiniMap,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './App.css';
import GoalNode from './nodes/Goal.tsx';
import TaskNode from './nodes/Task.tsx';

import { shallow } from 'zustand/shallow';
import useStore, { RFState } from './store';
import Sidebar from './ui/sidebar';
import AndDecomposition from './edges/AndDecomposition.tsx';
import FloatingConnectionLine from './edges/FloatingConnectionLine.tsx';
import OrDecomposition from './edges/OrDecomposition.tsx';

const nodeTypes = {
  'istar.Goal': GoalNode,
  'istar.Task': TaskNode,
};
const edgeTypes = {
  'istar.AndRefinementLink': AndDecomposition,
  'istar.OrRefinementLink': OrDecomposition,
};
const selector = (state: RFState) => ({
  currentMode: state.currentMode,
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  addNode: state.addNode,
  addConnection: state.addConnection,
  loadGoalModel: state.loadGoalModel,
  edgeType: state.edgeType,
  setError: state.setError,
});

export default function Index() {
  const { screenToFlowPosition } = useReactFlow();
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    addNode,
    currentMode,
    addConnection,
    loadGoalModel,
    setError,
  } = useStore(selector, shallow);

  const onClick = useCallback(
    (event: React.MouseEvent) => {
      if (currentMode !== 'create') return;

      addNode(screenToFlowPosition({ x: event.clientX, y: event.clientY }));
    },
    [currentMode, addNode, screenToFlowPosition],
  );
  const onConnect = useCallback(
    (connection: Connection) => {
      if (currentMode === 'edge') {
        addConnection(connection);
      }
    },
    [addConnection, currentMode],
  );

  return (
    <>
      <button onClick={() => loadGoalModel()}>teste</button>
      <button
        onClick={() =>
          setError('9a952783-d786-409b-a5e7-039ab220442b', 'node', 'error')
        }
      >
        teste2
      </button>
      <div
        style={{
          width: '100vw',
          height: '100vh',
          color: 'black',
          flexDirection: 'row',
          display: 'flex',
        }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onPaneClick={onClick}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          connectionLineComponent={FloatingConnectionLine}
          panOnDrag={currentMode !== 'create'}
          nodesConnectable={currentMode == 'edge'}
          fitView
          deleteKeyCode={['Backspace', 'Delete']}
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
        <Sidebar />
      </div>
    </>
  );
}
