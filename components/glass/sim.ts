import { motion, lerp, smoothstep } from '@/lib/motion'
import { ABOUT_LAYOUTS } from '@/lib/about-layouts'
import { BALLS, CAM_Z, FOCAL, HALF_H } from './shader'

/**
 * Tiny spring simulation for the glass bodies.
 *
 * Every ball is a damped spring chasing a "home". The home is blended between two layouts:
 *   cluster  - the fused lump from the hero,
 *   disperse - four separate orbs (one per ingredient) plus three satellites.
 * On top of the springs: pointer repulsion, and scroll velocity as an inertial force that
 * is weighted differently per ball, so a fast scroll stretches the lump and snaps it back.
 */

type Ball = { x: number; y: number; z: number; vx: number; vy: number }

// x, y, z, radius in cluster units
const CLUSTER: [number, number, number, number][] = [
  // one cohesive cluster: four main spheres just kissing round a small core sphere, three small ones hugging the
  // outside. 0..3 are the four "ingredient" orbs, 4 is the core, 5..6 and 7 hug the cluster.
  // measured from the reference composition: the top-left and right spheres kiss, the core bubble sits in the
  // notch under them, the two lower spheres float free, and the two small ones bud off the upper pair
  [-0.78, 1.41, 0.0, 0.95],
  [1.12, 0.6, 0.05, 1.1],
  [-1.21, -0.49, 0.0, 0.8],
  [0.5, -1.82, 0.0, 0.92],
  [-0.05, 0.25, 0.1, 0.4],
  [2.18, 1.3, 0.1, 0.28],
  [-1.88, 0.95, 0.1, 0.3],
]

// x, y as fractions of half width / half height, then radius in world units
const SPREAD_WIDE: [number, number, number][] = [
  // x = (screen x / half width) - 1, y likewise. Four orbs descend in index order through the middle band, between
  // the project cards (left, orbs take the open space to their right); three small satellites sit between them
  [0.25, 0.27, 0.5],
  [0.56, -0.04, 0.42],
  [0.22, -0.42, 0.54],
  [0.57, -0.76, 0.4],
  [0.5, 0.62, 0.1],
  [0.82, 0.18, 0.1],
  [0.36, -0.95, 0.12],
]
const SPREAD_TALL: [number, number, number][] = [
  // phones: a loose 2x2 in the band between the heading and the case info (about 22-52% of the height)
  [-0.5, 0.4, 0.34],
  [0.45, 0.37, 0.34],
  [-0.28, 0.1, 0.36],
  [0.34, 0.07, 0.32],
  [0.05, 0.43, 0.09],
  [-0.78, 0.25, 0.09],
  [0.75, 0.23, 0.1],
]

export type Sim = {
  balls: Ball[]
  board: number
  dock: number
  enter: number
  leave: number
  disp: number
  about: number
  ph: number[]
  px: number
  py: number
  squish: number
  hot: number[]
}

export function createSim(): Sim {
  return {
    balls: CLUSTER.map(([x, y, z]) => ({ x, y, z, vx: 0, vy: 0 })),
    board: 0,
    dock: 0,
    enter: 0,
    leave: 0,
    disp: 0,
    about: 0,
    ph: [1, 0, 0],
    px: 0,
    py: 0,
    squish: 0,
    hot: [0, 0, 0, 0],
  }
}

const ease = (dt: number, rate: number) => 1 - Math.exp(-dt * rate)

export type SimOutput = {
  /** x, y, z, r per ball, flat array of length BALLS * 4 */
  balls: Float32Array
  k: number
  dim: number
  /** Unused now (always 0): the sky is the only environment. */
  night: number
  /** pointer in world units + squish strength 0..1 */
  pw: [number, number, number]
  /** halo cluster centre (uv), outer radius (uv), strength */
  halo: [number, number, number, number]
}

