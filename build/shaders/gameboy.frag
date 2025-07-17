#version 330 core

layout(location = 0) out vec4 FragColor;
layout(location = 1) out vec2 FragVelocity;

in vec2 TexCoord;

uniform sampler2D ourTexture;
uniform sampler2D velocityTexture;

const vec3 palette[4] = vec3[](
    vec3(15.0/255.0, 56.0/255.0, 15.0/255.0),
    vec3(48.0/255.0, 98.0/255.0, 48.0/255.0),
    vec3(139.0/255.0, 172.0/255.0, 15.0/255.0),
    vec3(155.0/255.0, 188.0/255.0, 15.0/255.0)
);

vec3 findClosestPaletteColor(vec3 color) {
    float minDist = 1000.0;
    vec3 bestColor = palette[0];
    for(int i = 0; i < 4; i++) {
        float dist = distance(color, palette[i]);
        if(dist < minDist) {
            minDist = dist;
            bestColor = palette[i];
        }
    }
    return bestColor;
}

void main() {
    vec3 color = texture(ourTexture, TexCoord).rgb;
    vec3 gbColor = findClosestPaletteColor(color);

    FragColor = vec4(gbColor, 1.0);
    FragVelocity = texture(velocityTexture, TexCoord).xy;
}
