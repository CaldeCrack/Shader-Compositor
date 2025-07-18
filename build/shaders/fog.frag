#version 330 core

layout(location = 0) out vec4 FragColor;
layout(location = 1) out vec2 FragVelocity;

in vec2 TexCoord;

uniform sampler2D ourTexture;
uniform sampler2D depthTexture;
uniform sampler2D velocityTexture;
uniform float time;

const float near = 0.1;
const float far = 1000.0;

uniform vec3 fogColor = vec3(0.4, 0.6, 0.8);  // light bluish fog
uniform float fogDensity = 0.3; // higher = foggier, experiment with 0.5–2.0

// Convert [0,1] depth buffer value to linear depth (world space)
float linearizeDepth(float depth) {
    float z = depth * 2.0 - 1.0; // NDC
    return (2.0 * near * far) / (far + near - z * (far - near));
}

void main() {
    vec4 baseColor = texture(ourTexture, TexCoord);

    float depth = texture(depthTexture, TexCoord).r;
    float linearDepth = linearizeDepth(depth);

    // Compute fog factor using exponential density
    float fogFactor = 1.0 - exp(-pow(linearDepth * fogDensity, 2.0));
    fogFactor = clamp(fogFactor, 0.0, 1.0);

    // Blend original color with fog
    vec3 finalColor = mix(baseColor.rgb, fogColor, fogFactor);

    FragColor = vec4(finalColor, baseColor.a);
    FragVelocity = texture(velocityTexture, TexCoord).xy;
}
