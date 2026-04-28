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
};
