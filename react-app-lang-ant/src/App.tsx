import { useEffect, useRef, useState } from 'react';
import GridCanvas from './components/GridCanvas';
import Controls from './components/Controls';
import type { Grid, ClientMessage, ServerMessage } from './types';

const WS_URL = 'ws://localhost:8080';

export default function App() {
  const [clientId, setClientId] = useState<string | null>(null);
  const [color, setColor] = useState<string>('#000000');
  const [grid, setGrid] = useState<Grid>({});
  const [rules, setRules] = useState<Record<string, 'L' | 'R'>>({});
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => console.log('WebSocket connected');
    ws.onclose = () => console.log('WebSocket closed');
    ws.onerror = err => console.error('WebSocket error:', err);

    ws.onmessage = msg => {
      const data: ServerMessage = JSON.parse(msg.data);
      if (data.type === 'welcome') {
        setClientId(data.clientId);
        setColor(data.color);
      } else if (data.type === 'update') {
        setGrid(data.grid);
      }
    };

    return () => ws.close();
  }, []);

  const send = (message: ClientMessage) => {
    wsRef.current?.send(JSON.stringify(message));
  };

  const handlePlaceAnt = (x: number, y: number) => {
    send({ type: 'placeAnt', payload: { x, y, rules } });
  };

  const handleFlipTile = (x: number, y: number) => {
    send({ type: 'flipTile', payload: { x, y } });
  };

  const handleRulesChange = (newRules: Record<string, 'L' | 'R'>) => {
    setRules(newRules);
    send({ type: 'setRules', payload: newRules });
  };

  return (
    <div className="min-h-screen  w-screen flex items-center justify-center bg-gray-900 text-gray-100 px-4 font-sans">
      <div className="mx-auto w-full max-w-2xl bg-gray-800 rounded-xl shadow-2xl border border-gray-700 overflow-hidden">
        
        {/* HEADER */}
        <header className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white text-center p-5 rounded-t-xl">
          <h1 className="text-4xl font-bold tracking-tight">Langton's Ant Multiplayer</h1>
          <p className="text-sm opacity-80 mt-1">Click to flip. Shift+Click to place your ant.</p>
        </header>

        {/* MAIN CONTENT */}
        <main className="p-6 space-y-6">

          {/* COLOR BADGE */}
          <section className="flex items-center justify-between rounded-lg border border-gray-700 bg-gray-700 p-4 shadow">
            <span className="text-lg font-semibold text-gray-100">Your Color:</span>
            <span
              className="w-10 h-10 rounded-full border shadow-inner ring-2 ring-gray-500"
              style={{ backgroundColor: color }}
              title={color}
            />
          </section>

          {/* GRID CANVAS */}
          <section className="rounded-lg border border-gray-700 bg-gray-700 p-4 shadow overflow-x-auto">
            <div className="min-w-[300px] max-w-full mx-auto">
              <GridCanvas
                grid={grid}
                clientId={clientId}
                color={color}
                onCellClick={handleFlipTile}
                onPlaceAnt={handlePlaceAnt}
              />
            </div>
          </section>

          {/* CONTROLS */}
          <section className="rounded-lg border border-gray-700 bg-gray-700 p-4 shadow">
            <Controls 
            rules={rules} onRulesChange={handleRulesChange} 
            assignedColor={color}/>
          </section>
        </main>
      </div>
    </div>
  );
}
