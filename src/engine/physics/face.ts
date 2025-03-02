import { EnhancedDOMPoint } from "@/engine/enhanced-dom-point";
import { calculateFaceNormal } from '@/engine/helpers';
import {AABB} from "@/engine/physics/aabb";

export class Face {
  points_: EnhancedDOMPoint[];
  normal: EnhancedDOMPoint;
  aabb: AABB;

  constructor(points: EnhancedDOMPoint[], normal?: EnhancedDOMPoint) {
    this.points_ = points;
    this.normal = normal ?? calculateFaceNormal(points);
    const min = new EnhancedDOMPoint(Infinity, Infinity, Infinity);
    const max =  new EnhancedDOMPoint(-Infinity, -Infinity, -Infinity);
    this.points_.forEach(point => {
      min.x = Math.min(min.x, point.x);
      min.y = Math.min(min.y, point.y);
      min.z = Math.min(min.z, point.z);

      max.x = Math.max(max.x, point.x);
      max.y = Math.max(max.y, point.y);
      max.z = Math.max(max.z, point.z);
    });
    this.aabb = { min, max };
  }
}
