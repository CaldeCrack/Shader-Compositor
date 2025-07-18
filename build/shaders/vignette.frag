#version 330 core

layout(location = 0) out vec4 FragColor;
layout(location = 1) out vec2 FragVelocity;

in vec2 TexCoord;

uniform sampler2D ourTexture;
uniform sampler2D velocityTexture;

void main()
{
    vec2 uv = TexCoord - 0.5;
    float dist = length(uv);
    float vignette = smoothstep(0.75, 0.35, dist);
    vec4 color = texture(ourTexture, TexCoord);
    FragColor = vec4(color.rgb * vignette, color.a);
	FragVelocity = texture(velocityTexture, TexCoord).xy;
}