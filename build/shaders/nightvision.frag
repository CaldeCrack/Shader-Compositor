#version 330 core

layout(location = 0) out vec4 FragColor;
layout(location = 1) out vec2 FragVelocity;

in vec2 TexCoord;

uniform sampler2D ourTexture;
uniform sampler2D velocityTexture;
uniform float time;

void main()
{
    vec4 color = texture(ourTexture, TexCoord);
    float brightness = dot(color.rgb, vec3(0.3, 0.59, 0.11));
    float noise = fract(sin(dot(TexCoord * time, vec2(12.9898, 78.233))) * 43758.5453);
    vec3 green = vec3(0.1, 1.0, 0.1);
    FragColor = vec4(green * (brightness + 0.1 * noise), 1.0);
	FragVelocity = texture(velocityTexture, TexCoord).xy;
}