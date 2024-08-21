import { Object3d } from '@/engine/renderer/object-3d';
import { Mesh } from '@/engine/renderer/mesh';
import { Material } from '@/engine/renderer/material';
import { EnhancedDOMPoint } from '@/engine/enhanced-dom-point';
import { MoldableCubeGeometry } from '@/engine/moldable-cube-geometry';
import { Face } from '@/engine/physics/face';
import { meshToFaces } from '@/engine/physics/parse-faces';

export class DoorData extends Object3d {
  swapHingeSideX: -1 | 1;
  swapHingeSideZ: -1 | 1;
  closedDoorCollision: Face[];
  originalRot = 0;
  placedPosition: EnhancedDOMPoint;
  collisionMesh: Mesh;

  constructor(doorMesh: Mesh, position_: EnhancedDOMPoint, swapHingeSideX: 1 | -1 = 1, swapHingeSideZ: 1 | -1 = 1, swapOpenClosed?: boolean) {
    super(doorMesh);
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

    this.closedDoorCollision = meshToFaces([this.collisionMesh]);

    if (swapOpenClosed) {
      this.rotation_.y = 90;
      this.originalRot = 90;
    }
  }
}

export class LeverDoorObject3d {
  doorData: DoorData;
  closedDoorCollision: Set<Face>;
  openClose = -1;
  isAnimating = false;

  constructor(doorData: DoorData) {
    this.doorData = doorData;
    this.closedDoorCollision = new Set(this.doorData.closedDoorCollision);
  }

  pullLever() {
    if (!this.isAnimating) {
      this.isAnimating = true;
      this.openClose *= -1;
    }
  }

  update(){
    if (this.isAnimating) {
        this.doorData.rotation_.y += this.doorData.swapHingeSideZ * this.doorData.swapHingeSideX * 3 * this.openClose;
        if (Math.abs(this.doorData.rotation_.y) - this.doorData.originalRot === (this.openClose === -1 ? 0 : 120)) {
          this.isAnimating = false;
        }
    }
  }
}

