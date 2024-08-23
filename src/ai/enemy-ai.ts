import { PathNode } from '@/ai/path-node';
import { EnhancedDOMPoint } from '@/engine/enhanced-dom-point';
import { AiNavPoints } from '@/ai/ai-nav-points';

class EnemyAi {
  position: EnhancedDOMPoint;
  currentNode: PathNode;
  nextNode: PathNode;

  constructor(startingNode: PathNode) {
    this.currentNode = startingNode;
    this.position = new EnhancedDOMPoint().set(startingNode.position);
    const siblings = startingNode.getPresentSiblings();
    this.nextNode = siblings[Math.floor(Math.random() * siblings.length)];
  }

  update() {
    const distance = new EnhancedDOMPoint().subtractVectors(this.nextNode.position, this.position);
    if (distance.magnitude > 1) {
      const direction_ = distance.normalize_().scale_(0.05);
      this.position.add_(direction_);
    } else {
      this.currentNode = this.nextNode;
      const siblings = this.currentNode.getPresentSiblings();
      this.nextNode = siblings[Math.floor(Math.random() * siblings.length)];
    }
  }
}

export const enemy = new EnemyAi(AiNavPoints[0]);
