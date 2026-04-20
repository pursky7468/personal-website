# Implementation Plan

> 目標：先完成整個網站框架（所有頁面、路由、UI skeleton 都通），
> 再填入真實內容（MDX 文章、作品詳情、截圖）。

---

## 圖例

- 🤖 Agent 自動執行
- 👁 人工確認

---

## 驗收標準（框架完成定義）

框架完成 = 以下全部達成：
- [ ] 所有路由可訪問，無 404
- [ ] Navbar / Footer 在每頁正確顯示
- [ ] Dark / Light mode 切換正常
- [ ] 空白內容有 graceful empty state（非錯誤頁）
- [ ] Contentlayer 正確解析 MDX（可加假文章驗證）
- [ ] 部署到 Vercel，可公開訪問

---

## 依賴關係圖

```
[1a Init & Config]
       ↓
[1b Global Layout]
       ↓
    ┌──┴──────────────┐
[1c Home]         [1d About]
    └──┬──────────────┘
       ↓
[1e Deploy to Vercel]  ← 框架 MVP 結束
       ↓
    ┌──┴──────────────┐
[2a Projects]    [2b Blog]   ← 可並行
    └──┬──────────────┘
       ↓
[3 Polish & QA]
```

---

## Phase 1a — Project Init & Config

**目標：** 乾淨的 Next.js 專案，所有工具安裝並設定完成

### Checklist

- [ ] 初始化專案
  ```bash
  npx create-next-app@latest . \
    --typescript --tailwind --app --src-dir --import-alias "@/*"
  ```

- [ ] 安裝核心依賴
  ```bash
  pnpm add contentlayer2 next-contentlayer2 \
           framer-motion \
           next-themes \
           lucide-react \
           date-fns \
           reading-time
  pnpm add -D rehype-pretty-code shiki
  ```
  > `contentlayer2` + `next-contentlayer2`：原版 `contentlayer` 已停止維護，此為活躍維護的 fork，API 完全相同

- [ ] 安裝 shadcn/ui
  ```bash
  pnpm dlx shadcn@latest init
  # 選：Default style, Blue color, CSS variables
  pnpm dlx shadcn@latest add badge button card separator sheet
  ```
  > `sheet` 用於 mobile hamburger menu，一併安裝

- [ ] 安裝測試依賴
  ```bash
  pnpm add -D @playwright/test @axe-core/playwright
  pnpm add -D @lhci/cli
  pnpm dlx playwright install chromium
  ```

- [ ] 設定 `playwright.config.ts`
  ```ts
  // baseURL: 'http://localhost:3000'
  // projects: chromium only（CI 用）
  // webServer: 自動啟動 pnpm dev
  ```

- [ ] 設定 `lighthouserc.js`
  ```js
  // url: ['http://localhost:3000', '/projects', '/blog', '/about']
  // assert: performance>=95, accessibility>=95, seo>=100
  ```

- [ ] 設定 `tailwind.config.ts`
  ```ts
  darkMode: 'class',
  content: [
    "./.contentlayer/generated/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{ts,tsx,mdx}",
  ]
  ```

- [ ] 設定 `tsconfig.json`，加入 Contentlayer path alias
  ```json
  {
    "compilerOptions": {
      "paths": {
        "contentlayer/generated": ["./.contentlayer/generated"]
      }
    }
  }
  ```
  > 缺少此設定，所有 `import { allPosts } from 'contentlayer/generated'` 都會報錯

- [ ] 設定 `next.config.ts`
  ```ts
  import { withContentlayer } from 'next-contentlayer2'
  // withContentlayer() wrap + CSP headers
  ```

- [ ] 建立 `contentlayer.config.ts`
  - 定義 `Post` document type（blog）
  - 定義 `Project` document type（projects）
  - 設定 `rehype-pretty-code`（shiki syntax highlight）
  - Frontmatter schema 如 SPEC 所定義

- [ ] 建立目錄結構
  ```
  content/
  ├── blog/.gitkeep
  └── projects/.gitkeep
  public/
  └── projects/        # 截圖用
  src/app/globals.css  # shadcn/ui CSS variables 基礎，勿刪
  ```

- [ ] 建立 `.env.example`
  ```
  NEXT_PUBLIC_SITE_URL=http://localhost:3000
  ```

- [ ] `.gitignore` 加入 `.contentlayer/`

