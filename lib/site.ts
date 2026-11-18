/**
 * Site-level copy. Project content lives in lib/projects.ts.
 * The hero copy follows the reference layout; the rest comes from the PDF portfolio.
 */

export const site = {
  name: 'Jhen Sing Chou',
  initials: 'JC',
  first: 'Jesing',
  focus: 'products, interactions & social systems',
  role: 'Human-Centered Designer | Researcher | Storyteller',
  email: 'jhensingchou@gmail.com',
  headline: ['Design', 'for a more', 'connected', 'world.'],
  intro: ['I design digital products that help people connect, participate, and feel understood.'],
  disciplines: ['PRODUCT', 'UX', 'INTERACTION', 'SOCIAL SYSTEMS'],
  metrics: [
    { value: '200K+', label: 'Residents reached' },
    { value: '4M+', label: 'Under its standards' },
    { value: '3', label: 'First prizes' },
  ],
  nav: [
    { label: 'WORK', href: '#work' },
    { label: 'ABOUT', href: '#about' },
    { label: 'CONTACT', href: '#contact' },
  ],
}

export const about = {
  /** One short paragraph, highlighted phrases in `marks`. */
  paragraph:
    'Hello, I’m JC, a human-centered designer. I use service design, interaction design and civic technology to help people connect with each other, their workplaces and the technologies around them. My work starts with research and is shaped by repeated testing with the communities it serves.',
  marks: ['help people connect', 'repeated testing'],
  quote: 'For me, design is the work of repairing what society overlooks.',
  verbs: ['Listening', 'Connecting', 'Designing'],
  recognition: [
    { year: '2025', title: 'NTNU Graduation Exhibition', project: 'Social Hive' },
    { year: '2025', title: 'Future City Innovation & Creative Competition', project: 'Social Hive' },
    { year: '2024', title: 'New Taipei City “Design for SDGs” Competition', project: 'FlexFit Gym' },
  ],
}
