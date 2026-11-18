'use client'

import { useState } from 'react'

type Side = { label: string; value: string; note: string }

/**
 * Before / after slider. Drag (or use the arrow keys on the handle) to wipe from the "before" panel to the
 * "after" panel. Built for any pair of states; the panels are text so it works without images.
 */
export default function Compare({ title, before, after, accent }: { title?: string; before: Side; after: Side; accent: string }) {
  const [pos, setPos] = useState(50)
  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    setPos(Math.max(4, Math.min(96, ((e.clientX - r.left) / r.width) * 100)))
  }
  return (
    <div>
      {title && <p className="tele mb-5">{title}</p>}
      <div
        className="relative min-h-[18rem] touch-pan-y select-none overflow-hidden rounded-[22px] bg-neutral-100 ring-1 ring-black/10"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId)
          move(e)
        }}
        onPointerMove={(e) => e.buttons && move(e)}
      >
        {/* after: base layer */}
        <Panel side={after} tone="after" accent={accent} />
        {/* before: wiped in from the left */}
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <Panel side={before} tone="before" accent={accent} />
        </div>
        <div className="pointer-events-none absolute inset-y-0 w-px bg-[#0a0e14]" style={{ left: `${pos}%` }}>
          <span className="absolute left-1/2 top-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#e4ff1a] text-[13px] text-[#0a0e14] shadow-[0_6px_20px_-6px_rgb(10_14_20/0.5)]" aria-hidden>
            ↔
          </span>
        </div>
        <input
          type="range"
          min={4}
          max={96}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label={`${before.label} to ${after.label}`}
          className="absolute inset-x-0 bottom-0 h-8 w-full cursor-ew-resize opacity-0"
        />
      </div>
    </div>
  )
}

function Panel({ side, tone, accent }: { side: Side; tone: 'before' | 'after'; accent: string }) {
  const dark = tone === 'before'
  return (
    <div className={`absolute inset-0 flex flex-col justify-between p-7 md:p-10 ${dark ? 'bg-[#0a0e14] text-white' : 'items-end bg-white text-right text-[#0a0e14]'}`}>
      <p className="tele !text-inherit opacity-70" style={tone === 'after' ? { color: accent } : undefined}>
        {side.label}
      </p>
      <div>
        <p className="serif text-[clamp(3.4rem,9vw,7rem)] leading-none">{side.value}</p>
        <p className={`mt-4 max-w-[30ch] text-[14px] leading-snug opacity-75 ${dark ? '' : 'ml-auto'}`}>{side.note}</p>
      </div>
    </div>
  )
}
