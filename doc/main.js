import { prepareState } from "./game/state.js";
import {initialSetup} from "./game/logic.js";

const pathToWordsJson = "/data/processed/word-freqs.json"
let state;

state = await prepareState(pathToWordsJson);
await initialSetup(state);