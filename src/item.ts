import { EnhancedDOMPoint } from '@/engine/enhanced-dom-point';
import { Mesh } from '@/engine/renderer/mesh';
import { MoldableCubeGeometry } from '@/engine/moldable-cube-geometry';
import { materials } from '@/textures';

export class Item {
  roomNumber?: number;
  isTaken = false;
  position_: EnhancedDOMPoint;
  mesh: Mesh;

  constructor(position_: EnhancedDOMPoint, roomNumber?: number) {
    this.position_ = position_;
    this.roomNumber = roomNumber;

    this.mesh = new Mesh(new MoldableCubeGeometry(2, 1, 0.5), materials.silver);
    this.mesh.position_ = position_;
  }
}
