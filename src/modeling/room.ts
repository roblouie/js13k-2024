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
import { Texture } from '@/engine/renderer/texture';

// Original elevator door width too big
const NormalDoorWidth = 5;
export const RoomWidth = 34;
export const RoomDepth = 25;

export function buildRoom() {

  const testWall = buildSegmentedWall([3, NormalDoorWidth, 15], 12, [12, 3, 12], [0, 0, 0], 1,
  4, [
    materials.greenPlasterWall.texture!,
    materials.greenPlasterWall.texture!,
    materials.greenPlasterWall.texture!,
    materials.greenPlasterWall.texture!,
    materials.greenPlasterWall.texture!,
    materials.wallpaper.texture!,]);
  const testWall2 = buildSegmentedWall([23], 12, [12], [], 1, 4, [
    materials.wallpaper.texture!,
    materials.wallpaper.texture!,
    materials.wallpaper.texture!,
    materials.wallpaper.texture!,
    materials.wallpaper.texture!,
    materials.greenPlasterWall.texture!,]);
  const testWall3 = buildSegmentedWall([34], 12, [12], [], 1, 4, [
    materials.wallpaper.texture!,
    materials.wallpaper.texture!,
    materials.wallpaper.texture!,
    materials.wallpaper.texture!,
    materials.wallpaper.texture!,
    materials.greenPlasterWall.texture!,]);
  const testWall4 = buildSegmentedWall([34], 12, [12], [], 1, 4, [
    materials.wallpaper.texture!,
    materials.wallpaper.texture!,
    materials.wallpaper.texture!,
    materials.wallpaper.texture!,
    materials.greenPlasterWall.texture!,
    materials.wallpaper.texture!,]);

  const [bathroomDoorWall] = buildSegmentedWall([4, NormalDoorWidth, 4], 12, [12, DoorTopSegment, 12], [], 1, 4, [
    materials.greenPlasterWall.texture!,
      materials.greenPlasterWall.texture!,
      materials.greenPlasterWall.texture!,
      materials.greenPlasterWall.texture!,
      materials.tinyTiles.texture!,
      materials.greenPlasterWall.texture!
    ]);
  bathroomDoorWall.rotate_(0, Math.PI).translate_(-10).computeNormals();

  const secondBathroomWall = new MoldableCubeGeometry(1, WallHeight, 11.5).texturePerSide(materials.tinyTiles.texture!,
    materials.tinyTiles.texture!,
    materials.greenPlasterWall.texture!,
    materials.tinyTiles.texture!,
    materials.tinyTiles.texture!,
    materials.tinyTiles.texture!).translate_(-4, 6, -6.25);



  const allWhite: [Texture, Texture, Texture, Texture, Texture, Texture] = [
    materials.potentialPlasterWall.texture!,
    materials.potentialPlasterWall.texture!,
    materials.potentialPlasterWall.texture!,
    materials.potentialPlasterWall.texture!,
    materials.potentialPlasterWall.texture!,
    materials.potentialPlasterWall.texture!,
  ]

  const bedPlaceholder = new MoldableCubeGeometry(7, 2, 8)
      .translate_(5, 2, -5.5)
      .texturePerSide(...allWhite)
      .done_();

  const counterPlaceholder = new MoldableCubeGeometry(3, 1, 3)
    .translate_(-5.5, 3, -4.5)
    .texturePerSide(...allWhite)
    .done_();

  const toiletPlaceholder = new MoldableCubeGeometry(2, 3, 2)
    .translate_(-14.5, 1.5, -1.5)
    .texturePerSide(...allWhite)
    .done_();

  const bathPlaceholder = new MoldableCubeGeometry(7, 2, 3)
    .translate_(-11.5, 1.5, -9)
    .texturePerSide(...allWhite)
    .done_();

  // TRIM
  function outerLargeTrimPiece() {
    return new MoldableCubeGeometry(1, 4, 3).texturePerSide(...allWhite).translate_(-16.6, 3, 10)
      .merge(new MoldableCubeGeometry(1, 4, 15).texturePerSide(...allWhite).translate_(-16.6, 3, -4))
      .merge(new MoldableCubeGeometry(33, 4, 1).texturePerSide(...allWhite).translate_(0, 3, 12.1));
  }

  const outerTrimFront = buildSegmentedWall([3, NormalDoorWidth, 15], 12, [1, 1, 1], [1, 0, 1], 1.5, 12, allWhite)
  const outerTrimBack = buildSegmentedWall([23], 12, [1], [1], 1.5, 12, allWhite);
  const outerTrimLeft = buildSegmentedWall([34], 12, [1], [1], 1.5, 12, allWhite); //new MoldableCubeGeometry(34, 2, 1.5);
  const outerTrimRight = buildSegmentedWall([34], 12, [1], [1], 1.5, 12, allWhite); //new MoldableCubeGeometry(34, 2, 1.5);
  const bathroomDoorTrim = buildSegmentedWall([4.25, NormalDoorWidth - 0.5, 4.25], 12, [1, 1, 1], [1, 0, 1], 1.5, 12, allWhite);
  const bathroomWallTrim = buildSegmentedWall([12], 12, [1], [1], 1.5, 12, allWhite) //new MoldableCubeGeometry(1.5, 1, 12);
  const trim =
    createBox(outerTrimLeft, outerTrimRight, outerTrimBack, outerTrimFront)
      .merge(bathroomDoorTrim[0].rotate_(0, Math.PI).translate_(-10))
      .merge(bathroomWallTrim[0].rotate_(0, Math.PI / 2).translate_(-4, 0, -5.25))
      .merge(outerLargeTrimPiece()).computeNormals().done_();

  return createBox(testWall3, testWall4, testWall2, testWall)
      .merge(bathroomDoorWall)
      .merge(secondBathroomWall)
      .merge(bedPlaceholder)
      .merge(counterPlaceholder)
      .merge(toiletPlaceholder)
      .merge(bathPlaceholder)
      .merge(trim)
      .done_();
}
