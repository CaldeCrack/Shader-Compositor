#version 330 core

out vec4 FragColor;
in vec2 TexCoord;

uniform sampler2D ourTexture;
uniform float time;

float rand(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main()
{
    float strength = 0.05;  // glitch strength

    float shift = rand(vec2(time, TexCoord.y)) * strength;

    vec2 redUV   = TexCoord + vec2( shift, 0.0);
    vec2 greenUV = TexCoord;
    vec2 blueUV  = TexCoord - vec2( shift, 0.0);

    vec4 r = texture(ourTexture, redUV);
    vec4 g = texture(ourTexture, greenUV);
    vec4 b = texture(ourTexture, blueUV);

    vec4 color = vec4(r.r, g.g, b.b, 1.0);

    float line = step(0.98, fract(TexCoord.y * 50.0 + time * 5.0));
    color.rgb *= 1.0 - 0.3 * line;

    FragColor = color;
}
