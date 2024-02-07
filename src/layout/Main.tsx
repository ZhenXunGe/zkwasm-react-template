import React, { createRef, useEffect, useRef, useState } from "react";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Button, Form } from "react-bootstrap";
import { QRCodeSVG } from "qrcode.react";
import initGameInstance from "../js/game";
import { GameHistory, WasmInstance } from "../types/game";
import HistoryTasks from "../components/History";
import { NewProveTask } from "../modals/addNewProveTask";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./style.scss";
import "bootswatch/dist/slate/bootstrap.min.css";
import { Container } from "react-bootstrap";
import { MainNavBar } from "../components/Nav";
import InputGroup from 'react-bootstrap/InputGroup';
import { State, ActionType } from "../types/game";
import { ModalOptions } from "../types/layout";
import { numToUint8Array, SignatureWitness } from "../utils/proof";

import {
  //selectL1Account,
  selectL2Account,
} from "../data/accountSlice";
import BN from "bn.js";
import lotimage from "../images/lot.jpg";
import { PrivateKey, PublicKey, bnToHexLe } from "delphinus-curves/src/altjubjub";

export function Main() {
  const dispatch = useAppDispatch();
  const [wasmInstance, setWasmInstance] = useState<WasmInstance | null>(null);
  const [currentModal, setCurrentModal] = useState<ModalOptions | null>(null);

  // Game related handlers for state
  const [energy, setEnergy] = useState<number>(0);
  const [food, setFood] = useState<number>(0);
  const [targets, setTargets] = useState<Array<number>>([]);
  const [commands, setCommands] = useState<Array<number>>([]);
  const [instances, setInstances] = useState<Array<string>>([]);
  const [location, setLocation] = useState<string>("loading...");
  const [reward, setReward] = useState<number>(0);

  // Signature Related

  const [signature, setSignature] = useState<Array<string>>([]);
  const [pubkey, setPubkey] = useState<Array<string>>([]);
  const [witness, setWitness] = useState<Array<string>>([]);

  // Game Loading Status
  const [merkleRoot, setMerkleRoot] = useState<Array<number>>([0,0,0,0]);
  const [loaded, setLoaded] = useState<boolean>(false);

  let l2account = useAppSelector(selectL2Account);

  function updateMerkle(index: number, value: number) {
    let a = merkleRoot;
    a[index] = value;
    setMerkleRoot(a);
  }

  function updateState(ins: WasmInstance) {
      let location = ins.get_location();
      let energy = ins.get_energy();
      let food = ins.get_food();
      console.log("location is", location);
      setLocation(location.toString());
      setEnergy(Number(energy));
      setFood(Number(food));
      let target0 = ins.get_target(0);
      let target1 = ins.get_target(1);
      let target2 = ins.get_target(2);
      setTargets([Number(target0), Number(target1), Number(target2)]);
  }

        /* Test merkle root
        6411109203874391172
        12156582326191033569
        18190570047656100927
        2451350522329201736
         */

  function loadGame(l2account: bigint) {
    initGameInstance().then((ins: WasmInstance) => {
      ins.load(
          l2account,
          BigInt(merkleRoot[0]),
          BigInt(merkleRoot[1]),
          BigInt(merkleRoot[2]),
          BigInt(merkleRoot[3])
      );
      let location = ins.get_location();
      let energy = ins.get_energy();
      let food = ins.get_food();
      let reward = ins.get_reward();
      console.log("location is", location);
      setLocation(location.toString());
      setEnergy(Number(energy));
      setFood(Number(food));
      setReward(Number(reward));
      let target0 = ins.get_target(0);
      let target1 = ins.get_target(1);
      let target2 = ins.get_target(2);
      setTargets([Number(target0), Number(target1), Number(target2)]);
      setLoaded(true);
    });
  }

  function initGame(l2account: bigint) {
    initGameInstance().then((ins: WasmInstance) => {
      console.log("setting instance");
      setWasmInstance(ins);
      ins.init(l2account);
    });
  };

  const pickTarget = (i:number) => {
    console.log("pick location", i);
    let cmd = BigInt(0 + (i * 256));
    initGameInstance().then((ins: WasmInstance) => {
      ins.step(cmd);
      updateState(ins);
    });
    let cmds = commands;
    cmds.push(Number(cmd));
    setCommands(cmds);
  }

  const dig = () => {
    console.log("dig dig...");
    initGameInstance().then((ins: WasmInstance) => {
      ins.step(BigInt(2));
      updateState(ins);
    });
    let cmds = commands;
    cmds.push(2);
    setCommands(cmds);
  }

  const regenerate = () => {
    console.log("dig dig...");
    initGameInstance().then((ins: WasmInstance) => {
      ins.step(BigInt(1));
      updateState(ins);
    });
    let cmds = commands;
    cmds.push(1);
    setCommands(cmds);
  }



  const msgToSign = () => {
    const buf = new Uint8Array(commands.length * 8);
    commands.map((v, i) => {
      buf.set(numToUint8Array(v), 8*i);
    });
    console.log(buf);
    return buf;
  }

  useEffect(() => {
    if (l2account) {
        if (loaded == false) {
            initGame(BigInt("0x" + l2account.address));
        } else {
            let msg = msgToSign();
            console.log(l2account);
            let prikey = PrivateKey.fromString(l2account.address);
            let signingWitness = new SignatureWitness(prikey, msg);
            setPubkey(signingWitness.pkey);
            setSignature(signingWitness.sig);
            let sig_witness:Array<string> = signingWitness.sig.map((v) => "0x" + v+ ":bytes-packed");
            let pubkey_witness:Array<string> = signingWitness.pkey.map((v) => "0x" + v+ ":bytes-packed");
            let witness = pubkey_witness;
            for (var s of sig_witness) {
                witness.push(s);
            }
            setWitness(witness);
        }
    }
  }, [l2account, location]);

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

      {1 &&
          <Container style={{top: "10px"}}>
            <Row>
              <Col>
                 <Form>
                   <InputGroup className="mb-3">
                     <InputGroup.Text>Merkle Root 0</InputGroup.Text>
                     <Form.Control
                         as = "input"
                         onChange = {(event) => {updateMerkle(0, Number(event.target.value))}}
                      />
                     <Form.Control
                         as = "input"
                         onChange = {(event) => {updateMerkle(1, Number(event.target.value))}}
                      />
                     <Form.Control
                         as = "input"
                         onChange = {(event) => {updateMerkle(2, Number(event.target.value))}}
                      />
                     <Form.Control
                         as = "input"
                         onChange = {(event) => {updateMerkle(3, Number(event.target.value))}}
                      />
                     <InputGroup.Text
                         onClick = {() => {loadGame(l2account!.toBigInt())}}
                      >
                      Load Game</InputGroup.Text>

                   </InputGroup>
                </Form>
              </Col>
            </Row>
          </Container>
      }

      { 1 && (
        <>
          <Container style={{ position: "relative", top: "10px", paddingBottom:"100px"}}>
            <Row>
              <Col>
                <img style={{width:"400px", display:"inline-block"}} src={lotimage}></img>
              </Col>
              <Col>
                   {
                      targets.map((o, i) =>
                   <InputGroup className="mb-2">
                        <Button onClick={()=>pickTarget(i)}>move to planet {o} </Button>
                   </InputGroup>
                      )
                   }
                   <InputGroup className="mb-2">
                   <Button onClick={()=>dig()}> Dig </Button>
                   <Button onClick={()=>regenerate()}> Regenerate </Button>
                   </InputGroup>
              </Col>
              <Col>
                 <Form>
                   <InputGroup className="mb-3">
                     <InputGroup.Text id="basic-addon1">Current Location</InputGroup.Text>
                     <Form.Control
                         placeholder="location"
                         aria-label="location"
                         aria-describedby="basic-addon1"
                         value = {location}
                      />
                   </InputGroup>
                   <InputGroup className="mb-3">
                      <InputGroup.Text id="basic-addon1">Energy: </InputGroup.Text>
                      <Form.Control
                          placeholder="energy"
                          aria-label="energy"
                          aria-describedby="basic-addon1"
                          value = {energy}
                      />
                   </InputGroup>
                   <InputGroup className="mb-3">
                      <InputGroup.Text id="basic-addon1">Food: </InputGroup.Text>
                      <Form.Control
                          placeholder="food"
                          aria-label="food"
                          aria-describedby="basic-addon1"
                          value = {food}
                      />
                   </InputGroup>
                   <InputGroup className="mb-3">
                      <InputGroup.Text id="basic-addon1">Reward: </InputGroup.Text>
                      <Form.Control
                          placeholder="reward"
                          aria-label="reward"
                          aria-describedby="basic-addon1"
                          value = {reward}
                      />
                   </InputGroup>

                </Form>
              </Col>
            </Row>
            <Form>
              <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                <Form.Label>Movements</Form.Label>
                <Form.Control as="input" value = {
                          commands.map((x) => ` ${x}:i64`).join(";")
                }/>
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                <Form.Label>PublicKey-X</Form.Label>
                <Form.Control as="input" value ={witness[0]}/>
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                <Form.Label>PublicKey-Y</Form.Label>
                <Form.Control as="input" value ={witness[1]}/>
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                <Form.Label>Signature-X</Form.Label>
                <Form.Control as="input" value ={witness[2]}/>
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                <Form.Label>Signature-Y</Form.Label>
                <Form.Control as="input" value ={witness[3]}/>
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                <Form.Label>Signature-S</Form.Label>
                <Form.Control as="input" value ={witness[4]}/>
              </Form.Group>
            </Form>
            <NewProveTask
              md5="EDDF817B748715A7F2708873D7346941"
              inputs={instances}
              witness={witness}
              OnTaskSubmitSuccess={()=>{}}
            ></NewProveTask>
          </Container>
          <Container>
            <HistoryTasks md5="EDDF817B748715A7F2708873D7346941"></HistoryTasks>
          </Container>
        </>
      )}
    </>
  );
}
