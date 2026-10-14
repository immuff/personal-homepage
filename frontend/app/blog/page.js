import BlogContent from './blog-content';

export const metadata = { title: '文章' };
export default async function BlogPage({ searchParams }) {
  const { q = '' } = await searchParams;
  const query = typeof q === 'string' ? q.slice(0, 120) : '';
  return <BlogContent key={query} initialQuery={query} />;
}
