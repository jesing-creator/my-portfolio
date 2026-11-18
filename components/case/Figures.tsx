import Gallery from '@/components/case/Gallery'
import Diagram from '@/components/case/Diagram'
import type { Figure } from '@/lib/figures'

/**
 * Figures for one block. Concept diagrams (`diagram`) are rendered from code; photos and screens go to the gallery
 * (size-capped, click to enlarge). Short label underneath, full description as alt text.
 */
export default function Figures({ figs, label }: { figs: Figure[]; label: string }) {
  const dg = figs.filter((f) => f.diagram)
  const im = figs.filter((f) => !f.diagram)
  return (
    <div className="flex flex-col gap-8 md:gap-10">
      {dg.map((f) => (
        <Diagram key={f.diagram} id={f.diagram!} />
      ))}
      {im.length > 0 && (
        <Gallery
          bare
          single
          label={label}
          items={im.map((f) => ({ src: f.src, w: f.w, h: f.h, alt: `${f.title}. ${f.caption}`, caption: f.title }))}
        />
      )}
    </div>
  )
}
