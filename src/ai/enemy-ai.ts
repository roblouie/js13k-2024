import { PathNode } from '@/ai/path-node';
import { EnhancedDOMPoint } from '@/engine/enhanced-dom-point';
import { State } from '@/core/state';
import { StateMachine } from '@/core/state-machine';
import { FirstPersonPlayer } from '@/core/first-person-player';
import { Mesh } from '@/engine/renderer/mesh';
import { upyri } from '@/ai/enemy-model';
import { controls } from '@/core/controls';
import { audioContext, compressor, SimplestMidiRev2 } from '@/engine/audio/simplest-midi';
import { bassDrum1, playSong } from '@/sounds';

export class Enemy {
  position: EnhancedDOMPoint;
  currentNode: PathNode;
  nextNode: PathNode;
  patrolState: State;
  chaseState: State;
  killState: State;
  stateMachine: StateMachine;
  model_: Mesh;
  pathCache: PathNode[] = [];
  positionInPathCache = 0;
  lastPlayerNode: PathNode;
  speed_ = 0.2;
  travelingDirection = new EnhancedDOMPoint();
  nextNodeDifference = new EnhancedDOMPoint();
  nextNodeDistance = 0;
  nextNodeDirection = new EnhancedDOMPoint();
  currentNodeDifference = new EnhancedDOMPoint();
  songInterval = 0;
  footstepInterval = 30;
  currentInterval = 0;
  footstepPlayer = new SimplestMidiRev2();
  pannerNode = new PannerNode(audioContext, {
    distanceModel: 'linear',
    maxDistance: 80,
    rolloffFactor: 99,
    coneOuterGain: 0.1
  });

  constructor(startingNode: PathNode) {
    this.footstepPlayer.volume_.connect(this.pannerNode).connect(compressor);
    this.currentNode = startingNode;
    this.position = new EnhancedDOMPoint().set(startingNode.position);
    const siblings = startingNode.getPresentSiblings();
    this.nextNode = siblings[Math.floor(Math.random() * siblings.length)];
    this.patrolState = { onUpdate: (player: FirstPersonPlayer) => this.patrolUpdate(player) };
    this.chaseState = {
      onEnter: (player: FirstPersonPlayer) => this.chaseEnter(player),
      onUpdate: (player: FirstPersonPlayer) => this.chaseUpdate(player),
      onLeave: () => clearInterval(this.songInterval),
    };
    this.killState = { onUpdate: (player: FirstPersonPlayer) => this.killUpdate(player) };
    this.stateMachine = new StateMachine(this.patrolState);
    this.model_ = upyri();
  }

  updateNodeDistanceData() {
    this.nextNodeDifference.subtractVectors(this.nextNode.position, this.position);
    this.nextNodeDistance = this.nextNodeDifference.magnitude;
    this.nextNodeDirection = this.nextNodeDifference.clone_().normalize_();
    this.currentNodeDifference.subtractVectors(this.currentNode.position, this.position);
  }


  update_(player: FirstPersonPlayer) {
    this.updateNodeDistanceData();

    if (controls.isConfirm && !controls.prevConfirm) {
      if (this.stateMachine.getState() === this.patrolState) {
        this.stateMachine.setState(this.chaseState, player);
      } else {
        this.stateMachine.setState(this.patrolState);
      }
    }

    this.stateMachine.getState().onUpdate(player);
    this.model_.position_.set(this.position);
  }

