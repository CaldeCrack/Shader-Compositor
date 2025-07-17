#version 330 core

layout(location = 0) out vec4 FragColor;
layout(location = 1) out vec2 FragVelocity;

in vec2 TexCoord;

uniform sampler2D ourTexture;
uniform sampler2D velocityTexture;
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
	FragVelocity = texture(velocityTexture, TexCoord).xy;
}
