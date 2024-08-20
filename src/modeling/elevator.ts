import { buildSegmentedWall, createBox, DoubleDoorWidth } from '@/modeling/building-blocks';
import { Mesh } from '@/engine/renderer/mesh';
import { MoldableCubeGeometry } from '@/engine/moldable-cube-geometry';
import { materials } from '@/textures';

export const ElevatorDepth = 16;

export function buildElevator() {
  const testWall = buildSegmentedWall([4, DoubleDoorWidth, 4], 12, [12, 3, 12], [0, 0, 0], 1);
  const testWall2 = buildSegmentedWall([16], 12, [12], [], 1);
  const testWall3 = buildSegmentedWall([10], 12, [12], [], 1);
  const testWall4 = buildSegmentedWall([10], 12, [12], [], 1);

  const elevatorBody = new Mesh(createBox(testWall, testWall2, testWall3, testWall4), materials.silver);
  const elevatorRail = new Mesh(
    new MoldableCubeGeometry(10, 0.5, 0.3).translate_(0, 4, -4)
      .merge(new MoldableCubeGeometry(0.3, 0.5, 6).translate_(-6, 4, 0))
      .merge(new MoldableCubeGeometry(0.3, 0.5, 6).translate_(6, 4, 0))
      .done_()
    , materials.silver);

  const texturesPerSide = [
    materials.silver.texture!,
    materials.silver.texture!,
    materials.silver.texture!,
    materials.silver.texture!,
    materials.silver.texture!,
    materials.elevatorPanel.texture!,
  ]
  // @ts-ignore
  const panel = new Mesh(new MoldableCubeGeometry(2, 2, 0.5).texturePerSide(...texturesPerSide).translate_(5.4, 5, 5.2).done_(), materials.elevatorPanel);
  //
  const bfSegments = [1.25, 4, 0.5, 4, 0.5, 4, 1.25];
  const lrSegments = [0.5, 4, 0.5, 4, 0.5];
  const elevatorWoodTest = new Mesh(createBox(
    buildSegmentedWall([bfSegments.reduce((acc, curr) => acc + curr)], 9, [0], [0]),
    buildSegmentedWall(bfSegments, 9, [0, 9, 0, 9, 0, 9, 0], [0]),
    buildSegmentedWall(lrSegments, 9, [0, 9, 0, 9, 0], [0]),
    buildSegmentedWall(lrSegments, 9, [0, 9, 0, 9, 0], [0]),
  ).translate_(0, 1.25).done_(), materials.lighterWoodTest);

  const elevatorFloor = new Mesh(new MoldableCubeGeometry(15, 1.5, 10).spreadTextureCoords(5, 5), materials.marble);
  const elevatorRoof = new Mesh(new MoldableCubeGeometry(15, 1.5, 10).translate_(0, 12).done_().spreadTextureCoords(), materials.ceilingTiles)

  return [elevatorBody, elevatorRail, elevatorFloor, elevatorRoof, elevatorWoodTest, panel];
}


