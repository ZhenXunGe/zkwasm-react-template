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
import {
  selectL1Account,
  selectL2Account,
} from "../data/accountSlice";
import BN from "bn.js";
import { bytesToU64Hex } from "../utils/proof";
import lotimage from "../images/lot.jpg";
import { CurveField, PrivateKey, PublicKey } from "delphinus-curves/src/altjubjub";

const initializeRustLib= async () => {
  await initGameInstance();
};

const initialInstance = initializeRustLib();


export function Main() {
  const dispatch = useAppDispatch();
  const [instance, setInstance] = useState<WasmInstance | null>(null);
  const [currentModal, setCurrentModal] = useState<ModalOptions | null>(null);
  const [lottoId, setLottoId] = useState<number>(0);
  const [lottoNumber, setLottoNumber] = useState<number>(0);
  const [witness, setWitness] = useState<Array<string>>([]);
  const [instances, setInstances] = useState<Array<string>>([]);
  const [commitment, setCommitment] = useState<string>("0x1000");
  const [randomness, setRandomness] = useState<string>("");
  const [signature, setSignature] = useState<Array<string>>([]);
  let account = useAppSelector(selectL1Account);
  let l2account = useAppSelector(selectL2Account);

  useEffect(() => {
    initGameInstance().then((ins: WasmInstance) => {
      console.log("setting instance");
      setInstance(ins);
    });
  }, []);

  const pickLottoNumber = (i:number) => {
    setLottoNumber(i);
  }

  const incLottoRound = () => {
    setLottoId(lottoId+1);
  }



  const commitRandomness = (hexnumber: string) => {
    setCommitment(hexnumber);
  }

  const updateRandomness = () => {
    let c = new BN(commitment.substring(2), 'hex');
    let bytes = c.toArray("le",16);
    const buf = new Uint8Array(bytes.length + 2);
    buf.set(bytes, 0);
    buf.fill(lottoId, bytes.length);
    buf.fill(lottoNumber, bytes.length+1);
    console.log(buf);
    let valuebuf = buf;
    let bns = bytesToU64Hex(valuebuf);
    setSignature(bns);
    let bns_str = bns.toString();
    setRandomness(bns_str);
  }

  const handleCloseModal = () => {
    setCurrentModal(null);
  };

  useEffect(() => {
    if (l2account) {
        let c = new BN(commitment.substring(2), 'hex');
        let bytes = c.toArray("le",16);
        let prikey = PrivateKey.fromString(l2account);
        console.log("update...");
        const buf = new Uint8Array(bytes.length);
        let pubkey = prikey.publicKey;
        let pubkeyinputs = ["0x123"]
                    //bytesToU64Hex(pubkey);
        updateRandomness();
        let sig_witness:Array<string> = signature.map((v) => v+":i64");
        let pubkey_witness:Array<string> = pubkeyinputs.map((v) => v+":i64");
        let witness = pubkey_witness;
        for (var s of sig_witness) {
            witness.push(s);
        }
        setWitness(witness);
        setInstances(pubkeyinputs.map((v) => v+":i64"));
        commitRandomness(l2account);
    }
  }, [l2account, lottoId, lottoNumber]);

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

      { 1 && (
        <>
          <Container style={{ position: "relative", top: "-10px", paddingBottom:"100px"}}>
            <Row>
                    <Col>
                    <img style={{width:"400px", display:"inline-block"}} src={lotimage}></img>
                    </Col>

            <Col>
                    <Form>
                            <InputGroup className="mb-3">
                                    <InputGroup.Text id="basic-addon1">Current Lotto Id</InputGroup.Text>
                                    <Form.Control
                                            placeholder="Username"
                                            aria-label="Username"
                                            aria-describedby="basic-addon1"
                                            value = {lottoId}
                                    />
                            </InputGroup>
                            <InputGroup className="mb-3">
                                    <InputGroup.Text id="basic-addon1">Your Lotto Number</InputGroup.Text>
                                    <Form.Control
                                            placeholder="Username"
                                            aria-label="Username"
                                            aria-describedby="basic-addon1"
                                            value = {lottoNumber}
                                    />
                            </InputGroup>

            <Button onClick={()=>pickLottoNumber(0)} active={lottoNumber == 0}> 0 </Button>
            <Button onClick={()=>pickLottoNumber(1)} active={lottoNumber == 1}> 1 </Button>
            <Button onClick={()=>pickLottoNumber(2)} active={lottoNumber == 2}> 2 </Button>
            <Button onClick={()=>pickLottoNumber(3)} active={lottoNumber == 3}> 3 </Button>
            <Button onClick={()=>pickLottoNumber(4)} active={lottoNumber == 4}> 4 </Button>
            <Button onClick={()=>pickLottoNumber(5)} active={lottoNumber == 5}> 5 </Button>
            <Button onClick={()=>pickLottoNumber(6)} active={lottoNumber == 6}> 6 </Button>
            <Button onClick={()=>pickLottoNumber(7)} active={lottoNumber == 7}> 7 </Button>
            <Button onClick={()=>pickLottoNumber(8)} active={lottoNumber == 8}> 8 </Button>
            <Button onClick={()=>pickLottoNumber(9)} active={lottoNumber == 9}> 9 </Button>
                    </Form>
            </Col>
            </Row>
            <Form>
                  <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Current Randomness Commitment</Form.Label>
                    <Form.Control as="textarea" rows={3} value ={commitment}/>
                  </Form.Group>
            </Form>
            <Form>
                  <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Current Randomness Signature</Form.Label>
                    <Form.Control as="textarea" rows={3} value ={randomness}/>
                  </Form.Group>
            </Form>
            <Form>
                  <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Commands</Form.Label>
                    <Form.Control as="textarea" rows={3} value ={witness}/>
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
