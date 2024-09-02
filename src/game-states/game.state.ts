import { State } from '@/core/state';
import { controls } from '@/core/controls';
import { FirstPersonPlayer } from '@/core/first-person-player';
import { Scene } from '@/engine/renderer/scene';
import { Face } from '@/engine/physics/face';
import { Camera } from '@/engine/renderer/camera';
import { materials } from '@/textures';
import { Mesh } from '@/engine/renderer/mesh';
import { meshToFaces } from '@/engine/physics/parse-faces';
import { build2dGrid, findWallCollisionsFromList } from '@/engine/physics/surface-collision';
import { render } from '@/engine/renderer/renderer';
import { buildElevator, ElevatorDepth } from '@/modeling/elevator';
import { MoldableCubeGeometry } from '@/engine/moldable-cube-geometry';
import { makeHotel } from '@/modeling/hotel';
import { EnhancedDOMPoint } from '@/engine/enhanced-dom-point';
import { DoorData, LeverDoorObject3d } from '@/lever-door';
import { AiNavPoints, makeNavPoints } from '@/ai/ai-nav-points';
import { Enemy } from '@/ai/enemy-ai';

export class GameState implements State {
  player: FirstPersonPlayer;
  scene: Scene;
  gridFaces: Set<Face>[] = [];

  doors: LeverDoorObject3d[];
  enemy: Enemy;

  constructor() {
    this.scene = new Scene();
    //this.player = new FreeCam(new Camera(Math.PI / 3, 16 / 9, 1, 500));

    this.doors = [
      // 1301 door
      new LeverDoorObject3d(new EnhancedDOMPoint(47.75, 4.5, 33.75), -1, -1, true),

      // 1302 door
      new LeverDoorObject3d(new EnhancedDOMPoint(47.75, 4.5, 68.75), -1, -1, true),

      // 1303 door
      new LeverDoorObject3d(new EnhancedDOMPoint(47.75, 4.5, 103.75), -1, -1, true),

      // 1304 door
      new LeverDoorObject3d(new EnhancedDOMPoint(-3.75, 4.5, 26.25), 1, 1, true),

      // 1305 door
      new LeverDoorObject3d(new EnhancedDOMPoint(3.75, 4.5, 33.75), -1, -1, true),

      // 1306 door
      new LeverDoorObject3d(new EnhancedDOMPoint(-3.75, 4.5, 61.25), 1, 1, true),

      // 1307 door
      new LeverDoorObject3d(new EnhancedDOMPoint(3.75, 4.5, 68.75), -1, -1, true),

      // 1308 door
      new LeverDoorObject3d(new EnhancedDOMPoint(-3.75, 4.5, 96.25), 1, 1, true),

      // 1309 door
      new LeverDoorObject3d(new EnhancedDOMPoint(3.75, 4.5, 103.75), -1, -1, true),

      // 1310 door
      new LeverDoorObject3d(new EnhancedDOMPoint(-47.75, 4.5, 26.25), 1, 1, true),

      // 1311 door
      new LeverDoorObject3d(new EnhancedDOMPoint(-47.75, 4.5, 61.25), 1, 1, true),

      // 1312 door
      new LeverDoorObject3d(new EnhancedDOMPoint(-47.75, 4.5, 96.25), 1, 1, true),

      // 1313 Door Left
      new LeverDoorObject3d(new EnhancedDOMPoint(3, 4.5, 124), -1, -1, false),
      // 1313 Door Right
      new LeverDoorObject3d(new EnhancedDOMPoint(-3, 4.5, 124), 1, -1, false),
    ];

    makeNavPoints(this.doors);

    this.player = new FirstPersonPlayer(new Camera(Math.PI / 3, 16 / 9, 1, 500), AiNavPoints[0])

    this.enemy = new Enemy(AiNavPoints[1]);
  }

