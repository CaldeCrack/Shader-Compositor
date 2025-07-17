#version 330 core

layout(location = 0) out vec4 FragColor;
layout(location = 1) out vec2 FragVelocity;

in vec2 TexCoord;

uniform sampler2D ourTexture;
uniform sampler2D velocityTexture;
uniform vec2 resolution;
uniform float time;

const float pixelSize = 6.0;

void main() {
    vec2 uv = TexCoord;
    vec2 normalizedPixelSize = pixelSize / resolution;

    vec2 uvPixel = normalizedPixelSize * floor(uv / normalizedPixelSize);
    vec4 color = texture(ourTexture, uvPixel);
    float luma = dot(color.rgb, vec3(0.2126, 0.7152, 0.0722));
    vec2 cellUV = fract(uv / normalizedPixelSize);

    float radius = luma > 0.5 ? 0.3 : luma > 0.001 ? 0.12 : 0.075;
    vec2 circleCenter = luma > 0.5 ? vec2(0.5) : vec2(0.25);
    float dist = distance(cellUV, circleCenter);
    float circleMask = smoothstep(radius, radius - 0.05, dist);
    vec3 maskedColor = color.rgb * circleMask;

    FragColor = vec4(maskedColor, 1.0);
	FragVelocity = texture(velocityTexture, TexCoord).xy;
}
