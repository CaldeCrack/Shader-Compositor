#version 330 core

layout(location = 0) out vec4 FragColor;
layout(location = 1) out vec2 FragVelocity;

in vec2 TexCoord;

uniform sampler2D ourTexture;
uniform sampler2D velocityTexture;
uniform float time;

const float noiseStrength = 0.15;

float rand(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233)) + time * 60.0) * 43758.5453);
}

void main() {
    vec3 sceneColor = texture(ourTexture, TexCoord).rgb;

    float noise = rand(TexCoord * vec2(1920.0, 1080.0)); // scale for resolution
    vec3 noisyColor = mix(sceneColor, vec3(noise), noiseStrength);

    FragColor = vec4(noisyColor, 1.0);
    FragVelocity = texture(velocityTexture, TexCoord).xy;
}
