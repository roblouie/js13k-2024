import { PathNode } from '@/ai/path-node';
import { EnhancedDOMPoint } from '@/engine/enhanced-dom-point';
import { State } from '@/core/state';
import { StateMachine } from '@/core/state-machine';
import { FirstPersonPlayer } from '@/core/first-person-player';
import { Mesh } from '@/engine/renderer/mesh';
import { upyri } from '@/ai/enemy-model';

export class Enemy {
  position: EnhancedDOMPoint;
  currentNode: PathNode;
  nextNode: PathNode;
  patrolState: State;
  chaseState: State;
  killState: State;
  stateMachine: StateMachine;
  model: Mesh;
  // lookatPoint = new EnhancedDOMPoint();
  pathCache: PathNode[] = [];
  positionInPathCache = 0;
  lastPlayerNode: PathNode;
  speed = 0.2;

  travelingDirection = new EnhancedDOMPoint();

  constructor(startingNode: PathNode) {
    this.currentNode = startingNode;
    this.position = new EnhancedDOMPoint().set(startingNode.position);
    const siblings = startingNode.getPresentSiblings();
    this.nextNode = siblings[Math.floor(Math.random() * siblings.length)];
    this.patrolState = { onUpdate: () => this.patrolUpdate() };
    this.chaseState = { onUpdate: (player: FirstPersonPlayer) => this.chaseUpdate(player) };
    this.killState = { onUpdate: (player: FirstPersonPlayer) => this.killUpdate(player) };
    this.stateMachine = new StateMachine(this.patrolState);
    this.model = upyri();
  }

  update(player: FirstPersonPlayer) {
    this.stateMachine.getState().onUpdate(player);
    this.model.position_.set(this.position);
  }

  patrolUpdate() {
    // Handle door opening, while door is opening, don't do anything else
    if (this.handleDoor()) {
      return;
    }

    const distance = new EnhancedDOMPoint().subtractVectors(this.nextNode.position, this.position);
    if (distance.magnitude > 6) {
      const direction_ = distance.normalize_();
      this.travelingDirection.lerp(direction_, 0.05);
      this.moveInTravelingDirection();
    } else {
      this.moveInTravelingDirection();
      let lastNode = this.currentNode;
      this.currentNode = this.nextNode;
      let siblings = this.currentNode.getPresentSiblings();
      if (siblings.length > 1) {
        siblings = siblings.filter(p => {
          const isGoingToEnterRoom = this.currentNode.door && p.door && this.currentNode.roomNumber === p.roomNumber && this.currentNode !== p;
          return p !== lastNode && !isGoingToEnterRoom;
        });
      }
      this.nextNode = siblings[Math.floor(Math.random() * siblings.length)];
    }
  }

  moveInTravelingDirection() {
    if (this.currentNode !== this.nextNode) {
      this.position.add_(this.travelingDirection.clone_().normalize_().scale_(this.speed));
      this.model.lookAt(new EnhancedDOMPoint().addVectors(this.position, this.travelingDirection))
    }
  }

  handleDoor() {
    if (
      this.currentNode.door && this.nextNode.door
      && this.currentNode.roomNumber === this.nextNode.roomNumber
      && this.currentNode !== this.nextNode
      && (this.currentNode.door.openClose === -1 || this.currentNode.door.isAnimating))
    {
      if (!this.currentNode.door.isAnimating) {
        this.currentNode.door.pullLever(true);
      }
      return true;
    }
    return false;
  }

  chaseUpdate(player: FirstPersonPlayer) {
    // Handle door opening, while door is opening, don't do anything else
    if (this.handleDoor()) {
      return;
    }


    const distance = new EnhancedDOMPoint().subtractVectors(this.nextNode.position, this.position);
    if (distance.magnitude > 6) {
      const direction_ = distance.normalize_();
      this.travelingDirection.lerp(direction_, 0.05);
      this.moveInTravelingDirection();
    } else {
      this.moveInTravelingDirection();
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

