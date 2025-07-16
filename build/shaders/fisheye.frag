#version 330 core

out vec4 FragColor;
in vec2 TexCoord;

uniform sampler2D ourTexture;

void main()
{
    vec2 uv = TexCoord * 2.0 - 1.0;
    float r = length(uv);
    if (r > 1.0)
        discard;
    float theta = atan(uv.y, uv.x);
    float nr = r * r;
    vec2 fish = nr * vec2(cos(theta), sin(theta));
    vec2 sampleUV = fish * 0.5 + 0.5;
    FragColor = texture(ourTexture, sampleUV);
}