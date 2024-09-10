import { Object3d } from '@/engine/renderer/object-3d';
import { Mesh } from '@/engine/renderer/mesh';
import { Material } from '@/engine/renderer/material';
import { EnhancedDOMPoint } from '@/engine/enhanced-dom-point';
import { MoldableCubeGeometry } from '@/engine/moldable-cube-geometry';
import { Face } from '@/engine/physics/face';
import { meshToFaces } from '@/engine/physics/parse-faces';
import { materials } from '@/textures';
import { audioContext, biquadFilter, compressor, SimplestMidiRev2 } from '@/engine/audio/simplest-midi';
import { baseDrum, doorOpening4, footstep, hideSound } from '@/sounds';

export class LeverDoorObject3d extends Object3d {
  swapHingeSideX: -1 | 1;
  swapHingeSideZ: -1 | 1;
  closedDoorCollision: Set<Face>;
  originalRot = 0;
  placedPosition: EnhancedDOMPoint;
  collisionMesh: Mesh;
  isLocked = false;
  openClose = -1;
  isAnimating = false;
  speed_ = 3;
  sfxPlayer = new SimplestMidiRev2();
  sfxPlayer2 = new SimplestMidiRev2();

  constructor(x: number, y: number, z: number, swapHingeSideX: 1 | -1 = 1, swapHingeSideZ: 1 | -1 = 1, swapOpenClosed?: boolean, isLocked?: boolean) {
    const mesh = new Mesh(
      new MoldableCubeGeometry(5, 7.75, 0.25)
        .texturePerSide(materials.white)
        .merge(
          new MoldableCubeGeometry(1, 1, 1, 4, 4)
            .cylindrify(0.2, 'z')
            .translate_(2 * swapHingeSideX, -0.5)
            .texturePerSide(materials.silver)
        )
        .done_(),
      materials.white
    )
    super(mesh);
    this.isLocked = !!isLocked;
    this.placedPosition = new EnhancedDOMPoint(x - (swapOpenClosed ? 2 * swapHingeSideX : 0), y, z - (swapOpenClosed ? 2 * swapHingeSideX : 0));
    this.swapHingeSideX = swapHingeSideX;
    this.swapHingeSideZ = swapHingeSideZ;
    this.sfxPlayer.volume_.connect(compressor);
    this.sfxPlayer2.volume_.connect(biquadFilter);

    this.position.set(x - 2 * swapHingeSideX, y, z);
    this.children_[0].position.x = 2 * swapHingeSideX;

    this.collisionMesh = new Mesh(
      new MoldableCubeGeometry(swapOpenClosed ? 1 : 4, 7, swapOpenClosed ? 4 :1)
        .translate_(x - (swapOpenClosed ? 2 * swapHingeSideX : 0), y, z - (swapOpenClosed ? 2 * swapHingeSideX : 0))
        .done_()
      , new Material());

    // Move placed position down to the center of the door after making the collision mesh so the door look at detection goes from center
    this.placedPosition.y -= 3;

    this.closedDoorCollision =  new Set(meshToFaces([this.collisionMesh]));

    if (swapOpenClosed) {
      this.rotation_.y = 90;
      this.originalRot = 90;
    }
  }

  pullLever(isEnemy = false) {
    this.speed_ = isEnemy ? 1 : 3;
    if (!this.isAnimating) {
      this.isAnimating = true;
      this.openClose *= -1;
      this.sfxPlayer.playNote(audioContext.currentTime, 10, 40, baseDrum, audioContext.currentTime + 1);

      if (isEnemy) {
        this.sfxPlayer2.playNote(audioContext.currentTime, 72, 30, doorOpening4, audioContext.currentTime + 1);
      }

    }
  }

  update_(){
    if (this.isAnimating) {
      this.rotation_.y += this.swapHingeSideZ * this.swapHingeSideX * this.speed_ * this.openClose;
      if (Math.abs(this.rotation_.y) - this.originalRot === (this.openClose === -1 ? 0 : 120)) {
        this.isAnimating = false;
      }
    }
  }
}
