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
import DiagnosticBadge from '../ui/DiagnosticBadge';

type GoalNode = Node<
  {
    label: string;
    GoalType: 'Achieve' | 'Query' | 'Perform';
    error?: 'none' | 'warning' | 'error';
    errorMessage?: string;
    diagnostics?: string[];
  },
  'text'
>;

export default function GoalNode({ data, id, selected }: NodeProps<GoalNode>) {
  const updateNodeInternals = useUpdateNodeInternals();
  const currentMode = useStore((state) => state.currentMode);
  const edgeType = useStore((state) => state.edgeType);
  const connection = useConnection();
  const isTarget = connection.inProgress && connection.fromNode.id !== id;
  useEffect(() => {
    updateNodeInternals(id);
  }, [currentMode, edgeType, updateNodeInternals, id]);
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
  const hasError = data.error && data.error !== 'none';
  const strokeColor =
    data.error === 'error'
      ? '#ef4444'
      : data.error === 'warning'
        ? '#f59e0b'
        : 'black';
  const strokeWidth = hasError ? '3' : '2';

  return (
    <>
      <NodeResizer
        color="#ff0071"
        isVisible={selected}
        minHeight={60}
        minWidth={150}
      />
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
        }}
      >
        <DiagnosticBadge
          error={data.error}
          errorMessage={data.errorMessage}
          diagnostics={data.diagnostics}
        />
        {!connection.inProgress && (
          <Handle
            className={`customHandle ${currentMode == 'edge' ? 'z-50' : '-z-1'}`}
            position={Position.Top}
            type="source"
            isConnectableStart={true}
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
          <rect
            x="0"
            y="0"
            vectorEffect="non-scaling-stroke"
            width="100%"
            height="100%"
            rx="20"
            fill={color}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
        </svg>

        <div
          title={data.errorMessage || undefined}
          style={{
            position: 'relative',
            minWidth: 150,
            minHeight: 60,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            fontSize: 12,
            textAlign: 'center',
          }}
        >
          <span>{data.label}</span>
        </div>
        {(!connection.inProgress || isTarget) && (
          <Handle
            className="customHandle z-50"
            position={Position.Bottom}
            type="target"
            isConnectableStart={false}
          />
        )}
      </div>
    </>
  );
}