- [ ] 建假 MDX 驗證 Contentlayer 可正常解析
  ```bash
  echo '---\ntitle: Test\ndate: 2026-04-20\ndraft: true\n---\nHello' \
    > content/blog/test.mdx
  pnpm dev
  ```

**驗收：** `pnpm dev` 能跑，`pnpm build` 無 error，`.contentlayer/generated` 目錄存在

---

## Phase 1b — Global Layout

**目標：** 所有頁面共用的 shell（Navbar + Footer + Theme）

### 元件清單

| 元件 | 路徑 | 說明 |
|------|------|------|
| `ThemeProvider` | `src/components/ThemeProvider.tsx` | `next-themes` wrapper |
| `Navbar` | `src/components/Navbar.tsx` | Logo + nav links + dark toggle + mobile Sheet |
| `Footer` | `src/components/Footer.tsx` | GitHub / Email 連結 + copyright |
| `RootLayout` | `src/app/layout.tsx` | 組合以上 |

### Navbar 規格

```
左：Steve Lin（文字 logo，link to /）
中：Projects | Blog | About
右：Dark/Light toggle icon button
Mobile：hamburger icon → shadcn Sheet → nav links
```

### Footer 規格

```
左：© 2026 Steve Lin
右：GitHub icon link | Email icon link
```

### Checklist

- [ ] `ThemeProvider.tsx`：`next-themes` wrapper，`attribute="class"`
- [ ] `layout.tsx`：包入 ThemeProvider，`<html>` 加 `suppressHydrationWarning`
- [ ] `Navbar.tsx`：
  - desktop：logo + nav links + dark toggle
  - mobile：hamburger icon + shadcn `Sheet` slide-in menu
  - active link 用 `usePathname()` 判斷
- [ ] `Footer.tsx`：GitHub + Email icon links（lucide）+ copyright
- [ ] 🤖 寫 `tests/layout.spec.ts`：
  - Navbar / Footer 在 `/`, `/projects`, `/blog`, `/about` 均可見
  - Dark mode toggle：click → `<html>` class 含 `dark` → reload → class 仍含 `dark`（localStorage persist）
  - Mobile（375px）：hamburger icon 可見，desktop nav 隱藏；click hamburger → Sheet 開啟

**驗收：** `pnpm test` 通過，dark mode persist 測試綠燈

---

## Phase 1c — Home Page

**目標：** `/` 頁面，有內容時顯示，無內容時 graceful empty

### Sections & Checklist

- [ ] `HeroSection.tsx`：名字大字（Steve Lin）+ 副標題留空（`null` 不渲染）
- [ ] `PostCard.tsx`：可複用，用於 home + `/blog`
- [ ] `ProjectCard.tsx`：可複用，用於 home + `/projects`
- [ ] `page.tsx`（Home）：
  - Latest Posts：取最新 3 篇非 draft，**無文章時整個 section hidden**
  - Featured Projects：取 `featured: true` projects，**無內容時顯示 placeholder card**
- [ ] 🤖 寫 `tests/home.spec.ts`：
  - `h1` 包含 "Steve Lin"
  - 無 MDX 時頁面無 console error
  - 無 blog 文章時 Latest Posts section 不存在於 DOM
  - 無 featured projects 時 placeholder card 可見

**驗收：** 無 MDX 內容時頁面不報錯，`pnpm test` 通過

---

## Phase 1d — About Page

**目標：** `/about` 輕量自介，非履歷格式

### Sections & Checklist

- [ ] `about/page.tsx`：
  1. **Bio**：placeholder 文字（3–5 句）
  2. **Currently Exploring**：硬編碼，易更新
  3. **Tech I Use**：分組 badge 列表
     ```
     Languages:    Python  TypeScript  C#  SQL
     Frameworks:   FastAPI  Next.js  .NET 8  Electron
     AI / LLM:     Claude API  MCP  Groq  Gemini  sentence-transformers
     Data:         PostgreSQL  SQLite  SQLAlchemy  FTS5
     Tools:        Docker  Git  Vercel  GitHub Actions
     ```
  4. **Contact**：GitHub button + Email button（lucide icons）
- [ ] 🤖 `tests/about.spec.ts`：
  - 頁面可訪問（status 200）
  - Tech badge 區塊存在（至少 5 個 badge 可見）
  - GitHub / Email 連結存在且有 `href`

**驗收：** 頁面靜態，`pnpm build` 通過，`pnpm test` 通過

---

## Phase 1e — Deploy to Vercel

