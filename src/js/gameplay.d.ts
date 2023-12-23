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
* @param {bigint} target
*/
export function init(target: bigint): void;
/**
* @param {bigint} command
*/
export function step(command: bigint): void;
/**
* @returns {bigint}
*/
export function zkmain(): bigint;
