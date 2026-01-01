import {handleGuess, definitionFunc} from "./logic.js"
import { SERVERPATH } from "../main.js";

const state = {
  streak: 0,
  best: 0,
  defsOpen: false,
  left: null,
  right: null,
  $defButton: null,
  gameid: null
};

export async function prepareStateElements(){
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
  
  return state;
}

export async function updateStateAbsolutes(state){
  const response = await getServerState(state);
  const data = await response.json();
  state.streak = data.streak;
  state.best = data.best;
  state.left.word = data.left;
  state.right.word = data.right;
}

async function getServerState(state){
  return await fetch(SERVERPATH + `/api/state?gameid=${state.gameid}`);
}
