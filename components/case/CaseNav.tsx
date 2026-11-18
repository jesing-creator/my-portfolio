'use client'

import { useEffect, useRef, useState } from 'react'
import Icon, { stageIcons } from '@/components/Icon'

/**
 * Sticky section bar for a case study: scroll-spy highlights the section on screen in neon yellow, a thin
 * progress rule runs underneath, and on narrow screens it scrolls sideways instead of wrapping.
 */
export default function CaseNav({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = useState(items[0]?.id)
  const [progress, setProgress] = useState(0)
  const bar = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[]
    const onScroll = () => {
      const y = window.scrollY + window.innerHeight * 0.32
      let cur = items[0]?.id
      for (const el of els) if (el.offsetTop <= y) cur = el.id
      setActive(cur)
      const first = els[0]?.offsetTop ?? 0
      const last = document.documentElement.scrollHeight - window.innerHeight
      setProgress(Math.max(0, Math.min(1, (window.scrollY - first) / Math.max(1, last - first))))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [items])

  useEffect(() => {
    const b = bar.current?.querySelector<HTMLElement>('[aria-current="true"]')
    if (b && bar.current) bar.current.scrollTo({ left: b.offsetLeft - 24, behavior: 'smooth' })
  }, [active])

  return (
    <nav aria-label="Case study sections" className="sticky top-24 z-20 border-y border-hair bg-white/88 backdrop-blur-md">
      <ul ref={bar} className="gutter flex gap-1 overflow-x-auto py-3 [scrollbar-width:none]">
        {items.map((it, i) => (
          <li key={it.id} className="shrink-0">
            <a
              href={`#${it.id}`}
              aria-current={active === it.id ? 'true' : undefined}
              className={`flex items-center gap-2 rounded-full px-4 py-2 font-mono text-[11px] tracking-wide transition-colors duration-300 ${
                active === it.id ? 'bg-[#e4ff1a] text-[#0a0e14]' : 'text-[#3f4c5c] hover:bg-black/5'
              }`}
            >
              <Icon name={i === 0 ? 'work' : i === items.length - 1 ? 'impact' : stageIcons[(i - 1) % 5]} size={15} className="opacity-70" />
              {it.label}
            </a>
          </li>
        ))}
      </ul>
      <div aria-hidden className="h-px w-full bg-transparent">
        <div className="h-px origin-left bg-[#0a0e14]" style={{ transform: `scaleX(${progress})` }} />
      </div>
    </nav>
  )
}
