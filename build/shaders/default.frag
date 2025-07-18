// default.frag
#version 330 core

in vec2 TexCoord;
in vec2 CurrNDC;
in vec2 PrevNDC;

layout(location = 0) out vec4 FragColor;
layout(location = 1) out vec2 Velocity;

uniform sampler2D ourTexture;

void main() {
    vec4 texColor = texture(ourTexture, TexCoord);
    if (texColor.a < 0.1)
        discard;

    FragColor = texColor;
    Velocity = CurrNDC - PrevNDC;
}
