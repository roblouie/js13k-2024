import { buildRoom, RoomDepth, RoomWidth } from '@/modeling/room';

export function makeHotel() {
  const HallwayWidth = 10;

  return buildRoom().translate_(0, 0, HallwayWidth)
    .merge(buildRoom().translate_(0, 0, HallwayWidth * 2 + 25))
    .merge(buildRoom().translate_(0, 0, HallwayWidth * 3 + 50))
    // Second row of 3
    .merge(buildRoom().translate_(-HallwayWidth - 36, 0, HallwayWidth))
    .merge(buildRoom().translate_(-HallwayWidth - 36, 0, HallwayWidth * 2 + 25))
    .merge(buildRoom().translate_(-HallwayWidth - 36, 0, HallwayWidth * 2 + 50))

    // Move out on Z by half room depth to space rooms out from elevator
    // Move left on X by half hallway width + half room width  to center layout
    .translate_(RoomWidth / 2 + HallwayWidth / 2, 0, HallwayWidth)
    .done_();
}
