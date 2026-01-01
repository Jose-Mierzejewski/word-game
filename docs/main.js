import { prepareStateElements, updateStateAbsolutes } from "./game/state.js";
import {initialSetup as initElementContent} from "./game/logic.js";

export const SERVERPATH = "https://word-freak.onrender.com";
// export const SERVERPATH = "http://localhost:3000"

let state;
let storedGameid = localStorage.getItem('gameid');


let response = await fetch(SERVERPATH + "/api/entergame", {
                          method: 'POST',
                          headers: {'Content-Type': 'application/json'},
                          body: JSON.stringify({gameid: storedGameid})
});

const data = await response.json();
const gameid = data.gameid;
localStorage.setItem('gameid', gameid);


state = await prepareStateElements();
state.gameid = gameid;

await updateStateAbsolutes(state);
await initElementContent(state);