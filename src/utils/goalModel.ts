import { z } from 'zod';
import { Edge, Node as FlowNode } from '@xyflow/react';

const NodeType = z.enum(['istar.Task', 'istar.Goal', 'istar.Actor']);

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
  type: z.enum(['istar.AndRefinementLink', 'istar.OrRefinementLink']),
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

type basicNode = {
  id: string;
  text: string;
  type: string;
  x: number;
  y: number;
  customProperties: Record<string, string>;
};
type goalModelNode = basicNode & {
  nodes?: Array<basicNode>;
};
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

export function parseReactflowToNode(nodes: FlowNode[], edges: Edge[]): string {
  const parsedDisplay: Record<string, { width: number; height: number }> = {};
  const parsedNodes: goalModelNode[] = [];
  let parsedRefinements = [];
  let pushedIds: string[] = [];
  console.log(parsedNodes);

  while (nodes.length) {
    nodes.forEach((node) => {
      const { label, error, errorMessage, diagnostics, ...customProps } =
        (node.data || {}) as any;
      const basicNode: goalModelNode = {
        id: node.id,
        text: label as string,
        type: node.type as string,
        x: node.position.x,
        y: node.position.y,
        customProperties: customProps as Record<string, string>,
      };
      if (node.measured)
        parsedDisplay[node.id] = {
          width: node.measured.width!,
          height: node.measured.height!,
        };
      //Node doesn't have parentId thus is the actor
      if (!node.parentId) {
        const parentNode: goalModelNode = { ...basicNode, nodes: [] };
        parsedNodes.push(parentNode);
      } else {
        const parent = parsedNodes.find((el) => el.id == node.parentId);
        if (parent) parent.nodes!.push(basicNode);
      }
      pushedIds.push(node.id);
    });

    //remove push ids from nodes list
    nodes = nodes.filter((el) => !pushedIds.includes(el.id));
    pushedIds = [];
  }
  parsedRefinements = edges.map((el) => ({
    id: el.id,
    type: el.type,
    source: el.source,
    target: el.target,
  }));

  const outputObj = {
    actors: parsedNodes,
    orphans: [],
    dependencies: [],
    links: parsedRefinements,
    display: parsedDisplay,
    tool: 'custom',
    istar: '2.0',
    saveDate: 'Thu, 13 Feb 2025 16:31:31 GMT',
    diagram: {
      width: 2000,
      height: 1300,
      name: 'Welcome Model',
      customProperties: {
        Description:
          'Welcome to the piStar tool! This model describe some of the recent improvements in the tool.\n\nFor help using this tool, please check the Help menu above',
      },
    },
  };
  return JSON.stringify(outputObj, null, 2);
}

export function parseNodeToReactFlow(
  node: Node,
  pistar: boolean,
  parentId?: string,
): FlowNode | undefined {
  if (node) {
    const parsedNode: FlowNode = {
      id: node.id,
      type: node.type,
      data: { label: node.text, ...node.customProperties },
      position: pistar
        ? { x: node.x * 2, y: node.y * 2 }
        : { x: node.x, y: node.y },
      style: {
        //24 is the font size
        width: node.text.length * 24 > 300 ? 300 : node.text.length * 24,
      },
    };
    if (parentId) parsedNode.parentId = parentId;
    return parsedNode;
  }
  console.error('failed to parse node', node);
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
