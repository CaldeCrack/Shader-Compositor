#version 330 core

layout(location = 0) out vec4 FragColor;
layout(location = 1) out vec2 FragVelocity;

in vec2 TexCoord;

uniform sampler2D ourTexture;
uniform sampler2D velocityTexture;

uniform int colorSteps = 4;

vec3 posterize(vec3 color, int steps) {
    return floor(color * steps) / float(steps);
}

void main()
{
    vec3 color = texture(ourTexture, TexCoord).rgb;
    vec3 toonColor = posterize(color, colorSteps);

    FragColor = vec4(toonColor, 1.0);
    FragVelocity = texture(velocityTexture, TexCoord).xy;
}
