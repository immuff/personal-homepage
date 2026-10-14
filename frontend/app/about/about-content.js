'use client';

import { useProfile } from '../../components/site-context';
import { LoadingNotice, ExampleNote } from '../../components/states';

export default function AboutContent() {
  const profile = useProfile();
  if (!profile) return <LoadingNotice />;
  return <div className="content-container page-content"><header className="page-heading"><p className="eyebrow">BEHIND THE PAGES</p><h1>{profile.about_title}</h1><p>文字之外，作品之后。</p></header>
    <div className="about-intro"><div className="about-portrait"><img src={profile.avatar_url} alt={`${profile.display_name}的 Q 版人物`} /><p>{profile.portrait_caption}</p></div><div className="about-text"><h2>你好，我是{profile.display_name}。</h2>{profile.about_paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div></div>
    <div className="about-columns"><section><p className="eyebrow">LITTLE JOYS</p><h2>喜欢的事情</h2><div className="interest-tags">{profile.interests.map(interest => <span key={interest}>{interest}</span>)}</div></section><section><p className="eyebrow">LEARNING & MAKING</p><h2>正在学习与制作</h2><ul>{profile.learning.map(item => <li key={item}>{item}</li>)}</ul></section></div>
    <section className="about-detail"><h2>沿途的经历</h2><p>{profile.experience_note}</p></section><section className="about-detail"><h2>保持联系</h2><p>{profile.contact_note}</p><div className="contact-links">{profile.contacts.map(contact => <a className="text-link" key={contact.url} href={contact.url}>{contact.label} ↗</a>)}</div></section>
    {profile.is_example && <ExampleNote>{profile.example_note}</ExampleNote>}
  </div>;
}
