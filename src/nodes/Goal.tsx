import { Handle, NodeResizer, Position, useConnection, useUpdateNodeInternals } from '@xyflow/react';
import type { Node, NodeProps } from '@xyflow/react';
import useStore from '../store';
import { useEffect } from 'react';

type GoalNode = Node<{ label: string, goalType: 'achieve' | 'query' | 'perform'}, 'text'>;
 
export default function GoalNode({ data, id, selected }: NodeProps<GoalNode>) {
  const updateNodeInternals = useUpdateNodeInternals();
  const currentMode = useStore(state => state.currentMode);
  const connection = useConnection();
  const isTarget = connection.inProgress && connection.fromNode.id !== id;
  useEffect(() => {updateNodeInternals(id)}, [currentMode])
  let color = "white";
  switch(data.goalType){
    case 'achieve': 
      color = "green";
      break;
    case 'query':
      color = "orange";
      break; 
  }
  return <>
    <NodeResizer
      color="#ff0071"
      isVisible={selected}
    />
        {(!connection.inProgress) && (
          <Handle className='customHandle' position={Position.Right} type='source' isConnectableStart={currentMode === 'edge'} />
        )}
        <div>
        {data.label}
        </div>
        {(!connection.inProgress || isTarget) && (
          <Handle className="customHandle" position={Position.Left} type="target" isConnectableStart={false} />
        )}
  </>
}