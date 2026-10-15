'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { requestJson } from '../../lib/api';
import { PostList } from '../../components/post-list';
import { LoadingNotice, ErrorNotice, ExampleNote } from '../../components/states';

export default function BlogContent({ initialQuery, essayMode = false }) {
  const router = useRouter();
  const route = essayMode ? '/essays' : '/blog';
  const noun = essayMode ? '随笔' : '文章';
  const [input, setInput] = useState(initialQuery);
  const query = initialQuery;
  const [posts, setPosts] = useState(null);
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    requestJson(`/api/posts?q=${encodeURIComponent(query)}`, { signal: controller.signal })
      .then(records => setPosts(essayMode ? records.filter(post => post.tags.includes('随笔')) : records))
      .catch(failure => { if (failure.name !== 'AbortError') setError(failure.message); });
    return () => controller.abort();
  }, [query, attempt, essayMode]);

  function search(event) {
    event.preventDefault();
    const value = input.trim();
    if (value === query) {
      setError(null); setPosts(null); setAttempt(attempt + 1);
    } else {
      router.push(value ? `${route}?q=${encodeURIComponent(value)}` : route);
    }
  }

  return <div className="content-container page-content"><header className="page-heading"><p className="eyebrow">{essayMode ? 'ESSAYS & MOMENTS' : 'THE NOTEBOOK'}</p><h1>{essayMode ? '在日常里，慢慢想。' : '写下来，慢慢想。'}</h1><p>{essayMode ? '关于关系、自我，和生活里值得停下来想一想的片刻。' : '一些技术笔记，一些创作手记，也有日常的片刻。'}</p></header>
    <nav className="category-tabs" aria-label="文章分类"><Link href="/blog" aria-current={!essayMode ? 'page' : undefined}>全部文章</Link><Link href="/essays" aria-current={essayMode ? 'page' : undefined}>随笔</Link></nav>
    <form className="search-form" onSubmit={search} role="search"><span aria-hidden="true" className="search-icon">⌕</span><label className="sr-only" htmlFor="article-search">搜索文章标题或摘要</label><input id="article-search" type="search" placeholder="搜索标题或摘要…" value={input} onChange={event => setInput(event.target.value)} maxLength={120} /><button className="button button-small" type="submit">搜索 <span aria-hidden="true">→</span></button></form>
    <div aria-live="polite" aria-atomic="true" className="search-summary">{posts && (query ? `“${query}” · 找到 ${posts.length} 篇${noun}` : `共 ${posts.length} 篇${noun} · 按时间排列`)}</div>
    {error ? <ErrorNotice message={error} onRetry={() => { setError(null); setPosts(null); setAttempt(attempt + 1); }} /> : posts === null ? <LoadingNotice /> : posts.length ? <PostList posts={posts} /> : <div className="empty-state"><span aria-hidden="true">⌕</span><h2>还没有找到这页{essayMode ? '随笔' : '笔记'}</h2><p>换一个关键词，或回到列表看看。</p><button className="text-link" onClick={() => router.push(route)}>查看全部{noun} →</button></div>}
    {posts?.some(post => post.is_example) && <ExampleNote>标注为示例的文章与日期仅用于预览，尚未替换为个人真实文章。</ExampleNote>}
  </div>;
}
