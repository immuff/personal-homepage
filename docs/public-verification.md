# 公网部署验收

日期：2026-10-14（Asia/Shanghai）。网站地址：[http://8.134.172.39/](http://8.134.172.39/)。

## 已执行的部署

- 使用本机已有 SSH 密钥与已记录的主机密钥连接 `admin@8.134.172.39:22`，未上传 SSH 私钥。
- 实际服务器：Ubuntu 24.04.2 LTS、Node.js 24.21.0、npm 11.19.0、Python 3.12.3。
- 在 `/home/admin/personal-homepage` 克隆 GitHub 首版；原学习 Demo 的 `/home/admin/zero-to-tech` 目录和 8000 后端保留。
- 后端建立独立 `.venv`，安装直接依赖、初始化 SQLite；`pip check` 通过。
- 服务器上执行 `npm ci` 和 `npm run build`，Next.js 16.4.0 Linux 生产构建成功。
- 安装 `personal-homepage-backend.service` 和 `personal-homepage-frontend.service`；均为 `active` 和 `enabled`。
- 新应用实际只监听 `127.0.0.1:8001` 和 `127.0.0.1:3001`；公网通过 Nginx 80 端口访问。
- 单独新增 `server_name 8.134.172.39` 的 Nginx 站点；`nginx -t` 成功后重载。原默认 Nginx 文件保留。

## 实际公网检查

以下结果来自本机通过公网 IP 发出的请求：

| 检查 | 结果 |
| --- | --- |
| `/`、`/blog`、`/projects`、`/about` | HTTP 200 |
| 三篇示例文章正文 | HTTP 200 |
| `/blog/does-not-exist` | HTTP 404 |
| `/api/posts/does-not-exist` | HTTP 404 |
| `/api/profile` | 返回 SQLite 中的“小许的书桌”资料 |
| `/api/projects` | 返回 3 条作品记录 |
| `/api/posts?q=SQLite` | 返回 1 篇正确文章 |
| 人物 PNG | 公网响应 SHA-256 与本地原图一致 |

浏览器已显示实际公网首页与文章列表，点击首页“读文章”成功跳转；输入 `SQLite` 后可见“找到 1 篇文章”及对应正文链接。截图与请求证据保存在本地 `.runtime/public-homepage.png` 和 `.runtime/public-http-check.json`，不上传日志目录。

## 常驻与数据

实际重启了两个 systemd 服务，之后前端仍返回 200，SQLite 中的 3 篇文章仍在。重启后再次检查两个服务均为 `active` / `enabled`。旧学习 Demo 的 8000 监听仍保留。

没有重启整台服务器；开机自启结论基于 systemd 的 `enabled` 配置，不能视为已验证一次真实整机重启。

## 当前范围

- 公网 IP + HTTP；未配置域名与 HTTPS。
- 本机浏览器公网访问已验证；未在真实手机硬件、Safari、Firefox或不同地区网络逐一验证。
- 页面仍有明确标注的示例昵称、文章、作品与个人介绍；真实资料待后续替换。
- 首版是只读展示网站，SQLite 内容通过服务器本地维护；数据库未上传到 GitHub。

后续更新步骤见 [部署说明](deployment.md)。
