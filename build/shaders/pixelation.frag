#version 330 core

layout(location = 0) out vec4 FragColor;
layout(location = 1) out vec2 FragVelocity;

in vec2 TexCoord;

uniform sampler2D ourTexture;
uniform sampler2D velocityTexture;
uniform vec2 resolution;

void main()
{
    float pixelSize = 5.0;
    vec2 uv = TexCoord * resolution;
    uv = floor(uv / pixelSize) * pixelSize;
    uv = uv / resolution;
    FragColor = texture(ourTexture, uv);
	FragVelocity = texture(velocityTexture, TexCoord).xy;
}