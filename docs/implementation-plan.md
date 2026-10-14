# 个人主页与博客 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** 在独立目录交付可以真实运行、读取 SQLite 的个人主页和博客。

**Architecture:** Next.js 常规服务代理 FastAPI。客户端通过相对 /api 请求，详情页面服务端同源读取确保 HTTP 404。Python sqlite3 直接查询，无 ORM 或额外数据层。

**Tech Stack:** Next.js、React、常规 CSS、react-markdown、remark-gfm、霞鹜文楷；Python 3.12、FastAPI、Uvicorn、SQLite。

**Spec:** docs/design.md

## Global Constraints

- 独立 frontend/backend；端口 3001/8001；保留现有 Demo。
- 六种固定色彩、霞鹜文楷、本地人物 PNG；未知个人事实明确标注示例。
- GET /api/profile、/api/posts?q=、/api/posts/{slug}、/api/projects。
- 只读首版，数据库维护内容，快速失败；不添加一次性抽象。

## Review Focus

- 搜索中的引号、%、_ 按字面处理且不执行 SQL。
- 不存在文章的 HTTP 404 与可用返回入口。
- 接口中断时明确显示错误并能重试。
- 本地数据库修改后刷新生效且重启保留。
- 手机宽度下长代码与图片不导致全页面横向溢出。

## Task 1：真实数据库和 API

Files: backend/schema.sql, seed.json, init_db.py, main.py, tests/test_api.py, requirements.txt, requirements-dev.txt。

Interfaces: profile JSON 文档；posts 列表摘要 / 单条含 content；projects 列表。

- [x] 写基于临时 SQLite 的契约、字面搜索、404、重复初始化与持久化测试；实际修正 Windows 文件句柄问题。
- [x] 初始化独立 Python 环境与直接依赖；实现 schema、明确示例种子、幂等插入、参数化查询及直接 JSON 响应。
- [x] 使用 unittest 跑完整后端测试，5 项通过。

## Task 2：页面与视觉

Files: frontend/app, components, lib/api.js, public, package.json, next.config.mjs。

Interfaces: 全部页面使用真实 API；fetch 禁用缓存；详情服务端调用 notFound。

- [x] 写共享 API 请求测试，先确认缺失实现失败，再确认错误不会转成假内容。
- [x] 配置 rewrites、生产服务、字体；实现导航、页脚、首页、搜索、Markdown、作品、关于与 404。
- [x] 接入用户确认的人物图；为示例作品绘制原创本地封面。
- [x] 3 项请求测试通过，生产构建通过；实际检查桌面 1280 与手机 390 宽度。

## Task 3：实际验收与交付

Files: README.md, docs/verification.md, .runtime。

- [x] 启动后端和生产前端，检查页面、代理、搜索、错误、404。
- [x] 修改数据库，验证浏览器刷新；实际重启后端验证持久化，再恢复验收修改。
- [x] 记录环境版本、实际检查及限制，提供 PowerShell 安装/初始化/开发与生产启动步骤。

本次按照用户“你先写别的”的指示，在当前会话直接实施，不创建额外工作树或提交用户已有修改。

最终复核：独立审查指出搜索状态与导航不一致，先在浏览器复现，再修正并复测全部搜索流程。证据与交付说明见 README.md 和 docs/verification.md。
