'use client'

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef } from 'react'
import { IMG } from '@/lib/images'
import { about, site } from '@/lib/site'
import { overlaySvg } from '@/lib/about-layouts'
import { startAbout } from '@/lib/about-driver'
import Icon, { verbIcons } from '@/components/Icon'

/** Wrap the given phrases of `text` in a neon highlighter. */
function Hl({ text, marks }: { text: string; marks: string[] }) {
  const re = new RegExp(`(${marks.map((m) => m.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`)
  return (
    <>
      {text.split(re).map((part, i) =>
        marks.includes(part) ? (
          <span key={i} className="mark">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  )
}

/**
 * About, built to sit on one screen (at least from tablet landscape up): portrait + quote, one paragraph +
 * recognition, and the stage. The stage is where the glass lives while this section is on screen: it
 * performs Listening (ripples), Connecting (two bodies drawn into one) and Designing (placed on a grid),
 * cycling on a timer; hover, focus or tap a verb to hold it.
 */
export default function About() {
  const portrait = IMG['site/portrait']
  const section = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    if (!section.current || !stage.current) return
    return startAbout({ section: section.current, stage: stage.current, tabs: tabs.current.filter(Boolean) as HTMLElement[] })
  }, [])

  return (
    <section ref={section} id="about" aria-labelledby="about-title" className="ab gutter relative">
      <header className="ab-head flex items-end justify-between gap-6">
        <h2 id="about-title" className="flex items-center gap-4 font-display text-[clamp(1.9rem,min(3.4vw,5.4svh),3rem)] font-normal leading-none tracking-[-0.035em]">
          <Icon name="profile" accent size={28} className="hidden sm:block" />
          <span className="hv [--ls:-0.035em]">
            About <em className="serif">me</em>
          </span>
        </h2>
      </header>

      <div className="ab-grid">
        {/* identity + quote */}
        <div className="ab-id">
          <div className="ab-who">
          <div className="ab-portrait relative">
            <img src={portrait.src} width={portrait.w} height={portrait.h} alt={`Portrait of ${site.name}`} loading="lazy" decoding="async" className="size-full rounded-[16px] object-cover" />
            <span className="chip absolute -bottom-3 -right-3 shadow-[0_10px_30px_-10px_rgb(10_14_20/0.5)]">{site.initials}</span>
          </div>
          <p className="ab-name font-display">{site.name}</p>
          </div>
          <figure className="ab-quote relative overflow-hidden rounded-[18px] bg-[#0a0e14] text-white">
            <blockquote className="serif ab-bq relative text-balance">{about.quote}</blockquote>
          </figure>
        </div>

        {/* bio + recognition */}
        <div className="ab-bio min-w-0">
          <p className="ab-p text-bone/80">
            <Hl text={about.paragraph} marks={about.marks} />
          </p>
          <div className="ab-rec">
          <h3 className="tele ab-rh flex items-center gap-2">
            <Icon name="award" accent size={16} /> first prizes
          </h3>
          <ol className="tl">
            {about.recognition.map((r) => (
              <li key={r.title} className="tl-row group">
                <span className="tl-year chip">{r.year}</span>
                <span aria-hidden className="tl-dot" />
                <span className="tl-body">
                  <span className="tl-t">{r.title}</span>
                  <span className="serif-r tl-proj">{r.project}</span>
                </span>
              </li>
            ))}
          </ol>
          </div>
        </div>

        {/* stage: the glass performs here */}
        <div className="ab-side">
          <div ref={stage} className="ab-stage" data-phase="0" aria-hidden dangerouslySetInnerHTML={{ __html: overlaySvg() }} />
          <ul className="ab-verbs" aria-label="Practice">
            {about.verbs.map((v, i) => (
              <li key={v}>
                <button ref={(el) => { tabs.current[i] = el }} type="button" className="ab-verb" data-on="false">
                  <span className="ab-vi">
                    <Icon name={verbIcons[i]} size={17} />
                  </span>
                  <span className="ab-vt font-display">{v}</span>
                  <span className="serif ab-vn">{String(i + 1).padStart(2, '0')}</span>
                  <span aria-hidden className="ab-bar" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
