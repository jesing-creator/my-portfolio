/**
 * The About stage's choreography. One layout per verb, for the seven glass bodies, in stage units:
 * x right, y DOWN, both in multiples of the stage's half-width; r is the radius in the same unit.
 * The sim blends between these; `overlaySvg` draws the matching guide lines (ripples, bridges, construction
 * lines) in the same coordinates, so the glass and the drawing always agree.
 */
export type Body = [x: number, y: number, r: number]

export const VERBS = ['Listening', 'Connecting', 'Designing'] as const

export const ABOUT_LAYOUTS: Body[][] = [
  // Listening: one large body at the centre, small ones (voices) around it
  [[0, 0, 0.39], [0.66, -0.46, 0.115], [-0.72, 0.3, 0.14], [0.42, 0.7, 0.105], [-0.4, -0.72, 0.06], [0.85, 0.2, 0.05], [-0.2, 0.88, 0.05]],
  // Connecting: two bodies drawn together into one bridge, the others reaching toward them
  [[-0.3, 0.04, 0.33], [0.3, -0.02, 0.31], [-0.68, -0.58, 0.15], [0.68, 0.58, 0.15], [0, -0.74, 0.06], [0, 0.76, 0.06], [0.9, -0.2, 0.05]],
  // Designing: placed on a grid, with construction lines
  [[-0.42, -0.4, 0.3], [0.42, -0.4, 0.2], [-0.42, 0.42, 0.2], [0.42, 0.42, 0.3], [0, -0.4, 0.05], [0, 0.42, 0.05], [0, 0, 0.07]],
]

const f = (n: number) => n.toFixed(3)

/** Guide drawings, one group per verb; the stage's data-phase decides which is visible. */
export function overlaySvg(): string {
  const [L, C, D] = ABOUT_LAYOUTS
  const voice = (b: Body) => `<line x1="${f(b[0])}" y1="${f(b[1])}" x2="0" y2="0" class="ov-flow"/>`
  const link = (a: Body, b: Body) => `<line x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}" class="ov-flow"/>`
  const tick = (x: number, y: number) => `<path d="M${f(x - 0.05)} ${f(y)}H${f(x + 0.05)}M${f(x)} ${f(y - 0.05)}V${f(y + 0.05)}"/>`
  return `<svg class="ov" viewBox="-1.05 -1.05 2.1 2.1" aria-hidden="true" focusable="false">
<g class="ov-l"><circle class="rip" r="0.5"/><circle class="rip" r="0.5" style="animation-delay:1.2s"/><circle class="rip" r="0.5" style="animation-delay:2.4s"/>${voice(L[1])}${voice(L[2])}${voice(L[3])}</g>
<g class="ov-c">${link(C[2], C[0])}${link(C[3], C[1])}<circle class="knot" cx="0" cy="0.01" r="0.04"/></g>
<g class="ov-d"><rect x="${f(D[0][0])}" y="${f(D[0][1])}" width="${f(D[1][0] - D[0][0])}" height="${f(D[2][1] - D[0][1])}" class="ov-frame"/><path d="M-1 0H1M0 -1V1" class="ov-axis"/>${D.slice(0, 4).map((b) => tick(b[0], b[1])).join('')}<path d="M${f(D[0][0])} 0.86V0.94M${f(D[1][0])} 0.86V0.94M${f(D[0][0])} 0.9H${f(D[1][0])}"/></g>
</svg>`
}
