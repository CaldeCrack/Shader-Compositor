#version 330 core

layout(location = 0) out vec4 FragColor;
layout(location = 1) out vec2 FragVelocity;

in vec2 TexCoord;

uniform sampler2D ourTexture;
uniform sampler2D depthTexture;
uniform sampler2D velocityTexture;

uniform vec2 resolution;

const float focusDepth = 0.4;
const float maxBlur = 3.0;
const float focalRange = 2.0;

float LinearizeDepth(float depth) {
    float zNear = 0.1;
    float zFar  = 1000.0;
    float z = depth * 2.0 - 1.0;
    return (2.0 * zNear * zFar) / (zFar + zNear - z * (zFar - zNear));
}

void main() {
    float rawDepth = texture(depthTexture, TexCoord).r;
    float depth = LinearizeDepth(rawDepth);

    float blurFactor = clamp(abs(depth - focusDepth) / focalRange, 0.0, 1.0);
    float blurSize = blurFactor * maxBlur;

    vec3 color = vec3(0.0);
    float total = 0.0;
    vec2 texelSize = 1.0 / resolution;

    // Simple 5x5 box blur using blurSize
    for (int x = -2; x <= 2; ++x) {
        for (int y = -2; y <= 2; ++y) {
            vec2 offset = vec2(x, y) * texelSize * blurSize;
            color += texture(ourTexture, TexCoord + offset).rgb;
            total += 1.0;
        }
    }

    FragColor = vec4(color / total, 1.0);
	FragVelocity = texture(velocityTexture, TexCoord).xy;
}
