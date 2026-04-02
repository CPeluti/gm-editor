import { z } from "zod";
import { Node as FlowNode } from "@xyflow/react";

const NodeType = z.enum(["istar.Task", "istar.Goal", "istar.Actor"]);

const CustomProperties = z
  .object({
    customProperties: z.record(z.string(), z.string()),
  })
  .strict();

const Diagram = z
  .object({
    width: z.number(),
    height: z.number(),
    name: z.string(),
    customProperties: z.record(z.string(), z.string()),
  })
  .strict();

const DisplayItem = z
  .object({
    width: z.number().optional(),
    height: z.number().optional(),
    backgroundColor: z.string().optional(),
  })
  .strict();

const Link = z.object({
  id: z.string(),
  type: z.enum(["istar.AndRefinementLink", "istar.OrRefinementLink"]),
  source: z.string(),
  target: z.string(),
});

const Display = z.record(z.string(), DisplayItem);

const Node = z
  .object({
    id: z.string(),
    text: z.string(),
    type: NodeType,
    parent: z.string().optional(),
    x: z.number(),
    y: z.number(),
  })
  .merge(CustomProperties)
  .strict();

const Actor = z
  .object({
    nodes: z.array(Node),
  })
  .merge(Node)
  .strict();

const GoalModel = z.object({
  actors: z.array(Actor),
  orphans: z.tuple([]),
  dependencies: z.tuple([]),
  links: z.array(Link),
  display: Display,
  diagram: Diagram,
});

type Node = z.infer<typeof Node>;
type Link = z.infer<typeof Link>;
type NodeType = z.infer<typeof NodeType>;

export function parseNodeToReactFlow(
  node: Node,
  parentId?: string,
): FlowNode | undefined {
  if (node) {
    const parsedNode: FlowNode = {
      id: node.id,
      type: node.type,
      data: { label: node.text, ...node.customProperties },
      position: { x: node.x / 2, y: node.y / 2 },
    };
    if (parentId) parsedNode.parentId = parentId;
    return parsedNode;
  }
  console.error("failed to parse node", node);
  return undefined;
}

export {
  NodeType,
  CustomProperties,
  DisplayItem,
  Diagram,
  Display,
  Link,
  Node,
  Actor,
  GoalModel,
};
