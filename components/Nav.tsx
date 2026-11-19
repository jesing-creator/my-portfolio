'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { site } from '@/lib/site'

/** On the home page links are in-page anchors (Lenis scrolls to them); elsewhere they go home first. */
function NavLink({
  h,
  onHome,
  className,
  onClick,
  children,
}: {
  h: string
  onHome: boolean
  className: string
  onClick?: () => void
  children: React.ReactNode
}) {
  return onHome ? (
    <a href={h} className={className} onClick={onClick}>
      {children}
    </a>
  ) : (
    <Link href={`/${h}`} className={className} onClick={onClick}>
      {children}
    </Link>
  )
}

/** Monogram: a "J" nested inside a "C" on shared geometry. A neon dot appears in the C's opening on hover. */
function Logo() {
  return (
    <svg viewBox="0 0 40 40" width="38" height="38" aria-hidden className="logo block overflow-visible">
      <path d="M31.2 9.6A15.5 15.5 0 1 0 31.2 30.4" fill="none" stroke="currentColor" strokeWidth="3.4" />
      <path d="M25 11V21A5.5 5.5 0 0 1 14 21" fill="none" stroke="currentColor" strokeWidth="3.4" />
      <circle className="logo-dot" cx="33" cy="20" r="2.3" fill="#e4ff1a" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}

export default function Nav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const onHome = pathname === '/'

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const ink = 'text-[rgb(var(--ink))]'

  return (
    <header data-site-nav className={`fixed inset-x-0 top-0 z-30 h-24 ${ink}`}>
      {onHome ? (
        <a href="#top" aria-label={`${site.name}, back to top`} className="logo-link absolute left-[calc(var(--gx)-4px)] top-[20px]">
          <Logo />
        </a>
      ) : (
        <Link href="/" aria-label={`${site.name}, home`} className="logo-link absolute left-[calc(var(--gx)-4px)] top-[20px]">
          <Logo />
        </Link>
      )}

      <nav aria-label="Primary" className="absolute left-1/2 top-[34px] hidden -translate-x-1/2 gap-x-10 md:flex">
        {site.nav.map((l) => (
          <NavLink key={l.label} h={l.href} onHome={onHome} className="hud hv-pill min-w-[5.5rem] text-center !text-current opacity-70">
            {l.label}
          </NavLink>
        ))}
      </nav>

      <button
        type="button"
        aria-expanded={open}
        aria-controls="site-menu"
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen((v) => !v)}
        className="absolute right-[var(--gx)] top-[22px] grid size-[46px] md:hidden place-items-center rounded-full border border-current/70 transition-colors duration-300 hover:bg-black/5"
      >
        <span aria-hidden className="relative block h-[9px] w-[15px]">
          <span className={`absolute left-0 h-px w-full bg-current transition-transform duration-300 ${open ? 'top-1 rotate-45' : 'top-0'}`} />
          <span className={`absolute left-0 h-px w-full bg-current transition-transform duration-300 ${open ? 'top-1 -rotate-45' : 'top-[8px]'}`} />
        </span>
      </button>

      <div
        id="site-menu"
        hidden={!open}
        className="absolute right-[max(1.5rem,2.4vw)] top-[78px] w-56 md:hidden rounded-2xl bg-white/90 ring-1 ring-black/5 p-5 text-[#0a0e14] shadow-[0_20px_50px_-20px_rgb(20_40_80/0.35)] backdrop-blur-xl"
      >
        <ul className="space-y-3">
          {site.nav.map((l) => (
            <li key={l.label}>
              <NavLink h={l.href} onHome={onHome} onClick={() => setOpen(false)} className="hud">
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <a href={`mailto:${site.email}`} className="hud mt-5 block border-t border-[#0a0e14]/15 pt-4 !normal-case">
          {site.email}
        </a>
      </div>
    </header>
  )
}
