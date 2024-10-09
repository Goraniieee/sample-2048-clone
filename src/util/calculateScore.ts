import type { Map2048 } from '../types/2048';

export const calculateScoreIncrement = (map: Map2048): number => {
  return map.cells.reduce((acc, cell) => {
    return cell.value !== null && cell.isMerged ? acc + cell.value * 2 : acc;
  }, 0);
};
