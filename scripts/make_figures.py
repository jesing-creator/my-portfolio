"""Crops individual diagrams / infographics / photo groups out of the rasterised PDF pages and writes
public/work/<dir>/fig-<id>.jpg plus lib/figures.ts. Boxes are fractions [x0, y0, x1, y1] of the page.
Usage: python3 make_figures.py <dir with p-NN.jpg at ~2700px>"""
import sys, json
from PIL import Image
SRC = sys.argv[1]
ROOT = '/home/claude/work/portfolio'
DIR = {'social-hive': 'social-hive', 'workplace-unboxing-plan': 'workplace-unboxing', 'flexfit-gym': 'flexfit-gym', 'designing-digital-confidence': 'digital-confidence'}
# slug -> stage -> list of (id, page, box, title, caption, at)  (at = index of the narrative block it sits beside)
F = {
'social-hive': {
 'Research & Insight': [
  ('framework', 4, (0.03,0.19,0.95,0.53), 'Social capital framework', 'The three pillars of social capital, and the pressures that weaken them versus the benefits they bring.', 1),
  ('process', 4, (0.03,0.55,0.97,0.94), 'Four-phase design process', 'Research, prototyping, concept and testing, with the methods used in each.', 4),
  ('desk', 5, (0.03,0.24,0.34,0.77), 'Desk research', '30+ sources on oxytocin, digital dependency and the eusocial species.', 7),
  ('interviews', 5, (0.34,0.24,0.65,0.77), 'Expert interviews', 'Sociologists, psychologists and caregivers on role conflict and pressure.', 9),
  ('survey', 5, (0.67,0.24,0.98,0.77), 'User survey, 204 responses', 'Life perception, key life skills, and the gap between intention and action.', 11),
  ('empathy', 6, (0.03,0.21,0.45,0.62), 'Empathy mapping', 'Youth, caregivers and older adults: what each needs to feel seen and valued.', 16),
  ('scenario', 6, (0.42,0.21,0.97,0.64), 'Key scenario', 'Dense urban areas, community gatherings and public spaces where people coexist but rarely interact.', 18),
  ('journey', 6, (0.03,0.67,0.55,0.95), 'Current journey map', 'From hopeful, to unsure, to fading participation.', 19),
 ],
 'Prototyping & Iterations': [
  ('gift', 7, (0.03,0.19,0.34,0.93), '1. Gift of Life concept', 'Belief objects and responsibility blocks across five life stages, with the feedback they earned.', 1),
  ('bee', 7, (0.34,0.19,0.66,0.93), '2. Bee Exploration Ball', 'Light and vibration interaction: engaging, but too bulky for daily use.', 1),
  ('highfive', 7, (0.66,0.19,0.98,0.93), '3. High-Five wearable', 'Gesture plus NFC app link: intuitive, but too fragile.', 1),
 ],
 'Concept & System': [
  ('explore', 8, (0.03,0.46,0.95,0.70), '1. Explore & Join', 'Pollination tasks and Dandelion missions in the Hive Connect app.', 2),
  ('connect', 9, (0.03,0.10,0.97,0.36), '2. Connect & Contribute', 'The Hive Sensor: NFC check-in with light and vibration feedback.', 2),
  ('sensor', 9, (0.42,0.39,0.97,0.64), 'Hive Sensor in use', 'App screens, wearable and volunteers.', 2),
  ('screens', 8, (0.35,0.71,0.96,0.95), 'App screens', 'Explore, Missions, Communities and Chat.', 4),
  ('reflect', 9, (0.03,0.70,0.97,0.94), '3. Reflect, Share & Reinvest', 'Feed, profile and Nectar Points rewards, and the social rewards they unlock.', 5),
 ],
 'Testing & Impact': [
  ('rounds', 10, (0.03,0.19,0.97,0.575), 'Two testing rounds', 'Round I: Hive Connect prototype. Round II: paper NFC wristband.', 0),
  ('expo', 10, (0.03,0.595,0.97,0.945), 'Exhibition and testing process', 'The six-step wristband ritual, tested with real visitors.', 2),
  ('biz', 11, (0.43,0.07,0.97,0.45), 'Cross-sector partnership', 'B2C participation with B2B, government and NGO partners.', 3),
  ('awards', 11, (0.03,0.46,0.43,0.94), 'Presenting and winning', 'Pitching and receiving first prize.', 4),
  ('map', 11, (0.43,0.46,0.97,0.93), 'A citywide hive', 'Society, community and individual layers across the map.', 4),
 ]},
'workplace-unboxing-plan': {
 'Field Research': [
  ('context', 13, (0.03,0.19,0.97,0.47), 'The organisation and the people', 'A formal institution, its internal and external professions, and the modern professionals it hires.', 1),
  ('process', 13, (0.03,0.60,0.97,0.94), 'Research process map', 'Four phases and the methods in each, from desktop research to the pop-up exhibition.', 3),
  ('desk', 14, (0.03,0.27,0.49,0.56), 'Desktop research', 'Employer branding, stakeholder map and affinity wall.', 6),
  ('site', 14, (0.50,0.27,0.97,0.56), 'Site observation', 'The existing onboarding process, mapped on site at Nanshan HQ.', 6),
  ('interviews', 14, (0.03,0.58,0.49,0.95), 'Interviews', 'Focus groups, in-depth interviews and external comparison.', 7),
  ('survey', 14, (0.50,0.58,0.97,0.95), 'Memory Log survey', '89 responses across five stages of the employee journey.', 7),
 ],
 'Insight Analysis': [
  ('stories', 15, (0.46,0.10,0.97,0.36), 'Experience story cards', '87 stories clustered into 9 categories.', 0),
  ('matrix', 15, (0.03,0.47,0.46,0.93), 'Persona positioning matrix', 'Career advancement, network builder, professional accumulation and work-life balancer.', 3),
  ('persona', 15, (0.46,0.39,0.97,0.93), 'Lin Chih-Wei, key persona', 'An experienced finance professional seeking structured growth.', 4),
  ('journey', 16, (0.27,0.10,0.97,0.41), 'Journey map', 'Five stages, with moments of truth before the interview and after onboarding.', 7),
  ('ladder', 16, (0.03,0.54,0.33,0.92), 'Laddering analysis', 'From story to value need to insight.', 9),
 ],
 'Co-creation': [
  ('workshop', 17, (0.35,0.10,0.97,0.31), 'Co-creation workshop', 'Employees and HR sorting insights on the innovation matrix.', 0),
  ('lego', 17, (0.03,0.60,0.97,0.97), 'LEGO service prototypes', 'Four onboarding scenarios acted out in LEGO.', 3),
 ],
 'Prototype & Proposal': [
  ('svcA', 18, (0.03,0.24,0.49,0.53), 'A. Nanshan Inside', 'Service blueprint for the storytelling platform.', 1),
  ('svcB', 18, (0.50,0.24,0.98,0.53), 'B. Brew your future', 'Service blueprint for the digital coffee chat.', 1),
  ('svcC', 18, (0.03,0.62,0.49,0.92), 'C. Job Matching Form', 'Service blueprint for the matching form.', 1),
  ('svcD', 18, (0.50,0.62,0.98,0.92), 'D. Afternoon Session', 'Service blueprint for the onboarding tea.', 1),
  ('scores', 19, (0.03,0.20,0.62,0.47), 'Pop-up evaluation scores', 'Usefulness and feasibility out of 10, 25 participants.', 2),
  ('expo', 19, (0.62,0.13,0.97,0.48), 'The pop-up exhibition', 'Participants scoring the four concepts.', 2),
  ('impact', 19, (0.03,0.62,0.97,0.96), 'Adopted at Nanshan Life', 'Presenting the proposal and the spaces it now lives in.', 4),
 ]},
'flexfit-gym': {
 'Discover': [
  ('context', 21, (0.04,0.19,0.97,0.57), 'Site and SDG framework', 'The proposed hall, the five SDG values and the early concept sketch.', 1),
  ('diamond', 21, (0.35,0.682,0.96,0.972), 'Double Diamond', 'Discover, define, develop, deliver, and the methods behind each.', 3),
 ],
 'Define': [
  ('field', 22, (0.04,0.18,0.26,0.50), 'Field research', 'Site visits and staff interviews.', 0),
  ('findings', 22, (0.28,0.19,0.95,0.50), 'Four inclusion gaps', 'Gender imbalance, accessibility, spatial discomfort and low sustainability.', 0),
  ('sketches', 22, (0.67,0.79,0.97,0.97), 'Early layout sketches', 'Movable layouts and modular systems.', 2),
 ],
 'Develop': [
  ('framework', 23, (0.04,0.19,0.52,0.62), 'Adaptive spatial framework', 'Technology, equality and sustainability, and how the system identifies and adjusts.', 0),
  ('its', 23, (0.53,0.19,0.96,0.62), 'Intelligent Track System', 'Ceiling track, people-counting display and rail-mounted equipment.', 1),
  ('energy', 23, (0.04,0.65,0.50,0.97), 'Energy generation', 'Kinetic energy from training feeds the building.', 2),
  ('coaching', 23, (0.52,0.65,0.97,0.97), 'Coaching intelligence', 'Zone display with daily goal, motion tracking and progress screens.', 3),
 ],
 'Deliver': [
  ('zones', 24, (0.03,0.05,0.97,0.41), 'Floor plan and five zones', 'Entrance, gender-neutral toilet, resting, training and storage areas.', 0),
  ('impact', 24, (0.49,0.44,0.97,0.70), 'Future City Forum 2024', 'First Prize under Design for SDGs.', 1),
 ]},
'designing-digital-confidence': {
 'Field Research': [
  ('program', 26, (0.49,0.21,0.97,0.59), 'Program structure', 'Digital Empowerment Courses feeding three kinds of helpers.', 1),
  ('context', 26, (0.03,0.21,0.50,0.58), 'Digital Helper Network and training themes', 'Twelve districts and six training themes.', 2),
  ('process', 26, (0.03,0.71,0.97,0.96), 'Four-phase process', 'Field research, insights, concepts, impact.', 4),
 ],
 'Insights': [
 ],
 'Concepts': [
  ('before', 28, (0.03,0.31,0.28,0.70), 'Before class: Smart Start', 'LINE notices and physical cards.', 2),
  ('during', 28, (0.27,0.31,0.97,0.70), 'During class', 'Life-based learning and social learning groups.', 2),
  ('after', 28, (0.03,0.72,0.97,0.96), 'After class: Digital Companions', 'Review materials, an AI helper and volunteer video calls.', 4),
 ],
 'Impact': [
  ('photos', 29, (0.46,0.10,0.97,0.91), 'Co-learning in the field', 'Six classes with 120+ seniors.', 0),
  ('quotes', 29, (0.03,0.29,0.45,0.85), 'What participants said', 'A senior, an instructor, a volunteer and a government staff member.', 1),
 ]},
}
out = {}
for slug, stages in F.items():
    out[slug] = {}
    for stage, figs in stages.items():
        out[slug][stage] = []
        for (fid, page, box, title, cap, at) in figs:
            im = Image.open(f'{SRC}/p-{page:02d}.jpg').convert('RGB')
            W, H = im.size
            c = im.crop((round(box[0]*W), round(box[1]*H), round(box[2]*W), round(box[3]*H)))
            if c.width > 1800:
                c = c.resize((1800, round(c.height*1800/c.width)), Image.LANCZOS)
            name = f'fig-p{page:02d}-{fid}.jpg'
            c.save(f'{ROOT}/public/work/{DIR[slug]}/{name}', quality=82, optimize=True)
            out[slug][stage].append(dict(src=f'/work/{DIR[slug]}/{name}', w=c.width, h=c.height, page=page, title=title, caption=cap, at=at))
ts = '''/**
 * Individual diagrams, research charts, journey maps, wireframes and photo groups cropped from the PDF
 * (scripts/make_figures.py). `at` is the index of the narrative block in lib/details.ts that each figure sits beside.
 * Generated file: edit scripts/make_figures.py and re-run, or edit by hand.
 */
export type Figure = { src: string; w: number; h: number; page: number; title: string; caption: string; at: number }
export const figures: Record<string, Record<string, Figure[]>> = ''' + json.dumps(out, indent=2, ensure_ascii=False) + '\n'
open(f'{ROOT}/lib/figures.ts', 'w').write(ts)
print(sum(len(v) for s in out.values() for v in s.values()), 'figures')
