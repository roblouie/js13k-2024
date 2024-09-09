// Generated with Shader Minifier 1.3.4 (https://github.com/laurentlb/Shader_Minifier/)
export const aCoords = 'M';
export const aDepth = 'L';
export const aNormal = 'I';
export const aPosition = 'i';
export const aTexCoord = 'J';
export const emissive = 'A';
export const fragDepth = 'm';
export const fragPos = 'f';
export const lightPovMvp = 'e';
export const lightWorldPosition = 'v';
export const modelviewProjection = 'O';
export const normalMatrix = 'N';
export const outColor = 'g';
export const pointLightAttenuation = 'd';
export const positionFromLightPov = 's';
export const shadowCubeMap = 'y';
export const shadowMap = 'C';
export const spotlightDirection = 'H';
export const spotlightPosition = 'D';
export const textureRepeat = 'z';
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
in vec2 o;in float u;in vec3 n;in mat4 h;in vec4 s;in vec3 t;uniform vec2 z;uniform vec4 A;uniform vec3 v,d;vec4 c=vec4(1);uniform mediump sampler2DArray x;uniform mediump sampler2DShadow C;uniform mediump samplerCube y;uniform vec3 D,H;vec4 G=vec4(1,1,.8,1);float F=1.,E=.85;vec4 B=vec4(.05,.05,.05,1);out vec4 g;float p(float v,float m,float f,float h){return 1./(v*v*m+v*f+h);}void main(){vec3 m=t-v,l=v-t;float f=length(m);vec3 e=normalize(m),i=normalize(l);float s=texture(y,e).x*40.,A=.015,C=0.;C=s+A<f?0.:1.;vec3 I=normalize(mat3(h)*n);float J=max(0.,dot(i,I)),K=p(f,d.x,d.y,d.z);vec4 L=c*J*K*C;vec3 M=D-t,N=normalize(M);float O=length(M),P=max(0.,dot(N,I)),Q=dot(H,-N),R=smoothstep(E,F,Q),S=p(O,.005,.001,.4);vec4 T=G*P*R*S,U=clamp(B+L+T,B,vec4(1));g=texture(x,vec3(o*z,u))*U;}`;

export const vertex_glsl = `#version 300 es
layout(location=0) in vec3 M;layout(location=1) in vec3 I;layout(location=2) in vec2 J;layout(location=3) in float L;uniform mat4 O,N,e,l;out vec2 o;out float u;out vec3 n;out mat4 h;out vec4 s;out vec3 t;void main(){vec4 v=vec4(M,1);gl_Position=O*v;o=J;u=L;n=I;h=N;s=e*v;t=(l*v).xyz;}`;

