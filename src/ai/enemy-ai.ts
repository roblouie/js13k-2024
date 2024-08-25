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

  pathCache: PathNode[] = [];
  positionInPathCache = 0;
  lastPlayerNode: PathNode;
  chaseUpdate(player: FirstPersonPlayer) {
    const distance = new EnhancedDOMPoint().subtractVectors(this.nextNode.position, this.position);
    if (distance.magnitude > 0.5) {
      const direction_ = distance.normalize_().scale_(0.2);
      this.position.add_(direction_);
    } else {
      this.currentNode = this.nextNode;

      if (this.lastPlayerNode === player.closestNavPoint && this.pathCache) {
        this.nextNode = this.pathCache[this.positionInPathCache];
        if (this.positionInPathCache < this.pathCache.length - 1) {
          this.positionInPathCache++;
        }

        return;
      }

      this.positionInPathCache = 0;
      this.lastPlayerNode = player.closestNavPoint;

      const search = (start: PathNode, target?: PathNode) => {
        if (start === target) return [start];

        const queue: { node: PathNode; path: PathNode[] }[] = [{ node: start, path: [start] }];
        const visited: Set<PathNode> = new Set();

        while (queue.length > 0) {
          const { node, path } = queue.shift()!;
          visited.add(node);

          for (const sibling of node.getPresentSiblings()) {
            if (!visited.has(sibling)) {
              const newPath = [...path, sibling];

              if (sibling === target) {
                return newPath;
              }

              queue.push({ node: sibling, path: newPath });
            }
          }
        }
      }

      this.pathCache = search(this.currentNode, player.closestNavPoint)!;
    }

  }

  killUpdate(player: FirstPersonPlayer) {

  }
}

