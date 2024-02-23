import { WalletEntryPosition } from "@particle-network/auth";
import {
  Ethereum,
  EthereumGoerli,
  EthereumSepolia,
  Solana,
  SolanaDevnet,
  SolanaTestnet,
} from "@particle-network/chains";
import { evmWallets, solanaWallets } from "@particle-network/connect";
import { ModalProvider } from "@particle-network/connect-react-ui";
import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import "./index.css";
import * as serviceWorker from "./serviceWorker";

// import connect react ui styles
import "@particle-network/connect-react-ui/dist/index.css";

import APP from "./App";

const walletconnectProjectId = process.env
  .REACT_APP_WALLETCONNECT_PROJECT_ID as string;

const metadata = {
  name: "Particle Demo",
  description: "The Full-Stack Infrastructure To Simplify Web3",
  url: "https://web-demo.particle.network",
  icons: ["https://static.particle.network/logo-small.png"],
};

const container = document.getElementById("root");
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ModalProvider
        particleAuthSort={[
          "email",
          "phone",
          "google",
          "apple",
          "twitter",
          "facebook",
          "microsoft",
          "linkedin",
          "github",
          "twitch",
          "discord",
        ]}
        options={{
          projectId: process.env.REACT_APP_PROJECT_ID as string,
          clientKey: process.env.REACT_APP_CLIENT_KEY as string,
          appId: process.env.REACT_APP_APP_ID as string,
          chains: [
            Ethereum,
            EthereumGoerli,
            EthereumSepolia,
            Solana,
            SolanaDevnet,
            SolanaTestnet,
          ],
          particleWalletEntry: {
            displayWalletEntry: true,
            defaultWalletEntryPosition: WalletEntryPosition.BR,
          },
          wallets: [
            ...evmWallets({
              projectId: walletconnectProjectId,
              showQrModal: false,
              metadata,
            }),
            ...solanaWallets(),
          ],
          securityAccount: {
            promptSettingWhenSign: 1,
            promptMasterPasswordSettingWhenLogin: 2,
          },
        }}
        theme="auto"
      >
        <APP />
      </ModalProvider>
    </Provider>
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
