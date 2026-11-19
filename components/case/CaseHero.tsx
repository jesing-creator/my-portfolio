/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import CoverVideo from './CoverVideo'
import { IMG } from '@/lib/images'
import { type Project } from '@/lib/projects'

/**
 * Opening of a case study: title block on clean white, then the lead image in a rounded frame.
 * Cut-outs that were shot on black (Social Hive's hands) keep that black as a product-shot card;
 * photos fill the frame.
 */
export default function CaseHero({ p }: { p: Project }) {
  const img = IMG[p.hero]
  const contain = p.heroFit === 'contain'
  const words = p.name.split(' ')
  const tail = words.length > 1 ? words[words.length - 1] : ''
  const head = words.length > 1 ? words.slice(0, -1).join(' ') : p.name

  return (
    <header className="gutter pb-16 pt-36 md:pb-24 md:pt-48">
      <div className="max-w-[64rem]">
        <Link href="/#work" className="tele inline-flex items-center gap-2 transition-colors hover:text-bone">
          <span aria-hidden>←</span> all projects
        </Link>

        <p className="mt-10 flex flex-wrap items-center gap-2">
          <span className="chip">{p.no} / 04</span>
          <span className="tele rounded-full border border-hair px-3 py-1.5">{p.route}</span>
          <span className="tele rounded-full border border-hair px-3 py-1.5">{p.discipline}</span>
        </p>

        <h1 className="mt-5 text-balance font-display text-[clamp(2.6rem,9vw,9rem)] font-normal leading-[0.92] tracking-[-0.045em]">{head}
          {tail && <em className="serif"> {tail}</em>}
        </h1>

        <p className="serif-r mt-8 max-w-[30ch] text-[clamp(1.4rem,2.4vw,2.2rem)] leading-[1.15] text-bone/90">{p.tagline}</p>
      </div>

      <div
        className={`mt-12 overflow-hidden rounded-[22px] shadow-[0_30px_80px_-44px_rgb(10_14_20/0.35)] md:mt-16 md:rounded-[32px] ${contain ? 'bg-black' : 'bg-neutral-100'}`}
      >
        {p.heroVideo ? (
          <CoverVideo src={p.heroVideo.src} poster={p.heroVideo.poster} label={`${p.name} cover film`} />
        ) : (
        <img
          src={img.src}
          width={img.w}
          height={img.h}
          alt={p.heroAlt}
          fetchPriority="high"
          decoding="async"
          className={contain ? 'mx-auto block h-[min(68svh,46rem)] w-full object-contain' : 'block h-[min(68svh,46rem)] w-full object-cover'}
        />
        )}
      </div>
    </header>
  )
}
