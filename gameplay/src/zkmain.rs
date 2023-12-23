use zkwasm_rust_sdk::jubjub::BabyJubjubPoint;
use zkwasm_rust_sdk::jubjub::JubjubSignature;
use zkwasm_rust_sdk::wasm_output;
use zkwasm_rust_sdk::wasm_input;
use zkwasm_rust_sdk::wasm_dbg;
use zkwasm_rust_sdk::require;
use primitive_types::U256;

use wasm_bindgen::prelude::*;

use sha2::{Sha256, Digest};

struct State {
    location: u64,
    targets: [u64; 4],
    regenerate: u64,
    civil: u64,
    energy: u64,
    food: u64,
    reward: u64,
}

static mut GLOBAL: State = State {
    location: 0,
    targets: [0; 4],
    regenerate: 0,
    civil: 0,
    energy: 100,
    food: 100,
    reward: 0,
};

#[wasm_bindgen]
pub fn get_target(i: usize) -> u64 {
    unsafe {
        return GLOBAL.targets[i]
    }
}

#[wasm_bindgen]
pub fn get_regenerate() -> u64 {
    unsafe {
        return GLOBAL.regenerate
    }
}

#[wasm_bindgen]
pub fn get_civil() -> u64 {
    unsafe {
        return GLOBAL.civil
    }
}

#[wasm_bindgen]
pub fn get_reward() -> u64 {
    unsafe {
        return GLOBAL.reward
    }
}

#[wasm_bindgen]
pub fn get_energy() -> u64 {
    unsafe {
        return GLOBAL.energy
    }
}

#[wasm_bindgen]
pub fn get_location() -> u64 {
    unsafe {
        return GLOBAL.location
    }
}

#[wasm_bindgen]
pub fn get_food() -> u64 {
    unsafe {
        return GLOBAL.food
    }
}

const CMD_TRANSPORT: u64 = 0;
const CMD_RECHARGE: u64 = 1;
const CMD_DIG: u64 = 2;

fn set_target(target: u64) {
    let mut hasher = Sha256::new();
    hasher.update(target.to_be_bytes());
    let hash = hasher.finalize();
    unsafe {
        GLOBAL.location = target;
        GLOBAL.targets = [
            u32::from_be_bytes(hash[0..4].try_into().unwrap()) as u64,
            u32::from_be_bytes(hash[4..8].try_into().unwrap()) as u64,
            u32::from_be_bytes(hash[8..12].try_into().unwrap()) as u64,
            u32::from_be_bytes(hash[12..16].try_into().unwrap()) as u64,
        ];
        GLOBAL.regenerate = u32::from_be_bytes(hash[16..20].try_into().unwrap()) as u64;
        GLOBAL.civil = u32::from_be_bytes(hash[16..20].try_into().unwrap()) as u64;
        GLOBAL.food -= 30;
        GLOBAL.energy -= 30;
    }

}

#[wasm_bindgen]
pub fn init(target: u64) {
    set_target(target & 0xffffffff);
}

#[wasm_bindgen]
pub fn step(command: u64) {
    unsafe {
        wasm_dbg(command);
    };
    let commands = command.to_le_bytes();
    if commands[0] as u64 == CMD_TRANSPORT {
        unsafe {
            require(commands[1] < 4);
        }
        let target = get_target(commands[1] as usize);
        set_target(target);
    } else if commands[0] as u64 == CMD_RECHARGE {
        unsafe {
            GLOBAL.food += GLOBAL.regenerate & 0xff;
            GLOBAL.energy += GLOBAL.regenerate & 0xff;
        }

    } else if commands[0] as u64 == CMD_DIG {
        unsafe {
            GLOBAL.food -= 30;
            GLOBAL.energy -= 30;
            if GLOBAL.civil & 0xffff == 0x1234 {
                GLOBAL.reward += 0x1000;
            }
        }
    }
}

#[wasm_bindgen]
pub fn zkmain() -> i64 {
    let mut hasher = Sha256::new();

    unsafe {
        wasm_dbg(123);
    }
    zkwasm_rust_sdk::dbg!("test\n");

    /*
    let msghash = unsafe {[
        u64::from_le_bytes(wasm_input(1).to_be_bytes()),
        u64::from_le_bytes(wasm_input(1).to_be_bytes()),
        u64::from_le_bytes(wasm_input(1).to_be_bytes()),
        u64::from_le_bytes(wasm_input(1).to_be_bytes()),
    ]};
    */

    let msghash = unsafe {[
        wasm_input(1),
        wasm_input(1),
        wasm_input(1),
        wasm_input(1),
    ]};


    zkwasm_rust_sdk::dbg!("msg {:?}\n", msghash);

    /*
    hasher.update(msghash[0].to_be_bytes());
    hasher.update(msghash[1].to_be_bytes());
    hasher.update(msghash[2].to_be_bytes());
    hasher.update(msghash[3].to_be_bytes());
    */

    zkwasm_rust_sdk::dbg!("test\n");

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
    /*
    hasher.update(pk.x.0[0].to_be_bytes());
    hasher.update(pk.x.0[1].to_be_bytes());
    hasher.update(pk.x.0[2].to_be_bytes());
    hasher.update(pk.x.0[3].to_be_bytes());
    */
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
    zkwasm_rust_sdk::dbg!("start verifying ...");
    sig.verify(&pk, &msghash);

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
