import { EnhancedDOMPoint } from '@/engine/enhanced-dom-point';
import { PathNode } from '@/ai/path-node';
import { LeverDoorObject3d } from '@/lever-door';

export const AiNavPoints: PathNode[] = [];

function createRoomNodes(roomPosition: EnhancedDOMPoint, roomNumber: number, door: LeverDoorObject3d, isGoingRight?: boolean) {
  const roomEntranceNode = new PathNode(roomPosition, door, roomNumber, `Room ${roomNumber} Entrance`);
  const bathEntranceOffset = new EnhancedDOMPoint(12, 0, -1);
  const roomOffset = new EnhancedDOMPoint(27, 0, -3);
  if (isGoingRight) {
    bathEntranceOffset.scale_(-1);
    roomOffset.scale_(-1);
    const bathEntranceNode = new PathNode(new EnhancedDOMPoint(roomPosition.x + bathEntranceOffset.x, roomPosition.y, roomPosition.z + bathEntranceOffset.z), door, roomNumber, `Room ${roomNumber} Bath Entrance`);
    roomEntranceNode.attachThisRightToOtherLeft(bathEntranceNode);
    bathEntranceNode.attachThisRightToOtherLeft(new PathNode(new EnhancedDOMPoint(roomPosition.x + roomOffset.x, roomPosition.y, roomPosition.z + roomOffset.z), undefined, roomNumber, `Room ${roomNumber} Room`));
  } else {
    const bathEntranceNode = new PathNode(new EnhancedDOMPoint(roomPosition.x + bathEntranceOffset.x, roomPosition.y, roomPosition.z + bathEntranceOffset.z), door, roomNumber, `Room ${roomNumber} Bath Entrance`);
    roomEntranceNode.attachThisLeftToOtherRight(bathEntranceNode);
    bathEntranceNode.attachThisLeftToOtherRight(new PathNode(new EnhancedDOMPoint(roomPosition.x + roomOffset.x, roomPosition.y, roomPosition.z + roomOffset.z), undefined, roomNumber, `Room ${roomNumber} Room`));
  }

  return roomEntranceNode;
}

export function makeNavPoints(doors: LeverDoorObject3d[]) {

  // OUTER CORNERS
  const LowerLeftCorner = new PathNode(new EnhancedDOMPoint(44, 2.5, 12), undefined, undefined, 'Bottom Left Corner');
  const LowerRightCorner = new PathNode(new EnhancedDOMPoint(-44, 2.5, 12),undefined, undefined, 'Bottom Right Corner');
  const TopLeftCorner = new PathNode(new EnhancedDOMPoint(44, 2.5, 118),undefined, undefined, 'Top Left Corner');
  const TopRightCorner = new PathNode(new EnhancedDOMPoint(-44, 2.5, 118),undefined, undefined, 'Top Right Corner');

  // MIDDLE HALLWAY INTERSECTIONS
  const BottomCenterEntrance = new PathNode(new EnhancedDOMPoint(0, 2.5, 12));
  const Room1304Entrance = createRoomNodes(new EnhancedDOMPoint(0, 2.5, 24), 1304, doors[3], true);

  const Room1305Entrance = createRoomNodes(new EnhancedDOMPoint(0, 2.5, 36), 1305,  doors[4]);


  const LowerQuarterCenterIntersection = new PathNode(new EnhancedDOMPoint(0, 2.5, 47.5)); // 11.5 diff from prev
  const Room1306Entrance = createRoomNodes(new EnhancedDOMPoint(0, 2.5, 59), 1306, doors[5]); // 11.5 diff from prev
  const Room1307Entrance = createRoomNodes(new EnhancedDOMPoint(0, 2.5, 71), 1307, doors[6]); // 12 diff from prev
  const UpperQuarterCenterIntersection = new PathNode(new EnhancedDOMPoint(0, 2.5, 82.5));
  const Room1308Entrance = new PathNode(new EnhancedDOMPoint(0, 2.5, 94)) // 11.5 diff from prev
  const Room1309Entrance = new PathNode(new EnhancedDOMPoint(0, 2.5, 106)); // 12 diff from prev
  const TopCenterEntrance = new PathNode(new EnhancedDOMPoint(0, 2.5, 118.5)); // 11.5 diff from prev


  // LEFT HALLWAY INTERSECTIONS
  const Room1301Entrance = new PathNode(new EnhancedDOMPoint(44, 2.5, 36));
  const FirstQuarterLeftIntersection = new PathNode(new EnhancedDOMPoint(44, 2.5, 47.5));
  const Room1302Entrance = new PathNode(new EnhancedDOMPoint(44, 2.5, 71));
  const SecondQuarterLeftIntersection = new PathNode(new EnhancedDOMPoint(44, 2.5, 82.5));
  const Room1303Entrance = new PathNode(new EnhancedDOMPoint(44, 2.5, 106));


  // RIGHT HALLWAY
  const Room1310Entrance = new PathNode(new EnhancedDOMPoint(-44, 2.5, 24));
  const FirstQuarterRightIntersection = new PathNode(new EnhancedDOMPoint(-44, 2.5, 47.5));
  const Room1311Entrance = new PathNode(new EnhancedDOMPoint(-44, 2.5, 59));
  const SecondQuarterRightIntersection = new PathNode(new EnhancedDOMPoint(-44, 2.5, 82.5));
  const Room1312Entrance = new PathNode(new EnhancedDOMPoint(-44, 2.5, 94)) // 11.5 diff from prev

  // Connect bottom
  LowerLeftCorner.aboveSibling = TopLeftCorner;
  LowerLeftCorner.rightSibling = BottomCenterEntrance;

  BottomCenterEntrance.aboveSibling = Room1304Entrance;
  BottomCenterEntrance.rightSibling = LowerRightCorner;
  BottomCenterEntrance.leftSibling = LowerLeftCorner;

  // Room 1304
  Room1304Entrance.aboveSibling = Room1305Entrance;
  Room1304Entrance.belowSibling = BottomCenterEntrance;

  // Room 1305
  Room1305Entrance.insertBetweenVert(LowerQuarterCenterIntersection, Room1304Entrance);

  // Lower Quarter Center Intersection

  LowerRightCorner.aboveSibling = TopRightCorner;
  LowerRightCorner.leftSibling = LowerLeftCorner;

  TopLeftCorner.belowSibling = LowerLeftCorner;
  TopLeftCorner.rightSibling = TopRightCorner;

  TopRightCorner.belowSibling = LowerRightCorner;
  TopRightCorner.leftSibling = TopLeftCorner;

  AiNavPoints.push(
    // Corners
    LowerLeftCorner, BottomCenterEntrance
  )
}
