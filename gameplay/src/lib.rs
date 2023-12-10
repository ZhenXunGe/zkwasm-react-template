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
            opinfo: ((DEPOSIT as u64) << 8) + nounce,
            account_index,
            object_index,
            amount,
            sender,
        }
    }
    pub fn to_bytes(&self) -> &[u8; 80] {
        let mut result: Box<[u8; 80]> = Box::new([0; 80]);

        result[0..8].copy_from_slice(&self.opinfo.to_le_bytes());
        result[0..8].copy_from_slice(&self.opinfo.to_be_bytes());

        result[8..12].copy_from_slice(&self.account_index.to_le_bytes());
        result[12..16].copy_from_slice(&self.object_index.to_le_bytes());

        for i in 0..4 {
            let start = 16 + i * 8;
            result.as_mut()[start..start + 8].copy_from_slice(&self.amount[i].to_le_bytes());
        }
        for i in 0..4 {
            let start = 48 + i * 8;
            result.as_mut()[start..start + 8].copy_from_slice(&self.sender[i].to_le_bytes());
        }
        Box::leak(result)
    }
}

impl WithdrawInfo {
    pub fn new(nounce: u64, account_index: u32, object_index: u32, amount: [u64;4], sender: [u64; 4]) -> Self {
        WithdrawInfo {
            opinfo: ((WITHDRAW as u64) << 8) + nounce,
            account_index,
            object_index,
            amount,
            sender,
        }
    }
    pub fn to_bytes(&self) -> &[u8; 80] {
        let mut result: Box<[u8; 80]> = Box::new([0; 80]);

        result[0..8].copy_from_slice(&self.opinfo.to_le_bytes());
        result[0..8].copy_from_slice(&self.opinfo.to_be_bytes());

        result[8..12].copy_from_slice(&self.account_index.to_le_bytes());
        result[12..16].copy_from_slice(&self.object_index.to_le_bytes());

        for i in 0..4 {
            let start = 16 + i * 8;
            result.as_mut()[start..start + 8].copy_from_slice(&self.amount[i].to_le_bytes());
        }
        for i in 0..4 {
            let start = 48 + i * 8;
            result.as_mut()[start..start + 8].copy_from_slice(&self.sender[i].to_le_bytes());
        }
        Box::leak(result)
    }
}


mod zkmain;
