export type Cell = {
  id: number;
  value: number | null;
  row: number;
  col: number;
  isNew: boolean;
  isMerged: boolean;
};
export type Map2048 = {
  rows: number;
  cols: number;
  cells: Cell[];
};
export type Direction = 'up' | 'left' | 'right' | 'down';
export type GameStatus = 'playing' | 'won' | 'over';
export type MoveResult = { result: Map2048; isMoved: boolean };
export type History = {
  map: Map2048;
  score: number;
  status: GameStatus;
};
export type GameState = {
  row: number;
  col: number;
  history: History[];
};
