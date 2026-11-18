/**
 * Conceptual diagrams, frameworks, matrices and journey maps that the PDF carried as flat pictures.
 * They are rebuilt here as plain HTML + CSS (styles in app/diagrams.css) so the text stays real text, scales with
 * the layout and can use the site's glass / chrome / neon language. Each entry returns a <figure> string, so the
 * same markup renders in the Next app (components/case/Diagram.tsx) and in the standalone preview.
 * All strings are static and authored here; nothing user-supplied reaches this file.
 */
const e = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

type Venn = { circles: { t: string; items: string[] }[]; centre?: string }

/** Three overlapping glass discs with the titles set inside, the bullets in a legend underneath (reads at any width). */
const venn = ({ circles, centre }: Venn) => `
<div class="dg-venn" aria-hidden="true">
  <i class="dg-vc c1"></i><i class="dg-vc c2"></i><i class="dg-vc c3"></i>
  <b class="dg-vl l1">${e(circles[0].t)}</b><b class="dg-vl l2">${e(circles[1].t)}</b><b class="dg-vl l3">${e(circles[2].t)}</b>
  <i class="dg-vk">${centre ? `<span>${e(centre)}</span>` : ''}</i>
</div>
<ul class="dg-leg">${circles
  .map((c, i) => `<li><span class="dg-no serif">0${i + 1}</span><b>${e(c.t)}</b><ul>${c.items.map((t) => `<li>${e(t)}</li>`).join('')}</ul></li>`)
  .join('')}</ul>`

