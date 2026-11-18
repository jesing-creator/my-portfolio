'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { motion, useReducedMotion } from 'framer-motion'

let booted = false

/**
 * Route transition (mounted from app/template.tsx, so it remounts on every navigation).
 * Enter: content fades up out of a soft blur while a thin neon wipe sweeps off the top.
 * Exit: internal link clicks are held ~320ms while the page fades and blurs out, then the router continues.
 * The WebGL glass lives in the layout, so it keeps flowing underneath the whole time.
 */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion()
  const router = useRouter()
  const path = usePathname()
  const [leaving, setLeaving] = useState(false)
  const first = useRef(!booted)
  const wrap = useRef<HTMLDivElement>(null)
  useEffect(() => {
    booted = true
  }, [])

  useEffect(() => {
    if (reduce) return
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as HTMLElement).closest?.('a[href]') as HTMLAnchorElement | null
      if (!a || a.target || a.hasAttribute('download')) return
      const u = new URL(a.href, location.href)
      if (u.origin !== location.origin || u.pathname === path) return
      e.preventDefault()
      setLeaving(true)
      window.setTimeout(() => router.push(u.pathname + u.search + u.hash), 320)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [reduce, router, path])

  if (reduce) return <>{children}</>
  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[3px] origin-left bg-[#e4ff1a] shadow-[0_0_24px_#e4ff1a]"
        initial={{ scaleX: first.current ? 0 : 1, opacity: 1 }}
        animate={{ scaleX: leaving ? 1 : first.current ? 0 : 0, opacity: leaving ? 1 : 0 }}
        transition={{ duration: leaving ? 0.32 : 0.7, ease: [0.22, 0.8, 0.2, 1] }}
      />
      <motion.div
        ref={wrap}
        onAnimationComplete={() => {
          // a lingering filter/transform would become the containing block for fixed children (the lightbox)
          if (!leaving && wrap.current) {
            wrap.current.style.filter = 'none'
            wrap.current.style.transform = 'none'
          }
        }}
        initial={first.current ? false : { opacity: 0, y: 18, filter: 'blur(14px)' }}
        animate={leaving ? { opacity: 0, y: -10, filter: 'blur(12px)' } : { opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: leaving ? 0.3 : 0.75, ease: [0.22, 0.8, 0.2, 1] }}
      >
        {children}
      </motion.div>
    </>
  )
}
