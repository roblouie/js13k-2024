import { EnhancedDOMPoint } from '@/engine/enhanced-dom-point';

export class PathNode {
  position: EnhancedDOMPoint;
  northSibling?: PathNode;
  southSibling?: PathNode;
  eastSibling?: PathNode;
  westSibling?: PathNode;

  constructor(position: EnhancedDOMPoint) {
    this.position = position;
  }

  getPresentSiblings(): PathNode[] {
    // @ts-ignore
    return [this.northSibling, this.southSibling, this.eastSibling, this.westSibling].filter(i => i !== undefined);
  }
}
