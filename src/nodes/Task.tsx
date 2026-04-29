import {
  Handle,
  NodeResizer,
  Position,
  useConnection,
  useUpdateNodeInternals,
} from '@xyflow/react';
import type { Node, NodeProps } from '@xyflow/react';
import useStore from '../store';
import { useEffect } from 'react';

type GoalNode = Node<
  { label: string; GoalType: 'Achieve' | 'Query' | 'Perform' },
  'text'
>;

export default function TaskNode({ data, id, selected }: NodeProps<GoalNode>) {
  const updateNodeInternals = useUpdateNodeInternals();
  const currentMode = useStore((state) => state.currentMode);
  const connection = useConnection();
  const isTarget = connection.inProgress && connection.fromNode.id !== id;
  useEffect(() => {
    updateNodeInternals(id);
  }, [currentMode, id, updateNodeInternals]);
  let color = 'white';
  switch (data.GoalType) {
    case 'Achieve':
      color = 'green';
      break;
    case 'Query':
      color = 'orange';
      break;
    default:
      color = 'white';
      break;
  }
  return (
    <>
      <NodeResizer color="#ff0071" isVisible={selected} />
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        {!connection.inProgress && (
          <Handle
            className="customHandle"
            position={Position.Top}
            type="source"
            isConnectableStart={currentMode === 'edge'}
          />
        )}
        <svg
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
          viewBox="0 0 130 36"
          preserveAspectRatio="none"
        >
          <polygon
            points="0,18 15,0 115,0 130,18 115,36 15,36"
            fill={color}
            stroke="black"
            strokeWidth="2"
          />
        </svg>

        <div
          style={{
            position: 'relative',
            minWidth: 150,
            minHeight: 60,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 10,
            fontSize: 12,
          }}
        >
          <span>{data.label}</span>
        </div>
        {(!connection.inProgress || isTarget) && (
          <Handle
            className="customHandle"
            position={Position.Bottom}
            type="target"
            isConnectableStart={false}
          />
        )}
      </div>
    </>
  );
}

<div></div>;
