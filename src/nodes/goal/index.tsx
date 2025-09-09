import { Handle, NodeResizer, Position, useConnection, useUpdateNodeInternals } from '@xyflow/react';
import type { Node, NodeProps } from '@xyflow/react';
import useStore,{ RFState } from '../../store';
import { useEffect } from 'react';

type TextNode = Node<{ label: string }, 'text'>;
 
export default function GoalNode({ data, id, selected }: NodeProps<TextNode>) {
  const updateNodeInternals = useUpdateNodeInternals();
  const currentMode = useStore(state => state.currentMode);
  const connection = useConnection();
  const isTarget = connection.inProgress && connection.fromNode.id !== id && currentMode === 'edge';
  useEffect(() => {updateNodeInternals(id)}, [currentMode])
  return <>
    <NodeResizer
      color="#ff0071"
      isVisible={selected}
      minWidth={100}
      minHeight={30}
    />

    <div className="font-bold custom-node">
      <div className="custom-node-body">
        {(!connection.inProgress) && (
          <Handle className='customHandle' position={Position.Right} type='source' isConnectableStart={currentMode === 'edge'} />
        )}
        {data.label}
        {(!connection.inProgress || isTarget) && (
          <Handle className="customHandle" position={Position.Left} type="target" isConnectableStart={false} />
        )}
      </div>
    </div>
  </>
}