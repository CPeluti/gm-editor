import { describe, it, expect, beforeEach } from 'vitest';
import useStore from '../src/store';
import { parseReactflowToNode } from '../src/utils/goalModel';
import type { Node } from '@xyflow/react';

describe('Editor React - LSP Diagnostics Handling', () => {
  beforeEach(() => {
    useStore.setState({
      nodes: [
        {
          id: 'node-1',
          type: 'istar.Goal',
          position: { x: 0, y: 0 },
          data: { label: 'Goal 1', GoalType: 'Achieve' },
        },
        {
          id: 'node-2',
          type: 'istar.Task',
          position: { x: 100, y: 100 },
          data: { label: 'Task 1', GoalType: 'Perform' },
        },
      ],
      edges: [],
      diagnostics: [],
    });
  });

  it('receives diagnostics and maps error to corresponding node', () => {
    const { setDiagnostics } = useStore.getState();

    setDiagnostics([
      {
        nodeId: 'node-1',
        severity: 'error',
        message:
          "Property 'QueriedProperty' can only be used with 'Query' goals",
      },
    ]);

    const state = useStore.getState();
    expect(state.diagnostics).toHaveLength(1);

    const node1 = state.nodes.find((n) => n.id === 'node-1');
    expect(node1?.data.error).toBe('error');
    expect(node1?.data.errorMessage).toContain('QueriedProperty');

    const node2 = state.nodes.find((n) => n.id === 'node-2');
    expect(node2?.data.error).toBeUndefined();
  });

  it('updates diagnostics to warning severity', () => {
    const { setDiagnostics } = useStore.getState();

    setDiagnostics([
      {
        nodeId: 'node-2',
        severity: 'warning',
        message: 'Potential issue detected',
      },
    ]);

    const state = useStore.getState();
    const node2 = state.nodes.find((n) => n.id === 'node-2');
    expect(node2?.data.error).toBe('warning');
    expect(node2?.data.errorMessage).toBe('Potential issue detected');
  });

  it('clears node errors when diagnostics are resolved', () => {
    const { setDiagnostics } = useStore.getState();

    setDiagnostics([
      {
        nodeId: 'node-1',
        severity: 'error',
        message: 'Initial error',
      },
    ]);

    expect(
      useStore.getState().nodes.find((n) => n.id === 'node-1')?.data.error,
    ).toBe('error');

    // LSP clears diagnostics
    setDiagnostics([]);

    const state = useStore.getState();
    expect(state.diagnostics).toHaveLength(0);
    expect(
      state.nodes.find((n) => n.id === 'node-1')?.data.error,
    ).toBeUndefined();
    expect(
      state.nodes.find((n) => n.id === 'node-1')?.data.errorMessage,
    ).toBeUndefined();
  });

  it('does not serialize error state into customProperties in parseReactflowToNode', () => {
    const nodes: Node[] = [
      {
        id: 'node-1',
        type: 'istar.Goal',
        position: { x: 10, y: 20 },
        data: {
          label: 'Test Goal',
          GoalType: 'Achieve',
          error: 'error',
          errorMessage: 'Some error message',
          diagnostics: ['Some error message'],
        },
      },
    ];

    const jsonString = parseReactflowToNode(nodes, []);
    const parsed = JSON.parse(jsonString);

    expect(parsed.actors).toBeDefined();
    const actor = parsed.actors[0];
    expect(actor.customProperties.error).toBeUndefined();
    expect(actor.customProperties.errorMessage).toBeUndefined();
    expect(actor.customProperties.diagnostics).toBeUndefined();
    expect(actor.customProperties.GoalType).toBe('Achieve');
  });
});
