import { EnhancedDOMPoint } from "@/engine/enhanced-dom-point";
import { radsToDegrees } from '@/engine/helpers';

export class Object3d {
  position: EnhancedDOMPoint;
  scale_: EnhancedDOMPoint;
  children_: Object3d[];
  parent_?: Object3d;
  localMatrix: DOMMatrix;
  worldMatrix: DOMMatrix;
  up: EnhancedDOMPoint;
  rotationMatrix: DOMMatrix;

  constructor(...children_: Object3d[]) {
    this.position = new EnhancedDOMPoint();
    this.scale_ = new EnhancedDOMPoint(1, 1, 1);
    this.children_ = [];
    this.localMatrix = new DOMMatrix();
    this.worldMatrix = new DOMMatrix();
    this.up = new EnhancedDOMPoint(0, 1, 0);
    this.rotationMatrix = new DOMMatrix();
    if (children_) {
      this.add_(...children_);
    }
  }

  add_(...object3ds: Object3d[]) {
    object3ds.forEach(object3d => {
      if (object3d.parent_) {
        object3d.parent_.children_ = object3d.parent_.children_.filter(child => child !== this);
      }
      object3d.parent_ = this;
      this.children_.push(object3d);
    })
  }

  remove_(object3d: Object3d) {
    this.children_ = this.children_.filter(child => child !== object3d);
  }

  rotation_ = new EnhancedDOMPoint();
  rotate_(xRads: number, yRads: number, zRads: number) {
    this.rotation_.add_({x: radsToDegrees(xRads), y: radsToDegrees(yRads), z: radsToDegrees(zRads)});
    this.rotationMatrix.rotateSelf(radsToDegrees(xRads), radsToDegrees(yRads), radsToDegrees(zRads));
  }

  setRotation_(xRads: number, yRads: number, zRads: number) {
    this.rotationMatrix = new DOMMatrix();
    this.rotation_.set(radsToDegrees(xRads), radsToDegrees(yRads), radsToDegrees(zRads));
    this.rotationMatrix.rotateSelf(radsToDegrees(xRads), radsToDegrees(yRads), radsToDegrees(zRads));
  }

  isUsingLookAt = false;
  private localWorkMatrix = new DOMMatrix();
  // TODO: Don't recreate matrix every time
  getMatrix() {
    this.localWorkMatrix.m11 = 1
    this.localWorkMatrix.m12 = 0
    this.localWorkMatrix.m13 = 0
    this.localWorkMatrix.m14 = 0
    this.localWorkMatrix.m21 = 0
    this.localWorkMatrix.m22 = 1
    this.localWorkMatrix.m23 = 0
    this.localWorkMatrix.m24 = 0
    this.localWorkMatrix.m31 = 0
    this.localWorkMatrix.m32 = 0
    this.localWorkMatrix.m33 = 1
    this.localWorkMatrix.m34 = 0
    this.localWorkMatrix.m41 = 0
    this.localWorkMatrix.m42 = 0
    this.localWorkMatrix.m43 = 0
    this.localWorkMatrix.m44 = 1
    this.localWorkMatrix.translateSelf(this.position.x, this.position.y, this.position.z);
    if (this.isUsingLookAt) {
      this.localWorkMatrix.multiplySelf(this.rotationMatrix);
    } else {
      this.localWorkMatrix.rotateSelf(this.rotation_.x, this.rotation_.y, this.rotation_.z);
    }
    this.localWorkMatrix.scaleSelf(this.scale_.x, this.scale_.y, this.scale_.z);
    return this.localWorkMatrix;
  }

  updateWorldMatrix() {
    this.localMatrix = this.getMatrix();

    if (this.parent_) {
      this.worldMatrix = this.parent_.worldMatrix.multiply(this.localMatrix);
    } else {
      this.worldMatrix = DOMMatrix.fromMatrix(this.localMatrix);
    }

      this.children_.forEach(child => child.updateWorldMatrix());
  }

  allChildren(): Object3d[] {
    function getChildren(object3d: Object3d, all_: Object3d[]) {
      object3d.children_.forEach(child => {
        all_.push(child);
        getChildren(child, all_);
      });
    }

    const allChildren: Object3d[] = [];
    getChildren(this, allChildren);
    return allChildren;
  }

  private right = new EnhancedDOMPoint();
  lookatUp = new EnhancedDOMPoint();
  forward = new EnhancedDOMPoint();

  lookAt(target: EnhancedDOMPoint) {
    this.isUsingLookAt = true;
    this.forward.subtractVectors(this.position, target).normalize_();
    this.right.crossVectors(this.up, this.forward).normalize_();
    this.lookatUp.crossVectors(this.forward, this.right).normalize_();

    this.rotationMatrix = new DOMMatrix([
      this.right.x, this.right.y, this.right.z, 0,
      this.lookatUp.x, this.lookatUp.y, this.lookatUp.z, 0,
      this.forward.x, this.forward.y, this.forward.z, 0,
      0, 0, 0, 1,
    ]);
  }
}
