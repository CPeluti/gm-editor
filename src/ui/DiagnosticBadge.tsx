import { useState } from 'react';

interface DiagnosticBadgeProps {
  error?: 'none' | 'warning' | 'error';
  errorMessage?: string;
  diagnostics?: string[];
}

export default function DiagnosticBadge({
  error,
  errorMessage,
  diagnostics,
}: DiagnosticBadgeProps) {
  const [isHovered, setIsHovered] = useState(false);

  if (!error || error === 'none') {
    return null;
  }

  const isError = error === 'error';
  const badgeColor = isError ? '#ef4444' : '#eab308';
  const badgeHoverColor = isError ? '#dc2626' : '#ca8a04';

  const messages: string[] =
    diagnostics && diagnostics.length > 0
      ? diagnostics
      : errorMessage
        ? errorMessage.split('\n')
        : [isError ? 'Erro de validação' : 'Aviso de validação'];

  return (
    <div
      style={{
        position: 'absolute',
        top: -7,
        right: -7,
        zIndex: 60,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: '50%',
          backgroundColor: isHovered ? badgeHoverColor : badgeColor,
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 12,
          fontWeight: 700,
          fontFamily:
            'var(--vscode-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.4)',
          cursor: 'pointer',
          userSelect: 'none',
          transition: 'background-color 0.15s ease, transform 0.15s ease',
          transform: isHovered ? 'scale(1.1)' : 'scale(1)',
        }}
      >
        !
      </div>

      {isHovered && (
        <div
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 6px)',
            right: 0,
            width: 'max-content',
            maxWidth: 340,
            minWidth: 220,
            backgroundColor:
              'var(--vscode-editorHoverWidget-background, #252526)',
            border:
              '1px solid var(--vscode-editorHoverWidget-border, #454545)',
            color: 'var(--vscode-editorHoverWidget-foreground, #cccccc)',
            borderRadius: 3,
            padding: '8px 12px',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
            pointerEvents: 'none',
            textAlign: 'left',
            fontFamily:
              'var(--vscode-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              marginBottom: 6,
              paddingBottom: 4,
              borderBottom:
                '1px solid var(--vscode-editorHoverWidget-border, #3c3c3c)',
              fontWeight: 600,
              fontSize: 11,
              color: isError ? '#f87171' : '#facc15',
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                backgroundColor: badgeColor,
                display: 'inline-block',
              }}
            />
            <span>
              {isError ? 'Erro de Validação (LSP)' : 'Aviso de Validação (LSP)'}
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  fontSize: 12,
                  lineHeight: '1.4',
                  color: 'var(--vscode-editorHoverWidget-foreground, #cccccc)',
                  wordBreak: 'break-word',
                  whiteSpace: 'normal',
                }}
              >
                {messages.length > 1 ? `• ${msg}` : msg}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

