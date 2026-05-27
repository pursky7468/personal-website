// PostToolUse hook: after git push, check if blog content was included.
// If yes, outputs a mandatory reminder for Claude to call ScheduleWakeup(90).
// Receives tool input as JSON on stdin.

const { execSync } = require('child_process')
const path = require('path')

const repoRoot = path.join(__dirname, '..')

let input = ''
process.stdin.on('data', d => (input += d))
process.stdin.on('end', () => {
  let command = ''
  try {
    const parsed = JSON.parse(input.replace(/^﻿/, ''))
    command = (parsed.tool_input || {}).command || ''
  } catch {
    process.exit(0)
  }

  if (!/git\s+push/.test(command)) process.exit(0)

  let changedFiles = ''
  try {
    changedFiles = execSync('git log --name-only --format="" -n 5 HEAD', {
      cwd: repoRoot,
      encoding: 'utf8',
    })
  } catch {
    process.exit(0)
  }

  // Build map: slug → Set of locales present in recent commits
  const slugLocales = {}
  for (const line of changedFiles.split('\n')) {
    const f = line.trim()
    const m = f.match(/^content\/blog\/(.+?)\.(zh-TW|en)\.mdx$/)
    if (!m) continue
    const [, slug, locale] = m
    if (!slugLocales[slug]) slugLocales[slug] = new Set()
    slugLocales[slug].add(locale)
  }

  if (Object.keys(slugLocales).length === 0) process.exit(0)

  const verifyLines = []
  for (const [slug, locales] of Object.entries(slugLocales)) {
    for (const locale of [...locales].sort()) {
      verifyLines.push(`  node scripts/verify-layout.js ${slug} --locale ${locale}`)
    }
  }

  const slugList = Object.keys(slugLocales).join(', ')

  console.log('⚠️  BLOG CONTENT PUSHED — MANDATORY:')
  console.log('Call ScheduleWakeup NOW:')
  console.log('  delaySeconds: 90')
  console.log('  reason: "waiting for Vercel deploy to run verify-layout.js"')
  console.log(`  prompt: "verify-layout.js for blog posts: ${slugList}"`)
  console.log('')
  console.log('After wakeup, run verify-layout.js for each slug+locale,')
  console.log('then Read ALL screenshots before reporting done:')
  verifyLines.forEach(l => console.log(l))
  console.log('')
  console.log('DO NOT skip ScheduleWakeup. DO NOT report done without reading screenshots.')
})
