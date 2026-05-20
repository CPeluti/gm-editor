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
  });
  const { loadGoalModel } = useStore(selector, shallow);

  // webview-ui/src/App.tsx

  // const handleSave = (content: string) => {
  //   // Enviar para a extensão
  //   vscode.postMessage({
  //     command: 'save',
  //     content,
  //     path: '/meu-arquivo.txt',
  //   });
  // };

  // Receber mensagens da extensão

  useEffect(() => {
    console.log('enviando ready...'); // aparece no DevTools da webview
    vscode.postMessage({ command: 'ready' });
  }, []);
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      const msg = event.data;
      if (msg.command === 'load') {
        console.log(msg);
        loadGoalModel(msg.content);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  return (
    <ReactFlowProvider>
      <Index />
    </ReactFlowProvider>
  );
}
