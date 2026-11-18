/**
 * The full text of each case study, transcribed from the PDF portfolio page by page.
 * lib/projects.ts holds the headline copy for each stage; the blocks here sit under it and carry every
 * remaining section, insight, quote, metric and caption from the source. Edit freely: nothing else depends on it.
 *
 * Keyed by project slug, then by the stage `label` used in projects.ts.
 */

export type Block =
  /** A titled sub-section: small label, heading, paragraph. */
  | { k: 'h'; kicker?: string; title: string; body?: string }
  /** A plain list, optionally titled. */
  | { k: 'list'; title?: string; items: string[] }
  /** A grid of short cards. */
  | { k: 'cards'; title?: string; items: { label?: string; title: string; body?: string }[] }
  /** A single quotation. */
  | { k: 'quote'; text: string; by?: string; mood?: string }
  /** Large figures with captions. */
  | { k: 'stats'; title?: string; items: { value: string; label: string }[] }
  /** An ordered sequence. */
  | { k: 'steps'; title?: string; items: { title: string; body?: string }[] }
  /** A before / after pair the reader can drag between. */
  | { k: 'compare'; title?: string; before: { label: string; value: string; note: string }; after: { label: string; value: string; note: string } }
  /** A table. */
  | { k: 'table'; caption: string; head: string[]; rows: string[][] }

type Details = Record<string, Record<string, Block[]>>

