// verify-claims.js — evidence-level check for blog posts
//
// Enforces the "證據等級標示" rule in content/blog/CLAUDE.md: a claim that is
// subjective or inferred must say so near the claim itself. It cannot judge
// truth; it flags sentence shapes that historically got written as fact when
// they were actually guesses, then checks whether the surrounding paragraph
// carries an evidence marker.
//
// Usage:
//   node scripts/verify-claims.js <slug> [--locale zh-TW|en]
//   node scripts/verify-claims.js --file path/to/draft.md
//
// Exit 0 = every flagged sentence has an evidence marker (or an explicit
//          {/* claims-ok: reason */} override) in its paragraph
// Exit 1 = at least one flagged sentence is unmarked -> a human must decide
//          whether to label it or cut it

const fs = require('fs')
const path = require('path')

// Sentence shapes that assert a mechanism, a superlative, a comparison, or
// someone else's intent. Each of these can be legitimate -- the point is that
// they need their evidence level stated, not that they are wrong.
const RISKY = [
  { re: /差別(不)?在|差異來自|來自其|原因是|之所以|關鍵在|靠的是|底層(用的)?是|架構是/, kind: '因果／機制歸因' },
  { re: /因為[^。？！]{0,40}所以/, kind: '因果歸因' },
  { re: /本來就是|一定會|必然|全都|從來(不|沒)|絕不|唯一的(方法|選擇|理由|辦法)/, kind: '絕對化' },
  { re: /明顯(比|優)|比[^。？！]{0,25}好[，。]|優於|勝過|品質不足|更容易(壞|失敗|斷)|最(好|佳|穩定)的/, kind: '品質比較' },
  { re: /作者是[^。]{0,25}(抄|做|寫|看)|他們(是)?(用|靠|透過)[^。]{0,20}的/, kind: '他人作法臆測' },
  // English equivalents. Without these an .en post trivially passes, which
  // is a false pass, not a clean bill of health.
  { re: /the (real )?difference is|the reason is|comes down to|under the hood|is powered by|boils down to/i, kind: 'causal/mechanism' },
  { re: /\b(always|never|inevitably|by definition|guaranteed to|all of them|every single)\b/i, kind: 'absolute' },
  { re: /better than|outperforms|superior to|the best (way|option|tool)|far (faster|slower) than/i, kind: 'comparison' },
  { re: /the author (must have|probably|likely)|they (built|did|made) it by/i, kind: 'others intent' },
]

