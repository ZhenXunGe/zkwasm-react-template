import { withBrowserConnector } from "web3subscriber/src/client";
import { DelphinusBrowserConnector } from "web3subscriber/src/provider";


export function addressAbbreviation(address: string, tailLength: number) {
  return address.substring(0,8) + "..." + address.substring(address.length - tailLength, address.length);
}

export async function signMessage(message: string) {
  let signature = await withBrowserConnector(async (provider: DelphinusBrowserConnector) => {
    if (!provider) {
      throw new Error("No provider found!");
    }

    /* FIXME: append account at the tail of message
    const accounts = await web3.web3Instance.eth.getAccounts();
    const account = accounts[0];
    const msg = web3.web3Instance.utils.utf8ToHex(message);
    const msgParams = [msg, account];
    //TODO: type this properly
    const sig = await (provider as any).request({
      method: "personal_sign",
      params: msgParams,
    });
    */
    const signature = provider.sign(message);
    return signature;
  });
  return signature;
}

export async function switchNetwork(chainId: number) {
  await withBrowserConnector(async (provider: DelphinusBrowserConnector) => {
    if (!provider) {
      throw new Error("No provider found!");
    }
    await provider.provider.send("wallet_switchEthereumChain", [
      { chainId: "0x" + chainId.toString(16) },
    ]);
  });
}


