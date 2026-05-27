// Usage: node scripts/health-check.js
// Runs verify-layout.js on every blog post and reports pass/fail summary.

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const BLOG_DIR = path.join(__dirname, '../content/blog')
const VERIFY_SCRIPT = path.join(__dirname, 'verify-layout.js')

const slugs = fs.readdirSync(BLOG_DIR)
  .filter(f => f.endsWith('.mdx') && f !== 'test.mdx')
  .map(f => f.replace('.mdx', ''))
  .sort()

console.log(`Health check — ${slugs.length} posts\n`)

const results = []

for (const slug of slugs) {
  try {
    const output = execSync(`node "${VERIFY_SCRIPT}" ${slug}`, { encoding: 'utf8', timeout: 60000 })
    results.push({ slug, status: 'PASS' })
    console.log(`  ✓  ${slug}`)
  } catch (e) {
    const output = e.stdout || e.message || ''
    const failures = output.split('\n').filter(l => l.startsWith('  ✗'))
    results.push({ slug, status: 'FAIL', failures })
    console.log(`  ✗  ${slug}`)
    failures.forEach(f => console.log(`       ${f.trim()}`))
  }
}

const failed = results.filter(r => r.status === 'FAIL')
const passed = results.filter(r => r.status === 'PASS')

console.log(`\n--- Summary ---`)
console.log(`  PASS: ${passed.length}  FAIL: ${failed.length}  TOTAL: ${results.length}`)

if (failed.length > 0) {
  console.log('\nFailed posts:')
  failed.forEach(r => console.log(`  - ${r.slug}`))
  process.exit(1)
}
