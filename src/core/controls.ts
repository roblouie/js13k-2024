import { EnhancedDOMPoint } from '@/engine/enhanced-dom-point';

class Controls {
  isConfirm = false;
  prevConfirm = false;
  inputDirection: EnhancedDOMPoint;
  private mouseMovement = new EnhancedDOMPoint();
  private onMouseMoveCallback?: (mouseMovement: EnhancedDOMPoint) => void;

  keyMap: Map<string, boolean> = new Map();

  constructor() {
    document.addEventListener('keydown', event => this.keyMap.set(event.code, true));
    document.addEventListener('keyup', event => this.keyMap.set(event.code, false));
    document.addEventListener('mousedown', () => this.keyMap.set('KeyE', true));
    document.addEventListener('mouseup', () => this.keyMap.set('KeyE', false));

    document.addEventListener('mousemove', event => {
      this.mouseMovement.x = event.movementX;
      this.mouseMovement.y = event.movementY;
      this.onMouseMoveCallback?.(this.mouseMovement);
    });
    this.inputDirection = new EnhancedDOMPoint();
  }

  onMouseMove(callback: (mouseMovement: EnhancedDOMPoint) => void) {
    this.onMouseMoveCallback = callback;
  }

  queryController() {
    this.prevConfirm = this.isConfirm;
    const leftVal = (this.keyMap.get('KeyA')) ? -1 : 0;
    const rightVal = (this.keyMap.get('KeyD')) ? 1 : 0;
    const upVal = (this.keyMap.get('KeyW')) ? -1 : 0;
    const downVal = (this.keyMap.get('KeyS')) ? 1 : 0;
    this.inputDirection.x = (leftVal + rightVal);
    this.inputDirection.y = (upVal + downVal);
    this.isConfirm = !!this.keyMap.get('KeyE');
  }
}

export const controls = new Controls();
