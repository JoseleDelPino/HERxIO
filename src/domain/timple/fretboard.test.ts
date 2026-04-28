import { describe, it, expect } from 'vitest';
import { findPositions, isPlayable } from './fretboard';
import { TimpleTuning } from './tuning';

const tuning = new TimpleTuning();

describe('findPositions', () => {
  it('places E4 (lowest pitch) only on string 3 fret 0', () => {
    expect(findPositions(64, tuning)).toEqual([{ string: 3, fret: 0 }]);
  });

  it('returns every valid fingering for A4 on a default board', () => {
    // A4 = 69. Expected: string 2 fret 0, string 3 fret 5, string 5 fret 2.
    // String 1 (74) and string 4 (72) are above the pitch — unreachable.
    expect(findPositions(69, tuning)).toEqual([
      { string: 2, fret: 0 },
      { string: 3, fret: 5 },
      { string: 5, fret: 2 },
    ]);
  });

  it('returns positions for C5 across four strings', () => {
    expect(findPositions(72, tuning)).toEqual([
      { string: 2, fret: 3 },
      { string: 3, fret: 8 },
      { string: 4, fret: 0 },
      { string: 5, fret: 5 },
    ]);
  });

  it('returns an empty list for pitches below E4', () => {
    expect(findPositions(63, tuning)).toEqual([]); // D#4
    expect(findPositions(60, tuning)).toEqual([]); // C4
  });

  it('returns an empty list for pitches beyond the highest fretted note', () => {
    expect(findPositions(87, tuning)).toEqual([]); // 74 + 13
  });

  it('respects a custom maxFret limit', () => {
    const shortBoard = new TimpleTuning(undefined, 4);
    // A4 on string 3 needs fret 5 → excluded; on string 2 fret 0 and string 5 fret 2 still valid.
    expect(findPositions(69, shortBoard)).toEqual([
      { string: 2, fret: 0 },
      { string: 5, fret: 2 },
    ]);
  });

  it('property: every returned position resolves back to the requested pitch', () => {
    for (let midi = 60; midi <= 90; midi++) {
      for (const pos of findPositions(midi, tuning)) {
        expect(tuning.openMidi(pos.string) + pos.fret).toBe(midi);
      }
    }
  });

  it('rejects non-integer MIDI values', () => {
    expect(() => findPositions(64.5, tuning)).toThrow(TypeError);
  });
});

describe('isPlayable', () => {
  it('flags pitches inside the instrument range', () => {
    expect(isPlayable(64, tuning)).toBe(true);
    expect(isPlayable(72, tuning)).toBe(true);
  });

  it('flags pitches outside the instrument range', () => {
    expect(isPlayable(50, tuning)).toBe(false);
    expect(isPlayable(100, tuning)).toBe(false);
  });
});
