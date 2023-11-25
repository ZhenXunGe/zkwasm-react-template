use zkwasm_rust_sdk::jubjub::BabyJubjubPoint;
use zkwasm_rust_sdk::jubjub::JubjubSignature;
use zkwasm_rust_sdk::wasm_output;
use zkwasm_rust_sdk::wasm_input;
//use zkwasm_rust_sdk::poseidon::PoseidonHasher;
use primitive_types::U256;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn zkmain() -> i64 {
    /*
    let nb_participants = unsafe {
        wasm_input(0)
    };
    */

    let nb_participants = 1;

    //let mut hasher = PoseidonHasher::new();
    let msghash = unsafe {[
        wasm_input(1),
        wasm_input(1),
        wasm_input(1),
        wasm_input(1),
    ]};

    let mut g = 0;

    for _ in 0..nb_participants {
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
        //hasher.update(pk.x.0[0]);
        //hasher.update(pk.x.0[1]);
        //hasher.update(pk.x.0[2]);
        //hasher.update(pk.x.0[3]);
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
        //sig.verify(&pk, &msghash);
        g = sig.sig_r.y.0[0] & 0xffff;
    }

    //let result = hasher.finalize();
    //let g = result[0] & 0xffff;
    unsafe {
        wasm_output(g);
    }
    0
}
