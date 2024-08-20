import { MoldableCubeGeometry } from '@/engine/moldable-cube-geometry';
import { doTimes } from '@/engine/helpers';
import { Texture } from '@/engine/renderer/texture';

export const DoubleDoorWidth = 8;
export const WallHeight = 12;
export const DoorHeight = 9;
export const DoorTopSegment = WallHeight - DoorHeight;

export const mergeCubes = (cubes: MoldableCubeGeometry[]) => cubes.reduce((acc, curr) => acc.merge(curr));

export function buildSegmentedWall(segmentWidths: number[], segmentHeight: number, topSegments: number[], bottomSegments: number[], depth = 1, textureScale = 12, texturesPerSide?: Texture[]): [MoldableCubeGeometry, number] {
  let geo: MoldableCubeGeometry;
  let totalWidth = 0;
  let runningSide = 0;
  let runningLeft = 0;

  topSegments.forEach((top, index) => {
    const currentWidth = segmentWidths[index];

    if (top > 0) {
      const topGeo = new MoldableCubeGeometry(currentWidth, top, depth,1,1,1,6)
        .translate_(runningSide + (index === 0 ? 0 : currentWidth / 2), segmentHeight - top / 2)
        .spreadTextureCoords(textureScale, textureScale);

      if (texturesPerSide) {
        // @ts-ignore
        topGeo.texturePerSide(...texturesPerSide);
      }
      if (!geo) {
        geo = topGeo;
      } else {
        geo.merge(topGeo);
      }
    }

    if (bottomSegments[index] > 0) {
      const bottomGeo = new MoldableCubeGeometry(currentWidth, bottomSegments[index], depth, 1, 1, 1, 6)
        .translate_(runningSide + (index === 0 ? 0 : currentWidth / 2), bottomSegments[index] / 2)
        .spreadTextureCoords(textureScale, textureScale);

      if (texturesPerSide) {
        // @ts-ignore
        bottomGeo.texturePerSide(...texturesPerSide);
      }
      if (!geo) {
        geo = bottomGeo;
      } else {
        geo.merge(bottomGeo);
      }
    }
    runningSide+= (index === 0 ? currentWidth / 2 : currentWidth);
    runningLeft += currentWidth;
  });

  totalWidth = runningLeft;
  // @ts-ignore
  if(geo) geo.all_().translate_((segmentWidths[0] - runningLeft) / 2, 0).computeNormals().done_();

  // @ts-ignore
  return [geo, totalWidth];
}


export function createHallway(frontWall: MoldableCubeGeometry | undefined, backWall: MoldableCubeGeometry | undefined, spacing: number): MoldableCubeGeometry {
  frontWall?.translate_(0, 0, spacing);
  backWall?.translate_(0, 0, -spacing);

  if (frontWall && backWall) {
    return frontWall.merge(backWall).done_();
  } else {
    // @ts-ignore
    return frontWall ?? backWall;
  }
}

export function createBox(frontWall: [MoldableCubeGeometry, number], backWall: [MoldableCubeGeometry, number], leftWall: [MoldableCubeGeometry, number], rightWall: [MoldableCubeGeometry, number]) {
  return createHallway(frontWall[0], backWall[0], (leftWall[1] + 1) / 2)
    .merge(createHallway(leftWall[0], rightWall[0], (frontWall[1] - 1) / 2).rotate_(0, Math.PI / 2)).computeNormals().done_();
}


// TODO: Remove this if i stick with ramps only
export function createStairs(stepCount: number, startingHeight = 0) {
  const stepHeight = 1;
  return mergeCubes(doTimes(stepCount, index => {
    const currentHeight = index * stepHeight + stepHeight + startingHeight;
    return new MoldableCubeGeometry(1, currentHeight, 3).translate_(index, currentHeight/2);
  })).done_();
}

export function patternFill(pattern: number[], times: number) {
  return doTimes(times, (index) => pattern[index % pattern.length]);
}
