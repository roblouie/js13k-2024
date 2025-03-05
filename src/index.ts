import { controls } from '@/core/controls';
import { initTextures } from '@/textures';
import { GameState } from '@/game-states/game.state';
import './mobile-controls/gameboy-d-pad/gameboy-d-pad'
import './mobile-controls/gameboy-button/gameboy-button'

let previousTime = 0;
const interval = 1000 / 60;
// tmpl.innerHTML = `<div style="font-size: 30px; text-align: center; position: absolute; bottom: 20px; width: 100%;">Click to Start</div>`;
document.onclick = async () => {
    tmpl.requestPointerLock();
    // tmpl.innerHTML = '';

  document.querySelector('.flashlight')!.addEventListener('touchstart', () => controls.keyMap.set('KeyF', true));
  document.querySelector('.flashlight')!.addEventListener('touchend', () => controls.keyMap.set('KeyF', false));


  document.querySelector('gameboy-d-pad')!.addEventListener('touchend', () => {
    controls.keyMap.set('KeyW', false);
    controls.keyMap.set('KeyA', false);
    controls.keyMap.set('KeyS', false);
    controls.keyMap.set('KeyD', false);
  });

  document.querySelector('gameboy-d-pad')!.addEventListener('directionchange', (event: any) => {
    controls.keyMap.set('KeyW', false);
    controls.keyMap.set('KeyA', false);
    controls.keyMap.set('KeyS', false);
    controls.keyMap.set('KeyD', false);

    switch(event.detail.direction) {
      case '':
        break;
      case 'left':
        controls.keyMap.set('KeyA', true)
        break;
      case 'right':
        controls.keyMap.set('KeyD', true)
        break;
      case 'up':
        controls.keyMap.set('KeyW', true)
        break;
      case 'down':
        controls.keyMap.set('KeyS', true)
        break;
      case 'up left':
        controls.keyMap.set('KeyW', true)
        controls.keyMap.set('KeyA', true)
        break;
      case 'up right':
        controls.keyMap.set('KeyW', true)
        controls.keyMap.set('KeyD', true)
        break;
      case 'down left':
        controls.keyMap.set('KeyS', true)
        controls.keyMap.set('KeyA', true)
        break;
      case 'down right':
        controls.keyMap.set('KeyS', true)
        controls.keyMap.set('KeyD', true)
        break;
    }
  });

    await initTextures();

    const gameState = new GameState();
    gameState.onEnter();

    draw(0);

    document.onclick = () => {
      document.querySelector('body').requestFullscreen()
    };

  function draw(currentTime: number) {
    const delta = currentTime - previousTime;

    if (delta >= interval) {
      previousTime = currentTime - (delta % interval);

      controls.queryController();
      gameState.onUpdate();
    }
    requestAnimationFrame(draw);
  }
};

