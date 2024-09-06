import { PathNode } from '@/ai/path-node';
import { EnhancedDOMPoint } from '@/engine/enhanced-dom-point';
import { State } from '@/core/state';
import { StateMachine } from '@/core/state-machine';
import { FirstPersonPlayer } from '@/core/first-person-player';
import { Mesh } from '@/engine/renderer/mesh';
import { upyri } from '@/ai/enemy-model';
import { audioContext, biquadFilter, compressor, SimplestMidiRev2 } from '@/engine/audio/simplest-midi';
import { footstep, frenchHorn, song, violin } from '@/sounds';
import { AiNavPoints } from '@/ai/ai-nav-points';
import { lightInfo } from '@/light-info';

export class Enemy {
  position: EnhancedDOMPoint;
  currentNode: PathNode;
  nextNode: PathNode;
  patrolState: State;


  chaseState: State;


  searchState: State;
  spotSearchFrameCount = 0;
  spotsSearched = 0;
  fleeState: State;
  killState: State;
  stateMachine: StateMachine;
  model_: Mesh;
  pathCache: PathNode[] = [];
  positionInPathCache = 0;
  lastPlayerNode: PathNode;
  travelingDirection = new EnhancedDOMPoint();
  nextNodeDifference = new EnhancedDOMPoint();
  nextNodeDistance = 0;
  nextNodeDirection = new EnhancedDOMPoint();
  currentNodeDifference = new EnhancedDOMPoint();
  songInterval = 0;
  currentInterval = 0;
  footstepPlayer = new SimplestMidiRev2();
  pannerNode = new PannerNode(audioContext, {
    distanceModel: 'linear',
    maxDistance: 80,
    rolloffFactor: 99,
    coneOuterGain: 0.1
  });
  unseenFrameCount = 0;
  aggression = 0;
  songPlayer: SimplestMidiRev2;

  constructor(startingNode: PathNode) {
    this.songPlayer = new SimplestMidiRev2();
    this.songPlayer.volume_.connect(biquadFilter)
    this.footstepPlayer.volume_.connect(this.pannerNode).connect(compressor);
    this.currentNode = startingNode;
    this.position = new EnhancedDOMPoint().set(startingNode.position);
    const siblings = startingNode.getPresentSiblings();
    this.nextNode = siblings[Math.floor(Math.random() * siblings.length)];
    this.patrolState = {
      onEnter: () => {
        this.stopSong()
      },
      onUpdate: (player: FirstPersonPlayer) => this.patrolUpdate(player)
    };
    this.chaseState = {
      onEnter: (player: FirstPersonPlayer) => this.chaseEnter(player),
      onUpdate: (player: FirstPersonPlayer) => this.chaseUpdate(player),
    };
    this.searchState = {
      onEnter: () => this.searchEnter(),
      onUpdate: (player: FirstPersonPlayer) => this.searchUpdate(player),
    };
    this.fleeState = {
      onEnter: () => this.fleeEnter(),
      onUpdate: () => this.fleeUpdate(),
    };
    this.killState = { onUpdate: (player: FirstPersonPlayer) => this.killUpdate(player) };
    this.stateMachine = new StateMachine(this.patrolState);
    this.model_ = upyri();
  }

  playSong() {
    const playSong = () => {
      for (const note of song) {
        this.songPlayer.playNote(audioContext.currentTime + note[2], note[1],  note[4] - 10, [violin, frenchHorn][note[0]], audioContext.currentTime + note[2] + note[3]);
      }
    }
    this.songPlayer.volume_.gain.cancelScheduledValues(audioContext.currentTime);
    this.songPlayer.volume_.gain.value = 1;
    playSong();
    // @ts-ignore
    this.songInterval = setInterval(playSong, 6000);
  }

  stopSong() {
    this.songPlayer.volume_.gain.linearRampToValueAtTime(0, audioContext.currentTime + 3);
    clearInterval(this.songInterval);
  }

  increaseAggression() {
    if (this.aggression <= 0.9) {
      this.aggression += 0.1;
    }
  }

