/* eslint-disable @next/next/no-img-element */
import CopyEmail from '@/components/CopyEmail'
import { site } from '@/lib/site'
import Icon from '@/components/Icon'

export default function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="relative isolate flex min-h-svh flex-col justify-between overflow-hidden gutter pb-10 pt-44 md:pb-12">
      <div>

        <h2 id="contact-title" className="hg max-w-[16ch] text-balance font-display text-[clamp(2.8rem,7vw,7rem)] font-normal leading-[0.95] tracking-[-0.045em]">
          Working on something that should help people <em className="serif">connect</em>?
        </h2>

        <div className="mt-14 flex flex-wrap items-center gap-4">
          <a
            href={`mailto:${site.email}`}
            className="group inline-flex max-w-full flex-wrap items-center gap-x-4 gap-y-2 rounded-full bg-[#e4ff1a] px-7 py-4 text-[clamp(1.05rem,1.8vw,1.4rem)] text-[#0a0e14] shadow-[0_18px_50px_-18px_rgb(190_220_0/0.9)] transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-[0_26px_60px_-16px_rgb(190_220_0/1)]"
          >
            <Icon name="mail" size={22} />
            <span className="serif-r italic">say hello</span>
            <span aria-hidden className="hidden h-px w-8 bg-[#0a0e14] transition-all duration-500 group-hover:w-14 sm:block" />
            <span className="break-all font-mono text-[0.8em] tracking-tight">{site.email}</span>
          </a>
          <CopyEmail email={site.email} />
        </div>
      </div>

      <footer className="tele mt-24 flex flex-wrap items-center justify-between gap-4 pt-6">
        <span>{site.name}</span>
        <a href="#top" className="neon-hover">Back to top ↑</a>
      </footer>
    </section>
  )
}
