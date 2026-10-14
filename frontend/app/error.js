'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function PageError({ error, reset }) {
  useEffect(() => { console.error(error); }, [error]);
  return <div className="not-found content-container"><p className="eyebrow">内容读取失败</p><h1>暂时没能翻开这一页。</h1><p>读取文章时遇到了网络或服务错误。<br />请确认后端正在运行，然后重试。</p><button className="button" onClick={reset}>重新读取 ↻</button><Link className="text-link error-back" href="/blog">返回文章列表 →</Link></div>;
}
