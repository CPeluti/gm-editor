import React from "react";

import { shallow } from "zustand/shallow";
import useStore, { RFState } from "../store";

const selector = (state: RFState) => ({
  currentMode: state.currentMode,
  toggleCreationMode: state.toggleCreationMode,
  toggleConnection: state.toggleConnection,
  nodeType: state.nodeType,
});

export default () => {
  const { currentMode, nodeType, toggleCreationMode, toggleConnection } =
    useStore(selector, shallow);
  return (
    <aside className="text-white p-4">
      <div className="description">
        You can drag these nodes to the pane on the right.
      </div>
      <button
        onClick={() => toggleCreationMode("achieve")}
        className={`dndnode input ${currentMode == "create" && nodeType == "achieve" ? "bg-green-300" : "bg-white"} text-black w-full h-10`}
      >
        Achieve
      </button>
      <button
        onClick={() => toggleCreationMode("query")}
        className={`dndnode input ${currentMode == "create" && nodeType == "query" ? "bg-green-300" : "bg-white"} text-black w-full h-10`}
      >
        Query
      </button>
      <button
        onClick={() => toggleCreationMode("perform")}
        className={`dndnode input ${currentMode == "create" && nodeType == "perform" ? "bg-green-300" : "bg-white"} text-black w-full h-10`}
      >
        Perform
      </button>
      <button
        onClick={toggleConnection}
        className={`dndnode input ${currentMode != "edge" ? "bg-white" : "bg-green-300"} text-black w-full h-10`}
      >
        Decomposition
      </button>
    </aside>
  );
};
