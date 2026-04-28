import { describe, it, expect } from 'vitest';
import {
  TIMPLE_TUNING_MIDI,
  TONAL_ORDER,
  TimpleTuning,
  LOWEST_OPEN_MIDI,
} from './tuning';

describe('TIMPLE_TUNING_MIDI', () => {
  it('matches the spec MIDI values for each string', () => {
    expect(TIMPLE_TUNING_MIDI[1]).toBe(74); // D5
    expect(TIMPLE_TUNING_MIDI[2]).toBe(69); // A4
    expect(TIMPLE_TUNING_MIDI[3]).toBe(64); // E4 (lowest)
    expect(TIMPLE_TUNING_MIDI[4]).toBe(72); // C5
    expect(TIMPLE_TUNING_MIDI[5]).toBe(67); // G4
  });

  it('orders strings 3 < 5 < 2 < 4 < 1 by pitch', () => {
    const sortedByPitch = [...TONAL_ORDER];
    expect(sortedByPitch).toEqual([3, 5, 2, 4, 1]);

    for (let i = 1; i < TONAL_ORDER.length; i++) {
      const prev = TIMPLE_TUNING_MIDI[TONAL_ORDER[i - 1]];
      const curr = TIMPLE_TUNING_MIDI[TONAL_ORDER[i]];
      expect(curr).toBeGreaterThan(prev);
    }
  });

  it('sets string 3 (E4) as the lowest open string', () => {
    expect(LOWEST_OPEN_MIDI).toBe(64);
    const opens = [1, 2, 3, 4, 5].map((s) => TIMPLE_TUNING_MIDI[s as 1 | 2 | 3 | 4 | 5]);
    expect(Math.min(...opens)).toBe(LOWEST_OPEN_MIDI);
  });
});

describe('TimpleTuning', () => {
  it('exposes per-string open MIDI and a default 12-fret board', () => {
    const t = new TimpleTuning();
    expect(t.maxFret).toBe(12);
    expect(t.openMidi(3)).toBe(64);
    expect(t.openMidi(1)).toBe(74);
  });

  it('reports the lowest and highest playable pitches', () => {
    const t = new TimpleTuning();
    expect(t.lowestPlayableMidi()).toBe(64); // open string 3
    expect(t.highestPlayableMidi()).toBe(74 + 12); // string 1 + 12 frets
  });

  it('rejects negative maxFret values', () => {
    expect(() => new TimpleTuning(TIMPLE_TUNING_MIDI, -1)).toThrow(RangeError);
  });
});
