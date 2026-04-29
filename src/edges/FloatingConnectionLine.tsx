import { ConnectionLineComponentProps, getBezierPath, InternalNode, Node } from '@xyflow/react';

import { getEdgeParams } from '../utils/initialElements.ts';

function FloatingConnectionLine({
  toX,
  toY,
  fromPosition,
  toPosition,
  fromNode,
}: ConnectionLineComponentProps) {
  if (!fromNode) {
    return null;
  }

  function createMockNode(x: number, y: number): InternalNode<Node> {
  return {
    id: "connection-target",
    type: "default",
    position: { x, y },
    data: {},
    measured: { width: 1, height: 1 },
    internals: {
      positionAbsolute: { x, y },
    },
  } as unknown as InternalNode<Node>;
}

  // Create a mock target node at the cursor position
  const targetNode = createMockNode(toX, toY)
  const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(
    fromNode,
    targetNode,
  );

  const [edgePath] = getBezierPath({
    sourceX: sx,
    sourceY: sy,
    sourcePosition: sourcePos || fromPosition,
    targetPosition: targetPos || toPosition,
    targetX: tx || toX,
    targetY: ty || toY,
  });

  return (
    <g>
      <path
        fill="none"
        stroke="#fff"
        strokeWidth={1.5}
        className="animated"
        d={edgePath}
      />
      <circle
        cx={tx || toX}
        cy={ty || toY}
        fill="#fff"
        r={3}
        stroke="#fff"
        strokeWidth={1.5}
      />
    </g>
  );
}

export default FloatingConnectionLine;
