const express = require("express");
const cors = require('cors');
const fs = require("node:fs");
const path = require("node:path");

const app = express();
const PORT = process.env.PORT || 3000;

const WORDS_PATH = "../data/word-freqs.json"
app.use(cors());
app.use(express.json());

// Load words and dictionary
const wordsList = JSON.parse(fs.readFileSync(WORDS_PATH, "utf8"));
let wordsDict = {};
for (let wordObj of wordsList){
  wordsDict[wordObj.text] = wordObj.freq;
}

// Initialize current games dictionary
let games = {};

function pickRandomWordObj(){
  return wordsList[Math.floor(Math.random() * wordsList.length)];
}

app.post("/api/word", (req, res) => {
  const {gameid} = req.body;
  const game = games[gameid];

  let w = pickRandomWordObj();
  let word = w.text;

  game.left = game.right;
  game.right = word;

  console.log(`Updated Game state: ${JSON.stringify(games[gameid])}`);
  res.send(word);
});

app.get("/", (req, res) => {
  res.send("OK");
})

app.listen(PORT, () => {
  console.log(`Server listening (port ${PORT})`);
});

app.post("/api/guess", (req, res) => {
  const {gameid, guess} = req.body;
  const game = games[gameid];

  let isCorrectGuess = scoreGuess(game, guess);
  updateScore(game, isCorrectGuess);
  res.json(isCorrectGuess);
});
function scoreGuess(game, guess){
  const guessFreq = wordsDict[guess];
  const leftFreq = wordsDict[game.left];
  const rightFreq = wordsDict[game.right];
  return (guessFreq >= leftFreq && guessFreq >= rightFreq);
}
function updateScore(game, isCorrectGuess){
    if (isCorrectGuess){
    game.streak += 1;
    game.best = Math.max(game.best, game.streak);
  } else {
    game.streak = 0;
  }
}

app.get("/api/state", (req, res) => {
  const gameid = req.query.gameid;
  const game = games[gameid];
  console.log(`State: ${gameid}, ${JSON.stringify(game)}`);
  res.json(game)
});

app.post("/api/entergame", (req, res) => {
  let {gameid} = req.body;
  let game;

  if (gameid === undefined || !(gameid in games)){
    //NEW GAME
    gameid = Math.random().toString(36).substring(2, 10); 
    game = { gameid: gameid, best: 0, streak: 0, left: pickRandomWordObj().text, right: pickRandomWordObj().text}
    games[gameid] = game; 
    console.log(`New Game: ${JSON.stringify(game)}`);
  } else {
    game = games[gameid];
    console.log(`Returning to game: ${JSON.stringify(game)}`)
  }
  res.json(game);
});