import React, { createRef, useState, useEffect, useRef } from "react";
import "./style.scss";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { loginL1AccountAsync, selectL1Account, loginL2AccountAsync, selectL2Account } from "../data/accountSlice";
import { addressAbbreviation } from "../utils/address";
import {
  Button,
  Container,
  Form,
  Nav,
  Navbar,
  NavDropdown,
  Row,
  Col,
} from "react-bootstrap";

import logo from "../images/logo.png";
import Restart from "../images/restart.png";
import HomeIcon from "../images/home-icon.png";

interface IProps {
  currency: number;
  handleRestart: () => void;
}

export function MainNavBar(props: IProps) {
  const dispatch = useAppDispatch();

  let account = useAppSelector(selectL1Account);
  let l2account = useAppSelector(selectL2Account);

  useEffect(() => {
    dispatch(loginL1AccountAsync());
  }, []);

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
            {l2account && (
              <>
                <div className="divider"></div>
                <Navbar.Text>
                  <div>Processing Key</div>
                  <div>{l2account.address}</div>
                </Navbar.Text>
              </>
            )}

            {!account && (
              <>
                <div className="divider"></div>
                <Nav.Link
                  onClick={() => dispatch(loginL1AccountAsync())}
                  className="px-2 my-2 py-0"
                >
                  Connect Wallet
                </Nav.Link>
              </>
            )}
            {account && !l2account && (
              <>
                <div className="divider"></div>
                <Nav.Link
                  onClick={() => dispatch(loginL2AccountAsync(account!))}
                  className="px-2 my-2 py-0"
                >
                  Derive Processing Key
                </Nav.Link>
              </>
            )}

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
