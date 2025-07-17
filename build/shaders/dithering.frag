#version 330 core

layout(location = 0) out vec4 FragColor;
layout(location = 1) out vec2 FragVelocity;

in vec2 TexCoord;

uniform sampler2D ourTexture;
uniform sampler2D velocityTexture;
uniform float time;

float bayer4x4[16] = float[](
    0.0/16.0,  8.0/16.0,  2.0/16.0, 10.0/16.0,
   12.0/16.0,  4.0/16.0, 14.0/16.0,  6.0/16.0,
    3.0/16.0, 11.0/16.0,  1.0/16.0,  9.0/16.0,
   15.0/16.0,  7.0/16.0, 13.0/16.0,  5.0/16.0
);

float getBayerThreshold(ivec2 pos) {
    int x = pos.x % 4;
    int y = pos.y % 4;
    int index = y * 4 + x;
    return bayer4x4[index];
}

void main() {
    vec2 texSize = vec2(textureSize(ourTexture, 0));
    ivec2 pixelCoord = ivec2(TexCoord * texSize);

    float threshold = getBayerThreshold(pixelCoord);
    vec4 color = texture(ourTexture, TexCoord);

    // Per-channel dithering: slightly offsets each channel's threshold
    vec3 dithered;
    dithered.r = color.r > threshold ? 1.0 : 0.0;
    dithered.g = color.g > threshold ? 1.0 : 0.0;
    dithered.b = color.b > threshold ? 1.0 : 0.0;

    FragColor = vec4(dithered, 1.0);
    FragVelocity = texture(velocityTexture, TexCoord).xy;
}
