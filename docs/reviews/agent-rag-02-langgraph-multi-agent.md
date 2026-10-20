# LangGraph 与多智能体文章：审核说明

审核稿整理日期：2026-10-20。用户已审核通过，并于 2026-10-20 授权发布；发布沿用审核通过的正文与 7 张配图。

## 发布信息

- 标题：Agent 与 RAG（二）：用 LangGraph 理解多智能体协作。
- 正文：`content/agent-rag/02-langgraph-multi-agent.md`。
- 文章标识：`agent-rag-02-langgraph-multi-agent`。
- 标签：Agent 与 RAG 系列、LangGraph、Multi-Agent、学习笔记。
- 摘要：从状态图、条件路由、并发合并和人工审核出发，理解 LangGraph 的执行机制，再比较 Supervisor、Handoffs 与自定义多智能体工作流。
- 网页发布日期：2026-10-20，不代表原文的写作日期。
- 正文地址：http://8.134.172.39/blog/agent-rag-02-langgraph-multi-agent。

## 内容的保留与删减

原稿是用户提供的 `D:\zero-to-tech\多智能体核心架构及LangGraph框架.md`，其来源标注为「腾讯云开发者」、作者贾岱、2025-12-16 发布。原稿和 `wx_article_images` 中的素材保持不变。正文保留来源署名和原文链接，按学习整理呈现。

保留主线：State／Node／Edge／Reducer、条件路由、Send／Command、检查点与人工审核、Supervisor／Swarm／Handoffs、上下文传递。子图、MCP、运行时上下文、缓存和重试收束为能力定位，避免在一篇文章中展开所有工具的安装与使用。

删除或缩写：

- Java、LangChain4j、LangGraph4j 的完整教程与原作者团队技术栈叙述；本篇专注 Python 编排机制。
- GitHub 热度、泛化的能力赞誉和未经本次验证的效果表述。
- 关注引导、抽奖、活动信息、二维码和无关推广图。
- 大量运行截图、重复模型配置、航空和酒店预订的长 Prompt。
- 原文中被压成一行、缺少完整上下文的代码；改为三个完整的本地机制示例。

保留 40 张原始图片中的 7 张。它们均从本地原图复制，未修改像素；每张都有图注，并可点击查看原图。

| 原文件 | 审核稿中的名称 | 用途 |
| --- | --- | --- |
| 373e103f2bd3.png | state-graph.png | 节点与边 |
| a3d366a9c943.png | send-map-reduce.png | Send 与并发分发 |
| c0f7365c10de.png | interrupt-resume.png | 人工审核与恢复时序 |
| 65f862471754.png | multi-agent-patterns.png | 架构拓扑总览 |
| ee08455d57f2.png | supervisor.png | 主管模式 |
| 3c6d85d45cbe.png | swarm-handoffs.png | 专家交接 |
| 71e993a4e2c5.png | agent-context.png | 不同的上下文传递方式 |

## 重要技术修正

| 原稿容易造成的理解 | 本稿处理 |
| --- | --- |
| 下一个节点的 State 等于上一个节点返回的整个字典 | 按字段应用更新；未返回字段保留，字典字段的内部键也不会默认深度合并 |
| 并发覆盖更新可以看作后写覆盖前写 | 并发写同一个普通字段可能发生更新冲突；需要明确 Reducer |
| 幂等就是相同输入得到相同输出 | 改为重复执行不产生额外业务效果，与确定性区分 |
| 配置内存检查点即可在进程重启后恢复 | 明确 InMemorySaver 保存在 RAM；重启恢复需要持久化实现 |
| 每个节点都会保存全部变量，任意位置都能恢复 | 明确检查点主要对应 super-step 边界及图状态，不是任意代码位置的完整进程快照 |
| 恢复从 interrupt 后的语句直接续跑 | 明确节点从开头重跑，中断前的副作用可能重复 |
| Command 会替代原有固定出边 | 明确动态路由与已有普通出边可能同时执行 |
| recursion_limit 是模型循环次数，默认一直为 25 | 按当前文档解释为 super-step 限制，显式配置，不传播旧默认值 |
| 使用 create_react_agent 作为新项目统一入口 | 标注 v1 弃用与 create_agent 迁移入口；核心示例用 StateGraph |
| langgraph-supervisor 的旧教程可以直接作为当前推荐实现 | 记录核对日的归档状态与 README 中的工具调用模式建议 |
| 共享完整推理数据等于可获得模型全部内部推理 | 明确可见消息、工具结果和任务说明的边界 |

