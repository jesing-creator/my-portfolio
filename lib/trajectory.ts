import { motion } from '@/lib/motion'
import { ringParams } from '@/lib/rings'

/**
 * Two crisp orbit ellipses, mostly behind the glass, with chrome nodes, drawn on a 2D canvas above the glass.
 *
 * The ellipses use exactly the geometry the shader's soft rings use (lib/rings.ts), centred on the
 * droplet cluster, so line and refracted glow coincide. Each is a true ellipse (no wobble): slanted about
 * -31 deg and +23 deg. The half passing in front of the glass is drawn brighter than the half behind.
 * Nodes: one chrome bead and one neon spark. Beads ride the ellipses, speed up
 * with scroll, and drift off their path when the cursor comes near, springing back (no snapping).
 * Phones / reduced motion: drawn once, no per-frame work.
 */

type Node = { k: number; a: number; speed: number; chrome: boolean; big: number; ox: number; oy: number; vx: number; vy: number; trail: number[] }

function chromeBead(c: CanvasRenderingContext2D, x: number, y: number, r: number, glow: boolean) {
  if (glow) {
    const g = c.createRadialGradient(x, y, r * 0.6, x, y, r * 3.2)
    g.addColorStop(0, 'rgba(228,255,26,0.38)')
    g.addColorStop(1, 'rgba(228,255,26,0)')
    c.fillStyle = g
    c.beginPath()
    c.arc(x, y, r * 3.2, 0, Math.PI * 2)
    c.fill()
  }
  // body: bright sky on top, dark horizon band, warm bounce at the bottom: the classic chrome ball
  const b = c.createLinearGradient(x, y - r, x, y + r)
  b.addColorStop(0, '#f4f8ff')
  b.addColorStop(0.38, '#a9bdd6')
  b.addColorStop(0.5, '#27364d')
  b.addColorStop(0.62, '#5d7392')
  b.addColorStop(1, '#f1dfc2')
  c.fillStyle = b
  c.beginPath()
  c.arc(x, y, r, 0, Math.PI * 2)
  c.fill()
  // rim + specular
  c.lineWidth = Math.max(0.8, r * 0.14)
  c.strokeStyle = 'rgba(255,255,255,0.85)'
  c.stroke()
  c.fillStyle = '#ffffff'
  c.beginPath()
  c.arc(x - r * 0.34, y - r * 0.4, Math.max(1, r * 0.22), 0, Math.PI * 2)
  c.fill()
}

