import { EnhancedDOMPoint } from '@/engine/enhanced-dom-point';
import { Mesh } from '@/engine/renderer/mesh';
import { MoldableCubeGeometry } from '@/engine/moldable-cube-geometry';
import { materials } from '@/textures';
import { buildSegmentedWall, getAllWhite } from '@/modeling/building-blocks';

export class Item {
  roomNumber?: number;
  isTaken = false;
  mesh: Mesh;

  constructor(position: EnhancedDOMPoint, rotation: EnhancedDOMPoint, roomNumber?: number) {
    this.roomNumber = roomNumber;
    if (this.roomNumber) {
      this.mesh = new Mesh(
        new MoldableCubeGeometry(1, 1, 0.5, 3, 3)
          .cylindrify(0.75, 'z')
          .merge(buildSegmentedWall([1, 0.5, 0.5, 0.5], 1, [0.25, 1, 0.25, 1], [0], 0.3)[0].translate_(1.75, -0.75))
          .scale_(0.5, 0.5, 0.5)
          .translate_(-0.5)
          .done_(),
        materials.silver);
    } else {
      this.mesh = new Mesh(
        new MoldableCubeGeometry(1.9, 1, 0.5).texturePerSide(...getAllWhite())
        ,
        materials.wood
      )
    }


    // this.mesh = new Mesh(new MoldableCubeGeometry(2, 1, 0.5), materials.silver);
    this.mesh.position.set(position);
    this.mesh.setRotation_(rotation.x, rotation.y, rotation.z);
    this.mesh.updateWorldMatrix();
  }
}
