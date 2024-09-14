import { Camera } from '@/engine/renderer/camera';
import { EnhancedDOMPoint } from '@/engine/enhanced-dom-point';
import { Face } from '@/engine/physics/face';
import { controls } from '@/core/controls';
import { HidingPlace } from '@/hiding-place';
import { audioContext } from '@/engine/audio/simplest-midi';
import { hideSound } from '@/sounds';
import { PathNode } from '@/ai/path-node';
import { Object3d } from '@/engine/renderer/object-3d';
import { lightInfo } from '@/light-info';

export class FreeCam {
  feetCenter = new EnhancedDOMPoint(0, 0, 0);
  velocity = new EnhancedDOMPoint(0, 0, 0);
  normal = new EnhancedDOMPoint();

  // mesh: Mesh;
  camera: Camera;
  cameraRotation = new EnhancedDOMPoint(0, 0, 0);
  isCameraFrozenRotFrozen = false;

  closestNavPoint: PathNode;
  differenceFromNavPoint = new EnhancedDOMPoint();
  lightObject = new Object3d();

  constructor(camera: Camera, startingPoint: PathNode) {
    this.closestNavPoint = startingPoint;
    this.feetCenter.set(0, 10, -0);
    this.camera = camera;
    this.camera.add_(this.lightObject);

    const rotationSpeed = 0.001;
    controls.onMouseMove(mouseMovement => {
      if (this.isCameraFrozenRotFrozen) {
        return;
      }
      this.cameraRotation.x += mouseMovement.y * -rotationSpeed;
      this.cameraRotation.y += mouseMovement.x * -rotationSpeed;
      this.cameraRotation.x = Math.min(Math.max(this.cameraRotation.x, -Math.PI / 2), Math.PI / 2)
      this.cameraRotation.y = this.cameraRotation.y % (Math.PI * 2);
    });
  }


  update() {
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


    this.isCameraFrozenRotFrozen = controls.isConfirm;

    this.updateVelocityFromControls();
    this.feetCenter.add_(this.velocity);

    this.camera.position.set(this.feetCenter);
    this.camera.position.y += 3.5;

    this.camera.setRotation_(...this.cameraRotation.toArray());

    this.camera.updateWorldMatrix();
    this.normal.set(0, 0, -1);
    this.normal.set(this.camera.rotationMatrix.transformPoint(this.normal));

    this.lightObject.position.z = -3;
    lightInfo.pointLightPosition.set(this.lightObject.worldMatrix.transformPoint(new EnhancedDOMPoint(0, 0, 0)));
    lightInfo.pointLightAttenuation.set(0.0005, 0.0001, 0.4);

    lightInfo.pointLightPosition.x -= 3;
    lightInfo.pointLightPosition.y = 40;

  }

  protected updateVelocityFromControls() {
    const speed = 0.25;

    const depthMovementZ = -controls.inputDirection.y * speed;
    // const depthMovementX = controls.inputDirection.y * speed;
    // const depthMovementY = -controls.inputDirection.y * speed;

    // const sidestepZ = controls.inputDirection.x * speed;
    const sidestepX = -controls.inputDirection.x * speed;
    const sidestepY = -controls.inputDirection.z * speed;

    this.velocity.z = depthMovementZ;
    this.velocity.x = sidestepX;
    this.velocity.y = sidestepY;
  }

  // Special properties to free cam for capturing hiding as player
  isHiding = false;
  hidFrom = new EnhancedDOMPoint();
  hide(hidingPlace: HidingPlace) {
    this.hidFrom.set(this.feetCenter);
    this.isHiding = true;
    this.camera.position.set(hidingPlace.position);
    this.cameraRotation.set(hidingPlace.cameraRotation);
  }

  unhide() {
    this.isHiding = false;
    this.feetCenter.set(this.hidFrom);
  }
}
