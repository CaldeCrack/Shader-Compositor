#version 330 core

out vec4 FragColor;
in vec2 TexCoord;

uniform sampler2D ourTexture;
uniform vec2 resolution;

float threshold = 0.7;
float blurRadius = 6.0;

void main()
{
    vec2 texelSize = 1.0 / resolution;
    vec4 original = texture(ourTexture, TexCoord);

    // Extract bright areas
    vec4 bright = vec4(0.0);
    vec4 colorSample;
    for (int x = -int(blurRadius); x <= int(blurRadius); ++x)
    {
        for (int y = -int(blurRadius); y <= int(blurRadius); ++y)
        {
            vec2 offset = vec2(x, y) * texelSize;
            colorSample = texture(ourTexture, TexCoord + offset);
            float brightness = dot(colorSample.rgb, vec3(0.2126, 0.7152, 0.0722));
            if (brightness > threshold)
                bright += colorSample;
        }
    }

    // Average the blurred bright parts
    int kernelSize = int((2.0 * blurRadius + 1.0) * (2.0 * blurRadius + 1.0));
    bright /= float(kernelSize);

    // Blend bloom with original
    vec4 bloomColor = bright;
    FragColor = original + bloomColor;
}
