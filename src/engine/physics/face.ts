import { EnhancedDOMPoint } from "@/engine/enhanced-dom-point";
import { calculateFaceNormal } from '@/engine/helpers';

export class Face {
  points_: EnhancedDOMPoint[];
  normal: EnhancedDOMPoint;

  constructor(points: EnhancedDOMPoint[], normal?: EnhancedDOMPoint) {
    this.points_ = points;
    this.normal = normal ?? calculateFaceNormal(points);
  }
}
