import { Mesh } from '@/engine/renderer/mesh';
import { MoldableCubeGeometry } from '@/engine/moldable-cube-geometry';
import { materials } from '@/textures';

export function upyri() {
  const obj = new Mesh(new MoldableCubeGeometry(1, 1, 1, 6, 6, 6)
      .spherify(0.8)
      .scale_(1, 1.3, 0.8)
      .selectBy(vert => vert.y > 0.7)
      .scale_(3, 1, 1)
      .selectBy(vert => vert.y > 0.8)
      .scale_(1.5, 8, 2)
      .texturePerSide(
        materials.iron.texture!,
        materials.iron.texture!,
        materials.iron.texture!,
        materials.iron.texture!,
        materials.face.texture!,
        materials.face.texture!,
      )
      .computeNormals(true)
      .all_()
      .rotate_(Math.PI)
      .translate_(0, 5)
      .done_()
    , materials.face);

  obj.position_.set(0, 54, 2);

  return obj;
}
