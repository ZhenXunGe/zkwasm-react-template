/* tslint:disable */
/* eslint-disable */
/**
* @param {number} i
* @returns {bigint}
*/
export function get_target(i: number): bigint;
/**
* @returns {bigint}
*/
export function get_regenerate(): bigint;
/**
* @returns {bigint}
*/
export function get_civil(): bigint;
/**
* @returns {bigint}
*/
export function get_reward(): bigint;
/**
* @returns {bigint}
*/
export function get_energy(): bigint;
/**
* @returns {bigint}
*/
export function get_location(): bigint;
/**
* @returns {bigint}
*/
export function get_food(): bigint;
/**
* Step function receives a encoded command and changes the global state accordingly
* @param {bigint} command
*/
export function step(command: bigint): void;
/**
* @param {bigint} account
* @param {bigint} r0
* @param {bigint} r1
* @param {bigint} r2
* @param {bigint} r3
*/
export function load(account: bigint, r0: bigint, r1: bigint, r2: bigint, r3: bigint): void;
/**
* @param {bigint} target
*/
export function init(target: bigint): void;
/**
* @returns {bigint}
*/
export function zkmain(): bigint;
