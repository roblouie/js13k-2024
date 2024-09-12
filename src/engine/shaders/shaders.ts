// Generated with Shader Minifier 1.3.4 (https://github.com/laurentlb/Shader_Minifier/)
export const aCoords = 'L';
export const aDepth = 'H';
export const aNormal = 'B';
export const aPosition = 'i';
export const aTexCoord = 'F';
export const fragDepth = 'm';
export const fragPos = 'f';
export const lightPovMvp = 'e';
export const lightWorldPosition = 'v';
export const modelviewProjection = 'I';
export const normalMatrix = 'M';
export const outColor = 'g';
export const pointLightAttenuation = 'd';
export const positionFromLightPov = 'K';
export const shadowCubeMap = 'x';
export const spotlightDirection = 'y';
export const spotlightPosition = 'c';
export const uSampler = 'z';
export const vDepth = 'n';
export const vNormal = 'u';
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
in vec2 o;in float n;in vec3 u;in mat4 h;in vec3 t;uniform vec3 v,d;vec4 s=vec4(1);uniform mediump sampler2DArray z;uniform mediump samplerCube x;uniform vec3 c,y;vec4 A=vec4(1,1,.8,1);float C=1.,D=.85;vec4 G=vec4(.05,.05,.05,1);out vec4 g;float p(float v,float m,float f,float h){return 1./(v*v*m+v*f+h);}void main(){vec3 m=t-v,l=v-t;float f=length(m);vec3 e=normalize(m),i=normalize(l);float B=texture(x,e).x*40.,E=.015,F=0.;F=B+E<f?0.:1.;vec3 H=normalize(mat3(h)*u);float I=max(0.,dot(i,H)),J=p(f,d.x,d.y,d.z);vec4 K=s*I*J*F;vec3 L=c-t,M=normalize(L);float N=length(L),O=max(0.,dot(M,H)),P=dot(y,-M),Q=smoothstep(D,C,P),R=p(N,.005,.001,.4);vec4 S=A*O*Q*R,T=clamp(G+K+S,G,vec4(1));g=texture(z,vec3(o,n))*T;}`;

export const vertex_glsl = `#version 300 es
layout(location=0) in vec3 L;layout(location=1) in vec3 B;layout(location=2) in vec2 F;layout(location=3) in float H;uniform mat4 I,M,e,l;out vec2 o;out float n;out vec3 u;out mat4 h;out vec4 K;out vec3 t;void main(){vec4 v=vec4(L,1);gl_Position=I*v;o=F;n=H;u=B;h=M;K=e*v;t=(l*v).xyz;}`;

