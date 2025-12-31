import { prepareState } from "./game/state.js";
import {initialSetup} from "./game/logic.js";

let state;

state = await prepareState();
await initialSetup(state);