// Project-level PostToolUse hook for personal-website blog.
// Detects blog content pushes and outputs a ScheduleWakeup reminder.

const { execSync } = require('child_process')
const path = require('path')

const repoRoot = path.join(__dirname, '../..')

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

  const slugs = new Set()
  for (const line of changedFiles.split('\n')) {
    const f = line.trim()
    const m = f.match(/^content\/blog\/(.+?)\.mdx$/)
    if (m) slugs.add(m[1])
  }

  if (slugs.size === 0) process.exit(0)

  const slugList = [...slugs].join(', ')

  console.log('⚠️  BLOG CONTENT PUSHED — MANDATORY:')
  console.log('Call ScheduleWakeup NOW:')
  console.log('  delaySeconds: 90')
  console.log('  reason: "waiting for Vercel deploy to run verifyCommands"')
  console.log(`  prompt: "Run verifyCommands from blog-publish.config.json for: ${slugList}"`)
  console.log('')
  console.log('DO NOT skip ScheduleWakeup. DO NOT report done without reading screenshots.')
})