export function stepSim(sim: Sim, dt: number, t: number, W: number, H: number, out: SimOutput) {
  const aspect = W / H
  const halfW = HALF_H * aspect
  const tall = aspect < 0.9

  // Smooth the scroll-derived targets so jumps in scroll never teleport the glass.
  const boardT = smoothstep(0.15, 0.9, motion.heroOut)
  sim.board += (boardT - sim.board) * ease(dt, 3.5)
  sim.dock += (motion.dock - sim.dock) * ease(dt, 2.2)
  sim.enter += (motion.enter - sim.enter) * ease(dt, 3.5)
  sim.leave += (motion.leave - sim.leave) * ease(dt, 3.5)
  sim.disp += (motion.disperse - sim.disp) * ease(dt, 4.5)
  sim.about += (motion.about - sim.about) * ease(dt, 3.2)
  for (let k = 0; k < 3; k++) sim.ph[k] += ((motion.verb === k ? 1 : 0) - sim.ph[k]) * ease(dt, 2.4)
  // About stage (px -> world units at z = 0)
  const pw = CAM_Z / (FOCAL * H)
  const stX = (motion.stage.x - W / 2) * pw
  const stY = (H / 2 - motion.stage.y) * pw
  const stR = motion.stage.r * pw

  sim.px += (motion.pointer.x - sim.px) * ease(dt, 4.5)
  sim.py += (motion.pointer.y - sim.py) * ease(dt, 4.5)

  // Where the cluster lives in each state (world units).
  const heroPos = tall ? [0, HALF_H * 0.5] : [halfW * 0.14, HALF_H * 0.14]
  const heroScale = tall ? 0.4 : 0.6
  const boardPos = tall ? [halfW * 0.7, HALF_H * 0.55] : [halfW * 0.88, HALF_H * 0.3]
  const boardScale = tall ? 0.34 : 0.5
  const parkPos = tall ? [halfW * 0.5, -HALF_H * 0.7] : [halfW * 0.7, -HALF_H * 0.45]
  const parkScale = tall ? 0.34 : 0.5

  let cx = lerp(heroPos[0], boardPos[0], sim.board)
  let cy = lerp(heroPos[1], boardPos[1], sim.board)
  let cs = lerp(heroScale, boardScale, sim.board)

  const centreScale = tall ? 0.5 : 0.8
  cx = lerp(cx, 0, sim.enter)
  cy = lerp(cy, 0, sim.enter)
  cs = lerp(cs, centreScale, sim.enter)

  cx = lerp(cx, parkPos[0], sim.leave)
  cy = lerp(cy, parkPos[1], sim.leave)
  cs = lerp(cs, parkScale, sim.leave)

  // Docked (inner pages): a small, quiet cluster half tucked behind the right edge. It rides slowly
  // down the edge as the page scrolls, so it reads as the same object travelling with you.
  if (sim.dock > 0.001) {
    const doc = Math.max(1, document.documentElement.scrollHeight - H)
    const prog = Math.min(1, motion.scrollY / doc)
    const dockScale = tall ? 0.2 : 0.3
    const dx = halfW * (tall ? 1.02 : 0.97)
    const dy = lerp(HALF_H * 0.45, -HALF_H * 0.5, prog)
    cx = lerp(cx, dx, sim.dock)
    cy = lerp(cy, dy, sim.dock)
    cs = lerp(cs, dockScale, sim.dock)
  }

  const spread = tall ? SPREAD_TALL : SPREAD_WIDE
  const pointerWorldX = sim.px * halfW
  const pointerWorldY = sim.py * HALF_H
  const calm = motion.reducedMotion ? 0.25 : motion.lite ? 0.6 : 1
  const scrollForce = Math.max(-4000, Math.min(4000, motion.velocity)) * 0.02 * calm

  for (let i = 0; i < BALLS; i++) {
    const b = sim.balls[i]
    const [hx, hy, hz, hr] = CLUSTER[i]
    const [sx, sy, sr] = spread[i]

    // Blend between the two layouts.
    const floatX = (Math.sin(t * (0.31 + i * 0.047) + i * 1.9) * 0.16 + Math.sin(t * 0.83 + i) * 0.04) * cs * calm
    const floatY = (Math.cos(t * (0.27 + i * 0.039) + i * 1.3) * 0.2 + Math.cos(t * 0.71 + i * 2) * 0.05) * cs * calm
    let rad = lerp(hr * cs, sr, sim.disp)
    let tx = lerp(cx + hx * cs + floatX, sx * halfW, sim.disp)
    let ty = lerp(cy + hy * cs + floatY, sy * HALF_H, sim.disp)
    if (sim.about > 0.001) {
      // On the About stage the glass performs the current verb; layouts blend as the verb changes.
      let lx = 0, ly = 0, lr = 0
      for (let k = 0; k < 3; k++) {
        const w = sim.ph[k]
        const L = ABOUT_LAYOUTS[k][i]
        lx += w * L[0]; ly += w * L[1]; lr += w * L[2]
      }
      const fx = Math.sin(t * (0.5 + i * 0.07) + i * 2) * 0.035 * calm
      const fy = Math.cos(t * (0.43 + i * 0.05) + i * 1.4) * 0.035 * calm
      tx = lerp(tx, stX + (lx + fx) * stR, sim.about)
      ty = lerp(ty, stY - (ly + fy) * stR, sim.about)
      rad = lerp(rad, lr * stR, sim.about)
    }
    if (i < 4) {
      // the orb under the cursor (or its label) swells a little, eased, only while the four are split apart
      sim.hot[i] += ((motion.hot === i ? sim.disp : 0) - sim.hot[i]) * ease(dt, 6)
      rad *= 1 + 0.09 * sim.hot[i]
    }

    // Spring toward home (slightly underdamped = liquid).
    let ax = (tx - b.x) * 38 - b.vx * 6.5
    let ay = (ty - b.y) * 38 - b.vy * 6.5

    // Scroll inertia, weighted per ball so the lump stretches rather than translating.
    ay += scrollForce * (0.5 + i * 0.2)
    ax += scrollForce * 0.25 * Math.sin(i * 2.1)

    // Pointer repulsion.
    const dx = b.x - pointerWorldX
    const dy = b.y - pointerWorldY
    const dist = Math.hypot(dx, dy) + 1e-4
    const reach = rad + 0.55 * Math.max(cs, 0.5)
    if (!motion.lite) {
      // Magnetic float: droplets lean gently toward a cursor that hovers nearby, and ease away only if it
      // gets close, so they glide rather than get shoved. Both forces are smooth bells, no hard edges.
      const far = reach * 2.6
      if (dist < far) {
        const pull = Math.exp(-(((dist - reach * 1.5) / (reach * 0.9)) ** 2)) * 5.5 * calm
        ax -= (dx / dist) * pull
        ay -= (dy / dist) * pull
      }
      if (dist < reach) {
        const f = (1 - dist / reach) ** 3 * 16 * calm
        ax += (dx / dist) * f
        ay += (dy / dist) * f
      }
    }

    b.vx += ax * dt
    b.vy += ay * dt
    b.x += b.vx * dt
    b.y += b.vy * dt
    b.z = hz * cs * (1 - sim.about)

    out.balls[i * 4 + 0] = b.x
    out.balls[i * 4 + 1] = b.y
    out.balls[i * 4 + 2] = b.z
    out.balls[i * 4 + 3] = rad

    if (i < 4) {
      // Project to CSS pixels so DOM labels can follow the orbs.
      const s = FOCAL / (CAM_Z - b.z)
      const a = motion.anchors[i]
      a.x = W / 2 + b.x * s * H
      a.y = H / 2 - b.y * s * H
      a.r = rad * s * H
    }
  }

  // Squish strength eases in when a real pointer is moving, and relaxes away when it stops or leaves.
  const active = !motion.lite && !motion.reducedMotion && motion.pointerLive ? 1 : 0
  sim.squish += (active - sim.squish) * ease(dt, 2.6)
  out.pw[0] = pointerWorldX
  out.pw[1] = pointerWorldY
  out.pw[2] = sim.squish

  // Halo rings track the hero cluster: centroid + extent of the four main bodies in uv units.
  {
    let hx = 0, hy = 0
    for (let i = 0; i < 4; i++) {
      const b = sim.balls[i]
      const s = FOCAL / (CAM_Z - b.z)
      hx += b.x * s
      hy += b.y * s
    }
    hx /= 4
    hy /= 4
    let ext = 0
    for (let i = 0; i < 4; i++) {
      const b = sim.balls[i]
      const s = FOCAL / (CAM_Z - b.z)
      ext = Math.max(ext, Math.hypot(b.x * s - hx, b.y * s - hy) + out.balls[i * 4 + 3] * s)
    }
    out.halo[0] = hx
    out.halo[1] = hy
    out.halo[2] = ext * 0.82
    out.halo[3] = 0.9 * (1 - smoothstep(0.0, 0.7, sim.disp)) * (1 - sim.board * 0.55) * (1 - sim.leave) * (1 - sim.about)
  }

  motion.halo.x = W / 2 + out.halo[0] * H
  motion.halo.y = H / 2 - out.halo[1] * H
  motion.halo.r = out.halo[2] * H
  motion.halo.a = out.halo[3]
  motion.halo.mx = sim.px

  out.k = lerp(lerp(0.13 * cs, 0.2, sim.disp), 0.14 * stR, sim.about)
  out.dim = 1
  out.night = 0
}
