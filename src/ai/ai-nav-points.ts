import { EnhancedDOMPoint } from '@/engine/enhanced-dom-point';
import { PathNode } from '@/ai/path-node';
import { LeverDoorObject3d } from '@/lever-door';
import { HidingPlace } from '@/hiding-place';
import { Item } from '@/item';

export const AiNavPoints: PathNode[] = [];
export const items: Item[] = [];

const rightFacingRoomNumbers = [1304, 1306, 1308, 1310, 1311, 1312];

function createRoomNodes(roomPosition: EnhancedDOMPoint, roomNumber: number, door: LeverDoorObject3d) {
  const isGoingRight = rightFacingRoomNumbers.includes(roomNumber);
  const roomEntranceNode = new PathNode(roomPosition, door, roomNumber);
  const bathEntranceOffset = new EnhancedDOMPoint(12, 0, -1);
  const roomOffset = new EnhancedDOMPoint(27, 0, -3);
  const closetHidingPlaceOffset = new EnhancedDOMPoint(35.5, 0, 0.5);
  const showerHidingPlaceOffset = new EnhancedDOMPoint(12.75, 0, -15);
  if (isGoingRight) {
    bathEntranceOffset.scale_(-1);
    roomOffset.scale_(-1);
    closetHidingPlaceOffset.scale_(-1);
    showerHidingPlaceOffset.scale_(-1);
  }

  const bathEntranceNode = new PathNode(
    new EnhancedDOMPoint(roomPosition.x + bathEntranceOffset.x, roomPosition.y, roomPosition.z + bathEntranceOffset.z),
    door,
    roomNumber,
    new HidingPlace(new EnhancedDOMPoint(roomPosition.x + showerHidingPlaceOffset.x, 5.5, roomPosition.z + showerHidingPlaceOffset.z), new EnhancedDOMPoint(0, isGoingRight ? 0 : 3.14))
  );
  const roomNode = new PathNode(
    new EnhancedDOMPoint(roomPosition.x + roomOffset.x, roomPosition.y, roomPosition.z + roomOffset.z),
    undefined,
    roomNumber,
    new HidingPlace(new EnhancedDOMPoint(roomPosition.x + closetHidingPlaceOffset.x, 5.5, roomPosition.z + closetHidingPlaceOffset.z), new EnhancedDOMPoint(0, isGoingRight ? -1.7 : 1.7))
  );

  bathEntranceNode.insertBetweenHor(isGoingRight ? roomEntranceNode : roomNode, isGoingRight ? roomNode : roomEntranceNode);

  return roomEntranceNode;
}

