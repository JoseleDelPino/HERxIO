import type { StringNumber } from './types';

/**
 * Standard Canarian Timple tuning, indexed by string number.
 *
 * Physical string layout (1 = closest to the floor when played, 5 = closest to the ceiling)
 * does NOT match tonal order. The tonal order from lowest to highest pitch is:
 *
 *   3 (E4)  <  5 (G4)  <  2 (A4)  <  4 (C5)  <  1 (D5)
 *
 * Because the lowest pitch sits on string 3 (the middle string), an ascending scale
 * forces the player to jump across non-adjacent strings if they want to use open
 * strings ("campanellas") — a hallmark of traditional timple playing.
 */
export const TIMPLE_TUNING_MIDI: Readonly<Record<StringNumber, number>> = Object.freeze({
  1: 74, // D5 — high re
  2: 69, // A4 — la
  3: 64, // E4 — mi (lowest)
  4: 72, // C5 — do
  5: 67, // G4 — sol
});

/** Strings ordered from lowest to highest pitch. */
export const TONAL_ORDER: readonly StringNumber[] = Object.freeze([3, 5, 2, 4, 1] as const);

/** Lowest sounding MIDI pitch on a standard tuning (string 3 open = E4). */
export const LOWEST_OPEN_MIDI = 64;

export class TimpleTuning {
  static readonly DEFAULT_MAX_FRET = 12;

  private readonly tuning: Readonly<Record<StringNumber, number>>;
  readonly maxFret: number;

  constructor(
    tuning: Readonly<Record<StringNumber, number>> = TIMPLE_TUNING_MIDI,
    maxFret: number = TimpleTuning.DEFAULT_MAX_FRET,
  ) {
    if (maxFret < 0) {
      throw new RangeError(`maxFret must be non-negative, got ${maxFret}`);
    }
    this.tuning = tuning;
    this.maxFret = maxFret;
  }

  openMidi(s: StringNumber): number {
    return this.tuning[s];
  }

  /** Lowest MIDI pitch playable on this tuning (cheapest open string). */
  lowestPlayableMidi(): number {
    let lowest = Infinity;
    for (const s of [1, 2, 3, 4, 5] as StringNumber[]) {
      const open = this.tuning[s];
      if (open < lowest) lowest = open;
    }
    return lowest;
  }

  /** Highest MIDI pitch reachable on this tuning at maxFret. */
  highestPlayableMidi(): number {
    let highest = -Infinity;
    for (const s of [1, 2, 3, 4, 5] as StringNumber[]) {
      const top = this.tuning[s] + this.maxFret;
      if (top > highest) highest = top;
    }
    return highest;
  }
}
