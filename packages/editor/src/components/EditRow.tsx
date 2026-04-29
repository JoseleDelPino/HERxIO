import type { DocumentMeasure, Position } from '@herxio/timple-core';
import { EventChip } from './EventChip';

type EditRowProps = {
  measure: DocumentMeasure;
  selectedId: string | null;
  flashId: string | null;
  onSelect: (id: string | null) => void;
  onPickAlternative: (id: string, position: Position) => void;
  onToggleLock: (id: string) => void;
};

export function EditRow({
  measure,
  selectedId,
  flashId,
  onSelect,
  onPickAlternative,
  onToggleLock,
}: EditRowProps) {
  return (
    <div className="edit-row">
      {measure.events.map((event) => (
        <EventChip
          key={event.event_id}
          event={event}
          selected={selectedId === event.event_id}
          flashing={flashId === event.event_id}
          onSelect={() =>
            onSelect(selectedId === event.event_id ? null : event.event_id)
          }
          onPickAlternative={(pos) => onPickAlternative(event.event_id, pos)}
          onToggleLock={() => onToggleLock(event.event_id)}
        />
      ))}
    </div>
  );
}
