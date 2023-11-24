import React, { createRef, useEffect, useRef, useState } from "react";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import {
  loadStatus,
  selectTasks,
  tasksLoaded,
  addProvingTask,
} from "../data/statusSlice";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Button, Form } from "react-bootstrap";
import { QRCodeSVG } from "qrcode.react";
import initGameInstance from "../js/game";
import * as gameInstance from "../js/gameplay.wasm_bg";
import { GameHistory, WasmInstance } from "../types/game";
import HistoryTasks from "../components/History";
import { NewProveTask } from "../modals/addNewProveTask";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./style.scss";
import "bootswatch/dist/slate/bootstrap.min.css";
import { Container } from "react-bootstrap";
import { MainNavBar } from "../components/Nav";
import { State, ActionType } from "../types/game";
import { ModalOptions } from "../types/layout";

import * as rustlib from "rustlib/web/pkg";

const initializeGame = async () => {
  await initGameInstance();
  return gameInstance;
};

const initialInstance = initializeGame();

export function Main() {
  const dispatch = useAppDispatch();
  const [instance, setInstance] = useState<WasmInstance | null>(null);
  const [currentModal, setCurrentModal] = useState<ModalOptions | null>(null);
  const [position, setPosition] = useState<number>(0);
  const [commands, setCommands] = useState<Array<string>>([]);

  useEffect(() => {
    initialInstance.then((ins: WasmInstance) => {
      console.log("setting instance");
      setInstance(ins);
      setPosition(ins.get_position());
    });
  }, []);

  const addCommand = (i:number) => {
    let ins = instance!;
    ins.perform_command(i);
    setPosition(ins.get_position());
    let g = commands;
    g.push(`${i}:i64`);
    setCommands(g);
  }

  const handleCloseModal = () => {
    setCurrentModal(null);
  };

  const offset = useRef(0); // Use ref instead of state to avoid unnecessary re-renders

  // Start or stop scrolling the background when the 'scroll' state changes

  return (
    <>
      <MainNavBar currency={0} handleRestart={()=>{}}></MainNavBar>
      <Container className="d-flex justify-content-center"></Container>
      <Container className="justify-content-center">
        <Row className="mt-3">
          <Col>
          </Col>
        </Row>
      </Container>

      {instance && (
        <>
          <Container style={{ position: "relative", top: "-10px", paddingBottom:"100px"}}>
            <Button onClick={()=>addCommand(0)}> move left </Button>
            <div style={{display:"inline-block", width:"100px", textAlign:"center", backgroundColor:"black"}}>
            {position}
            </div>
            <Button onClick={()=>addCommand(1)}> move right </Button>
            <div>commands: {commands}</div>
            <NewProveTask
              md5="C74E02C4E889598A7E0FD5FD86F47E1F"
              inputs={[`${position}:i64`, `${commands.length}:i64`]}
              witness={commands}
              OnTaskSubmitSuccess={()=>{}}
            ></NewProveTask>
          </Container>
          <Container>
            <HistoryTasks md5="C74E02C4E889598A7E0FD5FD86F47E1F"></HistoryTasks>
          </Container>
        </>
      )}
    </>
  );
}
