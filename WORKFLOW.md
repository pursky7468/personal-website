# Vibe Coding Workflow

> 從草創構想到上線的可複製流程。
> 適用於：solo developer + AI agent 協作的個人專案或小型專案。

---

## 核心理念

Vibe Coding 有兩個截然不同的階段，**需要不同的流程密度**：

```
Phase A：探索期（Vibe）          Phase B：工程期（Engineering）
────────────────────────         ──────────────────────────────
目標：找到正確的問題              目標：正確地解決問題
流程：輕、快、可拋棄              流程：可重複、可測試、可維護
文件：草稿即可                   文件：決策要留、理由要寫
測試：驗收用即可                 測試：selector 先定，再開發
```

**人做決策邊界，Agent 做邊界內的執行。**

---

## 階段切換點

| 切換點 | 觸發條件 | 切換後立即做的事 |
|--------|---------|----------------|
| 構想 → Spec | 定位與核心功能確定 | 鎖定 data schema，組團隊 review |
| Spec → Plan | 團隊 review 通過 | 建立 PLAN.md + checklist |
| Plan → Implement | Phase 開始前 | 先列出測試的 selectors/assertions（不用跑），再開發 |
| Implement → Deploy | CI 全綠 | 更新 ADR 區塊，記錄「這個 phase 最意外的決策」 |

---

## 完整流程

### Step 1｜構想草稿（Phase A）

**人工完成。不要用 Agent。**

回答以下三個問題，寫成一段話：

```
1. 這個專案解決什麼問題，給誰用？
2. 哪些功能絕對不做？（防止範圍爆炸）
3. 成功的樣子是什麼？（最小可驗收定義）
```

**這次的例子：**
- 展示個人作品 + 研究筆記，給自己和看到 GitHub 的人
- 不做：求職定位、社群功能、複雜 CMS
- 成功：部署到 Vercel，可公開訪問，兩個 project 頁面有內容

---

### Step 2｜組團隊討論 Spec（Phase A）

**目的：讓不同視角找出盲點，而不是產出完美文件。**

建議成員組合（可用 AI 角色扮演）：

| 角色 | 關注點 | 常見貢獻 |
|------|--------|---------|
| PM | 範圍、優先順序、交付時間 | 砍掉不必要的功能 |
| 業務／用戶 | 使用情境、第一印象 | 提出「一般人看到這個會怎樣」 |
| 軟體架構師 | 技術可行性、擴展性 | 選型建議、指出技術債風險 |
| 資深工程師 | 實作細節、工時估算 | 拆解 phase、評估複雜度 |
| 資安工程師 | 資料、隱私、法律風險 | 爬蟲合規、HTTPS、CSP header |

**討論完輸出：** `SPEC.md`

---

### Step 3｜SPEC.md 格式

```markdown
# Project Spec

## 定位
一句話：這是什麼、給誰用

## 核心功能
- Feature A
- Feature B

## 明確不做
- X
- Y

## Data Schema（最重要）
列出核心資料結構與欄位。
這決定了 80% 的程式碼邏輯。

## 技術限制
- 必須免費
- 必須可部署到 Vercel
- 使用 TypeScript

## 開放問題
列出還沒決定的事，避免假裝已解決
```

> **Schema 優先原則：** 不確定怎麼開始時，先定義資料結構。
> 欄位確定了，API、UI、測試自然跟著來。

---

### Step 4｜工具選型審查

選工具前，對每個候選工具回答：

```
□ 免費？（或 free tier 夠用？）
□ 有活躍維護？（GitHub 最後 commit 在什麼時候）
□ 與現有 stack 相容？
□ 有沒有更簡單的替代方案？
□ 鎖定風險：換掉它的成本高嗎？
```

**記錄選型決策（輕量 ADR）：**

不需要正式文件，直接寫在 PLAN.md 的決策記錄區塊：

```markdown
## 決策記錄

- **選 contentlayer2 而非原版 contentlayer**
  原版已停止維護（2024 年起無更新）

- **不用 shadcn v4 base-nova**
  使用 Tailwind v4 語法（@theme inline），與專案 Tailwind v3 不相容

- **不公開部署 AI News Radar**
  Reddit 爬蟲有 ToS 風險，改用截圖展示
```

> **記錄「為什麼不選 X」比「為什麼選 Y」更有價值。**
> 6 個月後你會忘記，但踩過的坑不應該再踩。

---

### Step 5｜PLAN.md 格式

```markdown
# Implementation Plan

## 驗收標準（框架完成定義）
列出「完成」的具體條件，而非模糊的「做好了」

## 依賴關係圖
用 ASCII 圖表示各 Phase 的前後依賴

## Phase X — 名稱

**目標：** 一句話

### Checklist
- [ ] 🤖 Agent 執行的任務
- [ ] 👁 人工確認的任務

**驗收：** 這個 Phase 完成的具體條件

## 完整 Checklist 總覽

| # | Phase | 項目 | 執行方式 | 狀態 |
|---|-------|------|---------|------|
| 1 | 1a | ... | 🤖 / 👁 | ⬜ |

## 決策記錄
（見上方 ADR 格式）
```

