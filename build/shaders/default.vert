// default.vert
#version 330 core

layout(location = 0) in vec3 aPos;
layout(location = 1) in vec2 aTexCoord;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;
uniform mat4 prevModel;
uniform mat4 prevView;
uniform mat4 prevProjection;

out vec2 TexCoord;
out vec2 CurrNDC;
out vec2 PrevNDC;

void main() {
    vec4 worldPos = model * vec4(aPos, 1.0);
    vec4 prevWorldPos = prevModel * vec4(aPos, 1.0);

    vec4 CurrClipPos = projection * view * worldPos;
    vec4 PrevClipPos = prevProjection * prevView * prevWorldPos;

	CurrNDC = (CurrClipPos.xy / CurrClipPos.w);
	PrevNDC = (PrevClipPos.xy / PrevClipPos.w);

    gl_Position = CurrClipPos;
    TexCoord = aTexCoord;
}
