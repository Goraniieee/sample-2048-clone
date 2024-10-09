import type { Cell, Direction, Map2048, MoveResult } from '../types/2048';
import { getEmptyCell } from './initializeMap';

export const moveMap = (map: Map2048, direction: Direction): MoveResult => {
  const filteredCells = map.cells.filter((cell) => !cell.isMerged);
  const mappedCells = filteredCells.map((cell) => ({ ...cell, isNew: false }));
  const rotatedMap = rotateMapCounterClockwise(
    { ...map, cells: mappedCells },
    rotateDegreeMap[direction],
  );
  const sortedCells = rotatedMap.cells.sort((a, b) => {
    if (a.row === b.row) {
      return a.col - b.col;
    }
    return a.row - b.row;
  });
  const cellGrid: CellGrid = sortedCells.reduce((board: CellGrid, cell) => {
    return {
      ...board,
      [cell.row]: [...(board[cell.row] ?? []), cell],
    };
  }, {});

  const { result, isMoved } = moveLeft(cellGrid);
  const rotatedBackMap = rotateMapCounterClockwise(
    { ...rotatedMap, cells: Object.values(result).flat() },
    revertDegreeMap[direction],
  );

  return { result: rotatedBackMap, isMoved };
};

const rotateMapCounterClockwise = (
  map: Map2048,
  degree: 0 | 90 | 180 | 270,
): Map2048 => {
  const rotatedCells = map.cells.map((cell) => {
    switch (degree) {
      case 0:
        return cell;
      case 90:
        return { ...cell, row: map.cols - cell.col - 1, col: cell.row };
      case 180:
        return {
          ...cell,
          row: map.rows - cell.row - 1,
          col: map.cols - cell.col - 1,
        };
      case 270:
        return { ...cell, row: cell.col, col: map.rows - cell.row - 1 };
    }
  });

  return {
    ...map,
    rows: degree === 90 || degree === 270 ? map.cols : map.rows,
    cols: degree === 90 || degree === 270 ? map.rows : map.cols,
    cells: rotatedCells,
  };
};

const moveLeft = (map: CellGrid): GridMovedResult => {
  const movedRows = Object.entries(map).map(moveRowLeft);
  const result = movedRows.map((movedRow) => movedRow.result);
  const isMoved = movedRows.some((movedRow) => movedRow.isMoved);
  return { result, isMoved };
};

const moveRowLeft = ([r, row]: [string, Cell[]]): {
  result: Cell[];
  isMoved: boolean;
} => {
  const rowIndex = parseInt(r, 10);
  const reduced = row.reduce(
    (
      acc: {
        lastCell: Cell | null;
        lastColumnIndex: number;
        result: Cell[];
        moved: boolean;
      },
      cell,
    ) => {
      if (cell.value === null) {
        return acc;
      } else if (acc.lastCell === null) {
        return { ...acc, lastCell: cell };
      } else if (acc.lastCell.value === cell.value) {
        const oldCell = { ...cell, isMerged: true, col: acc.lastColumnIndex };
        const newCell = {
          ...acc.lastCell,
          value: acc.lastCell.value * 2,
          col: acc.lastColumnIndex,
          isNew: true,
          isMerged: false,
        };
        return {
          result: [...acc.result, oldCell, newCell],
          lastCell: null,
          lastColumnIndex: acc.lastColumnIndex + 1,
          moved: true,
        };
      } else {
        const movedCell = { ...acc.lastCell, col: acc.lastColumnIndex };
        return {
          result: [...acc.result, movedCell],
          lastCell: cell,
          lastColumnIndex: acc.lastColumnIndex + 1,
          moved: acc.moved || acc.lastCell.col !== acc.lastColumnIndex,
        };
      }
    },
    { lastCell: null, lastColumnIndex: 0, result: [], moved: false },
  );

  let lastColumnIndex = reduced.lastColumnIndex;
  let isMoved = reduced.moved;
  let result = reduced.result;

  if (reduced.lastCell !== null) {
    const lastCell = { ...reduced.lastCell, col: reduced.lastColumnIndex };
    isMoved = isMoved || reduced.lastCell.col !== reduced.lastColumnIndex;
    result = [...reduced.result, lastCell];
    lastColumnIndex++;
  }

  const emptyCells = Array.from(
    { length: row.length - lastColumnIndex },
    (_, i) => getEmptyCell(rowIndex, lastColumnIndex + i),
  );
  return { result: [...result, ...emptyCells], isMoved };
};

const rotateDegreeMap: DirectionDegreeMap = {
  up: 90,
  right: 180,
  down: 270,
  left: 0,
};

const revertDegreeMap: DirectionDegreeMap = {
  up: 270,
  right: 180,
  down: 90,
  left: 0,
};

type CellGrid = { [row: number]: Cell[] };
type GridMovedResult = { result: CellGrid; isMoved: boolean };
type RotateDegree = 0 | 90 | 180 | 270;
type DirectionDegreeMap = Record<Direction, RotateDegree>;
