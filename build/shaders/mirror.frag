#version 330 core

layout(location = 0) out vec4 FragColor;
layout(location = 1) out vec2 FragVelocity;

in vec2 TexCoord;

uniform sampler2D ourTexture;
uniform sampler2D velocityTexture;
uniform vec2 resolution;

const float mirrorLine = 0.5;
const float blendWidth = 0.02;

void main() {
    float distFromMirror = abs(TexCoord.y - mirrorLine);
    vec4 color = texture(ourTexture, TexCoord);
    if (TexCoord.y > mirrorLine) {
        vec2 mirroredUV = vec2(TexCoord.x, 2.0 * mirrorLine - TexCoord.y);
        color = texture(ourTexture, mirroredUV);
    }

    if (distFromMirror < blendWidth) {
        vec2 mirroredUV = vec2(TexCoord.x, 2.0 * mirrorLine - TexCoord.y);
        vec4 mirrorColor = texture(ourTexture, mirroredUV);
        float blendFactor = smoothstep(0.0, blendWidth, distFromMirror);
        color = mix(mirrorColor, color, blendFactor);
    }

    FragColor = color;
    FragVelocity = texture(velocityTexture, TexCoord).xy;
}