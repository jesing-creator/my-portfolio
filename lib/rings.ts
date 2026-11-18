/**
 * Geometry of the two orbit ellipses, shared by the shader (soft, refracted rings) and the 2D layer
 * (crisp lines and chrome nodes) so the two always coincide. All angles in radians, uv/pixel agnostic:
 * `rx` is the semi-major axis as a multiple of the base radius R; the minor axis is rx * ratio.
 * Slants: about -31 deg and +23 deg; k is 0 or 1.
 */
export function ringParams(k: number, t: number, mx: number, vel: number) {
  return {
    // the orbit planes visibly swing (about +/-0.5 rad, a cycle every ~30 s), nod open and closed like a tipping
    // plane in 3D (ratio), and breathe in size; the two rings run at different rates so they drift through each other
    tilt: -0.55 + k * 0.95 + 0.5 * Math.sin(t * (0.21 + 0.05 * k) + k * 2) + mx * 0.1 - vel * 0.08,
    ratio: 0.5 + 0.17 * k + 0.13 * Math.sin(t * (0.31 - 0.07 * k) + k * 1.7),
    rx: 1.06 + 0.22 * k + 0.04 * Math.sin(t * 0.27 + k * 1.3),
  }
}
