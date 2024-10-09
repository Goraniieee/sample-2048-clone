import type { Map2048 } from '../types/2048';

export const addOneRandomBlock = (map: Map2048): Map2048 => {
  const emptyCells: [number, number][] = [];

  map.cells.forEach((cell) => {
    if (cell.value === null) {
      emptyCells.push([cell.row, cell.col]);
    }
  });

  if (emptyCells.length === 0) return map;

  const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  if (randomCell === undefined) return map;
  const [randRow, randCol] = randomCell;

  const newCellValue = Math.random() < 0.9 ? 2 : 4;
  const newCells = map.cells.map((cell) => {
    if (cell.row === randRow && cell.col === randCol) {
      return { ...cell, value: newCellValue, isNew: true };
    }
    return cell;
  });

  return { ...map, cells: newCells };
};
