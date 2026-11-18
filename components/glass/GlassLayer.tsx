'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import TrajectoryLayer from '../TrajectoryLayer'

const GlassCanvas = dynamic(() => import('./GlassCanvas'), { ssr: false })

function hasWebGL2() {
  try {
    const c = document.createElement('canvas')
    return !!c.getContext('webgl2')
  } catch {
    return false
  }
}

/**
 * Fixed full-viewport sky + glass behind the home page only. Inner pages are solid white: their
 * <main> fades in over this layer, and once it is covered the canvas is unmounted so no GPU time
 * is spent behind a page nobody can see. Going home mounts it again and it fades back in.
 * If WebGL2 is missing the home page falls back to a flat sky gradient.
 */
export default function GlassLayer() {
  const pathname = usePathname()
  const home = pathname === '/'
  const [ok, setOk] = useState(false)
  const [live, setLive] = useState(home)

  useEffect(() => {
    const yes = hasWebGL2()
    setOk(yes)
    document.documentElement.classList.toggle('webgl', yes)
  }, [])

  useEffect(() => {
    if (home) {
      setLive(true)
      return
    }
    const t = window.setTimeout(() => setLive(false), 700)
    return () => window.clearTimeout(t)
  }, [home])

  return (
    <div className="glass-layer pointer-events-none fixed inset-0 z-0 bg-[#9db7d5]" aria-hidden>
      {live && (
        <div key={String(home)} className="layer-in absolute inset-0">
          {!ok && <div className="absolute inset-0 bg-[linear-gradient(180deg,#86a8d0_0%,#a9c3df_55%,#dbe6f1_100%)]" />}
          {ok && <GlassCanvas />}
          <TrajectoryLayer />
        </div>
      )}
    </div>
  )
}