  patrolUpdate(player: FirstPersonPlayer) {
    this.checkVision(player);

    // tmpl.innerHTML += 'ENEMY STATE: PATROL<br>';
    // Handle door opening, while door is opening, don't do anything else
    if (this.handleDoor()) {
      return;
    }

    if (this.nextNodeDistance > 6) {
      this.travelingDirection.lerp(this.nextNodeDirection, 0.05);
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
    if (!this.nextNode) {
      this.nextNode = this.currentNode;
    }
  }

  moveInTravelingDirection() {
    if (this.nextNodeDistance > 0.3) {
      const enemyFeetPos = 2.5;
      // if (this.currentNode !== this.nextNode) {
      this.position.add_(this.travelingDirection.clone_().normalize_().scale_(this.speed_));
      this.model_.lookAt(new EnhancedDOMPoint().addVectors(this.position, this.travelingDirection));
      this.position.y = enemyFeetPos + Math.sin(this.position.x + this.position.z) * 0.1;
      this.currentInterval++;
      this.pannerNode.positionX.value = this.position.x;
      this.pannerNode.positionZ.value = this.position.z;
      if (this.currentInterval === this.footstepInterval) {
        this.footstepPlayer.playNote(audioContext.currentTime, 72, 50, bassDrum1, audioContext.currentTime + 1);
        this.currentInterval = 0;
      }
    }
    // tmpl.innerHTML += `ENEMY Y: ${this.position.y}<br>`;
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

  chaseEnter(player: FirstPersonPlayer) {
    // @ts-ignore
    playSong();
    this.songInterval = setInterval(playSong, 6000);
    this.pathCache = [];
    this.positionInPathCache = 0;
    this.advancePathToPlayer(player);
    this.nextNode = this.pathCache[0] ?? this.currentNode;
    this.positionInPathCache++;
    const direction = new EnhancedDOMPoint().subtractVectors(this.nextNode.position, this.position).normalize_();
    this.travelingDirection.set(direction);
  }

  chaseUpdate(player: FirstPersonPlayer) {
    // tmpl.innerHTML += 'ENEMY STATE: CHASE<br>';
    this.checkVision(player);

    // Handle door opening, while door is opening, don't do anything else
    if (this.handleDoor()) {
      return;
    }


    if (this.nextNodeDistance > 6) {
      // tmpl.innerHTML += `DIRECTION: ${this.nextNodeDirection.x}, ${this.nextNodeDirection.y}, ${this.nextNodeDirection.z}`;
      this.travelingDirection.lerp(this.nextNodeDirection, 0.05);
      this.moveInTravelingDirection();
    } else {
      this.moveInTravelingDirection();
      this.currentNode = this.nextNode;
      this.advancePathToPlayer(player);
      if (!this.nextNode) {
        this.nextNode = this.currentNode;
      }
    }

  }

  advancePathToPlayer(player: FirstPersonPlayer) {
    if (this.lastPlayerNode === player.closestNavPoint && this.pathCache.length) {
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

      const queue: { node_: PathNode; path_: PathNode[] }[] = [{ node_: start, path_: [start] }];
      const visited: Set<PathNode> = new Set();

      while (queue.length > 0) {
        const { node_, path_ } = queue.shift()!;
        visited.add(node_);

        for (const sibling of node_.getPresentSiblings()) {
          if (!visited.has(sibling)) {
            const newPath = [...path_, sibling];

            if (sibling === target) {
              return newPath;
            }

            queue.push({ node_: sibling, path_: newPath });
          }
        }
      }
    }

    this.pathCache = search(this.currentNode, player.closestNavPoint)!;
  }

  killUpdate(player: FirstPersonPlayer) {

  }

  checkVision(player: FirstPersonPlayer) {
    const followPathToEnd = (node: PathNode | undefined, directionIndex: number) => {
      const sibling = node?.getAllSiblings()[directionIndex];
      // If the next node in a given direction is the one the player is on, and there's
      if (sibling && ((!sibling.door || sibling.door.openClose === 1) || !(sibling.roomNumber && node.roomNumber && sibling.roomNumber === node.roomNumber))) {
        // If our sightline caught the players node
        if (sibling === player.closestNavPoint) {
          // Make sure the player is close enough to it to actually be seen
          const isPlayerCloseEnough = (directionIndex < 2 && Math.abs(player.differenceFromNavPoint.x) < 6) || (directionIndex > 1 && Math.abs(player.differenceFromNavPoint.z) < 6);
          const isEnemyCloseEnough = (directionIndex < 2 && Math.abs(this.currentNodeDifference.x) < 6) || (directionIndex > 1 && Math.abs(this.currentNodeDifference.z) < 6);
          if (!player.isHiding && isPlayerCloseEnough && isEnemyCloseEnough) {
            // tmpl.innerHTML += 'PLAYER SEEN<br>';
            return true;
          }
        } else {
          followPathToEnd(sibling, directionIndex);
        }
      }
    }

    const isPlayerCloseEnough = (Math.abs(player.differenceFromNavPoint.x) < 7) || (Math.abs(player.differenceFromNavPoint.z) < 6);
    const isEnemyCloseEnough = (Math.abs(this.currentNodeDifference.x) < 7) || (Math.abs(this.currentNodeDifference.z) < 6);
    if (!player.isHiding && this.currentNode === player.closestNavPoint && isPlayerCloseEnough && isEnemyCloseEnough) {
      // tmpl.innerHTML += 'PLAYER SEEN<br>';
      return;
    }

    followPathToEnd(this.currentNode, 0)
    || followPathToEnd(this.currentNode, 1)
    || followPathToEnd(this.currentNode, 2)
    || followPathToEnd(this.currentNode, 3);
  }
}