  decreaseAggression() {
    this.aggression *= 0.4;
  }

  getMaxUnseenFramesBeforeGivingUp() {
    return 300 + 600 * this.aggression;
  }

  getSpeed() {
    return 0.15 + 0.2 * this.aggression;
  }

  getChanceOfFindingPlayer() {
    return this.aggression * 0.4;
  }

  updateNodeDistanceData() {
    this.nextNodeDifference.subtractVectors(this.nextNode.position, this.position);
    this.nextNodeDistance = this.nextNodeDifference.magnitude;
    this.nextNodeDirection = this.nextNodeDifference.clone_().normalize_();
    this.currentNodeDifference.subtractVectors(this.currentNode.position, this.position);
  }


  update_(player: FirstPersonPlayer) {
    // tmpl.innerHTML += `ENEMY AGRESSION: ${this.aggression}<br>`
    this.updateNodeDistanceData();
    // lightInfo.pointLightPosition.set(this.position);
    // lightInfo.pointLightPosition.y = 1.5;
    // lightInfo.pointLightPosition.z = 23;

    this.stateMachine.getState().onUpdate(player);
    this.model_.position_.set(this.position);
  }

  patrolUpdate(player: FirstPersonPlayer) {
    // this.checkVision(player);

    // tmpl.innerHTML += 'ENEMY STATE: PATROL<br>';
    // Handle door opening, while door is opening, don't do anything else
    if (this.handleDoor(player)) {
      return;
    }

    if (this.nextNodeDistance > (6 - this.getSpeed() * 2)) {
      this.travelingDirection.lerp(this.nextNodeDirection, (this.getSpeed() / 4));
      this.moveInTravelingDirection();
    } else {
      this.moveInTravelingDirection();
      let lastNode = this.currentNode;
      this.currentNode = this.nextNode;
      let siblings = this.currentNode.getPresentSiblings();
      if (siblings.length > 1) {
        siblings = siblings.filter(p => {
          const isGoingToEnterRoom = this.currentNode.door && p.door && this.currentNode.roomNumber === p.roomNumber && this.currentNode !== p && !this.currentNode.hidingPlace;
          return p !== lastNode && !isGoingToEnterRoom;
        });
      }
      this.nextNode = siblings[Math.floor(Math.random() * siblings.length)];
    }
    if (!this.nextNode) {
      this.nextNode = this.currentNode;
    }
  }

  footstepDebounce: number;
  moveInTravelingDirection() {
    if (this.nextNodeDistance > 0.3) {
      const enemyFeetPos = 2.5;
      this.position.add_(this.travelingDirection.clone_().normalize_().scale_(this.getSpeed()));
      this.model_.lookAt(new EnhancedDOMPoint().addVectors(this.position, this.travelingDirection));
      this.position.y = enemyFeetPos + Math.sin(this.position.x + this.position.z) * 0.1;
      if (this.position.y < 2.402) {
        clearTimeout(this.footstepDebounce);
        this.footstepDebounce = setTimeout(() => this.footstepPlayer.playNote(audioContext.currentTime, 38 + Math.random() * 2, 50, footstep, audioContext.currentTime + 1), 40);
      }
      this.currentInterval++;
      this.pannerNode.positionX.value = this.position.x;
      this.pannerNode.positionZ.value = this.position.z;
    } else {
      this.position.set(this.nextNode.position);
    }
  }

  handleRoomEntering(player: FirstPersonPlayer, timeout: number) {
    if (this.currentNode.roomNumber === player.closestNavPoint.roomNumber) {
      setTimeout(() => {
        if (player.isHiding) {
          this.stateMachine.setState(this.searchState, player);
        } else {
          if (this.stateMachine.getState() !== this.chaseState) {
            this.stateMachine.setState(this.chaseState, player);
          }
        }
      }, timeout);
    }
  }

