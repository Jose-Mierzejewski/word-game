import { prepareStateElements, updateStateAbsolutes } from "./game/state.js";
import {initialSetup as initElementContent} from "./game/logic.js";

export const SERVERPATH = "https://word-freak.onrender.com";
// export const SERVERPATH = "http://localhost:3000"

let state;
let gameid;
let data;

if (localStorage.getItem('gameid')){
  gameid = localStorage.getItem('gameid');
} else {
  let response = await fetch(SERVERPATH + "/api/newgame", {
                              method: 'POST'});
  data = await response.json();
  gameid = data.gameid;
  localStorage.setItem('gameid', gameid);
}

state = await prepareStateElements();
state.gameid = gameid;

await updateStateAbsolutes(state);
await initElementContent(state);