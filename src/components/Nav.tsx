import { isEVMProvider, isMetaMask } from "@particle-network/connect";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  loginL1AccountAsync,
  loginL2AccountAsync,
  selectL1Account,
  selectL2Account,
} from "../data/accountSlice";
import { addressAbbreviation } from "../utils/address";
import "./style.scss";

import { Container, Nav, Navbar } from "react-bootstrap";

import {
  ConnectButton,
  useAccount,
  useParticleProvider,
} from "@particle-network/connect-react-ui";
import Web3 from "web3";
import HomeIcon from "../images/home-icon.png";
import logo from "../images/logo.png";
import Restart from "../images/restart.png";

interface IProps {
  currency: number;
  handleRestart: () => void;
}

export function MainNavBar(props: IProps) {
  const dispatch = useAppDispatch();
  const provider = useParticleProvider();

  const address = useAccount();

  let account = useAppSelector(selectL1Account);
  let l2account = useAppSelector(selectL2Account);

  useEffect(() => {
    dispatch(loginL1AccountAsync());
  }, []);

  useEffect(() => {
    if (provider && isEVMProvider(provider)) {
      window.web3 = new Web3(provider as any);
    }
  }, [provider]);

  const isMetaMaskInjected =
    typeof window !== "undefined" &&
    typeof window.ethereum !== "undefined" &&
    (window.ethereum.providers?.some(isMetaMask) || window.ethereum.isMetaMask);

  console.log(account, address, "==============");

  return (
    <Navbar expand="lg" style={{ zIndex: "1000" }}>
      <Container className="justify-content-md-between">
        <Navbar.Brand href="http://www.delphinuslab.com">
          <img src={logo} height="30" alt="logo"></img>
        </Navbar.Brand>
        <Nav.Item className="action-items d-flex">
          <img src={HomeIcon} height="30" alt="restart" className="me-2 "></img>
          <img
            src={Restart}
            height="30"
            alt="restart"
            className="me-2 restart-button"
            onClick={() => props.handleRestart}
          ></img>
        </Nav.Item>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {account && (
              <>
                <div className="divider"></div>
                <Navbar.Text>
                  <div>Account</div>
                  <div>{addressAbbreviation(account.address, 4)}</div>
                </Navbar.Text>
              </>
            )}

            {!account && (
              <>
                <div className="divider"></div>
                <div
                  className="connect-btn"
                  onClick={() => dispatch(loginL1AccountAsync())}
                >
                  <ConnectButton />
                </div>
              </>
            )}
            {!l2account && (
              <>
                <div className="divider"></div>
                <Nav.Link
                  onClick={() => dispatch(loginL2AccountAsync(address!))}
                  className="px-2 my-2 py-0"
                >
                  Derive Processing Key
                </Nav.Link>
              </>
            )}
                  {l2account && (
              <>
                <div className="divider"></div>
                <Navbar.Text>
                  <div>Processing Key</div>
                  <div>{l2account}</div>
                </Navbar.Text>
              </>
            )}

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
