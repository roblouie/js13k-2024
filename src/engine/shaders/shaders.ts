// Generated with Shader Minifier 1.3.4 (https://github.com/laurentlb/Shader_Minifier/)
export const aCoords = 'M';
export const aDepth = 'O';
export const aNormal = 'G';
export const aPosition = 'i';
export const aTexCoord = 'L';
export const emissive = 'C';
export const fragDepth = 'm';
export const fragPos = 'f';
export const lightPovMvp = 'n';
export const lightWorldPosition = 'v';
export const modelviewProjection = 'Q';
export const normalMatrix = 'P';
export const outColor = 'g';
export const positionFromLightPov = 't';
export const shadowCubeMap = 'J';
export const shadowMap = 'K';
export const textureRepeat = 'A';
export const uSampler = 'D';
export const vColor = 'e';
export const vDepth = 'u';
export const vNormal = 'h';
export const vNormalMatrix = 's';
export const vTexCoord = 'o';
export const worldMatrix = 'l';
export const worldPosition = 'z';

export const depth_fragment_glsl = `#version 300 es
precision highp float;
uniform vec3 v;in vec3 f;out float m;void main(){m=length(f-v)/40.;}`;

export const depth_vertex_glsl = `#version 300 es
precision highp float;
layout(location=0) in vec4 i;uniform mat4 n,l;out vec3 f;void main(){gl_Position=n*i;f=vec3(l*vec4(i.xyz,1));}`;

export const fragment_glsl = `#version 300 es
precision highp float;
in vec4 e;in vec2 o;in float u;in vec3 h;in mat4 s;in vec4 t;in vec3 z;uniform vec2 A;uniform vec4 C;uniform vec3 v;vec4 c=vec4(1);uniform mediump sampler2DArray D;uniform mediump sampler2DShadow K;uniform mediump samplerCube J;vec3 d=vec3(0,8,40),H=normalize(vec3(0,-1,0));vec4 x=vec4(1,1,.8,1);float F=1.,E=.85;vec4 B=vec4(.05,.05,.05,1);out vec4 g;float p(float v,float m,float f,float h){return 1./(v*v*m+v*f+h);}void main(){vec3 m=z-v,l=v-z;float f=length(m);vec3 n=normalize(m),i=normalize(l);float e=texture(J,n).x*40.,t=.015,C=0.;C=e+t<f?0.:1.;vec3 K=normalize(mat3(s)*h);float G=max(0.,dot(i,K)),I=p(f,.005,.001,.4);vec4 L=c*G*I*C;vec3 M=d-z,N=normalize(M);float O=dot(H,-N),P=smoothstep(E,F,O);vec4 Q=x*G*P,R=clamp(B+L+Q,B,vec4(1));g=u<0.?R:texture(D,vec3(o*A,u))*R;}`;

export const vertex_glsl = `#version 300 es
layout(location=0) in vec3 M;layout(location=1) in vec3 G;layout(location=2) in vec2 L;layout(location=3) in float O;uniform mat4 Q,P,n,l;out vec2 o;out float u;out vec3 h;out mat4 s;out vec4 t;out vec3 z;void main(){vec4 v=vec4(M,1);gl_Position=Q*v;o=L;u=O;h=G;s=P;t=n*v;z=(l*v).xyz;}`;

