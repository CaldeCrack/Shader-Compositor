#version 330 core

layout(location = 0) out vec4 FragColor;
layout(location = 1) out vec2 FragVelocity;

in vec2 TexCoord;

uniform sampler2D ourTexture;
uniform sampler2D velocityTexture;

uniform float strength = 1.5;
uniform float centerSize = 0.0;

void main() {
    vec2 uv = TexCoord - 0.5;
    float dist = length(uv);

    if (dist > centerSize) {
        vec2 dir = normalize(uv);
        float convergence = pow(dist, 1.0/strength);
        uv = dir * convergence;
    }

    vec2 warpedUV = uv + 0.5;

    FragColor = texture(ourTexture, clamp(warpedUV, 0.0, 1.0));
    FragVelocity = texture(velocityTexture, TexCoord).xy;
}