// Any of these in the same paragraph means the author already stated the
// evidence level. Deliberately generous: the goal is to catch silence, not to
// police wording.
const EVIDENCE = [
  /實測|實際(驗證|跑過|測)|測過|量測|本次(工作|驗證)/,
  /查證|官方(文件|說明|條款|頁|說法)|引用原文|原文寫|原文如下|條款(寫|明文)|文件寫|明文規定|明文不支援|明文表示/,
  /主觀|使用印象|沒有做過對照|未做對照|不是量測|個人偏好/,
  /推論|推測|猜的|猜測|我不知道|未(經)?驗證|不確定|沒有(逐一)?查證|無從得知|不敢斷言/,
  /\bI (tested|measured|verified|ran|benchmarked)\b|in my test|measured at/i,
  /official (docs|documentation|terms|page)|per the (docs|terms)|the terms (say|state)|verbatim|quoted/i,
  /subjective|my impression|no controlled|did ?n[o']?t compare|anecdotal|not a benchmark/i,
  /\bI (think|suspect|guess|assume)\b|inference|speculation|I do ?n[o']?t know|unverified|not verified|my guess/i,
]

// Superlatives compressed into a heading or a conclusion bullet are where
// qualifiers go missing. A heading that says "the highest-star one died" while
// the table right under it shows that project alive is not an evidence-level
// problem -- it is an internal contradiction, and the evidence check above
// cannot see it. Flag them so a human cross-checks against the article's own
// numbers.
const SUPERLATIVE = /最高|最多|最大|最好|最快|最穩|最強|唯一|\bthe (most|best|largest|fastest|only)\b/i
const CONSISTENCY_OK = /\{\/\*\s*consistency-ok/

const OVERRIDE = /\{\/\*\s*claims-ok/

function parseArgs (argv) {
  const out = { slug: null, locale: 'zh-TW', file: null, all: false }
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--locale') out.locale = argv[++i]
    else if (argv[i] === '--all') out.all = true
    else if (argv[i] === '--file') out.file = argv[++i]
    else if (!argv[i].startsWith('--')) out.slug = argv[i]
  }
  return out
}

function stripNonProse (text) {
  // Blank out fenced code and frontmatter but keep line count intact so the
  // reported line numbers still point at the real file.
  const lines = text.split('\n')
  let inFence = false
  let inFm = false
  return lines.map((line, i) => {
    if (i === 0 && line.trim() === '---') { inFm = true; return '' }
    if (inFm) { if (line.trim() === '---') inFm = false; return '' }
    if (/^\s*```/.test(line)) { inFence = !inFence; return '' }
    return inFence ? '' : line
  })
}

const NEWLINE = String.fromCharCode(10)

function checkFile (file, opts = {}) {
  const raw = fs.readFileSync(file, 'utf8')
  const lines = stripNonProse(raw)

  // Group into paragraphs (blank-line separated).
  const paras = []
  let cur = null
  lines.forEach((line, idx) => {
    if (line.trim() === '') { cur = null; return }
    if (!cur) { cur = { start: idx + 1, lines: [] }; paras.push(cur) }
    cur.lines.push({ n: idx + 1, text: line })
  })

  const findings = []
  for (let pi = 0; pi < paras.length; pi++) {
    const p = paras[pi]
    // "near the claim" means the same paragraph or the one right after it:
    // a qualifier in the next paragraph still reaches the reader before they
    // act on the claim. Anything further away does not count.
    const scope = [p, paras[pi + 1]].filter(Boolean)
      .map(x => x.lines.map(l => l.text).join(NEWLINE))
      .join(NEWLINE)
    if (EVIDENCE.some(re => re.test(scope)) || OVERRIDE.test(scope)) continue
    for (const l of p.lines) {
      for (const r of RISKY) {
        const m = l.text.match(r.re)
        if (m) { findings.push({ n: l.n, kind: r.kind, hit: m[0], text: l.text.trim() }); break }
      }
    }
  }
  // Headings and conclusion bullets are the compression points.
  const supers = []
  const inConclusion = (idx) => {
    for (let k = idx; k >= 0; k--) {
      const m = lines[k].match(/^##\s+(.*)$/)
      if (m) return /結論|總結|Conclusion|Takeaway/i.test(m[1])
    }
    return false
  }
  lines.forEach((line, idx) => {
    const isHeading = /^#{2,4}\s/.test(line)
    const isBullet = /^\s*[-*]\s/.test(line)
    if (!isHeading && !(isBullet && inConclusion(idx))) return
    const m = line.match(SUPERLATIVE)
    if (m && !CONSISTENCY_OK.test(line)) {
      supers.push({ n: idx + 1, hit: m[0], text: line.trim(), where: isHeading ? '標題' : '結論條列' })
    }
  })

  return { file, paras: paras.length, findings, supers }
}

function report (res) {
  console.log(`Claims check: ${res.file}`)
  console.log(`  paragraphs: ${res.paras}`)
  const supers = res.supers || []
  if (supers.length) {
    console.log(NEWLINE + `${supers.length} 個最高級用語需人工核對：`)
    for (const s of supers) {
      console.log(`  L${s.n}  [${s.where}] 命中「${s.hit}」`)
      console.log(`        ${s.text.slice(0, 120)}`)
    }
    console.log('  → 回頭核對文中的表格與數字；確認無誤後加 {/* consistency-ok */}')
  }

  if (res.findings.length === 0 && supers.length === 0) {
    console.log(NEWLINE + 'PASS — every flagged claim carries an evidence marker.')
    return 0
  }
  if (res.findings.length === 0) {
    console.log(NEWLINE + 'FAIL — 最高級用語尚未核對（見 content/blog/CLAUDE.md「內部一致性」）')
    return 1
  }
  console.log(NEWLINE + `${res.findings.length} unmarked claim(s):` + NEWLINE)
  for (const f of res.findings) {
    const snippet = f.text.length > 150 ? f.text.slice(0, 150) + '…' : f.text
    console.log(`  L${f.n}  [${f.kind}] 命中「${f.hit}」`)
    console.log(`        ${snippet}` + NEWLINE)
  }
  console.log('每一項都要處理其中之一：')
  console.log('  1. 在同一段落標明證據等級（實測／查證／主觀／推論）')
  console.log('  2. 刪掉冒充事實的語氣，保留推論本身')
  console.log('  3. 確定是實測或查證但腳本認不出 -> 加 {/* claims-ok: 理由 */}')
  console.log(NEWLINE + 'FAIL — see content/blog/CLAUDE.md 「證據等級標示」')
  return 1
}

function main () {
  const args = parseArgs(process.argv.slice(2))

  if (args.all) {
    const dir = path.join('content', 'blog')
    const posts = fs.readdirSync(dir).filter(f => f.endsWith('.mdx')).sort()
    let failed = 0
    for (const f of posts) {
      const res = checkFile(path.join(dir, f))
      const nS = (res.supers || []).length
      const bad = res.findings.length + nS
      const tag = bad ? 'FAIL' : 'pass'
      const detail = bad
        ? `  (${res.findings.length} unmarked, ${nS} superlative)`
        : ''
      console.log(`  [${tag}] ${f}${detail}`)
      if (bad) failed++
    }
    console.log(NEWLINE + `${posts.length} post(s), ${failed} with unmarked claims.`)
    process.exit(failed ? 1 : 0)
  }

  let file = args.file
  if (!file) {
    if (!args.slug) {
      console.error('Usage: node scripts/verify-claims.js <slug> [--locale zh-TW|en]')
      console.error('   or: node scripts/verify-claims.js --file <path>')
      console.error('   or: node scripts/verify-claims.js --all')
      process.exit(2)
    }
    file = path.join('content', 'blog', `${args.slug}.${args.locale}.mdx`)
  }
  if (!fs.existsSync(file)) {
    console.error(`File not found: ${file}`)
    process.exit(2)
  }
  process.exit(report(checkFile(file)))
}

main()
