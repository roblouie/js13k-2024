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
  const elevatorBody = new Mesh(createBox(testWall, testWall2, testWall3, testWall4), materials.silver);
  const elevatorRail = new Mesh(new MoldableCubeGeometry(10, 0.5, 0.3).translate_(0, 4, -4).done_(), materials.silver);


  const elevatorWoodTest = new Mesh(
    new MoldableCubeGeometry(4, 9, 1).translate_(0,6,-5.2)
      .merge(new MoldableCubeGeometry(4, 9, 1).translate_(-4.5, 6, -5.2))
      .merge(new MoldableCubeGeometry(4, 9, 1).translate_(4.5, 6, -5.2)).spreadTextureCoords().done_().computeNormals()
    , materials.lighterWoodTest);

  const elevatorFloor = new Mesh(new MoldableCubeGeometry(15, 1.5, 10).spreadTextureCoords(6, 6), materials.tinyTiles);
  const elevatorRoof = new Mesh(new MoldableCubeGeometry(15, 1.5, 10).translate_(0, 12).done_().spreadTextureCoords(), materials.ceilingTiles)

  return [elevatorBody, elevatorFloor, elevatorWoodTest, elevatorRail, elevatorRoof];
}


