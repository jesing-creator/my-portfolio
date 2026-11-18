'use client'
/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useRef, useState } from 'react'

export type GalleryItem = { src: string; w: number; h: number; alt: string; caption: string }

/**
 * Thumbnails in a two-up grid; click opens a lightbox (arrows / swipe-free buttons, Esc to close, focus returns
 * to the thumbnail). Keeps every original board reachable without a wall of full-width pages.
 */
export default function Gallery({ items, label, single = false, bare = false }: { items: GalleryItem[]; label: string; single?: boolean; bare?: boolean }) {
  const [open, setOpen] = useState<number | null>(null)
  const opener = useRef<HTMLElement | null>(null)
  const close = useCallback(() => {
    setOpen(null)
    opener.current?.focus()
  }, [])
  const step = useCallback((d: number) => setOpen((o) => (o === null ? o : (o + d + items.length) % items.length)), [items.length])

  useEffect(() => {
    if (open === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, close, step])

  const cur = open === null ? null : items[open]
  return (
    <div>
      {!bare && (
      <div className="mb-5 flex items-baseline justify-between gap-4">
        <p className="tele">
          {label} · {items.length} {items.length === 1 ? 'figure' : 'figures'}
        </p>
        <p className="tele hidden sm:block">click to enlarge</p>
      </div>
      )}
      <ul className={bare ? (items.length > 1 && items.every((it) => it.w / it.h < 1) ? `grid items-start gap-x-4 gap-y-8 sm:gap-x-6 ${items.length === 2 ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3'}` : 'flex flex-col gap-8 md:gap-10') : `grid gap-4 ${items.length === 1 || single ? '' : 'sm:grid-cols-2'}`}>
        {items.map((it, i) => (
          <li key={it.src} className="min-w-0" >
            <button
              type="button"
              onClick={(e) => {
                opener.current = e.currentTarget
                setOpen(i)
              }}
              className={`group relative block ${bare ? 'w-fit max-w-full' : 'w-full'} cursor-zoom-in overflow-hidden transition-all duration-300 ${bare ? 'bg-transparent' : 'bg-white'} ${bare ? 'fig-card' : 'rounded-[14px] ring-1 ring-black/10 hover:ring-2 hover:ring-[#0a0e14]'}`}
              aria-label={`Enlarge: ${it.caption}`}
            >
              <img src={it.src} width={it.w} height={it.h} alt={it.alt} loading="lazy" decoding="async" className={bare ? 'fig-img block h-auto w-auto max-h-[min(70vh,680px)] max-w-full' : 'block h-auto w-full'} />
              <span className="chip absolute bottom-3 left-3 translate-y-1 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:opacity-100">
                enlarge ↗
              </span>
            </button>
            <p className={bare ? 'mt-3 font-mono text-[11px] leading-snug tracking-wide text-bone/55' : 'tele mt-2'}>{it.caption}</p>
          </li>
        ))}
      </ul>

      {cur && (
        <div role="dialog" aria-modal="true" aria-label={cur.caption} className="fixed inset-0 z-50 flex flex-col bg-[#0a0e14]/92 backdrop-blur-sm" onClick={close}>
          <div className="flex items-center justify-between gap-4 px-5 py-4 text-white" onClick={(e) => e.stopPropagation()}>
            <p className="font-mono text-[11px] tracking-wide opacity-80">
              {cur.caption} · {(open ?? 0) + 1}/{items.length}
            </p>
            <button type="button" onClick={close} className="chip" autoFocus>
              close ✕
            </button>
          </div>
          <div className="relative min-h-0 flex-1 overflow-auto px-4 pb-6" onClick={(e) => e.stopPropagation()}>
            <img src={cur.src} width={cur.w} height={cur.h} alt={cur.alt} className="mx-auto block h-auto max-h-none w-full max-w-[1500px] rounded-[10px] bg-white" />
          </div>
          {items.length > 1 && (
            <div className="flex justify-center gap-3 pb-5" onClick={(e) => e.stopPropagation()}>
              <button type="button" className="chip" onClick={() => step(-1)} aria-label="Previous board">
                ← prev
              </button>
              <button type="button" className="chip" onClick={() => step(1)} aria-label="Next board">
                next →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
