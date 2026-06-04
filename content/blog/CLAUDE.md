# Blog Content Rules

## Agents

Blog 工作流遵循 `~/.claude/rules/frontend-publish.md` 的 4 步驟標準流程。

- Publisher: `subagent_type: web-content-publisher`
- Reviewer: `subagent_type: web-content-reviewer`
- Config: `blog-publish.config.json`（專案根目錄）

不要在主對話中直接寫 blog 內容，改用 `Agent` tool 並指定對應的 `subagent_type`。

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

## Reviewer 必查項目

除格式外，reviewer **必須**檢查以下內容，任何一項 FAIL 就整體 FAIL：

- **素材可溯性**：所有第一人稱經驗描述（「我發現…」「有一次…」「實踐後…」）必須能對應到 publisher 收到的素材。無法對應的一律視為虛構，標為 FAIL。
- **無捏造事實**：不可有未發生的使用經驗、未存在的測試結果、未實際觀察到的數據。

## 版面驗證重點

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
