#version 330 core

layout(location = 0) out vec4 FragColor;
layout(location = 1) out vec2 FragVelocity;

in vec2 TexCoord;

uniform sampler2D ourTexture;
uniform sampler2D velocityTexture;
uniform vec2 resolution;

const vec2 glyphSize = vec2(5.0, 5.0);

int patterns[40] = int[40](
    31, 17, 31, 17, 17,
    21, 31, 21, 31, 21,
    25, 26,  4, 11, 19,
     4, 31, 14, 31,  4,
     4,  4, 31,  4,  4,
     0,  0, 31,  0,  0,
     0,  0,  0,  4,  4,
     0,  0,  0,  0,  0
);

bool getGlyphPixel(int glyphIndex, int x, int y) {
    // Compute the index into the flattened array
    int index = glyphIndex * 5 + y;
    int row = patterns[index];
    return ((row >> (4 - x)) & 1) == 1;
}

int getGlyphIndex(float lum) {
    if (lum < 0.10) return 0; // '@'
    else if (lum < 0.20) return 1; // '#'
    else if (lum < 0.35) return 2; // '%'
    else if (lum < 0.50) return 3; // '*'
    else if (lum < 0.65) return 4; // '+'
    else if (lum < 0.80) return 5; // '-'
    else if (lum < 0.90) return 6; // '.'
    else return 7; // ' '
}

void main() {
    vec2 fragCoord = TexCoord * resolution;
    vec2 cellIndex = floor(fragCoord / glyphSize);
    vec2 cellOrigin = cellIndex * glyphSize;

    // Sample the center of the character cell from the image
    vec2 sampleUV = (cellOrigin + glyphSize * 0.5) / resolution;
    vec3 color = texture(ourTexture, sampleUV).rgb;
    float lum = dot(color, vec3(0.299, 0.587, 0.114));

    // Determine which glyph to use
    int glyphIndex = getGlyphIndex(lum);
    vec2 localPos = fragCoord - cellOrigin;
    int gx = int(floor(localPos.x));
    int gy = int(floor(localPos.y));

    bool on = getGlyphPixel(glyphIndex, gx, gy);

    FragColor = vec4(on ? color : vec3(0.0), 1.0);
	FragVelocity = texture(velocityTexture, TexCoord).xy;
}

