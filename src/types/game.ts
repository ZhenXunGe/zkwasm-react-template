import * as Gameplay from "../js/gameplay";

export type WasmInstance = typeof Gameplay;

export enum ActionType {
  Left = 0,
  Right = 1,
}

export interface State {
  position: number
}

export interface GameHistory {
  player_input: ActionType;
}
