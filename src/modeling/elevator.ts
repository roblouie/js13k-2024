import { createBox, DoorWith, SegmentedWall } from '@/modeling/building-blocks';
import { Material } from '@/engine/renderer/material';
import { Mesh } from '@/engine/renderer/mesh';
import { MoldableCubeGeometry } from '@/engine/moldable-cube-geometry';
import { materials } from '@/textures';

const testWall = new SegmentedWall([4, DoorWith * 2, 4], 12, [12, 3, 12], [0, 0, 0], 0, 0);
const testWall2 = new SegmentedWall([16], 12, [12], [], 0, 0);
const testWall3 = new SegmentedWall([10], 12, [12], [], 0, 0);
const testWall4 = new SegmentedWall([10], 12, [12], [], 0, 0);

export function buildElevator() {
  const elevatorBody = new Mesh(createBox(testWall, testWall2, testWall3, testWall4)
      //     .selectBy(vertex => Math.abs(vertex.x) < 2.5 && Math.abs(vertex.z) < 2.5)
      //     .cylindrify(1.5, 'y')
      //     .invertSelection()
      //     .cylindrify(3.5, 'y')
    , materials.silver);

  const elevatorFloor = new Mesh(new MoldableCubeGeometry(15, 1.5, 10).spreadTextureCoords(14, 14), materials.marble);

  return [elevatorBody, elevatorFloor];
}


