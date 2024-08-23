import { EnhancedDOMPoint } from '@/engine/enhanced-dom-point';

export class PathNode {
  position: EnhancedDOMPoint;
  northSibling?: PathNode;
  southSibling?: PathNode;
  eastSibling?: PathNode;
  westSibling?: PathNode;

  name?: string;

  constructor(position: EnhancedDOMPoint, name: string) {
    this.position = position;
    this.name = name;
  }

  getPresentSiblings(): PathNode[] {
    // @ts-ignore
    return [this.northSibling, this.southSibling, this.eastSibling, this.westSibling].filter(i => i !== undefined);
  }
}
