import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import CaseHero from '@/components/case/CaseHero'
import Overview from '@/components/case/Overview'
import Stages from '@/components/case/Stages'
import Closing from '@/components/case/Closing'
import CaseNav from '@/components/case/CaseNav'
import { IMG } from '@/lib/images'
import { bySlug, projects } from '@/lib/projects'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const p = bySlug(slug)
  if (!p) return {}
  return {
    title: p.name,
    description: `${p.tagline} ${p.summary[0]}`,
    openGraph: { title: p.name, description: p.tagline, images: [IMG[p.hero].src] },
  }
}

export default async function CasePage({ params }: Props) {
  const { slug } = await params
  const p = bySlug(slug)
  if (!p) notFound()

  return (
    <main className="relative min-h-svh bg-white">
      <CaseHero p={p} />
      <CaseNav
        items={[
          { id: 'overview', label: 'Overview' },
          ...p.stages.map((s, i) => ({ id: `stage-${i}`, label: s.label })),
          ...(p.quote || p.closing ? [{ id: 'impact', label: 'Impact' }] : []),
        ]}
      />
      <Overview p={p} />
      <Stages p={p} />
      <Closing p={p} />
    </main>
  )
}
