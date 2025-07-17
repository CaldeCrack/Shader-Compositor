#version 330 core

in vec2 TexCoord;

layout(location = 0) out vec4 FragColor;
layout(location = 1) out vec2 FragVelocity;

uniform sampler2D ourTexture;
uniform sampler2D depthTexture;
uniform sampler2D velocityTexture;

void main() {
    vec2 velocity = texture(velocityTexture, TexCoord).xy;
	float depth = texture(depthTexture, TexCoord).r;

	if (depth == 1.0)
		FragColor = texture(ourTexture, TexCoord);
	else {
		vec4 color = vec4(0.0);
		const int samples = 10;
		for (int i = 0; i < samples; ++i) {
			float t = float(i) / float(samples - 1);
			vec2 offset = clamp(TexCoord - velocity * t, 0.0, 1.0);
			color += texture(ourTexture, offset);
		}
		FragColor = color / samples;
	}

	FragVelocity = texture(velocityTexture, TexCoord).xy;
}
