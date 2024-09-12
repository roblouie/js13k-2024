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
    gl.bindTexture(0x0DE1, this.depthTexture);
    gl.texStorage2D(0x0DE1, 1, gl.DEPTH_COMPONENT32F, size, size);

    // Create the cube map
    this.cubeMapTexture = gl.createTexture()!;
    gl.bindTexture( 0x8513, this.cubeMapTexture);
    gl.texParameteri( 0x8513,  0x2801, gl.LINEAR);
    gl.texParameteri( 0x8513,  0x2800, gl.LINEAR);
    gl.texParameteri( 0x8513, gl.TEXTURE_WRAP_S, 0x812F);
    gl.texParameteri( 0x8513, gl.TEXTURE_WRAP_T, 0x812F);
    gl.texParameteri( 0x8513, gl.TEXTURE_WRAP_R, 0x812F);

    for (let i = 0; i < 6; i++) {
      gl.texImage2D(0x8515 + i, 0, gl.RGBA32F, size, size, 0, gl.RGBA, gl.FLOAT, null);
    }

    this.depthFramebuffer = gl.createFramebuffer()!;
    gl.bindFramebuffer(0x8D40, this.depthFramebuffer);
    gl.framebufferTexture2D(0x8D40, gl.DEPTH_ATTACHMENT, 0x0DE1, this.depthTexture, 0);

    gl.readBuffer(gl.NONE);
  }

  bindForWriting(i: number) {
    gl.activeTexture(gl.TEXTURE2);
    gl.bindFramebuffer(0x8D40, this.depthFramebuffer);
    gl.viewport(0, 0, this.size, this.size);
    gl.framebufferTexture2D(0x8D40, 0x8CE0, 0x8515 + i, this.cubeMapTexture, 0);
  }

  getSides() {
    return [
      { target: new EnhancedDOMPoint(1.0, 0.0, 0.0),  up: new EnhancedDOMPoint(0.0, -1.0, 0.0)},
      { target: new EnhancedDOMPoint(-1., 0.0, 0.0), up: new EnhancedDOMPoint(0.0, -1.0, 0.0) },
      { target: new EnhancedDOMPoint(0.0, 1.0, 0.0),  up: new EnhancedDOMPoint(0.0, 0.0, 1.0) },
      { target: new EnhancedDOMPoint(0.0, -1.0, 0.0), up: new EnhancedDOMPoint(0.0, 0.0, -1.0) },
      { target: new EnhancedDOMPoint(0.0, 0.0, 1.0),  up: new EnhancedDOMPoint(0.0, -1.0, 0.0) },
      { target: new EnhancedDOMPoint(0.0, 0.0, -1.0), up: new EnhancedDOMPoint(0.0, -1.0, 0.0) }
    ]
  }
}

