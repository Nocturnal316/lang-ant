import { WebSocketServer } from "ws";
import crypto from "crypto";

const PORT = 8080;
const TICK_INTERVAL = 250;

const wss = new WebSocketServer({ port: PORT });
console.log(`WebSocket server running on ws://localhost:${PORT}`);

const GRID = {};
const ANTS = {};
/**
 * Generates a random hex color string.
 * @returns   A random hex color string
 */
function randomColor() {
  return `#${Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, "0")}`;
}

/**
 *  Broadcasts a message to all connected WebSocket clients.
 *  This is used to send updates about the game state.
 * @param {*} message
 */
function broadcast(message) {
  const data = JSON.stringify(message);
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(data);
    }
  });
}

/**
 * Steps the simulation forward by one tick.
 * This function updates the positions of ants,
 * changes the colors of the grid cells based on the ants' rules,
 * and broadcasts the updated grid state to all clients.
 */
function stepSimulation() {
  for (const [clientId, ant] of Object.entries(ANTS)) {
    const key = `${ant.x},${ant.y}`;
    const cell = GRID[key];
    const ownerColor = cell?.ownerId === clientId ? cell.color : "white";
    const ruleValue = ant.rules?.[ownerColor];
    const turn = ruleValue === undefined ? "R" : ruleValue;

    if (turn === "R") ant.dir = (ant.dir + 1) % 4;
    else if (turn === "L") ant.dir = (ant.dir + 3) % 4;

    if (ownerColor === "white") {
      GRID[key] = { color: ant.color, ownerId: clientId };
    } else if (cell?.ownerId === clientId) {
      delete GRID[key];
    }

    if (ant.dir === 0) ant.y -= 1;
    else if (ant.dir === 1) ant.x += 1;
    else if (ant.dir === 2) ant.y += 1;
    else if (ant.dir === 3) ant.x -= 1;
  }

  broadcast({ type: "update", grid: GRID });
}

setInterval(stepSimulation, TICK_INTERVAL);

wss.on("connection", (ws) => {
  const clientId = crypto.randomUUID();
  const color = randomColor();

  console.log(`Client connected: ${clientId} (${color})`);

  ws.send(JSON.stringify({ type: "welcome", clientId, color }));

  ws.on("message", (msg) => {
    try {
      const { type, payload } = JSON.parse(msg);

      if (type === "placeAnt") {
        ANTS[clientId] = { ...payload, color, dir: 0 };
      }

      if (type === "flipTile") {
        const key = `${payload.x},${payload.y}`;
        const cell = GRID[key];

        if (!cell) {
          // It's white → player can claim it
          GRID[key] = { color, ownerId: clientId };
        } else if (cell.ownerId === clientId) {
          // It's theirs → they can remove it
          delete GRID[key];
        }
      }
      // Handle setting rules for the ant
      // Make sure set only by correct client id
      if (type === "setRules") {
        if (ANTS[clientId]) {
          ANTS[clientId].rules = payload;
        } else {
          ANTS[clientId] = { x: 50, y: 50, dir: 0, color, rules: payload };
        }
      }
    } catch (err) {
      console.error("Error parsing message:", err);
    }
  });

  ws.on("close", () => {
    console.log(`Client disconnected: ${clientId}`);
    delete ANTS[clientId];
  });
});
wss.on("error", (err) => {
  console.error("WebSocket error:", err);
});
