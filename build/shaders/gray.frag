#version 330 core

layout(location = 0) out vec4 FragColor;
layout(location = 1) out vec2 FragVelocity;

in vec2 TexCoord;

uniform sampler2D ourTexture;
uniform sampler2D velocityTexture;

void main() {
	vec4 texColor = texture(ourTexture, TexCoord);
    float gray = 0.33 * (texColor.r + texColor.g + texColor.b);
    FragColor = vec4(gray, gray, gray, 1.0);
	FragVelocity = texture(velocityTexture, TexCoord).xy;
}
