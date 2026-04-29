import {
  TIMPLE_TUNING_MIDI,
  TimpleTuning,
  routeDocument,
  type Position,
  type StringNumber,
  type TimpleDocument,
} from '@herxio/timple-core';

const DEFAULT_TUNING = new TimpleTuning();

export type EditorState = {
  readonly doc: TimpleDocument;
  readonly selectedId: string | null;
  readonly invalidFlashId: string | null;
};

export type EditorAction =
  | { type: 'select'; id: string | null }
  | { type: 'change-position'; id: string; position: Position }
  | { type: 'change-string'; id: string; string: StringNumber }
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
