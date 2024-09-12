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
import { Elevator } from '@/modeling/elevator';
import { MoldableCubeGeometry } from '@/engine/moldable-cube-geometry';
import { makeHotel } from '@/modeling/hotel';
import { EnhancedDOMPoint } from '@/engine/enhanced-dom-point';
import { LeverDoorObject3d } from '@/lever-door';
import { AiNavPoints, items, makeNavPoints } from '@/ai/ai-nav-points';
import { Enemy } from '@/ai/enemy-ai';
import { lightInfo } from '@/light-info';
import { audioContext, biquadFilter, SimplestMidiRev2 } from '@/engine/audio/simplest-midi';
import { elevatorDoor1, elevatorDoorTest, elevatorMotionRev1, footstep, hideSound } from '@/sounds';
import { FreeCam } from '@/core/free-cam';

export class GameState implements State {
  player: FreeCam;
  scene: Scene;
  gridFaces: Set<Face>[] = [];

  doors: LeverDoorObject3d[];
  enemy: Enemy;

  elevator: Elevator;

  hasPlayerLeftElevator = false;
  hasEnemySpawned = false;

  sfxPlayer = new SimplestMidiRev2();
  isGameEnded = false;

  constructor() {
    this.sfxPlayer.volume_.connect(biquadFilter);
    this.scene = new Scene();
    //this.player = new FreeCam(new Camera(Math.PI / 3, 16 / 9, 1, 500));

    this.doors = [
      // 1301 door
      new LeverDoorObject3d(48, 4.75, 33.75, -1, -1, true),

      // 1302 door
      new LeverDoorObject3d(48, 4.75, 68.75, -1, -1, true),

      // 1303 door
      new LeverDoorObject3d(48, 4.75, 103.75, -1, -1, true),

      // 1304 door
      new LeverDoorObject3d(-4, 4.75, 26.25, 1, 1, true),

      // 1305 door
      new LeverDoorObject3d(4, 4.75, 33.75, -1, -1, true),

      // 1306 door
      new LeverDoorObject3d(-4, 4.75, 61.25, 1, 1, true),

      // 1307 door
      new LeverDoorObject3d(4, 4.75, 68.75, -1, -1, true),

      // 1308 door
      new LeverDoorObject3d(-4, 4.75, 96.25, 1, 1, true),

      // 1309 door
      new LeverDoorObject3d(4, 4.75, 103.75, -1, -1, true),

      // 1310 door
      new LeverDoorObject3d(-48, 4.75, 26.25, 1, 1, true),

      // 1311 door
      new LeverDoorObject3d(-48, 4.75, 61.25, 1, 1, true),

      // 1312 door
      new LeverDoorObject3d(-48, 4.75, 96.25, 1, 1, true),

      // 1313 Door Left
      new LeverDoorObject3d(2.5, 4.75, 124, -1, -1, false, true),
      // 1313 Door Right
      new LeverDoorObject3d(-2.5, 4.75, 124, 1, -1, false, true),
    ];


    const firstKeyRoomNum = makeNavPoints(this.doors).roomNumber;
    this.player = new FreeCam(new Camera(Math.PI / 3, 16 / 9, 1, 500), AiNavPoints[0]);

    this.enemy = new Enemy();

    this.elevator = new Elevator();
  }

  onEnter() {
    const floor = new Mesh(new MoldableCubeGeometry(180, 1, 180, 20, 1, 20).spreadTextureCoords(5, 5).translate_(0, 0, 64).done_(), materials.redCarpet);
    const ceiling = new Mesh(new MoldableCubeGeometry(170, 1, 160).translate_(0, 12, 65).done_().spreadTextureCoords(5, 5), materials.ceilingTiles);
    // Move hotel layout to just outside the elevator
    const hotelRender = new Mesh(makeHotel(true).translate_(0, 0, 6).done_(), materials.wallpaper);
    const hotelCollision = new Mesh(makeHotel().translate_(0, 0, 6).done_(), materials.wallpaper);

    this.scene.add_(...this.elevator.meshes, ceiling, floor, hotelRender, ...this.doors, this.enemy.model_, ...items.map(i => i.mesh));
    this.gridFaces = build2dGrid(meshToFaces([floor, hotelCollision, this.elevator.bodyCollision]));
    this.player.cameraRotation.set(0, Math.PI, 0);

    setTimeout(() => {
      this.elevator.isOpenTriggered = true;
      this.playElevatorSound();
    }, 7_000);
  }

  playerDoorDifference = new EnhancedDOMPoint();
  playerHidingPlaceDifference = new EnhancedDOMPoint();

