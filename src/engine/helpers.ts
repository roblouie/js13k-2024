import { EnhancedDOMPoint } from '@/engine/enhanced-dom-point';

export function radsToDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}

export function unormalizedNormal(points: EnhancedDOMPoint[]): EnhancedDOMPoint {
  const u = points[2].clone_().subtract(points[1]);
  const v = points[0].clone_().subtract(points[1]);
  return new EnhancedDOMPoint().crossVectors(u, v);
}

export function calculateFaceNormal(points: EnhancedDOMPoint[]): EnhancedDOMPoint {
  return unormalizedNormal(points).normalize_();
}
