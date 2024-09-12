import { EnhancedDOMPoint } from '@/engine/enhanced-dom-point';

export const lightInfo = {
  pointLightPosition: new EnhancedDOMPoint(0, 7, 0),
  pointLightColor: new EnhancedDOMPoint(1, 1, 1),
  pointLightAttenuation: new EnhancedDOMPoint(0.008, 0.01, 0.4),
  spotLightPosition: new EnhancedDOMPoint(),
  spotLightDirection: new EnhancedDOMPoint(),
  spotLightColor: new EnhancedDOMPoint(1, 1, 1),
}
