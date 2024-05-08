const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bot = require('./bot');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

let gameState = { score: 0, grid: [] };

app.get('/game-state', (req, res) => {
  res.json(gameState);
});

app.post('/update-state', (req, res) => {
  const { score, grid } = req.body;
  gameState.score = score;
  gameState.grid = grid;
  res.json({ message: "State updated" });
});

bot.launch();

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
