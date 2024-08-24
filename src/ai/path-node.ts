import { EnhancedDOMPoint } from '@/engine/enhanced-dom-point';
import { DoorData } from '@/lever-door';

export class PathNode {
  position: EnhancedDOMPoint;
  northSibling?: PathNode;
  southSibling?: PathNode;
  eastSibling?: PathNode;
  westSibling?: PathNode;
  door?: DoorData;
  roomNumber?: number;

  name?: string;

  constructor(position: EnhancedDOMPoint, door?: DoorData, roomNumber?: number, name?: string) {
    this.position = position;
    this.name = name;
    this.door = door;
    this.roomNumber = roomNumber;
  }

  getPresentSiblings(): PathNode[] {
    // @ts-ignore
    return [this.northSibling, this.southSibling, this.eastSibling, this.westSibling].filter(i => i !== undefined);
  }
}
