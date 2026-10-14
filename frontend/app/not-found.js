import Link from 'next/link';

export default function NotFound() {
  return <div className="not-found content-container"><p className="eyebrow">404 · A MISSING PAGE</p><span className="not-found-mark" aria-hidden="true">⌑</span><h1>这一页，还没有写下。</h1><p>文章可能已移走，或者地址有一点偏差。<br />回到书桌边，看看其他笔记吧。</p><Link className="button" href="/blog">返回文章列表 →</Link></div>;
}
