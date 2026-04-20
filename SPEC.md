# Personal Portfolio Website — Spec

## Overview

Steve Lin 的個人網站，定位為「作品展示 + 技術筆記」。
不強調求職，不強迫定位——真實呈現正在做什麼、正在研究什麼。

---

## Goals

- 展示個人專案（作品為主，履歷為輔）
- 提供 Blog 空間記錄研究筆記與技術心得
- 簡潔、快速、可持續維護
- 不需要完整就能上線，可以隨時間長大

---

## Tech Stack

| Layer      | Choice                     | Reason                              |
|------------|----------------------------|-------------------------------------|
| Framework  | Next.js 14 (App Router)    | SSG + SEO-friendly，熟悉的 stack    |
| Language   | TypeScript                 | Type safety                         |
| Styling    | Tailwind CSS + shadcn/ui   | 快速、一致的 UI                      |
| Content    | Contentlayer + MDX         | Blog/Project 頁面 type-safe 管理     |
| Animation  | Framer Motion              | 輕量 section fade-in                |
| Deployment | Vercel                     | Zero-config，free tier              |

---

## Design System

- **Color**: Blue accent（藍色主調），dark mode first，light mode toggle
- **Font**: Inter（body）+ JetBrains Mono（code block）
- **Layout**: Max-width 1200px，generous whitespace
- **Components**: shadcn/ui — Card, Badge, Button, Toggle

---

## Site Structure

```
/                        → Hero + 最新文章 + 精選作品
/projects                → 作品列表
/projects/[slug]         → 單一作品深度頁面
/blog                    → 文章列表
/blog/[slug]             → 單篇文章（MDX）
/about                   → 簡短自介 + 技術興趣 + 使用工具
```

---

## Pages & Sections

### `/` — Home

- **Hero**: 名字（Steve Lin）+ 一句話（不定位、不 tagline）→ 留空待定
- **Latest Posts**: 最新 2–3 篇 blog 文章卡片（有文章才顯示）
- **Featured Projects**: 精選 2–3 個作品卡片（tech badges + 簡述）
- 無 Contact form，無 CTA，保持乾淨

### `/projects` — Project Grid

每張 card 顯示：名字、一行描述、tech badges、GitHub link、screenshots

| Project              | Highlight                                          |
|----------------------|----------------------------------------------------|
| AI News Radar        | AI 新聞聚合 pipeline + Claude MCP server 整合       |
| LINE Bot Outfit Rec  | .NET 8，100% test coverage，天氣 API 整合           |
| Photo Album App      | Electron 桌面 app，WCAG 2.1，本地 SQLite storage   |

### `/projects/[slug]` — 作品深度頁面

以 AI News Radar 為模板，每個作品頁包含：

1. **Banner**: 名稱、簡述、GitHub link、tech badges
2. **What it does**: 3–4 bullet 說明功能
3. **Architecture**: 架構圖（ASCII 或 SVG）或 pipeline 示意
4. **Key Technical Decisions**: 重要技術選擇與原因（非教學，是決策記錄）
5. **Screenshots / Demo**: 本地截圖或錄製的 GIF
6. **Lessons Learned**: 2–3 條誠實的心得（踩坑、意外發現等）

> **AI News Radar 特別說明：**
> - 不公開部署爬蟲本體（Reddit ToS 風險）
> - 展示架構圖、scoring 演算法、MCP server 設計
> - 用本地截圖 / demo GIF 取代 live demo
> - GitHub repo 設為 public（code 本身無問題）

### `/blog` — 技術筆記列表

- 文章以 MDX 格式存放於 `content/blog/`
- 顯示：標題、日期、tag、一行摘要
- 初期可以為空，架構先建好

### `/blog/[slug]` — 單篇文章

- MDX 渲染（支援 code block、圖片、callout）
- Syntax highlight：`shiki`
- 顯示：標題、日期、預估閱讀時間、tag
- 無留言系統（保持簡單）

### `/about` — 關於我

- 幾句話介紹自己（非履歷格式）
- 技術興趣列表（語言、框架、AI 工具）
- 目前在研究什麼（可隨時更新的一段話）
- GitHub / Email 連結（不需要 contact form）

---

## Content Management

```
content/
├── blog/
│   └── (empty for now — add .mdx files when ready)
└── projects/
    ├── ai-news-radar.mdx
    ├── linebot.mdx
    └── photo-album.mdx
```

- 所有內容用 MDX 管理，Contentlayer 處理 type-safe frontmatter
- Frontmatter schema：

```yaml
# blog post
---
title: string
date: string (YYYY-MM-DD)
tags: string[]
summary: string
draft: boolean  # true = 不顯示在列表
---

# project
---
title: string
description: string
date: string
tags: string[]
github: string (url)
featured: boolean
---
```

---

## Security Checklist

- [ ] Email 不 hardcode 在 HTML（用 JS 組合或 Formspree）
- [ ] 無敏感內容（內部 URL、infra 細節）出現在公開頁面
- [ ] CSP headers 設定於 `next.config.ts`
- [ ] `npm audit` clean 後才 deploy
- [ ] `.env.local` 管理所有外部 API key

---

## SEO & Performance

- 所有頁面靜態生成（SSG）
- `next/image` 處理所有圖片
- 每頁 `generateMetadata()` 設定 OpenGraph
- Lighthouse 目標：95+ all categories

---

## Phases

### Phase 1a — Init & Layout
- [ ] `create-next-app` with TypeScript + Tailwind + App Router
- [ ] 安裝：shadcn/ui, Contentlayer, Framer Motion, shiki
- [ ] 全域 layout：Navbar（logo + nav links + dark toggle）、Footer
- [ ] 設定 Contentlayer schema（blog + project）

### Phase 1b — Home & About
- [ ] Home page：Hero + Featured Projects + Latest Posts（空白 graceful）
- [ ] `/about` page：自介 + 技術興趣
- [ ] Deploy to Vercel

### Phase 2 — Projects
- [ ] `/projects` grid page
- [ ] 3 個 project MDX 內容檔案（ai-news-radar, linebot, photo-album）
- [ ] `/projects/[slug]` 動態頁面
- [ ] AI News Radar：截圖 + 架構圖 + code snippets

### Phase 3 — Blog
- [ ] `/blog` 列表頁
- [ ] `/blog/[slug]` 文章頁（shiki syntax highlight）
- [ ] 寫第一篇文章（建議：AI News Radar 建造過程中的一個技術決策）

### Phase 4 — Polish
- [ ] Framer Motion：section fade-in
- [ ] SEO：OpenGraph image
- [ ] Mobile QA（375px / 768px / 1280px）
- [ ] Lighthouse audit & fix
