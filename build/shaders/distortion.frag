#version 330 core

layout(location = 0) out vec4 FragColor;
layout(location = 1) out vec2 FragVelocity;

in vec2 TexCoord;

uniform sampler2D ourTexture;
uniform sampler2D velocityTexture;
uniform vec2 resolution;
uniform float time;

// Simple 2D sine wave based "noise" function
float waveNoise(vec2 uv, float time) {
    float w1 = sin(uv.x * 10.0 + time);
    float w2 = cos(uv.y * 12.0 - time * 1.3);
    float w3 = sin((uv.x + uv.y) * 15.0 + time * 0.7);
    return (w1 + w2 + w3) / 3.0;
}

void main() {
    // Normalize coords 0..1
    vec2 uv = TexCoord;

    // Calculate distortion amount based on waveNoise
    float distortionX = waveNoise(uv * 3.0, time) * 0.03;
    float distortionY = waveNoise(uv * 3.0 + 100.0, time) * 0.03;

    vec2 distortedUV = uv + vec2(distortionX, distortionY);

    vec4 color = texture(ourTexture, distortedUV);

    FragColor = color;
    FragVelocity = texture(velocityTexture, uv).xy;
}
