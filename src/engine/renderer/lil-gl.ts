import {
  depth_fragment_glsl,
  depth_vertex_glsl,
  fragment_glsl, shadowCubeMap, uSampler, vertex_glsl
} from '@/engine/shaders/shaders';

export class LilGl {
  gl: WebGL2RenderingContext;
  program: WebGLProgram;
  depthProgram: WebGLProgram;

 constructor() {
   // @ts-ignore
   this.gl = c3d.getContext('webgl2')!;
   const vertex = this.createShader(this.gl.VERTEX_SHADER, vertex_glsl);
   const fragment = this.createShader(this.gl.FRAGMENT_SHADER, fragment_glsl);
   this.program = this.createProgram(vertex, fragment);
   const depthVertex = this.createShader(this.gl.VERTEX_SHADER, depth_vertex_glsl);
   const depthFragment = this.createShader(this.gl.FRAGMENT_SHADER, depth_fragment_glsl);
   this.depthProgram = this.createProgram(depthVertex, depthFragment);

   const shadowCubeMapLocation = this.gl.getUniformLocation(this.program, shadowCubeMap)
   const textureLocation = this.gl.getUniformLocation(this.program, uSampler);
   this.gl.useProgram(this.program);
   this.gl.uniform1i(textureLocation, 0);
   this.gl.uniform1i(shadowCubeMapLocation, 2);
 }

  createShader(type: GLenum, source: string): WebGLShader {
    const shader = this.gl.createShader(type)!;
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    return shader;
  }

  createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram {
    const program = this.gl.createProgram()!;
    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);

    // if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
    //   console.log(this.gl.getShaderInfoLog(vertexShader));
    //   console.log(this.gl.getShaderInfoLog(fragmentShader));
    // }

    return program;
  }
}

export const lilgl = new LilGl();
export const gl = lilgl.gl;
