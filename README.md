# 个人主页与博客

温和的米白与青绿、霞鹜文楷、完整 Q 版人物，以及可以真实阅读、搜索的文章和作品。独立项目位于 `D:\zero-to-tech\personal-homepage`，原有学习 Demo 不依赖此项目。

这是已确认的首版源码基线，后续在此版本上改进。已通过 SSH 部署到 [公网主页](http://8.134.172.39/)，当前使用 HTTP。文案、文章和作品仍包含明确标注的示例内容。依赖目录、虚拟环境、本地数据库与运行日志不在仓库中；克隆后按下文安装并初始化即可运行。

## 公网部署

- 网站：[http://8.134.172.39/](http://8.134.172.39/)
- 前后端通过 systemd 常驻，Nginx 作为公网入口。
- SSH 连接：`ssh.exe admin@8.134.172.39`，默认 22 端口。
- 部署路径：`/home/admin/personal-homepage`。
- [部署、更新与日志查看](docs/deployment.md)
- [本次公网验收](docs/public-verification.md)

已发布学习笔记：[从消息积压开始，理解 Kafka](http://8.134.172.39/blog/kafka-from-backlog)。由站主提供的 Word 原稿整理，作为正式文章保存；个人资料与其他示例内容仍保留原有标记。

已发布随笔：[当自己不重要时，要悄悄离场吗？](http://8.134.172.39/blog/when-you-feel-unimportant)，收录于[随笔栏目](http://8.134.172.39/essays)。Word 原稿保留在本机，排版稿保存在 `content/essays/`；仅整理段落、标点与明显错字，移除两处未确认的引文提示。发布日期为本次网页发布日，不代表原稿写作日期。

已发布系列首篇：[Agent 与 RAG（一）：从提示词工程开始](http://8.134.172.39/blog/agent-rag-01-prompt-engineering)。整理稿位于 `content/agent-rag/01-prompt-engineering.md`，保留原 Word 文档；三张表和提示词模板已转成 Markdown。系列沿用「Agent 与 RAG」标题前缀及「Agent 与 RAG 系列」标签，[系列入口](http://8.134.172.39/blog?q=Agent%20%E4%B8%8E%20RAG)复用现有文章搜索。提示词压缩与裁剪仍为后续待展开问题。

已发布系列第二篇：[Agent 与 RAG（二）：用 LangGraph 理解多智能体协作](http://8.134.172.39/blog/agent-rag-02-langgraph-multi-agent)。沿用审核通过的正文，保留来源署名及 7 张原文配图；三个 Python 示例已在独立环境验证编排行为。整理稿和图片保存在 `content/agent-rag/`，编辑说明及发布记录见 [审核说明](docs/reviews/agent-rag-02-langgraph-multi-agent.md)。

已整理系列第三篇：[Agent 与 RAG（三）：从“RAG 已死”到检索方案选型](http://8.134.172.39/blog/agent-rag-03-retrieval-design)。正文位于 `content/agent-rag/03-rag-retrieval-design.md`，审校与发布状态见 [编辑记录](docs/reviews/agent-rag-03-retrieval-design.md)。服务器更新源码后，可运行 `backend/.venv/bin/python deploy/publish_rag_article.py` 单独发布本篇；脚本先备份数据库，保留其他内容，重复执行同稿不新增记录。公网发布仍待实际执行及验收。

## 当前可访问地址

已在本机后台启动生产前端和 FastAPI：

- 首页：http://127.0.0.1:3001/
- 文章：http://127.0.0.1:3001/blog
- 随笔：http://127.0.0.1:3001/essays
- 正文示例：http://127.0.0.1:3001/blog/from-page-to-database
- 作品：http://127.0.0.1:3001/projects
- 关于：http://127.0.0.1:3001/about
- API 文档：http://127.0.0.1:8001/docs

页面数据链路：浏览器请求相对 `/api` → Next.js rewrites → FastAPI → SQLite。文章详情在 Next.js 服务端通过同源 `/api` 代理取正文，以便不存在的文章返回真正的 HTTP 404。前端使用常规 `next dev` / `next build` / `next start`，没有静态导出。

## 目录

```text
personal-homepage/
├── frontend/               # 独立 package.json、package-lock.json、Next.js 配置
│   ├── app/                # 首页、blog、projects、about、404、错误页及 CSS
│   ├── components/         # 导航、头像、文章列表、作品卡片、加载和错误提示
│   ├── lib/api.js          # 共享请求；接口失败直接报错，不返回假数据
│   └── public/images/      # 用户 PNG 原图和原创示例封面
├── backend/
│   ├── .venv/              # 本项目独立虚拟环境
│   ├── main.py             # 只读 FastAPI 接口
│   ├── schema.sql          # SQLite 表结构
│   ├── seed.json           # 初始内容；示例资料与真实文章分别标记
│   ├── init_db.py          # 初始化表与缺失记录，保留已有修改
│   ├── requirements.txt    # 仅 FastAPI、Uvicorn 两项直接运行依赖
│   ├── requirements-dev.txt# 额外的接口测试依赖
│   ├── tests/test_api.py
│   └── data/content.db     # 实际 SQLite 数据库，不提交到 Git
├── docs/verification.md    # 实际验收记录与未验证部分
└── .runtime/               # 本次后台服务 PID、日志与验收截图；不提交到 Git
```

## 已核验环境

本机使用 Node.js **24.20.0**、npm **11.19.0** 和独立虚拟环境中的 Python **3.12.14**。Next.js 16.4.0、React 19.3.0；FastAPI 0.143.0、Uvicorn 0.54.0；实际安装后 `pip check` 通过。

本机默认 `python` 指向 Anaconda Python 3.9，下面的命令显式选择已验证的 Python 3.12，不修改原有 Python。其他机器可将 `$projectPython` 换为自己的 Python 3.12 完整路径。所有命令均适用于 Windows PowerShell；不需要激活虚拟环境或更改脚本执行策略。

## 首次安装与数据库初始化

当前机器已经安装并初始化；以下步骤用于重新准备环境。

```powershell
Set-Location 'D:\zero-to-tech\personal-homepage\frontend'
npm.cmd ci

Set-Location 'D:\zero-to-tech\personal-homepage\backend'
$projectPython = 'C:\Users\许楚烽\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe'
& $projectPython -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe init_db.py
```

`init_db.py` 会创建 `backend/data/content.db`，插入 1 条示例个人资料、3 篇示例文章、1 篇真实 Kafka 学习笔记、1 篇真实随笔、2 篇 Agent 与 RAG 系列笔记和 3 个示例作品。重复执行只补充缺失记录，不覆盖数据库中已有内容。服务启动不会自动初始化或重置数据库。

## 启动：两个 PowerShell 窗口

窗口一，后端：

```powershell
Set-Location 'D:\zero-to-tech\personal-homepage\backend'
.\.venv\Scripts\python.exe -m uvicorn main:app --host 127.0.0.1 --port 8001
```

窗口二，前端开发：

```powershell
Set-Location 'D:\zero-to-tech\personal-homepage\frontend'
npm.cmd run dev
```

生产模式使用以下命令替代开发命令：

```powershell
Set-Location 'D:\zero-to-tech\personal-homepage\frontend'
npm.cmd run build
npm.cmd start
```

前端固定 3001，后端固定 8001；开发服务和生产服务不能同时占用 3001。在这两个终端按 `Ctrl+C` 可停止自行启动的服务。

**当前后台服务已占用上述端口。** 若需要改用终端启动，先确认监听进程来自本项目再停止。PowerShell 查看方式：

```powershell
Get-NetTCPConnection -State Listen -LocalPort 3001,8001 |
  Select-Object LocalAddress,LocalPort,OwningProcess

# 将下列数字换成上一条命令中的实际 OwningProcess；先查看，再停止。
Get-CimInstance Win32_Process -Filter 'ProcessId = 12345' |
  Select-Object ProcessId,ParentProcessId,ExecutablePath,CommandLine

# 确认是本项目后，使用其实际进程号：
Stop-Process -Id 12345
```

Windows 虚拟环境的 `python.exe` 会启动底层 Python 子进程，8001 的监听进程可能显示底层 Python 路径。可按 `ParentProcessId` 查看父进程，确认其命令指向本项目 `backend\.venv\Scripts\python.exe`。`.runtime/backend.pid` 记录的是启动进程，前端 PID 在 `.runtime/frontend.pid`；日志也在同目录。

## 内容维护

运行中的内容以 **SQLite 数据库** 为准，修改后刷新页面即可生效，不需要重新构建前端；重启后端不会丢失修改。修改 `seed.json` 不会覆盖已经初始化的记录。

可以用本地 SQLite 编辑器直接编辑 `backend/data/content.db`。文章表 `posts` 的 `content` 是 Markdown，`tags` 是 JSON 数组；作品表 `projects` 的状态必须为「已完成」或「开发中」，链接可填写本站有效路径或真实外部地址。`profile.data` 是个人资料 JSON，联系方式 `contacts` 的格式是 `[{"label":"邮箱", "url":"mailto:真实邮箱"}]`。未提供真实联系方式时保持空数组，不使用虚构邮箱。

以下 PowerShell 示例直接修改文章标题，刷新 `/blog` 或正文即可看到新标题：

```powershell
Set-Location 'D:\zero-to-tech\personal-homepage\backend'
$env:PYTHONIOENCODING = 'utf-8'
@'
import sqlite3
from contextlib import closing

with closing(sqlite3.connect('data/content.db')) as db, db:
    db.execute(
        'UPDATE posts SET title = ? WHERE slug = ?',
        ('我的第一篇文章', 'a-small-place-on-the-web'),
    )
'@ | .\.venv\Scripts\python.exe -
```

写入本人真实资料或作品后，可将对应 `is_example` 改为 `false`（JSON）或 `0`（SQLite）。删除示例文章后也要同时更新指向它的示例项目链接。正式替换个人资料前，建议复制一份数据库保留备份。

如需另一个数据库文件，先初始化它，再启动时指定完整路径：

```powershell
.\.venv\Scripts\python.exe init_db.py --path 'D:\zero-to-tech\personal-homepage\backend\data\my-content.db'
$env:DATABASE_PATH = 'D:\zero-to-tech\personal-homepage\backend\data\my-content.db'
.\.venv\Scripts\python.exe -m uvicorn main:app --host 127.0.0.1 --port 8001
```

用户确认的 PNG 已保存为 `frontend/public/images/personal-avatar.png`。头像与首页完整立绘引用同一文件；以后替换这份 PNG 即可。三张 SVG 封面是原创示例概念插图，明确不作为实际项目截图。

## 接口

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/profile` | 从 SQLite 读取个人资料 |
| GET | `/api/posts` | 按日期倒序返回文章摘要 |
| GET | `/api/posts?q=SQLite` | 按标题或摘要搜索，最多 120 字 |
| GET | `/api/posts/{slug}` | Markdown 正文；不存在返回 404 |
| GET | `/api/projects` | 按排序字段返回作品及状态 |

搜索中的引号、百分号和下划线按字面处理。接口失败会显示错误，页面没有静默示例回退。前端与接口都禁用内容请求缓存。

## 测试

```powershell
Set-Location 'D:\zero-to-tech\personal-homepage\backend'
.\.venv\Scripts\python.exe -m pip install -r requirements-dev.txt
.\.venv\Scripts\python.exe -m unittest discover -s tests -v
.\.venv\Scripts\python.exe -m pip check

Set-Location 'D:\zero-to-tech\personal-homepage\frontend'
npm.cmd test
npm.cmd run build
```

接口测试使用临时数据库，不修改实际内容。当前 Starlette 的测试客户端会提示未来需将测试依赖 httpx 迁移到 httpx2；现有 7 项接口测试已通过，这条提示不影响网站运行。

## 资料边界与验收

昵称「小许」、个人介绍、兴趣、近况、文章日期和作品均有明确的示例标识。真实履历、获奖记录、指标、联系方式和外部作品地址尚未提供，未编造。

完成的实际验证及设备限制见 [验收记录](docs/verification.md)。视觉参考为 [李勃老师网站](https://xn--ygr25xpohxwz.com/)；代理实现参照 [Next.js rewrites](https://nextjs.org/docs/app/api-reference/config/next-config-js/rewrites)，后端数据方案参照 [FastAPI 数据库教程](https://fastapi.tiangolo.com/tutorial/sql-databases/)，本项目为当前只读范围直接使用标准库 sqlite3。
