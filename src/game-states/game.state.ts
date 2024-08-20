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
import { buildElevator, ElevatorDepth } from '@/modeling/elevator';
import { MoldableCubeGeometry } from '@/engine/moldable-cube-geometry';
import { buildRoom, RoomDepth } from '@/modeling/room';
import { FreeCam } from '@/core/free-cam';
import { makeHotel } from '@/modeling/hotel';

export class GameState implements State {
  player: FirstPersonPlayer | FreeCam;
  scene: Scene;
  gridFaces: Set<Face>[] = [];

  constructor() {
    this.scene = new Scene();
    //this.player = new FreeCam(new Camera(Math.PI / 3, 16 / 9, 1, 500));
    this.player = new FirstPersonPlayer(new Camera(Math.PI / 3, 16 / 9, 1, 500))
  }

  onEnter() {
    const floor = new Mesh(new PlaneGeometry(180, 180, 20, 20).spreadTextureCoords(5, 5).translate_(0, 0, 64).done_(), materials.redCarpet);
    const ceiling = new Mesh(new MoldableCubeGeometry(170, 1, 120).translate_(0, 12, 65).done_().spreadTextureCoords(5, 5), materials.ceilingTiles);
    // Move hotel layout to just outside the elevator
    const hotel = new Mesh(makeHotel().translate_(0, 0, 6).done_(), materials.wallpaper);
    const elevator = buildElevator();

    // const elevatorParts = buildElevator();
    this.scene.add_(ceiling, floor, hotel, ...elevator);
    this.gridFaces = build2dGrid(meshToFaces([floor, hotel]));
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
