import { describe, it, expect } from 'vitest';
import {
  DURATION_BEATS,
  buildMockDocument,
  midiToPitchName,
  type MockNoteInput,
} from './document';
import { findPositions } from './fretboard';
import { TimpleTuning, TIMPLE_TUNING_MIDI } from './tuning';
import { ISA_SENCILLA_EN_DO } from './samples';

const tuning = new TimpleTuning();

describe('midiToPitchName', () => {
  it('round-trips standard pitches in scientific notation', () => {
    expect(midiToPitchName(60)).toBe('C4');
    expect(midiToPitchName(64)).toBe('E4');
    expect(midiToPitchName(67)).toBe('G4');
    expect(midiToPitchName(69)).toBe('A4');
    expect(midiToPitchName(72)).toBe('C5');
    expect(midiToPitchName(74)).toBe('D5');
    expect(midiToPitchName(84)).toBe('C6');
  });

  it('renders sharps for black keys', () => {
    expect(midiToPitchName(61)).toBe('C#4');
    expect(midiToPitchName(70)).toBe('A#4');
  });
});

describe('buildMockDocument — top-level schema', () => {
  it('produces the exact §4 contract shape', () => {
    const doc = buildMockDocument(ISA_SENCILLA_EN_DO, { documentId: 'mock-001' });

    expect(doc.document_id).toBe('mock-001');
    expect(doc.instrument.name).toBe('Timple Canario');
    expect(doc.instrument.tuning).toEqual(TIMPLE_TUNING_MIDI);
    expect(Array.isArray(doc.measures)).toBe(true);
    expect(doc.measures.length).toBeGreaterThan(0);

    for (const measure of doc.measures) {
      expect(typeof measure.measure_number).toBe('number');
      expect(Array.isArray(measure.events)).toBe(true);
      for (const event of measure.events) {
        expect(typeof event.event_id).toBe('string');
        expect(typeof event.start_time).toBe('number');
        expect(typeof event.duration).toBe('string');
        expect(event.omr_confidence).toMatchObject({
          pitch: expect.any(Number),
          rhythm: expect.any(Number),
        });
        expect(event.musical_data).toMatchObject({
          pitch_name: expect.any(String),
          midi_note: expect.any(Number),
        });
        expect(event.tab_data.selected).toMatchObject({
          string: expect.any(Number),
          fret: expect.any(Number),
        });
        expect(typeof event.tab_data.is_user_locked).toBe('boolean');
        expect(Array.isArray(event.tab_data.alternatives)).toBe(true);
      }
    }
  });
});

describe('buildMockDocument — measure layout', () => {
  it('packs the sample melody into 4 measures of 4 beats', () => {
    const doc = buildMockDocument(ISA_SENCILLA_EN_DO, { documentId: 'mock' });
    expect(doc.measures).toHaveLength(4);

    for (const measure of doc.measures) {
      const totalBeats = measure.events.reduce(
        (sum, e) => sum + DURATION_BEATS[e.duration],
        0,
      );
      expect(totalBeats).toBeCloseTo(4, 9);
    }
  });

  it('numbers measures starting at 1 and counting consecutively', () => {
    const doc = buildMockDocument(ISA_SENCILLA_EN_DO, { documentId: 'mock' });
    expect(doc.measures.map((m) => m.measure_number)).toEqual([1, 2, 3, 4]);
  });

  it('resets start_time at each barline', () => {
    const doc = buildMockDocument(ISA_SENCILLA_EN_DO, { documentId: 'mock' });
    for (const measure of doc.measures) {
      expect(measure.events[0].start_time).toBe(0);
      // start_time is strictly increasing within a measure.
      for (let i = 1; i < measure.events.length; i++) {
        expect(measure.events[i].start_time).toBeGreaterThan(
          measure.events[i - 1].start_time,
        );
      }
    }
  });

  it('throws when an event would cross a barline', () => {
    const overflow: MockNoteInput[] = [
      { midi: 72, duration: 'quarter' }, // cursor → 1
      { midi: 72, duration: 'half' },    // cursor → 3
      { midi: 72, duration: 'half' },    // would land at 5 → overflow
    ];
    expect(() => buildMockDocument(overflow, { documentId: 'oops' })).toThrow(
      RangeError,
    );
  });
});

