import { shallow } from 'zustand/shallow';
import useStore, { RFState } from '../store';

const selector = (state: RFState) => ({
  currentMode: state.currentMode,
  toggleCreationMode: state.toggleCreationMode,
  toggleConnection: state.toggleConnection,
  nodeType: state.nodeType,
  edgeType: state.edgeType,
  diagnostics: state.diagnostics,
});

export default function Sidebar() {
  const {
    currentMode,
    nodeType,
    edgeType,
    toggleCreationMode,
    toggleConnection,
    diagnostics,
  } = useStore(selector, shallow);

  const errorsCount = diagnostics.filter((d) => d.severity === 'error').length;
  const warningsCount = diagnostics.filter(
    (d) => d.severity === 'warning',
  ).length;

  return (
    <aside
      className="text-white p-4 flex flex-col gap-3 overflow-y-auto"
      style={{
        backgroundColor: 'var(--vscode-editor-background)',
        width: 280,
        minWidth: 280,
        borderLeft: '1px solid var(--vscode-widget-border, #333)',
      }}
    >
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

      <div className="mt-4 border-t border-gray-700 pt-3 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-sm">Diagnósticos LSP</span>
          <span className="text-xs px-2 py-0.5 rounded bg-gray-800">
            {errorsCount} erros, {warningsCount} avisos
          </span>
        </div>

        {diagnostics.length === 0 ? (
          <div className="text-xs text-green-400 mt-1">✓ Modelo Válido</div>
        ) : (
          <div className="flex flex-col gap-2 max-h-72 overflow-y-auto mt-1">
            {diagnostics.map((diag, index) => {
              const isError = diag.severity === 'error';
              return (
                <div
                  key={index}
                  className={`p-2 rounded text-xs border ${isError
                      ? 'border-red-500 bg-red-950/40 text-red-200'
                      : 'border-yellow-500 bg-yellow-950/40 text-yellow-200'
                    }`}
                >
                  <div className="font-semibold flex items-center gap-1">
                    <span>{isError ? '✕' : '⚠'}</span>
                    <span>{isError ? 'Erro' : 'Aviso'}</span>
                    {diag.range && (
                      <span className="text-[10px] opacity-70 ml-auto">
                        Linha {diag.range.start.line + 1}
                      </span>
                    )}
                  </div>
                  <div className="mt-1 break-words">{diag.message}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}