  onUpdate() {
    tmpl.innerHTML = '';

    this.player.update(this.gridFaces);
    this.enemy.update_(this.player);
    this.elevator.update();
    this.scene.updateWorldMatrix();
    render(this.player.camera, this.scene);

    // tmpl.innerHTML += `PLAYER NAV: ${this.player.closestNavPoint.name}<br/>`
    // tmpl.innerHTML += `ENEMY AT: ${this.enemy.currentNode.name}<br/>`
    // tmpl.innerHTML += `ENEMY HEADED TO: ${this.enemy.nextNode.name}<br/>`

    if (!this.elevator.isOpen) {
      // findWallCollisionsFromList(this.elevator.doorCollision, this.player);
    }

      [this.player.closestNavPoint.door, this.doors[12], this.doors[13]].forEach((door, i) => {
      if (door) {
        const distance = this.playerDoorDifference.subtractVectors(this.player.feetCenter, door.placedPosition).magnitude;
        if (door.openClose === -1 && !door.isAnimating && distance < 7) {
          // findWallCollisionsFromList(door.closedDoorCollision, this.player)
        }

        if (distance < 8) {
          // tmpl.innerHTML += ` DOOR ${i} X: ${door.doorData.placedPosition.x}, Y: ${door.doorData.placedPosition.y} Z: ${door.doorData.placedPosition.z}<br/>`;
          // tmpl.innerHTML += `DISTANCE ${i}: ${distance}<br/>`

          const direction = this.player.normal.dot(this.playerDoorDifference.normalize_());
          // tmpl.innerHTML += `DIRECTION: ${direction}<br/>`
          if (distance < 1 || direction < -0.77) {

            // tmpl.innerHTML += `<div style="font-size: 30px; text-align: center; position: absolute; bottom: 20px; width: 100%;">${door.openClose === -1 ? 'Open' : 'Close'} Door</div>`;
            if (controls.isConfirm) {
              door.pullLever();
            }
          }
        }
      }
      });

     this.doors.forEach(door => {
        if (door.isAnimating) {
          door.update_();
        }
     });

      const hidingPlace = this.player.closestNavPoint.hidingPlace;
      if (hidingPlace) {
        const distance = this.playerHidingPlaceDifference.subtractVectors(this.player.camera.position, hidingPlace.position).magnitude;
        // tmpl.innerHTML += `PLAYER POS: ${this.player.camera.position_.x}, ${this.player.camera.position_.y}, ${this.player.camera.position_.z}<br>`
        // tmpl.innerHTML += `HIDING PLACE DISTANCE: ${distance}`;
        if (distance < 8) {
          const direction = this.player.normal.dot(this.playerHidingPlaceDifference.normalize_());
          if (direction < -0.77 && !this.player.isHiding) {
            // tmpl.innerHTML += `<div style="font-size: 30px; text-align: center; position: absolute; bottom: 20px; width: 100%;">Hide</div>`;
            if (controls.isConfirm && !controls.prevConfirm) {
              this.player.hide(hidingPlace);
            }
          }
        }
      }

    // Only really have a couple of events so handle them with booleans even though it kind of sucks
    if (!this.hasPlayerLeftElevator) {
      if (new EnhancedDOMPoint().subtractVectors(this.player.feetCenter, AiNavPoints[0].position).magnitude > 17) {
        this.hasPlayerLeftElevator = true;
        this.elevator.isCloseTriggered = true;
        this.playElevatorSound();
      }
    }

    if (this.hasPlayerLeftElevator && this.player.feetCenter.z < 3) {
      this.player.isHiding = true;
      tmpl.innerHTML += `<div style="font-size: 40px; text-align: center; position: absolute; bottom: 20px; width: 100%;">You Win!</div>`;
      if (!this.isGameEnded) {
        this.isGameEnded = true;
        this.elevator.isCloseTriggered = true;
        this.playElevatorSound();
      }
    }
  }

  playElevatorSound() {
    // this.player.sfxPlayer.playNote(audioContext.currentTime, 60, 70, elevatorDoor1, audioContext.currentTime + 4);
    // this.player.sfxPlayer.playNote(audioContext.currentTime + 0.5, 60, 70, footstep, audioContext.currentTime + 2.5);
    // this.player.sfxPlayer.playNote(audioContext.currentTime + 1.8, 60, 70, footstep, audioContext.currentTime + 2.5);
    // this.sfxPlayer.playNote(audioContext.currentTime, 60, 70, elevatorDoorTest, audioContext.currentTime + 1);
  }

}
