#version 330 core

out vec4 FragColor;
in vec2 TexCoord;

uniform sampler2D ourTexture;
uniform float time;

void main()
{
    vec4 texColor = texture(ourTexture, TexCoord);
    vec3 inverted = vec3(1.0) - texColor.rgb;
    FragColor = vec4(inverted, texColor.a);
}
