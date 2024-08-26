import {
  allWhite,
  buildSegmentedWall,
  createBox, DoorHeight,
  DoorTopSegment, getAllWhite,
  WallHeight
} from '@/modeling/building-blocks';
import { getTextureForSide, MoldableCubeGeometry } from '@/engine/moldable-cube-geometry';
import { materials } from '@/textures';
import { Texture } from '@/engine/renderer/texture';

// Original elevator door width too big
const NormalDoorWidth = 5;
export const RoomWidth = 34;
export const RoomDepth = 25;

export function buildRoom(roomNumber: number, swapSign = false, isIncludeDetails = false) {

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

  const bathroomCornerColumn = new MoldableCubeGeometry(3.5, WallHeight, 4).texturePerSide(
    materials.tinyTiles.texture!,
    materials.tinyTiles.texture!,
    materials.tinyTiles.texture!,
    materials.tinyTiles.texture!,
    materials.tinyTiles.texture!,
    materials.tinyTiles.texture!,
  ).translate_(-6, 6, -9.5).spreadTextureCoords();


  const bedPlaceholder = new MoldableCubeGeometry(7, 2, 8)
      .translate_(5, 2, -6.5)
      .texturePerSide(...getAllWhite())
      .done_();

  const counterPlaceholder = new MoldableCubeGeometry(3, 1, 7)
    .translate_(-5.5, 3, -4)
    .texturePerSide(...getAllWhite())
    .done_();

  const toiletPlaceholder = new MoldableCubeGeometry(2, 3, 4.75)
    .translate_(-14.5, 1.5, -0.25)
    .texturePerSide(...getAllWhite())
    .done_();

  const bathPlaceholder = new MoldableCubeGeometry(7, 2, 3)
    .translate_(-11.5, 1.5, -9)
    .texturePerSide(...getAllWhite())
    .done_();

  const closetPlaceholder = new MoldableCubeGeometry(4, 8, 6)
    .translate_(14, 4, 5)
    .texturePerSide(...getAllWhite())
    .done_();

  const allWood = [
    materials.wood.texture!,
    materials.wood.texture!,
    materials.wood.texture!,
    materials.wood.texture!,
    materials.wood.texture!,
    materials.wood.texture!,
  ]

  const closet = new MoldableCubeGeometry(0.2, 8, 6).translate_(1.5).texturePerSide(...allWood) // back
      .merge(new MoldableCubeGeometry(3, 0.2, 6).translate_(0, -4).texturePerSide(...allWood)) // top
      .merge(new MoldableCubeGeometry(3, 0.2, 6).translate_(0, 4).texturePerSide(...allWood)) // bottom
      .merge(new MoldableCubeGeometry(3, 8.2, 0.2).translate_(0, 0, 3.1).texturePerSide(...allWood))
      .merge(new MoldableCubeGeometry(3, 8.2, 0.2).translate_(0, 0, -3.1).texturePerSide(...allWood))
      .merge(new MoldableCubeGeometry(0.2, 8, 3).translate_(-2.2, 0, -1).rotate_(0, -0.3).texturePerSide(...allWood))
      .merge(new MoldableCubeGeometry(0.2, 8, 3).translate_(-2.2, 0, 1).rotate_(0, 0.3).texturePerSide(...allWood))
      .translate_(14, 4.5, 5)
      .done_()
    // new MoldableCubeGeometry(3, 8, 6)

  // TRIM
  function outerLargeTrimPiece() {
    return new MoldableCubeGeometry(1, 3.5, 3).texturePerSide(...getAllWhite()).translate_(-16.6, 2.5, 10)
      .merge(new MoldableCubeGeometry(1, 3.5, 15).texturePerSide(...getAllWhite()).translate_(-16.6, 2.5, -4))
      .merge(new MoldableCubeGeometry(1, 3.5, 23).texturePerSide(...getAllWhite()).translate_(16.6, 2.5, 0))
      .merge(new MoldableCubeGeometry(33, 3.5, 1).texturePerSide(...getAllWhite()).translate_(0, 2.5, 12.1))
      .merge(new MoldableCubeGeometry(33, 3.5, 1).texturePerSide(...getAllWhite()).translate_(0, 2.5, -12.1))
  }

  const outerTrimFront = buildSegmentedWall([3, NormalDoorWidth, 15], 12, [1, 1, 1], [1, 0, 1], 1.5, 12, getAllWhite())
  const outerTrimBack = buildSegmentedWall([23], 12, [1], [1], 1.5, 12, getAllWhite());
  const outerTrimLeft = buildSegmentedWall([34], 12, [1], [1], 1.5, 12, getAllWhite()); //new MoldableCubeGeometry(34, 2, 1.5);
  const outerTrimRight = buildSegmentedWall([34], 12, [1], [1], 1.5, 12, getAllWhite()); //new MoldableCubeGeometry(34, 2, 1.5);
  const bathroomDoorTrim = buildSegmentedWall([4.25, NormalDoorWidth - 0.5, 4.25], 12, [1, 1, 1], [1, 0, 1], 1.5, 12, getAllWhite());
  const bathroomWallTrim = buildSegmentedWall([12], 12, [1], [1], 1.5, 12, getAllWhite()) //new MoldableCubeGeometry(1.5, 1, 12);
  const doorTrim = buildSegmentedWall([0.5, NormalDoorWidth - 0.5, 0.5], DoorHeight, [12, 0.5, 12], [], 1.5, 12, getAllWhite());
  const trim =
    createBox(outerTrimLeft, outerTrimRight, outerTrimBack, outerTrimFront)
      .merge(bathroomDoorTrim[0].rotate_(0, Math.PI).translate_(-10))
      .merge(bathroomWallTrim[0].rotate_(0, Math.PI / 2).translate_(-4, 0, -5.25))
      .merge(doorTrim[0].rotate_(0, Math.PI / 2).translate_(-16.5, 0, 6))
      .merge(outerLargeTrimPiece()).computeNormals().done_();

  const doorNumberPlate = new MoldableCubeGeometry(1, 1).texturePerSide(
    materials.silver.texture!,
    materials.silver.texture!,
    materials.silver.texture!,
    materials[roomNumber].texture!,
    materials.silver.texture!,
    materials.silver.texture!,
  ).translate_(-16.6, 5, swapSign ? 9.5 : 2.5);

  const walls = createBox(testWall3, testWall4, testWall2, testWall)
    .merge(bathroomDoorWall)
    .merge(secondBathroomWall)
    .merge(bathroomCornerColumn);

  if (isIncludeDetails) {
    return walls.merge(trim)
      .merge(doorNumberPlate)
      .merge(closet)
      // TODO: REMOVE THESE
      .merge(bedPlaceholder)
      .merge(bathPlaceholder)
      .merge(toiletPlaceholder)
      .merge(counterPlaceholder)
  } else {
    return walls
      .merge(bedPlaceholder)
      .merge(closetPlaceholder)
      .merge(counterPlaceholder)
      .merge(toiletPlaceholder)
      .merge(bathPlaceholder)
  }
}

function createTrimBoard() {

}
