'use client'

import { useEffect, useRef, useState } from 'react'

type Item = { value: string; label: string }
const num = (v: string) => parseFloat(v.replace('%', ''))

/** Plays once when scrolled into view (static when reduced motion is on or IntersectionObserver is missing). */
function useInView<T extends Element>() {
  const ref = useRef<T>(null)
  const [on, setOn] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return setOn(true)
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setOn(true), io.disconnect()), { threshold: 0.35 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return [ref, on] as const
}

const R = 52
const C = 2 * Math.PI * R

/** Circular progress rings: a thick neon arc under a hairline ink arc, serif numeral in the middle. */
export function Rings({ title, items }: { title?: string; items: Item[] }) {
  const [ref, on] = useInView<HTMLDivElement>()
  return (
    <div ref={ref}>
      {title && <p className="tele mb-8">{title}</p>}
      <ul className="grid max-w-3xl grid-cols-3 gap-x-4 gap-y-10 sm:gap-x-10">
        {items.map((it, i) => {
          const v = Math.min(100, num(it.value))
          const off = C * (1 - (on ? v / 100 : 0))
          return (
            <li key={it.label} className="flex min-w-0 flex-col items-center text-center">
              <svg viewBox="0 0 132 132" role="img" aria-label={`${it.value} ${it.label}`} className="w-full max-w-[150px] -rotate-90">
                <circle cx="66" cy="66" r={R} fill="none" stroke="#0a0e14" strokeOpacity=".1" strokeWidth="1.5" />
                <circle cx="66" cy="66" r={R} fill="none" stroke="#e4ff1a" strokeWidth="9" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={off} style={{ transition: `stroke-dashoffset 1.4s cubic-bezier(.2,.7,.1,1) ${i * 0.15}s` }} />
                <circle cx="66" cy="66" r={R} fill="none" stroke="#0a0e14" strokeWidth="1.5" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={off} style={{ transition: `stroke-dashoffset 1.4s cubic-bezier(.2,.7,.1,1) ${i * 0.15}s` }} />
                <text x="66" y="66" transform="rotate(90 66 66)" textAnchor="middle" dominantBaseline="central" className="serif-r" fontSize="30" fill="#0a0e14">
                  {it.value}
                </text>
              </svg>
              <p className="mt-4 text-[14px] leading-snug text-bone/75">{it.label}</p>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/** Horizontal bars on a hairline track with a neon fill and an ink end tick. */
export function Bars({ title, items, max = 100, unit = '%' }: { title?: string; items: Item[]; max?: number; unit?: string }) {
  const [ref, on] = useInView<HTMLDivElement>()
  return (
    <div ref={ref}>
      {title && <p className="tele mb-6">{title}</p>}
      <ul className="flex max-w-3xl flex-col gap-6">
        {items.map((it, i) => {
          const pct = Math.min(100, (num(it.value) / max) * 100)
          return (
            <li key={it.label} className="grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-2">
              <span className="text-[15px] leading-snug text-bone/85">{it.label}</span>
              <span className="serif-r text-[1.6rem] leading-none text-bone">{it.value.includes('%') || unit === '' ? it.value : it.value + unit}</span>
              <div className="relative col-span-2 h-[10px]" role="img" aria-label={`${it.label}: ${it.value}`}>
                <div className="absolute inset-x-0 top-1/2 h-px bg-black/15" />
                <div className="absolute inset-y-0 left-0 bg-[#e4ff1a]" style={{ width: on ? `${pct}%` : '0%', transition: `width 1.2s cubic-bezier(.2,.7,.1,1) ${i * 0.12}s` }}>
                  <span className="absolute -right-px top-[-3px] h-[16px] w-[2px] bg-[#0a0e14]" />
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/** Two scores per row out of 10 (usefulness / feasibility), drawn as paired bars. */
export function Scores({ caption, head, rows }: { caption: string; head: string[]; rows: string[][] }) {
  const [ref, on] = useInView<HTMLDivElement>()
  return (
    <div ref={ref}>
      <p className="tele mb-8">{caption}</p>
      <div className="mb-3 hidden gap-x-10 sm:grid sm:grid-cols-[minmax(10rem,1fr)_2fr]">
        <span />
        <span className="tele flex gap-10">
          {head.slice(1).map((h, k) => (
            <span key={h} className="flex flex-1 items-center gap-2">
              <i className={`inline-block h-[8px] w-[14px] ${k === 0 ? 'bg-[#e4ff1a] ring-1 ring-[#0a0e14]' : 'bg-[#0a0e14]'}`} />
              {h}
            </span>
          ))}
        </span>
      </div>
      <ul>
        {rows.map((r, i) => (
          <li key={r[0]} className="grid items-center gap-x-10 gap-y-3 border-t border-hair py-5 sm:grid-cols-[minmax(10rem,1fr)_2fr]">
            <span className="text-[15px] leading-snug">{r[0]}</span>
            <span className="flex gap-6 sm:gap-10">
              {r.slice(1).map((v, k) => (
                <span key={k} className="flex flex-1 flex-col gap-2">
                  <span className="serif-r text-[1.5rem] leading-none">
                    {v}
                    <small className="tele ml-1">/10</small>
                  </span>
                  <span className="relative h-[8px] w-full">
                    <span className="absolute inset-x-0 top-1/2 h-px bg-black/15" />
                    <span className={`absolute inset-y-0 left-0 ${k === 0 ? 'bg-[#e4ff1a] ring-1 ring-[#0a0e14]' : 'bg-[#0a0e14]'}`} style={{ width: on ? `${num(v) * 10}%` : '0%', transition: `width 1.1s cubic-bezier(.2,.7,.1,1) ${i * 0.1}s` }} />
                  </span>
                </span>
              ))}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
