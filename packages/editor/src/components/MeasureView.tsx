import { useEffect, useRef, useState } from 'react';
import {
  Accidental,
  Formatter,
  Renderer,
  Stave,
  StaveNote,
  TabNote,
  TabStave,
  Voice,
} from 'vexflow';
import {
  TimpleTuning,
  type DocumentEvent,
  type DocumentMeasure,
  type DurationCode,
  type StringNumber,
} from '@herxio/timple-core';
import { isLowConfidence, WARNING_COLOR } from '../utils/confidence';

const VEX_DURATION: Record<DurationCode, string> = {
  whole: 'w',
  half: 'h',
  quarter: 'q',
  '8th': '8',
  '16th': '16',
};

const STAVE_TOP_Y = 0;
const TAB_STAVE_TOP_Y = 120;
const CANVAS_WIDTH = 880;
const CANVAS_HEIGHT = 240;
const TUNING = new TimpleTuning();

function pitchToVexKey(pitchName: string): { key: string; accidental: string | null } {
  const isSharp = pitchName.includes('#');
  const root = pitchName[0].toLowerCase();
  const octave = pitchName.slice(-1);
  return {
    key: `${root}${isSharp ? '#' : ''}/${octave}`,
    accidental: isSharp ? '#' : null,
  };
}

function buildStaveNote(event: DocumentEvent): StaveNote {
  const { key, accidental } = pitchToVexKey(event.musical_data.pitch_name);
  const note = new StaveNote({
    keys: [key],
    duration: VEX_DURATION[event.duration],
  });
  if (accidental) {
    note.addModifier(new Accidental(accidental));
  }
  if (isLowConfidence(event)) {
    note.setStyle({ fillStyle: WARNING_COLOR, strokeStyle: WARNING_COLOR });
  }
  return note;
}

function buildTabNote(event: DocumentEvent): TabNote {
  const note = new TabNote({
    positions: [
      { str: event.tab_data.selected.string, fret: event.tab_data.selected.fret },
    ],
    duration: VEX_DURATION[event.duration],
  });
  if (isLowConfidence(event)) {
    note.setStyle({ fillStyle: WARNING_COLOR, strokeStyle: WARNING_COLOR });
  }
  return note;
}

type DragHint = {
  readonly x: number;
  readonly y: number;
  readonly label: string;
  readonly valid: boolean;
};

type MeasureViewProps = {
  measure: DocumentMeasure;
  isFirst: boolean;
  flashId: string | null;
  onSelect?: (id: string) => void;
  onDragNote: (eventId: string, targetString: StringNumber) => void;
};

export function MeasureView({
  measure,
  isFirst,
  flashId,
  onSelect,
  onDragNote,
}: MeasureViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragHint, setDragHint] = useState<DragHint | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.innerHTML = '';

    const renderer = new Renderer(container, Renderer.Backends.SVG);
    renderer.resize(CANVAS_WIDTH, CANVAS_HEIGHT);
    const ctx = renderer.getContext();

    const stave = new Stave(10, STAVE_TOP_Y, CANVAS_WIDTH - 20);
    if (isFirst) {
      stave.addClef('treble').addTimeSignature('4/4');
    }
    stave.setContext(ctx).draw();

    const tabStave = new TabStave(10, TAB_STAVE_TOP_Y, CANVAS_WIDTH - 20);
    tabStave.setNumLines(5);
    if (isFirst) {
      tabStave.addClef('tab');
    }
    tabStave.setContext(ctx).draw();

    const notes = measure.events.map(buildStaveNote);
    const tabNotes = measure.events.map(buildTabNote);

    const voice = new Voice({ num_beats: 4, beat_value: 4 })
      .setStrict(false)
      .addTickables(notes);
    const tabVoice = new Voice({ num_beats: 4, beat_value: 4 })
      .setStrict(false)
      .addTickables(tabNotes);

    new Formatter()
      .joinVoices([voice, tabVoice])
      .format([voice, tabVoice], CANVAS_WIDTH - 80);

    voice.draw(ctx, stave);
    tabVoice.draw(ctx, tabStave);

    const cleanups: Array<() => void> = [];

    for (let i = 0; i < tabNotes.length; i++) {
      const svgEl = tabNotes[i].getSVGElement() as SVGElement | undefined;
      const event = measure.events[i];
      if (!svgEl) continue;

      svgEl.classList.add('vf-tabnote');
      if (flashId === event.event_id) {
        svgEl.classList.add('vf-tabnote--flash');
      }

      const onPointerDown = (downEvent: Event) => {
        const pe = downEvent as PointerEvent;
        pe.preventDefault();
        beginDrag(pe, event, container, tabStave, svgEl, setDragHint, onDragNote);
        onSelect?.(event.event_id);
      };
      svgEl.addEventListener('pointerdown', onPointerDown);
      cleanups.push(() => svgEl.removeEventListener('pointerdown', onPointerDown));
    }

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, [measure, isFirst, flashId, onSelect, onDragNote]);

  return (
    <div className="measure__canvas" ref={containerRef}>
      {dragHint && (
        <div
          className={`drag-hint${dragHint.valid ? '' : ' drag-hint--invalid'}`}
          style={{ left: dragHint.x, top: dragHint.y }}
        >
          {dragHint.label}
        </div>
      )}
    </div>
  );
}

