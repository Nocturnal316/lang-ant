#  Langton’s Ant Multiplayer

##  **Description**

**Problem**  
Langton’s Ant is a 2D cellular automaton where an "ant" moves on a grid according to simple rules:

- At a **white** square: turn **right**, flip the square to **black**, move forward.
- At a **black** square: turn **left**, flip the square to **white**, move forward.

This project extends that concept to a **multiplayer web application**:

- Multiple players each control **their own ant**.
- Each player defines **their own turning rules**.
- Players **claim tiles in their unique color**.
- The grid is **shared and synchronized** in real time across clients.

**Our Solution**  
- A **React + TypeScript** frontend with live canvas rendering.
- A **Node.js + ws** WebSocket server synchronizing grid state and player actions.
- Ants move automatically every 250 ms, applying player-defined rules independently on a shared grid.
- Manual controls let players claim and clear their own tiles.

---


#### 1️⃣ Clone the repo
```bash
git clone https://github.com/yourusername/langtons-ant-multiplayer.git
cd langtons-ant-multiplayer
```

## 🛠️ **Instructions**

# For the frontend

create a .env file with the following

VITE_CELL_SIZE=5
VITE_CANVAS_SIZE=500

```bash
cd react-app-lang-ant
npm install
npm run dev
```

# For the server

```bash
cd backend
npm install
npm run dev
```


Ant Rule Evaluation:
Each ant evaluates only the tile it is currently on. It does not consider adjacent tiles when deciding its turn. 
This ensures that each move follows the classic Langton’s Ant rules, even in multiplayer with independently defined color flips.