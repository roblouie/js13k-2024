import { buildRoom, createDetails, RoomDepth, RoomWidth } from '@/modeling/room';
import { buildSegmentedWall } from '@/modeling/building-blocks';
import { materials } from '@/textures';
import { meshToFaces } from '@/engine/physics/parse-faces';
import { Mesh } from '@/engine/renderer/mesh';
import { MoldableCubeGeometry } from '@/engine/moldable-cube-geometry';
import { Face } from '@/engine/physics/face';

const HallwayWidth = 10;

export function makeHotel(): [Face[], MoldableCubeGeometry] {

  const wallpapered = [
    materials.wallpaper.texture!,
    materials.wallpaper.texture!,
    materials.wallpaper.texture!,
    materials.wallpaper.texture!,
    materials.wallpaper.texture!,
    materials.wallpaper.texture!,
  ];

  const collidable = buildRoom(1).translate_(0, 0, HallwayWidth)
    .merge(buildRoom(2).translate_(0, 0, HallwayWidth * 2 + 25))
    .merge(buildRoom(3).translate_(0, 0, HallwayWidth * 3 + 50))
    // Second row of 3
    .merge(buildRoom(5).translate_(-HallwayWidth - RoomWidth, 0, HallwayWidth))
    .merge(buildRoom(7).translate_(-HallwayWidth - RoomWidth, 0, HallwayWidth * 2 + 25))
    .merge(buildRoom(9).translate_(-HallwayWidth - RoomWidth, 0, HallwayWidth * 3 + 50))
    // Third Row of 3
    .merge(buildRoom(4, true).rotate_(0, Math.PI).translate_((-HallwayWidth - RoomWidth) * 2, 0, HallwayWidth))
    .merge(buildRoom(6, true).rotate_(0, Math.PI).translate_((-HallwayWidth - RoomWidth) * 2, 0, HallwayWidth * 2 + 25))
    .merge(buildRoom(8, true).rotate_(0, Math.PI).translate_((-HallwayWidth - RoomWidth) * 2, 0, HallwayWidth * 3 + 50))
    // Fourth Row of 3
    .merge(buildRoom(10, true).rotate_(0, Math.PI).translate_((-HallwayWidth - RoomWidth) * 3, 0, HallwayWidth))
    .merge(buildRoom(11, true).rotate_(0, Math.PI).translate_((-HallwayWidth - RoomWidth) * 3, 0, HallwayWidth * 2 + 25))
    .merge(buildRoom(12, true).rotate_(0, Math.PI).translate_((-HallwayWidth - RoomWidth) * 3, 0, HallwayWidth * 3 + 50))

    // Move out on Z by half room depth to space rooms out from elevator
    // Move left on X by half hallway width + half room width  to center layout
    .translate_((RoomWidth + HallwayWidth) * 1.5, 0, HallwayWidth + 4)

    // Draw wall in front of elevator
    .merge(buildSegmentedWall([45, 11, 45], 12, [12, 2, 12], [], 1, 4, wallpapered)[0])

    // Draw back wall
    .merge(
      buildSegmentedWall([45, 11, 45], 12, [12, 3, 12], [], 1, 4, wallpapered)[0]
        .translate_(0, 0, 118)
    )

    // Build left side wall
    .merge(
      buildSegmentedWall([11, RoomDepth, HallwayWidth, RoomDepth, HallwayWidth, RoomDepth, 11], 12, [12, 0, 12, 0, 12, 0, 12], [], 1, 4, wallpapered)[0]
        .rotate_(0, Math.PI / 2)
        .translate_(49.5, 0, 59)
    )
    // Build right side wall
    .merge(
      buildSegmentedWall([11, RoomDepth, HallwayWidth, RoomDepth, HallwayWidth, RoomDepth, 11], 12, [12, 0, 12, 0, 12, 0, 12], [], 1, 4, wallpapered)[0]
        .rotate_(0, Math.PI / 2)
        .translate_(-49.5, 0, 59)
    )
    .translate_(0, 0, 6)

    .done_();

  const collidableFaces = meshToFaces([new Mesh(collidable, materials.wallpaper)]);

  const drawableHotel = createDetails(1).translate_(0, 0, HallwayWidth)
    .merge(createDetails(2).translate_(0, 0, HallwayWidth * 2 + 25))
    .merge(createDetails(3).translate_(0, 0, HallwayWidth * 3 + 50))
    // Second row of 3
    .merge(createDetails(5).translate_(-HallwayWidth - RoomWidth, 0, HallwayWidth))
    .merge(createDetails(7).translate_(-HallwayWidth - RoomWidth, 0, HallwayWidth * 2 + 25))
    .merge(createDetails(9).translate_(-HallwayWidth - RoomWidth, 0, HallwayWidth * 3 + 50))
    // Third Row of 3
    .merge(createDetails(4, true).rotate_(0, Math.PI).translate_((-HallwayWidth - RoomWidth) * 2, 0, HallwayWidth))
    .merge(createDetails(6, true).rotate_(0, Math.PI).translate_((-HallwayWidth - RoomWidth) * 2, 0, HallwayWidth * 2 + 25))
    .merge(createDetails(8, true).rotate_(0, Math.PI).translate_((-HallwayWidth - RoomWidth) * 2, 0, HallwayWidth * 3 + 50))
    // Fourth Row of 3
    .merge(createDetails(10, true).rotate_(0, Math.PI).translate_((-HallwayWidth - RoomWidth) * 3, 0, HallwayWidth))
    .merge(createDetails(11, true).rotate_(0, Math.PI).translate_((-HallwayWidth - RoomWidth) * 3, 0, HallwayWidth * 2 + 25))
    .merge(createDetails(12, true).rotate_(0, Math.PI).translate_((-HallwayWidth - RoomWidth) * 3, 0, HallwayWidth * 3 + 50))
    .translate_((RoomWidth + HallwayWidth) * 1.5, 0, HallwayWidth + 4)
    .merge(makeAllBracing())
    .translate_(0, 0, 6)



  return [collidableFaces, collidable.merge(drawableHotel).computeNormals().done_()];
}

function makeAllBracing() {
  const corridors = [-44, 0, 44].map(val => {
    return makeBracing(val, 0)
      .merge(makeBracing(val, RoomDepth - 0.75))
      .merge(makeBracing(val, RoomDepth + HallwayWidth))
      .merge(makeBracing(val, RoomDepth * 2 + HallwayWidth - 0.75))
      .merge(makeBracing(val, RoomDepth * 2 + HallwayWidth * 2))
      .merge(makeBracing(val, RoomDepth * 3 + HallwayWidth * 2 - 0.75))
  });
  return corridors[0].merge(corridors[1]).merge(corridors[2]);
}

function makeBracing(xOffset: number, zOffset: number) {
  const wood = [
    materials.potentialPlasterWall.texture!,
    materials.potentialPlasterWall.texture!,
    materials.potentialPlasterWall.texture!,
    materials.potentialPlasterWall.texture!,
    materials.potentialPlasterWall.texture!,
    materials.potentialPlasterWall.texture!,
  ];

  return buildSegmentedWall([0.75, HallwayWidth - 0.5, 0.75], 12, [12, 1, 12], [], 1.25, 4, wood)[0]
    .translate_(xOffset, 0, HallwayWidth + 1.875 + zOffset);
}
