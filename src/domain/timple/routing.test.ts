import { describe, it, expect } from 'vitest';
import { routeMonophonic, transitionCost, DEFAULT_COST_CONFIG } from './routing';
import { TimpleTuning } from './tuning';
import type { RoutingNote } from './types';

const tuning = new TimpleTuning();

const note = (id: string, midi: number, lockedPosition?: RoutingNote['lockedPosition']): RoutingNote => ({
  id,
  midi,
  ...(lockedPosition ? { lockedPosition } : {}),
});

describe('routeMonophonic — biomechanical guarantees', () => {
  it('never routes the lowest note (E4) to strings 4 or 5', () => {
    // The user's primary acceptance criterion. Even surrounded by notes that
    // might "pull" the routing toward higher strings, MIDI 64 has only one
    // legal home: string 3, fret 0.
    const sequences: RoutingNote[][] = [
      [note('a', 64)],
      [note('a', 72), note('b', 64), note('c', 72)], // C5 -> E4 -> C5
      [note('a', 67), note('b', 64)],                // G4 -> E4
      [note('a', 74), note('b', 64), note('c', 69)], // D5 -> E4 -> A4
    ];
    for (const seq of sequences) {
      const { positions } = routeMonophonic(seq, tuning);
      const e4 = positions[seq.findIndex((n) => n.midi === 64)];
      expect(e4).toEqual({ string: 3, fret: 0 });
    }
  });

  it('throws when a note is unplayable on the given tuning', () => {
    expect(() => routeMonophonic([note('low', 50)], tuning)).toThrow(RangeError);
    expect(() => routeMonophonic([note('high', 100)], tuning)).toThrow(RangeError);
  });

  it('returns an empty result for an empty sequence', () => {
    expect(routeMonophonic([], tuning)).toEqual({ positions: [], totalCost: 0 });
  });
});

describe('routeMonophonic — campanella preference', () => {
  it('chooses the open-string voicing for A4 after a fretted note', () => {
    // Previous note forced to string 1 fret 5. For A4 (69), candidates are
    // {2,0}, {3,5}, {5,2}. The {string:2, fret:0} option pays nothing (open
    // destination zeroes the string-change cost), so the algorithm picks it.
    const result = routeMonophonic(
      [note('a', 79, { string: 1, fret: 5 }), note('b', 69)],
      tuning,
    );
    expect(result.positions[1]).toEqual({ string: 2, fret: 0 });
  });

  it('routes an ascending C major scale C5..C6 without forcing high frets', () => {
    const scale = [72, 74, 76, 77, 79, 81, 83, 84];
    const seq = scale.map((m, i) => note(`n${i}`, m));
    const { positions } = routeMonophonic(seq, tuning);

    expect(positions).toHaveLength(scale.length);
    // Every chosen position must reproduce the requested pitch.
    for (let i = 0; i < scale.length; i++) {
      expect(tuning.openMidi(positions[i].string) + positions[i].fret).toBe(scale[i]);
    }
    // And no position exceeds the 12-fret board.
    for (const p of positions) {
      expect(p.fret).toBeLessThanOrEqual(12);
      expect(p.fret).toBeGreaterThanOrEqual(0);
    }
  });
});

describe('routeMonophonic — locked positions', () => {
  it('respects a locked position even when a cheaper alternative exists', () => {
    // A4 (69) would normally land on string 2 fret 0; pin it to string 3 fret 5.
    const seq = [
      note('a', 64),
      note('b', 69, { string: 3, fret: 5 }),
      note('c', 67),
    ];
    const { positions } = routeMonophonic(seq, tuning);
    expect(positions[1]).toEqual({ string: 3, fret: 5 });
  });

  it('treats locked positions as constants for the surrounding routing', () => {
    // With the middle note pinned, surrounding notes should still pick
    // sensible positions and not attempt to "fix" the lock.
    const seq = [
      note('a', 72),                                    // C5
      note('b', 76, { string: 1, fret: 2 }),            // E5 pinned high
      note('c', 79),                                    // G5
    ];
    const { positions, totalCost } = routeMonophonic(seq, tuning);
    expect(positions[1]).toEqual({ string: 1, fret: 2 });
    expect(totalCost).toBeGreaterThanOrEqual(0);
    expect(Number.isFinite(totalCost)).toBe(true);
  });
});

describe('transitionCost', () => {
  it('charges nothing when the destination is an open string', () => {
    expect(transitionCost({ string: 1, fret: 7 }, { string: 3, fret: 0 })).toBe(0);
    expect(transitionCost({ string: 4, fret: 0 }, { string: 2, fret: 0 })).toBe(0);
  });

  it('charges the adjacent-string fee on neighboring strings', () => {
    const cost = transitionCost({ string: 2, fret: 3 }, { string: 3, fret: 4 });
    expect(cost).toBe(DEFAULT_COST_CONFIG.adjacentStringCost);
  });

  it('charges the per-step jump fee proportional to string distance', () => {
    const cost = transitionCost({ string: 1, fret: 3 }, { string: 4, fret: 4 });
    // |1 - 4| = 3 → 3 * jumpStringCostPerStep
    expect(cost).toBe(3 * DEFAULT_COST_CONFIG.jumpStringCostPerStep);
  });

  it('applies an exponential penalty when the stretch exceeds the threshold', () => {
    const inThreshold = transitionCost({ string: 1, fret: 1 }, { string: 1, fret: 5 });
    const overThreshold = transitionCost({ string: 1, fret: 1 }, { string: 1, fret: 7 });
    // 4 frets → no stretch penalty; 6 frets → 2^(6-4) = 4
    expect(inThreshold).toBe(0);
    expect(overThreshold).toBe(4);
  });

  it('does not apply stretch when either side is an open string', () => {
    expect(transitionCost({ string: 1, fret: 0 }, { string: 1, fret: 12 })).toBe(0);
    // Open destination zeroes string-change cost too, so total is 0.
    expect(transitionCost({ string: 1, fret: 12 }, { string: 1, fret: 0 })).toBe(0);
  });
});
