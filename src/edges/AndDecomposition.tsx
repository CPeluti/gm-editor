import { BaseEdge, EdgeProps, getBezierPath, MarkerType, useInternalNode } from "@xyflow/react";

import { getEdgeParams } from "../utils/initialElements.ts";
function AndDecomposition({ id, source, target, markerEnd, style }: EdgeProps) {
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
  const styleCustom = {...style, stroke:"white", strokeWidth: 2}
  return (
    <>
      <svg style={{ position: 'absolute', top: 0, left: 0 }}>
        <defs>

          <marker
            id="and"
            orient="auto"
            overflow="visible"
            markerUnits="userSpaceOnUse">
            <path
              id="v-234"
              stroke="white"
              fill="none"
              transform="rotate(180)"
              d="m 10,-6 l 0,12"
              strokeWidth="2"></path>
          </marker>
        </defs>
      </svg>
      <BaseEdge path={edgePath} markerEnd="url(#and)" style={styleCustom}></BaseEdge>
    </>
  );
}

export default AndDecomposition;
