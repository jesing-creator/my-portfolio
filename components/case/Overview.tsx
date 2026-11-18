import { type Project } from '@/lib/projects'
import Icon, { statIcons } from '@/components/Icon'

/** Facts strip, then the summary, the contribution line and the key numbers. */
export default function Overview({ p }: { p: Project }) {
  return (
    <>
      <section aria-label="Project facts" id="overview" className="scroll-mt-40 gutter py-14">
        <dl className="grid gap-x-12 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {p.facts.map((f) => (
            <div key={f.label} className="border-t border-hair pt-4">
              <dt className="tele">{f.label}</dt>
              <dd className="mt-2 max-w-[44ch] text-[15px] leading-snug text-bone">{f.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="overview-title" className="gutter py-16 md:py-24 lg:py-28">
        <div className="grid gap-10 md:grid-cols-12">
          <h2 id="overview-title" className="tele md:col-span-3">
            overview
          </h2>
          <div className="md:col-span-8 md:col-start-5">
            {p.summary.map((t, i) => (
              <p
                key={i}
                className={
                  i === 0
                    ? 'serif-r max-w-[30ch] text-balance text-[clamp(1.8rem,3.4vw,3.2rem)] leading-[1.12] tracking-[-0.02em] text-bone'
                    : 'mt-10 max-w-[60ch] text-[17px] leading-[1.7] text-bone/80'
                }
              >
                {t}
              </p>
            ))}
            <p className="mt-10 max-w-[58ch] border-t border-hair pt-6 text-[15.5px] leading-[1.75] text-bone/85">
              <span className="chip mb-4 gap-2"><Icon name="design" size={14} /> contribution</span>
              <br />
              {p.contribution}
            </p>
          </div>
        </div>

        <dl className="mt-32 grid gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
          {p.stats.map((s, i) => (
            <div key={s.label} className="flex flex-col border-t border-bone/70 pt-6">
              <Icon name={statIcons[i % 4]} accent size={22} className="order-0 mb-6 text-bone/70" />
              <dt className="order-2 mt-5 max-w-[24ch] text-[14px] leading-snug text-bone/70">{s.label}</dt>
              <dd className="order-1 text-[clamp(2.4rem,4.6vw,4.4rem)] leading-none tracking-[-0.03em]">
                <span className="mark serif-r">{s.value}</span>
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  )
}
