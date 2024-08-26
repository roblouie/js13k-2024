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
  const BottomCenterEntrance = new PathNode(new EnhancedDOMPoint(0, 2.5, 12), undefined, undefined, 'Bottom Center Hallway');
  const Room1304Entrance = createRoomNodes(new EnhancedDOMPoint(0, 2.5, 24), 1304, doors[3], true);

  const Room1305Entrance = createRoomNodes(new EnhancedDOMPoint(0, 2.5, 36), 1305,  doors[4]);


  const LowerQuarterCenterIntersection = new PathNode(new EnhancedDOMPoint(0, 2.5, 47.5), undefined, undefined, 'Lower Quarter Center Hallway'); // 11.5 diff from prev
  const Room1306Entrance = createRoomNodes(new EnhancedDOMPoint(0, 2.5, 59), 1306, doors[5], true); // 11.5 diff from prev
  const Room1307Entrance = createRoomNodes(new EnhancedDOMPoint(0, 2.5, 71), 1307, doors[6]); // 12 diff from prev
  const UpperQuarterCenterIntersection = new PathNode(new EnhancedDOMPoint(0, 2.5, 82.5), undefined, undefined, 'Upper Quarter Center Hallway');
  const Room1308Entrance = createRoomNodes(new EnhancedDOMPoint(0, 2.5, 94), 1308, doors[7], true) // 11.5 diff from prev
  const Room1309Entrance = createRoomNodes(new EnhancedDOMPoint(0, 2.5, 106), 1309, doors[8]); // 12 diff from prev
  const TopCenterEntrance = new PathNode(new EnhancedDOMPoint(0, 2.5, 118.5), undefined, undefined, 'Top Center Hallway'); // 11.5 diff from prev


  // LEFT HALLWAY INTERSECTIONS
  const Room1301Entrance = createRoomNodes(new EnhancedDOMPoint(44, 2.5, 36), 1301, doors[0]);
  const LowerQuarterLeftIntersection = new PathNode(new EnhancedDOMPoint(44, 2.5, 47.5), undefined, undefined, 'Lower Quarter Left Hallway');
  const Room1302Entrance = createRoomNodes(new EnhancedDOMPoint(44, 2.5, 71), 1302, doors[1]);
  const UpperQuarterLeftIntersection = new PathNode(new EnhancedDOMPoint(44, 2.5, 82.5), undefined, undefined, 'Upper Quarter Left Hallway');
  const Room1303Entrance = createRoomNodes(new EnhancedDOMPoint(44, 2.5, 106), 1303, doors[2]);


  // RIGHT HALLWAY
  const Room1310Entrance = createRoomNodes(new EnhancedDOMPoint(-44, 2.5, 24), 1310, doors[9], true);
  const LowerQuarterRightIntersection = new PathNode(new EnhancedDOMPoint(-44, 2.5, 47.5), undefined, undefined, 'Lower Quarter Right Hallway');
  const Room1311Entrance = createRoomNodes(new EnhancedDOMPoint(-44, 2.5, 59), 1311, doors[10], true);
  const UpperQuarterRightIntersection = new PathNode(new EnhancedDOMPoint(-44, 2.5, 82.5), undefined, undefined, 'Upper Quarter Right Hallway');
  const Room1312Entrance = createRoomNodes(new EnhancedDOMPoint(-44, 2.5, 94), 1312, doors[11], true); // 11.5 diff from prev

  // Connect corners
  TopLeftCorner.rightSibling = TopRightCorner;
  TopLeftCorner.belowSibling = LowerLeftCorner;

  TopRightCorner.belowSibling = LowerRightCorner;
  LowerLeftCorner.rightSibling = LowerRightCorner;

  // Connect center hallways
  BottomCenterEntrance.insertBetweenHor(LowerLeftCorner, LowerRightCorner);
  TopCenterEntrance.insertBetweenHor(TopLeftCorner, TopRightCorner);
  UpperQuarterCenterIntersection.insertBetweenVert(TopCenterEntrance, BottomCenterEntrance);
  LowerQuarterCenterIntersection.insertBetweenVert(UpperQuarterCenterIntersection, BottomCenterEntrance);

  // Connect left hallway
  LowerQuarterLeftIntersection.insertBetweenVert(TopLeftCorner, LowerLeftCorner);
  LowerQuarterLeftIntersection.attachThisRightToOtherLeft(LowerQuarterCenterIntersection);
  UpperQuarterLeftIntersection.insertBetweenVert(TopLeftCorner, LowerQuarterLeftIntersection);
  UpperQuarterLeftIntersection.attachThisLeftToOtherRight(UpperQuarterCenterIntersection);

  // Connect Right hallway
  LowerQuarterRightIntersection.insertBetweenVert(TopRightCorner, LowerRightCorner);
  LowerQuarterRightIntersection.attachThisLeftToOtherRight(LowerQuarterCenterIntersection);
  UpperQuarterRightIntersection.insertBetweenVert(TopRightCorner, LowerQuarterRightIntersection);
  UpperQuarterRightIntersection.attachThisLeftToOtherRight(UpperQuarterCenterIntersection);

  // Connect Left Rooms
  Room1301Entrance.insertBetweenVert(LowerLeftCorner, LowerQuarterLeftIntersection);
  Room1302Entrance.insertBetweenVert(LowerQuarterLeftIntersection, UpperQuarterLeftIntersection);
  Room1303Entrance.insertBetweenVert(UpperQuarterLeftIntersection, TopLeftCorner);

  // Connect Right Rooms
  Room1310Entrance.insertBetweenVert(LowerRightCorner, LowerQuarterRightIntersection);
  Room1311Entrance.insertBetweenVert(LowerQuarterRightIntersection, UpperQuarterRightIntersection);
  Room1312Entrance.insertBetweenVert(UpperQuarterRightIntersection, TopRightCorner);

  // Connect Center Rooms
  Room1304Entrance.insertBetweenVert(BottomCenterEntrance, LowerQuarterCenterIntersection);
  Room1305Entrance.insertBetweenVert(Room1304Entrance, LowerQuarterCenterIntersection);

  Room1306Entrance.insertBetweenVert(LowerQuarterCenterIntersection, UpperQuarterCenterIntersection);
  Room1307Entrance.insertBetweenVert(Room1306Entrance, UpperQuarterCenterIntersection);

  Room1308Entrance.insertBetweenVert(UpperQuarterCenterIntersection, TopCenterEntrance);
  Room1309Entrance.insertBetweenVert(Room1308Entrance, TopCenterEntrance);


  AiNavPoints.push(
    // Corners
    LowerLeftCorner, BottomCenterEntrance
  )
}
