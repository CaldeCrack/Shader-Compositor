#version 330 core

in vec2 TexCoord;

layout(location = 0) out vec4 FragColor;
layout(location = 1) out vec2 FragVelocity;

uniform sampler2D depthTexture;
uniform sampler2D velocityTexture;
uniform float time;

const vec2 cellCount = vec2(128.0);
const float slideSpeed = 12.0;

float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

bool isMoving(vec2 uv) {
    vec2 velocity = texture(velocityTexture, uv).xy;
    float depth = texture(depthTexture, uv).r;
    float speed = length(velocity);
    return speed != 0 && depth < 1.0;
}

void main() {
    vec2 cellUV = floor(TexCoord * cellCount);
    vec2 cellOrigin = cellUV / cellCount;
    vec2 cellSize = 1.0 / cellCount;

    bool cellIsMoving = true;
    for (int dx = 0; dx <= 1; ++dx) {
        for (int dy = 0; dy <= 1; ++dy) {
            vec2 offset = vec2(dx, dy) * 0.5;
            vec2 sampleUV = cellOrigin + offset * cellSize;
            if (!isMoving(sampleUV)) {
                cellIsMoving = false;
                break;
            }
        }
    }

    vec2 slideOffset = cellIsMoving ? vec2(time * slideSpeed, 0.0) : vec2(0.0);
    vec2 sampleCoord = TexCoord - slideOffset / cellCount;
    vec2 cell = floor(sampleCoord * cellCount);
    float noiseValue = hash(cell);

    FragColor = vec4(vec3(noiseValue), 1.0);
    FragVelocity = texture(velocityTexture, TexCoord).xy;
}
