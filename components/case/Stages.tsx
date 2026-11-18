/* eslint-disable @next/next/no-img-element */
import { IMG } from '@/lib/images'
import Icon, { stageIcons } from '@/components/Icon'
import { tint, type Project, type Shot } from '@/lib/projects'
import { details } from '@/lib/details'
import { BlockView } from '@/components/case/Blocks'
import Figures from '@/components/case/Figures'
import { figures, type Figure } from '@/lib/figures'
import { skip, skipPoints } from '@/lib/dedupe'
import { Scores } from '@/components/case/Viz'
import type { Block } from '@/lib/details'

/**
 * Justified image row: every figure grows in proportion to its aspect ratio, so images in a row
 * come out at the same height without cropping.
 */
function ShotRow({ shots }: { shots: Shot[] }) {
  return (
    <div className="mt-14 flex max-w-[920px] flex-wrap gap-4">
      {shots.map((s) => {
        const im = IMG[s.key]
        const ar = im.w / im.h
        return (
          <figure key={s.key} className="min-w-0" style={{ flex: `${ar.toFixed(3)} 1 ${Math.round(ar * 190)}px` }}>
            <img
              src={im.src}
              width={im.w}
              height={im.h}
              alt={s.alt}
              loading="lazy"
              decoding="async"
              className="block h-auto w-full rounded-[3px] bg-neutral-100"
            />
            {s.caption && <figcaption className="tele mt-2">{s.caption}</figcaption>}
          </figure>
        )
      })}
    </div>
  )
}

type Item = { label?: string; title: string; body?: string }

