# Decision: Hosting — Vercel over GitHub Pages

> **Retrospective record, written 2026-08-23.** The choice was never made as an explicit
> comparison at the time; `SPEC.md` recorded only the one-line reason
> `Deployment | Vercel | Zero-config, free tier`. What follows is reconstructed from the
> code and the git history, and is labelled as such where it is inference rather than
> record.

## What was decided

- Host on **Vercel** (Hobby plan, free tier), auto-deploying from `master`
- Production URL: `https://personal-website-pursky7468s-projects.vercel.app`
- No custom domain (deliberately deferred — see `PLAN.md`)
- GitHub Pages was **never evaluated**; it was excluded by the framework choice before
  hosting was considered a separate question

## How this actually happened (chronology)

| Date | Commit | Event |
|---|---|---|
| 2026-04-20 | `7e5969a` | `Initial commit from Create Next App` — framework chosen first |
| 2026-04-20 | `ecf6fe2` | `SPEC.md` records Vercel; `next.config.mjs` gains `headers()` in the **same commit** |
| 2026-05-27 | `7b3ee1c` | i18n added, bringing `src/middleware.ts` — 37 days later |

The first commit is `create-next-app` output. Vercel is the Next.js vendor's own platform
and the default path that scaffolding steers toward, so "choosing Vercel" was not a separate
decision — it was a consequence of choosing Next.js App Router.

The recorded reason (zero-config, free tier) is accurate but describes **convenience**. The
things that make Vercel *necessary* arrived separately: one on day 1, one on day 37.

## Alternatives considered

- **GitHub Pages** — not considered at the time. Assessed retrospectively below; it was
  already incompatible on 2026-04-20 and became structurally impossible on 2026-05-27.
- **Custom domain on Vercel** — deferred, not rejected. `PLAN.md` notes ~USD 10–15/yr and
  no current need; the free `*.vercel.app` subdomain is sufficient for a portfolio.
- **Static export (`output: 'export'`) on any static host** — implicitly attractive: `PLAN.md`
  rejected `@vercel/og` precisely because it "requires Edge Runtime, conflicts with the
  full-static strategy". So a mostly-static posture *was* intended. Two later requirements
  pulled the project off it.

## Why GitHub Pages does not work here

Two hard blockers, verified in the current tree rather than assumed:

**1. Custom response headers — blocking since 2026-04-20**

`next.config.mjs` sets `X-Frame-Options`, `X-Content-Type-Options` and `Referrer-Policy`.
GitHub Pages provides **no mechanism whatsoever** to set response headers. These would have
to be dropped, downgraded to `<meta>` equivalents (weaker, and not equivalent for
`X-Frame-Options`), or recovered by fronting the site with Cloudflare.

**2. `src/middleware.ts` — blocking since 2026-05-27**

next-intl's middleware needs a request-time runtime. Next.js `output: 'export'` **refuses to
build** when middleware is present — it is a hard error, not a degraded mode. This middleware
also performs `Accept-Language` negotiation and the `/blog/:slug` → `/zh-TW/blog/:slug`
redirect (observed live as HTTP 307). Static hosting can only approximate that with
client-side JavaScript, which costs first-paint and SEO.

## What is NOT a blocker (checked, so the record is honest)

The usual static-export obstacles are all absent:

- `next/image` usage: **zero occurrences** in `src/` — normally the biggest blocker
- `[locale]/blog/[slug]` and `[locale]/projects/[slug]`: fine with `generateStaticParams`
- `src/app/robots.ts`, `src/app/sitemap.ts`: generated at build time in Next 14
- No API routes at all

So the project is much closer to static than it looks. Only the headers and the i18n
middleware require a server.

## Cost of migrating to GitHub Pages, if it is ever reconsidered

Lose: `Accept-Language` locale negotiation, the 307 root redirect, all three security
headers, preview deployments, and `vercel logs`. Gain: no dependency on Vercel.

Also required: a GitHub Actions workflow to run `next build`, because Pages serves static
files or runs Jekyll — it will not build a Next.js app.

The Vercel Hobby plan is free for personal, non-commercial use (100 GB/month), so this
trade is currently not worth making. Revisit only if the free tier changes or a hard
requirement to avoid vendor dependency appears.

## Scope

Records the hosting decision and its constraints. No code change accompanies this document.
General background on how static hosting and platform hosting differ is separate from this
project's decision and is written up on its own.
