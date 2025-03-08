import { EnhancedDOMPoint } from '@/engine/enhanced-dom-point';

class Controls {
  isConfirm = false;
  isFlashlight = false;
  prevConfirm = false;
  prevFlash = false;
  inputDirection: EnhancedDOMPoint;
  private mouseMovement = new EnhancedDOMPoint();
  private onMouseMoveCallback?: (mouseMovement: EnhancedDOMPoint) => void;

  mouseSensitivity = 0.001;
  touchSensitivity = 0.004;

  lastTouch = new EnhancedDOMPoint();
  lookTouchId: number | null = null;
  touchStartTime = 0;

  keyMap: Map<string, boolean> = new Map();

  constructor() {
    document.addEventListener('keydown', event => this.keyMap.set(event.code, true));
    document.addEventListener('keyup', event => this.keyMap.set(event.code, false));
    // document.addEventListener('mousedown', () => this.keyMap.set('KeyE', true));
    // document.addEventListener('mouseup', () => this.keyMap.set('KeyE', false));

    tmpl.addEventListener('touchstart', (e: TouchEvent) => {
      for (const touch of e.changedTouches) {
        if (touch.clientX > 200) { // to the right of the dpad
          this.lookTouchId = touch.identifier;
          this.lastTouch.set(touch.clientX, touch.clientY);
          this.touchStartTime = Date.now();
        }
      }
    });

    tmpl.addEventListener('touchmove', (e: TouchEvent) => {
      if (this.lookTouchId === null) {
        return;
      }

      for (const touch of e.changedTouches) {
        if (touch.identifier === this.lookTouchId) {
          const deltaX = touch.clientX - this.lastTouch.x;
          const deltaY = touch.clientY - this.lastTouch.y;

          this.lastTouch.set(touch.clientX, touch.clientY);

          this.mouseMovement.set(deltaX * this.touchSensitivity, deltaY * this.touchSensitivity);
          this.onMouseMoveCallback?.(this.mouseMovement);
        }
      }
    });

    const touchDistanceVector = new EnhancedDOMPoint();
    tmpl.addEventListener('touchend', (e: TouchEvent) => {
      for (const touch of e.changedTouches) {
        if (touch.identifier === this.lookTouchId) {
          this.lookTouchId = null;
          const duration = Date.now() - this.touchStartTime;
          touchDistanceVector.set(touch.clientX - this.lastTouch.x, touch.clientY - this.lastTouch.y)
          // const movedX = Math.abs(touch.clientX - this.lastTouch.x);
          // const movedY = Math.abs(touch.clientY - this.lastTouch.y);

          if (duration < 200 && touchDistanceVector.magnitude < 10) {
            this.keyMap.set('KeyE', true);
            setTimeout(() => this.keyMap.set('KeyE', false), 100);
          }
        }
      }
    })

    // document.addEventListener('mousemove', event => {
    //   this.mouseMovement.x = event.movementX * this.mouseSensitivity;
    //   this.mouseMovement.y = event.movementY * this.mouseSensitivity;
    //   this.onMouseMoveCallback?.(this.mouseMovement);
    // });
    this.inputDirection = new EnhancedDOMPoint();
  }

  onMouseMove(callback: (mouseMovement: EnhancedDOMPoint) => void) {
    this.onMouseMoveCallback = callback;
  }

  queryController() {
    this.prevConfirm = this.isConfirm;
    this.prevFlash = this.isFlashlight;
    const leftVal = (this.keyMap.get('KeyA')) ? -1 : 0;
    const rightVal = (this.keyMap.get('KeyD')) ? 1 : 0;
    const upVal = (this.keyMap.get('KeyW')) ? -1 : 0;
    const downVal = (this.keyMap.get('KeyS')) ? 1 : 0;
    this.inputDirection.x = (leftVal + rightVal);
    this.inputDirection.y = (upVal + downVal);
    this.isConfirm = !!this.keyMap.get('KeyE');
    this.isFlashlight = !!this.keyMap.get('KeyF');
  }
}

export const controls = new Controls();
