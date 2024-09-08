// Generated with Shader Minifier 1.3.4 (https://github.com/laurentlb/Shader_Minifier/)
export const aCoords = 'M';
export const aDepth = 'O';
export const aNormal = 'J';
export const aPosition = 'i';
export const aTexCoord = 'L';
export const emissive = 'A';
export const fragDepth = 'm';
export const fragPos = 'f';
export const lightPovMvp = 'e';
export const lightWorldPosition = 'v';
export const modelviewProjection = 'T';
export const normalMatrix = 'N';
export const outColor = 'g';
export const pointLightAttenuation = 'd';
export const positionFromLightPov = 't';
export const shadowCubeMap = 'D';
export const shadowMap = 'C';
export const spotlightDirection = 'G';
export const spotlightPosition = 'H';
export const textureRepeat = 'x';
export const uSampler = 'y';
export const vColor = 'h';
export const vDepth = 'n';
export const vNormal = 'u';
export const vNormalMatrix = 's';
export const vTexCoord = 'o';
export const worldMatrix = 'l';
export const worldPosition = 'z';

export const depth_fragment_glsl = `#version 300 es
precision highp float;
uniform vec3 v;in vec3 f;out float m;void main(){m=length(f-v)/40.;}`;

export const depth_vertex_glsl = `#version 300 es
precision highp float;
layout(location=0) in vec4 i;uniform mat4 e,l;out vec3 f;void main(){gl_Position=e*i;f=vec3(l*vec4(i.xyz,1));}`;

export const fragment_glsl = `#version 300 es
precision highp float;
in vec4 h;in vec2 o;in float n;in vec3 u;in mat4 s;in vec4 t;in vec3 z;uniform vec2 x;uniform vec4 A;uniform vec3 v,d;vec4 c=vec4(1);uniform mediump sampler2DArray y;uniform mediump sampler2DShadow C;uniform mediump samplerCube D;uniform vec3 H,G;vec4 F=vec4(1,1,.8,1);float E=1.,B=.85;vec4 I=vec4(.05,.05,.05,1);out vec4 g;float p(float v,float m,float f,float i){return 1./(v*v*m+v*f+i);}void main(){vec3 m=z-v,l=v-z;float f=length(m);vec3 i=normalize(m),e=normalize(l);float h=texture(D,i).x*40.,t=.015,A=0.;A=h+t<f?0.:1.;vec3 C=normalize(mat3(s)*u);float J=max(0.,dot(e,C)),K=p(f,d.x,d.y,d.z);vec4 L=c*J*K*A;vec3 M=H-z,N=normalize(M);float O=length(M),P=max(0.,dot(N,C)),Q=dot(G,-N),R=smoothstep(B,E,Q),S=p(O,.005,.001,.4);vec4 T=F*P*R*S,U=clamp(I+L+T,I,vec4(1));g=n<0.?U:texture(y,vec3(o*x,n))*U;}`;

export const vertex_glsl = `#version 300 es
layout(location=0) in vec3 M;layout(location=1) in vec3 J;layout(location=2) in vec2 L;layout(location=3) in float O;uniform mat4 T,N,e,l;out vec2 o;out float n;out vec3 u;out mat4 s;out vec4 t;out vec3 z;void main(){vec4 v=vec4(M,1);gl_Position=T*v;o=L;n=O;u=J;s=N;t=e*v;z=(l*v).xyz;}`;

