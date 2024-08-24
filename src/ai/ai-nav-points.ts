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

  // RIGHT HALLWAY
  const FirstQuarterRightIntersection = new PathNode(new EnhancedDOMPoint(-44, 2.5, 47.5));
  const SecondQuarterLeftIntersection = new PathNode(new EnhancedDOMPoint(44, 2.5, 82.5));
  const SecondQuarterRightIntersection = new PathNode(new EnhancedDOMPoint(-44, 2.5, 82.5));

  LowerLeftCorner.northSibling = TopLeftCorner;
  LowerLeftCorner.eastSibling = LowerRightCorner;

  LowerRightCorner.northSibling = TopRightCorner;
  LowerRightCorner.westSibling = LowerLeftCorner;

  TopLeftCorner.southSibling = LowerLeftCorner;
  TopLeftCorner.eastSibling = TopRightCorner;

  TopRightCorner.southSibling = LowerRightCorner;
  TopRightCorner.westSibling = TopLeftCorner;

  AiNavPoints.push(LowerLeftCorner, LowerRightCorner, TopLeftCorner, TopRightCorner)
}
