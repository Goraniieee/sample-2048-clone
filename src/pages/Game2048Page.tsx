import { useCallback, useEffect } from 'react';

import Game2048Board from '../components/Game2048Board';
import { useGame2048 } from '../hooks/useGame2048';

const Game2048Page = () => {
  const { map, score, status, canUndo, playNext, reset, undo } = useGame2048(
    4,
    4,
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          playNext('up');
          break;
        case 'ArrowDown':
          playNext('down');
          break;
        case 'ArrowLeft':
          playNext('left');
          break;
        case 'ArrowRight':
          playNext('right');
          break;
        case 'Delete':
          undo();
          break;
        default:
          break;
      }
    },
    [playNext, undo],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-5 bg-brown-50">
      <div className="m-4 w-64 text-center text-6xl font-bold text-brown-900">
        2048
      </div>
      <div className="flex flex-row items-center justify-center gap-2">
        <div className="h-14 w-20 rounded-lg border-2 border-brown-200 p-2">
          <div className="text-center text-xs font-medium text-brown-900">
            SCORE
          </div>
          <div className="text-center text-sm text-brown-900">{score}</div>
        </div>
        <div
          className={`flex h-14 w-20 items-center justify-center rounded-lg border-2 border-brown-200 ${
            canUndo ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
          }`}
          onClick={() => {
            if (canUndo) undo();
          }}
        >
          <p className="text-center text-sm font-medium text-brown-900">Undo</p>
        </div>
        <div
          className="flex h-14 w-20 items-center justify-center rounded-lg border-2 border-brown-200"
          onClick={reset}
        >
          <p className="cursor-pointer text-center text-sm font-medium text-brown-900">
            Reset
          </p>
        </div>
      </div>

      <div className="relative">
        <div
          className={`${status === 'playing' ? '' : 'opacity-20'} flex justify-center`}
        >
          <Game2048Board map={map} />
        </div>

        {status !== 'playing' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-brown-900">
              {status === 'won' ? 'Game Clear!' : 'Game Over'}
            </div>
            <div
              className="mt-4 cursor-pointer rounded-lg bg-brown-600 px-4 py-2 text-center text-white hover:bg-brown-700"
              onClick={reset}
            >
              New Game
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Game2048Page;
