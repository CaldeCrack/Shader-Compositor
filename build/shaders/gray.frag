#version 330 core

out vec4 FragColor;
in vec2 TexCoord;

uniform sampler2D ourTexture;
uniform float time;

void main()
{
	vec4 texColor = texture(ourTexture, TexCoord);
    float gray = 0.33 * (texColor.r + texColor.g + texColor.b);
    FragColor = vec4(gray, gray, gray, 1.0);
}
