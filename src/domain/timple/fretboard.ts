import type { Position, StringNumber } from './types';
import { STRING_NUMBERS } from './types';
import { TimpleTuning } from './tuning';

/**
 * Returns every (string, fret) position that produces the given MIDI pitch
 * on the supplied tuning, within [0, maxFret]. The result is empty when the
 * pitch is unreachable on the instrument.
 *
 * Positions are returned in ascending string-number order, NOT tonal order.
 * Routing logic is responsible for ranking; this function is a pure lookup.
 */
export function findPositions(midi: number, tuning: TimpleTuning): Position[] {
  if (!Number.isInteger(midi)) {
    throw new TypeError(`MIDI pitch must be an integer, got ${midi}`);
  }
  const out: Position[] = [];
  for (const s of STRING_NUMBERS) {
    const fret = midi - tuning.openMidi(s);
    if (fret >= 0 && fret <= tuning.maxFret) {
      out.push({ string: s as StringNumber, fret });
    }
  }
  return out;
}

/** True if the MIDI pitch is playable somewhere on the instrument. */
export function isPlayable(midi: number, tuning: TimpleTuning): boolean {
  return findPositions(midi, tuning).length > 0;
}