export function makeNavPoints(doors: LeverDoorObject3d[]) {
  const roomEntrances = [
    createRoomNodes(new EnhancedDOMPoint(44, 2.5, 36), 1301, doors[0]),
    createRoomNodes(new EnhancedDOMPoint(44, 2.5, 71), 1302, doors[1]),
    createRoomNodes(new EnhancedDOMPoint(44, 2.5, 106), 1303, doors[2]),
    createRoomNodes(new EnhancedDOMPoint(0, 2.5, 24), 1304, doors[3], true),
    createRoomNodes(new EnhancedDOMPoint(0, 2.5, 36), 1305,  doors[4]),
    createRoomNodes(new EnhancedDOMPoint(0, 2.5, 59), 1306, doors[5], true),
    createRoomNodes(new EnhancedDOMPoint(0, 2.5, 71), 1307, doors[6]),
    createRoomNodes(new EnhancedDOMPoint(0, 2.5, 94), 1308, doors[7], true),
    createRoomNodes(new EnhancedDOMPoint(0, 2.5, 106), 1309, doors[8]),
    createRoomNodes(new EnhancedDOMPoint(-44, 2.5, 24), 1310, doors[9], true),
    createRoomNodes(new EnhancedDOMPoint(-44, 2.5, 59), 1311, doors[10], true),
    createRoomNodes(new EnhancedDOMPoint(-44, 2.5, 94), 1312, doors[11], true),
  ];

  let roomsWorkingCopy = [...roomEntrances];
  const firstNode = roomsWorkingCopy[Math.floor(Math.random() * (roomsWorkingCopy.length - 1))];
  firstNode.door!.isLocked = true;

  placeKeys(firstNode);

  function placeKeys(activeNode: PathNode) {
    const scaler = rightFacingRoomNumbers.includes(activeNode.roomNumber!) ? -1 : 1;

    const itemSpots = [
      // Bathroom
      [
        {
          position: new EnhancedDOMPoint(4.25 * scaler, 1.75, -7 * scaler),
          rotation_: new EnhancedDOMPoint(0, Math.PI / 4),
        },
        {
          position: new EnhancedDOMPoint(-4.5 * scaler, 0.5, -7.5 * scaler),
          rotation_: new EnhancedDOMPoint(0, -Math.PI / 2),
        },
        {
          position: new EnhancedDOMPoint(-5.5 * scaler, 0.75, -12.75 * scaler),
          rotation_: new EnhancedDOMPoint(0, 0, Math.PI / 2),
        }
      ],
      // Bedroom
      [
        {
          position: new EnhancedDOMPoint(5.25 * scaler, -0.75, -12 * scaler),
          rotation_: new EnhancedDOMPoint(0, 0, Math.PI / 2),
        },
        {
          position: new EnhancedDOMPoint(-1 * scaler, -0.5, 8.4 * scaler),
          rotation_: new EnhancedDOMPoint(0, 0, -Math.PI / 2),
        },
        {
          position: new EnhancedDOMPoint(-2 * scaler, 0.8, -13.5 * scaler),
          rotation_: new EnhancedDOMPoint(Math.PI / 3 * -scaler, 0, 0),
        },
      ]
    ];

    roomsWorkingCopy = roomsWorkingCopy.filter(node => node !== activeNode);
    let nextNode: PathNode;
    let longestDistance = 0;
    const difference = new EnhancedDOMPoint();
    roomsWorkingCopy.forEach(node => {
      const distance = difference.subtractVectors(activeNode.position, node.position).magnitude;
      if (distance > longestDistance) {
        longestDistance = distance;
        nextNode = node;
      }
    });

    if (Math.random() <= 0.3) {
      nextNode = roomsWorkingCopy[Math.floor(Math.random() * (roomsWorkingCopy.length - 1))];
    }

    const bathNode = activeNode.getPresentSiblings().find(node => node.hidingPlace)!;
    const roomNode = bathNode.getPresentSiblings().find(node => node.hidingPlace)!;
    const itemRoomIndex = Math.floor(Math.random() * 2);
    const itemSpotIndex = Math.floor(Math.random() * 3);
    const nodeToPlaceItemIn = [bathNode, roomNode][itemRoomIndex];

    if (roomsWorkingCopy.length > 3) {
      nodeToPlaceItemIn.item = new Item(new EnhancedDOMPoint().addVectors(nodeToPlaceItemIn.position, itemSpots[itemRoomIndex][itemSpotIndex].position), itemSpots[itemRoomIndex][itemSpotIndex].rotation_, nextNode!.roomNumber);
      nextNode!.door!.isLocked = true;
    } else if (roomsWorkingCopy.length > 2) {
      nodeToPlaceItemIn.item = new Item(new EnhancedDOMPoint().addVectors(nodeToPlaceItemIn.position, itemSpots[itemRoomIndex][itemSpotIndex].position), itemSpots[itemRoomIndex][itemSpotIndex].rotation_, 1313);
    } else {
      nodeToPlaceItemIn.item = new Item(new EnhancedDOMPoint().addVectors(nodeToPlaceItemIn.position, itemSpots[itemRoomIndex][itemSpotIndex].position), itemSpots[itemRoomIndex][itemSpotIndex].rotation_);
    }

    items.push(nodeToPlaceItemIn.item);

    if (roomsWorkingCopy.length >= 1) {
      placeKeys(nextNode!);
    }
  }

  // OUTER CORNERS
  const LowerLeftCorner = new PathNode(new EnhancedDOMPoint(44, 2.5, 12));
  const LowerRightCorner = new PathNode(new EnhancedDOMPoint(-44, 2.5, 12));
  const TopLeftCorner = new PathNode(new EnhancedDOMPoint(44, 2.5, 118));
  const TopRightCorner = new PathNode(new EnhancedDOMPoint(-44, 2.5, 118));

  // MIDDLE HALLWAY INTERSECTIONS
  const BottomCenterEntrance = new PathNode(new EnhancedDOMPoint(0, 2.5, 12));



  const LowerQuarterCenterIntersection = new PathNode(new EnhancedDOMPoint(0, 2.5, 47.5)); // 11.5 diff from prev
  const UpperQuarterCenterIntersection = new PathNode(new EnhancedDOMPoint(0, 2.5, 82.5));
  const TopCenterEntrance = new PathNode(new EnhancedDOMPoint(0, 2.5, 118.5), undefined, 1313); // 11.5 diff from prev
  TopCenterEntrance.item = new Item(new EnhancedDOMPoint(0, 1.4, 20).add_(TopCenterEntrance.position), new EnhancedDOMPoint(), -1);
  items.push(TopCenterEntrance.item);


  // LEFT HALLWAY INTERSECTIONS
  const LowerQuarterLeftIntersection = new PathNode(new EnhancedDOMPoint(44, 2.5, 47.5));
  const UpperQuarterLeftIntersection = new PathNode(new EnhancedDOMPoint(44, 2.5, 82.5));


  // RIGHT HALLWAY
  const LowerQuarterRightIntersection = new PathNode(new EnhancedDOMPoint(-44, 2.5, 47.5));
  const UpperQuarterRightIntersection = new PathNode(new EnhancedDOMPoint(-44, 2.5, 82.5));

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
  UpperQuarterLeftIntersection.attachThisRightToOtherLeft(UpperQuarterCenterIntersection);

  // Connect Right hallway
  LowerQuarterRightIntersection.insertBetweenVert(TopRightCorner, LowerRightCorner);
  LowerQuarterRightIntersection.attachThisLeftToOtherRight(LowerQuarterCenterIntersection);
  UpperQuarterRightIntersection.insertBetweenVert(TopRightCorner, LowerQuarterRightIntersection);
  UpperQuarterRightIntersection.attachThisLeftToOtherRight(UpperQuarterCenterIntersection);

  // Connect Left Rooms
  roomEntrances[0].insertBetweenVert(LowerQuarterLeftIntersection, LowerLeftCorner);
  roomEntrances[1].insertBetweenVert(UpperQuarterLeftIntersection, LowerQuarterLeftIntersection);
  roomEntrances[2].insertBetweenVert(TopLeftCorner, UpperQuarterLeftIntersection);

  // Connect Right Rooms
  roomEntrances[9].insertBetweenVert(LowerQuarterRightIntersection, LowerRightCorner);
  roomEntrances[10].insertBetweenVert(UpperQuarterRightIntersection, LowerQuarterRightIntersection);
  roomEntrances[11].insertBetweenVert(TopRightCorner, UpperQuarterRightIntersection);

  // Connect Center Rooms
  roomEntrances[3].insertBetweenVert(LowerQuarterCenterIntersection, BottomCenterEntrance);
  roomEntrances[4].insertBetweenVert(LowerQuarterCenterIntersection, roomEntrances[3]);

  roomEntrances[5].insertBetweenVert(UpperQuarterCenterIntersection, LowerQuarterCenterIntersection);
  roomEntrances[6].insertBetweenVert(UpperQuarterCenterIntersection, roomEntrances[5]);

  roomEntrances[7].insertBetweenVert(TopCenterEntrance, UpperQuarterCenterIntersection);
  roomEntrances[8].insertBetweenVert(TopCenterEntrance, roomEntrances[7]);

  AiNavPoints.push(
    // Corners
    BottomCenterEntrance, LowerLeftCorner, LowerRightCorner, TopLeftCorner, TopRightCorner,
  );

  return firstNode;
}
