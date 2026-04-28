export type StringNumber = 1 | 2 | 3 | 4 | 5;

export const STRING_NUMBERS: readonly StringNumber[] = [1, 2, 3, 4, 5] as const;

export type Position = {
  readonly string: StringNumber;
  readonly fret: number;
};

export type RoutingNote = {
  readonly id: string;
  readonly midi: number;
  readonly lockedPosition?: Position;
};

export type RoutingResult = {
  readonly positions: Position[];
  readonly totalCost: number;
};

export type CostConfig = {
  readonly stretchThreshold: number;
  readonly stretchPenaltyBase: number;
  readonly adjacentStringCost: number;
  readonly jumpStringCostPerStep: number;
  /**
   * Tiny per-position cost equal to `lowFretBias * fret`. Acts as a tiebreaker
   * that favors lower frets (and open strings in particular) when the routing
   * cost is otherwise identical. Should be small enough that it never overrides
   * a real ergonomic decision — the default 1e-6 is far below any other cost.
   */
  readonly lowFretBias: number;
};
