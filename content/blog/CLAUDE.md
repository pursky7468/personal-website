# Blog Content Rules

## Agents

Blog 工作流由兩個 agent + 一組 scripts 分工：

| 步驟 | 工具 | 職責 | 時機 |
|---|---|---|---|
| 1 | `Agent(web-content-publisher)` | 來源文件 → `.mdx` + frontmatter + commit + push | 每次發佈 |
| 2 | `Agent(web-content-reviewer)` | 內容完整性、準確性、無造假 | publisher 完成後自動接 |
| 3 | `Bash: <每個 verifyCommands>`（讀 `blog-publish.config.json`） | Playwright 截圖、渲染/排版/功能檢查，依序執行全部 | reviewer 完成後，等 Vercel 部署完成再執行 |
| 4 | `Read` 截圖 | **視覺確認**：背景、表格框線、code block 高亮、亂碼 | 每個 verifyCommand 完成後立刻執行 |

不要在主對話中直接寫 blog 內容，改用 `Agent` tool 並指定對應的 `subagent_type`。

## 標準發佈流程

```
1. Agent(web-content-publisher)     → 寫內容、轉 .mdx、commit、push
2. Agent(web-content-reviewer)      → 審核內容品質，回傳報告
3. 讀 blog-publish.config.json      → 取得 verifyCommands 陣列
   for each command in verifyCommands:
     Bash: <command> <slug>         → 等 Vercel 部署完成後執行
     Read 截圖                      → 視覺確認（有截圖輸出的腳本才需要）
4. 合併所有結果，一次呈現給使用者
```

## 執行規則

- 四個步驟是同一次發佈的完整流程，**不可拆開**
- 每個步驟完成後，不等使用者確認，立刻接著跑下一步
- **git push 後不可問使用者何時執行驗證**：讀取 `blog-publish.config.json` 的 `deployWaitSeconds`，用 `ScheduleWakeup` 排程後自動跑，不需要使用者介入
- **`verifyCommands` 是陣列，必須全部跑完**，不可只跑第一個
- 每個 command 跑完後，若輸出包含截圖路徑，立刻 `Read` 做視覺確認——**文字 PASS 不代表視覺正確**
- 所有 verifyCommands 的結果合併為一份報告，最後一起呈現給使用者
- 單獨呼叫「review」= reviewer + 全部 verifyCommands + 視覺確認全跑，缺一不可
- **驗證必須用 `verifyCommands`（從 config 讀取），不使用 `web-layout-verifier` agent**

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
