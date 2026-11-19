import type { ImgKey } from './images'

/**
 * The four case studies, written from the PDF portfolio. Numbers, roles, teams and quotes are
 * taken from it as written; the prose is condensed for the web. Edit here, nothing else needs to change.
 */

export type Shot = { key: ImgKey; alt: string; caption?: string }

export type Stage = {
  /** Short stage name shown in the left column, e.g. "Research & Insight". */
  label: string
  title: string
  body: string
  challenge?: string
  points?: { title: string; body: string }[]
  table?: { caption: string; head: string[]; rows: string[][] }
  /** Each inner array is one justified row group of images. */
  shots?: Shot[][]
}

export type Status = 'Awarded' | 'Adopted' | 'Delivered'

export type Project = {
  slug: string
  /** "01" to "04", same order as the PDF contents page. */
  no: string
  /** Departures-board code. */
  code: string
  name: string
  route: string
  /** Who the project sits between, used as the label in the Method section. */
  target: 'Human' | 'Organization' | 'Environment' | 'Technology'
  discipline: string
  tagline: string
  /** Homepage card (Selected work): year, optional status and a one-line description. */
  home: { thumb: string; year: string; status?: Status; desc: string }
  summary: string[]
  /** One line for the Method section label. */
  orbLine: string
  status: Status
  year: string
  accent: string
  hero: ImgKey
  heroAlt: string
  /** "contain" for cut-outs that sit on black, "cover" for full-bleed photos. */
  heroFit: 'contain' | 'cover'
  /** Optional cover film that plays (muted, looping) in place of the still hero. */
  heroVideo?: { src: string; poster: string }
  facts: { label: string; value: string }[]
  /** The "Contribution" line from the PDF. */
  contribution: string
  stats: { value: string; label: string }[]
  stages: Stage[]
  quote?: { text: string; by: string }
  closing?: { title: string; body: string; shot?: Shot }
}

