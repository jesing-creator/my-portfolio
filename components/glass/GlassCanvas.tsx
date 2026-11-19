'use client'

import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { frameSubs, motion } from '@/lib/motion'
import { BALLS, FRAG, VERT } from './shader'
import { createSim, stepSim, type SimOutput } from './sim'

function Liquid() {
  const setDpr = useThree((s) => s.setDpr)
  const gl = useThree((s) => s.gl)
  const sim = useMemo(createSim, [])
  const out = useMemo<SimOutput>(() => ({ balls: new Float32Array(BALLS * 4), k: 0.8, dim: 1, night: 0, pw: [0, 0, 0], halo: [0, 0, 1, 0] }), [])
  const drift = useRef(0)
  const buffer = useMemo(() => new THREE.Vector2(), [])
  const perf = useRef({ warm: 0, acc: 0, frames: 0, dpr: Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1.25 : 1.5) })

  const uniforms = useMemo(
    () => ({
      uRes: { value: new THREE.Vector2(1, 1) },
      uTime: { value: 0 },
      uDrift: { value: 0 },
      uNight: { value: 0 },
      uK: { value: 0.8 },
      uDim: { value: 1 },
      uVel: { value: 0 },
      uMouse: { value: new THREE.Vector2() },
      uPW: { value: new THREE.Vector3() },
      uHalo: { value: new THREE.Vector4() },
      uBalls: { value: Array.from({ length: BALLS }, () => new THREE.Vector4()) },
    }),
    [],
  )

  // Build the material here, around this exact uniforms object. Declaring <shaderMaterial uniforms={...}> in JSX
  // left the material holding a shallow copy, so every scalar (uK, uTime, uDrift, uVel) froze at its initial
  // value: the glass melted into one blob (uK stuck at 0.8) and the clouds and shimmer stood still.
  const material = useMemo(
    () => new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms, depthTest: false, depthWrite: false }),
    [uniforms],
  )
  useEffect(() => () => material.dispose(), [material])

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 30)
    const { width, height } = state.size

    stepSim(sim, dt, state.clock.elapsedTime, width, height, out)

    gl.getDrawingBufferSize(buffer)
    uniforms.uRes.value.copy(buffer)
    uniforms.uTime.value = state.clock.elapsedTime
    motion.time = state.clock.elapsedTime
    // Clouds always drift; scrolling fast pushes them along (wind), and slows back down after.
    const wind = motion.reducedMotion ? 0.006 : 0.05 + Math.min(Math.abs(motion.velocity) / 1000, 3) * 0.09
    drift.current += dt * wind
    uniforms.uDrift.value = drift.current
    uniforms.uNight.value = out.night
    uniforms.uK.value = out.k
    uniforms.uDim.value = out.dim
    uniforms.uVel.value = motion.velocity / 2000
    uniforms.uMouse.value.set(sim.px, sim.py)
    uniforms.uPW.value.set(out.pw[0], out.pw[1], out.pw[2])
    uniforms.uHalo.value.set(out.halo[0], out.halo[1], out.halo[2], out.halo[3])
    for (let i = 0; i < BALLS; i++) {
      uniforms.uBalls.value[i].set(
        out.balls[i * 4],
        out.balls[i * 4 + 1],
        out.balls[i * 4 + 2],
        out.balls[i * 4 + 3],
      )
    }

    motion.glFrame = performance.now()
    frameSubs.forEach((fn) => fn())

    // Adaptive resolution: if the average frame is slow, trade pixels for smoothness.
    const p = perf.current
    // The first ~2 s (shader compile, dev-mode warm-up) are ignored, and the floor is 1x so edges never go jagged.
    p.warm += 1
    if (p.warm > 120) {
      p.acc += delta
      p.frames += 1
      if (p.frames === 90) {
        const avg = p.acc / p.frames
        if (avg > 0.028 && p.dpr > 1) {
          p.dpr = Math.max(1, p.dpr - 0.25)
          setDpr(p.dpr)
        }
        p.acc = 0
        p.frames = 0
      }
    }
  })

  return (
    <mesh frustumCulled={false} material={material}>
      <planeGeometry args={[2, 2]} />
    </mesh>
  )
}

export default function GlassCanvas() {
  return (
    <Canvas
      dpr={[1, typeof window !== 'undefined' && window.innerWidth < 768 ? 1.25 : 1.5]}
      gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 1] }}
      style={{ background: '#9db7d5' }}
      aria-hidden
    >
      <Liquid />
    </Canvas>
  )
}
