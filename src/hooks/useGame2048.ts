import { useCallback, useEffect, useState } from 'react';

import type { Direction, GameState, GameStatus, History } from '../types/2048';
import { addOneRandomBlock } from '../util/addRandomBlock';
import { calculateScoreIncrement } from '../util/calculateScore';
import { isClear, isGameOver } from '../util/checkFinished';
import { initializeMap } from '../util/initializeMap';
import { moveMap } from '../util/moveMap';

export const useGame2048 = (N: number, M: number) => {
  const [gameState, setGameState] = useState({
    row: N,
    col: M,
    history: [] as History[],
  });

  const score = gameState.history.at(-1)?.score ?? 0;
  const map = gameState.history.at(-1)?.map ?? initializeMap(N, M);
  const status = gameState.history.at(-1)?.status ?? 'playing';
  const canUndo = gameState.history.length > 1;

  const reset = useCallback(() => {
    const newMap = initializeMap(N, M);
    const startMap = addOneRandomBlock(addOneRandomBlock(newMap));
    const newState = {
      row: N,
      col: M,
      history: [{ map: startMap, score: 0, status: 'playing' }],
    };
    localStorage.setItem('gameState', JSON.stringify(newState));
    setGameState(newState as GameState);
  }, [N, M]);

  useEffect(() => {
    const savedGame = localStorage.getItem('gameState');
    let initialized = false;
    if (savedGame != null) {
      const { row, col, history } = JSON.parse(savedGame) as GameState;
      if (row === N && col === M && history.length > 0) {
        setGameState({ row, col, history });
        initialized = true;
      }
    }
    if (!initialized) {
      reset();
    }
  }, [M, N, reset]);

  const undo = useCallback(() => {
    if (canUndo) {
      setGameState((prevState) => {
        const newHistory = prevState.history.slice(0, -1);
        const newState = {
          ...prevState,
          history: newHistory,
        };
        localStorage.setItem('gameState', JSON.stringify(newState));
        return newState;
      });
    }
  }, [canUndo]);

  const playNext = useCallback((direction: Direction) => {
    setGameState((prevState) => {
      const prevMap = prevState.history.at(-1)?.map;
      const prevScore = prevState.history.at(-1)?.score;
      const prevStatus = prevState.history.at(-1)?.status;
      if (prevMap == null || prevScore == null || prevStatus == null)
        return prevState;
      if (prevStatus !== 'playing') return prevState;

      const { result: movedMap, isMoved } = moveMap(prevMap, direction);

      if (isMoved) {
        const nextMap = addOneRandomBlock(movedMap);
        const newScore = prevScore + calculateScoreIncrement(movedMap);
        const nextStatus = isClear(nextMap)
          ? 'won'
          : isGameOver(nextMap)
            ? 'over'
            : ('playing' as GameStatus);
        const newState = {
          ...prevState,
          history: [
            ...prevState.history,
            {
              map: nextMap,
              score: newScore,
              status: nextStatus,
              direction: direction,
            },
          ],
        };
        localStorage.setItem('gameState', JSON.stringify(newState));
        return newState;
      } else {
        return prevState;
      }
    });
  }, []);

  return {
    map,
    score,
    status,
    canUndo,
    playNext,
    reset,
    undo,
  };
};
