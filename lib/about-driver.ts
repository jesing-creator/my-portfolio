import { clamp01, motion, smoothstep } from './motion'

/**
 * Drives the About stage. Tells the glass where its stage is and which verb to perform, and cycles
 * Listening → Connecting → Designing on a timer. Hovering, focusing or tapping a verb holds that one.
 * Plain DOM, shared by the React page and the static preview.
 */
export function startAbout(o: { section: HTMLElement; stage: HTMLElement; tabs: HTMLElement[]; dwell?: number }) {
  const dwell = o.dwell ?? 4600
  let phase = 0
  let pinned = -1
  let t0 = performance.now()
  let raf = 0
  const offs: (() => void)[] = []

  o.tabs.forEach((tab, i) => {
    const on = (e: Event, v: number) => { void e; pinned = v; phase = v; t0 = performance.now() }
    const enter = (e: Event) => on(e, i)
    const leave = () => { pinned = -1; t0 = performance.now() }
    tab.addEventListener('pointerenter', enter)
    tab.addEventListener('pointerleave', leave)
    tab.addEventListener('focus', enter)
    tab.addEventListener('blur', leave)
    tab.addEventListener('click', enter)
    offs.push(() => { tab.removeEventListener('pointerenter', enter); tab.removeEventListener('pointerleave', leave); tab.removeEventListener('focus', enter); tab.removeEventListener('blur', leave); tab.removeEventListener('click', enter) })
  })

  const frame = (now: number) => {
    try {
      const vh = window.innerHeight
      const r = o.section.getBoundingClientRect()
      const d = Math.abs(r.top + r.height / 2 - vh / 2) / vh
      motion.about = 1 - smoothstep(0.3, 0.75, d)
      const s = o.stage.getBoundingClientRect()
      motion.stage.x = s.left + s.width / 2
      motion.stage.y = s.top + s.height / 2
      motion.stage.r = (s.width / 2) * 0.98

      const seen = motion.about > 0.5
      if (!motion.reducedMotion && pinned < 0 && seen && now - t0 > dwell) { phase = (phase + 1) % 3; t0 = now }
      motion.verb = phase
      o.stage.dataset.phase = String(phase)
      const p = pinned >= 0 || motion.reducedMotion ? 1 : clamp01((now - t0) / dwell)
      o.tabs.forEach((tab, i) => {
        tab.dataset.on = String(i === phase)
        tab.style.setProperty('--p', i === phase ? String(p) : '0')
      })
    } finally {
      raf = requestAnimationFrame(frame)
    }
  }
  raf = requestAnimationFrame(frame)
  return () => {
    cancelAnimationFrame(raf)
    offs.forEach((f) => f())
    motion.about = 0
  }
}