  handleDoor(player: FirstPersonPlayer) {
    if (
      this.currentNode.door && this.nextNode.door
      && this.currentNode.roomNumber === this.nextNode.roomNumber
      && this.currentNode !== this.nextNode
    ) {
      if ((this.currentNode.door.openClose === -1 || this.currentNode.door.isAnimating)) {
        if (!this.currentNode.door.isAnimating) {
          this.currentNode.door.pullLever(true);
          this.model_.lookAt(this.nextNode.position);
          this.travelingDirection.set(this.nextNodeDirection);
          this.handleRoomEntering(player, 2000);
        }
        return true;
      } else if (!this.currentNode.door.isAnimating) {
        this.handleRoomEntering(player, 100);
      }
    }
    return false;
  }

  chaseEnter(player: FirstPersonPlayer) {
    this.playSong();
    this.pathCache = [];
    this.positionInPathCache = 0;
    this.advancePathToNode(player.closestNavPoint);
    this.nextNode = this.pathCache[1] ?? this.currentNode;
    this.positionInPathCache++;
    const direction = new EnhancedDOMPoint().subtractVectors(this.nextNode.position, this.position).normalize_();
    this.travelingDirection.set(direction);
    this.unseenFrameCount = 0;
  }

  chaseUpdate(player: FirstPersonPlayer) {
    // tmpl.innerHTML += 'ENEMY STATE: CHASE<br>';

    // Handle door opening, while door is opening, don't do anything else
    if (this.handleDoor(player)) {
      return;
    }

    this.unseenFrameCount++;
    this.checkVision(player);

    if (this.unseenFrameCount >= this.getMaxUnseenFramesBeforeGivingUp()) {
      this.stateMachine.setState(this.fleeState);
      this.increaseAggression();
    }

    // If we're in chase mode and at the player hiding place. Kill the player. If the player was hidden
    // before the enemy entered the room, the enemy would be in search mode. So this means the enemy
    // entered the room while the player wasn't hidden, meaning they will die if they try to hide now.
    if (this.currentNode.hidingPlace && player.isHiding && player.closestNavPoint === this.currentNode) {
      // TODO: Kill player
    }

    const nodeDistance = this.nextNode.door ? 1 : 6;
    if (this.nextNodeDistance > (nodeDistance - this.getSpeed() * 2)) {
      this.travelingDirection.lerp(this.nextNodeDirection, (this.getSpeed() / 4));
      this.moveInTravelingDirection();
    } else {
      this.moveInTravelingDirection();
      this.currentNode = this.nextNode;
      this.advancePathToNode(player.closestNavPoint);
      if (!this.nextNode) {
        this.nextNode = this.currentNode;
      }
    }

  }

