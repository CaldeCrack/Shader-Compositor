#version 330 core

layout(location = 0) out vec4 FragColor;
layout(location = 1) out vec2 FragVelocity;

in vec2 TexCoord;

uniform sampler2D ourTexture;
uniform sampler2D velocityTexture;
uniform float time;

void main()
{
    vec4 texColor = texture(ourTexture, TexCoord);
    vec3 inverted = vec3(1.0) - texColor.rgb;
    FragColor = vec4(inverted, texColor.a);
	FragVelocity = texture(velocityTexture, TexCoord).xy;
}
