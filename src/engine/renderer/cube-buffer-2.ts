import { gl } from '@/engine/renderer/lil-gl';
import { EnhancedDOMPoint } from '@/engine/enhanced-dom-point';

export class ShadowCubeMapFbo {
  size: number;
  depthTexture: WebGLTexture;
  cubeMapTexture: WebGLTexture;
  depthFramebuffer: WebGLFramebuffer;

  constructor(size: number) {
    this.size = size;

    // Create the depth buffer
    gl.activeTexture(gl.TEXTURE2);
    this.depthTexture = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, this.depthTexture);
    gl.texStorage2D(gl.TEXTURE_2D, 1, gl.DEPTH_COMPONENT32F, size, size);

    // Create the cube map
    this.cubeMapTexture = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.cubeMapTexture);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);

    for (let i = 0; i < 6; i++) {
      gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGBA32F, size, size, 0, gl.RGBA, gl.FLOAT, null);
    }

    this.depthFramebuffer = gl.createFramebuffer()!;
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.depthFramebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, this.depthTexture, 0);

    gl.readBuffer(gl.NONE);
  }

  bindForWriting(side: any) {
    gl.activeTexture(gl.TEXTURE2);
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.depthFramebuffer);
    gl.viewport(0, 0, this.size, this.size);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, side.face, this.cubeMapTexture, 0);
  }

  getSides() {
    return [
      { face: gl.TEXTURE_CUBE_MAP_POSITIVE_X, target: new EnhancedDOMPoint(1.0, 0.0, 0.0),  up: new EnhancedDOMPoint(0.0, -1.0, 0.0)},
      { face: gl.TEXTURE_CUBE_MAP_NEGATIVE_X, target: new EnhancedDOMPoint(-1., 0.0, 0.0), up: new EnhancedDOMPoint(0.0, -1.0, 0.0) },
      { face: gl.TEXTURE_CUBE_MAP_POSITIVE_Y, target: new EnhancedDOMPoint(0.0, 1.0, 0.0),  up: new EnhancedDOMPoint(0.0, 0.0, 1.0) },
      { face: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, target: new EnhancedDOMPoint(0.0, -1.0, 0.0), up: new EnhancedDOMPoint(0.0, 0.0, -1.0) },
      { face: gl.TEXTURE_CUBE_MAP_POSITIVE_Z, target: new EnhancedDOMPoint(0.0, 0.0, 1.0),  up: new EnhancedDOMPoint(0.0, -1.0, 0.0) },
      { face: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, target: new EnhancedDOMPoint(0.0, 0.0, -1.0), up: new EnhancedDOMPoint(0.0, -1.0, 0.0) }
    ]
  }
}

