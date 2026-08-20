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
- **機密邊界**：見下節。素材來自公司／客戶內部資料時，此項為**最高優先**，且 publisher 的自陳一律不採信，reviewer 必須自行掃描全文。

## 機密邊界（素材來自非公開資料時必查）

判準只有一條：**讀者不應該能認出這是哪家公司的哪個系統**。「有沒有貼程式碼」不是分界。

**禁止出現**：公司名、產品名、客戶名、專案代號、真實類別／型別／欄位名、真實檔案路徑、
內部組件名、內網或 GitLab 網址、色碼、產品序號、IP。

**允許出現**：

- 通用公開 API 名（`RenderTargetBitmap`、`AppDomain.AssemblyResolve`、`ScrollViewer`…）
- 中性代稱（「主程式」「設定頁」「宿主視窗」「某個相依組件」）
- 去識別化後的實測數字與方法論

**執行方式**（兩層，缺一不可）：

1. **機械掃描**——對全文 grep 專案相關的專有名詞清單，回報命中數
2. **人工判讀**——grep 抓不到「換句話說但仍可辨識」。要特別檢查：私有欄位名／資源 key 前綴
   等殘留識別碼，以及「多個品類資訊疊加後是否足以指認」

發現可疑項時標明**行號**並說明為什麼可辨識；**不要自行刪改**，交回給人決定——
有些描述刪掉會損失文章核心論證，該不該留是作者的判斷，不是 reviewer 的。

### 對 publisher 的連帶要求

素材為非公開來源時，**publisher 不得直接讀取原始機密資料夾**。
必須由主對話先產出一份**去識別化的中介素材檔**，publisher 只讀那一份。

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
