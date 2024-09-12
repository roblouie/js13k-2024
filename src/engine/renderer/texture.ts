export class Texture {
  id: number;
  source: TexImageSource;

  constructor(id: number, source: TexImageSource) {
    this.source = source;
    this.id = id;
  }
}
