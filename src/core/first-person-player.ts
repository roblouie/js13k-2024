import { Camera } from '@/engine/renderer/camera';
import { EnhancedDOMPoint } from '@/engine/enhanced-dom-point';
import { Face } from '@/engine/physics/face';
import { controls } from '@/core/controls';
import {
  findWallCollisionsFromList, getGridPositionWithNeighbors,
} from '@/engine/physics/surface-collision';
import { PathNode } from '@/ai/path-node';
import { HidingPlace } from '@/hiding-place';
import { audioContext, biquadFilter, compressor, SimplestMidiRev2 } from '@/engine/audio/simplest-midi';
import { flashlightSound, hideSound } from '@/sounds';
import { lightInfo } from '@/light-info';

class Sphere {
  center: EnhancedDOMPoint;
  radius: number;

  constructor(center: EnhancedDOMPoint, radius: number) {
    this.center = center;
    this.radius = radius;
  }
}

export class FirstPersonPlayer {
  feetCenter = new EnhancedDOMPoint();
  velocity = new EnhancedDOMPoint();
  isFrozen_ = false;
  closestNavPoint: PathNode;

  camera: Camera;
  cameraRotation = new EnhancedDOMPoint();
  collisionSphere: Sphere;
  isHiding = false;
  hidFrom = new EnhancedDOMPoint();
  differenceFromNavPoint = new EnhancedDOMPoint();
  listener: AudioListener;
  sfxPlayer: SimplestMidiRev2;
  isFlashlightOn = false;
  heldKeyRoomNumber?: number;
  normal = new EnhancedDOMPoint();

  health = 100;
  sprint = 100;

  constructor(camera: Camera, startingPoint: PathNode) {
    this.sfxPlayer = new SimplestMidiRev2();
    this.sfxPlayer.volume_.connect(compressor);
    this.closestNavPoint = startingPoint;
    this.feetCenter.set(2, 2.5, 6);
    this.collisionSphere = new Sphere(this.feetCenter, 2);
    this.camera = camera;
    this.listener = audioContext.listener;

    const rotationSpeed = 0.002;
    controls.onMouseMove(mouseMovement => {
      // if (!this.isHiding) {
        this.cameraRotation.x += mouseMovement.y * -rotationSpeed;
        this.cameraRotation.y += mouseMovement.x * -rotationSpeed;
        this.cameraRotation.x = Math.min(Math.max(this.cameraRotation.x, -Math.PI / 2), Math.PI / 2)
        this.cameraRotation.y = this.cameraRotation.y % (Math.PI * 2);
      // }
    });
  }



  hide(hidingPlace: HidingPlace) {
    this.hidFrom.set(this.feetCenter);
    this.isHiding = true;
    this.isFrozen_ = true;
    this.camera.position.set(hidingPlace.position);
    this.cameraRotation.set(hidingPlace.cameraRotation);
    this.sfxPlayer.playNote(audioContext.currentTime, 30, 40, hideSound, audioContext.currentTime + 1);
  }

  unhide() {
    this.isHiding = false;
    this.isFrozen_ = false;
    this.feetCenter.set(this.hidFrom);
    this.sfxPlayer.playNote(audioContext.currentTime, 38, 40, hideSound, audioContext.currentTime + 1);
  }

  update(gridFaces: Set<Face>[]) {
    if (this.heldKeyRoomNumber) {
      tmpl.innerHTML += `<div style="font-size: 20px; text-align: center; position: absolute; bottom: 40px; right: 80px;">🗝️ #${this.heldKeyRoomNumber}</div>`;
    }

    let smallestDistance = Infinity;
    [this.closestNavPoint, ...this.closestNavPoint.getPresentSiblings()].forEach(point => {
      const difference = new EnhancedDOMPoint().subtractVectors(this.feetCenter, point.position);
      const distance = difference.magnitude;
      if (distance < smallestDistance) {
        this.closestNavPoint = point;
        smallestDistance = distance;
        this.differenceFromNavPoint = difference;
      }
    });

    // tmpl.innerHTML += `PLAYER NODE DIFF: ${this.differenceFromNavPoint.x}, ${this.differenceFromNavPoint.z}<br>`;

    if (!this.isFrozen_) {
      this.updateVelocityFromControls();
    }

    if (!this.isHiding) {
      // this.velocity.y -= 0.008; // gravity

      const playerGridPositions = getGridPositionWithNeighbors(this.feetCenter, gridFaces.length);

      playerGridPositions.forEach(p => findWallCollisionsFromList(gridFaces[p], this));

      //findWallCollisionsFromList(faces, this);
      this.feetCenter.add_(this.velocity);

      this.camera.position.set(this.feetCenter);
      this.camera.position.y += 3.5;

    } else if (controls.isConfirm && !controls.prevConfirm) {
      this.unhide();
    }

    this.camera.setRotation_(...this.cameraRotation.toArray());

    this.normal.set(0, 0, -1);
    this.normal.set(this.camera.rotationMatrix.transformPoint(this.normal));
    lightInfo.spotLightPosition.set(this.camera.position);
    lightInfo.spotLightDirection.set(this.normal);

    if (!this.isFlashlightOn || this.isHiding) {
      lightInfo.spotLightPosition.y = -100;
    }

    this.camera.updateWorldMatrix();
    this.updateAudio();
  }

  protected updateVelocityFromControls() {
    const speed = 0.24;

    const depthMovementZ = Math.cos(this.cameraRotation.y) * controls.inputDirection.y * speed;
    const depthMovementX = Math.sin(this.cameraRotation.y) * controls.inputDirection.y * speed;

    const sidestepZ = Math.cos(this.cameraRotation.y + Math.PI / 2) * controls.inputDirection.x * speed;
    const sidestepX = Math.sin(this.cameraRotation.y + Math.PI / 2) * controls.inputDirection.x * speed;

    this.velocity.z = depthMovementZ + sidestepZ;
    this.velocity.x = depthMovementX + sidestepX;

    if (controls.isFlashlight && !controls.prevFlash) {
      this.sfxPlayer.playNote(audioContext.currentTime, 31 + (this.isFlashlightOn ? 0 : 10), 40, flashlightSound, audioContext.currentTime + 1);
      this.isFlashlightOn = !this.isFlashlightOn;
    }
  }

  private updateAudio() {
    if (this.listener.positionX) {
      this.listener.positionX.value = this.camera.position.x;
      this.listener.positionY.value = this.camera.position.y;
      this.listener.positionZ.value = this.camera.position.z;

      const lookingDirection = new EnhancedDOMPoint(0, 0, -1);
      const result_ = this.camera.rotationMatrix.transformPoint(lookingDirection);

      this.listener.forwardX.value = result_.x;
      this.listener.forwardY.value = result_.y;
      this.listener.forwardZ.value = result_.z;
    }
  }
}
