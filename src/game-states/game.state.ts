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
import { build2dGrid, findWallCollisionsFromList } from '@/engine/physics/surface-collision';
import { render } from '@/engine/renderer/renderer';
import { buildElevator, ElevatorDepth } from '@/modeling/elevator';
import { MoldableCubeGeometry } from '@/engine/moldable-cube-geometry';
import { makeHotel } from '@/modeling/hotel';
import { EnhancedDOMPoint } from '@/engine/enhanced-dom-point';
import { DoorData, LeverDoorObject3d } from '@/lever-door';
import { enemy } from '@/ai/enemy-ai';

export class GameState implements State {
  player: FirstPersonPlayer;
  scene: Scene;
  gridFaces: Set<Face>[] = [];

  doors: LeverDoorObject3d[];
  enemy = enemy;
  enemyModel: Mesh;

  constructor() {
    this.scene = new Scene();
    //this.player = new FreeCam(new Camera(Math.PI / 3, 16 / 9, 1, 500));
    this.player = new FirstPersonPlayer(new Camera(Math.PI / 3, 16 / 9, 1, 500))

    this.doors = [
      // 1304 door
      new LeverDoorObject3d(new DoorData(new EnhancedDOMPoint(-3.75, 4.5, 26.25), 1, 1, true)),

      // 1305 door
      new LeverDoorObject3d(new DoorData(new EnhancedDOMPoint(3.75, 4.5, 33.75), -1, -1, true)),

      // 1313 Door Left
      new LeverDoorObject3d(new DoorData(new EnhancedDOMPoint(3, 4.5, 124), -1, -1, false)),
      // 1313 Door Right
      new LeverDoorObject3d(new DoorData(new EnhancedDOMPoint(-3, 4.5, 124), 1, -1, false)),
    ];

    this.doors[0].doorData.isLocked = true;

    this.enemyModel = new Mesh(new MoldableCubeGeometry(6, 6, 6).translate_(0, 3).done_(), materials.tinyTiles);
  }

  onEnter() {
    const floor = new Mesh(new PlaneGeometry(180, 180, 20, 20).spreadTextureCoords(5, 5).translate_(0, 0, 64).done_(), materials.redCarpet);
    const ceiling = new Mesh(new MoldableCubeGeometry(170, 1, 120).translate_(0, 12, 65).done_().spreadTextureCoords(5, 5), materials.ceilingTiles);
    // Move hotel layout to just outside the elevator
    const hotel = new Mesh(makeHotel().translate_(0, 0, 6).done_(), materials.wallpaper);
    const elevator = buildElevator();

    this.scene.add_(ceiling, floor, hotel, ...elevator, ...this.doors.flatMap(door => [door.doorData]), this.enemyModel);
    this.gridFaces = build2dGrid(meshToFaces([floor, hotel]));
    tmpl.innerHTML = '';
    tmpl.addEventListener('click', () => {
      tmpl.requestPointerLock();
    });
    this.player.cameraRotation.set(0, 90, 0);
  }

  playerDoorDifference = new EnhancedDOMPoint();

  onUpdate() {
    this.player.update(this.gridFaces);
    this.enemy.update();
    this.enemyModel.position_.set(this.enemy.position);
    this.scene.updateWorldMatrix();
    render(this.player.camera, this.scene);

    //TODO: Probably change how this works, otherwise I might clear other useful HUD stuff
    tmpl.innerHTML = '';

    tmpl.innerHTML += `PLAYER X: ${this.player.feetCenter.x}, Y: ${this.player.feetCenter.y} Z: ${this.player.feetCenter.z}<br/>`;

    this.doors.forEach((door, i) => {

      const distance = this.playerDoorDifference.subtractVectors(this.player.feetCenter, door.doorData.placedPosition).magnitude;


      if (door.openClose === -1 && !door.isAnimating && distance < 7) {
        findWallCollisionsFromList(door.closedDoorCollision, this.player)
      }

      if (distance < 8) {
        tmpl.innerHTML += ` DOOR ${i} X: ${door.doorData.placedPosition.x}, Y: ${door.doorData.placedPosition.y} Z: ${door.doorData.placedPosition.z}<br/>`;
        tmpl.innerHTML += `DISTANCE ${i}: ${distance}<br/>`

        const direction = this.player.normal.dot(this.playerDoorDifference.normalize_());
        tmpl.innerHTML += `DIRECTION ${i}: ${direction}<br/>`
        if (distance < 1 || direction > 0.77) {
          if (door.doorData.isLocked) {
            tmpl.innerHTML += `<div style="font-size: 20px; text-align: center; position: absolute; bottom: 20px; width: 100%;">🔒 &nbsp; Locked</div>`;
          } else {
            tmpl.innerHTML += `<div style="font-size: 20px; text-align: center; position: absolute; bottom: 20px; width: 100%;">🅴 &nbsp; Door</div>`;
            if (controls.isConfirm) {
              door.pullLever();
            }
          }
        }
      }

      door.update();
    });
  }
}
