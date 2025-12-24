export async function loadWords(state, path) {
  const res = await fetch(path);
  console.log("Loaded words: ", state.WORDS.length);
  return await res.json();
}