# personal-website

Steve Lin 的個人網站 — 作品展示 + 研究筆記。

**Live：** https://personal-website-pursky7468s-projects.vercel.app

---

## 內容更新指南

所有內容都可以直接在 **GitHub 網頁**上修改，不需要安裝任何東西。
修改後 Vercel 會自動重新部署（約 1 分鐘生效）。

---

### 修改 About 頁面

#### Bio 自我介紹

編輯 [`src/data/about.json`](src/data/about.json)：

```json
{
  "bio": [
    "第一段文字...",
    "第二段文字...",
    "最後一段（會以粗體顯示）"
  ],
  "currentlyExploring": "目前在探索的主題..."
}
```

#### Tech 技術清單

編輯 [`src/data/skills.json`](src/data/skills.json)：

```json
{
  "Professional": {
    "Languages": ["C#", "C++", "Python"],
    "Frameworks": ["WPF", "MFC"]
  },
  "Exploring": {
    "Languages": ["TypeScript"],
    "AI / LLM": ["Claude API", "MCP"]
  }
}
```

---

### 新增 Blog 文章

1. 進入 [`content/blog/`](content/blog/) 資料夾
2. 點 **Add file → Create new file**
3. 檔名格式：`my-article-title.mdx`
4. 貼上以下模板並填寫內容：

```mdx
---
title: "文章標題"
date: "2026-04-22"
tags: ["tag1", "tag2"]
summary: "這篇文章的一句話摘要"
draft: false
---

正文從這裡開始...

## 第一個標題

內文段落。

\`\`\`python
# 程式碼區塊
print("Hello")
\`\`\`
```

> **注意：** `draft: true` 的文章不會出現在網站上，可以用來存草稿。

---

### 新增 Project 作品

1. 進入 [`content/projects/`](content/projects/) 資料夾
2. 點 **Add file → Create new file**
3. 檔名格式：`project-name.mdx`
4. 貼上以下模板：

```mdx
---
title: "專案名稱"
description: "一句話說明這個專案做什麼"
date: "2026-04-22"
tags: ["Python", "FastAPI"]
github: "https://github.com/pursky7468/your-repo"
featured: true
draft: false
---

## 這個專案做什麼

說明...

## 技術架構

說明...
```

> **注意：** `featured: true` 的作品會出現在首頁的 Projects 區塊。

---

## 開發環境

```bash
npm install
npm run dev        # 開發伺服器（http://localhost:3000）
npm run build      # 正式 build
npm test           # 執行 Playwright 測試
npm run lhci       # 執行 Lighthouse CI
```

> **Port 衝突：** 若 3000 已被佔用，開發伺服器會自動切換到 3001。
> 測試用的 Playwright 預設連 3001，不影響測試執行。

---

## 專案文件

| 文件 | 說明 |
|------|------|
| [SPEC.md](SPEC.md) | 網站規格與功能定義 |
| [PLAN.md](PLAN.md) | 實作計畫與 Checklist |
| [WORKFLOW.md](WORKFLOW.md) | Vibe Coding 開發流程方法論 |
