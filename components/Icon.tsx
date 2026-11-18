import type { SVGProps } from 'react'

/**
 * Minimal line icons: 24px grid, 1.5 stroke, round caps. Pure vector, inherits currentColor.
 * `accent` adds a small neon-yellow node (ink outlined) so the set carries one consistent highlight.
 */
const P: Record<string, React.ReactNode> = {
  listen: (<><path d="M4 12v0M8 8v8M12 4v16M16 8v8M20 12v0" /></>),
  connect: (<><circle cx="7" cy="12" r="3.5" /><circle cx="17" cy="12" r="3.5" /><path d="M10.5 12h3" /></>),
  design: (<><path d="M4 20l1-4L16.5 4.5a2 2 0 013 3L8 19l-4 1z" /><path d="M14.5 6.5l3 3" /></>),
  research: (<><circle cx="10.5" cy="10.5" r="6" /><path d="M15 15l5 5" /></>),
  proto: (<><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" /><path d="M12 12l8-4.5M12 12v9M12 12L4 7.5" /></>),
  system: (<><circle cx="12" cy="5" r="2" /><circle cx="5" cy="18" r="2" /><circle cx="19" cy="18" r="2" /><path d="M11 6.8L6 16.2M13 6.8l5 9.4M7 18h10" /></>),
  test: (<><circle cx="12" cy="12" r="8.5" /><path d="M8 12.5l3 3 5-6" /></>),
  impact: (<><path d="M4 18l5-5 4 3 7-8" /><path d="M15 8h5v5" /></>),
  storyteller: (<><path d="M5 5h14v10H11l-4 4v-4H5V5z" /><path d="M9 9h6M9 12h4" /></>),
  award: (<><circle cx="12" cy="9" r="5" /><path d="M9 13.5L7.5 21 12 18.5 16.5 21 15 13.5" /></>),
  mail: (<><rect x="3.5" y="5.5" width="17" height="13" rx="2" /><path d="M4 7l8 6 8-6" /></>),
  arrow: (<><path d="M5 12h14M13 6l6 6-6 6" /></>),
  people: (<><circle cx="9" cy="9" r="3" /><path d="M3.5 19c.5-3 2.7-5 5.5-5s5 2 5.5 5" /><circle cx="17" cy="10" r="2.2" /><path d="M16.5 14.2c2.2 0 3.6 1.5 4 4" /></>),
  clock: (<><circle cx="12" cy="12" r="8.5" /><path d="M12 7v5l3 2" /></>),
  target: (<><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r=".6" /></>),
  chart: (<><path d="M4 20V4M4 20h16" /><path d="M8 16v-4M12 16V8M16 16v-6" /></>),
  spark: (<><path d="M12 3v5M12 16v5M3 12h5M16 12h5" /><path d="M6.5 6.5l2.5 2.5M15 15l2.5 2.5M17.5 6.5L15 9M9 15l-2.5 2.5" /></>),
  work: (<><rect x="3.5" y="4.5" width="17" height="15" rx="2" /><path d="M3.5 9.5h17M9 9.5v10" /></>),
  method: (<><circle cx="12" cy="12" r="3" /><path d="M12 3v3M12 18v3M3 12h3M18 12h3" /></>),
  profile: (<><circle cx="12" cy="8.5" r="3.5" /><path d="M5 20c.8-4 3.6-6 7-6s6.2 2 7 6" /></>),
}

export type IconName = keyof typeof P

export default function Icon({ name, accent = false, size = 20, ...rest }: { name: IconName; accent?: boolean; size?: number } & Omit<SVGProps<SVGSVGElement>, 'name'>) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden focusable="false" {...rest}>
      {P[name]}
      {accent && <circle cx="19" cy="5" r="2.6" fill="#e4ff1a" stroke="#0a0e14" strokeWidth="1" />}
    </svg>
  )
}

export const stageIcons: IconName[] = ['research', 'proto', 'system', 'test', 'impact']
export const statIcons: IconName[] = ['chart', 'people', 'clock', 'target']
export const roleIcons: Record<string, IconName> = { 'Human-Centered Designer': 'design', Researcher: 'research', Storyteller: 'storyteller' }
export const verbIcons: IconName[] = ['listen', 'connect', 'design']
