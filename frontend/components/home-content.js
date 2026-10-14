'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useProfile } from './site-context';
import { requestJson } from '../lib/api';
import { LoadingNotice, ErrorNotice, ExampleNote } from './states';
import { PostList } from './post-list';
import { ProjectCard } from './project-card';

export default function HomeContent() {
  const profile = useProfile();
  const [content, setContent] = useState(null);
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    Promise.all([requestJson('/api/posts', { signal: controller.signal }), requestJson('/api/projects', { signal: controller.signal })])
      .then(([posts, projects]) => setContent({ posts, projects }))
      .catch(failure => { if (failure.name !== 'AbortError') setError(failure.message); });
    return () => controller.abort();
  }, [attempt]);

  if (!profile) return <LoadingNotice />;

  return <>
    <section className="hero"><p className="eyebrow"><span className="little-line" />{profile.eyebrow}<span className="little-line" /></p><h1>{profile.headline}</h1><p className="hero-intro">{profile.intro}</p><div className="hero-actions"><Link className="button" href="/blog">读文章 <span aria-hidden="true">↗</span></Link><Link className="button button-outline" href="/projects">看作品 <span aria-hidden="true">↗</span></Link></div>
      <div className="portrait-stage"><span className="portrait-orbit" aria-hidden="true" /><span className="portrait-decoration decoration-left" aria-hidden="true">✧</span><img className="hero-portrait" src={profile.avatar_url} alt={`${profile.display_name}的 Q 版人物完整立绘`} fetchPriority="high" /><span className="portrait-decoration decoration-right" aria-hidden="true">✧</span><span className="portrait-ground" aria-hidden="true" /></div><p className="portrait-caption">{profile.portrait_caption}</p>
    </section>
    <div className="content-container">
      {error ? <ErrorNotice message={error} onRetry={() => { setError(null); setAttempt(attempt + 1); }} /> : !content ? <LoadingNotice /> : <>
        <section className="home-section"><div className="section-header"><div><p className="eyebrow">NOTES & THOUGHTS</p><h2>最近写下的</h2></div><Link className="text-link" href="/blog">全部文章 <span aria-hidden="true">→</span></Link></div><PostList posts={content.posts.slice(0, 3)} /></section>
        <section className="home-section"><div className="section-header"><div><p className="eyebrow">THINGS I'M MAKING</p><h2>想法，正在成为作品</h2></div><Link className="text-link" href="/projects">全部作品 <span aria-hidden="true">→</span></Link></div><div className="projects-grid">{content.projects.filter(project => project.featured).map(project => <ProjectCard key={project.id} project={project} />)}</div></section>
      </>}
      <section className="now-section"><div className="now-mark" aria-hidden="true">✳</div><div className="now-copy"><p className="eyebrow">NOW · <time dateTime={profile.now_date}>{profile.now_date.replaceAll('-', '.')}</time></p><h2>{profile.now_title}</h2><p>{profile.now_text}</p><Link className="text-link" href="/about">再多认识我一点 <span aria-hidden="true">→</span></Link></div></section>
      {profile.is_example && <ExampleNote>{profile.example_note}</ExampleNote>}
    </div>
  </>;
}