**目標：** 框架 MVP 公開上線

### Checklist

- [ ] 👁 Push repo 到 GitHub（public）
- [ ] 👁 Vercel import project → 自動偵測 Next.js
- [ ] 👁 設定環境變數（`NEXT_PUBLIC_SITE_URL` = 實際 Vercel URL）
- [ ] 👁 確認 Vercel build log 有 `Generated X documents in .contentlayer` 訊息
- [ ] 👁 確認 build log 無 error / warning
- [ ] 🤖 `pnpm test` 跑全部 spec（針對 localhost）

**驗收：** Vercel URL 可公開訪問，CI auto-deploy from `main` branch

---

## Phase 2a — Projects

**目標：** `/projects` 列表頁 + `/projects/[slug]` 動態頁

### Checklist

- [ ] 建立 3 個 project MDX skeleton（含正確 frontmatter）
  - `content/projects/ai-news-radar.mdx`
  - `content/projects/linebot.mdx`
  - `content/projects/photo-album.mdx`

- [ ] `MDXContent.tsx`：
  ```ts
  'use client'  // 必須，useMDXComponent 是 React hook
  // useMDXComponent wrapper
  ```

- [ ] `projects/page.tsx`：
  - 從 Contentlayer 取所有 projects，按 date 排序
  - Grid：2 columns（md+），1 column（mobile）
  - `<ProjectCard>`：title, description, tags, GitHub link

- [ ] `projects/[slug]/page.tsx`：
  - `generateStaticParams()`：過濾 `draft: true`
  - `generateMetadata()`：title, description, og:image
  - 渲染 `MDXContent`
  - Section 順序：Banner → What it does → Architecture → Key Decisions → Screenshots → Lessons Learned

- [ ] AI News Radar MDX 內容：
  - 架構圖（ASCII art 或 SVG，內嵌於 MDX）
  - 截圖放 `public/projects/ai-news-radar/`，用 `next/image` 引用
  - Code snippet 用 shiki fence block，語言標記正確

- [ ] 🤖 `tests/projects.spec.ts`：
  - `/projects` 可訪問，ProjectCard 數量 ≥ 3
  - 每個 slug（`/projects/ai-news-radar` 等）status 200
  - Draft project 的 slug 不出現於列表
  - MDX code block 有 `data-rehype-pretty-code-fragment` 屬性（確認 highlight 有作用）
  - 🤖 靜態分析：`grep -r "<img"` src/ 不含非 next/image 的 `<img>` tag

**驗收：** 3 個 slug 可訪問，`pnpm test` 通過，code block syntax highlight 正確

---

## Phase 2b — Blog

**目標：** `/blog` 列表頁 + `/blog/[slug]` 文章頁

### Checklist

- [ ] 建 `content/blog/hello-world.mdx`（`draft: true`，驗證流程用）

- [ ] `blog/page.tsx`：
  - 取所有非 draft 文章，按 date 降冪
  - Empty state：顯示「文章籌備中」，非錯誤頁

- [ ] `blog/[slug]/page.tsx`：
  - `generateStaticParams()`：只包含非 draft
  - 渲染 MDXContent
  - 顯示：title, date, 預估閱讀時間（`reading-time`）, tags

- [ ] 🤖 `tests/blog.spec.ts`：
  - `/blog` 可訪問，empty state 文字可見
  - `hello-world`（draft）不出現在列表
  - `/blog/hello-world` 直接訪問應為 404（draft 不生成靜態頁）
  - 有文章時：PostCard 顯示 title + date + reading time

**驗收：** draft 不出現列表，empty state 正確，`pnpm test` 通過

---

## Phase 3 — Polish & QA

**目標：** 動畫、SEO、行動裝置 QA、效能

### Checklist

#### 3.1 Framer Motion
- [ ] 各 section 加 `fadeInUp`（`viewport: { once: true }`）
- [ ] 使用 `LazyMotion + domAnimation`（減少 bundle size）
- [ ] 不加 page transition（App Router 支援不穩定）

#### 3.2 SEO
- [ ] `layout.tsx`：global metadata（site name, description, OpenGraph）
- [ ] 各頁 `generateMetadata()`：title, description, og:image
- [ ] 👁 手動製作 `public/og-image.png`（1200×630）
- [ ] `src/app/robots.ts` + `src/app/sitemap.ts`
- [ ] 🤖 `tests/seo.spec.ts`：
  - 每頁 `<title>` 不為空
  - 每頁有 `og:title` + `og:description` meta tag
  - `/robots.txt` 可訪問
  - `/sitemap.xml` 可訪問且包含所有已知路由