---

### Step 6｜Phase Gate — 切換到工程期

**每個 Phase 開始前，先做這件事：**

> 把這個 Phase 的測試 assertions 列出來（自然語言即可），再開始寫 code。

**例子（Phase 2a Projects 開始前）：**

```
測試預期：
- /projects 頁面 status 200
- 列出所有非 draft 的 project card
- /projects/ai-news-radar status 200
- 頁面有 GitHub 連結（accessible name 是什麼？）
- draft project 不出現在列表
```

這步驟的目的不是寫完整測試，而是**迫使你在開發前想清楚 UI contract**。
`accessible name 是什麼` 這個問題，會讓你在寫 component 時就設計好 aria-label，
而不是等測試失敗才回頭修。

---

### Step 7｜自動化分工原則

```
🤖 Agent 負責：
  - 根據 spec 產出初版 code
  - 執行 lint / format / build
  - 跑測試、回報結果
  - dependency audit
  - 根據 checklist 逐項實作

👤 Human 負責：
  - 定義 data schema
  - 決定 trade-off（速度 vs 品質、功能 A vs 功能 B）
  - 審查 Agent 輸出是否過度設計
  - Phase Gate 判斷（這個 phase 真的完成了嗎）
  - 最終 approve 上線
```

**判斷「是否過度設計」的簡單問題：**

> 如果這個功能只有我一個用戶，這個抽象層有必要嗎？

---

### Step 8｜環境管理

```
.env.local          # 本地開發，不 commit
.env.example        # 欄位清單，commit 進 repo
Vercel Dashboard    # Production 環境變數
```

**必做：**
- 每個環境變數加到 `.env.example`，寫清楚用途
- 部署後確認 `NEXT_PUBLIC_*` 變數指向正確 URL

**建議：**
- 用 `zod` 在 app 啟動時驗證必要的環境變數（避免「本地 OK 上線炸」）

---

### Step 9｜部署後的最低限度觀測

不需要 Sentry 或複雜 logging，但要有**「壞了我怎麼知道」的答案**：

| 需求 | 工具 | 何時用 |
|------|------|--------|
| 即時 log | `vercel logs <url> --follow` | 部署後立即看 |
| Build 錯誤 | Vercel Dashboard → Deployment → Logs | Build 失敗時 |
| 效能基準 | Lighthouse CI（`npm run lhci`） | 每次大改動後 |
| 安全性 | `npm audit --audit-level=high` | 每次加新套件後 |

---

### Step 10｜回饋迴圈

每個版本上線後，花 10 分鐘回答：

```
1. 這個 phase 最意外的決策是什麼？（寫進 PLAN.md 決策記錄）
2. 哪個步驟讓我花最多時間？（是可以流程化的嗎？）
3. 下個 phase 最大的未知是什麼？
```

這不是日記，是讓**下一個專案的自己**少走一次同樣的彎路。

---

## 文件清單

| 文件 | 建立時機 | 更新時機 |
|------|---------|---------|
| `SPEC.md` | Step 2 團隊討論後 | 定位或核心功能改變時 |
| `PLAN.md` | Step 5，Spec 確定後 | 每個 Phase 完成後更新 checklist |
| `WORKFLOW.md` | 第一個專案結束後 | 流程有改進時 |
| `.env.example` | Step 8，第一個 env 變數出現時 | 每次新增變數時 |

---

## 快速參考：新專案啟動 Checklist

```
□ 寫下三個問題的答案（解決什麼 / 不做什麼 / 成功定義）
□ 定義 Data Schema 草稿
□ 組團隊 review Spec（至少問：有沒有法律風險？有沒有付費工具？）
□ 建立 PLAN.md，切 Phase，標出 🤖 / 👁
□ 建立 GitHub repo + .env.example
□ 連接 Vercel，設定自動部署
□ 每個 Phase 開始前：先列測試 assertions
□ 每個 Phase 結束後：更新 PLAN.md checklist + 決策記錄
□ 上線後：跑 Lighthouse + npm audit
```

---

## 這套流程的邊界

**適合：**
- Solo developer + AI agent
- 個人專案、side project、MVP
- 需要快速驗證想法的場景

**不適合（需要更重的流程）：**
- 3 人以上的開發團隊
- 有外部用戶的生產系統
- 需要合規審計的產品

---

*Based on: personal-website 專案實戰經驗（2026-04）*
*Team discussion: PM × Software Architect × GPT × Gemini × Claude*
