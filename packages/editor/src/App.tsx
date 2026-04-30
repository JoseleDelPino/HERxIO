import { useEffect, useReducer, useMemo, useCallback } from 'react';
import {
  ISA_SENCILLA_EN_DO,
  buildMockDocument,
  type DurationCode,
  type Position,
  type StringNumber,
} from '@herxio/timple-core';
import { MeasureView } from './components/MeasureView';
import { EditRow } from './components/EditRow';
import {
  editorReducer,
  initialEditorState,
} from './state/editorState';

const DIGIT_CODES = new Set([
  'Digit1',
  'Digit2',
  'Digit3',
  'Digit4',
  'Digit5',
]);

/**
 * NumPad → duration mapping. Smallest number = shortest note (most subdivision),
 * which mirrors how staff editors expose tuplet shortcuts.
 */
const NUMPAD_DURATIONS: Record<string, DurationCode> = {
  Numpad1: '16th',
  Numpad2: '8th',
  Numpad3: 'quarter',
  Numpad4: 'half',
  Numpad5: 'whole',
};

const FLASH_DURATION_MS = 600;

export function App() {
  const initialDoc = useMemo(
    () =>
      buildMockDocument(ISA_SENCILLA_EN_DO, {
        documentId: 'isa-sencilla-en-do-001',
        beatsPerMeasure: 4,
      }),
    [],
  );

  const [state, dispatch] = useReducer(editorReducer, initialDoc, initialEditorState);

  useEffect(() => {
    if (!state.invalidFlashId) return;
    const timer = window.setTimeout(
      () => dispatch({ type: 'clear-flash' }),
      FLASH_DURATION_MS,
    );
    return () => window.clearTimeout(timer);
  }, [state.invalidFlashId]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }
      if (event.key === 'Escape') {
        dispatch({ type: 'select', id: null });
        return;
      }
      if (!state.selectedId) return;
      if (DIGIT_CODES.has(event.code)) {
        const stringNumber = Number(event.code.slice(-1)) as StringNumber;
        dispatch({ type: 'change-string', id: state.selectedId, string: stringNumber });
        event.preventDefault();
        return;
      }
      const duration = NUMPAD_DURATIONS[event.code];
      if (duration) {
        dispatch({ type: 'change-duration', id: state.selectedId, duration });
        event.preventDefault();
        return;
      }
      if (event.key === 'l' || event.key === 'L') {
        dispatch({ type: 'toggle-lock', id: state.selectedId });
        event.preventDefault();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [state.selectedId]);

  const handleDragNote = useCallback(
    (eventId: string, targetString: StringNumber) => {
      dispatch({ type: 'change-string', id: eventId, string: targetString });
    },
    [],
  );

  const handleSelect = useCallback((id: string | null) => {
    dispatch({ type: 'select', id });
  }, []);

  const handlePickAlternative = useCallback((id: string, position: Position) => {
    dispatch({ type: 'change-position', id, position });
  }, []);

  const handleToggleLock = useCallback((id: string) => {
    dispatch({ type: 'toggle-lock', id });
  }, []);

  const totalEvents = state.doc.measures.reduce(
    (sum, m) => sum + m.events.length,
    0,
  );
  const lockedCount = state.doc.measures
    .flatMap((m) => m.events)
    .filter((e) => e.tab_data.is_user_locked).length;

  return (
    <div className="editor">
      <header className="editor__header">
        <h1>HERxIO — Editor de tablatura</h1>
        <p>
          {state.doc.instrument.name} · documento{' '}
          <code>{state.doc.document_id}</code> · {state.doc.measures.length} compases ·{' '}
          {totalEvents} eventos · {lockedCount} bloqueados
        </p>
        <div className="editor__legend">
          <span>
            <span
              className="editor__legend-swatch"
              style={{ background: '#d4a017' }}
            />
            Confianza OMR &lt; 0.85
          </span>
          <span>
            <kbd>1</kbd>–<kbd>5</kbd> mover a cuerda · <kbd>L</kbd> bloqueo ·{' '}
            <kbd>Esc</kbd> deseleccionar
          </span>
          <span>
            <kbd>Num1</kbd>–<kbd>Num5</kbd> duración (16th → whole) · arrastrar
            número del tab a otra cuerda
          </span>
        </div>
      </header>
      <main>
        {state.doc.measures.map((measure, idx) => (
          <section key={measure.measure_number} className="measure">
            <div className="measure__heading">
              <h2 className="measure__title">Compás {measure.measure_number}</h2>
              <p className="measure__events">{measure.events.length} eventos</p>
            </div>
            <MeasureView
              measure={measure}
              isFirst={idx === 0}
              flashId={state.invalidFlashId}
              onSelect={handleSelect}
              onDragNote={handleDragNote}
            />
            <EditRow
              measure={measure}
              selectedId={state.selectedId}
              flashId={state.invalidFlashId}
              onSelect={handleSelect}
              onPickAlternative={handlePickAlternative}
              onToggleLock={handleToggleLock}
            />
          </section>
        ))}
      </main>
    </div>
  );
}