  advancePathToNode(node: PathNode) {
    if (this.lastPlayerNode === node && this.pathCache.length) {
      this.nextNode = this.pathCache[this.positionInPathCache];
      if (this.positionInPathCache < this.pathCache.length - 1) {
        this.positionInPathCache++;
      }

      return;
    }

    this.positionInPathCache = 0;
    this.lastPlayerNode = node;

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

    this.pathCache = search(this.currentNode, node)!;
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
          const isPlayerCloseEnough = (directionIndex < 2 && Math.abs(player.differenceFromNavPoint.x) < 5.75) || (directionIndex > 1 && Math.abs(player.differenceFromNavPoint.z) < 5.75);
          const isEnemyCloseEnough = (directionIndex < 2 && Math.abs(this.currentNodeDifference.x) < 5.75) || (directionIndex > 1 && Math.abs(this.currentNodeDifference.z) < 5.75);
          if (!player.isHiding && isPlayerCloseEnough && isEnemyCloseEnough) {
            const enemyPlayerDistance = new EnhancedDOMPoint().subtractVectors(player.feetCenter, this.position).magnitude;
            if (enemyPlayerDistance < 60) {
              // tmpl.innerHTML += `Distance: ${enemyPlayerDistance}`;
              // tmpl.innerHTML += 'PLAYER SEEN<br>';
              this.unseenFrameCount = 0;
              if (this.stateMachine.getState() !== this.chaseState) {
                this.stateMachine.setState(this.chaseState, player);
              }
              return true;
            }
          }
        } else {
          followPathToEnd(sibling, directionIndex);
        }
      }
    }

    const isPlayerCloseEnough = (Math.abs(player.differenceFromNavPoint.x) < 5.75) || (Math.abs(player.differenceFromNavPoint.z) < 5.75);
    const isEnemyCloseEnough = (Math.abs(this.currentNodeDifference.x) < 5.75) || (Math.abs(this.currentNodeDifference.z) < 5.75);
    if (!player.isHiding && this.currentNode === player.closestNavPoint && isPlayerCloseEnough && isEnemyCloseEnough) {
      // tmpl.innerHTML += 'PLAYER SEEN<br>';
      this.unseenFrameCount = 0;
      if (this.stateMachine.getState() !== this.chaseState) {
        this.stateMachine.setState(this.chaseState, player);
      }
      return;
    }

    followPathToEnd(this.currentNode, 0)
    || followPathToEnd(this.currentNode, 1)
    || followPathToEnd(this.currentNode, 2)
    || followPathToEnd(this.currentNode, 3);
  }



  searchEnter() {
    this.spotsSearched = 0;
  }

  searchUpdate(player: FirstPersonPlayer) {
    // tmpl.innerHTML += 'ENEMY STATE: SEARCH<br>';

    // If player comes out from hiding spot while searching, chase them
    if (!player.isHiding) {
      this.stateMachine.setState(this.chaseState, player);
    }

    if (this.nextNodeDistance > 0.5) {
      // tmpl.innerHTML += `DIRECTION: ${this.nextNodeDirection.x}, ${this.nextNodeDirection.y}, ${this.nextNodeDirection.z}`;
      this.travelingDirection.lerp(this.nextNodeDirection, 1);
      this.moveInTravelingDirection();
    } else {
      const searchSpotFor = 300;
      if (this.spotSearchFrameCount <= searchSpotFor) {
        this.model_.rotate_(0, this.spotSearchFrameCount > 100 ? 0.02 : -0.02, 0);
        this.spotSearchFrameCount++;
      } else {
        // TODO: KIll player based on kill chanceaw

        this.spotsSearched++;
        this.currentNode = this.nextNode;
        this.nextNode = this.currentNode.getPresentSiblings().find(node => node.hidingPlace)!
        this.updateNodeDistanceData();
        this.spotSearchFrameCount = 0;

        if (this.spotsSearched >= 2 && Math.random() > 0.25) {
          this.stateMachine.setState(this.fleeState);
          this.increaseAggression();
        }
      }
    }
  }

  farthestPoint = AiNavPoints[0];
  fleeEnter() {
    this.stopSong();
    let longestDistance = 0;
    const difference = new EnhancedDOMPoint();
    AiNavPoints.forEach(node => {
      const distance = difference.subtractVectors(this.position, node.position).magnitude;
      if (distance > longestDistance) {
        longestDistance = distance;
        this.farthestPoint = node;
      }
    });
    this.advancePathToNode(this.farthestPoint);
    this.nextNode = this.pathCache[0];
    this.updateNodeDistanceData();
  }

  fleeUpdate() {
    // tmpl.innerHTML += 'ENEMY STATE: FLEE<br>';
    if (this.nextNodeDistance > 1) {
      // tmpl.innerHTML += `DIRECTION: ${this.nextNodeDirection.x}, ${this.nextNodeDirection.y}, ${this.nextNodeDirection.z}`;
      this.travelingDirection.lerp(this.nextNodeDirection, 1);
      this.moveInTravelingDirection();
    } else {
      this.moveInTravelingDirection();
      this.currentNode = this.nextNode;
      this.advancePathToNode(this.farthestPoint);
      if (!this.nextNode) {
        this.nextNode = this.currentNode;
      }
      if (this.nextNode === this.farthestPoint) {
        this.stateMachine.setState(this.patrolState);
      }
    }
  }
}
