/**
 * Detail blocks (lib/details.ts) whose wording is already carried by the stage headline copy or by a neighbouring
 * block (≥ ~70% of their words repeated). They are not rendered, so each idea reads once. Indices are positions in
 * lib/details.ts; figures attached to a skipped block move to the next block that is shown.
 */
export const skip: Record<string, Record<string, number[]>> = {
  'social-hive': { 'Research & Insight': [1, 2, 8, 20, 21, 22], 'Concept & System': [3] },
  'workplace-unboxing-plan': { 'Field Research': [3], 'Insight Analysis': [1, 3, 7, 8, 10] },
  'flexfit-gym': { Discover: [1, 3], Define: [0], Develop: [0, 1] },
  'designing-digital-confidence': { Concepts: [0, 1], Impact: [0] },
}

/** Stages whose `points` tiles are fully repeated by a detail block further down (the block is kept, the tiles are not). */
export const skipPoints: Record<string, string[]> = { 'designing-digital-confidence': ['Concepts'] }