#### 3.3 Mobile QA
- [ ] 🤖 `tests/responsive.spec.ts`（Playwright viewport 模擬）：
  - **375px**：`document.body.scrollWidth <= window.innerWidth`（無橫向 scroll）
  - **768px**：project grid container 寬度 ≥ 2 columns（bounding box 檢查）
  - **1280px**：main container `max-width` 生效（offsetWidth ≤ 1200）
  - Hamburger icon 在 375px 可見，desktop nav 隱藏
  - Hamburger click → Sheet 可見
- [ ] 🤖 `tests/a11y.spec.ts`（axe-core）：
  - Touch target ≥ 44px（axe WCAG 2.5.5）
  - 所有 interactive 元素有 `aria-label`
  - 在 `/`, `/projects`, `/blog`, `/about` 各跑一次 `checkA11y()`
- [ ] 👁 真實手機瀏覽器快速目視確認（非自動化）

#### 3.4 Performance & Accessibility
- [ ] 🤖 `npm audit --audit-level=high`（有 high/critical 則 fail）
- [ ] 🤖 靜態分析：`grep -rn "<img " src/` → 不應有非 `next/image` 的原生 img tag
- [ ] 🤖 Lighthouse CI：`pnpm lhci autorun`
  - Performance ≥ 95
  - Accessibility ≥ 95
  - SEO = 100
- [ ] 👁 OG image 視覺確認（1200×630，設計正確）

---

## 測試檔案結構

```
tests/
├── layout.spec.ts       # Navbar / Footer / dark mode / hamburger
├── home.spec.ts         # Hero / empty state / placeholder
├── about.spec.ts        # 頁面可訪問 / badges / contact links
├── projects.spec.ts     # 列表 / slug 路由 / draft 過濾 / code highlight
├── blog.spec.ts         # 列表 / draft 過濾 / empty state / 404 on draft slug
├── responsive.spec.ts   # 375 / 768 / 1280px viewport 檢查
├── a11y.spec.ts         # axe-core 全頁掃描
└── seo.spec.ts          # title / og meta / robots / sitemap
playwright.config.ts
lighthouserc.js
```

---

## 完整 Checklist 總覽

> 最後更新：2026-04-20　進度：Phase 1a–2b 完成，Phase 3 待執行