原稿中的 `retry=`、`Command(goto="END")` 等旧片段未原样收入正文。示例使用真实导入的 `END` 常量；重试机制只保留概念位置，不补一段缺少业务场景的防御性代码。

## 已完成的验证

在 `.runtime/langgraph-review-venv` 中安装并使用 Python 3.12.14、LangGraph 1.2.16，未修改网站运行依赖。

- 条件路由：有资料与无资料两条分支均实际执行，原问题字段保留。
- Send：两项、三项任务的结果均汇总成功；不依赖并发结果顺序。
- 人工审核：首次调用暂停；通过与拒绝分别恢复为 True 和 False。
- 7 张选用图与原图的 SHA-256 一致。

三个示例验证的是编排行为，尚未测试真实模型、向量检索、付费工具、生产数据库检查点或多智能体任务效果。

已检查本地审核页在 1280×900 桌面宽度及 390×844 手机宽度下的显示：正文无整页横向溢出，7 张图全部加载并适应正文宽度，长代码在代码块内独立横向滚动；已实际点击原图链接及整理说明导航。以上为独立审核页的验收记录。用户已确认发布，正式网站的入库、部署和公网验收另见下方发布记录。

## 正式网站接入记录

2026-10-20 用户确认后，已将审核稿作为正式文章接入本机 SQLite，并加入初始化数据。正文仅把图片相对路径转换为网站路径，没有改写审核通过的内容。7 张图片在 `frontend/public/images/posts/agent-rag-02/` 中保留相同字节；不增加网站依赖。

本机已备份数据库，仅新增本篇，其他文章、资料和作品记录保持不变。现有 7 项后端测试、3 项前端测试以及 Next.js 生产构建通过。通过 3001 正式服务检查：文章与初始化记录一致；LangGraph 搜索返回本篇，系列搜索返回两篇；7 张图片均返回 200 且文件哈希一致。正式阅读页在 1280×900 与 390×844 下无整页横向溢出，长代码独立滚动，配图加载和原图点击正常。

公网部署与验收结果在完成后补充。

## 来源核对范围

原文网页本次无法通过检索工具打开，作者、公众号和日期依据用户提供的本地 MD 保留。技术内容以本地原稿和以下已读取的官方资料交叉核对：

- [LangGraph 概述](https://docs.langchain.com/oss/python/langgraph/overview)
- [Graph API](https://docs.langchain.com/oss/python/langgraph/graph-api)
- [并发更新错误](https://docs.langchain.com/oss/python/langgraph/errors/INVALID_CONCURRENT_GRAPH_UPDATE)
- [持久化](https://docs.langchain.com/oss/python/langgraph/persistence)
- [检查点](https://docs.langchain.com/oss/python/langgraph/checkpointers)
- [中断与恢复](https://docs.langchain.com/oss/python/langgraph/interrupts)
- [多智能体](https://docs.langchain.com/oss/python/langchain/multi-agent)
- [Subagents](https://docs.langchain.com/oss/python/langchain/multi-agent/subagents)
- [Handoffs](https://docs.langchain.com/oss/python/langchain/multi-agent/handoffs)
- [v1 迁移](https://docs.langchain.com/oss/python/migrate/langgraph-v1)
- [Supervisor 仓库说明](https://github.com/langchain-ai/langgraph-supervisor-py)
