export function LoadingNotice() {
  return <div className="loading-notice" role="status"><span className="loading-dot" />正在翻开这一页…</div>;
}

export function ErrorNotice({ message, onRetry }) {
  return <div className="error-notice" role="alert"><p className="eyebrow">暂时没能读取内容</p><p>{message}</p><button className="button button-small" onClick={onRetry}>重新读取 <span aria-hidden="true">↻</span></button></div>;
}

export function ExampleNote({ children }) {
  return <p className="example-note"><span>示例内容</span>{children}</p>;
}
