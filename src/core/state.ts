export interface State {
  onUpdate: (...args: any[]) => void;
  onEnter?: Function;
  onLeave?: Function;
}
