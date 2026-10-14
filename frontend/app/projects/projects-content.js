'use client';

import { useEffect, useState } from 'react';
import { requestJson } from '../../lib/api';
import { ProjectCard } from '../../components/project-card';
import { LoadingNotice, ErrorNotice, ExampleNote } from '../../components/states';

export default function ProjectsContent() {
  const [projects, setProjects] = useState(null);
  const [category, setCategory] = useState('全部');
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    requestJson('/api/projects', { signal: controller.signal }).then(setProjects)
      .catch(failure => { if (failure.name !== 'AbortError') setError(failure.message); });
    return () => controller.abort();
  }, [attempt]);
  return <div className="content-container page-content"><header className="page-heading"><p className="eyebrow">THE WORKBENCH</p><h1>把想法，做成小东西。</h1><p>工具、游戏和其他创作。有些已经落地，有些还在生长。</p></header>
    <div className="category-tabs" aria-label="作品类别">{['全部', '工具', '游戏', '其他创作'].map(item => <button key={item} onClick={() => setCategory(item)} aria-pressed={category === item}>{item}</button>)}</div>
    {error ? <ErrorNotice message={error} onRetry={() => { setError(null); setAttempt(attempt + 1); }} /> : !projects ? <LoadingNotice /> : <div className="projects-grid">{projects.filter(project => category === '全部' || project.category === category).map(project => <ProjectCard key={project.id} project={project} />)}</div>}
    {projects?.some(project => project.is_example) && <ExampleNote>示例项目用于预览分类与状态，封面是概念插图；链接通向本站有效页面，不代表已有成品或发布成果。</ExampleNote>}
  </div>;
}
