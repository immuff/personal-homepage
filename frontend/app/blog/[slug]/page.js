import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ExampleNote } from '../../../components/states';

// 正文在服务端读取，令不存在的 slug 在发送页面前返回真正的 HTTP 404。
export const dynamic = 'force-dynamic';

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const origin = process.env.SITE_ORIGIN || 'http://127.0.0.1:3001';
  const response = await fetch(`${origin}/api/posts/${encodeURIComponent(slug)}`, { cache: 'no-store' });
  if (response.status === 404) notFound();
  if (!response.ok) throw new Error(`文章读取失败（HTTP ${response.status}）。请确认后端已启动。`);
  const post = await response.json();

  return <article className="article-container"><Link href="/blog" className="text-link back-link">← 返回文章列表</Link><header className="article-heading"><div className="post-meta"><time dateTime={post.published_at}>{post.published_at.replaceAll('-', '.')}</time><span className="meta-divider">/</span>{post.tags.map(tag => <span key={tag}>{tag}</span>)}</div><h1>{post.title}</h1><p>{post.excerpt}</p></header>
    {post.is_example && <ExampleNote>原创示例文章，用于展示阅读效果；日期不代表真实发表记录。</ExampleNote>}
    <div className="prose"><ReactMarkdown remarkPlugins={[remarkGfm]} components={{ a: ({ children, href }) => <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noreferrer' : undefined}>{children}</a>, table: ({ children }) => <div className="table-scroll"><table>{children}</table></div> }}>{post.content}</ReactMarkdown></div>
    <div className="article-end"><span aria-hidden="true">✧</span><p>谢谢你读到这里。</p><Link href="/blog" className="text-link">再翻一页笔记 →</Link></div>
  </article>;
}