| # | Phase | 項目 | 執行方式 | 狀態 |
|---|-------|------|---------|------|
| 1 | 1a | `create-next-app` 初始化 | 🤖 | ✅ |
| 2 | 1a | 安裝 `contentlayer2 next-contentlayer2` + runtime 依賴 | 🤖 | ✅ |
| 3 | 1a | 安裝 `rehype-pretty-code shiki`（dev） | 🤖 | ✅ |
| 4 | 1a | 安裝 `@playwright/test @axe-core/playwright @lhci/cli` | 🤖 | ✅ |
| 5 | 1a | shadcn/ui：Radix-based components（badge, button, card, separator, sheet） | 🤖 | ✅ |
| 6 | 1a | `playwright.config.ts` + `lighthouserc.js` 設定 | 🤖 | ✅ |
| 7 | 1a | `tailwind.config.ts`：darkMode + contentlayer 路徑 + HSL color tokens | 🤖 | ✅ |
| 8 | 1a | `tsconfig.json`：`contentlayer/generated` path alias | 🤖 | ✅ |
| 9 | 1a | `next.config.mjs`：`withContentlayer()` + CSP headers | 🤖 | ✅ |
| 10 | 1a | `contentlayer.config.ts`：Post + Project schema + rehype-pretty-code | 🤖 | ✅ |
| 11 | 1a | 建立 `content/` 目錄結構 + `.gitkeep` | 🤖 | ✅ |
| 12 | 1a | `.env.example` + `.gitignore` 更新 | 🤖 | ✅ |
| 13 | 1a | 假 MDX 驗證 Contentlayer 解析，build 無 error | 🤖 | ✅ |
| 14 | 1b | `ThemeProvider.tsx` | 🤖 | ✅ |
| 15 | 1b | `layout.tsx`：ThemeProvider + `suppressHydrationWarning` + Inter/JetBrains Mono | 🤖 | ✅ |
| 16 | 1b | `Navbar.tsx`：desktop nav + mobile Sheet + active link | 🤖 | ✅ |
| 17 | 1b | `Footer.tsx`：GitHub SVG icon + Email icon + copyright | 🤖 | ✅ |
| 18 | 1b | `tests/layout.spec.ts` | 🤖 | ✅ |
| 19 | 1c | `HeroSection.tsx` | 🤖 | ✅ |
| 20 | 1c | `ProjectCard.tsx`（可複用） | 🤖 | ✅ |
| 21 | 1c | `PostCard.tsx`（可複用） | 🤖 | ✅ |
| 22 | 1c | `page.tsx`（Home）：empty state 正確 | 🤖 | ✅ |
| 23 | 1c | `tests/home.spec.ts` | 🤖 | ✅ |
| 24 | 1d | `about/page.tsx`：Bio + Tech badges + Contact | 🤖 | ✅ |
| 25 | 1d | `tests/about.spec.ts` | 🤖 | ✅ |
| 26 | 1e | Push to GitHub（public） | 👁 | ✅ |
| 27 | 1e | Vercel deploy | 👁 | ⬜ |
| 28 | 1e | `npm test` 全部通過 | 🤖 | ⬜ |
| 29 | 2a | 2 個 project MDX（ai-news-radar, linebot）| 🤖 | ✅ |
| 30 | 2a | `MDXContent.tsx`（`'use client'`） | 🤖 | ✅ |
| 31 | 2a | `projects/page.tsx` grid | 🤖 | ✅ |
| 32 | 2a | `projects/[slug]/page.tsx`（過濾 draft） | 🤖 | ✅ |
| 33 | 2a | `tests/projects.spec.ts` + 靜態分析 img tag | 🤖 | ✅ |
| 34 | 2b | `blog/page.tsx` + empty state | 🤖 | ✅ |
| 35 | 2b | `blog/[slug]/page.tsx`（非 draft only） | 🤖 | ✅ |
| 36 | 2b | `tests/blog.spec.ts` | 🤖 | ✅ |
| 37 | 2b | `robots.ts` + `sitemap.ts` | 🤖 | ✅ |
| 38 | 3 | Framer Motion：`LazyMotion + fadeInUp` | 🤖 | ⬜ |
| 39 | 3 | SEO：各頁 `generateMetadata` | 🤖 | ✅ |
| 40 | 3 | `og-image.png` 手動製作 | 👁 | ⬜ |
| 41 | 3 | `tests/seo.spec.ts` | 🤖 | ✅ |
| 42 | 3 | `tests/responsive.spec.ts`（375 / 768 / 1280px） | 🤖 | ✅ |
| 43 | 3 | `tests/a11y.spec.ts`（axe-core 全頁） | 🤖 | ✅ |
| 44 | 3 | 真實手機目視確認 | 👁 | ⬜ |
| 45 | 3 | `npm audit --audit-level=high` | 🤖 | ⬜ |
| 46 | 3 | 靜態分析：無原生 `<img>` tag | 🤖 | ✅ |
| 47 | 3 | Lighthouse CI（`npm run lhci`） | 🤖 | ⬜ |
| 48 | 3 | OG image 視覺確認 | 👁 | ⬜ |

**決策記錄：**
- Photo Album App 從 projects 移除（2026-04-20）— 為 speckit 工具的 sample project，非原創作品
- shadcn v4 base-nova 不相容 Tailwind v3，改用 Radix UI 手動建立元件
- lucide-react 已移除 Github brand icon，改用內嵌 SVG

**完成：37/48 項 ✅　待執行：11/48 項 ⬜**

---

## 最終 File Structure

