import BlogContent from '../blog/blog-content';

export const metadata = {
  title: '随笔',
  description: '关于关系、自我，和生活里值得停下来想一想的片刻。',
};

export default async function EssaysPage({ searchParams }) {
  const { q = '' } = await searchParams;
  const query = typeof q === 'string' ? q.slice(0, 120) : '';
  return <BlogContent key={query} initialQuery={query} essayMode />;
}
