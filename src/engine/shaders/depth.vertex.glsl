#version 300 es

//[
precision highp float;
//]

layout(location=0) in vec4 aPosition;

uniform mat4 lightPovMvp;
uniform mat4 worldMatrix;

out vec3 fragPos;

void main(){
    gl_Position = lightPovMvp * aPosition;
    fragPos = vec3(worldMatrix * vec4(aPosition.xyz, 1.0));
}
