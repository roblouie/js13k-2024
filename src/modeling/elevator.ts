import { buildSegmentedWall, createBox, DoorHeight, DoubleDoorWidth } from '@/modeling/building-blocks';
import { Mesh } from '@/engine/renderer/mesh';
import { MoldableCubeGeometry } from '@/engine/moldable-cube-geometry';
import { materials } from '@/textures';
import { Face } from '@/engine/physics/face';
import { meshToFaces } from '@/engine/physics/parse-faces';

export class Elevator {
  meshes: Mesh[];
  openDoors: () => void;
  closeDoors: () => void;
  bodyCollision: Mesh;
  doorCollision: Set<Face>;
  isOpen = false;
  isOpenTriggered = false;
  isCloseTriggered = false;

  constructor() {
    const testWall = buildSegmentedWall([4, DoubleDoorWidth, 4], 12, [12, 3, 12], [0, 0, 0], 1);
    const testWall2 = buildSegmentedWall([16], 12, [12], [], 1);
    const testWall3 = buildSegmentedWall([10], 12, [12], [], 1);
    const testWall4 = buildSegmentedWall([10], 12, [12], [], 1);

    const elevatorBody = new Mesh(createBox(testWall, testWall2, testWall3, testWall4), materials.silver);
    const elevatorRail = new Mesh(
      new MoldableCubeGeometry(10, 0.5, 0.3).translate_(0, 4, -4)
        .merge(new MoldableCubeGeometry(0.3, 0.5, 6).translate_(-6, 4, 0))
        .merge(new MoldableCubeGeometry(0.3, 0.5, 6).translate_(6, 4, 0))
        .done_()
      , materials.silver);
    // @ts-ignore
    const panel = new Mesh(new MoldableCubeGeometry(1.5, 2, 0.5).translate_(5.4, 5, 5.2).spreadTextureCoords(-2, 2, 0.2).computeNormals().done_(), materials.elevatorPanel);
    //
    const bfSegments = [1.25, 4, 0.5, 4, 0.5, 4, 1.25];
    const lrSegments = [0.5, 4, 0.5, 4, 0.5];
    const elevatorWoodTest = new Mesh(createBox(
      buildSegmentedWall([bfSegments.reduce((acc, curr) => acc + curr)], 9, [0], [0]),
      buildSegmentedWall(bfSegments, 9, [0, 9, 0, 9, 0, 9, 0], [0]),
      buildSegmentedWall(lrSegments, 9, [0, 9, 0, 9, 0], [0]),
      buildSegmentedWall(lrSegments, 9, [0, 9, 0, 9, 0], [0]),
    ).translate_(0, 1.25).done_(), materials.wood);

    const elevatorFloor = new Mesh(new MoldableCubeGeometry(15, 1.5, 10.5).spreadTextureCoords(5, 5), materials.marble);
    const elevatorRoof = new Mesh(new MoldableCubeGeometry(15, 1.5, 10).translate_(0, 12).done_().spreadTextureCoords(), materials.ceilingTiles);

    const elevatorRightDoor = new Mesh(new MoldableCubeGeometry(4, DoorHeight, 0.5).translate_(-2, 4.5, 5.5).done_(), materials.silver);
    const elevatorLeftDoor = new Mesh(new MoldableCubeGeometry(4, DoorHeight, 0.5).translate_(2, 4.5, 5.5).done_(), materials.silver);

    this.bodyCollision = elevatorBody;
    this.doorCollision = new Set(meshToFaces([elevatorRightDoor, elevatorLeftDoor]));
    this.meshes = [elevatorBody, elevatorRail, elevatorFloor, elevatorRoof, elevatorWoodTest, panel, elevatorRightDoor, elevatorLeftDoor];

    this.openDoors = () => {
      if (elevatorRightDoor.position_.x > -5) {
        elevatorRightDoor.position_.x -= 0.04;
        elevatorLeftDoor.position_.x += 0.04;
      } else {
        this.isOpenTriggered = false;
      }
      this.isOpen = elevatorRightDoor.position_.x < -1;
    }

    this.closeDoors = () => {
      if (elevatorRightDoor.position_.x < 0) {
        elevatorRightDoor.position_.x += 0.04;
        elevatorLeftDoor.position_.x -= 0.04;
      } else {
        this.isCloseTriggered = false;
      }
      this.isOpen = elevatorRightDoor.position_.x < -1;
    }
  }

  update() {
    if (this.isOpenTriggered) {
      this.openDoors();
    } else if (this.isCloseTriggered) {
      this.closeDoors();
    }
  }
}
