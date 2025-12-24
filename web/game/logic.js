
export function handleGuess(state, guess, other){
  if (guess.freq >= other.freq){
        correctGuess(state);
      } else {
        incorrectGuess(state);
      }
  document.getElementById("streak").innerText = state.streak;
  document.getElementById("best").innerText = state.best;

  setupState(state);
}

export async function setupState(state){
  state.left.wordObj = pickRandomWord(state);
  state.right.wordObj = pickRandomWord(state);
  renderButtons(state);
  if (state.defsOpen){
    definitionFunc(state);
  }
}

function renderButtons(state){
  state.left.innerText = state.left.wordObj.text;
  state.right.innerText = state.right.wordObj.text;
}

function pickRandomWord(state) {
  let w; 
  do {
    w = state.WORDS[Math.floor(Math.random() * state.WORDS.length)];
  } while (w.text === state.left.wordObj.text 
            || w.text === state.right.wordObj.text);
  return w;
}

export async function getMeanings(word) {
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    const data = await response.json();
    return data[0].meanings;
  } catch (error) {
    console.error('Error fetching definition:', error);
  }
}

function correctGuess(state){
  console.log("Correct");
  state.streak++;
  if (state.best < state.streak){
    state.best = state.streak;
  }
}

function incorrectGuess(state){
  console.log("Incorrect");
  state.streak = 0;
}


export async function definitionFunc(state){
  state.defsOpen = !state.defsOpen;

    // Toggle open/close animation
    state.left.$leftDef.classList.toggle("is-open", state.defsOpen);
    state.right.$rightDef.classList.toggle("is-open", state.defsOpen);

    if (!state.defsOpen) return;

    // If opening: load + render both
    await Promise.all([
      loadAndRenderDefinition(state, state.left.wordObj.text, state.left.$leftDef),
      loadAndRenderDefinition(state, state.right.wordObj.text, state.right.$rightDef),
    ]);
}

async function loadAndRenderDefinition(state, word, container) {
  container.innerHTML = `<div style="opacity:.8;">Loading…</div>`;

  let entry = state.definitionCache.get(word.toLowerCase());
  if (!entry) {
    entry = await fetchDefinitions(word);
    state.definitionCache.set(word.toLowerCase(), entry);
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
