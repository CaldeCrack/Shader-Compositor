//
// Created by Aaron Tian on 8/5/23.
//

#include "property_inspector.h"
#include "window.h"
#include "camera.h"

#include "imgui/imgui.h"
#include "drawable_model.h"

#include <algorithm>

void PropertyInspector::render(Window windowObj, Camera& camera,
                               std::vector<DrawableModel*> &models) {

    ImGui::SetNextWindowPos(ImVec2(0, 18));
    auto flags = ImGuiWindowFlags_AlwaysAutoResize | ImGuiWindowFlags_NoMove;

    ImGui::Begin("Model Viewer", nullptr, flags);

    ImGui::Text("FPS: %f", ImGui::GetIO().Framerate);
    ImGui::Text("Frame Time: %f ms", ImGui::GetIO().DeltaTime);
    ImGui::Separator();

    ImGui::Text("Press ~ to toggle camera mode");
    ImGui::Text("(Orbit / First Person)");
    ImGui::Separator();

    ImGui::SliderFloat("FOV", &camera.Zoom, 5.0f, 90.0f);

    auto &model = *models[m_current];

    if (ImGui::Button("Reset Camera"))
    {
        camera.Reset(model.avg_pos, -90, -10);
    }

    bool info = false;
    bool instructions = false;
    if (ImGui::BeginMainMenuBar())
    {
        if (ImGui::MenuItem("Quit"))
        {
            glfwSetWindowShouldClose(windowObj.window, true);
        }

        if (ImGui::MenuItem("Model Info"))
            info = true;

        if (ImGui::MenuItem("Instructions"))
            instructions = true;

        // hack to get the menu to the right
        ImGui::SameLine(ImGui::GetWindowWidth() - 126);
        ImGui::Text("Aaron Tian 2023");
        ImGui::EndMainMenuBar();
    }

    if (info)
        ImGui::OpenPopup("info_popup");

    if (instructions)
        ImGui::OpenPopup("instruction_popup");

    if (ImGui::BeginPopup("info_popup"))
    {
        ImGui::Text("Meshes: %d", model.mesh_count);
        ImGui::Text("Vertex Count: %d", model.vertex_count);
        ImGui::Text("Material Count: %d", model.material_count);
        ImGui::EndPopup();
    }

    if (ImGui::BeginPopup("instruction_popup"))
    {
        ImGui::Text("Orbit Mode");
        ImGui::BulletText("Click and drag to rotate");
        ImGui::BulletText("Right click and drag to pan");
        ImGui::BulletText("Scroll to move in/out");

        ImGui::Spacing();

        ImGui::Text("First Person Mode");
        ImGui::BulletText("WASD QE to move");
        ImGui::BulletText("Use mouse to aim");
        ImGui::BulletText("Scroll to zoom");
        ImGui::EndPopup();
    }

    ImGui::ColorEdit3("Background Color", background_color);

    if (ImGui::CollapsingHeader("Model Transform", ImGuiTreeNodeFlags_DefaultOpen))
    {
        ImGui::DragFloat3("Position", &*position, 0.05f);
        ImGui::DragFloat3("Rotation", &*rotation, 0.1f);
        ImGui::DragFloat3("Scale", &*scale, 0.1f);
        ImGui::Checkbox("Turntable", &turntable);
    }

    ImGui::End();

    ImGui::SetNextWindowPos(ImVec2(ImGui::GetIO().DisplaySize.x, 18), 0, ImVec2(1.0f, 0));
    ImGui::Begin("Visual Options", nullptr, flags);
    if (ImGui::Combo("Model", &m_current, "House\0Tea\0Kind\0Oshi\0Cube\0Plane\0"))
    {
        camera.Reset(models[m_current]->avg_pos, -90, -10);
    }
    if (ImGui::CollapsingHeader("Shader Pipeline", ImGuiTreeNodeFlags_DefaultOpen)) {
		static const char* shader_names[] = {"Gray", "Invert", "CRT", "Fish eye",
                                             "Night vision", "Pixelation", "Sepia", "Vignette",
                                             "Thermal", "Glitch", "Blur", "Bloom", "Sharpening",
											 "Ambient Occlusion", "Film Grain", "Depth of Field",
											 "Motion Blur", "Dotted"};
		static bool selected[18] = {false};

		for (int i = 0; i < IM_ARRAYSIZE(shader_names); ++i) {
			bool was_selected = selected[i];

			if (ImGui::Selectable(shader_names[i], selected[i])) {
				selected[i] = !was_selected;
				if (selected[i]) {
					selected_shaders.push_back(i);
				} else {
					auto it = std::find(selected_shaders.begin(), selected_shaders.end(), i);
					if (it != selected_shaders.end())
						selected_shaders.erase(it);
				}
			}
		}

		if (!selected_shaders.empty()) {
			ImGui::SeparatorText("Shader Order:");
			for (int i = 0; i < selected_shaders.size(); ++i) {
				const char* name = shader_names[selected_shaders[i]];
				ImGui::Text("%d: %s", i, name);
			}
		}
	}
    ImGui::End();
}
