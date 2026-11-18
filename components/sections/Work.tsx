'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { frameSubs, motion, smoothstep } from '@/lib/motion'
import { projects, tint } from '@/lib/projects'

/**
 * Selected work, one plain full-screen section (no pinning). Entering it eases the glass apart into four orbs, one per
 * relationship. Everything about a project lives in one card on the left: thumbnail, year, status, title,
 * one line of description, its "Human ↔ …" tag and (when active) "Read the case". The active card, its orb and its numeral
 * light up together. Hover, focus or tap a card (or hover an orb) and card, orb and line switch together.
 * Nothing is repeated on the right; the orbs have that space.
 *
 * Layout is a fixed grid and never chases the orbs. On phones the cards become a 2x2 of thumbnails + tags
 * under the orbs, with a small detail block (the only place the description lives there) above them.
 */
export default function Work() {
  const rows = useRef<(HTMLLIElement | null)[]>([])
  const heads = useRef<(HTMLSpanElement | null)[]>([])
  const nums = useRef<(HTMLSpanElement | null)[]>([])
  const panel = useRef<HTMLDivElement>(null)
  const over = useRef(-1)
  const sel = useRef(0)
  const [shown, setShown] = useState(0)
  const [more, setMore] = useState(false)
  const p = projects[shown]

  useEffect(() => {
    let raf = 0
    let last = 0
    let idle = false
    // Runs right after the WebGL sim step (frameSubs), so leader lines and numerals use this frame's orb positions.
    const run = () => {
      if (idle && motion.disperse < 0.002) return // section is out of view and already faded: nothing to do
      {
        // the theme under the cursor wins, then the orb under the cursor, else the one last chosen
        let hot = over.current
        if (hot < 0 && motion.pointerLive && motion.disperse > 0.9) {
          const px = ((motion.pointer.x + 1) / 2) * window.innerWidth
          const py = ((1 - motion.pointer.y) / 2) * window.innerHeight
          motion.anchors.forEach((a, k) => {
            if (Math.hypot(a.x - px, a.y - py) < a.r + 10) hot = k
          })
        }
        if (hot >= 0) sel.current = hot
        hot = sel.current
        motion.hot = hot
        if (hot !== last) {
          last = hot
          setShown(hot)
        }
        const all = smoothstep(0.5, 0.72, motion.disperse)
        if (panel.current) {
          panel.current.style.opacity = String(all)
          panel.current.style.pointerEvents = all > 0.9 ? 'auto' : 'none'
        }
        projects.forEach((_, i) => {
          const li = rows.current[i]
          const nm = nums.current[i]
          const a = motion.anchors[i]
          const show = smoothstep(0.5 + i * 0.05, 0.72 + i * 0.05, motion.disperse)
          const on = hot === i
          if (li) {
            li.dataset.hot = String(on)
            li.style.opacity = String(show)
            li.style.pointerEvents = show > 0.9 ? 'auto' : 'none'
          }
          if (nm) {
            nm.dataset.hot = String(on)
            nm.style.opacity = String(show)
            nm.style.transform = `translate3d(${a.x}px, ${a.y}px, 0) translate(-50%, -50%)`
          }
        })
        idle = motion.disperse < 0.002
      }
    }
    frameSubs.add(run)
    // No WebGL (or a stalled loop): drive the overlays from our own rAF instead.
    const tick = () => {
      if (performance.now() - motion.glFrame > 120) run()
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      frameSubs.delete(run)
    }
  }, [])

  return (
    <section id="work" aria-labelledby="work-title" className="relative">
      <div className="relative min-h-svh overflow-hidden">
        <header className="gutter relative pt-24 md:pt-28">
          <h2 id="work-title" className="hv font-display text-[clamp(2.2rem,4vw,3.6rem)] font-normal leading-[0.95] [--ls:-0.04em]">
            Selected <em className="serif">work</em>
          </h2>
          <p className="w-sub mt-3 max-w-[46ch] text-[14px] leading-snug text-bone/70">Four projects, each between a person and something else. Hover one to see where it sits.</p>
        </header>

        {/* orb numerals (no connecting lines: the active orb, numeral and card light up together) */}
        {projects.map((q, i) => (
          <span key={q.slug} ref={(el) => { nums.current[i] = el }} aria-hidden className="m-num tele pointer-events-none fixed left-0 top-0 z-[1] !text-[#0a0e14]/70 opacity-0">
            {q.no}
          </span>
        ))}

        {/* left: one menu. Each card = thumbnail + year + title + relationship tag */}
        <div className="w-left">
          <ul className="w-list" aria-label="Projects">
            {projects.map((q, i) => (
              <li
                key={q.slug}
                ref={(el) => { rows.current[i] = el }}
                className="w-row min-w-0 opacity-0"
                onPointerEnter={() => (over.current = i)}
                onPointerLeave={() => (over.current = -1)}
                onClick={() => (sel.current = i)}
              >
                <div className="w-item">
                  <span className="w-thumb">
                    <img src={q.home.thumb} alt="" width={480} height={360} loading="lazy" decoding="async" />
                    <span className="w-no tele">{q.no}</span>
                  </span>
                  <span className="w-meta">
                    <span className="tele w-year">
                      {q.home.year}
                      {q.home.status && <span className="w-status">{q.home.status}</span>}
                    </span>
                    <span className="w-t font-display">{q.name}</span>
                    <span className="w-desc">{q.home.desc}</span>
                    <span className="w-foot">
                      <span ref={(el) => { heads.current[i] = el }} className="w-h">{q.route}</span>
                      <Link href={`/work/${q.slug}`} onFocus={() => (sel.current = i)} className="w-read neon-hover" style={{ outlineColor: tint(q.accent) }}>
                        Read the case <span aria-hidden>→</span>
                      </Link>
                    </span>
                  </span>
                </div>
              </li>
            ))}
            {/* Room for the next project: an expandable "coming soon" card. */}
            <li className="w-slot">
              <div className="w-more" data-open={more}>
                <button type="button" className="w-more-b" aria-expanded={more} aria-controls="w-more-body" onClick={() => setMore((v) => !v)}>
                  <svg aria-hidden className="w-arrow" viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4.5 11.5l7-7M5.5 4.5h6v6" />
                  </svg>
                  <span className="w-more-t font-display">
                    More <em className="serif">work</em>
                  </span>
                  <span className="tele w-more-s">Coming soon</span>
                </button>
                <div id="w-more-body" className="w-more-body" role="region" aria-label="More work">
                  <div>
                    <p>New case studies are on the way: more research, more people, more systems.</p>
                    <a href="#contact" className="w-more-link">
                      Get in touch <span aria-hidden>→</span>
                    </a>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>

        {/* right: case info for the chosen project */}
        <div className="w-right">
          <div ref={panel} className="opacity-0" aria-live="polite">
            <div key={shown} className="w-panel">
              <p className="tele flex flex-wrap items-center gap-x-3">
                <span className="serif text-[1.6rem] leading-none text-bone">{p.no}</span>
                <span>/ 04</span>
                <span>·</span>
                <span>{p.home.year}</span>
                {p.home.status && (
                  <>
                    <span>·</span>
                    <span className="w-status">{p.home.status}</span>
                  </>
                )}
              </p>
              <h3 className="mt-3 font-display text-[clamp(1.5rem,2.7vw,2.5rem)] font-normal leading-[1.02] tracking-[-0.035em]">{p.name}</h3>
              <p className="mt-3 max-w-[36ch] text-[clamp(13px,1.1vw,15.5px)] leading-[1.55] text-bone/75">{p.home.desc}</p>
              <Link href={`/work/${p.slug}`} className="neon-hover mt-5 inline-flex items-center gap-2 rounded-full bg-[#e4ff1a] px-5 py-2.5 text-[14px] text-[#0a0e14] shadow-[0_12px_32px_-14px_rgb(190_220_0/0.9)]" style={{ outlineColor: tint(p.accent) }}>
                Read the case <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
