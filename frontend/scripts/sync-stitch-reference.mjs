#!/usr/bin/env node
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const envLocal = path.join(__dirname, '../.env.local')
if (!process.env.STITCH_API_KEY && fs.existsSync(envLocal)) {
  for (const line of fs.readFileSync(envLocal, 'utf8').split('\n')) {
    const m = line.match(/^STITCH_API_KEY=(.+)$/)
    if (m) process.env.STITCH_API_KEY = m[1].trim()
  }
}
const config = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../src/stitch/screens.json'), 'utf8'),
)
const outDir = path.join(__dirname, '../stitch-reference')

if (!process.env.STITCH_API_KEY) {
  console.error('Set STITCH_API_KEY (see docs/stitch-integration.md)')
  process.exit(1)
}

fs.mkdirSync(outDir, { recursive: true })

for (const [key, { screenId, title }] of Object.entries(config.screens)) {
  const raw = execSync(
    `npx -y @_davideast/stitch-mcp tool get_screen_code -d '${JSON.stringify({
      projectId: config.projectId,
      screenId,
    })}'`,
    { encoding: 'utf8', env: process.env, maxBuffer: 10 * 1024 * 1024 },
  )
  let html = raw
  try {
    const parsed = JSON.parse(raw)
    html = parsed.html ?? parsed.code ?? parsed.content ?? raw
  } catch {
    /* plain html */
  }
  fs.writeFileSync(path.join(outDir, `${key}.html`), html)
  console.log('✓', title)
}

console.log('\nDone → frontend/stitch-reference/')
