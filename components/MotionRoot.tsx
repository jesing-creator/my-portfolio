'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Lenis from 'lenis'
import { clamp01, motion, smoothstep } from '@/lib/motion'

/**
 * Owns the single requestAnimationFrame loop for scroll, pointer and section progress.
 * Everything downstream (WebGL scene, readouts, method labels) reads from `motion`.
 *
 * It also knows which kind of page it is on. The home page has the sky hero (#top) and the
 * pinned method section (#method). Any other page (a case study) has neither, so the glass docks
 * to the right edge (motion.dock) over the same sky instead of leaving it.
 */
export default function MotionRoot({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    motion.reducedMotion = mq.matches

    const small = window.matchMedia('(max-width: 767px), (pointer: coarse)')
    const syncLite = () => {
      motion.lite = small.matches
    }
    syncLite()
    small.addEventListener('change', syncLite)

    const lenis = mq.matches ? null : new Lenis({ lerp: small.matches ? 0.14 : 0.09, anchors: true })
    lenisRef.current = lenis

    const onPointer = (e: PointerEvent) => {
      if (motion.lite || e.pointerType !== 'mouse') return
      motion.pointerLive = true
      motion.pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      motion.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onPointer, { passive: true })

    let raf = 0
    let last = performance.now()
    let lastY = window.scrollY
    let lastVeil = -1
    let lastPage = ''

    const frame = (now: number) => {
      lenis?.raf(now)
      const dt = Math.max((now - last) / 1000, 1 / 240)
      last = now

      const y = window.scrollY
      const instant = (y - lastY) / dt
      lastY = y
      motion.scrollY = y
      motion.velocity += (instant - motion.velocity) * (1 - Math.exp(-dt * 10))
      if (Math.abs(motion.velocity) < 1) motion.velocity = 0

      const vh = window.innerHeight
      const onHome = !!document.getElementById('top')
      const page = onHome ? 'home' : 'work'
      if (page !== lastPage) {
        lastPage = page
        document.documentElement.dataset.page = page
      }
      motion.heroOut = onHome ? clamp01(y / vh) : 1
      const navState = y > 8 ? 'solid' : 'clear'
      if (document.documentElement.dataset.nav !== navState) document.documentElement.dataset.nav = navState

      // The sky is the same everywhere; below the hero a veil calms it behind body copy, and the
      // trajectory arcs take over from the hero's own.
      motion.dock = 0 // inner pages are solid white; the glass is unmounted there
      const veil = Math.round(smoothstep(0.25, 0.8, motion.heroOut) * 100) / 100
      if (veil !== lastVeil) {
        lastVeil = veil
        const root = document.documentElement.style
        root.setProperty('--veil', String(veil))
        root.setProperty('--trail', String(Math.round((1 - veil * 0.6) * 100) / 100))
      }

      const method = document.getElementById('work')
      if (method) {
        const r = method.getBoundingClientRect()
        motion.enter = clamp01(1 - r.top / vh)
        motion.decompose = clamp01(-r.top / Math.max(1, r.height - vh))
        motion.leave = clamp01(1 - r.bottom / vh)
        // No scroll scrubbing: the glass eases apart on its own once the section fills the view,
        // and eases back together when it leaves. Scrolling itself stays plain.
        const inView = r.top < vh * 0.45 && r.bottom > vh * 0.55 ? 1 : 0
        motion.disperse += (inView - motion.disperse) * (1 - Math.exp(-dt * 3.2))
        if (Math.abs(inView - motion.disperse) < 0.002) motion.disperse = inView
      } else {
        motion.enter = 0
        motion.decompose = 0
        motion.leave = 0
        motion.disperse = 0
      }

      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onPointer)
      small.removeEventListener('change', syncLite)
      lenis?.destroy()
      lenisRef.current = null
    }
  }, [])

  // A new page starts at the top (Next resets native scroll; Lenis needs to be told as well).
  useEffect(() => {
    if (!window.location.hash) lenisRef.current?.scrollTo(0, { immediate: true, force: true })
  }, [pathname])

  return <>{children}</>
}
