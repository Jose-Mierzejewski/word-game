const express = require("express");
const cors = require('cors');
const fs = require("node:fs");
const path = require("node:path");

const app = express();


const WORDS_PATH = "../data/word-freqs.json"
const PORT = 3000;
app.use(cors());

// Load words
const words = JSON.parse(fs.readFileSync(WORDS_PATH, "utf8"));

app.get("/api/wordObj", (req, res) => {
  let w = words[Math.floor(Math.random() * words.length)];
  console.log(`Retreived word: ${JSON.stringify(w)}`);
  res.json(w);
});

app.get("/", (req, res) => {
  res.send("OK");
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});