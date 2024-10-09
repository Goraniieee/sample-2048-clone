import type { Cell, Map2048 } from '../types/2048';

let counter = 0;

export const getEmptyCell = (row: number, col: number): Cell => {
  return {
    id: counter++,
    value: null,
    row,
    col,
    isMerged: false,
    isNew: false,
  };
};

export const initializeMap = (n: number, m: number): Map2048 => {
  return {
    rows: n,
    cols: m,
    cells: Array.from({ length: n }, (_, i) =>
      Array.from({ length: m }, (_, j) => getEmptyCell(i, j)),
    ).flat(),
  };
};