type Stage = { t: string; q?: string; mood: string; v: number; hot?: boolean }
/** A mood curve: one dot per stage riding a smooth line, quote + mood under each dot. v = 0 (low) … 1 (high). */
const journey = (stages: Stage[]) => {
  const n = stages.length
  const xs = stages.map((_, i) => ((i + 0.5) / n) * 100)
  const ys = stages.map((s) => 78 - s.v * 62)
  // smooth path through the points (Catmull-Rom → cubic Bézier)
  const pts = [[0, ys[0]], ...xs.map((x, i) => [x, ys[i]]), [100, ys[n - 1]]]
  let d = `M${pts[0][0]},${pts[0][1]}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] ?? p2
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += ` C${c1[0].toFixed(2)},${c1[1].toFixed(2)} ${c2[0].toFixed(2)},${c2[1].toFixed(2)} ${p2[0]},${p2[1]}`
  }
  return `
<div class="dg-jr" style="--n:${n}">
  <div class="dg-jc" aria-hidden="true">
    <svg viewBox="0 0 100 100" preserveAspectRatio="none"><path d="${d}" vector-effect="non-scaling-stroke" class="dg-jl"/></svg>
    ${stages.map((s, i) => `<i class="dg-jd${s.hot ? ' hot' : ''}" style="left:${xs[i].toFixed(2)}%;top:${ys[i].toFixed(2)}%"></i>`).join('')}
  </div>
  <ol class="dg-js">${stages
    .map(
      (s, i) => `<li${s.hot ? ' class="hot"' : ''}><p class="tele"><span class="serif">0${i + 1}</span>${e(s.t)}</p>${s.q ? `<p class="dg-q">“${e(s.q)}”</p>` : ''}<p class="dg-m"><i></i>${e(s.mood)}</p></li>`,
    )
    .join('')}</ol>
</div>`
}

export type Diagram = { title: string; caption: string; html: string }

export const diagrams: Record<string, Diagram> = {
  /* ------------------------------------------------------------- Social Hive */
  'social-pillars': {
    title: 'Social capital framework',
    caption: 'Three pillars carry social capital: the pressures on the left weaken them, the benefits on the right are what they return.',
    html: `
<div class="dg-top">
  <span class="dg-node dg-neon"><b class="serif">Social capital</b><small>The intangible asset of human relationships</small></span>
  <i class="dg-stem"></i>
  <span class="dg-node"><b>Interaction &amp; connection</b><small>The horizontal bonds formed between individuals</small></span>
</div>
<ul class="dg-kids">
  <li><span class="dg-node dg-sm"><i class="dg-orb"></i>Social networks</span><p>Interaction and connection between individuals.</p></li>
  <li><span class="dg-node dg-sm"><i class="dg-orb"></i>Trust and reciprocity</span><p>Altruistic behavior, social inclusion and mutual recognition.</p></li>
  <li><span class="dg-node dg-sm"><i class="dg-orb"></i>Shared norms and values</span><p>Shared goals and shared relations inside a community.</p></li>
</ul>
<div class="dg-two">
  <div><p class="tele dg-h"><span class="dg-ar">↓</span>Barriers: what is weakening it</p>
    <ul class="dg-ls">${[
      'Changing family structures',
      'Heavy workload and financial pressure',
      'Rapid evolution of technological products',
      'Fading sense of community',
      'The rise of individualism',
      'The prevalence of utilitarianism',
    ].map((t) => `<li>${e(t)}</li>`).join('')}</ul></div>
  <div><p class="tele dg-h"><span class="dg-ar up">↑</span>Benefits: what it returns</p>
    <ul class="dg-ls up">${[
      'Physical and mental health',
      'Altruistic behavior',
      'Economic development',
      'Social inclusion and social trust',
      'Shared goals',
      'Government effectiveness',
      'Community relations',
    ].map((t) => `<li>${e(t)}</li>`).join('')}</ul></div>
</div>`,
  },

  'social-desk': {
    title: 'Desk research',
    caption: 'Three literatures, one finding each: how trust forms, how cooperation emerges and why technology gets in the way.',
    html: venn({
      circles: [
        { t: 'Empathy & trust research', items: ['Trust forms through interpersonal cues: tone, gesture, presence.'] },
        { t: 'Eusocial species', items: ['Cooperation emerges from shared purpose and mutual recognition.'] },
        { t: 'Digital dependency & aging isolation', items: ['Technology reduces natural chances for spontaneous empathy.'] },
      ],
    }),
  },

  'social-journey': {
    title: 'Current journey map',
    caption: 'Unclear roles and weak social cues turn willingness into fading participation.',
    html: journey([
      { t: 'Arrive', q: 'It seems meaningful, and I’d like to help.', mood: 'Hopeful', v: 0.85 },
      { t: 'Take part', q: 'Once I’m there, I’m not sure what to do. It feels formal, and I don’t really connect with anyone.', mood: 'Unsure', v: 0.45, hot: true },
      { t: 'Afterwards', q: 'Afterwards, there aren’t any updates or next steps, so I stop returning.', mood: 'Disengaged', v: 0.1, hot: true },
    ]),
  },

  /* ---------------------------------------------------------- Workplace Unboxing Plan */
  'workplace-flow': {
    title: 'Research process',
    caption: 'Four phases, each feeding the next: listen, make sense, build together, propose.',
    html: `
<ol class="dg-fl">${[
      ['Field research', 'Listen', 'Desktop research, site observation, 3 focus groups, 2 in-depth and 3 external interviews, survey.'],
      ['Insight analysis', 'Make sense', 'Transcripts, experience stories, persona, customer journey map, 4 service insights, coolhunting.'],
      ['Co-creation', 'Build together', 'Brand values, 30 innovation cards, 4 concept directions, co-creation workshop.'],
      ['Prototype & proposal', 'Propose', 'Service prototyping and the final proposal.'],
    ]
      .map(([k, t, b], i) => `<li><span class="dg-fn"><i class="dg-orb"></i><span class="serif">0${i + 1}</span></span><p class="tele">${e(k)}</p><h5>${e(t)}</h5><p>${e(b)}</p></li>`)
      .join('')}</ol>`,
  },

  'workplace-matrix': {
    title: 'Persona positioning matrix',
    caption: 'Experienced job seekers sit on the top row: Career advancement and Network builder became the focus of onboarding.',
    html: `
<div class="dg-mx">
  <span class="ax t">Deep expertise</span><span class="ax l">Personal growth</span><span class="ax r">Organizational culture</span><span class="ax b">Newcomer</span>
  <div class="dg-mq">
    <p class="q on"><b>Career advancement</b></p><p class="q on"><b>Network builder</b></p>
    <p class="q"><b>Professional accumulation</b></p><p class="q"><b>Work-life balancer</b></p>
    <i class="dg-focus" aria-hidden="true"></i>
  </div>
</div>`,
  },

  'workplace-journey': {
    title: 'Employee journey map',
    caption: 'Two moments of truth stand out: the interview, where little transparency shapes first impressions, and onboarding.',
    html: journey([
      { t: 'Job search & application', q: 'The role sounds interesting, but I still can’t tell what the day-to-day actually looks like!', mood: 'Hopeful, curious', v: 0.68 },
      { t: 'Interview', q: 'Everyone was polite, but I left the interview still unsure about the team culture.', mood: 'Neutral, cautious', v: 0.22, hot: true },
      { t: 'Offer & pre-boarding', q: 'The offer was great, but the paperwork felt overwhelming and unclear.', mood: 'Reassured, slightly stressed', v: 0.78 },
      { t: 'Onboarding', q: 'Training was thorough, but I barely had time to meet my team or understand how they work together.', mood: 'Welcomed, slightly uncertain', v: 0.74, hot: true },
      { t: 'Early employment', q: 'My manager is helpful, but the guidance really depends on who you work with.', mood: 'Stable, seeking clarity', v: 0.34 },
    ]),
  },

  /* ----------------------------------------------------------------- FlexFit Gym */
  'flexfit-diamond': {
    title: 'Double Diamond',
    caption: 'Diverge to see the system, converge to decide; twice.',
    html: `
<div class="dg-dd" role="img" aria-label="Double Diamond: Discover, Define, Develop, Deliver">
  <svg viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true">
    <polygon class="d" points="1,15 26,1.5 51,15 26,28.5"/><polygon class="d" points="49,15 74,1.5 99,15 74,28.5"/>
    <line x1="26" y1="1.5" x2="26" y2="28.5"/><line x1="74" y1="1.5" x2="74" y2="28.5"/>
  </svg>
  <b style="left:13.5%">Discover</b><b style="left:38.5%">Define</b><b style="left:61.5%">Develop</b><b style="left:86.5%">Deliver</b>
  <em style="left:13.5%">diverge</em><em style="left:38.5%">converge</em><em style="left:61.5%">diverge</em><em style="left:86.5%">converge</em>
</div>
<ul class="dg-dm">${[
      ['Discover', ['Policy review', 'Field studies', 'User and staff interviews']],
      ['Define', ['Insight synthesis', 'Problem framing']],
      ['Develop', ['Concept development', 'Digital and physical prototyping']],
      ['Deliver', ['User testing', 'Simulation and final refinement']],
    ]
      .map(([t, l], i) => `<li><p class="tele"><span class="serif">0${i + 1}</span>${e(t as string)}</p><ul>${(l as string[]).map((x) => `<li>${e(x)}</li>`).join('')}</ul></li>`)
      .join('')}</ul>`,
  },

  'flexfit-framework': {
    title: 'Adaptive spatial framework',
    caption: 'Three values frame the gym; two inputs decide how the track rearranges it.',
    html: `<div class="dg-ff"><div>${venn({
      circles: [
        { t: 'Sustainability', items: ['Electricity-generating fitness equipment', 'Living wall'] },
        { t: 'Technology', items: ['Intelligent track system', 'Customized screen coaching'] },
        { t: 'Equality', items: ['Gender-neutral design', 'Diverse equipment'] },
      ],
      centre: 'FlexFit',
    })}</div>
<div class="dg-ia">
  <p class="tele dg-h"><span class="dg-pill">Identify</span></p>
  <ul class="dg-in"><li><i class="dg-orb"></i>Sport theme</li><li><i class="dg-orb"></i>Number of people</li></ul>
  <i class="dg-down" aria-hidden="true"></i>
  <p class="tele dg-h"><span class="dg-pill">Adjust</span></p>
  <dl class="dg-sl">
    <div><dt>Density</dt><dd><span>Off-peak</span><i></i><span>Peak hour</span></dd></div>
    <div><dt>Types of equipment</dt><dd><span>Men</span><i></i><span>Women</span></dd></div>
  </dl>
</div></div>`,
  },
}

export const diagramHtml = (id: string): string => {
  const d = diagrams[id]
  if (!d) return ''
  return `<figure class="dg" data-dg="${id}"><div class="dg-body" role="group" aria-label="${e(d.title)}">${d.html}</div><figcaption class="dg-cap">${e(d.title)}</figcaption></figure>`
}
