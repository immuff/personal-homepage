import Link from 'next/link';

export function PostList({ posts }) {
  return <div className="post-list">{posts.map((post, index) => <Link className="post-row" href={`/blog/${post.slug}`} key={post.slug}>
    <span className="post-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
    <div className="post-copy"><div className="post-meta"><time dateTime={post.published_at}>{post.published_at.replaceAll('-', '.')}</time><span className="meta-divider">/</span>{post.tags.map(tag => <span key={tag}>{tag}</span>)}{post.is_example && <span className="sample-label">示例</span>}</div><h3>{post.title}</h3><p>{post.excerpt}</p></div>
    <span className="row-arrow" aria-hidden="true">↗</span>
  </Link>)}</div>;
}
