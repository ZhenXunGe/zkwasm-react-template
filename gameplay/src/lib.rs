use wasm_bindgen::prelude::*;
use zkwasm_rust_sdk::{
    wasm_input,
    require,
    //wasm_dbg,
};


extern crate num;

pub mod utils;

// the only game state
static mut POSITION: i32 = 101;


// query state
#[wasm_bindgen]
pub fn get_position() -> i32{
    unsafe { POSITION }
}

// update state via command
#[wasm_bindgen]
pub fn perform_command(command: i32) {
    if command == 0 {
        unsafe { POSITION -= 1 }
    } else {
        unsafe { POSITION += 1 }
    }
}

#[wasm_bindgen]
pub fn zkmain() {
    unsafe {
        let result = wasm_input(1);
        let input_len = wasm_input(1);
        let mut cursor = 0;
        
        while cursor < input_len {
            let command = wasm_input(0);
            perform_command(command as i32);
            cursor += 1;
        }
        let c = if result as i32 == POSITION {true} else {false};
        //wasm_dbg(POSITION as u64);
        require(c as i32);
        //require((result as i32 == POSITION) as i32);
    }
}
