import type { MockNoteInput } from './document';

/**
 * "Isa Sencilla en Do" — a stylized 4-bar mock melody designed for the editor
 * fixture. Not a transcription of a real piece; the goal is to exercise:
 *
 *  - Open-string preference on string 4 (C5) and string 1 (D5).
 *  - The lowest playable pitch (E4 = MIDI 64), which can ONLY be routed to
 *    string 3 fret 0 — a regression target for the routing engine.
 *  - A high reach (C6 = MIDI 84) that pushes the upper edge of a 12-fret
 *    fingerboard.
 *  - Two intentionally low confidence_score values so the editor's
 *    "Ghost Notes & Confidence Highlights" UI can be exercised without
 *    plugging in the OMR model.
 */
export const ISA_SENCILLA_EN_DO: readonly MockNoteInput[] = [
  // Measure 1 — ascending then descending C major run, all eighths.
  { midi: 72, duration: '8th' },                                    // C5
  { midi: 74, duration: '8th' },                                    // D5
  { midi: 76, duration: '8th' },                                    // E5
  { midi: 77, duration: '8th', confidence: { rhythm: 0.70 } },      // F5 — low rhythm confidence
  { midi: 79, duration: '8th' },                                    // G5
  { midi: 77, duration: '8th' },                                    // F5
  { midi: 76, duration: '8th' },                                    // E5
  { midi: 74, duration: '8th' },                                    // D5

  // Measure 2 — C major arpeggio reaching C6.
  { midi: 72, duration: 'quarter' },                                // C5
  { midi: 76, duration: '8th' },                                    // E5
  { midi: 79, duration: '8th' },                                    // G5
  { midi: 84, duration: 'quarter' },                                // C6 — top of the board
  { midi: 79, duration: '8th' },                                    // G5
  { midi: 76, duration: '8th' },                                    // E5

  // Measure 3 — low-register passage that hits E4, the lowest note.
  { midi: 72, duration: '8th' },                                    // C5
  { midi: 67, duration: '8th' },                                    // G4
  { midi: 64, duration: 'quarter', confidence: { pitch: 0.78 } },   // E4 — low pitch confidence
  { midi: 67, duration: '8th' },                                    // G4
  { midi: 69, duration: '8th' },                                    // A4
  { midi: 72, duration: '8th' },                                    // C5
  { midi: 74, duration: '8th' },                                    // D5

  // Measure 4 — cadence resolving to C5.
  { midi: 76, duration: 'quarter' },                                // E5
  { midi: 74, duration: 'quarter' },                                // D5
  { midi: 72, duration: 'half' },                                   // C5 — final
];
