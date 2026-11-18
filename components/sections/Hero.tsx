'use client'

import { useEffect, useRef } from 'react'
import { motion, smoothstep } from '@/lib/motion'
import { site } from '@/lib/site'

/**
 * The sky and the glass are drawn by the fixed WebGL layer behind this section. This component
 * adds what sits on top of them: type and the scroll cue.
 * Layout uses percentages of the viewport, the same way the reference is composed.
 */
export default function Hero() {
  const content = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let raf = 0
    const frame = () => {
      const out = 1 - smoothstep(0.12, 0.62, motion.heroOut)
      const c = content.current
      if (c) {
        c.style.opacity = String(out)
        c.style.visibility = out < 0.01 ? 'hidden' : 'visible'
      }
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [])

  const left = 'left-[var(--gx)]'

  return (
    <section id="top" className="relative h-svh min-h-[560px] overflow-hidden text-[#0a0e14]">
      {/* flat sky for browsers without WebGL2 */}
      <div aria-hidden className="sky-fallback absolute inset-0 bg-[linear-gradient(180deg,#86a8d0_0%,#a9c3df_55%,#dbe6f1_100%)]" />

      <div ref={content} className="absolute inset-0">
        <ul className={`hero-dis hud absolute ${left} top-[16.5%]`} aria-label="Disciplines">
          {site.disciplines.map((d) => (
            <li key={d}>/ {d}</li>
          ))}
        </ul>

        <h1
          className={`hero-h1 absolute ${left} top-[32.5%] font-display font-normal leading-[0.95] tracking-[-0.045em]`}
          style={{ fontSize: 'clamp(2.6rem, min(9.5vw, 9.6svh), 9rem)' }}
        >
          <span className="sr-only">{site.headline.join(' ')}</span>
          <span aria-hidden>
            {site.headline.map((l) => (
              <span key={l} className="block">
                <span className="hv [--ls:-0.045em]">{l === 'connected' ? (
                    <em className="serif kin kin-hl">
                      {[...l].map((ch, i) => (
                        <i key={i} style={{ '--i': i } as React.CSSProperties}>
                          {ch}
                        </i>
                      ))}
                    </em>
                  ) : (
                    l
                  )}</span>
              </span>
            ))}
          </span>
        </h1>

        <p className={`hero-in absolute ${left} bottom-[8%] max-w-[min(38ch,52vw)] text-[clamp(13px,1.25vw,16px)] leading-[1.5] tracking-[-0.01em]`}>
          <span className="block text-[clamp(15px,1.5vw,20px)] tracking-[-0.02em]">
            Hi, I’m <em className="serif">{site.first}</em>.
          </span>
          {site.intro.join(' ')}
        </p>
      </div>

      <ul className="absolute bottom-[8%] right-[var(--gx)] hidden flex-col items-end gap-4 md:flex" aria-label="Highlights">
        {site.metrics.map((m) => (
          <li key={m.label} className="metric">
            <span className="hud text-right text-[#0a0e14]">{m.label}</span>
            <b>{m.value}</b>
          </li>
        ))}
      </ul>

    </section>
  )
}
