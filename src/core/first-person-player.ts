import { Camera } from '@/engine/renderer/camera';
import { EnhancedDOMPoint } from '@/engine/enhanced-dom-point';
import { Face } from '@/engine/physics/face';
import { controls } from '@/core/controls';
import {
  findWallCollisionsFromList, getGridPosition, getGridPositionWithNeighbors,
} from '@/engine/physics/surface-collision';
import { clamp, findClosestNavPoint } from '@/engine/helpers';
import { PathNode } from '@/ai/path-node';
import { AiNavPoints } from '@/ai/ai-nav-points';
import { HidingPlace } from '@/hiding-place';

class Sphere {
  center: EnhancedDOMPoint;
  radius: number;

  constructor(center: EnhancedDOMPoint, radius: number) {
    this.center = center;
    this.radius = radius;
  }
}

export class FirstPersonPlayer {
  feetCenter = new EnhancedDOMPoint(0, 0, 0);
  velocity = new EnhancedDOMPoint(0, 0, 0);
  isFrozen = false;
  closestNavPoint: PathNode;

  // mesh: Mesh;
  camera: Camera;
  cameraRotation = new EnhancedDOMPoint(0, 0, 0);
  collisionSphere: Sphere;
  isOnDirt = true;
  isHiding = false;
  hidFrom = new EnhancedDOMPoint();
  differenceFromNavPoint = new EnhancedDOMPoint();

  constructor(camera: Camera, startingPoint: PathNode) {
    this.closestNavPoint = startingPoint;
    this.feetCenter.set(0, 10, -0);
    this.collisionSphere = new Sphere(this.feetCenter, 2);
    this.camera = camera;

    const rotationSpeed = 0.002;
    controls.onMouseMove(mouseMovement => {
      // if (!this.isHiding) {
        this.cameraRotation.x += mouseMovement.y * -rotationSpeed;
        this.cameraRotation.y += mouseMovement.x * -rotationSpeed;
        this.cameraRotation.x = clamp(this.cameraRotation.x, -Math.PI / 2, Math.PI / 2);
        this.cameraRotation.y = this.cameraRotation.y % (Math.PI * 2);
      // }
    });
  }

  private isFootstepsStopped = true;

  normal = new EnhancedDOMPoint();


  hide(hidingPlace: HidingPlace) {
    this.hidFrom.set(this.feetCenter);
    this.isHiding = true;
    this.isFrozen = true;
    this.camera.position_.set(hidingPlace.position);
    this.cameraRotation.set(hidingPlace.cameraRotation);
  }

  unhide() {
    this.isHiding = false;
    this.isFrozen = false;
    this.feetCenter.set(this.hidFrom);
  }

  update(gridFaces: Set<Face>[]) {
    const results = findClosestNavPoint([this.closestNavPoint, ...this.closestNavPoint.getPresentSiblings()], this.feetCenter);
    this.closestNavPoint = results[0];
    this.differenceFromNavPoint = results[2];
    tmpl.innerHTML += `PLAYER NODE DIFF: ${results[2].x}, ${results[2].z}<br>`;

    if (!this.isFrozen) {
      this.updateVelocityFromControls();
    }

    if (!this.isHiding) {
      this.velocity.y -= 0.008; // gravity

      const playerGridPositions = getGridPositionWithNeighbors(this.feetCenter, gridFaces.length);

      playerGridPositions.forEach(p => findWallCollisionsFromList(gridFaces[p], this));

      //findWallCollisionsFromList(faces, this);
      this.feetCenter.add_(this.velocity);

      this.camera.position_.set(this.feetCenter);
      this.camera.position_.y += 3.5;
    } else if (controls.isConfirm && !controls.prevConfirm) {
      this.unhide();
    }

    this.camera.setRotation_(...this.cameraRotation.toArray());

    this.normal.set(0, 0, 1);
    this.normal.set(this.camera.rotationMatrix.transformPoint(this.normal));

    this.camera.updateWorldMatrix();
  }

  isJumping = false;

  protected updateVelocityFromControls() {
    const speed = 0.24;

    const depthMovementZ = Math.cos(this.cameraRotation.y) * controls.inputDirection.y * speed;
    const depthMovementX = Math.sin(this.cameraRotation.y) * controls.inputDirection.y * speed;

    const sidestepZ = Math.cos(this.cameraRotation.y + Math.PI / 2) * controls.inputDirection.x * speed;
    const sidestepX = Math.sin(this.cameraRotation.y + Math.PI / 2) * controls.inputDirection.x * speed;

    this.velocity.z = depthMovementZ + sidestepZ;
    this.velocity.x = depthMovementX + sidestepX;
  }
}
