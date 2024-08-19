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
  const allPlaster = [
    materials.greenPlasterWall.texture!,
    materials.greenPlasterWall.texture!,
    materials.greenPlasterWall.texture!,
    materials.greenPlasterWall.texture!,
    materials.greenPlasterWall.texture!,
    materials.greenPlasterWall.texture!,];

  const testWall = buildSegmentedWall([3, NormalDoorWidth, 13], 12, [12, 3, 12], [0, 0, 0], 1,
  4, [
    materials.greenPlasterWall.texture!,
    materials.greenPlasterWall.texture!,
    materials.greenPlasterWall.texture!,
    materials.greenPlasterWall.texture!,
    materials.greenPlasterWall.texture!,
    materials.wallpaper.texture!,]);
  const testWall2 = buildSegmentedWall([21], 12, [12], [], 1, 4, allPlaster);
  const testWall3 = buildSegmentedWall([34], 12, [12], [], 1, 4, allPlaster);
  const testWall4 = buildSegmentedWall([34], 12, [12], [], 1, 4, allPlaster);

  const [bathroomDoorWall] = buildSegmentedWall([4, NormalDoorWidth, 4], 12, [12, DoorTopSegment, 12], [], 1, 4, [
    materials.greenPlasterWall.texture!,
      materials.greenPlasterWall.texture!,
      materials.greenPlasterWall.texture!,
      materials.greenPlasterWall.texture!,
      materials.tinyTiles.texture!,
      materials.greenPlasterWall.texture!
    ]);
  bathroomDoorWall.rotate_(0, Math.PI).translate_(-10);

  const secondBathroomWall = new MoldableCubeGeometry(1, WallHeight, 10).texturePerSide(materials.tinyTiles.texture!,
    materials.tinyTiles.texture!,
    materials.greenPlasterWall.texture!,
    materials.tinyTiles.texture!,
    materials.tinyTiles.texture!,
    materials.tinyTiles.texture!).translate_(-4, 6, -5.5);

  const roomBody = new Mesh(
    createBox(testWall3, testWall4, testWall2, testWall)
      .merge(bathroomDoorWall)
      .merge(secondBathroomWall)
      // .translate_(30, 0, 20)
      .done_(),
    materials.wallpaper);

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

  // TRIM
  const outerTrimFront = buildSegmentedWall([3, NormalDoorWidth, 13], 1, [12, 0, 12], [0, 0, 0], 1.5)
  const outerTrimBack = new MoldableCubeGeometry(21, 2, 1.5);
  const outerTrimLeft = new MoldableCubeGeometry(34, 2, 1.5);
  const outerTrimRight = new MoldableCubeGeometry(34, 2, 1.5);
  const bathroomDoorTrim = buildSegmentedWall([4.25, NormalDoorWidth - 0.5, 4.25], 1, [12, 0, 12], [0, 0, 0], 1.5);
  const bathroomWallTrim = new MoldableCubeGeometry(1.5, 1, 12);
  const trim = new Mesh(
    createBox([outerTrimLeft, 34], [outerTrimRight, 32], [outerTrimBack, 21], outerTrimFront)
      .merge(bathroomDoorTrim[0].rotate_(0, Math.PI).translate_(-10))
      .merge(bathroomWallTrim.translate_(-4, 0.5, -5.25)).done_()
    , materials.potentialPlasterWall);

  return [roomBody, bedPlaceholder,counterPlaceholder, toiletPlaceholder, bathPlaceholder, trim];
}


