// Generated with Shader Minifier 1.3.4 (https://github.com/laurentlb/Shader_Minifier/)
export const aCoords = 'K';
export const aDepth = 'N';
export const aNormal = 'M';
export const aPosition = 'i';
export const aTexCoord = 'L';
export const emissive = 'd';
export const fragDepth = 'm';
export const fragPos = 'f';
export const lightPovMvp = 'n';
export const lightWorldPosition = 'v';
export const modelviewProjection = 'O';
export const normalMatrix = 'P';
export const outColor = 'J';
export const positionFromLightPov = 't';
export const shadowCubeMap = 'D';
export const shadowMap = 'C';
export const textureRepeat = 'z';
export const uSampler = 'A';
export const vColor = 'e';
export const vDepth = 'u';
export const vNormal = 'h';
export const vNormalMatrix = 's';
export const vTexCoord = 'o';
export const worldMatrix = 'l';
export const worldPosition = 'g';

export const depth_fragment_glsl = `#version 300 es
precision highp float;
uniform vec3 v;in vec3 f;out float m;void main(){m=length(f-v)/40.;}`;

export const depth_vertex_glsl = `#version 300 es
precision highp float;
layout(location=0) in vec4 i;uniform mat4 n,l;out vec3 f;void main(){gl_Position=n*i;f=vec3(l*vec4(i.xyz,1));}`;

export const fragment_glsl = `#version 300 es
precision highp float;
in vec4 e;in vec2 o;in float u;in vec3 h;in mat4 s;in vec4 t;in vec3 g;uniform vec2 z;uniform vec4 d;uniform vec3 v;uniform mediump sampler2DArray A;uniform mediump sampler2DShadow C;uniform mediump samplerCube D;out vec4 J;vec3 I=vec3(-1,1.5,-1);float H=.2f,G=1.f;vec2 F[5]=vec2[](vec2(0),vec2(-1,0),vec2(1,0),vec2(0,1),vec2(0,-1));float E=1.,B=4200.;float x(float v,float m,float f,float h){return 1./(v*v*m+v*f+h);}void main(){vec3 m=g-v,l=v-g;float f=length(m);vec3 n=normalize(m),B=normalize(l);float i=texture(D,n).x*40.,G=0.;G=i+.015<f?.25:1.;vec3 e=normalize(mat3(s)*h),t=normalize(I);float C=max(dot(t,e)*E,H);vec3 F=length(d)>0.?d.xyz:C*vec3(1);float K=max(0.,dot(B,normalize(e))),L=x(f,.008,.01,.4);vec4 M=vec4(K*L*F.xyz*G,1);J=u<0.?M:texture(A,vec3(o*z,u))*M;}`;

export const vertex_glsl = `#version 300 es
layout(location=0) in vec3 K;layout(location=1) in vec3 M;layout(location=2) in vec2 L;layout(location=3) in float N;uniform mat4 O,P,n,l;out vec2 o;out float u;out vec3 h;out mat4 s;out vec4 t;out vec3 g;void main(){vec4 v=vec4(K,1);gl_Position=O*v;o=L;u=N;h=M;s=P;t=n*v;g=(l*v).xyz;}`;

