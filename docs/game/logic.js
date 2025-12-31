const SERVERPATH = "https://word-freak.onrender.com";
// const SERVERPATH = "http://localhost:3000"

export async function initialSetup(state){
  await resetButton(state, state.left);
  await resetButton(state, state.right);
}

async function resetButton(state, button){
  return pickRandomWord(state).then(word => {
    setButton(button, word);
  });
}
function pickRandomWord(state) {
  return fetch(SERVERPATH + "/api/word", {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({gameid: state.gameid})
  })
    .then(response => {return response.text()});
}

function setButton(button, word){
  button.word = word;
  button.innerText = word;
}

export async function handleGuess(state, guess, other){
  await declareAnimating(state);
  await closeDefs(state);

  await fetch(SERVERPATH + "/api/guess", {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json' },
                    body: JSON.stringify({ gameid: state.gameid, guess: guess})
  });

  await updateState(state);
  updateScoreboard(state);

  await animateRightOntoLeftElement(state, state.right.$area, state.left.$area);

  declareNotAnimating(state);
}


function updateScoreboard(state){
  let $scoreboard = state.$scoreboard;
  let $streak = $scoreboard.querySelector("#streak");
  let $best = $scoreboard.querySelector("#best");
  
  $streak.classList.remove("loss_pop", "gain_pop", "score_shake")
  void $streak.offsetWidth; 
  if (state.streak === 0) {
    $streak.classList.add("loss_pop", "score_shake")
  } else{
    $streak.classList.add("gain_pop")
  }

  $streak.querySelector("#streak-num").innerText = state.streak;
  $best.querySelector("#best-num").innerText = state.best;
}

async function updateState(state){
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

export async function definitionFunc(state){
  state.defsOpen = !state.defsOpen;

    // Toggle open/close animation
    state.left.$leftDef.classList.toggle("is-open", state.defsOpen);
    state.right.$rightDef.classList.toggle("is-open", state.defsOpen);

    if (!state.defsOpen) return;

    await Promise.all([
      loadAndRenderDefinition(state, state.left.word, state.left.$leftDef),
      loadAndRenderDefinition(state, state.right.word, state.right.$rightDef),
    ]);
}
async function closeDefs(state){
  if (state.defsOpen){
    state.left.$leftDef.classList.remove("is-open");
    state.right.$rightDef.classList.remove("is-open");  
    
    state.defsOpen = !state.defsOpen;
  }
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

async function animateRightOntoLeftElement(state, rightElement, leftElement){
  const left = leftElement.getBoundingClientRect();
  const right = rightElement.getBoundingClientRect();
  
  // LAST
  const deltaX = left.left - right.left;
  const deltaY = left.top - right.top;

  // Animate right button onto left button
  await rightElement.animate([
      {offset: 0, transform: `translateX(0px)`, opacity: 1},
      {offset: 1, transform: `translate(${deltaX}px, ${deltaY}px)`}
    ], {
      duration: 1200,
      iterations: 1,
      easing: 'ease-in-out'
    }).finished;  
  
  setLeftAsRight(state);

  rightElement.style.opacity = 0;

  await resetButton(state, state.right);

  await new Promise(requestAnimationFrame);
  

    // Animate new button fade-in
  await rightElement.animate([
    {offset: 0, opacity: 0},
    {offset: 1, opacity: 1}
    ], {
      duration: 500,
      iterations: 1,
  }).finished;
  rightElement.style.opacity = 1;
}

function setLeftAsRight(state){
  setButton(state.left, state.right.word);
}

async function declareAnimating(state){
  state.right.$area.classList.add("animating");
  state.left.$area.classList.add("animating");
  state.$defButton.classList.add("animating");
}

async function declareNotAnimating(state){
  state.right.$area.classList.remove("animating");
  state.left.$area.classList.remove("animating");
  state.$defButton.classList.remove("animating");
}
