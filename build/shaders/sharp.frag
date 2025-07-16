#version 330 core

out vec4 FragColor;
in vec2 TexCoord;

uniform sampler2D ourTexture;
uniform vec2 resolution;

void main()
{
    vec2 texelSize = 1.0 / resolution;

    // 3x3 kernel offsets
    vec2 offsets[9] = vec2[](
        vec2(-1,  1), vec2(0,  1), vec2(1,  1),
        vec2(-1,  0), vec2(0,  0), vec2(1,  0),
        vec2(-1, -1), vec2(0, -1), vec2(1, -1)
    );

    // Sharpen kernel
    float kernel[9] = float[](
         0, -1,  0,
        -1,  5, -1,
         0, -1,  0
    );

    vec4 color = vec4(0.0);
    for (int i = 0; i < 9; ++i) {
        vec2 offset = offsets[i] * texelSize;
        vec4 sample = texture(ourTexture, TexCoord + offset);
        color += sample * kernel[i];
    }

    FragColor = color;
}
