import { State } from '@/core/state';
import { controls } from '@/core/controls';

export class GameState implements State {
  ballImage = new Image();
  ballSize = 100;
  ballPosition = new DOMPoint(100, 100);
  ballVelocity = new DOMPoint(10, 10);

  constructor() {
    this.ballImage.src = 'ball.png';
  }

  // Make sure ball starts at the same spot when game is entered
  onEnter() {
    this.ballPosition = new DOMPoint(100, 100);
    this.ballVelocity = new DOMPoint(10, 10);
  }

  onUpdate() {
    // Update velocity from controller
    this.ballVelocity.x += controls.inputDirection.x;
    this.ballVelocity.y += controls.inputDirection.y;

    this.ballPosition.x += this.ballVelocity.x;
    this.ballPosition.y += this.ballVelocity.y;

    // Apply Drag
    this.ballVelocity.x *= 0.99;
    this.ballVelocity.y *= 0.99;

    // Clamp top speed
    // this.ballVelocity = clamp(this.ballVelocity, 25);

    // render(this.ballPosition, this.ballVelocity);
  }
}
