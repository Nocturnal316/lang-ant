import React, { useRef, useEffect } from 'react';
import type { Grid } from '../types';

type Props = {
  grid: Grid;
  clientId: string | null;
  color: string;
  onCellClick: (x: number, y: number) => void;
  onPlaceAnt: (x: number, y: number) => void;
};

const CELL_SIZE = Number(import.meta.env.VITE_CELL_SIZE) || 5;
const CANVAS_SIZE = Number(import.meta.env.VITE_CANVAS_SIZE) || 500;

console.log('CELL_SIZE:', CELL_SIZE);
console.log('CANVAS_SIZE:', CANVAS_SIZE);

export default function GridCanvas({ grid, clientId, color, onCellClick, onPlaceAnt }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    Object.entries(grid).forEach(([key, value]) => {
      const [x, y] = key.split(',').map(Number);
      ctx.fillStyle = value.ownerId === clientId ? value.color : '#000000';
      ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    });
  }, [grid, clientId]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = Math.floor((e.clientX - rect.left) / CELL_SIZE);
    const y = Math.floor((e.clientY - rect.top) / CELL_SIZE);

    if (e.shiftKey) {
      onPlaceAnt(x, y);
    } else {
      onCellClick(x, y);
    }
  };

  return (
    <div>
      <p>Click to flip your tile. Shift+Click to place ant.</p>
      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        style={{ border: '1px solid black' }}
        onClick={handleClick}
      />
    </div>
  );
}
