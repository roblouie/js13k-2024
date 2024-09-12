#version 300 es

//[
precision highp float;
//]

uniform vec3 lightWorldPosition;

in vec3 fragPos;

out float fragDepth;

void main(){
    fragDepth = length(fragPos - lightWorldPosition) / 40.0;
}
