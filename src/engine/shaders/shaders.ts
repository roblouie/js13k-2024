// Generated with Shader Minifier 1.3.4 (https://github.com/laurentlb/Shader_Minifier/)
export const aCoords = 'G';
export const aDepth = 'N';
export const aNormal = 'L';
export const aPosition = 'i';
export const aTexCoord = 'M';
export const emissive = 'A';
export const fragDepth = 'm';
export const fragPos = 'f';
export const lightPovMvp = 'e';
export const lightWorldPosition = 'v';
export const modelviewProjection = 'x';
export const normalMatrix = 'O';
export const outColor = 'J';
export const positionFromLightPov = 't';
export const shadowCubeMap = 'K';
export const shadowMap = 'D';
export const textureRepeat = 'z';
export const uSampler = 'C';
export const vColor = 'h';
export const vDepth = 'n';
export const vNormal = 'u';
export const vNormalMatrix = 's';
export const vTexCoord = 'o';
export const worldMatrix = 'l';
export const worldPosition = 'g';

export const depth_fragment_glsl = `#version 300 es
precision highp float;
uniform vec3 v;in vec3 f;out float m;void main(){m=length(f-v)/40.;}`;

export const depth_vertex_glsl = `#version 300 es
precision highp float;
layout(location=0) in vec4 i;uniform mat4 e,l;out vec3 f;void main(){gl_Position=e*i;f=vec3(l*vec4(i.xyz,1));}`;

export const fragment_glsl = `#version 300 es
precision highp float;
in vec4 h;in vec2 o;in float n;in vec3 u;in mat4 s;in vec4 t;in vec3 g;uniform vec2 z;uniform vec4 A;uniform vec3 v;uniform mediump sampler2DArray C;uniform mediump sampler2DShadow D;uniform mediump samplerCube K;out vec4 J;vec3 I=vec3(-1,1.5,-1);float H=.2f,d=1.f;vec2 F[5]=vec2[](vec2(0),vec2(-1,0),vec2(1,0),vec2(0,1),vec2(0,-1));float E=1.,B=4200.;float p(float v,float m,float f,float i){return 1./(v*v*m+v*f+i);}void main(){vec3 m=g-v,l=v-g;float f=length(m);vec3 i=normalize(m),d=normalize(l);float e=texture(K,i).x*40.,B=0.;B=e+.015<f?0.:1.;vec3 h=normalize(mat3(s)*u),E=length(A)>0.?A.xyz:vec3(1);float t=max(0.,dot(d,normalize(h))),H=p(f,.008,.01,.4);vec4 D=vec4(E.xyz*clamp(t*H*B,.05,1.),1);J=n<0.?D:texture(C,vec3(o*z,n))*D;}`;

export const vertex_glsl = `#version 300 es
layout(location=0) in vec3 G;layout(location=1) in vec3 L;layout(location=2) in vec2 M;layout(location=3) in float N;uniform mat4 x,O,e,l;out vec2 o;out float n;out vec3 u;out mat4 s;out vec4 t;out vec3 g;void main(){vec4 v=vec4(G,1);gl_Position=x*v;o=M;n=N;u=L;s=O;t=e*v;g=(l*v).xyz;}`;

