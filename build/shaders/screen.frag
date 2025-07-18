#version 330 core

// -------------------------------------------------------------------
// Entrada interpolada desde el vertex shader.
// -------------------------------------------------------------------
in vec2 TexCoord;

// -------------------------------------------------------------------
// Color de salida final de cada fragmento.
// -------------------------------------------------------------------
out vec4 FragColor;

// -------------------------------------------------------------------
// Textura que contiene el color renderizado de la escena o del paso
// anterior de post‑procesado.
// Debe coincidir con `screenShader.setInt("ourTexture", 0)` en C++.
// -------------------------------------------------------------------
uniform sampler2D ourTexture;

void main()
{
    vec4 color = texture(ourTexture, TexCoord);
    FragColor = color;
}
