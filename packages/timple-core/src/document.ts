import type { Position, RoutingNote, StringNumber } from './types';
import { findPositions } from './fretboard';
import { routeMonophonic } from './routing';
import { TIMPLE_TUNING_MIDI, TimpleTuning } from './tuning';

/**
 * Document model that mirrors the JSON contract from architecture §4
 * (the API between OMR, the routing engine and the editor UI). Field names
 * are snake_case on purpose to match what gets serialized over the wire.
 */

export type DurationCode = 'whole' | 'half' | 'quarter' | '8th' | '16th';

export const DURATION_BEATS: Readonly<Record<DurationCode, number>> = Object.freeze({
  whole: 4,
  half: 2,
  quarter: 1,
  '8th': 0.5,
  '16th': 0.25,
});

export type OmrConfidence = {
  readonly pitch: number;
  readonly rhythm: number;
};

export type TabData = {
  readonly selected: Position;
  readonly is_user_locked: boolean;
  readonly alternatives: readonly Position[];
};

export type MusicalData = {
  readonly pitch_name: string;
  readonly midi_note: number;
};

export type DocumentEvent = {
  readonly event_id: string;
  readonly start_time: number;
  readonly duration: DurationCode;
  readonly omr_confidence: OmrConfidence;
  readonly musical_data: MusicalData;
  readonly tab_data: TabData;
};

export type DocumentMeasure = {
  readonly measure_number: number;
  readonly events: readonly DocumentEvent[];
};

export type DocumentInstrument = {
  readonly name: string;
  readonly tuning: Readonly<Record<StringNumber, number>>;
};

export type TimpleDocument = {
  readonly document_id: string;
  readonly instrument: DocumentInstrument;
  readonly measures: readonly DocumentMeasure[];
};

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;

/** MIDI 60 → "C4". Uses scientific pitch notation. */
export function midiToPitchName(midi: number): string {
  if (!Number.isInteger(midi)) {
    throw new TypeError(`MIDI pitch must be an integer, got ${midi}`);
  }
  const name = NOTE_NAMES[((midi % 12) + 12) % 12];
  const octave = Math.floor(midi / 12) - 1;
  return `${name}${octave}`;
}

export type MockNoteInput = {
  readonly midi: number;
  readonly duration: DurationCode;
  readonly confidence?: Partial<OmrConfidence>;
  readonly lockedPosition?: Position;
};

export type BuildOptions = {
  readonly documentId: string;
  readonly beatsPerMeasure?: number;
  readonly instrumentName?: string;
  readonly tuning?: TimpleTuning;
  readonly defaultConfidence?: OmrConfidence;
};

const DEFAULT_CONFIDENCE: OmrConfidence = { pitch: 0.95, rhythm: 0.92 };

/**
 * Builds a TimpleDocument from a flat list of melodic events, using the real
 * routing engine to pick `selected` and the fretboard lookup to enumerate
 * `alternatives`. Events are packed into measures by accumulating beats; an
 * event is never split across a barline (the input is expected to be aligned).
 *
 * `start_time` is reported in beats relative to the start of the containing
 * measure — matching the convention used by MusicXML and most score editors.
 */
export function buildMockDocument(
  notes: readonly MockNoteInput[],
  options: BuildOptions,
): TimpleDocument {
  const tuning = options.tuning ?? new TimpleTuning();
  const beatsPerMeasure = options.beatsPerMeasure ?? 4;
  const instrumentName = options.instrumentName ?? 'Timple Canario';
  const defaultConfidence = options.defaultConfidence ?? DEFAULT_CONFIDENCE;

  if (beatsPerMeasure <= 0) {
    throw new RangeError(`beatsPerMeasure must be positive, got ${beatsPerMeasure}`);
  }

  const routingInput: RoutingNote[] = notes.map((n, i) => ({
    id: `evt-${String(i + 1).padStart(3, '0')}`,
    midi: n.midi,
    ...(n.lockedPosition ? { lockedPosition: n.lockedPosition } : {}),
  }));
  const { positions } = routeMonophonic(routingInput, tuning);

  const measures: DocumentMeasure[] = [];
  let currentMeasureEvents: DocumentEvent[] = [];
  let measureNumber = 1;
  let cursorInMeasure = 0;
  const epsilon = 1e-9;

  const flushMeasure = () => {
    measures.push({ measure_number: measureNumber, events: currentMeasureEvents });
    measureNumber += 1;
    currentMeasureEvents = [];
    cursorInMeasure = 0;
  };

  for (let i = 0; i < notes.length; i++) {
    const input = notes[i];
    const beats = DURATION_BEATS[input.duration];
    if (cursorInMeasure + beats > beatsPerMeasure + epsilon) {
      throw new RangeError(
        `Note at index ${i} (MIDI ${input.midi}, ${input.duration}) overflows ` +
          `measure ${measureNumber}: cursor=${cursorInMeasure}, beats=${beats}, ` +
          `barline=${beatsPerMeasure}. Split or re-bar the input.`,
      );
    }

    const selected = positions[i];
    const alternatives = findPositions(input.midi, tuning).filter(
      (p) => !(p.string === selected.string && p.fret === selected.fret),
    );

    const event: DocumentEvent = {
      event_id: routingInput[i].id,
      start_time: cursorInMeasure,
      duration: input.duration,
      omr_confidence: {
        pitch: input.confidence?.pitch ?? defaultConfidence.pitch,
        rhythm: input.confidence?.rhythm ?? defaultConfidence.rhythm,
      },
      musical_data: {
        pitch_name: midiToPitchName(input.midi),
        midi_note: input.midi,
      },
      tab_data: {
        selected,
        is_user_locked: input.lockedPosition !== undefined,
        alternatives,
      },
    };

    currentMeasureEvents.push(event);
    cursorInMeasure += beats;

    if (Math.abs(cursorInMeasure - beatsPerMeasure) < epsilon) {
      flushMeasure();
    }
  }

  if (currentMeasureEvents.length > 0) {
    flushMeasure();
  }

  return {
    document_id: options.documentId,
    instrument: {
      name: instrumentName,
      tuning: TIMPLE_TUNING_MIDI,
    },
    measures,
  };
}
