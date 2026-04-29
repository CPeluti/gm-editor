import React from 'react';

import { shallow } from 'zustand/shallow';
import useStore, { RFState } from '../store';

const selector = (state: RFState) => ({
  currentMode: state.currentMode,
  toggleCreationMode: state.toggleCreationMode,
  toggleConnection: state.toggleConnection,
  nodeType: state.nodeType,
  edgeType: state.edgeType,
});

export default function Sidebar() {
  const {
    currentMode,
    nodeType,
    edgeType,
    toggleCreationMode,
    toggleConnection,
  } = useStore(selector, shallow);
  return (
    <aside className="text-white p-4 flex flex-col gap-3">
      <button
        onClick={() => toggleCreationMode('Achieve')}
        className={`dndnode input ${currentMode == 'create' && nodeType == 'Achieve' ? 'bg-green-300' : 'bg-white'} text-black w-full h-10`}
      >
        Achieve
      </button>
      <button
        onClick={() => toggleCreationMode('Query')}
        className={`dndnode input ${currentMode == 'create' && nodeType == 'Query' ? 'bg-green-300' : 'bg-white'} text-black w-full h-10`}
      >
        Query
      </button>
      <button
        onClick={() => toggleCreationMode('Perform')}
        className={`dndnode input ${currentMode == 'create' && nodeType == 'Perform' ? 'bg-green-300' : 'bg-white'} text-black w-full h-10`}
      >
        Perform
      </button>
      <button
        onClick={() => toggleConnection('Or')}
        className={`dndnode input ${currentMode == 'edge' && edgeType == 'Or' ? 'bg-green-300' : 'bg-white'} text-black w-full h-10`}
      >
        Or Decomposition
      </button>
      <button
        onClick={() => toggleConnection('And')}
        className={`dndnode input ${currentMode == 'edge' && edgeType == 'And' ? 'bg-green-300' : 'bg-white'} text-black w-full h-10`}
      >
        And Decomposition
      </button>
    </aside>
  );
}
