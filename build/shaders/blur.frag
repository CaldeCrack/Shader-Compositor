#version 330 core

out vec4 FragColor;
in vec2 TexCoord;

uniform sampler2D ourTexture;
uniform vec2 resolution;

void main()
{
    float blurRadius = 3.0;
    vec2 texelSize = 1.0 / resolution;

    vec4 color = vec4(0.0);
    int count = 0;

    for (int x = -int(blurRadius); x <= int(blurRadius); ++x)
    {
        for (int y = -int(blurRadius); y <= int(blurRadius); ++y)
        {
            vec2 offset = vec2(float(x), float(y)) * texelSize;
            color += texture(ourTexture, TexCoord + offset);
            count++;
        }
    }

    FragColor = color / float(count);
}
