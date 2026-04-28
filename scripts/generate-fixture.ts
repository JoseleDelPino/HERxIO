/**
 * Generates fixtures/timple-mock-melody.json from the in-repo sample melody.
 *
 * The frontend editor will consume the JSON file directly, so it must match
 * the §4 contract byte-for-byte after running through the real routing
 * engine. Re-run with `npm run gen:fixture` whenever the sample or builder
 * changes, and commit the result.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { buildMockDocument } from '../src/domain/timple/document';
import { ISA_SENCILLA_EN_DO } from '../src/domain/timple/samples';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '..');
const outPath = resolve(repoRoot, 'fixtures/timple-mock-melody.json');

const document = buildMockDocument(ISA_SENCILLA_EN_DO, {
  documentId: 'isa-sencilla-en-do-001',
  beatsPerMeasure: 4,
});

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify(document, null, 2) + '\n', 'utf8');

const totalEvents = document.measures.reduce((sum, m) => sum + m.events.length, 0);
console.log(
  `Wrote ${outPath} — ${document.measures.length} measures, ${totalEvents} events.`,
);
