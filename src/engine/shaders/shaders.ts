// Generated with Shader Minifier 1.3.4 (https://github.com/laurentlb/Shader_Minifier/)
export const aCoords = 'L';
export const aDepth = 'K';
export const aNormal = 'H';
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
export const positionFromLightPov = 't';
export const shadowCubeMap = 'y';
export const spotlightDirection = 'C';
export const spotlightPosition = 'A';
export const uSampler = 'x';
export const vDepth = 'n';
export const vNormal = 'u';
export const vNormalMatrix = 'h';
export const vTexCoord = 'o';
export const worldMatrix = 'l';
export const worldPosition = 's';

export const depth_fragment_glsl = `#version 300 es
precision highp float;
uniform vec3 v;in vec3 f;out float m;void main(){m=length(f-v)/40.;}`;

export const depth_vertex_glsl = `#version 300 es
precision highp float;
layout(location=0) in vec4 i;uniform mat4 e,l;out vec3 f;void main(){gl_Position=e*i;f=vec3(l*vec4(i.xyz,1));}`;

export const fragment_glsl = `#version 300 es
precision highp float;
in vec2 o;in float n;in vec3 u;in mat4 h;in vec4 t;in vec3 s;uniform vec4 z;uniform vec3 v,d;vec4 c=vec4(1);uniform mediump sampler2DArray x;uniform mediump samplerCube y;uniform vec3 A,C;vec4 D=vec4(1,1,.8,1);float G=1.,F=.85;vec4 E=vec4(.05,.05,.05,1);out vec4 g;float p(float v,float m,float f,float h){return 1./(v*v*m+v*f+h);}void main(){vec3 m=s-v,l=v-s;float f=length(m);vec3 e=normalize(m),i=normalize(l);float t=texture(y,e).x*40.,B=.015,z=0.;z=t+B<f?0.:1.;vec3 H=normalize(mat3(h)*u);float I=max(0.,dot(i,H)),J=p(f,d.x,d.y,d.z);vec4 K=c*I*J*z;vec3 L=A-s,M=normalize(L);float N=length(L),O=max(0.,dot(M,H)),P=dot(C,-M),Q=smoothstep(F,G,P),R=p(N,.005,.001,.4);vec4 S=D*O*Q*R,T=clamp(E+K+S,E,vec4(1));g=texture(x,vec3(o,n))*T;}`;

export const vertex_glsl = `#version 300 es
layout(location=0) in vec3 L;layout(location=1) in vec3 H;layout(location=2) in vec2 I;layout(location=3) in float K;uniform mat4 N,M,e,l;out vec2 o;out float n;out vec3 u;out mat4 h;out vec4 t;out vec3 s;void main(){vec4 v=vec4(L,1);gl_Position=N*v;o=I;n=K;u=H;h=M;t=e*v;s=(l*v).xyz;}`;

