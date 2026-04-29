import {
  DURATION_BEATS,
  TIMPLE_TUNING_MIDI,
  TimpleTuning,
  routeDocument,
  type DocumentMeasure,
  type DurationCode,
  type Position,
  type StringNumber,
  type TimpleDocument,
} from '@herxio/timple-core';

const DEFAULT_TUNING = new TimpleTuning();
const BEATS_PER_MEASURE = 4;
const BEAT_EPSILON = 1e-9;

export type EditorState = {
  readonly doc: TimpleDocument;
  readonly selectedId: string | null;
  readonly invalidFlashId: string | null;
};

export type EditorAction =
  | { type: 'select'; id: string | null }
  | { type: 'change-position'; id: string; position: Position }
  | { type: 'change-string'; id: string; string: StringNumber }
  | { type: 'change-duration'; id: string; duration: DurationCode }
  | { type: 'toggle-lock'; id: string }
  | { type: 'flash-invalid'; id: string }
  | { type: 'clear-flash' };

export const initialEditorState = (doc: TimpleDocument): EditorState => ({
  doc,
  selectedId: null,
  invalidFlashId: null,
});

export function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case 'select':
      return { ...state, selectedId: action.id };

    case 'change-position': {
      const updated = applyEdit(state.doc, action.id, (event) => ({
        ...event,
        tab_data: {
          ...event.tab_data,
          selected: action.position,
          is_user_locked: true,
        },
      }));
      return {
        doc: routeDocument(updated, DEFAULT_TUNING),
        selectedId: action.id,
        invalidFlashId: null,
      };
    }

    case 'change-string': {
      const event = findEvent(state.doc, action.id);
      if (!event) return state;
      const targetOpenMidi = TIMPLE_TUNING_MIDI[action.string];
      const fret = event.musical_data.midi_note - targetOpenMidi;
      if (fret < 0 || fret > DEFAULT_TUNING.maxFret) {
        return { ...state, invalidFlashId: action.id };
      }
      const updated = applyEdit(state.doc, action.id, (e) => ({
        ...e,
        tab_data: {
          ...e.tab_data,
          selected: { string: action.string, fret },
          is_user_locked: true,
        },
      }));
      return {
        doc: routeDocument(updated, DEFAULT_TUNING),
        selectedId: action.id,
        invalidFlashId: null,
      };
    }

    case 'change-duration': {
      const updated = applyDurationChange(state.doc, action.id, action.duration);
      if (!updated) {
        // The new duration would overflow the measure — flash and bail.
        return { ...state, invalidFlashId: action.id };
      }
      return { ...state, doc: updated, invalidFlashId: null };
    }

    case 'toggle-lock': {
      const event = findEvent(state.doc, action.id);
      if (!event) return state;
      const updated = applyEdit(state.doc, action.id, (e) => ({
        ...e,
        tab_data: {
          ...e.tab_data,
          is_user_locked: !e.tab_data.is_user_locked,
        },
      }));
      return {
        ...state,
        doc: routeDocument(updated, DEFAULT_TUNING),
      };
    }

    case 'flash-invalid':
      return { ...state, invalidFlashId: action.id };

    case 'clear-flash':
      return { ...state, invalidFlashId: null };
  }
}

function applyEdit(
  doc: TimpleDocument,
  eventId: string,
  patch: (e: TimpleDocument['measures'][number]['events'][number]) => TimpleDocument['measures'][number]['events'][number],
): TimpleDocument {
  return {
    ...doc,
    measures: doc.measures.map((m) => ({
      ...m,
      events: m.events.map((e) => (e.event_id === eventId ? patch(e) : e)),
    })),
  };
}

function findEvent(
  doc: TimpleDocument,
  eventId: string,
): TimpleDocument['measures'][number]['events'][number] | undefined {
  for (const measure of doc.measures) {
    for (const event of measure.events) {
      if (event.event_id === eventId) return event;
    }
  }
  return undefined;
}

/**
 * Replaces an event's duration. Returns null when the change would push the
 * containing measure past its barline — caller decides what to do (we flash
 * a red-invalid in that case rather than silently overflowing).
 *
 * On success, every event after the changed one in the same measure has its
 * `start_time` recomputed so the cumulative beats stay consistent.
 */
function applyDurationChange(
  doc: TimpleDocument,
  eventId: string,
  newDuration: DurationCode,
): TimpleDocument | null {
  for (const measure of doc.measures) {
    const idx = measure.events.findIndex((e) => e.event_id === eventId);
    if (idx === -1) continue;

    const oldBeats = DURATION_BEATS[measure.events[idx].duration];
    const newBeats = DURATION_BEATS[newDuration];
    const totalBefore = measureBeats(measure);
    const totalAfter = totalBefore - oldBeats + newBeats;
    if (totalAfter > BEATS_PER_MEASURE + BEAT_EPSILON) return null;

    const updatedMeasure: DocumentMeasure = {
      ...measure,
      events: rebaselineStartTimes(
        measure.events.map((e, i) => (i === idx ? { ...e, duration: newDuration } : e)),
      ),
    };

    return {
      ...doc,
      measures: doc.measures.map((m) =>
        m.measure_number === measure.measure_number ? updatedMeasure : m,
      ),
    };
  }
  return null;
}

function measureBeats(measure: DocumentMeasure): number {
  return measure.events.reduce((sum, e) => sum + DURATION_BEATS[e.duration], 0);
}

function rebaselineStartTimes(
  events: DocumentMeasure['events'],
): DocumentMeasure['events'] {
  let cursor = 0;
  return events.map((e) => {
    const next = { ...e, start_time: cursor };
    cursor += DURATION_BEATS[e.duration];
    return next;
  });
}
