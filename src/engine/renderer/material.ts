import { Texture } from '@/engine/renderer/texture';

export class Material {
  texture?: Texture;

  constructor(props?: { texture?: Texture }) {
    this.texture = props?.texture;
  }
}
