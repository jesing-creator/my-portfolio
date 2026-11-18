'use client'

import { useEffect, useRef } from 'react'
import { startTrajectory } from '@/lib/trajectory'

/** Live orbit lines and light sparks above the glass (see lib/trajectory.ts for the behaviour). */
export default function TrajectoryLayer() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => (ref.current ? startTrajectory(ref.current) : undefined), [])
  return <canvas ref={ref} aria-hidden className="trail-layer pointer-events-none absolute inset-0 transition-opacity duration-700" />
}
