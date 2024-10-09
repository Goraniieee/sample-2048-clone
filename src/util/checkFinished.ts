import type { Direction, Map2048 } from '../types/2048';
import { moveMap } from './moveMap';

export const isClear = (map: Map2048): boolean => {
  return map.cells.some((cell) => cell.value === 128);
};

export const isGameOver = (map: Map2048): boolean => {
  const directions: Direction[] = ['up', 'down', 'left', 'right'];

  return !directions.some((direction) => {
    const { isMoved } = moveMap(map, direction);
    return isMoved;
  });
};
