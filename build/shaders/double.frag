#version 330 core

layout(location = 0) out vec4 FragColor;
layout(location = 1) out vec2 FragVelocity;

in vec2 TexCoord;

uniform sampler2D ourTexture;
uniform sampler2D velocityTexture;

uniform float offset = 0.02;
uniform float transparency = 0.5;

void main() {
    vec4 originalColor = texture(ourTexture, TexCoord);
    vec2 offsetUV = TexCoord;
    offsetUV.x += offset;
    vec4 secondColor = texture(ourTexture, offsetUV);

    FragColor = mix(originalColor, secondColor, transparency);
    FragVelocity = texture(velocityTexture, TexCoord).xy;
}