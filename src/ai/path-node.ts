import { EnhancedDOMPoint } from '@/engine/enhanced-dom-point';
import { DoorData } from '@/lever-door';

export class PathNode {
  position: EnhancedDOMPoint;
  aboveSibling?: PathNode;
  belowSibling?: PathNode;
  rightSibling?: PathNode;
  leftSibling?: PathNode;
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
    return [this.aboveSibling, this.belowSibling, this.rightSibling, this.leftSibling].filter(i => i !== undefined);
  }

  attachNorthToOtherSouth(other: PathNode) {
    this.aboveSibling = other;
    other.belowSibling = this;
  }

  attachEastToOtherWest(other: PathNode) {
    this.rightSibling = other;
    other.leftSibling = this;
  }

  insertBetweenVert(above: PathNode, below: PathNode) {
    this.aboveSibling = above;
    this.belowSibling = below;
    above.belowSibling = this;
    below.aboveSibling = this;
  }

  insertBetweenHor(left: PathNode, right: PathNode) {
    this.leftSibling = left;
    this.rightSibling = right;
    left.leftSibling = this;
    right.rightSibling = this;
  }
}
