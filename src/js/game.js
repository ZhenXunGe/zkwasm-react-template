import makeWasm from "./gameplay.wasm";
//import { __wbg_set_wasm } from "./gameplay.wasm_bg";
const { Module, instantiate, Memory, Table } = WebAssembly;

var instance = null;

export default async function () {
  if (instance != null) {
    return instance.exports;
  } else {
    module = await makeWasm({
      global: {},
      env: {
        memory: new Memory({ initial: 10, limit: 100 }),
        table: new Table({ initial: 0, element: "anyfunc" }),
        abort: () => {
          console.error("abort in wasm!");
          throw new Error("Unsupported wasm api: abort");
        },
        require: (b) => {
          if (!b) {
            console.error("require failed");
            throw new Error("Require failed");
          }
        },
        wasm_dbg: (c) => {
          console.log("wasm_dbg", c);
        },
        wasm_dbg_char: () => {
          console.error("wasm_dbg_char should not been called in non-zkwasm mode");
          throw new Error("Unsupported wasm api: wasm_input");
        },

        wasm_input: () => {
          console.error("wasm_input should not been called in non-zkwasm mode");
          throw new Error("Unsupported wasm api: wasm_input");
        },
        wasm_output: () => {
          console.error("wasm_input should not been called in non-zkwasm mode");
          throw new Error("Unsupported wasm api: wasm_input");
        },
        poseidon_new: () => {
          console.error("wasm_input should not been called in non-zkwasm mode");
          throw new Error("Unsupported wasm api: wasm_input");
        },
        poseidon_push: () => {
          console.error("wasm_input should not been called in non-zkwasm mode");
          throw new Error("Unsupported wasm api: wasm_input");
        },
        poseidon_finalize: () => {
          console.error("wasm_input should not been called in non-zkwasm mode");
          throw new Error("Unsupported wasm api: wasm_input");
        },
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
      },
    });
    console.log("module loaded", module); // "3
    /*
    WebAssembly.instantiateStreaming(makeWasm, importObject).then(
        (obj) => console.log(obj.instance.exports)
    );
    */
    instance = module.instance;
    //__wbg_set_wasm(instance.exports);
    return instance.exports;
  }
}
