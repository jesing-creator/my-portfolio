/**
 * Individual diagrams, research charts, journey maps, wireframes and photo groups cropped from the PDF
 * (scripts/make_figures.py). `at` is the index of the narrative block in lib/details.ts that each figure sits beside.
 * Generated file: edit scripts/make_figures.py and re-run, or edit by hand.
 */
export type Figure = { src: string; w: number; h: number; page: number; title: string; caption: string; at: number; step?: number; diagram?: string; lead?: boolean }
export const figures: Record<string, Record<string, Figure[]>> = {
  "social-hive": {
    "Research & Insight": [
      { "src": "", "w": 0, "h": 0, "page": 0, "diagram": "social-pillars", "title": "Social capital framework", "caption": "", "at": 0 },
      { "src": "", "w": 0, "h": 0, "page": 0, "diagram": "social-desk", "title": "Desk research", "caption": "", "at": 7 },
      {
        "src": "/work/social-hive/fig-p05-desk.jpg",
        "w": 837,
        "h": 261,
        "page": 5,
        "title": "Desk research in practice",
        "caption": "30+ sources on oxytocin, digital dependency and the eusocial species.",
        "at": 7
      },
      {
        "src": "/work/social-hive/fig-p05-interviews.jpg",
        "w": 837,
        "h": 203,
        "page": 5,
        "title": "Expert interviews",
        "caption": "Sociologists, psychologists and caregivers on role conflict and pressure.",
        "at": 9
      },
      {
        "src": "/work/social-hive/fig-p06-scenario.jpg",
        "w": 1485,
        "h": 657,
        "page": 6,
        "title": "Key scenario",
        "caption": "Dense urban areas, community gatherings and public spaces where people coexist but rarely interact.",
        "at": 18
      },
      { "src": "", "w": 0, "h": 0, "page": 0, "diagram": "social-journey", "title": "Current journey map", "caption": "", "at": 19 },
    ],
    "Prototyping & Iterations": [
      {
        "src": "/work/social-hive/fig-p07-gift.jpg",
        "w": 837,
        "h": 679,
        "page": 7,
        "title": "1. Gift of Life concept",
        "caption": "Belief objects and responsibility blocks across five life stages, with the feedback they earned.",
        "at": 1,
        "step": 0
      },
      {
        "src": "/work/social-hive/fig-p07-bee.jpg",
        "w": 864,
        "h": 679,
        "page": 7,
        "title": "2. Bee Exploration Ball",
        "caption": "Light and vibration interaction: engaging, but too bulky for daily use.",
        "at": 1,
        "step": 1
      },
      {
        "src": "/work/social-hive/fig-p07-highfive.jpg",
        "w": 864,
        "h": 679,
        "page": 7,
        "title": "3. High-Five wearable",
        "caption": "Gesture plus NFC app link: intuitive, but too fragile.",
        "at": 1,
        "step": 2
      }
    ],
    "Concept & System": [
      {
        "src": "/work/social-hive/fig-p08-explore.jpg",
        "w": 1188,
        "h": 332,
        "page": 8,
        "title": "1. Explore & Join",
        "caption": "Pollination tasks and Dandelion missions in the Hive Connect app.",
        "at": 2,
        "step": 0
      },
      {
        "src": "/work/social-hive/fig-p09-connect.jpg",
        "w": 1188,
        "h": 352,
        "page": 9,
        "title": "2. Connect & Contribute",
        "caption": "The Hive Sensor: NFC check-in with light and vibration feedback.",
        "at": 2,
        "step": 1
      },
      {
        "src": "/work/social-hive/fig-p09-sensor.jpg",
        "w": 1485,
        "h": 477,
        "page": 9,
        "title": "Hive Sensor in use",
        "caption": "App screens, wearable and volunteers.",
        "at": 2,
        "step": 1
      },
      {
        "src": "/work/social-hive/fig-p08-screens.jpg",
        "w": 1647,
        "h": 458,
        "page": 8,
        "title": "App screens",
        "caption": "Explore, Missions, Communities and Chat.",
        "at": 4
      },
      {
        "src": "/work/social-hive/fig-p09-reflect.jpg",
        "w": 540,
        "h": 325,
        "page": 9,
        "title": "3. Reflect, Share & Reinvest",
        "caption": "Feed, profile and Nectar Points rewards, and the social rewards they unlock.",
        "at": 2,
        "step": 2
      }
    ],
    "Testing & Impact": [
      {
        "src": "/work/social-hive/fig-p10-rounds.jpg",
        "w": 864,
        "h": 521,
        "page": 10,
        "title": "Two testing rounds",
        "caption": "Round I: Hive Connect prototype. Round II: paper NFC wristband.",
        "at": 0
      },
      {
        "src": "/work/social-hive/fig-p10-expo.jpg",
        "w": 1800,
        "h": 474,
        "page": 10,
        "title": "Exhibition and testing process",
        "caption": "The six-step wristband ritual, tested with real visitors.",
        "at": 2
      },
      {
        "src": "/work/social-hive/fig-p11-biz.jpg",
        "w": 1458,
        "h": 726,
        "page": 11,
        "title": "Cross-sector partnership",
        "caption": "B2C participation with B2B, government and NGO partners.",
        "at": 3
      },
      {
        "src": "/work/social-hive/fig-p11-awards.jpg",
        "w": 1080,
        "h": 916,
        "page": 11,
        "title": "Presenting and winning",
        "caption": "Pitching and receiving first prize.",
        "at": 4
      },
      {
        "src": "/work/social-hive/fig-p11-map.jpg",
        "w": 1458,
        "h": 897,
        "page": 11,
        "title": "A citywide hive",
        "caption": "Society, community and individual layers across the map.",
        "at": 4
      }
    ]
  },
  "workplace-unboxing-plan": {
    "Field Research": [
      {
        "src": "/work/workplace-unboxing/fig-p13-context.jpg",
        "w": 1800,
        "h": 379,
        "page": 13,
        "title": "The organisation and the people",
        "caption": "A formal institution, its internal and external professions, and the modern professionals it hires.",
        "at": 1
      },
      { "src": "", "w": 0, "h": 0, "page": 0, "diagram": "workplace-flow", "title": "Research process", "caption": "", "at": 2 },
      {
        "src": "/work/workplace-unboxing/fig-p14-desk.jpg",
        "w": 1242,
        "h": 250,
        "page": 14,
        "title": "Desktop research",
        "caption": "Employer branding, stakeholder map and affinity wall.",
        "at": 6
      },
      {
        "src": "/work/workplace-unboxing/fig-p14-site.jpg",
        "w": 1269,
        "h": 305,
        "page": 14,
        "title": "Site observation",
        "caption": "The existing onboarding process, mapped on site at Nanshan HQ.",
        "at": 6
      },
      {
        "src": "/work/workplace-unboxing/fig-p14-interviews.jpg",
        "w": 323,
        "h": 331,
        "page": 14,
        "title": "Interviews",
        "caption": "Focus groups, in-depth interviews and external comparison.",
        "at": 7
      },
      {
        "src": "/work/workplace-unboxing/fig-p14-survey.jpg",
        "w": 1269,
        "h": 438,
        "page": 14,
        "title": "Memory Log survey",
        "caption": "89 responses across five stages of the employee journey.",
        "at": 7
      }
    ],
    "Insight Analysis": [
      {
        "src": "/work/workplace-unboxing/fig-p15-stories.jpg",
        "w": 1377,
        "h": 497,
        "page": 15,
        "title": "Experience story cards",
        "caption": "87 stories clustered into 9 categories.",
        "at": 0
      },
      { "src": "", "w": 0, "h": 0, "page": 0, "diagram": "workplace-matrix", "title": "Persona positioning matrix", "caption": "", "at": 2 },
      {
        "src": "/work/workplace-unboxing/fig-p15-persona.jpg",
        "w": 634,
        "h": 680,
        "page": 15,
        "title": "Lin Chih-Wei, key persona",
        "caption": "An experienced finance professional seeking structured growth.",
        "at": 4
      },
      { "src": "", "w": 0, "h": 0, "page": 0, "diagram": "workplace-journey", "title": "Employee journey map", "caption": "", "at": 6 },
      {
        "src": "/work/workplace-unboxing/fig-p16-ladder.jpg",
        "w": 810,
        "h": 690,
        "page": 16,
        "title": "Laddering analysis",
        "caption": "From story to value need to insight.",
        "at": 9
      }
    ],
    "Co-creation": [
      {
        "src": "/work/workplace-unboxing/fig-p17-workshop.jpg",
        "w": 1674,
        "h": 401,
        "page": 17,
        "title": "Co-creation workshop",
        "caption": "Employees and HR sorting insights on the innovation matrix.",
        "at": 0
      },
      {
        "src": "/work/workplace-unboxing/fig-p17-lego.jpg",
        "w": 1800,
        "h": 501,
        "page": 17,
        "title": "LEGO service prototypes",
        "caption": "Four onboarding scenarios acted out in LEGO.",
        "at": 3
      }
    ],
    "Prototype & Proposal": [
      {
        "src": "/work/workplace-unboxing/fig-p18-svcA.jpg",
        "w": 1242,
        "h": 376,
        "page": 18,
        "title": "A. Nanshan Inside",
        "caption": "Service blueprint for the storytelling platform.",
        "at": 1,
        "step": 0
      },
      {
        "src": "/work/workplace-unboxing/fig-p18-svcB.jpg",
        "w": 1296,
        "h": 432,
        "page": 18,
        "title": "B. Brew your future",
        "caption": "Service blueprint for the digital coffee chat.",
        "at": 1,
        "step": 1
      },
      {
        "src": "/work/workplace-unboxing/fig-p18-svcC.jpg",
        "w": 1242,
        "h": 446,
        "page": 18,
        "title": "C. Job Matching Form",
        "caption": "Service blueprint for the matching form.",
        "at": 1,
        "step": 2
      },
      {
        "src": "/work/workplace-unboxing/fig-p18-svcD.jpg",
        "w": 1296,
        "h": 446,
        "page": 18,
        "title": "D. Afternoon Session",
        "caption": "Service blueprint for the onboarding tea.",
        "at": 1,
        "step": 3
      },
      {
        "src": "/work/workplace-unboxing/fig-p19-expo.jpg",
        "w": 945,
        "h": 669,
        "page": 19,
        "title": "The pop-up exhibition",
        "caption": "Participants scoring the four concepts.",
        "at": 2
      },
      {
        "src": "/work/workplace-unboxing/fig-p19-impact.jpg",
        "w": 1800,
        "h": 461,
        "page": 19,
        "title": "Adopted at Nanshan Life",
        "caption": "Presenting the proposal and the spaces it now lives in.",
        "at": 4
      }
    ]
  },
  "flexfit-gym": {
    "Discover": [
      {
        "src": "/work/flexfit-gym/fig-p21-context.jpg",
        "w": 1800,
        "h": 520,
        "page": 21,
        "title": "Site and SDG framework",
        "caption": "The proposed hall, the five SDG values and the early concept sketch.",
        "at": 1
      },
      { "src": "", "w": 0, "h": 0, "page": 0, "diagram": "flexfit-diamond", "title": "Double Diamond", "caption": "", "at": 2 },
    ],
    "Define": [
      {
        "src": "/work/flexfit-gym/fig-p22-field.jpg",
        "w": 594,
        "h": 611,
        "page": 22,
        "title": "Field research",
        "caption": "Site visits and staff interviews.",
        "at": 0
      },
      {
        "src": "/work/flexfit-gym/fig-p22-sketches.jpg",
        "w": 810,
        "h": 344,
        "page": 22,
        "title": "Early layout sketches",
        "caption": "Movable layouts and modular systems.",
        "at": 2
      }
    ],
    "Develop": [
      { "src": "", "w": 0, "h": 0, "page": 0, "diagram": "flexfit-framework", "title": "Adaptive spatial framework", "caption": "", "at": 0, "lead": true },
      {
        "src": "/work/flexfit-gym/fig-p23-its.jpg",
        "w": 1161,
        "h": 821,
        "page": 23,
        "title": "Intelligent Track System",
        "caption": "Ceiling track, people-counting display and rail-mounted equipment.",
        "at": 1
      },
      {
        "src": "/work/flexfit-gym/fig-p23-energy.jpg",
        "w": 1242,
        "h": 409,
        "page": 23,
        "title": "Energy generation",
        "caption": "Kinetic energy from training feeds the building.",
        "at": 2
      },
      {
        "src": "/work/flexfit-gym/fig-p23-coaching.jpg",
        "w": 1215,
        "h": 433,
        "page": 23,
        "title": "Coaching intelligence",
        "caption": "Zone display with daily goal, motion tracking and progress screens.",
        "at": 3
      }
    ],
    "Deliver": [
      {
        "src": "/work/flexfit-gym/fig-p24-zones.jpg",
        "w": 1800,
        "h": 487,
        "page": 24,
        "title": "Floor plan and five zones",
        "caption": "Entrance, gender-neutral toilet, resting, training and storage areas.",
        "at": 0
      },
      {
        "src": "/work/flexfit-gym/fig-p24-impact.jpg",
        "w": 1296,
        "h": 497,
        "page": 24,
        "title": "Future City Forum 2024",
        "caption": "First Prize under Design for SDGs.",
        "at": 1
      }
    ]
  },
  "designing-digital-confidence": {
    "Field Research": [
      {
        "src": "/work/digital-confidence/fig-p26-program.jpg",
        "w": 363,
        "h": 653,
        "page": 26,
        "title": "Program structure",
        "caption": "Digital Empowerment Courses feeding three kinds of helpers.",
        "at": 1
      },
      {
        "src": "/work/digital-confidence/fig-p26-context.jpg",
        "w": 507,
        "h": 636,
        "page": 26,
        "title": "Digital Helper Network and training themes",
        "caption": "Twelve districts and six training themes.",
        "at": 2
      }
    ],
    "Insights": [],
    "Concepts": [
      {
        "src": "/work/digital-confidence/fig-p28-before.jpg",
        "w": 675,
        "h": 216,
        "page": 28,
        "title": "Before class: Smart Start",
        "caption": "LINE notices and physical cards.",
        "at": 2,
        "step": 0
      },
      {
        "src": "/work/digital-confidence/fig-p28-during.jpg",
        "w": 1800,
        "h": 306,
        "page": 28,
        "title": "During class",
        "caption": "Life-based learning and social learning groups.",
        "at": 2,
        "step": 1
      },
      {
        "src": "/work/digital-confidence/fig-p28-after.jpg",
        "w": 846,
        "h": 278,
        "page": 28,
        "title": "After class: Digital Companions",
        "caption": "Review materials, an AI helper and volunteer video calls.",
        "at": 2,
        "step": 2
      }
    ],
    "Impact": [
      {
        "src": "/work/digital-confidence/fig-p29-photos.jpg",
        "w": 1377,
        "h": 1547,
        "page": 29,
        "title": "Co-learning in the field",
        "caption": "Six classes with 120+ seniors.",
        "at": 0
      }
    ]
  }
}
