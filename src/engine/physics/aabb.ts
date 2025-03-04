import {EnhancedDOMPoint, VectorLike} from "@/engine/enhanced-dom-point";
import {Sphere} from "@/core/first-person-player";

export type AABB = { min: VectorLike, max: VectorLike };

export function isAABBOverlapping(a: AABB, b: AABB): boolean {
  return a.min.x <= b.max.x && a.max.x >= b.min.x
    && a.min.y <= b.max.y && a.max.y >= b.min.y
    && a.min.z <= b.max.z && a.max.z >= b.min.z;
}

export function isSphereOverlappingAABB(sphere: Sphere, box: AABB) {
  let d = 0;

  if (sphere.center.x < box.min.x) d += (sphere.center.x - box.min.x) ** 2;
  else if (sphere.center.x > box.max.x) d += (sphere.center.x - box.max.x) ** 2;

  if (sphere.center.y < box.min.y) d += (sphere.center.y - box.min.y) ** 2;
  else if (sphere.center.y > box.max.y) d += (sphere.center.y - box.max.y) ** 2;

  if (sphere.center.z < box.min.z) d += (sphere.center.z - box.min.z) ** 2;
  else if (sphere.center.z > box.max.z) d += (sphere.center.z - box.max.z) ** 2;

  return d <= sphere.radius * sphere.radius;
}