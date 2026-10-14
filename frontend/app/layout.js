import '@fontsource/lxgw-wenkai/500.css';
import '@fontsource/lxgw-wenkai/700.css';
import './globals.css';
import { ProfileProvider } from '../components/site-context';
import { Header, Footer } from '../components/site-shell';

export const metadata = {
  title: { default: '个人书桌 · 文字与作品', template: '%s · 个人书桌' },
  description: '一个慢慢生长的个人角落，以文字记录，以作品表达。',
};

export default function RootLayout({ children }) {
  return <html lang="zh-CN"><body><a className="skip-link" href="#main">跳到正文</a><ProfileProvider><Header /><main id="main">{children}</main><Footer /></ProfileProvider></body></html>;
}
