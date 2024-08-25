import { EnhancedDOMPoint } from '@/engine/enhanced-dom-point';
import { PathNode } from '@/ai/path-node';
import { DoorData } from '@/lever-door';

export const AiNavPoints: PathNode[] = [];

export function makeNavPoints(doors: DoorData[]) {

  // OUTER CORNERS
  const LowerLeftCorner = new PathNode(new EnhancedDOMPoint(44, 2.5, 12), undefined, undefined, 'Bottom Left Corner');
  const LowerRightCorner = new PathNode(new EnhancedDOMPoint(-44, 2.5, 12),undefined, undefined, 'Bottom Right Corner');
  const TopLeftCorner = new PathNode(new EnhancedDOMPoint(44, 2.5, 118),undefined, undefined, 'Top Left Corner');
  const TopRightCorner = new PathNode(new EnhancedDOMPoint(-44, 2.5, 118),undefined, undefined, 'Top Right Corner');

  // MIDDLE HALLWAY INTERSECTIONS
  const BottomCenterEntrance = new PathNode(new EnhancedDOMPoint(0, 2.5, 12));
  const Room1304Entrance = new PathNode(new EnhancedDOMPoint(0, 2.5, 24), doors[0], 1304, `Room 1304 Doorway`);

  const Room1305Entrance = new PathNode(new EnhancedDOMPoint(0, 2.5, 36), doors[1], 1305, 'Room 1305 Doorway'); // 12 diff from prev
    const Room1305Bath = new PathNode(new EnhancedDOMPoint(12, 2.5, 35), doors[1], 1305, `Room 1305 Bath`);
    const Room1305Room = new PathNode(new EnhancedDOMPoint(27, 2.5, 33), undefined, 1305, `Room 1305 Room`);

  const LowerQuarterCenterIntersection = new PathNode(new EnhancedDOMPoint(0, 2.5, 47.5)); // 11.5 diff from prev
  const Room1306Entrance = new PathNode(new EnhancedDOMPoint(0, 2.5, 59)); // 11.5 diff from prev
  const Room1307Entrance = new PathNode(new EnhancedDOMPoint(0, 2.5, 71)); // 12 diff from prev
  const UpperQuarterCenterIntersection = new PathNode(new EnhancedDOMPoint(0, 2.5, 82.5));
  const Room1308Entrance = new PathNode(new EnhancedDOMPoint(0, 2.5, 94)) // 11.5 diff from prev
  const Room1309Entrance = new PathNode(new EnhancedDOMPoint(0, 2.5, 106)); // 12 diff from prev
  const TopCenterEntrance = new PathNode(new EnhancedDOMPoint(0, 2.5, 118.5)); // 11.5 diff from prev


  // LEFT HALLWAY INTERSECTIONS
  const Room1301Entrance = new PathNode(new EnhancedDOMPoint(44, 2.5, 24)); // same z as 1304, same x as all left hallways
  const FirstQuarterLeftIntersection = new PathNode(new EnhancedDOMPoint(44, 2.5, 47.5));
  const Room1302Entrance = new PathNode(new EnhancedDOMPoint(44, 2.5, 71));
  const SecondQuarterLeftIntersection = new PathNode(new EnhancedDOMPoint(44, 2.5, 82.5));
  const Room1303Entrance = new PathNode(new EnhancedDOMPoint(44, 2.5, 106));


  // RIGHT HALLWAY
  const FirstQuarterRightIntersection = new PathNode(new EnhancedDOMPoint(-44, 2.5, 47.5));
  const SecondQuarterRightIntersection = new PathNode(new EnhancedDOMPoint(-44, 2.5, 82.5));

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
  Room1305Entrance.aboveSibling = LowerQuarterCenterIntersection;
  Room1305Entrance.belowSibling = Room1304Entrance;
  Room1305Entrance.leftSibling = Room1305Bath;
  Room1305Bath.leftSibling = Room1305Room;
  Room1305Bath.rightSibling = Room1305Entrance;
  Room1305Room.rightSibling = Room1305Bath;

  // Lower Quarter Center Intersection

  LowerRightCorner.aboveSibling = TopRightCorner;
  LowerRightCorner.leftSibling = LowerLeftCorner;

  TopLeftCorner.belowSibling = LowerLeftCorner;
  TopLeftCorner.rightSibling = TopRightCorner;

  TopRightCorner.belowSibling = LowerRightCorner;
  TopRightCorner.leftSibling = TopLeftCorner;

  AiNavPoints.push(
    // Corners
    LowerLeftCorner, LowerRightCorner, TopLeftCorner, TopRightCorner,

    // Center Hallway
    BottomCenterEntrance, Room1304Entrance, Room1305Entrance, Room1305Bath, Room1305Room
  )
}
