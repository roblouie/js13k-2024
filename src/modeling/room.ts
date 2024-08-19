import { buildSegmentedWall, createBox, DoubleDoorWidth, SegmentedWall } from '@/modeling/building-blocks';
import { Material } from '@/engine/renderer/material';
import { Mesh } from '@/engine/renderer/mesh';
import { MoldableCubeGeometry } from '@/engine/moldable-cube-geometry';
import { materials } from '@/textures';
import { AttributeLocation } from '@/engine/renderer/renderer';

// Original elevator door width too big
const NormalDoorWidth = 5;

export function buildRoom() {
  const testWall = buildSegmentedWall([6, NormalDoorWidth, 6], 12, [12, 3, 12], [0, 0, 0], 0, 0);
  const testWall2 = buildSegmentedWall([17], 12, [12], [], 0, 0);
  const testWall3 = buildSegmentedWall([10], 12, [12], [], 0, 0);
  const testWall4 = buildSegmentedWall([10], 12, [12], [], 0, 0);

  const roomBody = new Mesh(
    createBox(testWall3, testWall4, testWall2, testWall).translate_(20, 0, 20).done_(),
    materials.patternedWallpaper);


  return [roomBody];
}


