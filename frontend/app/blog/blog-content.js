'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { requestJson } from '../../lib/api';
import { PostList } from '../../components/post-list';
import { LoadingNotice, ErrorNotice, ExampleNote } from '../../components/states';

export default function BlogContent({ initialQuery }) {
  const router = useRouter();
  const [input, setInput] = useState(initialQuery);
  const query = initialQuery;
  const [posts, setPosts] = useState(null);
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    requestJson(`/api/posts?q=${encodeURIComponent(query)}`, { signal: controller.signal })
      .then(setPosts)
      .catch(failure => { if (failure.name !== 'AbortError') setError(failure.message); });
    return () => controller.abort();
  }, [query, attempt]);

  function search(event) {
    event.preventDefault();
    const value = input.trim();
    if (value === query) {
      setError(null); setPosts(null); setAttempt(attempt + 1);
    } else {
      router.push(value ? `/blog?q=${encodeURIComponent(value)}` : '/blog');
    }
  }

  return <div className="content-container page-content"><header className="page-heading"><p className="eyebrow">THE NOTEBOOK</p><h1>写下来，慢慢想。</h1><p>一些技术笔记，一些创作手记，也有日常的片刻。</p></header>
    <form className="search-form" onSubmit={search} role="search"><span aria-hidden="true" className="search-icon">⌕</span><label className="sr-only" htmlFor="article-search">搜索文章标题或摘要</label><input id="article-search" type="search" placeholder="搜索标题或摘要…" value={input} onChange={event => setInput(event.target.value)} maxLength={120} /><button className="button button-small" type="submit">搜索 <span aria-hidden="true">→</span></button></form>
    <div aria-live="polite" aria-atomic="true" className="search-summary">{posts && (query ? `“${query}” · 找到 ${posts.length} 篇文章` : `共 ${posts.length} 篇文章 · 按时间排列`)}</div>
    {error ? <ErrorNotice message={error} onRetry={() => { setError(null); setPosts(null); setAttempt(attempt + 1); }} /> : posts === null ? <LoadingNotice /> : posts.length ? <PostList posts={posts} /> : <div className="empty-state"><span aria-hidden="true">⌕</span><h2>还没有找到这页笔记</h2><p>试试「SQLite」「游戏」或更短的关键词。</p><button className="text-link" onClick={() => router.push('/blog')}>查看全部文章 →</button></div>}
    {posts?.some(post => post.is_example) && <ExampleNote>标注为示例的文章与日期仅用于预览，尚未替换为个人真实文章。</ExampleNote>}
  </div>;
}
