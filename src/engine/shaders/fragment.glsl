#version 300 es

//[
precision highp float;
//]
in vec2 vTexCoord;
in float vDepth;
in vec3 vNormal;
in mat4 vNormalMatrix;
in vec3 worldPosition;

uniform vec3 lightWorldPosition;
uniform vec3 pointLightAttenuation;
vec4 pointLightColor = vec4(1.0, 1.0, 1.0, 1.0);
uniform mediump sampler2DArray uSampler;
uniform mediump samplerCube shadowCubeMap;

uniform vec3 spotlightPosition;
uniform vec3 spotlightDirection;
vec4 spotlightColor = vec4(1.0, 1.0, 0.8, 1.0);
float lightInnerCutoff = 1.0;
float lightOuterCutoff = 0.85;

vec4 ambientLight = vec4(0.05, 0.05, 0.05, 1.0);

out vec4 outColor;

float quadraticLinearConstant(float distance, float a, float b, float c) {
    return 1.0 / (distance * distance * a +distance * b + c);
}

void main() {
    vec3 lightWorldDir = worldPosition - lightWorldPosition;
    vec3 offset = lightWorldPosition - worldPosition;
    float distance = length(lightWorldDir);
    vec3 direction = normalize(lightWorldDir);
    vec3 direction2 = normalize(offset);

    float SampledDistance = texture(shadowCubeMap, direction).r * 40.0;

    float bias = 0.015;
    float ShadowFactor = 0.0;

    if (SampledDistance + bias < distance)
        ShadowFactor = 0.0;
    else
        ShadowFactor = 1.0;

    vec3 correctedNormal = normalize(mat3(vNormalMatrix) * vNormal);

    float diffuse = max(0.0, dot(direction2, correctedNormal));
    float attenuation = quadraticLinearConstant(distance, pointLightAttenuation.x, pointLightAttenuation.y, pointLightAttenuation.z);
    vec4 pointLightBrightness = pointLightColor * diffuse * attenuation * ShadowFactor;

    // Spotlight
    vec3 spotlightOffset = spotlightPosition - worldPosition;
    vec3 spotlightSurfaceToLight = normalize(spotlightOffset);
    float spotlightDistance = length(spotlightOffset);
    float spotlightDiffuse = max(0.0, dot(spotlightSurfaceToLight, correctedNormal));
    float angleToSurface = dot(spotlightDirection, -spotlightSurfaceToLight);
    float spot = smoothstep(lightOuterCutoff, lightInnerCutoff, angleToSurface);
    float spotlightAttenuation = quadraticLinearConstant(spotlightDistance, 0.005, 0.001, 0.4);
    vec4 spotlight = spotlightColor * spotlightDiffuse * spot * spotlightAttenuation;

    vec4 vColor = clamp(ambientLight + pointLightBrightness + spotlight, ambientLight, vec4(1.0, 1.0, 1.0, 1.0));

    outColor = texture(uSampler, vec3(vTexCoord, vDepth)) * vColor;
}
