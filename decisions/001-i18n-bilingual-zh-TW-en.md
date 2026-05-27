# Decision: i18n — Bilingual zh-TW / en Website

## What was decided

- Add full i18n support using `next-intl` with App Router `[locale]` routing
- Supported locales: `zh-TW` (default), `en`
- URL structure: symmetric prefix — `/zh-TW/blog/...` and `/en/blog/...`
- Redirect: old `/blog/:slug` → `/zh-TW/blog/:slug`
- Blog content: all 10 published posts translated in both directions
- File naming: `{slug}.zh-TW.mdx` / `{slug}.en.mdx` under `content/blog/`
- Translation workflow: Claude generates draft → agy (via agy-ask.ps1) reviews → apply suggestions

## Alternatives considered

- **pages-based i18n** (next.config i18n): dropped, App Router doesn't support it
- **subdirectory file structure** (`content/blog/{slug}/{lang}.mdx`): cleaner but requires bigger Contentlayer2 refactor; flat naming chosen for simplicity
- **Browser-side machine translation** (Google Translate widget): no control over quality, doesn't work offline
- **Default locale without prefix** (`/blog/...` = zh-TW, `/en/blog/...` = English): asymmetric, complicates canonical URL logic; symmetric chosen

## Why this choice

- `next-intl` is the de-facto standard for Next.js 14 App Router i18n
- Symmetric prefix makes locale always explicit in URL — simpler middleware, cleaner hreflang
- Flat file naming keeps Contentlayer2 changes minimal (just regex-derive `lang` and `slug` from filename)
- Per-article agy review ensures translation quality matches author's voice

## Scope

Phases:
1. UI foundation (next-intl install, routing, UI string extraction, language switcher)
2. Blog content architecture (Contentlayer2 schema update, file rename/restructure)
3. Translations (9 posts × 2 directions, Claude draft + agy review per post)
4. Polish (URL redirects, hreflang, sitemap, about/skills data)
