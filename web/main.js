import { state } from "./game/state.js";
import {handleGuess, setupState} from "./game/logic.js";
import {loadWords} from "./game/data.js";

const pathToWordsJson = "/data/processed/word-freqs.json"

state.left = document.getElementById("left-word");
state.right = document.getElementById("right-word");


async function init(){
    state.WORDS = await loadWords(state, pathToWordsJson);
    state.left.wordObj = state.WORDS[0];
    state.right.wordObj = state.WORDS[0];
    setupState(state);
}

state.left.addEventListener("click", () => handleGuess(state, state.left.wordObj, state.right.wordObj));
state.right.addEventListener("click", () => handleGuess(state, state.right.wordObj, state.left.wordObj));

init();

// =========== EXTRA STUFF ============= // 



let $defButton = document.getElementById("definition-button");
// $defButton.addEventListener("click", () => showDefinitions(state.left.wordObj.text, state.right.wordObj.text));

function showDefinitions(leftWord, rightWord) {

}

const $leftDef = document.getElementById("left-definition-section");
const $rightDef = document.getElementById("right-definition-section");

function showDefinition(word) {
  const def = DEFINITIONS[word.toLowerCase()] ?? "Definition not available yet.";
  const box = document.getElementById("definitionBox");
  box.querySelector(".term").textContent = word;
  box.querySelector(".meaning").textContent = def;
  box.hidden = false;
}

// Cache to avoid re-fetching definitions constantly
const definitionCache = new Map(); // word -> entry


$defButton.addEventListener("click", () => definitionFunc(state));
  
//   "click", async (e) => {
//   e.preventDefault();

//   state.defsOpen = !state.defsOpen;

//   // Toggle open/close animation
//   $leftDef.classList.toggle("is-open", state.defsOpen);
//   $rightDef.classList.toggle("is-open", state.defsOpen);

//   if (!state.defsOpen) return;

//   // If opening: load + render both
//   await Promise.all([
//     loadAndRenderDefinition(state.left.wordObj.text, $leftDef),
//     loadAndRenderDefinition(state.right.wordObj.text, $rightDef),
//   ]);
// });


async function definitionFunc(state){
  state.defsOpen = !state.defsOpen;

    // Toggle open/close animation
    $leftDef.classList.toggle("is-open", state.defsOpen);
    $rightDef.classList.toggle("is-open", state.defsOpen);

    if (!state.defsOpen) return;

    // If opening: load + render both
    await Promise.all([
      loadAndRenderDefinition(state.left.wordObj.text, $leftDef),
      loadAndRenderDefinition(state.right.wordObj.text, $rightDef),
    ]);
}

async function loadAndRenderDefinition(word, container) {
  container.innerHTML = `<div style="opacity:.8;">Loading…</div>`;

  let entry = definitionCache.get(word.toLowerCase());
  if (!entry) {
    entry = await fetchDefinitions(word);
    definitionCache.set(word.toLowerCase(), entry);
  }

  renderDefinitionEntry(entry, container);
}

function renderDefinitionEntry(meanings, container) {
  if (meanings.length === 0) {
    container.innerHTML = `<div style="opacity:.8;">No definitions found.</div>`;
    return;
  }

  // default meaning index 0
  let idx = 0;

  // Build tabs
  const tabs = document.createElement("div");
  tabs.className = "pos-tabs";

  const scroll = document.createElement("div");
  scroll.className = "def-scroll";

  function renderMeaning(i) {
    idx = i;
    // update tabs selected state
    [...tabs.children].forEach((btn, j) => btn.setAttribute("aria-selected", String(j === idx)));

    const m = meanings[idx];
    const defs = m.definitions ?? [];

    const list = document.createElement("ol");
    defs.forEach((d) => {
      const li = document.createElement("li");
      li.textContent = d.definition ?? "(missing definition)";
      list.appendChild(li);
    });

    scroll.innerHTML = "";
    scroll.appendChild(list);
  }

  meanings.forEach((m, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "pos-tab";
    btn.textContent = m.partOfSpeech ?? `Meaning ${i + 1}`;
    btn.setAttribute("aria-selected", String(i === 0));
    btn.addEventListener("click", () => renderMeaning(i));
    tabs.appendChild(btn);
  });

  // initial render
  renderMeaning(0);

  container.innerHTML = "";
  container.appendChild(tabs);
  container.appendChild(scroll);
}

async function fetchDefinitions(word) {
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    const data = await response.json();
    return data[0].meanings;
  } catch (error) {
    console.error('Error fetching definition:', error);
  }
}
