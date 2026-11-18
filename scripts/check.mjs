// Preflight: fails early, with a plain explanation, for the things that make the site look "unstyled".
import fs from 'node:fs'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const problems = []
const major = Number(process.versions.node.split('.')[0])
if (major < 20) problems.push(`Node ${process.versions.node} is too old. Use Node 20.9+ (run "nvm use", the .nvmrc says 20).`)

const need = ['next', 'react', 'react-dom', 'tailwindcss', '@tailwindcss/postcss', 'three', '@react-three/fiber', 'framer-motion', 'lenis',
  '@fontsource-variable/hanken-grotesk', '@fontsource/dm-mono', '@fontsource/instrument-serif']
for (const m of need) {
  try { require.resolve(m + '/package.json') } catch {
    try { require.resolve(m) } catch { problems.push(`Missing package "${m}". Run: npm install`) }
  }
}
for (const f of ['postcss.config.mjs', 'tailwind.config.js', 'app/globals.css', 'app/diagrams.css', 'app/layout.tsx']) {
  if (!fs.existsSync(f)) problems.push(`Missing file ${f}. Was the whole folder unzipped?`)
}
if (fs.existsSync('app/layout.tsx') && !fs.readFileSync('app/layout.tsx', 'utf8').includes("./globals.css")) problems.push('app/layout.tsx must import ./globals.css')
if (fs.existsSync('app/globals.css') && !fs.readFileSync('app/globals.css', 'utf8').includes("@import 'tailwindcss'")) problems.push("app/globals.css must start with @import 'tailwindcss'")

if (problems.length) {
  console.error('\nSetup check failed:\n' + problems.map((p) => ' - ' + p).join('\n') + '\n')
  process.exit(1)
}
console.log('Setup check OK (Node ' + process.versions.node + ')')
