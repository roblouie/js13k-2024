import {
  buildSegmentedWall,
  createBox, DoorHeight,
  DoorTopSegment, getAllWhite,
  WallHeight
} from '@/modeling/building-blocks';
import { MoldableCubeGeometry } from '@/engine/moldable-cube-geometry';
import { materials } from '@/textures';

// Original elevator door width too big
const NormalDoorWidth = 5;
export const RoomWidth = 34;
export const RoomDepth = 25;

export function buildRoom(roomNumber: number, swapSign = false, isIncludeDetails = false) {
  const allWood = [
    materials.wood.texture!,
    materials.wood.texture!,
    materials.wood.texture!,
    materials.wood.texture!,
    materials.wood.texture!,
    materials.wood.texture!,
  ];

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
    materials.wallpaper.texture!,
    materials.wallpaper.texture!,]);

  const [bathroomDoorWall] = buildSegmentedWall([4, NormalDoorWidth, 4], 12, [12, DoorTopSegment, 12], [], 1, 4, [
    materials.greenPlasterWall.texture!,
      materials.greenPlasterWall.texture!,
      materials.greenPlasterWall.texture!,
      materials.greenPlasterWall.texture!,
      materials.greenPlasterWall.texture!,
      materials.greenPlasterWall.texture!
    ]);
  bathroomDoorWall.rotate_(0, Math.PI).translate_(-10).spreadTextureCoords().computeNormals();

  const secondBathroomWall = new MoldableCubeGeometry(1, WallHeight, 11.5).texturePerSide(materials.greenPlasterWall.texture!,
    materials.greenPlasterWall.texture!,
    materials.greenPlasterWall.texture!,
    materials.greenPlasterWall.texture!,
    materials.greenPlasterWall.texture!,
    materials.greenPlasterWall.texture!).translate_(-4, 6, -6.25).spreadTextureCoords();

  const bathroomCornerColumn = new MoldableCubeGeometry(3, WallHeight, 4).texturePerSide(
    materials.greenPlasterWall.texture!,
    materials.greenPlasterWall.texture!,
    materials.greenPlasterWall.texture!,
    materials.greenPlasterWall.texture!,
    materials.greenPlasterWall.texture!,
    materials.greenPlasterWall.texture!,
  ).translate_(-6, 6, -9.5).spreadTextureCoords();

  const aboveShowerWall = new MoldableCubeGeometry(9, 3, 1).texturePerSide(
    materials.greenPlasterWall.texture!,
    materials.greenPlasterWall.texture!,
    materials.greenPlasterWall.texture!,
    materials.greenPlasterWall.texture!,
    materials.greenPlasterWall.texture!,
    materials.greenPlasterWall.texture!,
  ).merge(new MoldableCubeGeometry(12, 0.5, 1.5).translate_(2, 1.25).texturePerSide(...getAllWhite()))
    .translate_(-12, 10, -8)
    .spreadTextureCoords();


  const bedPlaceholder = new MoldableCubeGeometry(7, 2, 8)
      .translate_(6, 2, -6.5)
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

  const bathPlaceholder = new MoldableCubeGeometry(7, 5, 3)
    .translate_(-11.5, 3, -9)
    .texturePerSide(...getAllWhite())
    .done_();

  const closetPlaceholder = new MoldableCubeGeometry(4, 8, 6)
    .translate_(14, 4, 5)
    .texturePerSide(...getAllWhite())
    .done_();

  const allSilver = [
    materials.silver.texture!,
    materials.silver.texture!,
    materials.silver.texture!,
    materials.silver.texture!,
    materials.silver.texture!,
    materials.silver.texture!,
  ];

  const allMarble = [
    materials.marble.texture!,
    materials.marble.texture!,
    materials.marble.texture!,
    materials.marble.texture!,
    materials.marble.texture!,
    materials.marble.texture!,
  ];

  const bathroomFloor = new MoldableCubeGeometry(10, 2, 8)
    .translate_(-11, -0.4, -4)
    .texturePerSide(...allMarble)

  const counter = new MoldableCubeGeometry(3, 1, 7, 12, 1, 12)
    .selectBy(pos => pos.y > 0 && Math.hypot(pos.x, pos.z) < 1)
    .spherify(1)
    .translate_(0, -0.5)
    .modifyEachVertex(vert => vert.y *= -1)
    .translate_(0, 0.4, 0)
    .selectBy(pos => pos.y > -0.5 && Math.hypot(pos.x, pos.z) < 1.3)
    .translate_(-0.2)
    .texturePerSide(...getAllWhite())
    .all_()
    .merge(
      new MoldableCubeGeometry(1, 1, 1, 2, 1, 2).cylindrify(0.2).translate_(1.1, 0.3, -0.5).texturePerSide(...allSilver)
    )
    .merge(
      new MoldableCubeGeometry(1, 1, 1, 2, 1, 2).cylindrify(0.2).translate_(1.1, 0.3, 0.5).texturePerSide(...allSilver)
    )
    .merge(
      new MoldableCubeGeometry(1, 0.2, 0.4).translate_(0.7, 0.7).texturePerSide(...allSilver)
    )
    .merge(new MoldableCubeGeometry(3, 3, 7).translate_(0.1, -2).texturePerSide(...allWood))
    .merge(new MoldableCubeGeometry(1, 4, 4).translate_(1.5, 3.2).texturePerSide(...allSilver))
    .translate_(-6, 3.2, -4)
    .computeNormals(true)
    .done_()


  const bath = createBox(
    [new MoldableCubeGeometry(8.5, 3, 0.5).texturePerSide(...getAllWhite()), 9.75],
    [new MoldableCubeGeometry(8.5, 15, 0.5).texturePerSide(...getAllWhite()), 9.75],
    [new MoldableCubeGeometry(3.75, 15, 0.5).texturePerSide(...getAllWhite()), 2.5],
    [new MoldableCubeGeometry(3.75, 15, 0.5).texturePerSide(...getAllWhite()), 2.5],
  ).merge(new MoldableCubeGeometry(8.5, 0.5, 3).texturePerSide(...getAllWhite()))
    .merge(
      new MoldableCubeGeometry(1, 1, 1, 1, 3, 3).cylindrify(0.1, 'x')
        .selectBy(pos => pos.x < 0)
        .scale_(1, 3, 3)
        .all_()
        .rotate_(0, 0, 0.5)
        .translate_(3.75, 6.5)
        .texturePerSide(...allSilver)
    )
    .merge(
      new MoldableCubeGeometry(6, 7, 0.1, 8, 1, 1)
        .modifyEachVertex(vert => vert.z = Math.sin(vert.x * 3) * 0.3)
        .translate_(-0.5, 3.75, 2.5)
        .rotate_(-0.1)
        .texturePerSide(...getAllWhite())
    )
    .translate_(-11.75, 1, -9.5)
    .computeNormals()
    .done_()


  const closet = new MoldableCubeGeometry(0.2, 8, 6).translate_(1.5).texturePerSide(...allWood) // back
      .merge(new MoldableCubeGeometry(3, 0.2, 6).translate_(0, -4).texturePerSide(...allWood)) // top
      .merge(new MoldableCubeGeometry(3, 0.2, 6).translate_(0, 4).texturePerSide(...allWood)) // bottom
      .merge(new MoldableCubeGeometry(3, 8.2, 0.2).translate_(0, 0, 3.1).texturePerSide(...allWood))
      .merge(new MoldableCubeGeometry(3, 8.2, 0.2).translate_(0, 0, -3.1).texturePerSide(...allWood))
      .merge(new MoldableCubeGeometry(0.2, 8, 3).translate_(-0.5, 0, -1.75).rotate_(0, 0.25).texturePerSide(...allWood))
      .merge(new MoldableCubeGeometry(0.2, 8, 3).translate_(-2.75, 0, 0.8).rotate_(0, 0.5).texturePerSide(...allWood))
      .translate_(14, 4.5, 5)
      .done_()
    // new MoldableCubeGeometry(3, 8, 6)

  const makePillow = () => {
    return new MoldableCubeGeometry(1, 1, 1, 4, 3, 4)
      .spherify(1)
      .selectBy(v => Math.abs(v.x) > 0.8 || Math.abs(v.z) > 0.8)
      .scale_(0.8, 1, 0.8)
      .all_()
      .scale_(2, 0.3)
      .rotate_(0.5)
      .translate_(0, 1.3, -3.5)
      .texturePerSide(...getAllWhite())
      .computeNormals(true)
      .done_()
  }

  const bed =  new MoldableCubeGeometry(7, 2, 7, 5, 1, 5)
    .selectBy(v => Math.hypot(v.x, v.z) > 4.5)
    .scale_(0.9, 1, 0.9)
    .selectBy(v => Math.hypot(v.x, v.z) > 3)
    .scale_(1, 0.9, 1)
    .all_()
    .scale_(1, 1, 1.2)
    .texturePerSide(...getAllWhite())
    .merge(makePillow().translate_(-1.5))
    .merge(makePillow().translate_(1.5))
    .computeNormals(true)
    .merge(
      new MoldableCubeGeometry(7, 7, 0.5)
        .translate_(0, 0, -4.5)
        .texturePerSide(...allWood)
        .merge(new MoldableCubeGeometry(7, 1, 8.5)
          .translate_(0, -1.5).texturePerSide(...allWood)).computeNormals()
    )
    .translate_(6, 2, -6.5)
    .done_();

  const toilet = new MoldableCubeGeometry(2, 2,2, 4, 2, 4)
    .cylindrify(1)
    .scale_(1, 1, 1.2)
    .selectBy(v => v.y === 0)
    .scale_(0.7, 1, 0.7)
    .translate_(0, -0.5)
    .texturePerSide(...getAllWhite())
    .merge(new MoldableCubeGeometry(2, 2, 1).translate_(0, 1.5, 1.5).texturePerSide(...getAllWhite()))
    .all_()
    .translate_(-14.5, 1.5, -2.25)
    .done_();

  function makeBedsideTable() {
    const table = new MoldableCubeGeometry(3, 3, 2).texturePerSide(...allWood);
    if (isIncludeDetails) {
      table.merge(new MoldableCubeGeometry(1, 0.2).translate_(0, 1, 0.6).texturePerSide(...allSilver))
    }
    return table.computeNormals().done_();
  }

  const leftBedsideTable = makeBedsideTable().translate_(-0.25, 1.5, -9.5);
  const rightBedsideTable = makeBedsideTable().translate_(12.25, 1.5, -9.5);

  const desk = makeBedsideTable()
    .merge(makeBedsideTable().translate_(3))
    .merge(makeBedsideTable().translate_(-3))
    .rotate_(0, 3.14)
    .translate_(0, 1.5, 10);

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
      .merge(bathroomFloor)
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
    .merge(bathroomCornerColumn)
    .merge(aboveShowerWall);

  if (isIncludeDetails) {
    return walls.merge(trim)
      .merge(doorNumberPlate)
      .merge(closet)
      .merge(counter)
      .merge(bath)
      .merge(bed)
      .merge(toilet)
      .merge(leftBedsideTable)
      .merge(rightBedsideTable)
      .merge(desk)
  } else {
    return walls
      .merge(bedPlaceholder)
      .merge(closetPlaceholder)
      .merge(counterPlaceholder)
      .merge(toiletPlaceholder)
      .merge(bathPlaceholder)
      .merge(leftBedsideTable)
      .merge(rightBedsideTable)
      .merge(desk)
  }
}

function createTrimBoard() {

}
