import { controls } from '@/core/controls';
import { initTextures } from '@/textures';
import { GameState } from '@/game-states/game.state';

let previousTime = 0;
const interval = 1000 / 60;
// (async () => {
  tmpl.innerHTML = 'CLICK TO START';
  document.onclick = async () => {
    tmpl.innerHTML = 'LOADING';
    tmpl.requestPointerLock();

    await initTextures();

    const gameState = new GameState();
    gameState.onEnter();

    draw(0);

    document.onclick = null;

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

