// Generated with Shader Minifier 1.3.4 (https://github.com/laurentlb/Shader_Minifier/)
export const aCoords = 'L';
export const aDepth = 'K';
export const aNormal = 'B';
export const aPosition = 'i';
export const aTexCoord = 'I';
export const emissive = 'z';
export const fragDepth = 'm';
export const fragPos = 'f';
export const lightPovMvp = 'e';
export const lightWorldPosition = 'v';
export const modelviewProjection = 'N';
export const normalMatrix = 'M';
export const outColor = 'g';
export const pointLightAttenuation = 'd';
export const positionFromLightPov = 's';
export const shadowCubeMap = 'y';
export const shadowMap = 'A';
export const spotlightDirection = 'D';
export const spotlightPosition = 'C';
export const uSampler = 'x';
export const vDepth = 'u';
export const vNormal = 'n';
export const vNormalMatrix = 'h';
export const vTexCoord = 'o';
export const worldMatrix = 'l';
export const worldPosition = 't';

export const depth_fragment_glsl = `#version 300 es
precision highp float;
uniform vec3 v;in vec3 f;out float m;void main(){m=length(f-v)/40.;}`;

export const depth_vertex_glsl = `#version 300 es
precision highp float;
layout(location=0) in vec4 i;uniform mat4 e,l;out vec3 f;void main(){gl_Position=e*i;f=vec3(l*vec4(i.xyz,1));}`;

export const fragment_glsl = `#version 300 es
precision highp float;
in vec2 o;in float u;in vec3 n;in mat4 h;in vec4 s;in vec3 t;uniform vec4 z;uniform vec3 v,d;vec4 c=vec4(1);uniform mediump sampler2DArray x;uniform mediump sampler2DShadow A;uniform mediump samplerCube y;uniform vec3 C,D;vec4 H=vec4(1,1,.8,1);float G=1.,F=.85;vec4 E=vec4(.05,.05,.05,1);out vec4 g;float p(float v,float m,float f,float h){return 1./(v*v*m+v*f+h);}void main(){vec3 m=t-v,l=v-t;float f=length(m);vec3 e=normalize(m),i=normalize(l);float s=texture(y,e).x*40.,A=.015,z=0.;z=s+A<f?0.:1.;vec3 B=normalize(mat3(h)*n);float I=max(0.,dot(i,B)),J=p(f,d.x,d.y,d.z);vec4 K=c*I*J*z;vec3 L=C-t,M=normalize(L);float N=length(L),O=max(0.,dot(M,B)),P=dot(D,-M),Q=smoothstep(F,G,P),R=p(N,.005,.001,.4);vec4 S=H*O*Q*R,T=clamp(E+K+S,E,vec4(1));g=texture(x,vec3(o,u))*T;}`;

export const vertex_glsl = `#version 300 es
layout(location=0) in vec3 L;layout(location=1) in vec3 B;layout(location=2) in vec2 I;layout(location=3) in float K;uniform mat4 N,M,e,l;out vec2 o;out float u;out vec3 n;out mat4 h;out vec4 s;out vec3 t;void main(){vec4 v=vec4(L,1);gl_Position=N*v;o=I;u=K;n=B;h=M;s=e*v;t=(l*v).xyz;}`;

