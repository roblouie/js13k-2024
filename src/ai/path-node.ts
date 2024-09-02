import { EnhancedDOMPoint } from '@/engine/enhanced-dom-point';
import { LeverDoorObject3d } from '@/lever-door';
import { HidingPlace } from '@/hiding-place';

export class PathNode {
  position: EnhancedDOMPoint;
  aboveSibling?: PathNode;
  belowSibling?: PathNode;
  rightSibling?: PathNode;
  leftSibling?: PathNode;
  door?: LeverDoorObject3d;
  roomNumber?: number;
  hidingPlace?: HidingPlace;

  constructor(position: EnhancedDOMPoint, door?: LeverDoorObject3d, roomNumber?: number, hidingPlace?: HidingPlace) {
    this.position = position;
    this.door = door;
    this.roomNumber = roomNumber;
    this.hidingPlace = hidingPlace;
  }

  getAllSiblings(): (PathNode | undefined)[] {
    return [this.aboveSibling, this.belowSibling, this.rightSibling, this.leftSibling];
  }

  getPresentSiblings(): PathNode[] {
    // @ts-ignore
    return this.getAllSiblings().filter(i => i !== undefined);
  }

  attachThisRightToOtherLeft(other: PathNode) {
    this.rightSibling = other;
    other.leftSibling = this;
  }

  attachThisLeftToOtherRight(other: PathNode) {
    this.leftSibling = other;
    other.rightSibling = this;
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
    left.rightSibling = this;
    right.leftSibling = this;
  }

}
