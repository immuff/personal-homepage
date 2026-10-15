'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useProfile } from './site-context';

const navigation = [['/', '首页'], ['/blog', '文章'], ['/essays', '随笔'], ['/projects', '作品'], ['/about', '关于']];

export function Header() {
  const profile = useProfile();
  const pathname = usePathname();
  return <header className="site-header"><div className="header-inner">
    <Link href="/" className="site-brand" aria-label="回到首页">{profile ? <><span className="avatar-frame"><img src={profile.avatar_url} alt="" /></span><span>{profile.site_name}</span></> : <span className="brand-placeholder" aria-hidden="true" />}</Link>
    <nav aria-label="主导航">{navigation.map(([href, label]) => <Link key={href} href={href} aria-current={(href === '/' ? pathname === href : pathname.startsWith(href)) ? 'page' : undefined}>{label}</Link>)}</nav>
  </div></header>;
}

export function Footer() {
  const profile = useProfile();
  return <footer className="site-footer"><div className="footer-inner"><div><Link href="/" className="footer-brand">{profile?.site_name}</Link><p>{profile?.footer_note}</p></div><div className="footer-right"><Link href="/about">关于这个角落 <span aria-hidden="true">↗</span></Link><small>© {new Date().getFullYear()} {profile?.display_name} · 以文字记录，以作品表达</small></div></div></footer>;
}
