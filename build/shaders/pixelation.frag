#version 330 core

out vec4 FragColor;
in vec2 TexCoord;

uniform sampler2D ourTexture;
uniform vec2 resolution; // pasa el tamaño de la ventana

void main()
{
    float pixelSize = 5.0;
    vec2 uv = TexCoord * resolution;
    uv = floor(uv / pixelSize) * pixelSize;
    uv = uv / resolution;
    FragColor = texture(ourTexture, uv);
}