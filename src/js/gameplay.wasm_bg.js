let wasm;
export function __wbg_set_wasm(val) {
    wasm = val;
}

/**
* @returns {number}
*/
export function get_position() {
    const ret = wasm.get_position();
    return ret;
}

/**
* @param {number} command
*/
export function perform_command(command) {
    wasm.perform_command(command);
}

/**
*/
export function zkmain() {
    wasm.zkmain();
}

