#version 330 core

layout(location = 0) out vec4 FragColor;
layout(location = 1) out vec2 FragVelocity;

in vec2 TexCoord;

uniform sampler2D ourTexture;
uniform sampler2D velocityTexture;
uniform float time;

const float amplitude = 0.02;
const float frequency = 10.0;
const float speed = 2.0;

void main() {
    // Sinusoidal UV displacement
    float wave = sin(TexCoord.y * frequency + time * speed) * amplitude;

    // Create slight RGB separation with phase offsets for a colorful wave
    vec2 redUV   = TexCoord + vec2(wave, 0.0);
    vec2 greenUV = TexCoord + vec2(wave, 0.0);
    vec2 blueUV  = TexCoord + vec2(wave, 0.0);

    vec4 r = texture(ourTexture, redUV);
    vec4 g = texture(ourTexture, greenUV);
    vec4 b = texture(ourTexture, blueUV);
    vec4 color = vec4(r.r, g.g, b.b, 1.0);

    FragColor = color;
    FragVelocity = texture(velocityTexture, TexCoord).xy;
}