export const details: Details = {
  /* ------------------------------------------------------------------ Social Hive */
  'social-hive': {
    'Research & Insight': [
      {
        k: 'h',
        kicker: 'Background',
        title: 'Diminishing social capital in contemporary society',
        body: 'Social capital refers to the trust and mutual support that help communities cooperate and thrive. Today, aging societies, digital dependency, and increasing individualism are weakening these everyday bonds, leaving people more isolated and communities less resilient.',
      },
      {
        k: 'cards',
        title: 'Social capital rests on',
        items: [
          { title: 'Social networks', body: 'The horizontal bonds formed between individuals: interaction and connection.' },
          { title: 'Trust and reciprocity', body: 'Altruistic behavior, social inclusion and mutual recognition.' },
          { title: 'Shared norms and values', body: 'Shared goals and shared relations inside a community.' },
        ],
      },
      {
        k: 'list',
        title: 'What is weakening it',
        items: [
          'Changing family structures',
          'Heavy workload and financial pressure',
          'Rapid evolution of technological products',
          'Economic development and falling social trust',
          'A fading sense of community',
          'The rise of individualism',
          'The prevalence of utilitarianism',
          'Declining government effectiveness',
        ],
      },
      {
        k: 'h',
        kicker: 'Approach',
        title: 'A behavioral and community-driven design approach',
        body: 'Informed by social capital theory and affective computing research, we used behavioral insights and iterative prototyping to understand real interactions and shape designs that strengthen community connection.',
      },
      {
        k: 'cards',
        items: [
          { label: 'Research', title: 'Understand', body: 'Desk research, expert interviews, user surveys and key insights synthesis.' },
          { label: 'Prototype', title: 'Test', body: 'Digital prototyping, physical prototyping, rapid user testing and interaction refinement.' },
          { label: 'Define', title: 'Frame', body: 'Design direction definition, interaction framework development and system design.' },
          { label: 'Real world', title: 'Activate', body: 'Public exhibitions, real-world user testing, behavior and engagement insights, refinement and community activation.' },
        ],
      },
      {
        k: 'h',
        kicker: 'Research goal',
        title: 'Understand barriers and motivators of everyday connection.',
      },
      {
        k: 'list',
        items: [
          'What helps empathy begin in everyday interactions?',
          'What makes people hesitate or feel unable to connect?',
          'How willing are people to connect?',
        ],
      },
      {
        k: 'h',
        kicker: 'Research methods · Desk research',
        title: 'How empathy and trust shape cooperation',
        body: 'We reviewed sociology, behavioral science, and interaction design literature to understand how empathy and trust shape cooperative behavior.',
      },
      {
        k: 'list',
        items: [
          'Trust forms through interpersonal cues (tone, gesture, presence).',
          'Cooperation emerges from shared purpose and mutual recognition.',
          'Technology reduces natural chances for spontaneous empathy.',
        ],
      },
      {
        k: 'h',
        kicker: 'Research methods · Expert interviews',
        title: 'The deeper causes behind modern disconnection',
        body: 'We interviewed sociologists, psychologists, and caregivers to explore the deeper causes behind modern disconnection.',
      },
      {
        k: 'cards',
        items: [
          { label: 'Prof. Wei', title: 'Family Studies, NTNU', body: 'Role conflict and heavy care duties create ongoing emotional pressure.' },
          { label: 'Prof. Liu', title: 'Sociology, SCU', body: 'Competitiveness limits emotional growth and autonomy.' },
          { label: 'Ms. Hsu', title: 'Birth Reform Alliance', body: 'Society offers few low-pressure environments for play, reflection, and trust-building.' },
        ],
      },
      {
        k: 'h',
        kicker: 'Research methods · Survey',
        title: 'How these pressures appear in daily life',
        body: 'Building on our desk research and interviews, we surveyed participants to understand how these pressures appear in daily life.',
      },
      {
        k: 'stats',
        title: 'Life perception',
        items: [
          { value: '78%', label: 'Fast-changing' },
          { value: '66%', label: 'Isolated' },
          { value: '53%', label: 'Stressful' },
        ],
      },
      {
        k: 'stats',
        title: 'Key life skills',
        items: [
          { value: '59%', label: 'Emotional regulation' },
          { value: '57%', label: 'Adaptability' },
          { value: '56%', label: 'Communication' },
        ],
      },
      {
        k: 'stats',
        title: 'Intention vs. action',
        items: [
          { value: '72%', label: 'Willing to help' },
          { value: '29%', label: 'Actually act' },
          { value: '52%', label: 'Cite lack of trust' },
          { value: '47%', label: 'Cite time pressure' },
        ],
      },
      {
        k: 'h',
        kicker: 'Core behavioral insight',
        title: 'Everyday care turns into hesitation.',
        body: 'Empathy becomes harder when people can’t notice each other, lack the emotional capacity to engage, and feel unsure whether their help is welcome, turning everyday care into hesitation.',
      },
      {
        k: 'h',
        kicker: 'Scenarios and empathy maps',
        title: 'How the barriers appear in real contexts',
        body: 'After identifying these underlying barriers, we wanted to understand how they appear in real contexts. We therefore synthesized our survey and interview findings into key scenarios, empathy maps, and a journey map. People need to feel seen, connected, and valued.',
      },
      {
        k: 'cards',
        items: [
          { label: 'Youth', title: 'Seeking recognition and purpose', body: 'Constantly online yet unsure how to create real impact; pressured by expectations and comparison.' },
          { label: 'Caregivers', title: 'Giving support, lacking balance', body: 'Carry continuous emotional labor with little recognition or shared responsibility, leading to exhaustion.' },
          { label: 'Older adults', title: 'Feeling invisible and unincluded', body: 'Experience isolation in fast-moving environments; rarely find spaces where they feel useful or welcomed.' },
        ],
      },
      {
        k: 'h',
        kicker: 'Shared spaces',
        title: 'Connection is missing where people coexist but rarely interact.',
        body: 'People live or work nearby, yet ambiguous boundaries and low trust keep connection from forming. Agendas and structured activities limit natural, comfortable social exchange. Organizers provide time and a shared environment, but few cues that help people start an interaction.',
      },
      {
        k: 'h',
        kicker: 'Current journey map',
        title: 'Unclear roles and weak social cues lead to fading participation.',
        body: 'In existing events, unclear roles and weak social cues lead to fading participation and disengagement.',
      },
      { k: 'quote', text: 'It seems meaningful, and I’d like to help.', mood: 'Hopeful' },
      { k: 'quote', text: 'Once I’m there, I’m not sure what to do. It feels formal, and I don’t really connect with anyone.', mood: 'Unsure' },
      { k: 'quote', text: 'Afterwards, there aren’t any updates or next steps, so I stop returning.', mood: 'Disengaged' },
    ],

    'Prototyping & Iterations': [
      {
        k: 'h',
        kicker: 'Rapid prototyping',
        title: 'Exploring how to make connection tangible',
        body: 'We quickly translated early insights into testable interactions using sketches, handcrafted models, 3D printing, and Arduino prototypes. Each round focused on validating how people respond emotionally, how intuitive the interaction feels, and how feasible the mechanics are in everyday use.',
      },
      {
        k: 'steps',
        items: [
          {
            title: '“Gift of Life”',
            body: 'Public co-creation revealed needs for healing, fairness, and reconnection. We turned these insights into belief objects and responsibility blocks across five life stages. Takeaway: feedback showed the concept addressed real needs but was too abstract and difficult to interact with.',
          },
          {
            title: 'Bee Exploration Ball',
            body: 'We adopted the bee metaphor to make cooperation more playful and relatable, moving away from earlier abstract concepts. Takeaway: the light and vibration interaction was engaging, but the device was too bulky for everyday use.',
          },
          {
            title: 'High-five wearable',
            body: 'We shifted to hand-gesture interactions to create a lighter, wearable connection to the hive system. Takeaway: the gesture and NFC-app link felt intuitive, but the hardware was too fragile for daily use.',
          },
        ],
      },
    ],

    'Concept & System': [
      {
        k: 'h',
        kicker: '3H-H intervention strategies',
        title: 'Forming the final design directions',
        body: 'Three layers of intervention: Human-Hive (human level) lowers barriers and turns simple tasks into steady participation. Hand-Hand (community level) uses playful shared rituals to reduce emotional distance and create warm, trusting moments. Hope-Horizon (society level) makes collective progress visible, reinforcing belonging and long-term motivation.',
      },
      {
        k: 'h',
        kicker: 'System design',
        title: 'Designing a system that makes care visible and continuous',
        body: 'The Hive Connect System links digital participation with tangible interaction, using light gamification to make care visible, rewarding, and continuous. Through the Hive Connect App and Hive Sensor, users engage in meaningful reciprocal actions and see how their contributions build collective connection over time.',
      },
      {
        k: 'steps',
        title: 'How it works',
        items: [
          { title: 'Explore & join', body: 'Users explore nearby or themed “Pollination Tasks” via an interactive map, or join spontaneous “Dandelion Missions”.' },
          { title: 'Connect & contribute', body: 'Users connect with interest-based communities and check in via NFC using the Hive Sensor. High-five interactions trigger light and vibration feedback to celebrate each contribution.' },
          { title: 'Reflect, share & reinvest', body: 'After contributing, users share reflections, photos, and stories in community feeds and earn Nectar Points, redeemable for personal perks or reinvested into community projects.' },
        ],
      },
      {
        k: 'list',
        title: 'The loop',
        items: ['Pollination tasks', 'Contribution', 'Nectar points', 'Harvest'],
      },
      {
        k: 'list',
        title: 'In the app',
        items: ['Explore', 'Create events', 'Missions', 'Communities', 'Chat', 'Profile', 'Rewards'],
      },
      {
        k: 'cards',
        title: 'Social rewards',
        items: [
          { title: 'Everyday conveniences' },
          { title: 'Social impact opportunities', body: 'Plant adoption, donations, or NGO collaborations.' },
        ],
      },
    ],

    'Testing & Impact': [
      {
        k: 'h',
        title: 'Two testing rounds revealed early limitations and guided us toward a lighter, more intuitive system.',
        body: 'Across two rounds of testing, we gathered 4,012 interaction records from 3,437 participants to evaluate how usable the system felt, how strongly the interactions conveyed warmth and trust, and how feasible each prototype was for everyday use.',
      },
      {
        k: 'cards',
        items: [
          { label: 'Round I', title: 'Hive Connect System prototype', body: 'We tested the Hive Sensor to explore empathy through light and vibration feedback. Participants found the prototype “warm and playful,” but about 21% noted issues with weight, fragility, or cost.' },
          { label: 'Round II', title: 'Paper-based NFC wristband prototype', body: 'We introduced a lightweight NFC wristband for easier participation. Over 95% described the wristband as “light and intuitive,” confirming improved accessibility, engagement, and scalability.' },
        ],
      },
      {
        k: 'steps',
        title: 'Participatory area: Hive a nice day',
        items: [
          { title: 'Pick up a wristband' },
          { title: 'Write a blessing' },
          { title: 'Tie on the wristbands', body: 'Hive wristbands.' },
          { title: 'Exchange' },
          { title: 'Wear the device', body: 'Optional.' },
          { title: 'Clap to collect nectar' },
        ],
      },
      {
        k: 'h',
        kicker: 'Business model',
        title: 'Sustainable cross-sector participation',
        body: 'Social Hive uses a dual-value model combining B2C participation with B2B partnerships across government, corporate, and NGO sectors. Sponsorships, campaigns, and merchandise reinforce a self-sustaining cycle of community engagement.',
      },
      {
        k: 'h',
        kicker: 'Vision',
        title: 'Scaling mutual support across communities',
        body: 'Future growth centers on local partnerships and AI-driven personalization to adapt activities to community needs. The long-term vision is a citywide ecosystem where small, everyday actions strengthen empathy, trust, and collective connection.',
      },
    ],
  },

  /* ------------------------------------------------------------------ Workplace Unboxing Plan */
  'workplace-unboxing-plan': {
    'Field Research': [
      {
        k: 'h',
        kicker: 'Background',
        title: 'Aligning traditional structures with modern employee expectations',
        body: 'In a highly regulated financial environment, Nanshan Life is expanding into digital and service roles. Modern professionals now expect more flexibility, purpose, and cultural clarity, highlighting the need for a more engaging and cohesive onboarding experience.',
      },
      {
        k: 'cards',
        items: [
          { label: 'The institution', title: 'Large, established financial institution', body: 'Strict government regulations and compliance procedures, and a formal, complex recruitment and onboarding experience.' },
          { label: 'Modern professionals', title: 'Flexibility, purpose, growth', body: 'Motivated by meaningful impact and balance. Collaborative, digital, adaptive work style; innovation-driven digital natives.' },
        ],
      },
      {
        k: 'h',
        kicker: 'Design process',
        title: 'Scenario-based design for understanding how job seekers navigate the onboarding journey',
        body: 'We created narrative scenarios from application to early employment, capturing job seekers’ motivations, uncertainties, HR interactions, and emotional responses. These stories revealed key decision points and constraints, allowing us to turn insights into service concepts grounded in real needs and organizational feasibility.',
      },
      {
        k: 'cards',
        items: [
          { label: 'Field research', title: 'Listen', body: 'Desktop research, site observation, 3 focus groups (3 participants each), 2 in-depth and 3 external interviews, survey.' },
          { label: 'Insight analysis', title: 'Make sense', body: 'Transcripts, experience stories, persona, customer journey map, 4 service insights, coolhunting research.' },
          { label: 'Co-creation', title: 'Build together', body: 'Brand values, 30 innovation cards, 4 concept directions, co-creation workshop.' },
          { label: 'Prototype & proposal', title: 'Propose', body: 'Service prototyping and the final proposal.' },
        ],
      },
      {
        k: 'h',
        kicker: 'Research goal',
        title: 'How recruitment and onboarding shape employee perception, adaptation, and engagement',
        body: 'To understand how recruitment and onboarding shape employee perception, adaptation, and engagement across roles and generations.',
      },
      {
        k: 'list',
        items: [
          'What challenges and pain points occur during the recruitment and onboarding process?',
          'How do employees and candidates perceive the company’s culture and brand in early stages?',
          'What strengthens new hires’ sense of connection and belonging?',
        ],
      },
      {
        k: 'cards',
        title: 'Research methods',
        items: [
          { label: 'Desktop research', title: 'Analyzing employer branding and stakeholders', body: 'We reviewed Nanshan’s website, job ads, and social media to assess its employer image. A stakeholder map showed how HR, supervisors, and new hires interact across onboarding, highlighting structures specific to the insurance industry.' },
          { label: 'Site observation', title: 'Mapping the existing onboarding process', body: 'At Nanshan HQ, we mapped the onboarding process with HR and uncovered communication gaps between departments. The visit revealed how Nanshan’s values, HR goals, and training system align to attract young talent while balancing tradition.' },
          { label: 'Interviews', title: 'Understanding employee experiences and needs', body: 'We conducted interviews to understand motivations, culture perception, and onboarding challenges from recruitment to early adaptation.' },
          { label: 'Survey', title: 'Broadening insights across the organization', body: 'The “Onboarding Memory Log” survey (89 responses) gathered feedback across five stages: application, interview, pre-onboarding, probation, and post-probation, using open-ended and scaled questions.' },
        ],
      },
      {
        k: 'cards',
        title: 'Interview findings',
        items: [
          { label: 'Focus groups', title: '9 employees: new graduates, experienced workers and mentors', body: 'Participants often praised the company, a view shaped by hierarchy and group dynamics.' },
          { label: 'In-depth interviews', title: '2 interviews', body: 'Engaged employees were more willing to share personal challenges and honest reflections.' },
          { label: 'External comparison', title: 'Other insurance firms', body: 'Interviewed professionals from other insurance firms to benchmark onboarding practices and identify industry gaps.' },
        ],
      },
    ],

    'Insight Analysis': [
      {
        k: 'h',
        kicker: 'Experience story mapping',
        title: 'Finding patterns through experience story cards',
        body: 'We synthesized interview and survey data into 9 categories and 87 experience stories with real quotes and emotions. These story cards helped us compare roles, identify recurring patterns and key Moments of Truth, support clustering, and ground scenarios in real employee behavior.',
      },
      {
        k: 'h',
        kicker: 'Takeaway',
        title: 'Human judgment still matters.',
        body: 'AI-assisted clustering sped up pattern recognition but often overread emotions, showing the need for human judgment.',
      },
      {
        k: 'h',
        kicker: 'Persona',
        title: 'Key persona: experienced job seekers',
        body: 'Professionals seeking growth yet struggling with cultural adaptation became our primary focus for improving onboarding.',
      },
      {
        k: 'cards',
        title: 'Persona positioning matrix',
        items: [
          { label: 'Deep expertise × personal growth', title: 'Career advancement' },
          { label: 'Deep expertise × organizational culture', title: 'Network builder' },
          { label: 'Newcomer × personal growth', title: 'Professional accumulation' },
          { label: 'Newcomer × organizational culture', title: 'Work-life balancer' },
        ],
      },
      {
        k: 'h',
        kicker: 'Lin Chih-Wei',
        title: '“At 40, a good job means fair pay and a healthy environment.”',
        body: 'An experienced finance professional with 10+ years in foreign investment and securities. He seeks structured growth, transparent expectations, clear responsibilities, and trustworthy leadership, aiming for roles that provide long-term stability and a clear path for development. Clear career goals. Adaptable and analytical. Strong finance and operations expertise.',
      },
      { k: 'quote', text: 'The onboarding felt structured, but it lacked clarity about benefits, workload, and culture.', by: 'Mr. Ko, mid-career employee' },
      { k: 'quote', text: 'I got in through connections, but the team’s understaffing makes support feel limited.', by: 'Jerry, external candidate' },
      {
        k: 'h',
        kicker: 'Journey map',
        title: 'Key moments of truth: pre-interview and post-onboarding',
        body: 'We mapped the employee journey using interviews, surveys, and workflow observations. Two key Moments of Truth emerged: pre-interview, where limited transparency shapes first impressions, and post-onboarding, where inconsistent guidance affects long-term engagement.',
      },
      {
        k: 'steps',
        items: [
          { title: 'Job search & application', body: '“The role sounds interesting, but I still can’t tell what the day-to-day actually looks like!” Hopeful, curious.' },
          { title: 'Interview', body: '“Everyone was polite, but I left the interview still unsure about the team culture.” Neutral, cautious.' },
          { title: 'Offer & pre-boarding', body: '“The offer was great, but the paperwork felt overwhelming and unclear.” Reassured, slightly stressed.' },
          { title: 'Onboarding', body: '“Training was thorough, but I barely had time to meet my team or understand how they work together.” Welcomed, slightly uncertain.' },
          { title: 'Early employment', body: '“My manager is helpful, but the guidance really depends on who you work with.” Stable, seeking clarity.' },
        ],
      },
      {
        k: 'h',
        kicker: 'Laddering analysis',
        title: 'Uncovering deeper motivations beneath surface pain points',
        body: 'Using 87 experience stories, we applied laddering analysis to connect job seekers’ actions with their underlying motivations and values. This revealed four core needs, which we synthesized into insight cards: activity, objective, real experience story, core value need, supporting evidence and key insight.',
      },
      {
        k: 'cards',
        title: 'Key insights',
        items: [
          { title: 'Dream Navigator', body: 'Employees seek companies that align with their long-term direction, offering clear career paths, learning resources, and growth opportunities.' },
          { title: 'Company Growth, My Mission', body: 'Visionary leadership and shared goals inspire employees to grow with the company, finding fulfillment in collective success.' },
          { title: 'More Than Colleagues, Almost Friends', body: 'Supportive peers, open communication, and informal interactions foster belonging and strengthen collaboration.' },
          { title: 'Smooth Landing', body: 'Transparent onboarding, responsive HR, and structured mentorship build confidence and help new hires adapt quickly.' },
        ],
      },
    ],

    'Co-creation': [
      {
        k: 'h',
        kicker: 'Innovation matrix & co-creation workshop',
        title: 'Turning insights into practical opportunities',
        body: 'We highlighted where user needs aligned with realistic intervention points in the recruitment and onboarding journey. During the co-creation workshop, employees and HR evaluated these opportunities together, helping us refine which ideas were most valuable for candidates and feasible for the organization to implement.',
      },
      {
        k: 'cards',
        title: 'Design principles',
        items: [
          { title: 'Diverse ways to understand Nanshan', body: 'Provide multiple channels for job seekers to learn about the company through employee stories and real work experiences.' },
          { title: 'Aligning roles and expectations', body: 'Use consultations and job-fit tools to help candidates evaluate how well the role matches their goals.' },
          { title: 'Strengthening team connection', body: 'Create opportunities for new hires to engage with supervisors and colleagues, accelerating team integration and job readiness.' },
        ],
      },
      {
        k: 'h',
        kicker: 'Service prototype',
        title: 'Testing onboarding scenarios with LEGO prototypes',
        body: 'We simulated key interview and onboarding moments to observe how candidates, supervisors, and HR naturally interacted. These quick simulations revealed where flows felt intuitive or unclear, allowing us to refine the four concept directions to better match real behaviors and operational constraints. The kit combined a context scene, dialogue bubbles, character interaction and scenario captions, drawing on 30 global onboarding cases.',
      },
      {
        k: 'steps',
        items: [
          { title: 'Early research', body: 'Having a casual team chat.' },
          { title: 'Pre-interview' },
          { title: 'Interview', body: 'Aligning expectations.' },
          { title: 'Early onboarding', body: 'Connecting with teammates.' },
        ],
      },
    ],

    'Prototype & Proposal': [
      {
        k: 'h',
        kicker: 'Final refinement and service system',
        title: 'Workplace Unboxing Plan: a systematic pathway for early clarity and connection',
        body: 'The solution brings four services together into a unified onboarding system that improves transparency, strengthens guidance, and helps new hires integrate sooner. By connecting candidates, HR, and mentors through structured touchpoints, the plan enhances both adaptation speed and organizational alignment.',
      },
      {
        k: 'cards',
        items: [
          { label: 'Job search & application', title: 'A. Nanshan Inside', body: 'A Medium-style platform where employees share real work stories and departmental insights to strengthen transparency and employer branding.' },
          { label: 'Before the interview', title: 'B. Brew your future', body: 'A digital coffee-chat system that connects candidates with mentors through scheduled online sessions, enabling authentic, compliant pre-interview conversations.' },
          { label: 'Interview', title: 'C. Job Matching Form', body: 'A redesigned form that captures candidates’ workplace preferences and expectations, helping HR and supervisors tailor interviews and improve matching accuracy.' },
          { label: 'Onboarding', title: 'D. Afternoon Session', body: 'A casual onboarding tea session where new hires meet supervisors and peers, fostering early connection and smoother adaptation.' },
        ],
      },
      {
        k: 'h',
        kicker: 'Pop-up evaluation',
        title: 'Employees prioritize transparency and low-pressure interaction',
        body: 'From 25 participants, Nanshan Inside scored highest (8.1 usefulness, 7.4 feasibility), showing strong demand for transparent, authentic information, while Coffee Chat showed lower feasibility (6.2), indicating scheduling and format concerns. Overall, results confirmed the concepts’ value and clarified where refinement is needed.',
      },
      {
        k: 'cards',
        title: 'Feedback and next refinements',
        items: [
          { label: 'A. Nanshan Inside', title: 'Sustain engagement', body: 'Add review and rotation mechanisms to sustain engagement.' },
          { label: 'B. Brew your future', title: 'Separate from interviews', body: 'Clarify scheduling and distinguish from formal interviews.' },
          { label: 'C. Job Matching Form', title: 'Simplify', body: 'Refine positioning and simplify response options.' },
          { label: 'D. Afternoon Session', title: 'Keep it casual', body: 'Increase flexibility and keep the format casual to ease pressure.' },
        ],
      },
      {
        k: 'h',
        kicker: 'Impact',
        title: 'Driving real change in Nanshan’s onboarding',
        body: 'Nanshan Life’s HR leadership adopted key parts of our proposal for their feasibility and alignment with transformation goals. Elements such as Nanshan Inside and the Afternoon Session are now implemented across teams, supporting more than 300 new hires each year. These changes helped reduce adaptation time from six to three weeks (50%), strengthen cross-department connection, and create a more transparent and supportive onboarding experience.',
      },
      {
        k: 'compare',
        title: 'Time to feel at home',
        before: { label: 'Before', value: '6 weeks', note: 'Adaptation time for new hires before the redesigned onboarding.' },
        after: { label: 'After', value: '3 weeks', note: 'Half the time (−50%) once Nanshan Inside and the Afternoon Session were adopted.' },
      },
    ],
  },

  /* ------------------------------------------------------------------ FlexFit Gym */
  'flexfit-gym': {
    Discover: [
      {
        k: 'h',
        kicker: 'Background',
        title: 'Designing an inclusive gym for the second administrative center',
        body: 'As part of the new New Taipei City Second Administrative Center, the New Taipei City Government launched a Design for SDGs initiative to create a gender-neutral, accessible, and sustainable gym for the community. The project supports the city’s five SDG-driven values, reflecting its vision to “leave no one behind.”',
      },
      {
        k: 'list',
        title: 'The five city values',
        items: ['Sustainable community', 'Inclusiveness', 'Wellness', 'Carbon neutrality', 'Smart future'],
      },
      {
        k: 'h',
        kicker: 'Design process',
        title: 'Turning spatial barriers into systemic change',
        body: 'I adopted the Double Diamond to synthesize diverse inputs, including user behavior, spatial limitations, and policy constraints, into a clear design direction. Its divergent stage revealed system patterns, and its convergent stage supported focused prototyping and refinement, leading to an integrated spatial-technology solution.',
      },
      {
        k: 'steps',
        items: [
          { title: 'Discover', body: 'Policy review, field studies, user and staff interviews.' },
          { title: 'Define', body: 'Insight synthesis and problem framing.' },
          { title: 'Develop', body: 'Concept development, digital and physical prototyping.' },
          { title: 'Deliver', body: 'User testing, simulation and final refinement.' },
        ],
      },
      {
        k: 'h',
        kicker: 'Research',
        title: 'Revealing inclusion gaps in public gyms',
        body: 'To understand how gyms limit equitable participation, I reviewed municipal guidelines, observed three gyms, and interviewed eight users and staff about comfort, safety, and access. The research clarified how different groups navigate the space, which barriers restrict participation, and what changes are needed to support diverse abilities.',
      },
    ],

    Define: [
      {
        k: 'stats',
        title: 'What the research showed',
        items: [
          { value: '74.1%', label: 'of men prefer weight machines' },
          { value: '75.7%', label: 'of women favor cardio' },
          { value: '60%+', label: 'of women feel safer in female-only zones' },
        ],
      },
      {
        k: 'cards',
        title: 'Design direction',
        items: [
          { title: 'Prioritize diverse users', body: 'Shift from performance-centric gyms to environments that support varied comfort levels and abilities.' },
          { title: 'Design for spatial flexibility', body: 'Ensure spaces and equipment can adapt to users, not the other way around.' },
          { title: 'Integrate sustainable well-being', body: 'Connect personal wellness with energy-efficient and environmentally conscious systems.' },
        ],
      },
      {
        k: 'h',
        kicker: 'Concept development',
        title: 'From fixed layouts to fluid, human-centered environments',
        body: 'Research revealed that inclusivity depends on how spaces adapt to users’ diverse needs. Early sketches explored movable layouts and modular systems that respond to gender balance, accessibility, and crowd density. These explorations led to the Intelligent Track System, a responsive ceiling-mounted structure enabling real-time spatial transformation.',
      },
    ],

    Develop: [
      {
        k: 'h',
        kicker: 'Adaptive spatial framework',
        title: 'A ceiling track that reads the room',
        body: 'A ceiling-mounted track moves modular equipment along rails. Overhead people-counting sensors and lightweight computer vision detect density, movement patterns, and activity types, allowing the system to automatically adjust spacing, circulation, and lighting to support strength, cardio, or group training.',
      },
      {
        k: 'list',
        title: 'What the system responds to',
        items: ['Sport theme', 'Number of people', 'Off-peak to peak hour', 'Gender balance, from men to women'],
      },
      {
        k: 'cards',
        items: [
          { label: 'Energy generation', title: 'Training that powers the gym', body: 'Cycling units and training equipment convert kinetic energy into electrical energy.' },
          { label: 'Coaching intelligence', title: 'Guidance for every ability', body: 'Real-time guidance delivered through zone displays using basic motion sensing ensures safe, personalized training for users of varying abilities.' },
        ],
      },
      {
        k: 'steps',
        title: 'The coaching display',
        items: [{ title: 'Welcome and daily goal' }, { title: 'Motion tracking' }, { title: 'Progress visualization' }],
      },
    ],

    Deliver: [
      {
        k: 'list',
        title: 'The floor plan',
        items: ['Entrance', 'Gender-neutral toilet', 'Resting area', 'Training area', 'Storage area', 'Boxing and ceiling-track equipment'],
      },
      {
        k: 'h',
        kicker: 'Outcome',
        title: 'Bridging policy, people, and place',
        body: 'FlexFit demonstrated how design can turn policy goals into practical, human-centered solutions. Presented at the Future City Forum (2024), the project received First Prize under the Design for SDGs initiative and informed New Taipei City’s new gender-friendly gym guidelines, influencing facility standards for 4 million residents. It now serves as a scalable model for schools, offices, and public institutions aiming to build healthier and more inclusive environments.',
      },
    ],
  },

  /* ------------------------------------------------------------------ Designing Digital Confidence */
  'designing-digital-confidence': {
    'Field Research': [
      {
        k: 'h',
        kicker: 'Background',
        title: 'A growing digital participation gap',
        body: 'As Taipei advanced its smart-city transformation, the Digital Strategy Center worked to enhance digital inclusion by improving the city’s digital-literacy programs and the Digital Helper Network, mobilizing volunteers across 12 districts to help residents adapt to emerging digital services.',
      },
      {
        k: 'cards',
        title: 'Taipei Digital Helper Network',
        items: [
          { title: 'Community digital helpers', body: 'Conduct digital literacy classes at community centers and district offices, helping residents learn smartphone and e-service basics.' },
          { title: 'Resident digital helpers', body: 'Stationed at neighborhood offices to offer one-on-one assistance, answering questions and solving daily digital issues.' },
          { title: 'Youth digital helpers', body: 'Recruit university students to design intergenerational learning activities and assist older adults in using digital tools.' },
          { title: 'Digital empowerment courses', body: 'Provide hands-on training in emerging technologies such as AR/VR, laser engraving, IoT, and AI, enhancing helpers’ teaching capacity.' },
        ],
      },
      {
        k: 'cards',
        title: 'Training themes',
        items: [
          { title: 'Smart government', body: 'Using e-government and alert apps.' },
          { title: 'Digital health', body: 'Managing the NHI app and online registration.' },
          { title: 'AI literacy', body: 'Everyday use of generative AI tools.' },
          { title: 'Creative media', body: 'Smartphone photography and video sharing.' },
          { title: 'Digital creativity', body: 'AR/VR, laser engraving, IoT workshops.' },
          { title: 'Cybersecurity', body: 'Fraud prevention and privacy protection.' },
        ],
      },
      {
        k: 'h',
        kicker: 'Design process',
        title: 'Understanding the system behind seniors’ digital struggles',
        body: 'The framework enabled us to observe real learning contexts, analyze cross-stakeholder patterns, and turn insights into actionable service improvements. It helped us distinguish technical problems from deeper cognitive and emotional barriers, ensuring more targeted recommendations for Taipei’s digital inclusion programs.',
      },
      {
        k: 'steps',
        items: [
          { title: 'Field research', body: 'Class observations. Interviews with seniors, instructors, and volunteers.' },
          { title: 'Insights', body: 'Behavioral, cognitive, and emotional patterns. Barrier clustering.' },
          { title: 'Concepts', body: 'Opportunity definition mapping. Concept exploration.' },
          { title: 'Impact', body: 'Stakeholder reviews. Scenario walkthroughs.' },
        ],
      },
      {
        k: 'h',
        kicker: 'Research goal',
        title: 'Confidence, motivation and long-term participation',
        body: 'To understand how older adults in Taipei engage with digital tools and uncover ways to strengthen their confidence, motivation, and long-term participation in public digital programs.',
      },
      {
        k: 'list',
        items: [
          'What cognitive, emotional, and behavioral barriers affect seniors’ digital confidence?',
          'What factors encourage sustained motivation and engagement?',
          'How can public programs be redesigned to foster trust, clarity, and inclusion?',
        ],
      },
      {
        k: 'cards',
        title: 'Observation and reflection form',
        items: [
          { label: 'Observation', title: 'What happened in class', body: 'What tools or skills were taught? How did seniors perform? What difficulties appeared?' },
          { label: 'Reflection', title: 'What to improve', body: 'Which methods worked well, and why? How could the teaching approach or content be improved?' },
        ],
      },
    ],

    Insights: [
      {
        k: 'list',
        title: 'Motivation exists, but anxiety blocks action',
        items: ['Fear of “breaking something”', 'Privacy concerns (“the camera will show my messy home”)', 'Stress from unclear or technical wording'],
      },
      {
        k: 'list',
        title: 'Seniors learn differently',
        items: ['Trouble recalling multi-step actions and passwords', 'Misreading prompts', 'Loss of confidence after mistakes'],
      },
    ],

    Concepts: [
      {
        k: 'h',
        kicker: 'Design challenge',
        title: 'How might we enable older adults not only to access technology, but to participate in digital life with confidence, clarity, and support?',
      },
      {
        k: 'h',
        kicker: 'Reframing',
        title: 'Building confidence and continuity in senior digital learning',
        body: 'Using user journey mapping, we identified key touchpoints where seniors’ confidence and engagement often broke down: before class (setup confusion), during class (information overload), and after class (lack of support). To address these breakdowns, we reframed our design approach from teaching “how to use technology” to designing an ecosystem that builds confidence, connection, and continuity.',
      },
      {
        k: 'steps',
        title: 'Where confidence broke down',
        items: [
          { title: 'Before class', body: 'Setup confusion.' },
          { title: 'During class', body: 'Information overload.' },
          { title: 'After class', body: 'Lack of support.' },
        ],
      },
      {
        k: 'cards',
        title: 'The four concepts, in detail',
        items: [
          { label: 'Before class', title: 'A. Smart Start', body: 'A hybrid onboarding tool, with LINE notices and physical cards, that guides seniors through simple pre-class steps, easing anxiety and building confidence before learning begins.' },
          { label: 'During class', title: 'B. Life-Based Learning', body: 'Each class begins with a real-life digital task that makes learning easier to understand and more relevant. Example: booking a clinic appointment, adding the visit to Calendar, and finding the route on Google Maps.' },
          { label: 'During class', title: 'C. Social Learning Groups', body: 'Small-group learning that sparks interaction, friendship, and shared discovery. Small-group discussions build confidence, and a LINE group keeps learning alive.' },
          { label: 'After class', title: 'D. Digital Companions', body: 'Continuous support through youth volunteers and AI helpers who guide seniors beyond the classroom.' },
        ],
      },
      {
        k: 'steps',
        title: 'Digital companions, after class',
        items: [
          { title: 'Review materials anytime', body: 'Phone setup guide, recommended apps, practice worksheets and quizzes.' },
          { title: 'Ask the AI helper', body: 'Receive quick, step-by-step support directly in LINE.' },
          { title: 'Connect with a volunteer', body: 'Receive support or a short video call for complex issues.' },
        ],
      },
    ],

    Impact: [
      {
        k: 'stats',
        title: 'Concept validation',
        items: [
          { value: '6', label: 'classes tested' },
          { value: '120+', label: 'seniors' },
          { value: '80+', label: 'feedback entries' },
          { value: '35%', label: 'improvement in task recall' },
          { value: '40%', label: 'fewer hesitation moments' },
          { value: '30%', label: 'higher participation' },
          { value: '70%', label: 'willing to keep practicing' },
        ],
      },
      { k: 'quote', text: 'The real-life tasks made lessons more natural. Everyone stayed engaged, and we spent less time fixing logins.', by: 'Instructor' },
      { k: 'quote', text: 'After class, many seniors asked follow-up questions on LINE. Having the review materials made it easy for us to help them step by step.', by: 'Youth volunteer' },
      { k: 'quote', text: 'The data and feedback helped us reframe digital inclusion as a long-term service, not a one-time class.', by: 'Government staff' },
    ],
  },
}
