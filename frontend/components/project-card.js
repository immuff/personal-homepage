import Link from 'next/link';

export function ProjectCard({ project }) {
  return <article className="project-card"><div className="project-image"><img src={project.image_url} alt={`${project.name}${project.is_example ? '原创示例概念插图' : '作品封面'}`} loading="lazy" /><span className={`project-status ${project.status === '开发中' ? 'in-progress' : ''}`}><i aria-hidden="true" />{project.status}</span></div>
    <div className="project-copy"><div className="project-category">{project.category}{project.is_example && <span>示例项目</span>}</div><h3>{project.name}</h3><p>{project.description}</p><div className="project-tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
      <Link className="text-link" href={project.url} target={project.url.startsWith('http') ? '_blank' : undefined} rel={project.url.startsWith('http') ? 'noreferrer' : undefined}>{project.link_label} <span aria-hidden="true">↗</span></Link>
    </div></article>;
}
