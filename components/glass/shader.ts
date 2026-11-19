/**
 * One full-screen pass draws everything: a living sky and raymarched liquid glass in front of it.
 *
 * Sky:   gradient + domain-warped fbm clouds that drift continuously, a slowly wandering warm
 *        light, parallax from the pointer, extra drift speed from scroll velocity.
 * Glass: N spheres joined with a polynomial smooth-min, so they fuse and pinch like liquid.
 *        Shading = per-channel refraction (dispersion) of the SAME sky function, a short march
 *        through the volume, exit refraction, fresnel reflection, a thin chartreuse film.
 * Night: uNight blends the sky out to a black studio so the rest of the page keeps its pitch-black
 *        finish. It is driven by scroll (see sim.ts).
 */

export const CAM_Z = 9
/** 0.5 / tan(fov / 2) for a 35 degree vertical field of view. */
export const FOCAL = 1.5858
/** Half of the visible world height at z = 0. */
export const HALF_H = (0.5 * CAM_Z) / FOCAL
export const BALLS = 7

export const VERT = /* glsl */ `
void main() {
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`

export const FRAG = /* glsl */ `
precision highp float;

#define N ${BALLS}

uniform vec2  uRes;
uniform float uTime;
uniform float uDrift;
uniform float uNight;
uniform float uK;
uniform float uDim;
uniform float uVel;
uniform vec2  uMouse;
uniform vec4  uHalo; // cluster centre (uv), outer radius (uv), strength
uniform vec3  uPW; // pointer in world units (xy) + squish strength (z)
uniform vec4  uBalls[N];

const float CAM_Z = ${CAM_Z.toFixed(1)};
const float FOCAL = ${FOCAL.toFixed(4)};

// ---------------------------------------------------------------- noise

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p, int oct) {
  float s = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    if (i >= oct) break;
    s += a * vnoise(p);
    p = p * 2.03 + vec2(17.1, 9.7);
    a *= 0.5;
  }
  return s;
}


// ---------------------------------------------------------------- orbital halos

// Luminous rings wrapped around the glass. They live in the *sky* term, so every refracted lookup through the
// glass bends them with the bodies; "front" arcs are drawn once more over the glass so the rings wrap it.
// Each ring is split per colour channel (a hair apart) for prismatic edges, is an exact ellipse, tapers in
// brightness along its length, and is pushed away from the cursor.
vec3 rings(vec2 uv, float front) {
  if (uHalo.w < 0.002) return vec3(0.0);
  vec2 p = uv - uHalo.xy;
  float R = uHalo.z;
  vec2 ptr = uPW.xy * (FOCAL / CAM_Z);
  vec2 pd = uv - ptr;
  float pf = uPW.z * exp(-dot(pd, pd) / (2.0 * 0.11 * 0.11));
  float pushDir = dot(normalize(pd + 1e-4), normalize(p + 1e-4));
  vec3 acc = vec3(0.0);
  for (int k = 0; k < 2; k++) {
    float fk = float(k);
    float tilt = -0.55 + fk * 0.95 + 0.5 * sin(uTime * (0.21 + 0.05 * fk) + fk * 2.0) + uMouse.x * 0.10 - uVel * 0.08;
    float cs = cos(tilt), sn = sin(tilt);
    vec2 q = vec2(cs * p.x + sn * p.y, -sn * p.x + cs * p.y);
    q.y /= 0.50 + 0.17 * fk + 0.13 * sin(uTime * (0.31 - 0.07 * fk) + fk * 1.7);
    float th = atan(q.y, q.x);
    float r = length(q);
    float base = R * (1.06 + 0.22 * fk + 0.04 * sin(uTime * 0.27 + fk * 1.3));
    float rr = base - pf * pushDir * 0.035 * R; // exact ellipse; the cursor nudges it by a few pixels at most
    float near = smoothstep(-0.25, 0.45, -sin(th));
    float side = mix(1.0 - near, near * 0.22, front); // two ellipses, almost entirely behind the glass
    float taper = 0.62 + 0.38 * sin(th + uTime * 0.22 * (1.0 + fk * 0.4) + fk * 2.3);
    taper *= 1.0 + 0.9 * pf;
    for (int c = 0; c < 3; c++) {
      float off = (float(c) - 1.0) * (0.0035 + 0.0020 * fk) * (0.6 + R);
      float d = abs(r - rr - off);
      float core = exp(-pow(d / (0.0007 + 0.0006 * R), 2.0));
      float aura = exp(-pow(d / (0.018 * (0.5 + R)), 2.0));
      acc[c] += (core * 0.62 + aura * 0.045) * taper * side / (1.0 + fk * 0.5);
    }
  }
  vec3 tint = vec3(0.92, 0.97, 1.0);
  return acc * tint * uHalo.w * (front > 0.5 ? 0.85 : 1.0);
}

// ---------------------------------------------------------------- sky

// uv: screen space, vertical extent -0.5..0.5. oct: noise octaves (fewer for refracted samples).
vec3 skyCol(vec2 uv, int oct) {
  vec2 q = uv + uMouse * vec2(0.035, 0.022);

  // base gradient, deeper blue overhead and pale at the horizon
  float g = clamp(q.y + 0.5, 0.0, 1.0);
  vec3 c = mix(vec3(0.84, 0.89, 0.95), vec3(0.55, 0.69, 0.87), smoothstep(0.0, 0.5, g));
  c = mix(c, vec3(0.34, 0.52, 0.78), smoothstep(0.38, 1.0, g));

  // slow atmospheric shift: the whole sky warms and cools over about two minutes
  float shift = 0.5 + 0.5 * sin(uTime * 0.05);
  c = mix(c, c * vec3(1.035, 1.0, 0.955) + vec3(0.02, 0.012, 0.0), shift * 0.6);

  // a wandering warm light low on the left
  vec2 sun = vec2(-0.30 + 0.14 * sin(uTime * 0.045), -0.34 + 0.05 * cos(uTime * 0.037));
  c += vec3(1.0, 0.90, 0.72) * 0.34 * exp(-length(q - sun) * 2.2);

  // clouds: two warped fbm layers moving at different speeds read as depth
  vec2 cp = q * vec2(1.35, 2.5) + vec2(uDrift, 0.0);
  vec2 warp = vec2(fbm(cp * 0.7 + vec2(0.0, uTime * 0.018), 3), fbm(cp * 0.7 + vec2(5.2, 1.3) - vec2(uTime * 0.012, 0.0), 3));
  float n = fbm(cp + 1.6 * warp, oct);
  float far = fbm(q * vec2(0.9, 3.2) + vec2(uDrift * 0.45 + 11.0, uTime * 0.01), 3);

  float lowBand = smoothstep(0.12, -0.55, q.y);
  float cover = smoothstep(0.36, 0.74, n + lowBand * 0.62 - 0.04);
  float wisp = smoothstep(0.52, 0.80, far + lowBand * 0.2) * 0.35 * (1.0 - lowBand);

  // directional light on the cloud tops: compare the density with a sample nudged toward the sun, so the
  // sun-facing edges brighten and the far sides sink into blue-grey shadow (gives the clouds volume)
  vec2 toSun = normalize(sun - q);
  float n2 = fbm(cp + 1.6 * warp + toSun * vec2(0.16, 0.10), 3);
  float rim = clamp((n - n2) * 5.0, -1.0, 1.0);
  float lit = clamp(smoothstep(0.34, 0.9, n) + rim * 0.34, 0.0, 1.0);
  vec3 cloud = mix(vec3(0.43, 0.54, 0.72), vec3(1.0, 0.985, 0.955), lit);
  cloud += vec3(1.0, 0.86, 0.66) * (0.22 * exp(-length(q - sun) * 1.8) + 0.16 * max(rim, 0.0));

  c = mix(c, cloud, clamp(cover * 0.96 + wisp, 0.0, 1.0));
  // light vignette and a soft shaft from the sun keep the frame from reading flat
  c *= 1.0 - 0.16 * smoothstep(0.30, 0.95, length(uv));
  c += vec3(1.0, 0.93, 0.8) * 0.05 * smoothstep(0.0, 1.0, 1.0 - abs(dot(normalize(q - sun), vec2(0.62, 0.78)))) * exp(-length(q - sun) * 1.1);
  c += rings(uv, 0.0);
  return c;
}

vec3 skyEnv(vec3 d, int oct) {
  float fz = max(abs(d.z), 0.25);
  vec2 uv = clamp(d.xy / fz * FOCAL, vec2(-1.7), vec2(1.7));
  vec3 c = skyCol(uv, oct);

  // soft-box style speculars so reflections read as glossy glass
  vec3 key = normalize(vec3(-0.55, 0.65, 0.55));
  c += vec3(1.0) * 0.55 * smoothstep(0.62, 0.96, dot(d, key));
  float strip = smoothstep(0.10, 0.02, abs(d.x - 0.78)) * smoothstep(0.95, 0.25, abs(d.y - 0.05));
  c += vec3(0.95, 0.98, 1.0) * 0.7 * strip;
  vec3 m = normalize(vec3(uMouse * 1.1, 0.9));
  c += vec3(1.0) * 0.5 * smoothstep(0.93, 0.995, dot(d, m));
  return c;
}

// black studio used once the page has scrolled past the hero
vec3 studioEnv(vec3 d) {
  vec3 sky = vec3(0.50, 0.66, 0.86);
  float up = d.y * 0.5 + 0.5;
  vec3 c = sky * 0.018 * smoothstep(0.2, 1.0, up);
  vec3 key = normalize(vec3(-0.55, 0.65, 0.55));
  c += sky * 1.6 * smoothstep(0.80, 0.975, dot(d, key));
  float strip = smoothstep(0.10, 0.02, abs(d.x - 0.78)) * smoothstep(0.95, 0.25, abs(d.y - 0.05)) * step(0.0, d.z + 0.3);
  c += vec3(0.85, 0.92, 1.0) * 2.2 * strip;
  vec3 kick = normalize(vec3(0.2, -0.5, -0.8));
  c += vec3(0.95, 0.85, 0.55) * 0.9 * smoothstep(0.955, 0.995, dot(d, kick));
  vec3 m = normalize(vec3(uMouse * 1.1, 0.9));
  c += vec3(1.0) * 1.4 * smoothstep(0.93, 0.995, dot(d, m));
  c += sky * 0.015 * smoothstep(-0.2, -1.0, d.y);
  return c;
}

// Studio is in linear light and tone-mapped at the end; sky is already display-referred.
// Bring the studio into display space so both can be mixed.
vec3 studioDisplay(vec3 d) {
  vec3 s = studioEnv(d);
  return pow(1.0 - exp(-s * 1.4), vec3(1.0 / 2.2));
}

vec3 env(vec3 d, int oct) {
  if (uNight > 0.995) return studioDisplay(d);
  if (uNight < 0.005) return skyEnv(d, oct);
  return mix(skyEnv(d, oct), studioDisplay(d), uNight);
}

// ---------------------------------------------------------------- glass

float smin(float a, float b, float k) {
  float h = max(k - abs(a - b), 0.0) / k;
  return min(a, b) - h * h * k * 0.25;
}

float map(vec3 p) {
  float d = 1e4;
  for (int i = 0; i < N; i++) {
    vec4 b = uBalls[i];
    if (b.w > 0.001) {
      vec3 q = p - b.xyz;
      float rad = length(q) - b.w;
      if (uPW.z > 0.001) {
        // Magnetic swell: the surface lifts softly toward a nearby cursor and a faint ripple travels out from
        // that point. No stretching or twisting; the direction term fades to zero as the cursor reaches the
        // centre, so nothing can flip or snap.
        vec2 to = uPW.xy - b.xy;
        float dist = length(to);
        vec2 dir = to / (dist + b.w * 0.6);
        float w = uPW.z * exp(-pow(max(dist - b.w, 0.0) / (0.75 + b.w * 0.9), 2.0));
        float face = max(dot(normalize(q.xy + vec2(1e-4)), dir), 0.0);
        rad -= 0.075 * b.w * w * face * face;
        rad += 0.006 * w * sin(length(q.xy - dir * b.w) * 11.0 - uTime * 2.0) * face;
      }
      d = smin(d, rad, uK);
    }
  }
  d += 0.012 * sin(p.x * 4.0 + uTime * 0.9) * sin(p.y * 4.3 - uTime * 0.7) * sin(p.z * 3.7 + uTime * 0.5);
  return d;
}

vec3 calcNormal(vec3 p) {
  vec2 e = vec2(0.002, 0.0);
  return normalize(vec3(
    map(p + e.xyy) - map(p - e.xyy),
    map(p + e.yxy) - map(p - e.yxy),
    map(p + e.yyx) - map(p - e.yyx)
  ));
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  vec3 ro = vec3(0.0, 0.0, CAM_Z);
  vec3 rd = normalize(vec3(uv, -FOCAL));

  float t = 0.0;
  float md = 1e3;
  bool hit = false;
  for (int i = 0; i < 72; i++) {
    float d = map(ro + rd * t);
    md = min(md, d);
    if (d < 0.0015) { hit = true; break; }
    t += d * 0.9;
    if (t > 18.0) break;
  }

  vec3 col;

  if (hit) {
    vec3 p = ro + rd * t;
    vec3 n = calcNormal(p);
    float ndv = clamp(dot(-rd, n), 0.0, 1.0);
    float fres = pow(1.0 - ndv, 3.0);

    // wider spread than real glass on purpose: dispersion has to be visible against a smooth sky
    vec3 iors = vec3(1.38, 1.47, 1.60);
    vec3 trans = vec3(0.0);
    float thick = 0.0;

    for (int c = 0; c < 3; c++) {
      float ior = iors[c];
      vec3 r = refract(rd, n, 1.0 / ior);
      vec3 q = p - n * 0.01;
      float tt = 0.02;
      for (int j = 0; j < 14; j++) {
        float d = -map(q + r * tt);
        tt += max(d, 0.02);
        if (d < 0.004) break;
      }
      vec3 qe = q + r * tt;
      vec3 nOut = calcNormal(qe);
      vec3 o = refract(r, -nOut, ior);
      if (dot(o, o) < 0.001) o = reflect(r, -nOut);
      trans[c] = env(o, 3)[c];
      thick += tt / 3.0;
    }

    // nearly clear glass: very little body tint, so the sky reads through and the edges do the work
    vec3 absorb = vec3(0.055, 0.030, 0.014);
    trans *= exp(-thick * absorb);
    // keep the middle of each form airy: a share of the plain sky shows through the lens
    trans = mix(trans, skyCol(uv, 3) * 1.02, 0.42 * ndv);

    vec3 R = reflect(rd, n);
    vec3 refl = env(R, 3);
    col = trans * 0.95 + refl * (0.03 + 0.52 * fres);

    // metallic sheen: a chrome-style reflection (dark horizon band under a bright sky band, plus a long
    // soft-box streak) mixed in by fresnel, and a thin-film colour shift that rolls around the silhouette
    {
      float hz = R.y * 2.6 + 0.35 * sin(R.x * 3.0 + uTime * 0.2);
      vec3 chrome = mix(vec3(0.10, 0.15, 0.24), vec3(1.0, 1.0, 1.0), smoothstep(-0.15, 0.32, hz));
      chrome = mix(chrome, vec3(0.78, 0.60, 0.40), smoothstep(-0.55, -0.9, hz) * 0.5);
      float streak = smoothstep(0.045, 0.0, abs(R.x - 0.34 + 0.12 * R.y)) * smoothstep(0.1, 0.8, R.y + 0.4);
      chrome += vec3(1.0) * streak * 0.9;
      col = mix(col, chrome, 0.30 * pow(1.0 - ndv, 2.2));
      vec3 film = 0.5 + 0.5 * cos(6.2832 * ((1.0 - ndv) * 1.15 + vec3(0.0, 0.33, 0.67)));
      col += (film - 0.5) * 0.16 * smoothstep(0.5, 0.95, 1.0 - ndv);
    }
    // crisp speculars from two soft lights, one broad and one hard pinpoint
    vec3 L1 = normalize(vec3(-0.50, 0.70, 0.50));
    vec3 L2 = normalize(vec3(0.62, 0.30, 0.72));
    col += vec3(1.0, 0.99, 0.96) * (0.95 * pow(max(dot(R, L1), 0.0), 140.0) + 0.45 * pow(max(dot(R, L1), 0.0), 18.0) * fres);
    col += vec3(0.92, 0.97, 1.0) * 0.55 * pow(max(dot(R, L2), 0.0), 90.0);

    // the surface of a bubble reads as a dark hairline, then a bright inner rim, then a thin chartreuse film
    float a1 = 1.0 - ndv;
    float hair = smoothstep(0.935, 0.992, a1);
    col *= 1.0 - 0.55 * hair * (1.0 - uNight);
    float rimBand = smoothstep(0.66, 0.78, a1) * (1.0 - smoothstep(0.78, 0.90, a1));
    col += vec3(1.0) * 0.07 * rimBand;
    // warm cream-yellow film at the rim (the reference reads creamy, not lime)
    col += vec3(1.0, 0.96, 0.62) * pow(a1, 4.0) * mix(0.62, 0.20, uNight);
    // caustic crescent low on the side away from the key light
    float cau = pow(max(dot(n, normalize(vec3(0.5, -0.7, 0.3))), 0.0), 5.0) * smoothstep(0.2, 0.7, ndv);
    col += vec3(1.0, 0.98, 0.92) * 0.20 * cau;
    // prismatic edge: the fresnel band splits into red-outside / blue-inside fringes
    col += vec3(0.55, 0.18, 0.08) * smoothstep(0.86, 0.97, a1) * 0.06 + vec3(0.06, 0.20, 0.55) * smoothstep(0.70, 0.86, a1) * (1.0 - smoothstep(0.86, 0.95, a1)) * 0.06;
    // crisp organic edge line: a thin bright inner contour whose strength drifts around the silhouette,
    // sitting just inside the dark hairline so the outline reads sharp rather than blurred into the sky
    float ang = atan(n.y, n.x);
    float organic = 0.55 + 0.45 * sin(ang * 3.0 + uTime * 0.35 + n.z * 4.0) * sin(ang * 5.0 - uTime * 0.22);
    float edge = smoothstep(0.94, 0.968, a1) * (1.0 - smoothstep(0.968, 0.984, a1));
    col += vec3(0.94, 0.985, 1.0) * edge * (0.30 + 0.36 * organic);
    col += rings(uv, 1.0) * 0.16;
  } else {
    vec3 halo = vec3(0.45, 0.60, 0.85) * exp(-md * 5.0) * 0.03 * (0.7 + min(abs(uVel), 1.0) * 0.6);
    halo = pow(1.0 - exp(-halo * 1.4), vec3(1.0 / 2.2));
    vec3 bg = uNight > 0.995 ? vec3(0.0) : skyCol(uv, 5);
    col = mix(bg, halo, uNight);
    // ambient glow that hugs the glass, warm at the edge and cool further out
    float gl = exp(-md * 9.0);
    col += (vec3(0.80, 0.90, 1.0) * gl * 0.035 + vec3(1.0, 0.96, 0.78) * exp(-md * 26.0) * 0.07) * uHalo.w;
    col += rings(uv, 1.0);
  }

  col *= mix(1.0, uDim, uNight);

  // soft shoulder so highlights roll off instead of clipping
  vec3 over = max(col - 0.82, 0.0);
  col = min(col, vec3(0.82)) + 0.18 * tanh(over / 0.18);

  // film grade: faded blacks, split-toned (cool shadows, warm highlights), a touch less saturated,
  // a soft warm vignette, and grain that re-rolls ~24 times a second
  {
    float l = dot(col, vec3(0.299, 0.587, 0.114));
    col = mix(vec3(l), col, 0.88);
    col = mix(col * vec3(0.96, 1.0, 1.035), col * vec3(1.045, 1.0, 0.925), smoothstep(0.25, 0.85, l));
    col = col * 0.945 + 0.038;
    float vg = smoothstep(0.35, 1.05, length((gl_FragCoord.xy - 0.5 * uRes) / uRes.y * vec2(0.85, 1.0)));
    col *= 1.0 - 0.10 * vg * (1.0 - uNight);
    col += vec3(0.04, 0.025, 0.0) * vg * 0.5 * (1.0 - uNight);
    float gr = hash21(gl_FragCoord.xy + vec2(floor(uTime * 24.0) * 17.31, floor(uTime * 24.0) * 5.77)) - 0.5;
    col += gr * 0.028 * (0.35 + 0.65 * (1.0 - abs(l - 0.55) * 1.4)) * (1.0 - uNight);
  }

  // dither: always on in daylight (gradients band), kept off true black at night
  float lum = dot(col, vec3(0.333));
  float amp = 0.011 * mix(1.0, smoothstep(0.0, 0.05, lum), uNight);
  col += (hash21(gl_FragCoord.xy + fract(uTime)) - 0.5) * amp;

  gl_FragColor = vec4(col, 1.0);
}
`
