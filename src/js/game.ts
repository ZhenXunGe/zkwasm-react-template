import { DEFAULT_IMPORT, ZKCWasmService } from "zkc-sdk";
import { WasmInstance } from "../types/game";

export const JUB_IMPORT = {
  babyjubjub_sum_new: () => {
    console.error("baby_jubjub_sum_new");
    throw new Error("Unsupported wasm api: wasm_input");
  },
  babyjubjub_sum_push: () => {
    console.error("baby_jubjub_sum_new");
    throw new Error("Unsupported wasm api: wasm_input");
  },
  babyjubjub_sum_finalize: () => {
    console.error("baby_jubjub_sum_new");
    throw new Error("Unsupported wasm api: wasm_input");
  },
};

export const wasmURL = new URL("./gameplay.wasm", import.meta.url);

export const GAME_PLAY_IMPORTS = {
  global: {},
  env: {
    ...DEFAULT_IMPORT.env,
    ...JUB_IMPORT,
  },
};

export default async function () {
  const instance = await ZKCWasmService.loadWasm<WasmInstance>(wasmURL, GAME_PLAY_IMPORTS);

  return instance.exports;
}
