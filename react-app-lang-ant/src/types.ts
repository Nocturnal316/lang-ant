export type GridCell = {
  color: string;
  ownerId: string;
};

export type Grid = Record<string, GridCell>;

export type ClientMessage =
  | { type: 'placeAnt'; payload: { x: number; y: number; rules: Record<string, 'L' | 'R'> } }
  | { type: 'flipTile'; payload: { x: number; y: number } }
  | { type: 'setRules'; payload: Record<string, 'L' | 'R'> };

export type ServerMessage =
  | { type: 'welcome'; clientId: string; color: string }
  | { type: 'update'; grid: Grid };
