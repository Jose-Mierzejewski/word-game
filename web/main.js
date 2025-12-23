const pathToWordsJson = "/data/processed/word-freqs.json"
let WORDS = [];

async function loadWords() {
  const res = await fetch(pathToWordsJson);
  WORDS = await res.json();
  console.log("Loaded words: ", WORDS.length);
}

const $btn1 = document.getElementById("left-word");
const $btn2 = document.getElementById("right-word");
const scoreSection = document.getElementById("score");

let streak = 0;
let best = 0;

function pickRandomWord(excludedWord = null) {
  let w; 
  do {
    w = WORDS[Math.floor(Math.random() * WORDS.length)];
  } while (excludedWord && w.text === excludedWord.text);
  return w;
}

function render(wordOne, wordTwo){
  $btn1.innerText = wordOne;
  $btn2.innerText = wordTwo;
}

function handleGuess(guess, other){
  if (guess.freq > other.freq){
        correctGuess();
      } else {
        incorrectGuess();
      }
  document.getElementById("streak").innerText = streak;
  document.getElementById("best").innerText = best;

  setup();
}

function correctGuess(){
  console.log("Correct");
  streak++;
  if (best < streak){
    best = streak;
  }
}

function incorrectGuess(){
  console.log("Incorrect");
  streak = 0;
}

async function init(){
    await loadWords();
    setup();
  }

async function setup(){
  w1 = pickRandomWord();
  w2 = pickRandomWord(w1);
  render(w1.text, w2.text)
}

async function getMeanings(word) {
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    const data = await response.json();
    return data[0].meanings;
  } catch (error) {
    console.error('Error fetching definition:', error);
  }
}

function showDefinitions(leftWord, rightWord){
  
}
let w1;
let w2;

$btn1.addEventListener("click", () => handleGuess(w1, w2));
$btn2.addEventListener("click", () => handleGuess(w2, w1));

let $defineButton = document.getElementById("definition-button");
$defineButton.addEventListener("click", () => showDefinitions(w1, w2));

init();
