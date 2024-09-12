import { gl } from '@/engine/renderer/lil-gl';
import { Texture } from '@/engine/renderer/texture';

class TextureLoader {
  textures: Texture[] = [];

  load_(textureSource: TexImageSource): Texture {
    const texture = new Texture(this.textures.length, textureSource);
    this.textures.push(texture);
    return texture;
  }

  bindTextures() {
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(0x8C1A, gl.createTexture());
    gl.texStorage3D(0x8C1A, 8, gl.RGBA8, 512, 512, this.textures.length);

    this.textures.forEach((texture, index) => {
      gl.texSubImage3D(0x8C1A, 0, 0, 0, index, 512, 512, 1, gl.RGBA, gl.UNSIGNED_BYTE, texture.source);
    });
    gl.generateMipmap(0x8C1A);
  }
}

export const textureLoader = new TextureLoader();
