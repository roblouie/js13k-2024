import { Object3d } from '@/engine/renderer/object-3d';
import { Mesh } from '@/engine/renderer/mesh';
import { Material } from '@/engine/renderer/material';
import { EnhancedDOMPoint } from '@/engine/enhanced-dom-point';
import { MoldableCubeGeometry } from '@/engine/moldable-cube-geometry';
import { Face } from '@/engine/physics/face';
import { meshToFaces } from '@/engine/physics/parse-faces';
import { materials } from "@/textures";

export class DoorData extends Object3d {
  swapHingeSideX: -1 | 1;
  swapHingeSideZ: -1 | 1;
  closedDoorCollisionM: Mesh;
  originalRot = 0;

  constructor(doorMesh: Mesh, position_: EnhancedDOMPoint, swapHingeSideX: 1 | -1 = 1, swapHingeSideZ: 1 | -1 = 1, swapOpenClosed?: boolean) {
    super(doorMesh);
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
    }
  }
}

export class LeverDoorObject3d extends Object3d {
  doorData: DoorData;
  isActivated = false;
  isFinished = false;
  switchPosition: EnhancedDOMPoint;
  closedDoorCollision: Face[];
  private openClose = 1;
  private isAnimating = true;


  constructor(switchPosition: EnhancedDOMPoint, doorData: DoorData, switchRotationDegrees = 0) {
    const base = new Mesh(new MoldableCubeGeometry(1, 2, 1).spreadTextureCoords(), materials.iron);
    const lever = new Mesh(
      new MoldableCubeGeometry(1, 1, 4, 3, 3)
        .cylindrify(0.25, 'z')
        .merge(new MoldableCubeGeometry(3, 1, 1, 1, 3, 3).cylindrify(0.25, 'x').translate_(0, 0, 2))
        .computeNormals(true)
        .done_(), materials.wood);
    super(base, lever);

    this.doorData = doorData;
    this.switchPosition = switchPosition;
    this.position_.set(switchPosition);
    this.rotation_.y = switchRotationDegrees;

    lever.rotation_.x = -45;

    this.closedDoorCollision = meshToFaces([doorData.closedDoorCollisionM]);
  }

  pullLever() {
    this.isActivated = true;
  }

  update(){
    if (this.isActivated && !this.isFinished) {
        this.doorData.rotation_.y += this.doorData.swapHingeSideZ * this.doorData.swapHingeSideX * 3;
        this.children_[1].rotation_.x += 3;
        if (Math.abs(this.doorData.rotation_.y) - this.doorData.originalRot >= 120) {
          this.isFinished = true;
        }
    }
  }
}

