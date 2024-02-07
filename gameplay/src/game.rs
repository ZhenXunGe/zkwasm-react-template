use zkwasm_rust_sdk::wasm_dbg;
use zkwasm_rust_sdk::require;
use zkwasm_rust_sdk::merkle::Merkle;
use sha2::{Sha256, Digest};
use wasm_bindgen::prelude::*;
// This is a standalone game state manipulate module that connets with UI
// controllers and model handlers


// The global state
struct State {
    location: u64,
    targets: [u64; 3],
    regenerate: u64,
    civil: u64,
    energy: u64,
    food: u64,
    reward: u64,
}


#[derive (Default)]
struct Planet {
    connect: [u64; 3],
    reward: u64,
}

static mut GLOBAL: State = State {
    location: 0,
    targets: [0; 3],
    regenerate: 0,
    civil: 0,
    energy: 100,
    food: 100,
    reward: 0,
};

static mut MERKLE: Merkle = Merkle { root: [0; 4] };

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

fn set_target(target: u64) {
    let mut hasher = Sha256::new();
    hasher.update(target.to_be_bytes());
    let locations = hasher.finalize();
    let location = locations[0];
    let mut planet_data = [0u64; 4];
    let mut hash = [0u64; 4];
    unsafe {
        MERKLE.get(location as u32, &mut planet_data, &mut hash, true);
    }
    unsafe {
        GLOBAL.location = location as u64;
        GLOBAL.targets = [
            planet_data[0],
            planet_data[1],
            planet_data[2],
        ];
        GLOBAL.regenerate = 1;
        GLOBAL.civil = 1;
        GLOBAL.food -= 3;
        GLOBAL.energy -= 1;
    }
}


const CMD_TRANSPORT: u64 = 0;
const CMD_RECHARGE: u64 = 1;
const CMD_DIG: u64 = 2;

/// Step function receives a encoded command and changes the global state accordingly
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

// load the game with user account
#[wasm_bindgen]
pub fn load(account: u64, r0: u64, r1:u64, r2:u64, r3:u64) {
    unsafe {
        MERKLE.root = [r0, r1, r2, r3];
    }
    set_target(account& 0xffffffff);
}


#[wasm_bindgen]
pub fn init(target: u64) {
    let mut hasher = Sha256::new();
    let rand = target;
    hasher.update(rand.to_be_bytes());
    let ids = hasher.finalize(); //32 nodes
    let total_planets = 4;
    let mut planets:Vec<Planet> = Vec::with_capacity(32);
    for i in 0..total_planets {
        let planet = Planet {
            connect: [ids[(i+1)%32] as u64, ids[(i+2)%32] as u64, ids[(i+3)%32] as u64],
            reward: 0,
        };
        planets.push(planet);

    }
    let mut merkle = Merkle::new();
    for i in 0..total_planets {
        merkle.set(ids[i] as u32, &planets[i].connect, true, None);
    }
    let merkle_root = merkle.root;
    zkwasm_rust_sdk::dbg!("finish loading {:?}", merkle_root);
}
