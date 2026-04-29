import type { DocumentEvent, Position } from '@herxio/timple-core';
import { isLowConfidence } from '../utils/confidence';

type EventChipProps = {
  event: DocumentEvent;
  selected: boolean;
  flashing: boolean;
  onSelect: () => void;
  onPickAlternative: (position: Position) => void;
  onToggleLock: () => void;
};

export function EventChip({
  event,
  selected,
  flashing,
  onSelect,
  onPickAlternative,
  onToggleLock,
}: EventChipProps) {
  const className = [
    'chip',
    selected && 'chip--selected',
    flashing && 'chip--flash',
    event.tab_data.is_user_locked && 'chip--locked',
    isLowConfidence(event) && 'chip--warning',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={className}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      aria-pressed={selected}
    >
      <div className="chip__row">
        <span className="chip__pitch">{event.musical_data.pitch_name}</span>
        <span className="chip__position">
          {event.tab_data.selected.string}·{event.tab_data.selected.fret}
        </span>
      </div>
      {event.tab_data.is_user_locked && (
        <button
          type="button"
          className="chip__lock"
          onClick={(e) => {
            e.stopPropagation();
            onToggleLock();
          }}
          title="Quitar bloqueo (L)"
        >
          PIN
        </button>
      )}
      {selected && (
        <div className="chip__alternatives" onClick={(e) => e.stopPropagation()}>
          {event.tab_data.alternatives.length === 0 ? (
            <span className="chip__alternatives-empty">sin alternativas</span>
          ) : (
            event.tab_data.alternatives.map((alt) => (
              <button
                key={`${alt.string}-${alt.fret}`}
                type="button"
                className="chip__alt-button"
                onClick={() => onPickAlternative(alt)}
                title={`Cuerda ${alt.string} traste ${alt.fret}`}
              >
                {alt.string}·{alt.fret}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
