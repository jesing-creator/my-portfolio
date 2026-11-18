/**
 * Shared, mutable motion bus.
 *
 * Written by <MotionRoot> every animation frame (scroll, pointer, section progress),
 * read by the WebGL scene and by DOM readouts. It is deliberately NOT React state:
 * these values change 60x a second and must never trigger a re-render.
 */

export type Anchor = { x: number; y: number; r: number }

/** Per-frame subscribers run by the WebGL loop right after the sim step, so DOM overlays read this frame's orb positions. */
export const frameSubs = new Set<() => void>()

export const motion = {
  /** performance.now() of the last WebGL frame (overlays fall back to their own rAF when this goes stale). */
  glFrame: 0,
  /** Pointer in -1..1, y pointing up. */
  pointer: { x: -0.3, y: 0.15 },
  /** True once a real mouse has moved over the page (squish stays off until then). */
  pointerLive: false,
  /** px */
  scrollY: 0,
  /** px/s, smoothed, signed (positive = scrolling down). */
  velocity: 0,
  /** 0..1 — how far the hero has scrolled out. */
  heroOut: 0,
  /** 0..1 — the method section is approaching the viewport (0 = below the fold, 1 = pinned). */
  enter: 0,
  /** 0..1 — progress through the pinned method section. */
  decompose: 0,
  /** 0..1 — how far the glass has split into separate orbs (derived from decompose). */
  disperse: 0,
  /** 0..1 — the method section has scrolled away. */
  leave: 0,
  /** Screen-space (CSS px) centres + radii of the four orbs, written by the WebGL scene. */
  anchors: Array.from({ length: 4 }, (): Anchor => ({ x: 0, y: 0, r: 0 })),
  /** Halo-ring frame, CSS px: cluster centre, ring base radius, strength 0..1, smoothed pointer x. Written by the sim. */
  halo: { x: 0, y: 0, r: 0, a: 0, mx: 0 },
  /** Index (0..3) of the Four-relationships orb the pointer or a label is on, or -1. Written by Method, eased by the sim. */
  hot: -1,
  /** 0 on the home page, 1 on inner pages: the glass docks to the right edge. */
  dock: 0,
  /** 0..1 — the About section is centred in the viewport; the glass moves onto its stage. Written by lib/about-driver. */
  about: 0,
  /** About stage, CSS px: centre and half-width. */
  stage: { x: 0, y: 0, r: 0 },
  /** Which verb the About stage is performing: 0 Listening, 1 Connecting, 2 Designing. */
  verb: 0,
  /** Small screen or touch: no pointer parallax or repulsion, calmer simulation. */
  lite: false,
  /** Seconds, the WebGL clock. Written by the scene each frame so the 2D orbit layer animates in phase with the shader's rings. */
  time: 0,
  reducedMotion: false,
}

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t
export const smoothstep = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a))
  return t * t * (3 - 2 * t)
}
