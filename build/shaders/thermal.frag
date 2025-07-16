#version 330 core

out vec4 FragColor;
in vec2 TexCoord;

uniform sampler2D ourTexture;

vec3 thermalPalette(float t) {
    vec3 c;
    if (t < 0.25)
        c = mix(vec3(0.0, 0.0, 0.5), vec3(0.0, 0.0, 1.0), t / 0.25);
    else if (t < 0.5)
        c = mix(vec3(0.0, 0.0, 1.0), vec3(0.0, 1.0, 1.0), (t - 0.25) / 0.25);
    else if (t < 0.75)
        c = mix(vec3(0.0, 1.0, 0.0), vec3(1.0, 1.0, 0.0), (t - 0.5) / 0.25);
    else
        c = mix(vec3(1.0, 1.0, 0.0), vec3(1.0, 0.0, 0.0), (t - 0.75) / 0.25);
    return c;
}

void main()
{
    vec4 texColor = texture(ourTexture, TexCoord);
    float luminance = dot(texColor.rgb, vec3(0.2126, 0.7152, 0.0722));
    vec3 color = thermalPalette(luminance);
    FragColor = vec4(color, 1.0);
}
