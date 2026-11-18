import { tint } from '@/lib/projects'
import type { Block } from '@/lib/details'
import Compare from '@/components/case/Compare'
import { Bars, Rings } from '@/components/case/Viz'

/**
 * Long-form content for a stage (lib/details.ts), laid out for the web rather than as a linear page:
 * sub-sections are two-column (label left, text right), cards become tiles, steps a horizontal timeline,
 * quotes full-width serif pull quotes, numbers big tiles with a neon highlight.
 */
export function BlockView({ b, accent, narrow = false }: { b: Block; accent: string; narrow?: boolean }) {
  const ink = tint(accent)
  const i = 0
  {
    {
      {
        switch (b.k) {
          case 'h':
            return (
              <div key={i} className={`grid gap-4 border-t border-hair pt-8 ${narrow ? '' : 'xl:grid-cols-[11rem_minmax(0,1fr)] xl:gap-10'}`}>
                <p className="tele" style={{ color: ink }}>
                  {b.kicker ?? ' '}
                </p>
                <div className="min-w-0">
                  <h4 className="max-w-[30ch] text-balance font-display text-[clamp(1.4rem,2.3vw,2rem)] leading-[1.12] tracking-[-0.03em] text-bone">{b.title}</h4>
                  {b.body && <p className="mt-5 max-w-[62ch] text-[16px] leading-[1.75] text-bone/78">{b.body}</p>}
                </div>
              </div>
            )
          case 'list':
            return (
              <div key={i}>
                {b.title && <p className="tele mb-5">{b.title}</p>}
                <ul className={`grid gap-x-10 ${narrow ? '' : 'md:grid-cols-2 xl:grid-cols-3'}`}>
                  {b.items.map((t, n) => (
                    <li key={t} className="flex min-w-0 gap-4 border-t border-hair py-4 text-[15.5px] leading-snug text-bone/85">
                      <span className="serif w-7 shrink-0 text-[1.15rem] leading-none text-bone/45">{String(n + 1).padStart(2, '0')}</span>
                      <span className="min-w-0">{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          case 'cards':
            return (
              <div key={i}>
                {b.title && <p className="tele mb-6">{b.title}</p>}
                <ul className={`grid gap-x-10 gap-y-9 sm:grid-cols-2 ${!narrow && (b.items.length % 3 === 0 || b.items.length > 4) ? 'xl:grid-cols-3' : ''}`}>
                  {b.items.map((c) => (
                    <li key={c.title + (c.label ?? '')} className="min-w-0 border-t border-bone/70 pt-5">
                      {c.label && (
                        <p className="tele mb-3 flex items-center gap-2" style={{ color: ink }}>
                          <span aria-hidden className="size-[7px] rounded-full bg-[#e4ff1a] ring-1 ring-[#0a0e14]" />
                          {c.label}
                        </p>
                      )}
                      <h5 className="font-display text-[19px] leading-snug tracking-[-0.02em] text-bone">{c.title}</h5>
                      {c.body && <p className="mt-2.5 max-w-[46ch] text-[15px] leading-[1.7] text-bone/70">{c.body}</p>}
                    </li>
                  ))}
                </ul>
              </div>
            )
          case 'quote':
            return (
              <figure key={i} className="relative rounded-[24px] bg-[#0a0e14] px-7 py-12 text-white md:px-14 md:py-16">
                <span aria-hidden className="serif absolute left-6 top-2 text-[7rem] leading-none text-[#e4ff1a] md:left-12 md:text-[9rem]">
                  “
                </span>
                <blockquote className="serif relative max-w-[30ch] text-balance pt-10 text-[clamp(1.6rem,3.2vw,2.8rem)] leading-[1.15] md:pt-14">{b.text}</blockquote>
                {(b.by || b.mood) && (
                  <figcaption className="mt-8">
                    <span className="chip">{b.by ?? b.mood}</span>
                  </figcaption>
                )}
              </figure>
            )
          case 'stats': {
            const pct = b.items.every((x) => /^\d+(\.\d+)?%$/.test(x.value))
            if (pct && b.items.length === 3 && /perception/i.test(b.title ?? '')) return <Rings key={i} title={b.title} items={b.items} />
            if (pct) return <Bars key={i} title={b.title} items={b.items} />
            return (
              <div key={i}>
                {b.title && <p className="tele mb-6">{b.title}</p>}
                <dl className={`grid grid-cols-2 gap-x-10 gap-y-10 ${narrow ? '' : 'lg:grid-cols-3'}`}>
                  {b.items.map((s) => (
                    <div key={s.label} className="min-w-0 border-t border-bone/70 pt-5">
                      <dd className="text-[clamp(2.2rem,4vw,3.4rem)] leading-none tracking-[-0.04em]">
                        <span className="mark serif-r">{s.value}</span>
                      </dd>
                      <dt className="mt-4 max-w-[26ch] text-[14px] leading-snug text-bone/70">{s.label}</dt>
                    </div>
                  ))}
                </dl>
              </div>
            )
          }
          case 'steps':
            return (
              <div key={i}>
                {b.title && <p className="tele mb-6">{b.title}</p>}
                <ol className={`relative grid gap-x-6 gap-y-10 sm:grid-cols-2 ${narrow ? '' : b.items.length >= 4 ? 'xl:grid-cols-4' : b.items.length === 3 ? 'xl:grid-cols-3' : ''}`}>
                  {b.items.map((s, n) => (
                    <li key={s.title} className="relative min-w-0 border-t border-bone/70 pt-5">
                      <span className="absolute -top-[5px] left-0 size-[9px] rounded-full bg-[#e4ff1a] ring-1 ring-[#0a0e14]" aria-hidden />
                      <p className="tele" style={{ color: ink }}>
                        step {String(n + 1).padStart(2, '0')}
                      </p>
                      <h5 className="mt-2 text-[17px] leading-snug tracking-[-0.01em] text-bone">{s.title}</h5>
                      {s.body && <p className="mt-2 text-[14.5px] leading-[1.65] text-bone/70">{s.body}</p>}
                    </li>
                  ))}
                </ol>
              </div>
            )
          case 'compare':
            return <Compare key={i} title={b.title} before={b.before} after={b.after} accent={accent} />
          case 'table':
            return null
        }
      }
    }
  }
}

export default function Blocks({ blocks, accent, flush = false }: { blocks: Block[]; accent: string; flush?: boolean }) {
  return (
    <div className={`${flush ? '' : 'mt-12'} flex flex-col gap-10 md:gap-14`}>
      {blocks.map((b, i) => (
        <BlockView key={i} b={b} accent={accent} />
      ))}
    </div>
  )
}
