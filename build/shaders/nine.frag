#version 330 core

layout(location = 0) out vec4 FragColor;
layout(location = 1) out vec2 FragVelocity;

in vec2 TexCoord;

uniform sampler2D ourTexture;
uniform sampler2D velocityTexture;

uniform float zoom = 1.0;
uniform vec2 panOffset = vec2(0.0);

void main() {
    vec2 gridCell = floor(TexCoord * 3.0);
    vec2 screenUV = fract(TexCoord * 3.0);
    screenUV = (screenUV - 0.5) / zoom + 0.5 + panOffset;

    FragColor = texture(ourTexture, clamp(screenUV, 0.0, 1.0));
    FragVelocity = texture(velocityTexture, TexCoord).xy;
}