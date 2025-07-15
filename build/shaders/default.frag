#version 330 core

in vec2 TexCoord;
in vec3 FragPos;             // opcional

out vec4 FragColor;

uniform sampler2D ourTexture;

// Opcional: parámetros de luz si quieres iluminación
// uniform vec3 lightPos, viewPos;

void main()
{
    // Muestreo simple de la textura resultante
    vec4 texColor = texture(ourTexture, TexCoord);
    if (texColor.a < 0.1)
        discard;

    // Si solo quieres mostrar la textura:
    FragColor = texColor;
}