export const projects: Project[] = [
  /* ------------------------------------------------------------------ 01 */
  {
    slug: 'social-hive',
    home: { thumb: '/work/thumbs/social-hive.jpg', year: '2025', status: 'Awarded', desc: 'Building social capital through everyday interaction.' },
    no: '01',
    code: 'JC-01',
    name: 'Social Hive',
    route: 'Human ↔ Human',
    target: 'Human',
    discipline: 'Service / Interaction Design',
    tagline: 'Building social capital through everyday interaction.',
    summary: [
      'Social Hive imagines a future where communities grow through small, everyday gestures. Like bees passing pollen, each act of care moves between people and gradually rebuilds trust.',
      'Research showed that hesitation comes not from lack of empathy but from lacking simple, safe ways to start. Social Hive uses a wearable device and app system to make these moments visible, helping individual interactions become a collective hive of connection and possibility.',
    ],
    orbLine: 'A wearable and an app that make everyday care visible, so starting is easy.',
    status: 'Awarded',
    year: '2025',
    accent: '#FFE933',
    hero: 'social-hive/hero',
    heroAlt: 'Two hands pressed together in a high five, each wearing a yellow Hive Sensor wristband.',
    heroFit: 'contain',
    heroVideo: { src: '/work/social-hive/cover.mp4', poster: '/work/social-hive/cover-poster.jpg' },
    facts: [
      { label: 'Duration', value: 'Aug 2024 – May 2025' },
      { label: 'Type', value: 'Service & Interaction Design, graduation project' },
      { label: 'Team', value: 'Jhen-Sing Chou, Ching-Wen Huang, Shao-Chi Chang' },
      { label: 'Role', value: 'Project Lead: field research, system design, participatory testing' },
      {
        label: 'Recognition',
        value: 'First Prize, NTNU Graduation Exhibition, May 2025. First Prize, Future City Innovation & Creative Competition, June 2025.',
      },
    ],
    contribution:
      'The system was tested across 6 public events, generating over 4,000 real-world interactions that informed its refinement.',
    stats: [
      { value: '3,437', label: 'participants across two rounds of testing' },
      { value: '4,012', label: 'interaction records collected' },
      { value: '95%+', label: 'called the paper NFC wristband light and intuitive' },
      { value: '2×', label: 'First Prize, in 2025' },
    ],
    stages: [
      {
        label: 'Research & Insight',
        title: 'Hesitation, not indifference.',
        body: 'We reviewed 30+ sources, interviewed 5+ experts in sociology, psychology and family studies, and surveyed 204 people. 72% said they are willing to help, yet only 29% actually act. Lack of trust (52%) and time pressure (47%) get in the way. Sociologists, psychologists and caregivers pointed to the same cause: people have little room for low-pressure, trust-building moments.',
        challenge:
          'How might we create everyday interactions that help people notice each other, engage without pressure, and stay connected?',
        points: [
          {
            title: 'Empathy begins with noticing',
            body: 'It starts with shared awareness and small interpersonal cues, but modern digital habits and isolated routines reduce these moments.',
          },
          {
            title: 'Overload limits our ability to care',
            body: 'People hesitate to connect not from lack of care, but from limited emotional capacity shaped by pressure, role demands and competitive norms.',
          },
          {
            title: 'Uncertainty keeps people from acting',
            body: 'Many people care about others, but uncertainty, low trust and time pressure often prevent them from acting.',
          },
        ],
        shots: [[{ key: 'social-hive/crowd', alt: 'Commuters looking at their phones on a busy street.' }]],
      },
      {
        label: 'Prototyping & Iterations',
        title: 'Three prototypes, each too much of something.',
        body: 'We translated insights into testable interactions with sketches, handcrafted models, 3D printing and Arduino. The "Gift of Life" concept met real needs but was too abstract to interact with. The Bee Exploration Ball was engaging, with light and vibration, but too bulky for everyday use. The high-five wearable felt intuitive through gesture and an NFC link to the app, but its hardware was too fragile for daily use.',
        shots: [
          [
            { key: 'social-hive/concept-review', alt: 'Presenting the Gift of Life concept at an exhibition wall.', caption: '1. "Gift of Life" concept' },
            { key: 'social-hive/bee-exhibit', alt: 'The Bee Exploration Ball displayed in a yellow exhibition set.', caption: '2. Bee Exploration Ball' },
            { key: 'social-hive/wearable-test', alt: 'A hand holding the yellow high-five wearable prototype in a review session.', caption: '3. High-five wearable' },
          ],
        ],
      },
      {
        label: 'Concept & System',
        title: 'Hive Connect: an app and a sensor that make care visible.',
        body: 'Three intervention strategies shaped the final direction: Human∞Hive (a digital platform that turns simple tasks into steady participation), Hand–Hand (playful shared rituals that create warm, trusting moments) and Hope→Horizon (visible collective progress). People explore nearby "Pollination Tasks", connect and check in by NFC with a high five that triggers light and vibration, then share reflections and earn Nectar Points they can redeem or reinvest in community projects.',
        shots: [
          [
            { key: 'social-hive/app-explore', alt: 'Hive Connect app: Explore screen.', caption: 'Explore' },
            { key: 'social-hive/app-missions', alt: 'Hive Connect app: Missions screen.', caption: 'Missions' },
            { key: 'social-hive/app-communities', alt: 'Hive Connect app: Communities screen.', caption: 'Communities' },
            { key: 'social-hive/app-chat', alt: 'Hive Connect app: Chat screen.', caption: 'Chat' },
          ],
          [
            { key: 'social-hive/mockups', alt: 'Hive Connect welcome screens laid out on a light surface.' },
            { key: 'social-hive/sensor', alt: 'The yellow and black Hive Sensor.', caption: 'Hive Sensor' },
            { key: 'social-hive/wristband-outdoors', alt: 'A high five outdoors with Hive Sensor wristbands.' },
          ],
        ],
      },
      {
        label: 'Testing & Impact',
        title: 'The lighter wristband won.',
        body: 'Across two rounds, we gathered 4,012 interaction records from 3,437 participants. In Round I, the Hive Sensor was called "warm and playful", but about 21% noted issues with weight, fragility or cost. Round II introduced a paper-based NFC wristband: over 95% described it as "light and intuitive", confirming improved accessibility, engagement and scalability.',
        shots: [
          [
            { key: 'social-hive/booth', alt: 'The Social Hive exhibition booth with yellow wall graphics and a screen.' },
            { key: 'social-hive/visitors', alt: 'Visitors watching the project video at the exhibition.' },
            { key: 'social-hive/participation', alt: 'A visitor trying the participatory wristband activity.' },
          ],
          [
            { key: 'social-hive/high-five', alt: 'Two people high-fiving while wearing wristbands.' },
            { key: 'social-hive/award-forum', alt: 'The team receiving a prize at the Future City Innovation & Creative Competition.' },
            { key: 'social-hive/award-prize', alt: 'Receiving the first prize certificate at the NTNU Graduation Exhibition.' },
          ],
        ],
      },
    ],
    closing: {
      title: 'Where it goes next',
      body: 'Social Hive uses a dual-value model that combines B2C participation with B2B partnerships across government, corporate and NGO sectors. Future growth centers on local partnerships and AI-driven personalization, toward a citywide ecosystem where small, everyday actions strengthen empathy, trust and collective connection.',
      shot: {
        key: 'social-hive/handshake',
        alt: 'A handshake encircled by two rings of photos from community events.',
      },
    },
  },

  /* ------------------------------------------------------------------ 02 */
  {
    slug: 'workplace-unboxing-plan',
    home: { thumb: '/work/thumbs/workplace-unboxing-plan.jpg', year: '2024', status: 'Adopted', desc: 'An integrated onboarding system improving culture insight, mentorship and job-fit alignment.' },
    no: '02',
    code: 'JC-02',
    name: 'Workplace Unboxing Plan',
    route: 'Human ↔ Organization',
    target: 'Organization',
    discipline: 'Service Design / Employee Experience',
    tagline: 'An integrated onboarding system improving culture insight, mentorship and job-fit alignment.',
    summary: [
      "Nanshan Life's onboarding felt unclear for experienced hires, who needed clearer expectations, cultural orientation and early support.",
      'Through interviews, surveys, journey mapping and co-creation, we designed a four-part system: a storytelling platform for cultural insight, a digital mentoring channel, a value-alignment form, and a casual tea session that builds early belonging.',
    ],
    orbLine: "A four-part onboarding that makes a large insurer's culture clear early.",
    status: 'Adopted',
    year: '2024',
    accent: '#4DA3FF',
    hero: 'workplace-unboxing/hero',
    heroAlt: 'Two colleagues talking at a table in a bright office café.',
    heroFit: 'cover',
    facts: [
      { label: 'Duration', value: 'Sep – Dec 2024' },
      { label: 'Type', value: 'Service Design, professional project' },
      { label: 'Team', value: 'Jhen-Sing Chou, You-Chen Tai, Yu-Ying Yang, Hsiao-Kuang Hsu, Wei-Ni Tu' },
      { label: 'Role', value: 'Lead Researcher & Service Designer: research, interviews, mapping, insight synthesis, co-creation' },
      {
        label: 'Client',
        value: 'Nanshan Life Insurance, one of Taiwan’s largest insurers, serving over 6.6 million clients.',
      },
    ],
    contribution:
      'The system supports 300+ new hires annually, reduces adaptation time from 6 to 3 weeks (50%), and strengthens engagement and employer brand trust.',
    stats: [
      { value: '6 → 3', label: 'weeks to adapt, a 50% reduction' },
      { value: '300+', label: 'new hires supported each year' },
      { value: '87', label: 'experience stories synthesized into insights' },
      { value: '8.1/10', label: 'usefulness score for Nanshan Inside, from 25 participants' },
    ],
    stages: [
      {
        label: 'Field Research',
        title: 'Understanding a large institution from the inside.',
        body: 'In a highly regulated financial environment, Nanshan Life is expanding into digital and service roles, while modern professionals expect more flexibility, purpose and cultural clarity. We reviewed its employer branding, mapped the onboarding process with HR at headquarters, ran focus groups with 9 employees plus 2 in-depth and 3 external interviews, and sent an "Onboarding Memory Log" survey that gathered 89 responses across five stages, from application to post-probation.',
        shots: [[{ key: 'workplace-unboxing/headquarters', alt: 'The Nanshan Life headquarters tower seen from below.' }]],
      },
      {
        label: 'Insight Analysis',
        title: 'Stories, personas and two moments of truth.',
        body: 'We synthesized interview and survey data into 87 experience stories across 9 categories. Two Moments of Truth emerged: pre-interview, where limited transparency shapes first impressions, and post-onboarding, where inconsistent guidance affects long-term engagement. AI-assisted clustering sped up pattern recognition but often overread emotions, which showed the need for human judgment. Laddering analysis then connected job seekers’ actions to their underlying values.',
        points: [
          { title: 'Dream Navigator', body: 'Employees seek companies that align with their long-term direction, with clear career paths and growth opportunities.' },
          { title: 'Company Growth, My Mission', body: 'Visionary leadership and shared goals inspire employees to grow with the company.' },
          { title: 'More Than Colleagues, Almost Friends', body: 'Supportive peers, open communication and informal interactions foster belonging.' },
          { title: 'Smooth Landing', body: 'Transparent onboarding, responsive HR and structured mentorship build confidence and help new hires adapt quickly.' },
        ],
        shots: [
          [
            { key: 'workplace-unboxing/story-wall', alt: 'Team members arranging experience story cards on a whiteboard.' },
            { key: 'workplace-unboxing/persona', alt: 'Persona portrait: Lin Chih-Wei, an experienced finance professional.', caption: 'Primary persona: experienced job seekers' },
          ],
        ],
      },
      {
        label: 'Co-creation',
        title: 'Testing onboarding with LEGO.',
        body: 'In a co-creation workshop, employees and HR evaluated opportunities together, which helped refine the ideas that were most valuable for candidates and feasible for the organization. We then simulated key interview and onboarding moments with LEGO prototypes to see how candidates, supervisors and HR naturally interact, and where flows felt intuitive or unclear. Three design principles came out of it: diverse ways to understand Nanshan, aligning roles and expectations, and strengthening team connection.',
        shots: [
          [
            { key: 'workplace-unboxing/lego-table', alt: 'Workshop participants building onboarding scenes from LEGO along a long table.' },
            { key: 'workplace-unboxing/lego-scene', alt: 'A LEGO scene of an interview with Chinese dialogue bubbles.' },
          ],
        ],
      },
      {
        label: 'Prototype & Proposal',
        title: 'Four services, one pathway.',
        body: 'The solution connects candidates, HR and mentors through structured touchpoints. A. Nanshan Inside is a Medium-style platform where employees share real work stories. B. Brew your future is a digital coffee chat with mentors. C. Job Matching Form captures candidates’ preferences so interviews can be tailored. D. Afternoon Session is a casual tea where new hires meet supervisors and peers. In a pop-up exhibition, 25 participants scored the concepts. Nanshan Life’s HR leadership then adopted key parts of the proposal: elements such as Nanshan Inside and the Afternoon Session are now implemented across teams.',
        table: {
          caption: 'Pop-up exhibition scores, 25 participants',
          head: ['Service', 'Usefulness', 'Feasibility'],
          rows: [
            ['A. Nanshan Inside', '8.1', '7.4'],
            ['B. Brew your future', '6.9', '6.2'],
            ['C. Job Matching Form', '7.3', '7.3'],
            ['D. Afternoon Session', '7.6', '7.4'],
          ],
        },
        shots: [
          [{ key: 'workplace-unboxing/mockup', alt: 'The Nanshan Inside platform shown on a laptop and tablet next to a printed research report.' }],
          [
            { key: 'workplace-unboxing/popup-1', alt: 'The team presenting the proposal.' },
            { key: 'workplace-unboxing/popup-2', alt: 'An HR participant reviewing the printed proposal.' },
            { key: 'workplace-unboxing/popup-3', alt: 'New hires and colleagues talking in a headquarters lounge.' },
          ],
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ 03 */
  {
    slug: 'flexfit-gym',
    home: { thumb: '/work/thumbs/flexfit-gym.jpg', year: '2025', desc: 'Adaptive ceiling-track fitness space design.' },
    no: '03',
    code: 'JC-03',
    name: 'FlexFit Gym',
    route: 'Human ↔ Environment',
    target: 'Environment',
    discipline: 'Spatial Interaction / Inclusive Design',
    tagline: 'An adaptive gym system for inclusive public fitness.',
    summary: [
      'Research across New Taipei City gyms revealed gender imbalance, accessibility gaps and fixed layouts that excluded many users.',
      'FlexFit introduces an intelligent ceiling-track system that repositions equipment in real time based on user density, gender distribution and activity type. Combined with a smart interface and energy-generating modules, the system creates an inclusive, flexible and sustainable fitness environment.',
    ],
    orbLine: 'A ceiling track that moves equipment to fit who is in the room.',
    status: 'Awarded',
    year: '2024',
    accent: '#E3A06E',
    hero: 'flexfit-gym/hero',
    heroAlt: 'A hand adjusting the FlexFit touchscreen, with equipment hanging from a ceiling track in a bright gym.',
    heroFit: 'cover',
    facts: [
      { label: 'Duration', value: 'May – June 2024' },
      { label: 'Type', value: 'Experience / Spatial Design, government-sponsored design project' },
      { label: 'Team', value: 'Solo project' },
      { label: 'Role', value: 'Solo Designer: research, concepting, spatial design, prototyping, visualization' },
      { label: 'Recognition', value: 'First Prize, New Taipei City Government “Design for SDGs” Public Design Competition, 2024' },
      {
        label: 'Client',
        value: 'New Taipei City Government, Taiwan’s largest municipal body, which promotes the UN SDGs through its Future City Forum.',
      },
    ],
    contribution:
      'Presented at the Future City Forum, FlexFit informed gender-friendly gym guidelines and influenced inclusive facility standards for over 4 million residents.',
    stats: [
      { value: '4M+', label: 'residents covered by the facility standards it influenced' },
      { value: '1st', label: 'Prize, Design for SDGs Public Design Competition, 2024' },
      { value: '60%+', label: 'of women feel safer in female-only zones' },
      { value: '3', label: 'gyms observed, with 8 users and staff interviewed' },
    ],
    stages: [
      {
        label: 'Discover',
        title: 'Reading the policy, then the floor.',
        body: 'As part of the new Second Administrative Center, the New Taipei City Government launched a Design for SDGs initiative to create a gender-neutral, accessible and sustainable gym, supporting five city values: Sustainable Community, Inclusiveness, Wellness, Carbon Neutrality and Smart Future. I reviewed municipal guidelines, observed three gyms, and interviewed eight users and staff about comfort, safety and access.',
        shots: [
          [
            { key: 'flexfit-gym/gym-visit', alt: 'A staff member explaining a gym floor plan on a large screen.' },
            { key: 'flexfit-gym/section', alt: 'Section diagram of the gym showing natural light, CO₂ absorption and natural wind.' },
          ],
        ],
      },
      {
        label: 'Define',
        title: 'Four gaps in public gyms.',
        body: 'The research clarified how different groups move through a gym, which barriers restrict participation, and what has to change to support diverse abilities.',
        challenge:
          'How might we create a gym environment that adapts to different comfort levels, abilities, and gender dynamics while remaining sustainable and easy to operate?',
        points: [
          { title: 'Gender imbalance', body: '74.1% of men prefer weight machines, while 75.7% of women favor cardio.' },
          { title: 'Accessibility gap', body: 'Fixed floor equipment limits use for elderly and disabled users.' },
          { title: 'Spatial discomfort', body: 'Over 60% of women feel safer in female-only zones.' },
          { title: 'Low sustainability', body: 'Few facilities integrate energy regeneration or eco-friendly systems.' },
        ],
      },
      {
        label: 'Develop',
        title: 'The Intelligent Track System.',
        body: 'A ceiling-mounted track moves modular equipment along rails. Overhead people-counting sensors and lightweight computer vision detect density, movement patterns and activity types, so the system can adjust spacing, circulation and lighting for strength, cardio or group training. Cycling units and training walls with built-in micro-generators feed power into a local grid, and zone displays use basic motion sensing for safe, personalized coaching.',
        shots: [
          [
            { key: 'flexfit-gym/track', alt: 'Rings, a lock-style weight and a pull-up bar hanging from the ceiling track.' },
            { key: 'flexfit-gym/tablet', alt: 'The control screen showing number of people, gender, density and sport theme.', caption: 'Control screen' },
            { key: 'flexfit-gym/isometric', alt: 'Isometric sketch of the ceiling track structure.' },
          ],
          [
            { key: 'flexfit-gym/coach', alt: 'A user following a coaching display with real-time guidance.', caption: 'Coaching intelligence' },
            { key: 'flexfit-gym/rest-area', alt: 'A user charging a phone in the resting area from an energy-generating bench.', caption: 'Energy generation' },
          ],
        ],
      },
      {
        label: 'Deliver',
        title: 'A floor plan in five zones.',
        body: 'The plan links an entrance, a gender-neutral toilet, a resting area, a training area and a storage area. Curved flooring directs movement and connects rest areas for intuitive navigation. Presented at the Future City Forum (2024), the project received First Prize under the Design for SDGs initiative and informed New Taipei City’s gender-friendly gym guidelines. It now serves as a scalable model for schools, offices and public institutions.',
        shots: [
          [{ key: 'flexfit-gym/plan', alt: 'Top-down rendered floor plan of the gym.' }],
          [
            { key: 'flexfit-gym/forum-1', alt: 'Talking with guests at the Future City Forum.' },
            { key: 'flexfit-gym/forum-2', alt: 'Standing beside the project board at the forum.' },
          ],
          [{ key: 'flexfit-gym/facade', alt: 'Rendered facade of the administrative center with the gym visible behind glass.' }],
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ 04 */
  {
    slug: 'designing-digital-confidence',
    home: { thumb: '/work/thumbs/designing-digital-confidence.jpg', year: '2025', desc: 'Improving digital participation for older adults through research-driven insights on anxiety, clarity, and long-term support.' },
    no: '04',
    code: 'JC-04',
    name: 'Designing Digital Confidence',
    route: 'Human ↔ Technology',
    target: 'Technology',
    discipline: 'Civic Tech / Digital Inclusion',
    tagline: 'Improving digital participation for older adults through research on anxiety, clarity and long-term support.',
    summary: [
      'At Taipei City Government’s Digital Strategy Center, I led field research in senior digital-literacy classes to understand older adults’ challenges with everyday digital tools.',
      'The findings showed that the core issues were less about capability and more about anxiety, cognitive load, unclear interfaces and limited ongoing support, shifting our perspective toward building confidence, clarity and companionship in digital learning.',
    ],
    orbLine: 'Support that follows older adults out of the classroom.',
    status: 'Delivered',
    year: '2025',
    accent: '#34D0DA',
    hero: 'digital-confidence/hero',
    heroAlt: 'An older woman smiling at a video call with her grandson on her phone, a dog beside her.',
    heroFit: 'cover',
    facts: [
      { label: 'Duration', value: 'Feb – May 2025' },
      { label: 'Type', value: 'Public-sector UX research & service design' },
      { label: 'Team', value: 'Jhen-Sing Chou, Wei-Ling Fan, Zi-Hao Luo, Yu-Jie Ou' },
      { label: 'Role', value: 'Lead Researcher: research planning, fieldwork, team coordination, synthesis, strategy' },
      {
        label: 'Client',
        value: 'The Digital Strategy Center, part of Taipei’s Department of Information Technology, which leads the city’s digital transformation and inclusion efforts.',
      },
    ],
    contribution:
      'Our work informed improvements impacting 200,000+ residents, reframing digital inclusion around confidence and sustained support for older adults.',
    stats: [
      { value: '200,000+', label: 'residents affected by the improvements this work informed' },
      { value: '35%', label: 'improvement in task recall, in pre/post checks' },
      { value: '40%', label: 'fewer hesitation moments' },
      { value: '70%', label: 'willing to keep practicing after class' },
    ],
    stages: [
      {
        label: 'Field Research',
        title: 'Immersing in real learning environments.',
        body: 'Taipei’s Digital Helper Network mobilizes volunteers across 12 districts to help residents adapt to digital services. We observed 12+ government-run digital-literacy classes covering LINE, Google, Calendar and smartphone basics. Through contextual observation, interviews with seniors, instructors and volunteers, behavior documentation, youth comparisons and a review of the Digital Helper system, we identified the behavioral, cognitive and emotional factors shaping how older adults use digital tools.',
        challenge:
          'How might we enable older adults not only to access technology, but to participate in digital life with confidence, clarity, and support?',
      },
      {
        label: 'Insights',
        title: 'Four things the classroom showed.',
        body: 'Older adults were engaged, taking notes and asking questions. What held them back was not ability.',
        points: [
          {
            title: 'Motivation exists, but anxiety blocks action',
            body: 'Hesitation appeared whenever they faced unfamiliar icons or unclear system prompts: fear of “breaking something”, privacy concerns, and stress from technical wording.',
          },
          {
            title: 'Seniors learn differently',
            body: 'They rely on step-by-step, structured and repeated instruction, so mainstream exploratory interfaces are hard to retain after class.',
          },
          {
            title: 'The real inequality is an accompaniment gap',
            body: 'Seniors could learn in class but struggled alone afterward, often reverting to non-digital routines without someone to guide them.',
          },
          {
            title: 'Community belonging drives learning more than tools',
            body: 'They were most motivated when lessons connected to family, social life and community identity, such as video calls with grandchildren.',
          },
        ],
        shots: [[{ key: 'digital-confidence/seniors', alt: 'Hand-drawn watercolor portraits of four older adults and a younger woman, some holding phones.' }]],
      },
      {
        label: 'Concepts',
        title: 'From teaching tools to building confidence and continuity.',
        body: 'User journey mapping showed that confidence and engagement broke down before class (setup confusion), during class (information overload) and after class (lack of support). We reframed the approach from teaching “how to use technology” to designing an ecosystem across all three.',
        points: [
          { title: 'A. Smart Start', body: 'A hybrid onboarding tool that guides seniors through simple pre-class steps, easing anxiety before learning begins.' },
          { title: 'B. Life-Based Learning', body: 'Each class begins with a real-life digital task, such as booking a clinic appointment and finding the route.' },
          { title: 'C. Social Learning Groups', body: 'Small groups that spark interaction, friendship and shared discovery. Learning becomes social, not solitary.' },
          { title: 'D. Digital Companions', body: 'Continuous support from youth volunteers and AI helpers who guide seniors beyond the classroom.' },
        ],
        shots: [
          [
            { key: 'digital-confidence/line-notices', alt: 'A LINE notice message on a phone.', caption: 'LINE notices' },
            { key: 'digital-confidence/brochure', alt: 'A folded illustrated brochure for pre-class steps.', caption: 'Physical cards' },
            { key: 'digital-confidence/review-materials', alt: 'A LINE menu for reviewing materials anytime.', caption: 'Review materials anytime' },
            { key: 'digital-confidence/ai-helper', alt: 'A LINE chat with the AI helper.', caption: 'Ask the AI helper' },
            { key: 'digital-confidence/volunteer-call', alt: 'A video call with a volunteer.', caption: 'Connect with a volunteer' },
          ],
        ],
      },
      {
        label: 'Impact',
        title: 'Co-learning and iterating in the field.',
        body: 'We tested the concepts in 6 classes with 120+ seniors, gathering 80+ feedback entries. Pre/post checks showed a 35% improvement in task recall, 40% fewer hesitation moments and 30% higher participation, with 70% willing to keep practicing after class. These results informed Taipei’s digital inclusion strategy for 200,000+ residents, shaping curriculum updates, volunteer training and more age-friendly service interfaces across districts.',
        shots: [
          [
            { key: 'digital-confidence/class-1', alt: 'A volunteer helping seniors with their phones at a community center class.' },
            { key: 'digital-confidence/class-2', alt: 'A youth volunteer showing a senior how to use an app.' },
          ],
          [
            { key: 'digital-confidence/group', alt: 'A class of seniors and volunteers posing together.' },
            { key: 'digital-confidence/team', alt: 'The team at the Department of Information Technology.' },
          ],
        ],
      },
    ],
    quote: {
      text: 'Before, I was afraid to press anything wrong. Now I can finish the task myself and even teach my friend next to me.',
      by: 'Senior participant',
    },
  },
]

export const bySlug = (slug: string) => projects.find((p) => p.slug === slug)

export const nextOf = (slug: string) => {
  const i = projects.findIndex((p) => p.slug === slug)
  return projects[(i + 1) % projects.length]
}

/** Accent used as text on the light sky: pulled toward the ink so yellow and cyan stay readable. */
export const tint = (accent: string) => `color-mix(in oklab, ${accent} 40%, #0a0e14)`
