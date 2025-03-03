import { Face } from './face';
import { EnhancedDOMPoint } from "@/engine/enhanced-dom-point";
import { FirstPersonPlayer } from '@/core/first-person-player';

export const halfLevelSize = 90;
const cellSize = 15;
const cellsInEachDirection = 12;

export function getGridPosition(point: EnhancedDOMPoint) {
  return Math.floor((point.x + halfLevelSize) / cellSize) + (Math.floor((point.z + halfLevelSize) / cellSize) * cellsInEachDirection);
}

export function getGridPositionWithNeighbors(point: EnhancedDOMPoint, gridLength: number) {
  const gridPos = getGridPosition(point);
  return [
    gridPos,
    gridPos - 1 - cellsInEachDirection, // Upper left neighbor
    gridPos - cellsInEachDirection, // upper neighbor
    gridPos + 1 - cellsInEachDirection, // upper right neighbor
    gridPos - 1, // left neighbor
    gridPos + 1, // right neighbor
    gridPos - 1 + cellsInEachDirection, // lower left neighbor
    gridPos + cellsInEachDirection, // lower neighbor
    gridPos + 1 + cellsInEachDirection // lower right neighbor
  ].filter(gp => gp >= 0 && gp < gridLength);
}


export function build2dGrid(allFaces: Face[]) {
  const gridFaces: Set<Face>[] = [];

  allFaces.forEach(face => {
    face.points_.map(getGridPosition).forEach(gp => {
      if (!gridFaces[gp]) {
        gridFaces[gp] = new Set<Face>();
      }
      gridFaces[gp].add(face);
    });
  });

  return gridFaces;
}


const floor = new EnhancedDOMPoint(0, 1, 0);
const ceiling = new EnhancedDOMPoint(0, -1, 0);
export function findWallCollisionsFromList(walls: Set<Face>, player: FirstPersonPlayer) {
  for (const wall of walls) {
    // if (wall.normal.isEqualTo(ceiling) || wall.normal.isEqualTo(floor)) {
    //   continue;
    // }

    const newWallHit = testSphereTriangle(player.collisionSphere, wall);

    if (newWallHit) {
      const correctionVector = newWallHit.penetrationNormal.scale_(newWallHit.penetrationDepth + 0.00000001);
      player.collisionSphere.center.add_(correctionVector);

      const normalComponent = newWallHit.penetrationNormal.scale_(player.velocity.dot(newWallHit.penetrationNormal));
      player.velocity.subtract(normalComponent);

      // Slightly sketch way of dealing with gravity on a sloped surface, but it does work
      if (wall.normal.y >= 0.6 && player.velocity.y < 0) {
        player.velocity.y = 0;
      } else if (wall.normal.y <= -0.6 && player.velocity.y > 0) {
        player.velocity.y = 0;
      }
    }
  }
}

const sphereTriangleDist = new EnhancedDOMPoint();
const centerPointDist = new EnhancedDOMPoint();
function testSphereTriangle(s: { center: EnhancedDOMPoint, radius: number }, wall: Face) {
  // Ignore back sides of triangles
  const dist = sphereTriangleDist.subtractVectors(s.center, wall.points_[0]).dot(wall.normal);
  if (dist < 0) {
    return;
  }

  const p = closestPointInTriangle(s.center, wall.points_[0], wall.points_[1], wall.points_[2]);
  const v = centerPointDist.subtractVectors(s.center, p);
  const squaredDistanceFromPointOnTriangle = v.dot(v);
  const isColliding = squaredDistanceFromPointOnTriangle <= s.radius * s.radius;
  if (isColliding) {
    const penetrationNormal = v.normalize_();
    const penetrationDepth = s.radius - Math.sqrt(squaredDistanceFromPointOnTriangle);
    return {
      penetrationNormal,
      penetrationDepth,
    };
  }
}

const abPoint = new EnhancedDOMPoint();
const acPoint = new EnhancedDOMPoint();
const apPoint = new EnhancedDOMPoint();
const bpPoint = new EnhancedDOMPoint();
const cpPoint = new EnhancedDOMPoint();
const abScaleV = new EnhancedDOMPoint();
const aabScaleV = new EnhancedDOMPoint();
const acScaleW = new EnhancedDOMPoint();
const aacScaleW = new EnhancedDOMPoint();
const wbcPoint = new EnhancedDOMPoint();
const bWbc = new EnhancedDOMPoint();
const abvPoint = new EnhancedDOMPoint();
const acwPoint = new EnhancedDOMPoint();
const abvacwaPoint = new EnhancedDOMPoint();
function closestPointInTriangle(p: EnhancedDOMPoint, a: EnhancedDOMPoint, b: EnhancedDOMPoint, c: EnhancedDOMPoint) {
  const ab = abPoint.subtractVectors(b, a);
  const ac = acPoint.subtractVectors(c, a);
  const ap = apPoint.subtractVectors(p, a);

  const d1 = ab.dot(ap);
  const d2 = ac.dot(ap);

  if (d1 <= 0 && d2 <= 0) return a;

  const bp = bpPoint.subtractVectors(p, b);
  const d3 = ab.dot(bp);
  const d4 = ac.dot(bp);

  if (d3 >= 0 && d4 <= d3) return b;

  const vc = d1 * d4 - d3 * d2;

  if (vc <= 0 && d1 >= 0 && d3 <= 0) {
    const v = d1 / (d1 - d3);
    return aabScaleV.addVectors(a, abScaleV.set(ab).scale_(v));
  }

  const cp = cpPoint.subtractVectors(p, c);
  const d5 = ab.dot(cp);
  const d6 = ac.dot(cp);

  if (d6 >= 0 && d5 <= d6) return c;

  const vb = d5 * d2 - d1 * d6;
  if (vb <= 0 && d2 >= 0 && d6 <= 0) {
    const w = d2 / (d2 - d6);
    return aacScaleW.addVectors(a, acScaleW.set(ac).scale_(w));
  }

  const va = d3 * d6 - d5 * d4;
  if (va <= 0 && (d4 - d3) >= 0 && (d5 - d6) >= 0) {
    const w = (d4 - d3) / ((d4 - d3) + (d5 - d6));
    const wbc = wbcPoint.subtractVectors(c, b).scale_(w);
    return bWbc.addVectors(b, wbc);
  }

  const denom = 1 / (va + vb + vc);
  const v = vb * denom;
  const w = vc * denom;
  const abv = abvPoint.set(ab).scale_(v);
  const acw = acwPoint.set(ac).scale_(w);
  return abvacwaPoint.addVectors(abv, acw).add_(a);
}