export function startTrajectory(cv: HTMLCanvasElement): () => void {
  const ctx = cv.getContext('2d')
  if (!ctx) return () => {}
  // phones animate too (the shader's rings always do, so a still line would drift off its glow); only reduced motion holds still
  const still = motion.reducedMotion
  const small = window.matchMedia('(max-width: 767px)').matches
  let W = 0
  let H = 0
  let dpr = 1
  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    W = window.innerWidth
    H = window.innerHeight
    cv.width = Math.round(W * dpr)
    cv.height = Math.round(H * dpr)
    cv.style.width = W + 'px'
    cv.style.height = H + 'px'
    if (still) draw(performance.now())
  }

  // Four riders, two per ellipse, counter-rotating. Speeds are deliberately brisk (a lap in ~15-25 s) so the
  // orbit reads as alive at a glance; scroll velocity adds to them.
  const nodes: Node[] = [
    { k: 0, a: 3.9, speed: 0.46, chrome: true, big: 1 },
    { k: 0, a: 0.75, speed: 0.46, chrome: false, big: 0.7 },
    { k: 1, a: 4.6, speed: -0.36, chrome: false, big: 1 },
    { k: 1, a: 1.5, speed: -0.36, chrome: true, big: 0.62 },
  ].map((n) => ({ ...n, ox: 0, oy: 0, vx: 0, vy: 0, trail: [] }))
  const motes = Array.from({ length: 14 }, (_, i) => ({ x: Math.random(), y: Math.random(), s: 0.4 + Math.random() * 0.9, p: i * 1.7 }))

  let raf = 0
  let last = performance.now()

  // One continuous clock: it follows the WebGL scene's clock (so line and glow stay in phase) and keeps running
  // from the wall clock if the scene ever pauses (hidden tab, mounting), so the orbit can never freeze.
  let seen = -1
  let off = 0
  const orbitTime = (now: number) => {
    if (motion.time !== seen) {
      seen = motion.time
      off = motion.time - now / 1000
    }
    return now / 1000 + off
  }

  function frame(now: number) {
    try {
      draw(now)
    } finally {
      if (!still) raf = requestAnimationFrame(frame)
    }
  }

  function draw(now: number) {
    const dt = Math.min((now - last) / 1000, 1 / 20)
    last = now
    const t = now / 1000
    const T = orbitTime(now)
    const c = ctx!
    c.setTransform(dpr, 0, 0, dpr, 0, 0)
    c.clearRect(0, 0, W, H)

    const hl = motion.halo
    const px = ((motion.pointer.x + 1) / 2) * W
    const py = ((1 - motion.pointer.y) / 2) * H
    const live = motion.pointerLive && !motion.lite
    const vel = motion.velocity / 2000
    const on = hl.r > 1 ? Math.min(1, hl.a / 0.9) : 0

    const pointOn = (k: number, a: number) => {
      const p = ringParams(k, T, hl.mx, vel)
      const rr = hl.r * p.rx
      const X = rr * Math.cos(a)
      const Y = rr * p.ratio * Math.sin(a)
      const cs = Math.cos(p.tilt)
      const sn = Math.sin(p.tilt)
      return [hl.x + X * cs - Y * sn, hl.y - (X * sn + Y * cs)] as const
    }

    if (on > 0.01) {
      c.lineCap = 'round'
      for (let k = 0; k < 2; k++) {
        const N = small ? 90 : 160
        let prev = pointOn(k, 0)
        for (let s = 1; s <= N; s++) {
          const a = (s / N) * Math.PI * 2
          const cur = pointOn(k, a)
          const front = Math.sin(a) < 0
          // brightness: front half stronger, tapering smoothly; glow pass then crisp core
          const mid = (s - 0.5) / N * Math.PI * 2
          let al = (front ? 0.22 : 0.62) * (0.7 + 0.3 * Math.sin(mid * 2 - t * 0.9 * (k ? -1 : 1) + k * 2.3)) * on
          for (const n of nodes) {
            if (n.k !== k) continue
            const d = Math.abs((((n.a - mid) % (Math.PI * 2)) + Math.PI * 3) % (Math.PI * 2) - Math.PI)
            al += Math.exp(-(d * d) / 0.09) * 0.7 * on
          }
          al = Math.min(al, 1)
          c.beginPath()
          c.moveTo(prev[0], prev[1])
          c.lineTo(cur[0], cur[1])
          c.strokeStyle = `rgba(200,225,255,${(al * 0.1).toFixed(3)})`
          c.lineWidth = 6
          c.stroke()
          c.strokeStyle = `rgba(255,255,255,${al.toFixed(3)})`
          c.lineWidth = 1
          c.stroke()
          prev = cur
        }
      }

      // marching light: a sparse neon dash train flowing along each ellipse, opposite directions
      for (let k = 0; k < 2; k++) {
        c.beginPath()
        for (let s = 0; s <= 120; s++) {
          const q = pointOn(k, (s / 120) * Math.PI * 2)
          s ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])
        }
        c.setLineDash([1.5, 22])
        c.lineDashOffset = still ? 0 : -t * 34 * (k ? -1 : 1)
        c.lineCap = 'round'
        c.strokeStyle = `rgba(228,255,26,${(0.75 * on).toFixed(3)})`
        c.lineWidth = 2.4
        c.stroke()
        c.setLineDash([])
      }

      for (const n of nodes) {
        if (!still) n.a += dt * (n.speed + vel * 0.35 * Math.sign(n.speed))
        const [bx, by] = pointOn(n.k, n.a)
        let ax = -n.ox * 16 - n.vx * 4.4
        let ay = -n.oy * 16 - n.vy * 4.4
        if (live && !still) {
          const ex = bx + n.ox - px
          const ey = by + n.oy - py
          const d = Math.hypot(ex, ey) + 1
          if (d < 200) {
            const f = (1 - d / 200) ** 3 * 650
            ax += (ex / d) * f
            ay += (ey / d) * f
          }
        }
        n.vx += ax * dt
        n.vy += ay * dt
        n.ox += n.vx * dt
        n.oy += n.vy * dt
        const x = bx + n.ox
        const y = by + n.oy
        const front = Math.sin(n.a) < 0
        const scale = Math.max(0.7, Math.min(W, H) / 800)
        c.globalAlpha = on * (front ? 0.55 : 1)
        n.trail.push(x, y)
        if (n.trail.length > 44) n.trail.splice(0, 2)
        const m = n.trail.length / 2
        for (let i = 1; i < m; i++) {
          const kk = i / m
          c.strokeStyle = n.chrome ? `rgba(255,255,255,${kk * 0.42})` : `rgba(228,255,26,${kk * 0.6})`
          c.lineWidth = 0.6 + kk * (n.chrome ? 2.4 : 2)
          c.lineCap = 'round'
          c.beginPath()
          c.moveTo(n.trail[(i - 1) * 2], n.trail[(i - 1) * 2 + 1])
          c.lineTo(n.trail[i * 2], n.trail[i * 2 + 1])
          c.stroke()
        }
        if (n.chrome) {
          chromeBead(c, x, y, 9.5 * scale * n.big, true)
        } else {
          const g = c.createRadialGradient(x, y, 0, x, y, 13 * n.big)
          g.addColorStop(0, 'rgba(240,255,120,0.95)')
          g.addColorStop(0.3, 'rgba(228,255,26,0.4)')
          g.addColorStop(1, 'rgba(228,255,26,0)')
          c.fillStyle = g
          c.beginPath()
          c.arc(x, y, 13 * n.big, 0, Math.PI * 2)
          c.fill()
          c.fillStyle = '#f4ff8a'
          c.beginPath()
          c.arc(x, y, 2.3, 0, Math.PI * 2)
          c.fill()
        }
        c.globalAlpha = 1
      }
    }

    // drifting motes
    for (const m of motes) {
      if (!still) {
        m.x += Math.sin(t * 0.3 * m.s + m.p) * 0.00025
        m.y += Math.cos(t * 0.27 * m.s + m.p * 1.3) * 0.00025 - (motion.velocity / 2000) * 0.0009 * m.s
      }
      if (m.y < -0.02) m.y = 1.02
      if (m.y > 1.02) m.y = -0.02
      const x = m.x * W
      const y = m.y * H
      let al = 0.22 + 0.18 * Math.sin(t * 1.4 * m.s + m.p)
      if (live) al += Math.max(0, 1 - Math.hypot(x - px, y - py) / 200) * 0.5
      c.fillStyle = `rgba(228,255,26,${Math.min(al, 1)})`
      c.beginPath()
      c.arc(x, y, 1 + m.s * 0.8, 0, Math.PI * 2)
      c.fill()
    }

  }

  window.addEventListener('resize', resize)
  resize()
  if (!still) raf = requestAnimationFrame(frame)
  return () => {
    cancelAnimationFrame(raf)
    window.removeEventListener('resize', resize)
  }
}