/** A steps/cards block whose figures are tagged with the step they show: each step's text sits beside its own visual. */
function Paired({ b, figs, stage }: { b: Extract<Block, { k: 'steps' | 'cards' }>; figs: Figure[]; stage: string }) {
  const items = b.items as Item[]
  return (
    <div>
      {b.title && <p className="tele mb-6">{b.title}</p>}
      <ol className="flex flex-col">
        {items.map((it, n) => {
          const fs = figs.filter((f) => f.step === n)
          return (
            <li key={it.title} className="grid items-start gap-6 border-t border-hair py-6 first:border-t-0 first:pt-0 lg:grid-cols-12 lg:gap-x-12 lg:py-8">
              <div className={`min-w-0 ${fs.length ? 'lg:col-span-5' : 'lg:col-span-8'}`}>
                <p className="tele flex items-center gap-2">
                  <span className="serif mark text-[1.6rem] leading-none">{String(n + 1).padStart(2, '0')}</span>
                  {it.label ?? (b.k === 'steps' ? 'step' : '')}
                </p>
                <h5 className="mt-3 font-display text-[clamp(1.25rem,1.9vw,1.6rem)] leading-[1.15] tracking-[-0.025em] text-bone">{it.title}</h5>
                {it.body && <p className="mt-3 max-w-[56ch] text-[15.5px] leading-[1.7] text-bone/75">{it.body}</p>}
              </div>
              {fs.length > 0 && (
                <div className="min-w-0 lg:col-span-7">
                  <Figures figs={fs} label={stage} />
                </div>
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}

function Rows({ p, stage }: { p: Project; stage: string }) {
  const all = details[p.slug]?.[stage] ?? []
  const hide = new Set(skip[p.slug]?.[stage] ?? [])
  const shown = all.map((b, i) => ({ b, i })).filter((x) => !hide.has(x.i))
  const figs = figures[p.slug]?.[stage] ?? []
  if (!shown.length && !figs.length) return null
  // a figure whose block was skipped moves to the next block that is shown
  const home = (at: number) => shown.find((x) => x.i >= at)?.i ?? -1
  const loose = figs.filter((f) => home(f.at) === -1)
  // near-square and portrait visuals sit beside their text instead of stacking below it, so nothing hogs the scroll
  const compact = (fs: Figure[]) => fs.length > 0 && fs.every((f) => !f.diagram && f.h / f.w > 0.7)
  return (
    <div className="mt-10 flex flex-col gap-10 md:mt-12 md:gap-12">
      {shown.map(({ b, i }) => {
        const fs = figs.filter((f) => home(f.at) === i)
        if (!fs.length) return <BlockView key={i} b={b} accent={p.accent} />
        if ((b.k === 'steps' || b.k === 'cards') && fs.some((f) => f.step !== undefined)) {
          return <Paired key={i} b={b} figs={fs} stage={stage} />
        }
        const lead = fs.filter((f) => f.lead)
        const rest = fs.filter((f) => !f.lead)
        if (!lead.length && compact(rest) && (b.k === 'h' || b.k === 'list' || b.k === 'quote')) {
          return (
            <div key={i} className="grid items-start gap-6 lg:grid-cols-12 lg:gap-x-12">
              <div className="min-w-0 lg:col-span-6">
                <BlockView b={b} accent={p.accent} narrow />
              </div>
              <div className="min-w-0 lg:col-span-5 lg:col-start-8">
                <Figures figs={rest} label={stage} />
              </div>
            </div>
          )
        }
        return (
          <div key={i} className="flex flex-col gap-6 md:gap-8">
            {lead.length > 0 && <Figures figs={lead} label={stage} />}
            <BlockView b={b} accent={p.accent} />
            {rest.length > 0 && <Figures figs={rest} label={stage} />}
          </div>
        )
      })}
      {loose.length > 0 && <Figures figs={loose} label={stage} />}
    </div>
  )
}

export default function Stages({ p }: { p: Project }) {
  return (
    <section aria-labelledby="process-title">
      <h2 id="process-title" className="sr-only">
        Process
      </h2>
      <ol>
        {p.stages.map((s, i) => (
          <li key={s.label} id={`stage-${i}`} className="gutter scroll-mt-40 border-t border-hair py-14 md:py-24">
            <header className="grid gap-6 md:grid-cols-12 md:gap-x-8">
              <div className="md:col-span-3">
                <p className="serif text-[clamp(4rem,9vw,8rem)] leading-[0.8]" style={{ color: tint(p.accent) }}>
                  {String(i + 1).padStart(2, '0')}
                </p>
                <p className="board-cell mt-5 flex items-center gap-2.5 text-bone"><Icon name={stageIcons[i % 5]} accent size={20} />{s.label}</p>
              </div>
              <div className="md:col-span-8 md:col-start-5">
                <h3 className="max-w-[20ch] text-balance font-display text-[clamp(2rem,3.8vw,3.6rem)] font-normal leading-[1.02] tracking-[-0.04em]">{s.title}</h3>
                <p className="mt-5 max-w-[62ch] text-[17px] leading-[1.75] text-bone/80">{s.body}</p>
              </div>
            </header>

            <div className="mt-12 flex flex-col gap-0 md:mt-14">
              {s.challenge && (
                <aside className="rounded-[24px] bg-[#e4ff1a] p-7 text-[#0a0e14] md:p-12">
                  <p className="tele flex items-center gap-2 !text-[#0a0e14]/70"><Icon name="target" size={16} />design challenge</p>
                  <p className="serif mt-4 max-w-[30ch] text-balance text-[clamp(1.5rem,2.8vw,2.4rem)] leading-[1.15]">{s.challenge}</p>
                </aside>
              )}

              {s.points && !skipPoints[p.slug]?.includes(s.label) && (
                <ul className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 xl:grid-cols-4">
                  {s.points.map((pt, n) => (
                    <li key={pt.title} className="min-w-0 border-t border-bone/70 pt-5">
                      <p className="tele mb-3 flex items-center gap-2">
                        <span className="serif text-[1.3rem] leading-none text-bone">{String(n + 1).padStart(2, '0')}</span>
                      </p>
                      <h4 className="font-display text-[19px] leading-snug tracking-[-0.02em] text-bone">{pt.title}</h4>
                      <p className="mt-2.5 max-w-[40ch] text-[15px] leading-[1.7] text-bone/70">{pt.body}</p>
                    </li>
                  ))}
                </ul>
              )}

              {s.table && (
                <div className="mt-12">
                  <Scores caption={s.table.caption} head={s.table.head} rows={s.table.rows} />
                </div>
              )}

              {/* Narrative and evidence travel together: each block that has a diagram, chart or photo group from the
                  PDF sits in a two-column row with it, so the claim and its proof are read in one glance. */}
              <Rows p={p} stage={s.label} />

              {s.shots?.map((row, ri) => <ShotRow key={ri} shots={row} />)}
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
