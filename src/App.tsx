import { ReactFlowProvider } from '@xyflow/react';
// import vscode from './vscode';

import '@xyflow/react/dist/style.css';
import './App.css';
import Index from './index';
import { useEffect } from 'react';
import useStore, { RFState } from './store';
import { shallow } from 'zustand/shallow';
import vscode from '../vscode';

export default function App() {
  const selector = (state: RFState) => ({
    loadGoalModel: state.loadGoalModel,
    setDiagnostics: state.setDiagnostics,
  });
  const { loadGoalModel, setDiagnostics } = useStore(selector, shallow);

  useEffect(() => {
    console.log('enviando ready...'); // aparece no DevTools da webview
    vscode.postMessage({ command: 'ready' });
  }, []);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      const msg = event.data;
      if (msg.command === 'load') {
        console.log('Received load in React editor:', msg);
        loadGoalModel(msg.content);
      } else if (msg.command === 'diagnostics') {
        console.log('Received diagnostics in React editor:', msg.diagnostics);
        setDiagnostics(msg.diagnostics);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [loadGoalModel, setDiagnostics]);

  return (
    <ReactFlowProvider>
      <Index />
    </ReactFlowProvider>
  );
}
