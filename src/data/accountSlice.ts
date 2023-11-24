import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { DelphinusWeb3, withBrowerWeb3 } from "web3subscriber/src/client";
import { signMessage } from "../utils/address";

export interface L1AccountInfo {
  address: string;
  chainId: string;
  web3: any;
}

async function loginL1Account() {
  return await withBrowerWeb3(async (web3: DelphinusWeb3) => {
    let i = await web3.getAccountInfo();
    return i;
  });
}

async function loginL2Account(address: string ) {
  let str:string = await signMessage(address);
  return str.substring(0,34);
}


export interface AccountState {
  l1Account?: L1AccountInfo;
  l2account?: string;
  status: 'Loading' | 'Ready';
}

export interface State {
  account: AccountState;
}

const initialState: AccountState = {
  status: 'Loading',
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
export const loginL1AccountAsync = createAsyncThunk(
  'acccount/fetchAccount',
  async (thunkApi) => {
    let account = await loginL1Account();
    let l2account = await loginL2Account(account.address);
    return account;
  }
);

export const loginL2AccountAsync = createAsyncThunk(
  'acccount/deriveL2Account',
  async (l1account:L1AccountInfo,  thunkApi) => {
    let l2account = await loginL2Account(l1account.address);
    return l2account;
  }
);

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setL1Account: (state, account) => {
      state.l1Account!.address = account.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginL1AccountAsync.pending, (state) => {
        state.status = 'Loading';
      })
      .addCase(loginL1AccountAsync.fulfilled, (state, c) => {
        state.status = 'Ready';
        console.log(c);
        state.l1Account = c.payload;
      })
      .addCase(loginL2AccountAsync.pending, (state) => {
        state.status = 'Loading';
      })
      .addCase(loginL2AccountAsync.fulfilled, (state, c) => {
        state.status = 'Ready';
        console.log(c);
        state.l2account = c.payload;
      })
  },
});

export const selectL1Account = <T extends State>(state: T) => state.account.l1Account;
export const selectL2Account = <T extends State>(state: T) => state.account.l2account;
export const selectLoginStatus = <T extends State>(state: T) => state.account.status;

export default accountSlice.reducer;
