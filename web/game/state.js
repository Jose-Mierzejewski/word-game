import {handleGuess, definitionFunc} from "./logic.js"

const state = {
  WORDS: [],
  streak: 0,
  best: 0,
  defsOpen: false,
  left: null,
  right: null,
  $defButton: null,
};

export async function prepareState(pathToWordsJson){
  state.left = document.getElementById("left-word-button");
  state.right = document.getElementById("right-word-button");
  state.left.$leftDef = document.getElementById("left-definition-section");
  state.right.$rightDef = document.getElementById("right-definition-section");
  state.$scoreboard = document.getElementById("score");
  state.left.$area = document.getElementById("left-word-area");
  state.right.$area = document.getElementById("right-word-area");
  
  state.left.addEventListener("click", () => handleGuess(state, state.left.wordObj, state.right.wordObj));
  state.right.addEventListener("click", () => handleGuess(state, state.right.wordObj, state.left.wordObj));
  state.definitionCache = new Map(); // word -> entry
  state.$defButton = document.getElementById("definition-button");
  state.$defButton.addEventListener("click", () => definitionFunc(state));

  state.WORDS = await loadWords(state, pathToWordsJson);
  state.left.wordObj = state.WORDS[0];
  state.right.wordObj = state.WORDS[0];
  return state;
}

async function loadWords(state, path) {
  const res = await fetch(path);
  console.log("Loaded words: ", state.WORDS.length);
  return await res.json();
}