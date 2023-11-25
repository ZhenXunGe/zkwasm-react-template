pub const DEPOSIT:u8 = 0x0;
pub const WITHDRAW:u8 = 0x1;

pub struct TxInfo {
    pub opinfo: u64,
    pub account_index: u32,
    pub object_index: u32,
    pub args: [u64; 8],
}

pub struct DepositInfo {
    pub opinfo: u64,
    pub account_index: u32,
    pub object_index: u32,
    pub amount: [u64; 4],
    pub sender: [u64; 4],
}

pub struct WithdrawInfo {
    pub opinfo: u64,
    pub account_index: u32,
    pub object_index: u32,
    pub amount: [u64; 4],
    pub sender: [u64; 4],
}

pub fn read_tx_info<'a, T>(data: &'a [u64; 10]) -> &'a T {
    unsafe { std::mem::transmute(data) }
}

impl DepositInfo {
    pub fn new(nounce: u64, account_index: u32, object_index: u32, amount: [u64;4], sender: [u64; 4]) -> Self {
        DepositInfo {
            opinfo: (DEPOSIT as u64) + (nounce << 8),
            account_index,
            object_index,
            amount,
            sender,
        }
    }
    pub fn to_bytes(&self) -> &[u8; 80] {
        unsafe { std::mem::transmute(self) }
    }
}

impl WithdrawInfo {
    pub fn new(nounce: u64, account_index: u32, object_index: u32, amount: [u64;4], sender: [u64; 4]) -> Self {
        WithdrawInfo {
            opinfo: (DEPOSIT as u64) + (nounce << 8),
            account_index,
            object_index,
            amount,
            sender,
        }
    }
    pub fn to_bytes(&self) -> &[u8; 80] {
        unsafe { std::mem::transmute(self) }
    }
}


mod zkmain;
