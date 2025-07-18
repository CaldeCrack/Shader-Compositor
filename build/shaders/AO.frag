#version 330 core

layout(location = 0) out vec4 FragColor;
layout(location = 1) out vec2 FragVelocity;

in vec2 TexCoord;

uniform sampler2D ourTexture;
uniform sampler2D depthTexture;
uniform sampler2D velocityTexture;
uniform vec2 resolution;

const float radius = 2.0;
const float bias = 0.05;

float LinearizeDepth(float d) {
    float near = 0.1;
    float far = 1000.0;
    float z = d * 2.0 - 1.0;
    return (2.0 * near * far) / (far + near - z * (far - near));
}

void main() {
    vec2 texelSize = 1.0 / resolution;
    float centerDepth = LinearizeDepth(texture(depthTexture, TexCoord).r);

    float occlusion = 0.0;
    int samples = 0;

    for (int x = -2; x <= 2; ++x) {
        for (int y = -2; y <= 2; ++y) {
            vec2 offset = vec2(x, y) * texelSize * radius;
            float sampleDepth = LinearizeDepth(texture(depthTexture, TexCoord + offset).r);

            float rangeCheck = smoothstep(0.0, 1.0, radius / abs(centerDepth - sampleDepth + bias));
            if (sampleDepth >= centerDepth + bias) {
                occlusion += rangeCheck;
            }
            samples++;
        }
    }

    occlusion = 1.0 - (occlusion / float(samples));
    occlusion = clamp(occlusion, 0.0, 1.0);

    vec3 baseColor = texture(ourTexture, TexCoord).rgb;
    vec3 shaded = baseColor * occlusion;

    FragColor = vec4(shaded, 1.0);
	FragVelocity = texture(velocityTexture, TexCoord).xy;
}
