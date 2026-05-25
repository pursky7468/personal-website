# Blog Content Rules

## Agent

所有 blog 文章的新增、修改、發佈，一律使用 **personal-web-updater** agent 處理。
不要在主對話中直接寫 blog 內容，改用 `Agent` tool 並指定 `subagent_type: "personal-web-updater"`。

## 格式

- 副檔名一律使用 `.mdx`（不使用 `.md`）
- 每篇文章必須包含完整 frontmatter：

```yaml
---
title: ""
date: YYYY-MM-DD
tags: []
summary: ""
draft: false
---
```

## 發佈流程

1. personal-web-updater agent 將來源文件轉換為 `.mdx` 並加上 frontmatter
2. 若來源為 `.md`，建立 `.mdx` 後刪除原始 `.md` 檔
3. commit message 格式：`content: <一行說明>`
4. commit 後立即 push 到 remote
5. push 完成後，**主對話**執行版面驗證（見下方）

## 版面驗證（push 後必做）

personal-web-updater agent **無法**執行 Playwright，版面驗證由**主對話**負責。

### 步驟

**Step 1** — 等待 Vercel 部署完成（約 60–90 秒）：

```powershell
$start = Get-Date
do { Start-Sleep -Seconds 10; $elapsed = ((Get-Date) - $start).TotalSeconds } while ($elapsed -lt 90)
```

**Step 2** — 用 Playwright 截全頁圖：

```powershell
npx playwright screenshot --browser chromium --full-page "https://personal-website-pursky7468s-projects.vercel.app/blog/<slug>" "C:\Users\User\AppData\Local\Temp\blog-verify-<slug>.png"
```

**Step 3** — Read 截圖，目視確認：

- 表格是否渲染為 HTML table（有框線），而非原始 `|` 字元
- Code block 是否有語法高亮
- 標題層級是否正確
- 無明顯跑版或排版斷裂

### 常見問題

| 症狀 | 原因 | 修法 |
| --- | --- | --- |
| 表格顯示原始 `\|` 字元 | `remark-gfm` 未啟用 | 確認 `contentlayer.config.ts` 有 `remarkPlugins: [remarkGfm]` |
| Code block 無高亮 | `rehype-pretty-code` 設定問題 | 確認 `rehypePlugins` 有 `rehypePrettyCode` |
