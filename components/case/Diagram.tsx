import { diagramHtml } from '@/lib/diagrams'

/** A code-rendered diagram (lib/diagrams.ts). Static, authored markup: real text, no raster image. */
export default function Diagram({ id }: { id: string }) {
  return <div dangerouslySetInnerHTML={{ __html: diagramHtml(id) }} />
}
