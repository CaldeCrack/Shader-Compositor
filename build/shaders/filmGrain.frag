#version 330 core

layout(location = 0) out vec4 FragColor;
layout(location = 1) out vec2 FragVelocity;

in vec2 TexCoord;

uniform sampler2D ourTexture;
uniform sampler2D velocityTexture;
uniform vec2 resolution;
uniform float time;

float rand(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
    vec4 color = texture(ourTexture, TexCoord);

    // Grain: random noise based on position and time
    float grainAmount = 0.05;
    float noise = rand(TexCoord * resolution + time);
    noise = noise * 2.0 - 1.0;

    color.rgb += noise * grainAmount;
    FragColor = vec4(clamp(color.rgb, 0.0, 1.0), color.a);
	FragVelocity = texture(velocityTexture, TexCoord).xy;
}
