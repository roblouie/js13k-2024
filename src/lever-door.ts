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
  closedDoorCollisionM: Mesh;
  originalRot = 0;
  placedPosition: EnhancedDOMPoint;
  normal = new EnhancedDOMPoint(0, 1, 0);

  constructor(doorMesh: Mesh, position_: EnhancedDOMPoint, swapHingeSideX: 1 | -1 = 1, swapHingeSideZ: 1 | -1 = 1, swapOpenClosed?: boolean) {
    super(doorMesh);
    this.placedPosition = new EnhancedDOMPoint(...position_.toArray());
    this.placedPosition.x -= 2 * swapHingeSideX;
    this.placedPosition.y -= 2;
    this.placedPosition.z -= 2;
    this.swapHingeSideX = swapHingeSideX;
    this.swapHingeSideZ = swapHingeSideZ;

    this.position_.set(position_.x - 2 * swapHingeSideX, position_.y, position_.z);
    this.children_[0].position_.x = 2 * swapHingeSideX;

    this.closedDoorCollisionM = new Mesh(
      new MoldableCubeGeometry(4, 7, 1)
        .translate_(position_.x - (swapOpenClosed ? 4 : 0), position_.y, position_.z)
        .done_()
      , new Material());

    if (swapOpenClosed) {
      this.rotation_.y = 90;
      this.originalRot = 90;
      // this.normal.set(0, 0, 1);
    }
  }
}

export class LeverDoorObject3d {
  doorData: DoorData;
  isActivated = false;
  isFinished = false;
  closedDoorCollision: Face[];
  private openClose = -1;
  private isAnimating = false;


  constructor(doorData: DoorData) {
    this.doorData = doorData;
    this.closedDoorCollision = meshToFaces([doorData.closedDoorCollisionM]);
  }

  pullLever() {
    if (!this.isAnimating) {
      this.isAnimating = true;
      this.openClose *= -1;
      this.isActivated = true;
    }
  }

  update(){
    if (this.isAnimating) {
        this.doorData.rotation_.y += this.doorData.swapHingeSideZ * this.doorData.swapHingeSideX * 3 * this.openClose;
        if (Math.abs(this.doorData.rotation_.y) - this.doorData.originalRot === (this.openClose === -1 ? 0 : 120)) {
          this.isFinished = true;
          this.isAnimating = false;
        }
    }
  }
}

