import { ReactFlowProvider } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "./App.css";
import Index from "./index";

export default function App() {
  return (
    <ReactFlowProvider>
      <Index />
    </ReactFlowProvider>
  );
}