/**
 * Picks the closest tab-stave line (string) to a page-Y coordinate, and
 * returns the resulting fingering for the dragged event's pitch.
 */
function computeDropTarget(
  documentEvent: DocumentEvent,
  container: HTMLDivElement,
  tabStave: TabStave,
  pageY: number,
): { string: StringNumber; fret: number; valid: boolean } {
  const containerRect = container.getBoundingClientRect();
  const localY = pageY - containerRect.top;
  let bestLine = 0;
  let bestDist = Infinity;
  for (let line = 0; line < 5; line++) {
    const lineY = tabStave.getYForLine(line);
    const dist = Math.abs(localY - lineY);
    if (dist < bestDist) {
      bestDist = dist;
      bestLine = line;
    }
  }
  const targetString = (bestLine + 1) as StringNumber;
  const fret = documentEvent.musical_data.midi_note - TUNING.openMidi(targetString);
  return { string: targetString, fret, valid: fret >= 0 && fret <= TUNING.maxFret };
}

function beginDrag(
  startEvent: PointerEvent,
  documentEvent: DocumentEvent,
  container: HTMLDivElement,
  tabStave: TabStave,
  svgEl: SVGElement,
  setHint: (hint: DragHint | null) => void,
  onDragNote: (eventId: string, target: StringNumber) => void,
) {
  const initialString = documentEvent.tab_data.selected.string;
  let latestTarget: StringNumber = initialString;
  let moved = false;

  svgEl.classList.add('vf-tabnote--dragging');

  const onMove = (move: PointerEvent) => {
    const { string: s, fret, valid } = computeDropTarget(
      documentEvent,
      container,
      tabStave,
      move.clientY,
    );
    latestTarget = s;
    moved = true;
    setHint({
      x: move.clientX + 14,
      y: move.clientY + 14,
      label: valid
        ? `→ cuerda ${s} traste ${fret}`
        : `× cuerda ${s} fuera de rango`,
      valid,
    });
  };

  const onUp = () => {
    document.removeEventListener('pointermove', onMove);
    document.removeEventListener('pointerup', onUp);
    document.removeEventListener('pointercancel', onUp);
    svgEl.classList.remove('vf-tabnote--dragging');
    setHint(null);
    if (moved && latestTarget !== initialString) {
      // The reducer validates fret bounds and flashes red on rejection.
      onDragNote(documentEvent.event_id, latestTarget);
    }
  };

  document.addEventListener('pointermove', onMove);
  document.addEventListener('pointerup', onUp);
  document.addEventListener('pointercancel', onUp);

  // Seed the hint at the initial cursor position so the user gets feedback
  // even before the first move.
  const initial = computeDropTarget(documentEvent, container, tabStave, startEvent.clientY);
  setHint({
    x: startEvent.clientX + 14,
    y: startEvent.clientY + 14,
    label: initial.valid
      ? `→ cuerda ${initial.string} traste ${initial.fret}`
      : `× cuerda ${initial.string} fuera de rango`,
    valid: initial.valid,
  });
}
