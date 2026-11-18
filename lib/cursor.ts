/**
 * Metallic-glass sphere cursor with a luminous trail.
 *
 * Idle: a 22px chrome ball (bright sky on top, dark horizon band, warm bounce below, white specular).
 * Over anything interactive it swells to a 52px clear glass bubble with a neon rim, is gently pulled toward
 * the centre of the element (magnetic), and the trail turns neon. Motion is spring-eased, the trail is a short
 * fading polyline on a 2D canvas. Touch devices and reduced motion keep the system cursor.
 * Returns a cleanup function.
 */
const HOT = 'a[href],button,[role=button],summary,label,select,input,textarea,[data-cursor],.hv,.tile,.gb,.hv-pill,.chip'

export function startCursor(): () => void {
  if (typeof window === 'undefined') return () => {}
  if (matchMedia('(pointer: coarse)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches || !matchMedia('(pointer: fine)').matches) return () => {}

  const root = document.documentElement
  const ball = document.createElement('div')
  ball.setAttribute('aria-hidden', 'true')
  ball.className = 'mc-ball'
  const trail = document.createElement('canvas')
  trail.setAttribute('aria-hidden', 'true')
  trail.className = 'mc-trail'
  document.body.append(trail, ball)
  root.classList.add('mc-on')

  const ctx = trail.getContext('2d')!
  let W = 0
  let H = 0
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
  const resize = () => {
    W = innerWidth
    H = innerHeight
    trail.width = W * dpr
    trail.height = H * dpr
    trail.style.width = W + 'px'
    trail.style.height = H + 'px'
  }
  resize()

  let tx = -100
  let ty = -100
  let x = tx
  let y = ty
  let size = 22
  let hot = 0 // eased 0..1
  let target: Element | null = null
  let shown = false
  const pts: { x: number; y: number }[] = []

  const onMove = (e: PointerEvent) => {
    if (e.pointerType === 'touch') return
    tx = e.clientX
    ty = e.clientY
    const el = (e.target as Element | null)?.closest?.(HOT) ?? null
    target = el
    if (!shown) {
      shown = true
      x = tx
      y = ty
      ball.style.opacity = '1'
    }
  }
  const onLeave = () => {
    shown = false
    ball.style.opacity = '0'
  }
  const onDown = () => ball.classList.add('down')
  const onUp = () => ball.classList.remove('down')
  addEventListener('pointermove', onMove, { passive: true })
  document.addEventListener('pointerleave', onLeave)
  addEventListener('pointerdown', onDown)
  addEventListener('pointerup', onUp)
  addEventListener('resize', resize)

  let raf = 0
  let last = performance.now()
  const frame = (now: number) => {
    const dt = Math.min((now - last) / 1000, 1 / 20)
    last = now
    // magnet: when over an element, lean toward its centre (capped, so the ball still follows the pointer)
    let gx = tx
    let gy = ty
    if (target) {
      const r = target.getBoundingClientRect()
      if (r.width < 420 && r.height < 160) {
        gx = tx + (r.left + r.width / 2 - tx) * 0.28
        gy = ty + (r.top + r.height / 2 - ty) * 0.28
      }
    }
    const k = 1 - Math.exp(-dt * 22)
    x += (gx - x) * k
    y += (gy - y) * k
    hot += ((target ? 1 : 0) - hot) * (1 - Math.exp(-dt * 12))
    size = 22 + 30 * hot
    ball.style.transform = `translate3d(${x - size / 2}px, ${y - size / 2}px, 0)`
    ball.style.width = ball.style.height = size + 'px'
    ball.style.setProperty('--hot', hot.toFixed(3))

    pts.push({ x, y })
    if (pts.length > 26) pts.shift()
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, W, H)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    for (let i = 1; i < pts.length; i++) {
      const f = i / pts.length
      ctx.strokeStyle = `rgba(228,255,26,${(f * (0.25 + 0.45 * hot)).toFixed(3)})`
      ctx.lineWidth = 1 + f * (3.5 + 4.5 * hot)
      ctx.shadowColor = 'rgba(228,255,26,.9)'
      ctx.shadowBlur = 10 + 14 * hot
      ctx.beginPath()
      ctx.moveTo(pts[i - 1].x, pts[i - 1].y)
      ctx.lineTo(pts[i].x, pts[i].y)
      ctx.stroke()
    }
    ctx.shadowBlur = 0
    raf = requestAnimationFrame(frame)
  }
  raf = requestAnimationFrame(frame)

  return () => {
    cancelAnimationFrame(raf)
    removeEventListener('pointermove', onMove)
    document.removeEventListener('pointerleave', onLeave)
    removeEventListener('pointerdown', onDown)
    removeEventListener('pointerup', onUp)
    removeEventListener('resize', resize)
    ball.remove()
    trail.remove()
    root.classList.remove('mc-on')
  }
}
