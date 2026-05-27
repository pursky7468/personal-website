// PreToolUse hook: blocks Edit/Write on layout files unless verify-layout.js was run recently.
// Receives tool input as JSON on stdin. Exits 1 (block) or 0 (allow).

const fs = require('fs')
const path = require('path')

const LAYOUT_FILES = [
  'src/components/MDXContent.tsx',
  'src/app/globals.css',
  'tailwind.config.ts',
  'contentlayer.config.ts',
]

const CACHE_TTL_MS = 30 * 60 * 1000 // 30 minutes

let input = ''
process.stdin.on('data', d => (input += d))
process.stdin.on('end', () => {
  let filePath = ''
  try {
    const toolInput = JSON.parse(input)
    filePath = toolInput.file_path || toolInput.path || ''
  } catch {
    process.exit(0)
  }

  const normalized = filePath.replace(/\\/g, '/').toLowerCase()
  const isLayoutFile = LAYOUT_FILES.some(f => normalized.endsWith(f.toLowerCase()))
  if (!isLayoutFile) process.exit(0)

  const cacheDir = path.join(__dirname, '../.verify-cache')
  if (!fs.existsSync(cacheDir)) return block()

  const cutoff = Date.now() - CACHE_TTL_MS
  const hasRecent = fs.readdirSync(cacheDir)
    .filter(f => f.endsWith('.json'))
    .some(f => {
      try { return fs.statSync(path.join(cacheDir, f)).mtimeMs > cutoff } catch { return false }
    })

  if (hasRecent) process.exit(0)
  else block()
})

function block() {
  console.error('⛔ LAYOUT FILE — baseline required')
  console.error('Run verify-layout.js on the affected post first, then Read the screenshots.')
  console.error('  node scripts/verify-layout.js <slug>')
  process.exit(1)
}
