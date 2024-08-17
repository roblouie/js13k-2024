import { State } from '@/core/state';
import { Scene } from '@/engine/renderer/scene';
import { Camera } from '@/engine/renderer/camera';
import { newNoiseLandscape } from '@/engine/new-new-noise';
import { Mesh } from '@/engine/renderer/mesh';
import { PlaneGeometry } from '@/engine/plane-geometry';
import { materials, skyboxes } from '@/textures';
import { Skybox } from '@/engine/skybox';
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
    const heightmap = await newNoiseLandscape(256, 6, 0.04, 3, 'fractalNoise', 80);
    const floor = new Mesh(new PlaneGeometry(1024, 1024, 255, 255, heightmap).spreadTextureCoords(), materials.grass);
    const water = new Mesh(new PlaneGeometry(1024, 1024, 10, 10).translate_(0, 20).done_().spreadTextureCoords(160, 160), materials.water)
    this.scene.add_(floor, water);

    this.scene.skybox = new Skybox(...skyboxes.test);
    this.scene.updateWorldMatrix();
    this.scene.skybox.bindGeometry();

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
