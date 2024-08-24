import { EnhancedDOMPoint } from '@/engine/enhanced-dom-point';
import { PathNode } from '@/ai/path-node';

// OUTER CORNERS
const LowerLeftCorner = new PathNode(new EnhancedDOMPoint(44, 2.5, 12), 'Bottom Left Corner');
const LowerRightCorner = new PathNode(new EnhancedDOMPoint(-44, 2.5, 12), 'Bottom Right Corner');
const TopLeftCorner = new PathNode(new EnhancedDOMPoint(44, 2.5, 118), 'Top Left Corner');
const TopRightCorner = new PathNode(new EnhancedDOMPoint(-44, 2.5, 118), 'Top Right Corner');

// MIDDLE HALLWAY INTERSECTIONS
const BottomCenterEntrance = new PathNode(new EnhancedDOMPoint(0, 2.5, 12));
const Room1304Entrance = new PathNode(new EnhancedDOMPoint(0, 2.5, 24));
const Room1305Entrance = new PathNode(new EnhancedDOMPoint(0, 2.5, 36));
const LowerQuarterCenterIntersection = new PathNode(new EnhancedDOMPoint(0, 2.5, 47.5));
const Room1306Entrance = new PathNode(new EnhancedDOMPoint(0, 2.5, 59));

const UpperQuarterCenterIntersection = new PathNode(new EnhancedDOMPoint(0, 2.5, 82.5));
const TopCenterEntrance = new PathNode(new EnhancedDOMPoint(0, 2.5, 118));


// OUTER HALLWAY INTERSECTIONS
const FirstQuarterLeftIntersection = new PathNode(new EnhancedDOMPoint(44, 2.5, 47.5));
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

export const AiNavPoints = [LowerLeftCorner, LowerRightCorner, TopLeftCorner, TopRightCorner];
