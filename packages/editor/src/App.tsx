import { useMemo } from 'react';
import {
  ISA_SENCILLA_EN_DO,
  buildMockDocument,
  type TimpleDocument,
} from '@herxio/timple-core';
import { MeasureView } from './components/MeasureView';

export function App() {
  const document: TimpleDocument = useMemo(
    () =>
      buildMockDocument(ISA_SENCILLA_EN_DO, {
        documentId: 'isa-sencilla-en-do-001',
        beatsPerMeasure: 4,
      }),
    [],
  );

  const totalEvents = document.measures.reduce(
    (sum, m) => sum + m.events.length,
    0,
  );

  return (
    <div className="editor">
      <header className="editor__header">
        <h1>HERxIO — Editor de tablatura</h1>
        <p>
          {document.instrument.name} · documento <code>{document.document_id}</code> ·{' '}
          {document.measures.length} compases · {totalEvents} eventos
        </p>
        <div className="editor__legend">
          <span>
            <span
              className="editor__legend-swatch"
              style={{ background: '#d4a017' }}
            />
            Confianza OMR &lt; 0.85 (revisar)
          </span>
        </div>
      </header>
      <main>
        {document.measures.map((measure, idx) => (
          <MeasureView
            key={measure.measure_number}
            measure={measure}
            isFirst={idx === 0}
          />
        ))}
      </main>
    </div>
  );
}
