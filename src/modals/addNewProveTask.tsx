// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useState } from "react";
import { Container, Form, Spinner } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  ModalCommon,
  ModalCommonProps,
  ModalStatus,
  WaitingForResponseBar,
} from "./base";
import { addProvingTask, loadStatus, selectTasks } from "../data/statusSlice";
import { loginL1AccountAsync, selectL1Account } from "../data/accountSlice";
import { withBrowserConnector} from "web3subscriber/src/client";

import "./style.scss";

import {
  ProvingParams,
  ZkWasmUtil,
  WithSignature,
} from "zkwasm-service-helper";
import {DelphinusBrowserConnector} from "web3subscriber/src/provider";

interface NewWASMImageProps {
  md5: string;
  inputs: string[]; // Length of Data
  witness: string[]; // Data
  OnTaskSubmitSuccess?: (receipt: any) => void;
  OnTaskSubmitFail?: (error: any) => void;
}

export async function signMessage(message: string) {
  let signature = await withBrowserConnector(async (provider: DelphinusBrowserConnector) => {
    if (!provider) {
      throw new Error("No provider found!");
    }
    /* FIXME: append account pubkey at the end of the message
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

export function NewProveTask(props: NewWASMImageProps) {
  const dispatch = useAppDispatch();
  let account = useAppSelector(selectL1Account);

  const [message, setMessage] = React.useState<string>("");
  const [status, setStatus] = React.useState<ModalStatus>(
    ModalStatus.PreConfirm
  );

  const prepareNewProveTask = async function () {
    let info: ProvingParams = {
      user_address: account!.address.toLowerCase(),
      md5: props.md5,
      public_inputs: props.inputs,
      private_inputs: props.witness,
    };

    let msgString = ZkWasmUtil.createProvingSignMessage(info);

    let signature: string;
    try {
      setMessage("Waiting for signature...");
      signature = await signMessage(msgString);
      setMessage("Submitting new prove task...");
    } catch (e: unknown) {
      console.log("error signing message", e);
      setStatus(ModalStatus.PreConfirm);
      setMessage("Error signing message");
      throw Error("Unsigned Transaction");
    }

    let task: WithSignature<ProvingParams> = {
      ...info,
      signature: signature,
    };

    return task;
  };

  const addNewProveTask = async function () {
    let task = await prepareNewProveTask();

    dispatch(addProvingTask(task))
      .unwrap()
      .then((res) => {
        if (props.OnTaskSubmitSuccess) props.OnTaskSubmitSuccess(res);

        console.log(res);
        setStatus(ModalStatus.PostConfirm);
      })
      .catch((err) => {
        if (props.OnTaskSubmitFail) props.OnTaskSubmitFail(err);
        console.log("new prove task error", err);
        setMessage("Error creating new prove task.");
        setStatus(ModalStatus.PreConfirm);
      })
      .finally(() => {
        let query = {
          user_address: account!.address,
          md5: props.md5,
          id: "",
          tasktype: "Prove",
          taskstatus: "",
        };
        console.log("update", query);
        dispatch(loadStatus(query));
      });
  };

  let content = (
    <>
      <Container>
        <Form.Group className="mb-3 position-relative">
          <Form.Label variant="dark">Image ID(MD5):</Form.Label>
          <Form.Control
            placeholder="Select an image"
            autoComplete="off"
            value={props.md5}
            id="instance-md5"
            name="md5"
            type="text"
            multiple={false}
            disabled={true}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label variant="dark">Public Inputs:</Form.Label>
          <Form.Control
            name="inputs"
            type="text"
            value={props.inputs}
            multiple={false}
            disabled={true}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label variant="dark">Witness Inputs:</Form.Label>
          <Form.Control
            name="inputs"
            type="text"
            value={props.witness}
            multiple={false}
          />
        </Form.Group>
      </Container>
    </>
  );

  let modalprops: ModalCommonProps = {
    btnLabel: <button className="sell-button">Submit Proof</button>,
    title: "Submit Your Game Play",
    childrenClass: "",
    handleConfirm: function (): void {
      addNewProveTask();
    },
    handleClose: () => {
      setStatus(ModalStatus.PreConfirm);
    },
    children: content,
    valid: true,
    message: message,
    status: status,
    confirmLabel: "Confirm",
  };
  return ModalCommon(modalprops);
}
