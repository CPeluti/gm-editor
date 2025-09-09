import React from 'react';
 
import { shallow } from 'zustand/shallow';
import useStore, { RFState } from '../store';

const selector = (state: RFState) => ({
  currentMode: state.currentMode,
  toggleCreationMode: state.toggleCreationMode,
  toggleConnection: state.toggleConnection
});


export default () => {
  const { currentMode, toggleCreationMode, toggleConnection } = useStore(selector, shallow);
  return (
    <aside className="text-white p-4">
      <div className="description">You can drag these nodes to the pane on the right.</div>
      <button onClick={toggleCreationMode} className={`dndnode input ${currentMode != "create" ? "bg-white" : "bg-green-300"} text-black w-full h-10`}>
        Goal
      </button>
      <button onClick={toggleConnection} className={`dndnode input ${currentMode != "edge" ? "bg-white" : "bg-green-300"} text-black w-full h-10`}>
        Decomposition
      </button>
    </aside>
  );
};