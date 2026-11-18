import Link from 'next/link'
import { IMG } from '@/lib/images'
import { nextOf, tint, type Project } from '@/lib/projects'

/** Optional quote and closing note, then a large link to the next project. */
export default function Closing({ p }: { p: Project }) {
  const next = nextOf(p.slug)
  return (
    <>
      {(p.quote || p.closing) && (
        <section id="impact" className="scroll-mt-40 border-t border-hair gutter py-16 md:py-24 lg:py-28">
          <div className="grid gap-10 md:grid-cols-12">
            {p.quote && (
              <figure className="md:col-span-8 md:col-start-5">
                <blockquote className="serif text-balance text-[clamp(1.9rem,3.8vw,3.6rem)] leading-[1.08]">“{p.quote.text}”</blockquote>
                <figcaption className="mt-8">
                  <span className="chip">{p.quote.by}</span>
                </figcaption>
              </figure>
            )}
            {p.closing && (
              <div className={p.quote ? 'mt-12 md:col-span-8 md:col-start-5' : 'md:col-span-8 md:col-start-5'}>
                <h2 className="tele" style={{ color: tint(p.accent) }}>
                  {p.closing.title.toLowerCase()}
                </h2>
                <p className="mt-4 max-w-[58ch] text-[17px] leading-[1.7] text-bone/80">{p.closing.body}</p>
                {p.closing.shot && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={IMG[p.closing.shot.key].src}
                    width={IMG[p.closing.shot.key].w}
                    height={IMG[p.closing.shot.key].h}
                    alt={p.closing.shot.alt}
                    loading="lazy"
                    decoding="async"
                    className="mt-12 block h-auto w-full rounded-[3px]"
                  />
                )}
              </div>
            )}
          </div>
        </section>
      )}

      <nav aria-label="Next project" className="border-t border-hair">
        <Link href={`/work/${next.slug}`} className="group block gutter py-16 transition-colors duration-500 hover:bg-white/30 md:py-28">
          <p className="tele flex flex-wrap gap-x-4">
            <span>next project</span>
            <span style={{ color: tint(next.accent) }}>{next.no} / 04</span>
            <span>{next.route}</span>
          </p>
          <p className="mt-6 flex items-end justify-between gap-6 font-display text-[clamp(2.4rem,7vw,7rem)] font-normal leading-[0.95] tracking-[-0.045em]">
            <span className="text-balance">{next.name}</span>
            <span aria-hidden className="mb-2 text-[0.6em] transition-transform duration-500 group-hover:translate-x-3" style={{ color: tint(next.accent) }}>
              →
            </span>
          </p>
        </Link>
      </nav>
    </>
  )
}
