let wasm;
export function __wbg_set_wasm(val) {
    wasm = val;
}

/**
* @returns {bigint}
*/
export function zkmain() {
    const ret = wasm.zkmain();
    return ret;
}

