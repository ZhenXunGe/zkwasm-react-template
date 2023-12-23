let wasm;
export function __wbg_set_wasm(val) {
    wasm = val;
}

/**
* @param {number} i
* @returns {bigint}
*/
export function get_target(i) {
    const ret = wasm.get_target(i);
    return BigInt.asUintN(64, ret);
}

/**
* @returns {bigint}
*/
export function get_regenerate() {
    const ret = wasm.get_regenerate();
    return BigInt.asUintN(64, ret);
}

/**
* @returns {bigint}
*/
export function get_civil() {
    const ret = wasm.get_civil();
    return BigInt.asUintN(64, ret);
}

/**
* @returns {bigint}
*/
export function get_reward() {
    const ret = wasm.get_reward();
    return BigInt.asUintN(64, ret);
}

/**
* @returns {bigint}
*/
export function get_energy() {
    const ret = wasm.get_energy();
    return BigInt.asUintN(64, ret);
}

/**
* @returns {bigint}
*/
export function get_location() {
    const ret = wasm.get_location();
    return BigInt.asUintN(64, ret);
}

/**
* @returns {bigint}
*/
export function get_food() {
    const ret = wasm.get_food();
    return BigInt.asUintN(64, ret);
}

/**
* @param {bigint} target
*/
export function init(target) {
    wasm.init(target);
}

/**
* @param {bigint} command
*/
export function step(command) {
    wasm.step(command);
}

/**
* @returns {bigint}
*/
export function zkmain() {
    const ret = wasm.zkmain();
    return ret;
}

