interface LogPanelProps {
  logs: string[]
}

export function LogPanel({ logs }: LogPanelProps) {
  return (
    <div className="lc-panel lc-log-panel">
      <div className="lc-panel-title">Console</div>
      {logs.length === 0 ? (
        <div className="lc-empty">No console output</div>
      ) : (
        <pre className="lc-log-body">{logs.join('\n')}</pre>
      )}
    </div>
  )
}
