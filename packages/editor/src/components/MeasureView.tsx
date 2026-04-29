import { useEffect, useRef } from 'react';
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
import type { DocumentEvent, DocumentMeasure, DurationCode } from '@herxio/timple-core';
import { isLowConfidence, WARNING_COLOR } from '../utils/confidence';

const VEX_DURATION: Record<DurationCode, string> = {
  whole: 'w',
  half: 'h',
  quarter: 'q',
  '8th': '8',
  '16th': '16',
};

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

type MeasureViewProps = {
  measure: DocumentMeasure;
  isFirst: boolean;
};

export function MeasureView({ measure, isFirst }: MeasureViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.innerHTML = '';

    const width = 880;
    const renderer = new Renderer(container, Renderer.Backends.SVG);
    renderer.resize(width, 240);
    const ctx = renderer.getContext();

    const stave = new Stave(10, 0, width - 20);
    if (isFirst) {
      stave.addClef('treble').addTimeSignature('4/4');
    }
    stave.setContext(ctx).draw();

    const tabStave = new TabStave(10, 120, width - 20);
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
      .format([voice, tabVoice], width - 80);

    voice.draw(ctx, stave);
    tabVoice.draw(ctx, tabStave);
  }, [measure, isFirst]);

  return <div className="measure__canvas" ref={containerRef} />;
}
