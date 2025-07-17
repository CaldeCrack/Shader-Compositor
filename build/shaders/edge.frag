#version 330 core

layout(location = 0) out vec4 FragColor;
layout(location = 1) out vec2 FragVelocity;

in vec2 TexCoord;

uniform sampler2D ourTexture;
uniform sampler2D velocityTexture;
uniform vec2 resolution;

uniform float edgeThreshold = 0.4;
uniform vec3 edgeColor = vec3(1.0);
uniform float backgroundOpacity = 0.6;

void main() {
    vec2 pixelSize = 1.0 / resolution;

    float topLeft = length(texture(ourTexture, TexCoord + vec2(-pixelSize.x, pixelSize.y)).rgb);
    float top = length(texture(ourTexture, TexCoord + vec2(0.0, pixelSize.y)).rgb);
    float topRight = length(texture(ourTexture, TexCoord + vec2(pixelSize.x, pixelSize.y)).rgb);
    float left = length(texture(ourTexture, TexCoord + vec2(-pixelSize.x, 0.0)).rgb);
    float right = length(texture(ourTexture, TexCoord + vec2(pixelSize.x, 0.0)).rgb);
    float bottomLeft = length(texture(ourTexture, TexCoord + vec2(-pixelSize.x, -pixelSize.y)).rgb);
    float bottom = length(texture(ourTexture, TexCoord + vec2(0.0, -pixelSize.y)).rgb);
    float bottomRight = length(texture(ourTexture, TexCoord + vec2(pixelSize.x, -pixelSize.y)).rgb);

    float gx = topRight + 2.0 * right + bottomRight - topLeft - 2.0 * left - bottomLeft;
    float gy = topLeft + 2.0 * top + topRight - bottomLeft - 2.0 * bottom - bottomRight;
    float edgeValue = sqrt(gx * gx + gy * gy);
    edgeValue = smoothstep(edgeThreshold, edgeThreshold + 0.1, edgeValue);

    vec4 originalColor = texture(ourTexture, TexCoord);
    vec4 edgeColor = vec4(edgeColor * edgeValue, 1.0);

    FragColor = mix(originalColor, edgeColor, edgeValue * (1.0 - backgroundOpacity));
    FragVelocity = texture(velocityTexture, TexCoord).xy;
}
