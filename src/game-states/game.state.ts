import { State } from '@/core/state';
import { controls } from '@/core/controls';
import { FirstPersonPlayer } from '@/core/first-person-player';
import { Scene } from '@/engine/renderer/scene';
import { Face } from '@/engine/physics/face';
import { Camera } from '@/engine/renderer/camera';
import { materials } from '@/textures';
import { PlaneGeometry } from '@/engine/plane-geometry';
import { Mesh } from '@/engine/renderer/mesh';
import { meshToFaces } from '@/engine/physics/parse-faces';
import { build2dGrid } from '@/engine/physics/surface-collision';
import { render } from '@/engine/renderer/renderer';

export class GameState implements State {
  player: FirstPersonPlayer;
  scene: Scene;
  gridFaces: Set<Face>[] = [];

  constructor() {
    this.scene = new Scene();
    this.player = new FirstPersonPlayer(new Camera(Math.PI / 3, 16 / 9, 1, 500));
  }

  onEnter() {
    const floor = new Mesh(new PlaneGeometry(1024, 1024, 255, 255).spreadTextureCoords(5, 5), materials.patternedWallpaper);
    this.scene.add_(floor);
    this.gridFaces = build2dGrid(meshToFaces([floor]));
    tmpl.innerHTML = '';
    tmpl.addEventListener('click', () => {
      console.log('clicked');
      tmpl.requestPointerLock();
    });
    this.player.cameraRotation.set(0, 90, 0);
  }

  onUpdate() {
    this.player.update(this.gridFaces);
    this.scene.updateWorldMatrix();
    render(this.player.camera, this.scene);
  }
}
