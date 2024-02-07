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
* Step function receives a encoded command and changes the global state accordingly
* @param {bigint} command
*/
export function step(command) {
    wasm.step(command);
}

/**
* @param {bigint} account
* @param {bigint} r0
* @param {bigint} r1
* @param {bigint} r2
* @param {bigint} r3
*/
export function load(account, r0, r1, r2, r3) {
    wasm.load(account, r0, r1, r2, r3);
}

/**
* @param {bigint} target
*/
export function init(target) {
    wasm.init(target);
}

/**
* @returns {bigint}
*/
export function zkmain() {
    const ret = wasm.zkmain();
    return ret;
}

