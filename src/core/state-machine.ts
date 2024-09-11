import { State } from './state';

export class StateMachine {
  private currentState: State;

  constructor(initialState: State, ...enterArgs: any) {
    this.currentState = initialState;
    this.currentState.onEnter?.(...enterArgs);
  }

  setState(newState: State, ...enterArgs: any) {
    this.currentState.onLeave?.();
    this.currentState = { onUpdate: () => {} };
    newState.onEnter?.(...enterArgs);
    this.currentState = newState;
  }

  getState() {
    return this.currentState;
  }
}
