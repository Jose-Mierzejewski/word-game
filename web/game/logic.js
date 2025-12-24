
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

