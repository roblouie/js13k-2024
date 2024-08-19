import {
  buildSegmentedWall,
  createBox,
  DoorTopSegment,
  DoubleDoorWidth,
  SegmentedWall, WallHeight
} from '@/modeling/building-blocks';
import { Material } from '@/engine/renderer/material';
import { Mesh } from '@/engine/renderer/mesh';
import { MoldableCubeGeometry } from '@/engine/moldable-cube-geometry';
import { materials } from '@/textures';
import { AttributeLocation } from '@/engine/renderer/renderer';

// Original elevator door width too big
const NormalDoorWidth = 5;

export function buildRoom() {
  const testWall = buildSegmentedWall([3, NormalDoorWidth, 13], 12, [12, 3, 12], [0, 0, 0], 1,
  [materials.silver.texture!,
    materials.silver.texture!,
    materials.silver.texture!,
    materials.silver.texture!,
    materials.silver.texture!,
    materials.elevatorPanel.texture!,]);
  const testWall2 = buildSegmentedWall([21], 12, [12], [], 1, [materials.silver.texture!,
    materials.silver.texture!,
    materials.silver.texture!,
    materials.silver.texture!,
    materials.silver.texture!,
    materials.elevatorPanel.texture!,]);
  const testWall3 = buildSegmentedWall([34], 12, [12], []);
  const testWall4 = buildSegmentedWall([34], 12, [12], []);

  const [bathroomDoorWall] = buildSegmentedWall([4, NormalDoorWidth, 4], 12, [12, DoorTopSegment, 12], [])
  bathroomDoorWall.rotate_(0, Math.PI).translate_(-10);

  const secondBathroomWall = new MoldableCubeGeometry(1, WallHeight, 10).translate_(-4, 6, -5.5);

  const roomBody = new Mesh(
    createBox(testWall3, testWall4, testWall2, testWall)
      .merge(bathroomDoorWall)
      .merge(secondBathroomWall)
      // .translate_(30, 0, 20)
      .done_(),
    materials.patternedWallpaper);

  const bedPlaceholder = new Mesh(new MoldableCubeGeometry(7, 2, 8)
      .translate_(5, 2, -5.5)
      .done_()
    , materials.potentialPlasterWall);

  const counterPlaceholder = new Mesh(new MoldableCubeGeometry(3, 1, 3)
    .translate_(-5.5, 3, -4.5)
    .done_(),
    materials.potentialPlasterWall);

  const toiletPlaceholder = new Mesh(new MoldableCubeGeometry(2, 3, 2)
      .translate_(-14.5, 1.5, -1.5)
      .done_(),
    materials.potentialPlasterWall);

  const bathPlaceholder = new Mesh(new MoldableCubeGeometry(7, 2, 3)
      .translate_(-11.5, 1.5, -9)
      .done_(),
    materials.potentialPlasterWall);

  return [roomBody, bedPlaceholder,counterPlaceholder, toiletPlaceholder, bathPlaceholder];
}


