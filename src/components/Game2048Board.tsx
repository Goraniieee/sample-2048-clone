import type { Cell, Map2048 } from '../types/2048';

const Game2048Board = ({ map }: { map: Map2048 }) => {
  return (
    <div className="relative z-0 h-[22.5rem] w-[22.5rem] rounded-lg bg-brown-900 p-2 shadow-lg">
      {map.cells.map((cell) => (
        <div
          key={cell.id}
          className={`absolute flex h-20 w-20 items-center justify-center rounded-lg ${getCellStyle(cell.value)} ${getAnimationClass(cell)}`}
          style={{
            transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
            transform: getCellPosition(cell),
            zIndex: getZIndex(cell.value),
          }}
        >
          {cell.value}
        </div>
      ))}
    </div>
  );
};

const cellSize = 5;
const gap = 0.5;

const getCellPosition = (cell: Cell) => {
  const x = cell.col * (cellSize + gap);
  const y = cell.row * (cellSize + gap);
  return `translate(${x}rem, ${y}rem)`;
};

const getZIndex = (value: number | null) => {
  if (value === null) return '0';
  return 30 - Math.log2(value);
};

const getCellStyle = (cell: number | null) => {
  switch (cell) {
    case 2:
      return 'bg-brown-50 text-brown-900 text-semibold text-3xl';
    case 4:
      return 'bg-brown-100 text-brown-900 text-semibold text-3xl';
    case 8:
      return 'bg-brown-200 text-brown-900 text-semibold text-3xl';
    case 16:
      return 'bg-brown-300 text-brown-900 text-semibold text-3xl';
    case 32:
      return 'bg-brown-400 text-brown-900 text-semibold text-3xl';
    case 64:
      return 'bg-brown-500 text-brown-900 text-semibold text-3xl';
    case 128:
      return 'bg-brown-600 text-brown-900 text-semibold text-3xl';
    default:
      return 'bg-brown-700 text-transparent';
  }
};

const getAnimationClass = (cell: Cell) => {
  if (cell.isNew) {
    return 'animate-pop';
  } else if (cell.isMerged) {
    return 'animate-disappear';
  } else {
    return 'animate-move';
  }
};

export default Game2048Board;
