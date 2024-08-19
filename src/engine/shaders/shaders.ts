// Generated with Shader Minifier 1.3.4 (https://github.com/laurentlb/Shader_Minifier/)
export const aCoords = 'H';
export const aDepth = 'B';
export const aNormal = 'G';
export const aPosition = 'm';
export const aTexCoord = 'E';
export const emissive = 't';
export const fragDepth = 'v';
export const lightPovMvp = 'f';
export const modelviewProjection = 'J';
export const normalMatrix = 'K';
export const outColor = 'g';
export const positionFromLightPov = 'e';
export const shadowMap = 'z';
export const textureRepeat = 'h';
export const uSampler = 's';
export const vColor = 'i';
export const vDepth = 'n';
export const vNormal = 'o';
export const vNormalMatrix = 'u';
export const vTexCoord = 'l';

export const depth_fragment_glsl = `#version 300 es
precision highp float;
out float v;void main(){v=gl_FragCoord.z;}`;

export const depth_vertex_glsl = `#version 300 es
precision highp float;
layout(location=0) in vec4 m;uniform mat4 f;void main(){gl_Position=f*m;}`;

export const fragment_glsl = `#version 300 es
precision highp float;
in vec4 i;in vec2 l;in float n;in vec3 o;in mat4 u;in vec4 e;uniform vec2 h;uniform vec4 t;uniform mediump sampler2DArray s;uniform mediump sampler2DShadow z;out vec4 g;vec3 d=vec3(-1,1.5,-1);float A=.2f,C=1.f;vec2 D[5]=vec2[](vec2(0),vec2(-1,0),vec2(1,0),vec2(0,1),vec2(0,-1));float F=1.,I=4200.;void main(){for(int v=0;v<5;v++){vec3 m=vec3(e.xy+D[v]/I,e.z-.001);float f=texture(z,m);F*=max(f,.87);}vec3 v=normalize(mat3(u)*o),f=normalize(d);float m=max(dot(f,v)*F,A);vec3 i=length(t)>0.?t.xyz:m*vec3(1);vec4 C=vec4(i.xyz,1);g=n<0.?C:texture(s,vec3(l*h,n))*C;}`;

export const vertex_glsl = `#version 300 es
layout(location=0) in vec3 H;layout(location=1) in vec3 G;layout(location=2) in vec2 E;layout(location=3) in float B;uniform mat4 J,K,f;out vec2 l;out float n;out vec3 o;out mat4 u;out vec4 e;void main(){vec4 v=vec4(H,1);gl_Position=J*v;l=E;n=B;o=G;u=K;e=f*v;}`;

