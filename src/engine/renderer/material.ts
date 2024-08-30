import { Texture } from '@/engine/renderer/texture';

export class Material {
  emissive = [0.0, 0.0, 0.0, 0.0];
  texture?: Texture;

  constructor(props?: { texture?: Texture, emissive?: [number, number, number, number]}) {
    this.texture = props?.texture;
    this.emissive = props?.emissive ? props.emissive : this.emissive;
  }
}
