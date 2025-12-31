const express = require("express");
const cors = require('cors');
const fs = require("node:fs");
const path = require("node:path");

const app = express();
const PORT = process.env.PORT || 3000;

const WORDS_PATH = "../data/word-freqs.json"
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
  console.log(`Server listening (port ${PORT})`);
});