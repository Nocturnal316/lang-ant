import { useEffect, useRef, useState } from 'react';
import GridCanvas from './components/GridCanvas';
import Controls from './components/Controls';
import type { Grid, ClientMessage, ServerMessage } from './types';

const WS_URL = 'ws://localhost:8080';

function App() {
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
    ws.onerror = (err) => console.error('WebSocket error:', err);

    ws.onmessage = (msg) => {
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
    <div style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      <h1>Langton's Ant Multiplayer</h1>
      <p>Your Color: <span style={{ color }}>{color}</span></p>
      <GridCanvas
        grid={grid}
        clientId={clientId}
        color={color}
        onCellClick={handleFlipTile}
        onPlaceAnt={handlePlaceAnt}
      />
      <Controls rules={rules} onRulesChange={handleRulesChange} />
    </div>
  );
}

export default App;
