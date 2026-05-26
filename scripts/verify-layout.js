// Usage: node scripts/verify-layout.js <slug> [--local]
//
// Checks that a blog post renders correctly on the live site:
//   - Page loads (non-404)
//   - Tables render as HTML table elements (not raw | characters)
//   - Code blocks have syntax highlighting tokens
//   - No garbled encoding (???, â€, replacement chars)
//   - H1 heading exists
//
// Saves screenshots to the system temp directory and prints their paths.
// Exits with code 1 if any check fails.

const { chromium } = require('playwright')
const path = require('path')
const os = require('os')

const PROD_BASE = 'https://personal-website-pursky7468s-projects.vercel.app'
const LOCAL_BASE = 'http://localhost:3001'

async function verify(slug, baseUrl) {
  const url = `${baseUrl}/blog/${slug}`
  const tmpDir = os.tmpdir()
  const screenshots = []
  const failures = []

  console.log(`Verifying: ${url}\n`)

  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })

  try {
    const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })

    if (!response || !response.ok()) {
      const status = response ? response.status() : 'no response'
      console.error(`FAIL: HTTP ${status}`)
      process.exit(1)
    }

    // Full-page screenshot
    const fullPath = path.join(tmpDir, `verify-${slug}-full.png`)
    await page.screenshot({ path: fullPath, fullPage: true })
    screenshots.push(fullPath)

    const bodyText = await page.locator('body').innerText()

    // Check: H1 exists
    const h1 = await page.locator('h1').first()
    if (await h1.count() === 0) {
      failures.push('Layout: no H1 heading found')
    } else {
      const title = (await h1.innerText()).trim()
      console.log(`  [PASS] H1: "${title.slice(0, 60)}"`)
    }

    // Check: tables render as HTML (not raw pipe chars)
    const tableCount = await page.locator('table').count()
    const hasPipeTables = /^\|.+\|$/m.test(bodyText)
    if (hasPipeTables) {
      failures.push('Tables: raw | pipe characters found — table not rendered as HTML')
    } else {
      console.log(`  [PASS] Tables: ${tableCount} HTML table(s), no raw pipes`)
      if (tableCount > 0) {
        const tablePath = path.join(tmpDir, `verify-${slug}-table.png`)
        await page.locator('table').first().screenshot({ path: tablePath })
        screenshots.push(tablePath)
      }
    }

    // Check: code blocks have syntax highlighting tokens
    const preCount = await page.locator('pre').count()
    if (preCount === 0) {
      console.log('  [PASS] Code blocks: none (N/A)')
    } else {
      // rehype-pretty-code wraps tokens in <span> inside <code> inside <pre>
      const tokenCount = await page.locator('pre code span').count()
      if (tokenCount === 0) {
        failures.push(`Code blocks: ${preCount} <pre> found but no highlight tokens detected`)
      } else {
        console.log(`  [PASS] Code blocks: ${preCount} block(s), ${tokenCount} highlight tokens`)
      }
      const codePath = path.join(tmpDir, `verify-${slug}-code.png`)
      await page.locator('pre').first().screenshot({ path: codePath })
      screenshots.push(codePath)
    }

    // Check: no garbled encoding
    const garbledPatterns = [
      { pattern: /\?{3,}/, label: '???' },
      { pattern: /â€/, label: 'â€ (UTF-8 mojibake)' },
      { pattern: /ï¿½/, label: 'ï¿½ (replacement char)' },
      { pattern: /�/, label: '\\uFFFD (Unicode replacement char)' },
    ]
    const garbled = garbledPatterns.find(({ pattern }) => pattern.test(bodyText))
    if (garbled) {
      failures.push(`Encoding: garbled text found — "${garbled.label}"`)
    } else {
      console.log('  [PASS] Encoding: no garbled characters')
    }

  } finally {
    await browser.close()
  }

  console.log('\n--- Screenshots ---')
  screenshots.forEach(p => console.log(' ', p))

  if (failures.length > 0) {
    console.log('\nFAIL')
    failures.forEach(f => console.log('  ✗', f))
    process.exit(1)
  } else {
    console.log('\nPASS')
  }
}

const args = process.argv.slice(2)
const slug = args.find(a => !a.startsWith('--'))
const useLocal = args.includes('--local')

if (!slug) {
  console.error('Usage: node scripts/verify-layout.js <slug> [--local]')
  process.exit(1)
}

verify(slug, useLocal ? LOCAL_BASE : PROD_BASE).catch(err => {
  console.error('Error:', err.message)
  process.exit(1)
})
