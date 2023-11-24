import { withBrowerWeb3, DelphinusWeb3 } from "web3subscriber/src/client";
export function addressAbbreviation(address: string, tailLength: number) {
  return address.substring(0,8) + "..." + address.substring(address.length - tailLength, address.length);
}

export async function signMessage(message: string) {
  let signature = await withBrowerWeb3(async (web3: DelphinusWeb3) => {
    let provider = web3.web3Instance.currentProvider;
    if (!provider) {
      throw new Error("No provider found!");
    }
    const accounts = await web3.web3Instance.eth.getAccounts();
    const account = accounts[0];
    const msg = web3.web3Instance.utils.utf8ToHex(message);
    const msgParams = [msg, account];
    //TODO: type this properly
    const sig = await (provider as any).request({
      method: "personal_sign",
      params: msgParams,
    });
    return sig;
  });
  return signature;
}

export async function switchNetwork(chainId: number) {
  await withBrowerWeb3(async (web3: DelphinusWeb3) => {
    let provider = web3.web3Instance.currentProvider;
    if (!provider) {
      throw new Error("No provider found!");
    }
    await (provider as any).request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x" + chainId.toString(16) }],
    });
  });
}


