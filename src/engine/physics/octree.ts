import {Face} from "@/engine/physics/face";
import {AABB, isAABBOverlapping, isSphereOverlappingAABB} from "@/engine/physics/aabb";
import {EnhancedDOMPoint} from "@/engine/enhanced-dom-point";
import {Sphere} from "@/core/first-person-player";

export class OctreeNode {
  parent?: OctreeNode;
  children?: OctreeNode[];
  faces: Face[] = [];
  depth: number;
  bounds: AABB;

  static readonly MaxTriangles = 10;
  static readonly MaxDepth = 10;

  constructor(depth: number, bounds: AABB) {
    this.depth = depth;
    this.bounds = bounds;
  }
}

export function insertFace(node: OctreeNode, triangle: Face) {
  if (!node.children) {
    node.faces.push(triangle);

    if (node.faces.length > OctreeNode.MaxTriangles && node.depth < OctreeNode.MaxDepth) {
      subdivide(node);

      node.faces.forEach(face => insertIntoChildren(node, face));
      node.faces = [];
      insertIntoChildren(node, triangle);
    }
  } else {
    insertIntoChildren(node, triangle);
  }
}

function insertIntoChildren(node: OctreeNode, triangle: Face) {
  if (!node.children) {
    throw new Error('Attempting to insert triangles to children that do not exist')
  }

  node.children.forEach(child => {
    if (isAABBOverlapping(triangle.aabb, child.bounds)) {
      insertFace(child, triangle);
    }
  })
}

function subdivide(node: OctreeNode) {
  const { min, max } = node.bounds;
  const center = new EnhancedDOMPoint(
    (min.x + max.x) / 2,
    (min.y + max.y) / 2,
    (min.z + max.z) / 2,
  );
  node.children = [];
  for (let i = 0; i < 8; i++) {
    const childMin = new EnhancedDOMPoint(
      (i & 1) ? center.x : min.x,
      (i & 2) ? center.y : min.y,
      (i & 4) ? center.z : min.z,
    );
    const childMax = new EnhancedDOMPoint(
      (i & 1) ? max.x : center.x,
      (i & 2) ? max.y : center.y,
      (i & 4) ? max.z : center.z,
    );
    node.children.push(new OctreeNode(node.depth + 1, { min: childMin, max: childMax }));
  }
}

// TODO: In full js13k release, precomupte this and just put in the hard bounds in the base
// octree, and delete th is function
export function computeSceneBounds(triangles: Face[]): AABB {
  const min = new EnhancedDOMPoint(Infinity, Infinity, Infinity);
  const max = new EnhancedDOMPoint(-Infinity, -Infinity, -Infinity);

  triangles.forEach(triangle => {
    min.x = Math.min(min.x, triangle.aabb.min.x);
    min.y = Math.min(min.y, triangle.aabb.min.y);
    min.z = Math.min(min.z, triangle.aabb.min.z);

    max.x = Math.max(max.x, triangle.aabb.max.x);
    max.y = Math.max(max.y, triangle.aabb.max.y);
    max.z = Math.max(max.z, triangle.aabb.max.z);
  });

  return { min, max };
}

export function querySphere(node: OctreeNode, sphere: Sphere, results: Set<Face>) {
  if (!isSphereOverlappingAABB(sphere, node.bounds)) {
    return;
  }

  if (!node.children) {
    node.faces.forEach(face => results.add(face));
  } else {
    node.children.forEach(child => querySphere(child, sphere, results));
  }
}