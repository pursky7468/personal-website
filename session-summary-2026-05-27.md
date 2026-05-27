# Session 總結 — 2026-05-27

## 完成項目

### 1. agy 跨模型協作工作流
- 確認 agy (Antigravity CLI) 的正確命令名稱、auth 機制（Windows keyring OAuth，免費）
- 發現 agy 是 TUI 應用，走 Windows Console API，stdout redirect 無法捕捉輸出
- 解法：透過 `~/.gemini/antigravity-cli/brain/<uuid>/.system_generated/logs/transcript.jsonl` 讀取回應
- 建立 `C:\Users\User\scripts\agy-ask.ps1`：review 模式（無工具）和 `-Agentic` 模式（開工具）
- 踩坑七個，全部記錄在 blog post

### 2. Blog post 發佈
- 檔案：`content/blog/claude-agy-cross-model-workflow.mdx`
- 記錄七個坑：命令名稱、GCA 付費方案、stdout 假設、錯誤架構思維、`--dangerously-skip-permissions` 誤用、PS pipe crash、PLANNER_RESPONSE schema 假設

### 3. Blog 發佈流程修正
- 問題：`verify-layout.js` 跑完只看文字 PASS，沒有讀截圖做視覺確認
- 修法：
  - `content/blog/CLAUDE.md` 加 Step 4（Read 三張截圖）
  - `scripts/verify-layout.js` 在 PASS 輸出後加強制提示，讓提醒在執行路徑上而非只在文件裡

### 4. 背景渲染問題修正
- 症狀：code block 背景顏色不一致（bare ``` 和有 language tag 的 ``` 渲染不同）
- 原因：四個 code block 沒有 language tag，`rehype-pretty-code` 用不同樣式渲染
- 修法：加 `text` language tag → commit `37cf205` → push → 驗證通過

### 5. 自律執行規則修正
- 問題：push 後問使用者「要不要等一下再跑？」→ 控制權交回使用者，導致 5 分鐘無動作
- 修法：
  - `~/.claude/CLAUDE.md` 加規則：下一步確定但需等待 → 用 `ScheduleWakeup`，不問使用者
  - `content/blog/CLAUDE.md` 加具體指令：push 後 `ScheduleWakeup(90)`

### 6. Memory vs CLAUDE.md 分類原則確立
- 行動規則 / 工作流程序 → CLAUDE.md（global 或 project 層級）
- Memory → 只放動態資訊（使用者偏好、外部參照、時效狀態）
- 移除錯誤存入 memory 的 feedback，改放 global CLAUDE.md

---

## 修改檔案清單

| 檔案 | 動作 |
|---|---|
| `content/blog/claude-agy-cross-model-workflow.mdx` | 新增（blog post）+ 修正 bare code block language tag |
| `content/blog/CLAUDE.md` | 加 Step 4 視覺確認、push 後 ScheduleWakeup 規則 |
| `scripts/verify-layout.js` | PASS 後加強制視覺確認提示 |
| `C:\Users\User\scripts\agy-ask.ps1` | 新增（agy wrapper script） |
| `C:\Users\User\.claude\CLAUDE.md` | 加 ScheduleWakeup 規則 |
| `C:\Users\User\.claude\projects\...\memory\MEMORY.md` | 更新 index |
| `C:\Users\User\.claude\projects\...\memory\tool_agy_ask.md` | 新增（agy-ask tool 記錄） |

---

## 關鍵決策

**agy 輸出捕捉**：不用 stdout，改讀 transcript.jsonl。TUI 應用走 Console API，pipe/redirect 全部無效。

**agy 架構定位**：不是 sequential reviewer，是 parallel worker（1M context window 差異）。

**verify-layout 提示位置**：提醒放在 script 執行輸出裡，不只放 CLAUDE.md，因為 CLAUDE.md 會被改寫，script 輸出在執行路徑上不會被跳過。

**Memory 分類**：行動規則不進 memory，進 CLAUDE.md；memory 只放程式碼無法表達的動態資訊。
