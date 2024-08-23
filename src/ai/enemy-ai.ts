import { PathNode } from '@/ai/path-node';
import { EnhancedDOMPoint } from '@/engine/enhanced-dom-point';
import { AiNavPoints } from '@/ai/ai-nav-points';
import { State } from '@/core/state';
import { StateMachine } from '@/core/state-machine';
import { FirstPersonPlayer } from '@/core/first-person-player';

class EnemyAi {
  position: EnhancedDOMPoint;
  currentNode: PathNode;
  nextNode: PathNode;
  patrolState: State;
  chaseState: State;
  killState: State;
  stateMachine: StateMachine;

  constructor(startingNode: PathNode) {
    this.currentNode = startingNode;
    this.position = new EnhancedDOMPoint().set(startingNode.position);
    const siblings = startingNode.getPresentSiblings();
    this.nextNode = siblings[Math.floor(Math.random() * siblings.length)];
    this.patrolState = { onUpdate: () => this.patrolUpdate() };
    this.chaseState = { onUpdate: (player: FirstPersonPlayer) => this.chaseUpdate(player) };
    this.killState = { onUpdate: (player: FirstPersonPlayer) => this.killUpdate(player) };
    this.stateMachine = new StateMachine(this.chaseState);
  }

  update(player: FirstPersonPlayer) {
    this.stateMachine.getState().onUpdate(player);
  }

  moveTowardsPoint() {

  }

  patrolUpdate() {
    const distance = new EnhancedDOMPoint().subtractVectors(this.nextNode.position, this.position);
    if (distance.magnitude > 1) {
      const direction_ = distance.normalize_().scale_(0.2);
      this.position.add_(direction_);
    } else {
      this.currentNode = this.nextNode;
      const siblings = this.currentNode.getPresentSiblings();
      this.nextNode = siblings[Math.floor(Math.random() * siblings.length)];
    }
  }

  chaseUpdate(player: FirstPersonPlayer) {
    const findClosestNavPoint = (points: PathNode[], target: EnhancedDOMPoint) => {
      let closestPoint: PathNode;
      let smallestDistance = Infinity;
      points.forEach(point => {
        const distance = new EnhancedDOMPoint().subtractVectors(target, point.position).magnitude;
        if (distance < smallestDistance) {
          closestPoint = point;
          smallestDistance = distance;
        }
      });
      return closestPoint;
    }

    const distance = new EnhancedDOMPoint().subtractVectors(this.nextNode.position, this.position);
    if (distance.magnitude > 1) {
      const direction_ = distance.normalize_().scale_(0.2);
      this.position.add_(direction_);
    } else {
      this.currentNode = this.nextNode;
      this.nextNode = findClosestNavPoint([...this.currentNode.getPresentSiblings(), this.currentNode], player.feetCenter)
    }

  }

  killUpdate(player: FirstPersonPlayer) {

  }
}

export const enemy = new EnemyAi(AiNavPoints[0]);
