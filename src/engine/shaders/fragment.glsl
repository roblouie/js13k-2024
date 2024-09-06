#version 300 es

//[
precision highp float;
//]
in vec4 vColor;
in vec2 vTexCoord;
in float vDepth;
in vec3 vNormal;
in mat4 vNormalMatrix;
in vec4 positionFromLightPov;
in vec3 worldPosition;

uniform vec2 textureRepeat;
uniform vec4 emissive;
uniform vec3 lightWorldPosition;
uniform mediump sampler2DArray uSampler;
uniform mediump sampler2DShadow shadowMap;
uniform mediump samplerCube shadowCubeMap;

out vec4 outColor;

vec3 light_direction = vec3(-1, 1.5, -1);

float ambientLight = 0.2f;
float maxLit = 1.0f;

vec2 adjacentPixels[5] = vec2[](
  vec2(0, 0),
  vec2(-1, 0),
  vec2(1, 0),
  vec2(0, 1),
  vec2(0, -1)
);

float visibility = 1.0;
float shadowSpread = 4200.0;

float quadraticLinearConstant(float distance, float a, float b, float c) {
    return 1.0 / (distance * distance * a +distance * b + c);
}

void main() {
//    for (int i = 0; i < 5; i++) {
//        vec3 samplePosition = vec3(positionFromLightPov.xy + adjacentPixels[i]/shadowSpread, positionFromLightPov.z - 0.001);
//        float hitByLight = texture(shadowMap, samplePosition);
//        visibility *= max(hitByLight, 0.87);
//    }

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

    vec3 litColor = length(emissive) > 0.0 ? emissive.rgb : vec3(1.0, 1.0, 1.0);

    float diffuse = max(0.0, dot(direction2, normalize(correctedNormal)));
    float attenuation = quadraticLinearConstant(distance, 0.008, 0.01, 0.4);
    float brightness = diffuse * attenuation;

    vec4 vColor = vec4(litColor.rgb  * clamp(brightness * ShadowFactor, 0.05, 1.0), 1.0);

    // TODO: Probably remove this check if all my surfaces have textures, which i beleive they will?
    if (vDepth < 0.0) {
        outColor = vColor;
    } else {
        outColor = texture(uSampler, vec3(vTexCoord * textureRepeat, vDepth)) * vColor;
    }
}
