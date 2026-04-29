import {
  BaseEdge,
  EdgeProps,
  getBezierPath,
  useInternalNode,
} from '@xyflow/react';

import { getEdgeParams } from '../utils/initialElements.ts';
function OrDecomposition({ source, target, style }: EdgeProps) {
  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);

  if (!sourceNode || !targetNode) {
    return null;
  }

  const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(
    sourceNode,
    targetNode,
  );

  const [edgePath] = getBezierPath({
    sourceX: sx,
    sourceY: sy,
    sourcePosition: sourcePos,
    targetPosition: targetPos,
    targetX: tx,
    targetY: ty,
  });
  const markerStyle = {
    strokeWidth: '1px',
    stroke: 'rgb(177, 177, 183)',
    fill: 'rgb(177, 177, 183)',
  };
  const styleCustom = { ...style, stroke: 'white', strokeWidth: 2 };
  return (
    <>
      <svg style={{ position: 'absolute', top: 0, left: 0 }}>
        <defs>
          <marker
            className={'react-flow__arrowhead'}
            id="arrow"
            markerWidth="20.5"
            markerHeight="20.5"
            viewBox="-10 -10 20 20"
            markerUnits="strokeWidth"
            orient="auto-start-reverse"
            refX="0"
            refY="0"
          >
            <polyline
              style={markerStyle}
              className="arrowclosed"
              strokeLinecap="round"
              strokeLinejoin="round"
              points="-5,-4 0,0 -5,4 -5,-4"
            ></polyline>
          </marker>
        </defs>
      </svg>
      <BaseEdge
        path={edgePath}
        markerEnd={'url(#arrow)'}
        style={styleCustom}
      ></BaseEdge>
    </>
  );
}

export default OrDecomposition;
