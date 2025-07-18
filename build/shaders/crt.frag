#version 330 core

layout(location = 0) out vec4 FragColor;
layout(location = 1) out vec2 FragVelocity;

in vec2 TexCoord;

uniform sampler2D ourTexture;
uniform sampler2D velocityTexture;
uniform float time;

void main()
{
    vec2 uv = TexCoord;
    float scanline = sin(uv.y * 800.0 + time * 20.0) * 0.1;
    vec4 color = texture(ourTexture, uv);
    color.rgb -= scanline;
    color.rgb *= vec3(1.0, 0.95, 0.9);
    FragColor = color;
	FragVelocity = texture(velocityTexture, TexCoord).xy;
}