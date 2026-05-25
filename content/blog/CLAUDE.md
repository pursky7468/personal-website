# Blog Content Rules

## Agents

Blog 工作流由三個 agent 分工：

| Agent | 職責 | 時機 |
|---|---|---|
| `web-content-publisher` | 來源文件 → `.mdx` + frontmatter + commit + push | 每次發佈 |
| `web-content-reviewer` | 內容完整性、準確性、無造假 | publisher 完成後自動接 |
| `web-layout-verifier` | Playwright 截圖、渲染/排版/亂碼檢查 | push 完成後 |

不要在主對話中直接寫 blog 內容，改用 `Agent` tool 並指定對應的 `subagent_type`。

## 標準發佈流程

```
1. Agent(web-content-publisher)  → 寫內容、轉 .mdx、commit、push
2. Agent(web-content-reviewer)   → 審核內容品質，回傳報告
3. Agent(web-layout-verifier)    → 等 Vercel 部署、截圖、檢查渲染
```

## 格式規範

- 副檔名一律 `.mdx`（不使用 `.md`）
- 若來源是 `.md`：建立 `.mdx` 後刪除原檔

### Frontmatter schema

```yaml
---
title: ""
date: YYYY-MM-DD
tags: []
summary: ""   # 一句話，≤160 chars
draft: false
---
```

## 版面驗證重點（web-layout-verifier 負責）

- 表格是否渲染為 HTML table（有框線），而非原始 `|` 字元
- Code block 是否有語法高亮
- 有無亂碼（`???`、方塊字、`â€` 等）
- 標題層級是否正確，排版是否易讀

### 常見問題

| 症狀 | 原因 | 修法 |
|---|---|---|
| 表格顯示原始 `\|` | `remark-gfm` 未啟用 | 確認 `contentlayer.config.ts` 有 `remarkPlugins: [remarkGfm]` |
| Code block 無高亮 | `rehype-pretty-code` 問題 | 確認 `rehypePlugins` 有 `rehypePrettyCode` |
| 中文變 `???` | PowerShell pipe encoding | 改用 `cmd /c '... < utf8file'`，不用 pipe |
