import { state } from "./game/state.js";
import {handleGuess, setupState, definitionFunc} from "./game/logic.js";
import {loadWords} from "./game/data.js";

const pathToWordsJson = "/data/processed/word-freqs.json"

state.left = document.getElementById("left-word");
state.right = document.getElementById("right-word");
state.left.$leftDef = document.getElementById("left-definition-section");
state.right.$rightDef = document.getElementById("right-definition-section");

async function init(){
    state.WORDS = await loadWords(state, pathToWordsJson);
    state.left.wordObj = state.WORDS[0];
    state.right.wordObj = state.WORDS[0];
    setupState(state);
}

state.left.addEventListener("click", () => handleGuess(state, state.left.wordObj, state.right.wordObj));
state.right.addEventListener("click", () => handleGuess(state, state.right.wordObj, state.left.wordObj));
state.definitionCache = new Map(); // word -> entry

init();

// =========== EXTRA STUFF ============= // 
let $defButton = document.getElementById("definition-button");

function showDefinitions(leftWord, rightWord) {

}

function showDefinition(word) {
  const def = DEFINITIONS[word.toLowerCase()] ?? "Definition not available yet.";
  const box = document.getElementById("definitionBox");
  box.querySelector(".term").textContent = word;
  box.querySelector(".meaning").textContent = def;
  box.hidden = false;
}

$defButton.addEventListener("click", () => definitionFunc(state));