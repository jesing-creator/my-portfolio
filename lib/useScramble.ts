'use client'

import { useEffect, useState } from 'react'

const FLAP = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

/**
 * Split-flap style text: every character cycles through random glyphs and then locks,
 * left to right. Runs once when `run` flips to true. Under reduced motion it just shows the text.
 */
export function useScramble(text: string, run: boolean, delay = 0) {
  const [out, setOut] = useState(() => text.replace(/[^\s]/g, ' '))

  useEffect(() => {
    if (!run) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setOut(text)
      return
    }
    const start = performance.now() + delay
    let raf = 0
    let lastSwap = 0
    let chars = text.split('')

    const frame = (now: number) => {
      const el = now - start
      if (el < 0) {
        raf = requestAnimationFrame(frame)
        return
      }
      const swap = now - lastSwap > 55
      if (swap) lastSwap = now
      let done = true
      const next = text.split('').map((ch, i) => {
        if (ch === ' ') return ' '
        const settleAt = 350 + i * 70
        if (el >= settleAt) return ch
        done = false
        return swap ? FLAP[Math.floor(Math.random() * FLAP.length)] : (chars[i] ?? ch)
      })
      chars = next
      setOut(next.join(''))
      if (!done) raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [text, run, delay])

  return out
}
