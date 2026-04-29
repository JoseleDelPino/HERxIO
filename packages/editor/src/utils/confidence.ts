import type { DocumentEvent } from '@herxio/timple-core';

export const LOW_CONFIDENCE_THRESHOLD = 0.85;
export const WARNING_COLOR = '#d4a017';

export function isLowConfidence(event: DocumentEvent): boolean {
  return (
    event.omr_confidence.pitch < LOW_CONFIDENCE_THRESHOLD ||
    event.omr_confidence.rhythm < LOW_CONFIDENCE_THRESHOLD
  );
}
