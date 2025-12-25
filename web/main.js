import { prepareState } from "./game/state.js";
import {initialSetup} from "./game/logic.js";

const pathToWordsJson = "/data/processed/word-freqs.json"
let state;

state = await prepareState(pathToWordsJson);
await initialSetup(state);


// =========== DEFINITIONS LOGIC ============= // 

function showDefinition(word) {
  const def = DEFINITIONS[word.toLowerCase()] ?? "Definition not available yet.";
  const box = document.getElementById("definitionBox");
  box.querySelector(".term").textContent = word;
  box.querySelector(".meaning").textContent = def;
  box.hidden = false;
}

// === animation right ot left logic =====

