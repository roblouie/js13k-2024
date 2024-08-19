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
import { buildElevator } from '@/modeling/elevator';
import { MoldableCubeGeometry } from '@/engine/moldable-cube-geometry';
import { buildRoom } from '@/modeling/room';

export class GameState implements State {
  player: FirstPersonPlayer;
  scene: Scene;
  gridFaces: Set<Face>[] = [];

  constructor() {
    this.scene = new Scene();
    this.player = new FirstPersonPlayer(new Camera(Math.PI / 3, 16 / 9, 1, 500));
  }

  onEnter() {
    const floor = new Mesh(new PlaneGeometry(1024, 1024, 255, 255).spreadTextureCoords(5, 5), materials.redCarpet);
    const ceiling = new Mesh(new MoldableCubeGeometry(1024, 1, 1024).translate_(0, 12).done_().spreadTextureCoords(5, 5), materials.ceilingTiles);
    const room = buildRoom()

    const elevatorParts = buildElevator();
    this.scene.add_(floor, ...elevatorParts, ceiling, ...room);
    this.gridFaces = build2dGrid(meshToFaces([floor, ...elevatorParts, ...room]));
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
