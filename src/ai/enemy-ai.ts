import { PathNode } from '@/ai/path-node';
import { EnhancedDOMPoint } from '@/engine/enhanced-dom-point';
import { State } from '@/core/state';
import { StateMachine } from '@/core/state-machine';
import { FirstPersonPlayer } from '@/core/first-person-player';
import { findClosestNavPoint } from '@/engine/helpers';

export class Enemy {
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