```
personal-website/
├── content/
│   ├── blog/
│   │   └── .gitkeep
│   └── projects/
│       ├── ai-news-radar.mdx
│       ├── linebot.mdx
│       └── photo-album.mdx
├── public/
│   ├── og-image.png
│   └── projects/
│       └── ai-news-radar/        # screenshots
├── src/
│   ├── app/
│   │   ├── globals.css           # shadcn/ui CSS variables，勿刪
│   │   ├── layout.tsx            # RootLayout + ThemeProvider
│   │   ├── page.tsx              # Home
│   │   ├── about/page.tsx
│   │   ├── projects/
│   │   │   ├── page.tsx          # Projects grid
│   │   │   └── [slug]/page.tsx   # Project detail
│   │   ├── blog/
│   │   │   ├── page.tsx          # Blog list
│   │   │   └── [slug]/page.tsx   # Blog post
│   │   ├── robots.ts
│   │   └── sitemap.ts
│   ├── components/
│   │   ├── ThemeProvider.tsx
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── HeroSection.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── PostCard.tsx
│   │   ├── MDXContent.tsx        # 'use client' + useMDXComponent
│   │   └── ui/                   # shadcn components
│   └── lib/
│       └── utils.ts              # cn() helper
├── tests/
│   ├── layout.spec.ts
│   ├── home.spec.ts
│   ├── about.spec.ts
│   ├── projects.spec.ts
│   ├── blog.spec.ts
│   ├── responsive.spec.ts
│   ├── a11y.spec.ts
│   └── seo.spec.ts
├── contentlayer.config.ts
├── playwright.config.ts
├── lighthouserc.js
├── next.config.ts
├── tailwind.config.ts
├── .env.example
├── .gitignore
├── SPEC.md
└── PLAN.md
```

---

## 工時估算

| Phase | 項目 | 估算 |
|-------|------|------|
| 1a | Init & Config（含測試工具設定） | 2–3h |
| 1b | Global Layout + layout.spec.ts | 2–3h |
| 1c | Home Page + home.spec.ts | 2h |
| 1d | About Page + about.spec.ts | 1h |
| 1e | Deploy | 1h |
| 2a | Projects + projects.spec.ts | 4–6h |
| 2b | Blog + blog.spec.ts | 2–3h |
| 3  | Polish + responsive / a11y / seo / lhci | 4–5h |
| **Total** | | **18–24h** |

---

## 費用備註

> 審查日期：2026-04-20。所有工具均為免費，無需替換。

| 工具 | 授權 | 費用 |
|------|------|------|
| Next.js / TypeScript / Tailwind | MIT / Apache 2.0 | ✅ 免費 |
| contentlayer2 / next-contentlayer2 | MIT | ✅ 免費 |
| framer-motion | MIT | ✅ 免費（Motion+ 是另一付費產品，本專案未使用）|
| next-themes / lucide-react / date-fns / reading-time | MIT / ISC | ✅ 免費 |
| rehype-pretty-code / shiki | MIT | ✅ 免費 |
| shadcn/ui | MIT | ✅ 免費 |
| @playwright/test | Apache 2.0 | ✅ 免費 |
| @axe-core/playwright | MPL 2.0 | ✅ 免費 |
| @lhci/cli | Apache 2.0 | ✅ 免費 |
| Vercel（Hobby Plan） | — | ✅ 免費（100GB 流量/月，個人非商業用途，個人作品集完全足夠）|
| GitHub（Public repo） | — | ✅ 免費 |
| 自訂網域 | — | ⚠️ 選配，目前未列入計畫。若需要可向 Namecheap / Cloudflare 購買，約 $10–15/年。Vercel 預設提供 `*.vercel.app` 免費子網域 |

---

## 技術決策記錄

| 決策 | 選擇 | 放棄的選項 | 理由 |
|------|------|-----------|------|
| 內容管理 | `contentlayer2` + MDX | `src/data/*.ts` | Type-safe frontmatter，blog 和 projects 統一管理 |
| Contentlayer fork | `contentlayer2` | `contentlayer` | 原版已停止維護，Next.js 14 有 peer dependency 錯誤 |
| Syntax highlight | `rehype-pretty-code` + shiki | `@shikijs/rehype` | 與 Contentlayer2 整合最穩定，token 顏色最準確 |
| Theme | `next-themes` | 手刻 context | 成熟方案，處理 SSR hydration 問題 |
| Animation | `LazyMotion + domAnimation` | 全量 framer-motion | 減少 bundle size |
| Mobile menu | shadcn `Sheet` | 自刻 drawer | 已在依賴清單內，不額外增加 library |
| OG image | 手動製作靜態 png | `@vercel/og` | `@vercel/og` 需要 Edge Runtime，與 full static 策略衝突 |
| Contact | 純 icon 連結 | Formspree form | 不求職定位，不需要 form |
| Live stats | 不做 | Proxy localhost | Reddit ToS 風險，localhost 無法公開訪問 |
| E2E 測試 | Playwright + axe-core | Cypress | Playwright 原生支援多 viewport，axe-core 整合更直接 |
| Lighthouse | `@lhci/cli` | 手動跑 CLI | 可整合進 CI，設定 assert threshold |