describe('buildMockDocument — tab_data integrity', () => {
  it('routes the lowest pitch (E4 in measure 3) to string 3 fret 0', () => {
    const doc = buildMockDocument(ISA_SENCILLA_EN_DO, { documentId: 'mock' });
    const e4Events = doc.measures
      .flatMap((m) => m.events)
      .filter((e) => e.musical_data.midi_note === 64);

    expect(e4Events.length).toBeGreaterThan(0);
    for (const event of e4Events) {
      expect(event.tab_data.selected).toEqual({ string: 3, fret: 0 });
      expect(event.tab_data.alternatives).toEqual([]);
    }
  });

  it('selected ∪ alternatives equals every playable position for the pitch', () => {
    const doc = buildMockDocument(ISA_SENCILLA_EN_DO, { documentId: 'mock' });
    for (const measure of doc.measures) {
      for (const event of measure.events) {
        const all = findPositions(event.musical_data.midi_note, tuning);
        const reconstructed = [event.tab_data.selected, ...event.tab_data.alternatives];
        expect(reconstructed).toHaveLength(all.length);
        // Every entry from `all` appears exactly once in the reconstruction.
        for (const pos of all) {
          const matches = reconstructed.filter(
            (p) => p.string === pos.string && p.fret === pos.fret,
          );
          expect(matches).toHaveLength(1);
        }
      }
    }
  });

  it('does not include the selected position inside alternatives', () => {
    const doc = buildMockDocument(ISA_SENCILLA_EN_DO, { documentId: 'mock' });
    for (const measure of doc.measures) {
      for (const event of measure.events) {
        const sel = event.tab_data.selected;
        const dup = event.tab_data.alternatives.find(
          (p) => p.string === sel.string && p.fret === sel.fret,
        );
        expect(dup).toBeUndefined();
      }
    }
  });

  it('marks notes with explicit lockedPosition as user-locked', () => {
    const input: MockNoteInput[] = [
      { midi: 72, duration: 'quarter' },
      { midi: 72, duration: 'quarter', lockedPosition: { string: 3, fret: 8 } },
      { midi: 72, duration: 'half' },
    ];
    const doc = buildMockDocument(input, { documentId: 'lock' });
    const events = doc.measures.flatMap((m) => m.events);
    expect(events[0].tab_data.is_user_locked).toBe(false);
    expect(events[1].tab_data.is_user_locked).toBe(true);
    expect(events[1].tab_data.selected).toEqual({ string: 3, fret: 8 });
    expect(events[2].tab_data.is_user_locked).toBe(false);
  });
});

describe('buildMockDocument — confidence and naming', () => {
  it('keeps every confidence value in [0, 1]', () => {
    const doc = buildMockDocument(ISA_SENCILLA_EN_DO, { documentId: 'mock' });
    for (const measure of doc.measures) {
      for (const event of measure.events) {
        expect(event.omr_confidence.pitch).toBeGreaterThanOrEqual(0);
        expect(event.omr_confidence.pitch).toBeLessThanOrEqual(1);
        expect(event.omr_confidence.rhythm).toBeGreaterThanOrEqual(0);
        expect(event.omr_confidence.rhythm).toBeLessThanOrEqual(1);
      }
    }
  });

  it('preserves explicit per-note confidence overrides from the input', () => {
    const doc = buildMockDocument(ISA_SENCILLA_EN_DO, { documentId: 'mock' });
    const allEvents = doc.measures.flatMap((m) => m.events);

    // Sample defines an F5 with rhythm 0.70 (UI warning trigger).
    const f5LowRhythm = allEvents.find(
      (e) => e.musical_data.midi_note === 77 && e.omr_confidence.rhythm === 0.70,
    );
    expect(f5LowRhythm).toBeDefined();

    // And an E4 with pitch 0.78.
    const e4LowPitch = allEvents.find(
      (e) => e.musical_data.midi_note === 64 && e.omr_confidence.pitch === 0.78,
    );
    expect(e4LowPitch).toBeDefined();
  });

  it('keeps pitch_name and midi_note in agreement', () => {
    const doc = buildMockDocument(ISA_SENCILLA_EN_DO, { documentId: 'mock' });
    for (const measure of doc.measures) {
      for (const event of measure.events) {
        expect(event.musical_data.pitch_name).toBe(
          midiToPitchName(event.musical_data.midi_note),
        );
      }
    }
  });
});
