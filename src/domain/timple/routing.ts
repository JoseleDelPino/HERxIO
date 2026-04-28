import type { CostConfig, Position, RoutingNote, RoutingResult } from './types';
import { findPositions } from './fretboard';
import { TimpleTuning } from './tuning';

export const DEFAULT_COST_CONFIG: CostConfig = Object.freeze({
  stretchThreshold: 4,
  stretchPenaltyBase: 2,
  adjacentStringCost: 1,
  jumpStringCostPerStep: 2,
});

/**
 * Cost of moving the fretting hand from `prev` to `next`.
 *
 * Mirrors the spec in §2.2:
 *  - Open-string destination (fret === 0) → string-change cost is zero
 *    ("campanella" bonus, encourages traditional timple voicing).
 *  - Adjacent strings → light cost; further jumps → linear in string distance.
 *  - Stretch beyond the threshold incurs an exponential penalty.
 *  - Stretch is ignored when either side is an open string: lifting the hand
 *    onto an open string (or moving away from one) costs nothing biomechanically.
 */
export function transitionCost(
  prev: Position,
  next: Position,
  cfg: CostConfig = DEFAULT_COST_CONFIG,
): number {
  let stringCost = 0;
  if (next.fret !== 0 && prev.string !== next.string) {
    const distance = Math.abs(prev.string - next.string);
    stringCost = distance === 1
      ? cfg.adjacentStringCost
      : cfg.jumpStringCostPerStep * distance;
  }

  let stretchCost = 0;
  if (prev.fret > 0 && next.fret > 0) {
    const stretch = Math.abs(prev.fret - next.fret);
    if (stretch > cfg.stretchThreshold) {
      stretchCost = Math.pow(cfg.stretchPenaltyBase, stretch - cfg.stretchThreshold);
    }
  }

  return stringCost + stretchCost;
}

/**
 * Routes a monophonic note sequence to (string, fret) positions minimizing
 * total ergonomic cost via Viterbi-style dynamic programming over candidate
 * positions per note.
 *
 * Notes carrying `lockedPosition` are pinned: the routing treats that single
 * candidate as a constant inamovible (matches `is_user_locked: true` from the
 * editor contract), even if it is theoretically suboptimal.
 *
 * Throws if any note has no playable position on the given tuning.
 */
export function routeMonophonic(
  notes: readonly RoutingNote[],
  tuning: TimpleTuning,
  cfg: CostConfig = DEFAULT_COST_CONFIG,
): RoutingResult {
  if (notes.length === 0) {
    return { positions: [], totalCost: 0 };
  }

  const candidates: Position[][] = notes.map((note) => {
    if (note.lockedPosition) return [note.lockedPosition];
    const found = findPositions(note.midi, tuning);
    if (found.length === 0) {
      throw new RangeError(
        `Note ${note.id} (MIDI ${note.midi}) has no valid position on this tuning`,
      );
    }
    return found;
  });

  const n = notes.length;
  const dp: number[][] = candidates.map((row) => row.map(() => Infinity));
  const back: number[][] = candidates.map((row) => row.map(() => -1));

  for (let j = 0; j < candidates[0].length; j++) {
    dp[0][j] = 0;
  }

  for (let i = 1; i < n; i++) {
    for (let j = 0; j < candidates[i].length; j++) {
      let bestCost = Infinity;
      let bestPrev = -1;
      for (let k = 0; k < candidates[i - 1].length; k++) {
        const cost = dp[i - 1][k] + transitionCost(candidates[i - 1][k], candidates[i][j], cfg);
        if (cost < bestCost) {
          bestCost = cost;
          bestPrev = k;
        }
      }
      dp[i][j] = bestCost;
      back[i][j] = bestPrev;
    }
  }

  let bestJ = 0;
  for (let j = 1; j < candidates[n - 1].length; j++) {
    if (dp[n - 1][j] < dp[n - 1][bestJ]) bestJ = j;
  }

  const positions: Position[] = new Array(n);
  let cursor = bestJ;
  for (let i = n - 1; i >= 0; i--) {
    positions[i] = candidates[i][cursor];
    if (i > 0) cursor = back[i][cursor];
  }

  return { positions, totalCost: dp[n - 1][bestJ] };
}
