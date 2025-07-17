#version 330 core

layout(location = 0) out vec4 FragColor;
layout(location = 1) out vec2 FragVelocity;

in vec2 TexCoord;

uniform sampler2D ourTexture;
uniform sampler2D velocityTexture;

void main() {
    vec4 color = texture(ourTexture, TexCoord);
    float intensity = length(color.rgb);
    float offset = intensity * 0.1;
    vec2 displacedUV = TexCoord + vec2(offset * 0.75, 0.0);

    FragColor = texture(ourTexture, displacedUV);
	FragVelocity = texture(velocityTexture, TexCoord).xy;
}
