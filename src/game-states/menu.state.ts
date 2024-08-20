import { State } from '@/core/state';
import { Scene } from '@/engine/renderer/scene';
import { Camera } from '@/engine/renderer/camera';
import { render } from '@/engine/renderer/renderer';
import { EnhancedDOMPoint } from '@/engine/enhanced-dom-point';

export class MenuState implements State {
  camera: Camera;
  scene: Scene;
  cameraRotationAngles = new EnhancedDOMPoint();

  constructor() {
    this.camera = new Camera(Math.PI / 3, 16 / 9, 1, 600);
    this.camera.position_.y = 32;
    this.camera.position_.z = 120;
    this.scene = new Scene();
  }

  async onEnter() {
    this.scene.updateWorldMatrix();

    tmpl.innerHTML = '';
  }

  onUpdate() {
    render(this.camera, this.scene);

    this.cameraRotationAngles.x -= 0.0015;
    this.cameraRotationAngles.y -= 0.003;
    this.cameraRotationAngles.z -= 0.0015;

    this.camera.position_.x = (Math.cos(this.cameraRotationAngles.x) * 125);
    this.camera.position_.y = Math.cos(this.cameraRotationAngles.y) * 35 + 50;
    this.camera.position_.z = (Math.sin(this.cameraRotationAngles.z) * 125);

    this.camera.lookAt(new EnhancedDOMPoint(0.1, 31, 0.1));
    this.camera.updateWorldMatrix();
    this.updateControls();
  }

  updateControls() {}

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }
}
