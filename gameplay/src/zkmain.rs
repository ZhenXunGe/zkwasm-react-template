use zkwasm_rust_sdk::jubjub::BabyJubjubPoint;
use zkwasm_rust_sdk::jubjub::JubjubSignature;
use zkwasm_rust_sdk::wasm_input;
use sha2::{Sha256, Digest};
use primitive_types::U256;
use super::game::step;
use wasm_bindgen::prelude::*;
//use zkwasm_rust_sdk::wasm_output;
//use zkwasm_rust_sdk::wasm_dbg;
//use zkwasm_rust_sdk::require;



#[wasm_bindgen]
pub fn zkmain() -> i64 {
    let mut hasher = Sha256::new();

    let commands_len = unsafe {wasm_input(0)};
    for _ in 0..commands_len {
        let command = unsafe {wasm_input(0)};
        hasher.update(command.to_le_bytes());
        step(command);
    }

    let msghash = hasher.finalize();

    zkwasm_rust_sdk::dbg!("command hash is {:?}\n", msghash);

    /*
    let msghash = unsafe {[
        wasm_input(1),
        wasm_input(1),
        wasm_input(1),
        wasm_input(1),
    ]};
    */


    zkwasm_rust_sdk::dbg!("msg {:?}\n", msghash);

    let pk = unsafe {BabyJubjubPoint {
        x: U256([
                wasm_input(0),
                wasm_input(0),
                wasm_input(0),
                wasm_input(0),
        ]),
        y: U256([
                wasm_input(0),
                wasm_input(0),
                wasm_input(0),
                wasm_input(0),
        ]),
    }};
    zkwasm_rust_sdk::dbg!("process sig\n");

    let sig = unsafe {JubjubSignature {
        sig_r: BabyJubjubPoint {
            x: U256([
                    wasm_input(0),
                    wasm_input(0),
                    wasm_input(0),
                    wasm_input(0),
            ]),
            y: U256([
                    wasm_input(0),
                    wasm_input(0),
                    wasm_input(0),
                    wasm_input(0),
            ]),
        },
        sig_s: [
            wasm_input(0),
            wasm_input(0),
            wasm_input(0),
            wasm_input(0),
        ]
    }};
    zkwasm_rust_sdk::dbg!("start verifying ...\n");

    let msghash_u64 = [
        u64::from_be_bytes(msghash[24..32].try_into().unwrap()),
        u64::from_be_bytes(msghash[16..24].try_into().unwrap()),
        u64::from_be_bytes(msghash[8..16].try_into().unwrap()),
        u64::from_be_bytes(msghash[0..8].try_into().unwrap()),
    ];

    sig.verify(&pk, &msghash_u64);

    /*
    let result = hasher.finalize();
    let result_u64 = [
        u64::from_be_bytes(result[0..8].try_into().unwrap()),
        u64::from_be_bytes(result[8..16].try_into().unwrap()),
        u64::from_be_bytes(result[16..24].try_into().unwrap()),
        u64::from_be_bytes(result[24..32].try_into().unwrap()),
    ];
    unsafe {
        wasm_output(result_u64[0]);
        wasm_output(result_u64[1]);
        wasm_output(result_u64[2]);
        wasm_output(result_u64[3]);
    }
    */
    0
}
