#version 330 core

out vec4 FragColor;
in vec2 TexCoord;

uniform sampler2D ourTexture;

void main()
{
    vec2 uv = TexCoord - 0.5;
    float dist = length(uv);
    float vignette = smoothstep(0.75, 0.35, dist);
    vec4 color = texture(ourTexture, TexCoord);
    FragColor = vec4(color.rgb * vignette, color.a);
}