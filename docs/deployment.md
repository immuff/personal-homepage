# SSH 公网部署

目标服务器为 Ubuntu 24.04.2 LTS，SSH 用户 `admin`、端口 22。应用独立放置在 `/home/admin/personal-homepage`，公开仓库为 `https://github.com/immuff/personal-homepage`。

本次采用单台服务器部署：Nginx 监听 80 → Next.js 常规生产服务 127.0.0.1:3001 → Next.js rewrites → FastAPI 127.0.0.1:8001 → SQLite。前后端通过 systemd 常驻并在开机时启动；3001/8001 均只监听本机。

部署配置位于 `deploy/`，包含两个 systemd 服务和专用于 `8.134.172.39` 的 Nginx 站点。已有学习 Demo 的目录、8000 后端和默认 Nginx 文件保留；匹配此公网 IP 的访问会转到个人主页。

## 本机连接（PowerShell）

本机已有 SSH 密钥和服务器主机记录；实际验证无需额外的私钥文件参数。

```powershell
ssh.exe admin@8.134.172.39
```

## 服务器安装与构建（在 SSH 中执行）

实际环境已确认 Node.js 24.21.0、npm 11.19.0、Python 3.12.3 和 Nginx 已安装。新服务器需要先安装这些运行环境。

```bash
git clone --branch main https://github.com/immuff/personal-homepage.git /home/admin/personal-homepage
cd /home/admin/personal-homepage/backend
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
.venv/bin/python init_db.py
.venv/bin/python -m pip check

cd /home/admin/personal-homepage/frontend
npm ci
npm run build
```

## 安装服务及 Nginx 站点

```bash
cd /home/admin/personal-homepage
sudo install -m 644 deploy/personal-homepage-backend.service /etc/systemd/system/personal-homepage-backend.service
sudo install -m 644 deploy/personal-homepage-frontend.service /etc/systemd/system/personal-homepage-frontend.service
sudo systemd-analyze verify /etc/systemd/system/personal-homepage-backend.service /etc/systemd/system/personal-homepage-frontend.service
sudo systemctl daemon-reload
sudo systemctl enable --now personal-homepage-backend personal-homepage-frontend
sudo install -m 644 deploy/personal-homepage.nginx.conf /etc/nginx/sites-available/personal-homepage
sudo ln -s /etc/nginx/sites-available/personal-homepage /etc/nginx/sites-enabled/personal-homepage
sudo nginx -t
# 只有上一条配置检查成功后，才执行：
sudo systemctl reload nginx
```

初始化操作只补充缺失记录，不覆盖现有内容；网站更新通常不需要重新初始化数据库。

## 后续更新

先在本地将修改提交到 GitHub。服务器上执行：

```bash
cd /home/admin/personal-homepage
git pull --ff-only

cd backend
.venv/bin/python -m pip install -r requirements.txt
cd ../frontend
npm ci
npm run build
# 构建成功后再重启服务：
sudo systemctl restart personal-homepage-backend personal-homepage-frontend
```

SQLite 位于 `backend/data/content.db`，不在 Git 中，更新代码不会覆盖该文件。构建和重启期间，网站可能短暂不可用。首版不添加额外发布平台。

## 检查与日志

```bash
systemctl is-active personal-homepage-backend personal-homepage-frontend
systemctl is-enabled personal-homepage-backend personal-homepage-frontend
curl -I http://127.0.0.1:3001/
curl http://127.0.0.1:3001/api/posts?q=SQLite
curl -I http://127.0.0.1:3001/blog/does-not-exist
sudo journalctl -u personal-homepage-backend -u personal-homepage-frontend -n 60 --no-pager
sudo nginx -t
```

网站地址为 `http://8.134.172.39/`。本次先采用公网 IP 和 HTTP；域名与 HTTPS 尚未配置。实际部署验收结果见 [公网验收记录](public-verification.md)。

## 恢复原学习站点的公网入口

新站点的公网路由由独立的 `sites-enabled/personal-homepage` 链接控制。若需要将此 IP 的入口恢复到旧学习站点，先停用这个链接，再检查并重新加载 Nginx；旧默认站点文件没有被替换。

```bash
sudo unlink /etc/nginx/sites-enabled/personal-homepage
sudo nginx -t
# 检查成功后：
sudo systemctl reload nginx
```

这只调整公网入口，不删除个人主页源码和 SQLite 数据。

参考：[Next.js 自托管](https://nextjs.org/docs/app/guides/self-hosting)、[FastAPI 服务运行](https://fastapi.tiangolo.com/deployment/manually/)、[Nginx 代理配置](https://nginx.org/en/docs/http/ngx_http_proxy_module.html)。
