import { Camera } from '@/engine/renderer/camera';
import { EnhancedDOMPoint } from '@/engine/enhanced-dom-point';
import { Face } from '@/engine/physics/face';
import { clamp } from '@/engine/helpers';
import { controls } from '@/core/controls';



export class FreeCam {
  feetCenter = new EnhancedDOMPoint(0, 0, 0);
  velocity = new EnhancedDOMPoint(0, 0, 0);

  // mesh: Mesh;
  camera: Camera;
  cameraRotation = new EnhancedDOMPoint(0, 0, 0);
  isCameraFrozenRotFrozen = false;

  constructor(camera: Camera) {
    this.feetCenter.set(0, 10, -0);
    this.camera = camera;

    const rotationSpeed = 0.002;
    controls.onMouseMove(mouseMovement => {
      if (this.isCameraFrozenRotFrozen) {
        return;
      }
      this.cameraRotation.x += mouseMovement.y * -rotationSpeed;
      this.cameraRotation.y += mouseMovement.x * -rotationSpeed;
      this.cameraRotation.x = clamp(this.cameraRotation.x, -Math.PI / 2, Math.PI / 2);
      this.cameraRotation.y = this.cameraRotation.y % (Math.PI * 2);
    });
  }


  update(gridFaces: Set<Face>[]) {
    if (controls.isConfirm) {
      this.isCameraFrozenRotFrozen = true;
    } else {
      this.isCameraFrozenRotFrozen = false;
    }

    this.updateVelocityFromControls();
    this.feetCenter.add_(this.velocity);

    this.camera.position_.set(this.feetCenter);
    this.camera.position_.y += 3.5;

    this.camera.setRotation_(...this.cameraRotation.toArray());

    this.camera.updateWorldMatrix();
  }

  protected updateVelocityFromControls() {
    const speed = 0.24;

    const depthMovementZ = Math.cos(this.cameraRotation.y) * controls.inputDirection.y * speed;
    const depthMovementX = Math.sin(this.cameraRotation.y) * controls.inputDirection.y * speed;
    const depthMovementY = Math.sin(this.cameraRotation.x) * -controls.inputDirection.y * speed;

    const sidestepZ = Math.cos(this.cameraRotation.y + Math.PI / 2) * controls.inputDirection.x * speed;
    const sidestepX = Math.sin(this.cameraRotation.y + Math.PI / 2) * controls.inputDirection.x * speed;
    const sidestepY = controls.inputDirection.z * speed;

    this.velocity.z = depthMovementZ + sidestepZ;
    this.velocity.x = depthMovementX + sidestepX;
    this.velocity.y = depthMovementY + sidestepY;
  }
}
