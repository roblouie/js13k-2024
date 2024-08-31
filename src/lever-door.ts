import { Object3d } from '@/engine/renderer/object-3d';
import { Mesh } from '@/engine/renderer/mesh';
import { Material } from '@/engine/renderer/material';
import { EnhancedDOMPoint } from '@/engine/enhanced-dom-point';
import { MoldableCubeGeometry } from '@/engine/moldable-cube-geometry';
import { Face } from '@/engine/physics/face';
import { meshToFaces } from '@/engine/physics/parse-faces';
import { materials } from '@/textures';
import { getAllWhite } from '@/modeling/building-blocks';

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

  constructor(position_: EnhancedDOMPoint, swapHingeSideX: 1 | -1 = 1, swapHingeSideZ: 1 | -1 = 1, swapOpenClosed?: boolean) {
    const mesh = new Mesh(
      new MoldableCubeGeometry(5, 8, 0.5)
        .texturePerSide(...getAllWhite())
        .merge(
          new MoldableCubeGeometry(1, 1, 1, 4, 4)
            .cylindrify(0.2, 'z')
            .translate_(2 * swapHingeSideX, -0.5)
            .texturePerSide(materials.silver.texture!, materials.silver.texture!, materials.silver.texture!, materials.silver.texture!, materials.silver.texture!, materials.silver.texture!)
        )
        .done_(),
      materials.potentialPlasterWall
    )
    super(mesh);
    this.placedPosition = new EnhancedDOMPoint(position_.x - (swapOpenClosed ? 2 * swapHingeSideX : 0), position_.y, position_.z - (swapOpenClosed ? 2 * swapHingeSideX : 0));
    this.swapHingeSideX = swapHingeSideX;
    this.swapHingeSideZ = swapHingeSideZ;

    this.position_.set(position_.x - 2 * swapHingeSideX, position_.y, position_.z);
    this.children_[0].position_.x = 2 * swapHingeSideX;

    this.collisionMesh = new Mesh(
      new MoldableCubeGeometry(swapOpenClosed ? 1 : 4, 7, swapOpenClosed ? 4 :1)
        .translate_(position_.x - (swapOpenClosed ? 2 * swapHingeSideX : 0), position_.y, position_.z - (swapOpenClosed ? 2 * swapHingeSideX : 0))
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
