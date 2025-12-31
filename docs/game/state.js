import {handleGuess, definitionFunc} from "./logic.js"

const state = {
  WORDS: [],
  streak: 0,
  best: 0,
  defsOpen: false,
  left: null,
  right: null,
  $defButton: null,
  gameid: null
};

export async function prepareState(){
  state.left = document.getElementById("left-word-button");
  state.right = document.getElementById("right-word-button");
  state.left.$leftDef = document.getElementById("left-definition-section");
  state.right.$rightDef = document.getElementById("right-definition-section");
  state.$scoreboard = document.getElementById("score");
  state.left.$area = document.getElementById("left-word-area");
  state.right.$area = document.getElementById("right-word-area");
  
  state.left.addEventListener("click", () => handleGuess(state, state.left.word, state.right.word));
  state.right.addEventListener("click", () => handleGuess(state, state.right.word, state.left.word));
  state.definitionCache = new Map(); // word -> entry
  state.$defButton = document.getElementById("definition-button");
  state.$defButton.addEventListener("click", () => definitionFunc(state));
  
  state.gameid = '0001';
  return state;
}