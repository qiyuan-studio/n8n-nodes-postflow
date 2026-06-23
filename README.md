# n8n-nodes-postflow

![n8n.io](https://img.shields.io/badge/n8n-node-blue.svg)

PostFlow AI 的 n8n 社区节点 — AI驱动的内容生成与多平台发布

## 功能

- **AI 内容生成** — 用 AI 自动生成适配各平台风格的内容
- **内容管理** — 创建、查看、管理社交媒体内容
- **一键发布** — 发布内容到 Twitter/X、Reddit、小红书、抖音
- **数据分析** — 获取跨平台数据洞察

## 安装

在自托管的 n8n 中:

```bash
npm install n8n-nodes-postflow
```

然后在 n8n 设置中启用社区节点。

## 使用方法

1. 从 PostFlow AI 仪表盘获取 API Key
2. 在 n8n 中创建 `PostFlow AI` 凭证
3. 将 `PostFlow AI` 节点添加到工作流
4. 选择操作（生成/创建/发布/分析）

## 许可证

MIT