  onEnter() {
    const floor = new Mesh(new MoldableCubeGeometry(180, 1, 180, 20, 1, 20).spreadTextureCoords(5, 5).translate_(0, 0, 64).done_(), materials.redCarpet);
    const ceiling = new Mesh(new MoldableCubeGeometry(170, 1, 120).translate_(0, 12, 65).done_().spreadTextureCoords(5, 5), materials.ceilingTiles);
    // Move hotel layout to just outside the elevator
    const hotelRender = new Mesh(makeHotel(true).translate_(0, 0, 6).done_(), materials.wallpaper);
    const hotelCollision = new Mesh(makeHotel().translate_(0, 0, 6).done_(), materials.wallpaper);
    const elevator = buildElevator();

    this.scene.add_(ceiling, floor, hotelRender, ...elevator, ...this.doors, this.enemy.model_);
    this.gridFaces = build2dGrid(meshToFaces([floor, hotelCollision]));
    tmpl.innerHTML = '';
    tmpl.addEventListener('click', () => {
      tmpl.requestPointerLock();
    });
    this.player.cameraRotation.set(0, 90, 0);
  }

  playerDoorDifference = new EnhancedDOMPoint();
  playerHidingPlaceDifference = new EnhancedDOMPoint();

  onUpdate() {
    //TODO: Probably change how this works, otherwise I might clear other useful HUD stuff
    tmpl.innerHTML = '';

    this.player.update(this.gridFaces);
    this.enemy.update_(this.player);
    this.scene.updateWorldMatrix();
    render(this.player.camera, this.scene);

    // tmpl.innerHTML += `PLAYER NAV: ${this.player.closestNavPoint.name}<br/>`
    // tmpl.innerHTML += `ENEMY AT: ${this.enemy.currentNode.name}<br/>`
    // tmpl.innerHTML += `ENEMY HEADED TO: ${this.enemy.nextNode.name}<br/>`

      const door = this.player.closestNavPoint.door;
      if (door) {
        const distance = this.playerDoorDifference.subtractVectors(this.player.feetCenter, door.placedPosition).magnitude;
        if (door.openClose === -1 && !door.isAnimating && distance < 7) {
          findWallCollisionsFromList(door.closedDoorCollision, this.player)
        }

        if (distance < 8) {
          // tmpl.innerHTML += ` DOOR ${i} X: ${door.doorData.placedPosition.x}, Y: ${door.doorData.placedPosition.y} Z: ${door.doorData.placedPosition.z}<br/>`;
          // tmpl.innerHTML += `DISTANCE ${i}: ${distance}<br/>`

          const direction = this.player.normal.dot(this.playerDoorDifference.normalize_());
          // tmpl.innerHTML += `DIRECTION ${i}: ${direction}<br/>`
          if (distance < 1 || direction > 0.77) {
            if (door.isLocked) {
              tmpl.innerHTML += `<div style="font-size: 20px; text-align: center; position: absolute; bottom: 20px; width: 100%;">🔒 &nbsp; Locked</div>`;
            } else if (this.enemy.currentNode.door === door) {
              tmpl.innerHTML += `<div style="font-size: 20px; text-align: center; position: absolute; bottom: 20px; width: 100%;">🚫</div>`;
            } else {
              tmpl.innerHTML += `<div style="font-size: 20px; text-align: center; position: absolute; bottom: 20px; width: 100%;">🅴 &nbsp; Door</div>`;
              if (controls.isConfirm) {
                door.pullLever();
              }
            }
          }
        }
      }

     this.doors.forEach(door => {
        if (door.isAnimating) {
          door.update_();
        }
     });

      const hidingPlace = this.player.closestNavPoint.hidingPlace;
      if (hidingPlace) {
        const distance = this.playerHidingPlaceDifference.subtractVectors(this.player.camera.position_, hidingPlace.position).magnitude;
        // tmpl.innerHTML += `PLAYER POS: ${this.player.camera.position_.x}, ${this.player.camera.position_.y}, ${this.player.camera.position_.z}<br>`
        // tmpl.innerHTML += `HIDING PLACE DISTANCE: ${distance}`;
        if (distance < 8) {
          const direction = this.player.normal.dot(this.playerHidingPlaceDifference.normalize_());
          if (direction > 0.77 && !this.player.isHiding) {
            tmpl.innerHTML += `<div style="font-size: 20px; text-align: center; position: absolute; bottom: 20px; width: 100%;">🅴 HIDE</div>`;
            if (controls.isConfirm && !controls.prevConfirm) {
              this.player.hide(hidingPlace);
            }
          }
        }
      }
  }
}
