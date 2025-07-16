#include <glad/glad.h>
#include <GLFW/glfw3.h>

#include "imgui/imgui.h"
#include "imgui/imgui_impl_glfw.h"
#include "imgui/imgui_impl_opengl3.h"

#include "src/camera.h"
#include "src/drawable_mesh.h"
#include "src/drawable_model.h"
#include "src/frame_counter.h"
#include "src/property_inspector.h"
#include "src/shader.h"
#include "src/window.h"

void framebuffer_size_callback(GLFWwindow *window, int width, int height);
void mouse_callback(GLFWwindow *window, double xposIn, double yposIn);
void scroll_callback(GLFWwindow *window, double xoffset, double yoffset);
void toggleCursor(GLFWwindow *window, int key, int scancode, int action, int mods);
void processInput(GLFWwindow *window);

Window windowObj(1024, 768, framebuffer_size_callback, mouse_callback, scroll_callback, toggleCursor);
Camera camera;
FrameCounter frameCounter;
bool fpsMode = false;

GLuint fbo1, fbo2;
GLuint tex1, tex2;
GLuint depthTex1, depthTex2;

int SCR_WIDTH = 1024, SCR_HEIGHT = 768;

struct ScreenQuad {
    GLuint VAO, VBO;
    void init() {
        float quadVertices[] = {
            // positions   // texCoords
            -1.0f,  1.0f,   0.0f, 1.0f,
            -1.0f, -1.0f,   0.0f, 0.0f,
             1.0f, -1.0f,   1.0f, 0.0f,
            -1.0f,  1.0f,   0.0f, 1.0f,
             1.0f, -1.0f,   1.0f, 0.0f,
             1.0f,  1.0f,   1.0f, 1.0f
        };
        glGenVertexArrays(1, &VAO);
        glGenBuffers(1, &VBO);
        glBindVertexArray(VAO);
        glBindBuffer(GL_ARRAY_BUFFER, VBO);
        glBufferData(GL_ARRAY_BUFFER, sizeof(quadVertices), quadVertices, GL_STATIC_DRAW);
        glEnableVertexAttribArray(0);
        glVertexAttribPointer(0, 2, GL_FLOAT, GL_FALSE, 4 * sizeof(float), (void*)0);
        glEnableVertexAttribArray(1);
        glVertexAttribPointer(1, 2, GL_FLOAT, GL_FALSE, 4 * sizeof(float),
                              (void*)(2 * sizeof(float)));
        glBindVertexArray(0);
    }
    void draw() {
        glBindVertexArray(VAO);
        glDrawArrays(GL_TRIANGLES, 0, 6);
        glBindVertexArray(0);
    }
};

void createFramebuffer(GLuint& fbo, GLuint& texture, GLuint& depthTexture, int width, int height) {
    glGenFramebuffers(1, &fbo);
    glBindFramebuffer(GL_FRAMEBUFFER, fbo);

    // color texture
    glGenTextures(1, &texture);
    glBindTexture(GL_TEXTURE_2D, texture);
    glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA, width, height,
                 0, GL_RGBA, GL_UNSIGNED_BYTE, nullptr);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
    glFramebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0,
                           GL_TEXTURE_2D, texture, 0);

    // depth texture
    glGenTextures(1, &depthTexture);
    glBindTexture(GL_TEXTURE_2D, depthTexture);
    glTexImage2D(GL_TEXTURE_2D, 0, GL_DEPTH_COMPONENT, width, height,
                 0, GL_DEPTH_COMPONENT, GL_FLOAT, nullptr);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
    glFramebufferTexture2D(GL_FRAMEBUFFER, GL_DEPTH_ATTACHMENT,
                           GL_TEXTURE_2D, depthTexture, 0);

    GLenum drawBuffers[1] = {GL_COLOR_ATTACHMENT0};
    glDrawBuffers(1, drawBuffers);

    if (glCheckFramebufferStatus(GL_FRAMEBUFFER) != GL_FRAMEBUFFER_COMPLETE)
        std::cerr << "Framebuffer not complete!" << std::endl;

    glBindFramebuffer(GL_FRAMEBUFFER, 0);
}


int main() {
    // --- Setup ImGui/GLFW/GLAD ---
    IMGUI_CHECKVERSION();
    ImGui::CreateContext();
    ImGuiIO &io = ImGui::GetIO();
    io.ConfigWindowsMoveFromTitleBarOnly = true;
    io.ConfigFlags |= ImGuiConfigFlags_NavEnableKeyboard;
    ImGui_ImplGlfw_InitForOpenGL(windowObj.window, true);
    ImGui_ImplOpenGL3_Init();

    Shader defaultShader("shaders/default.vert","shaders/default.frag");
    Shader screenShader("shaders/screen.vert", "shaders/screen.frag");

    Shader grayShader("shaders/screen.vert",   "shaders/gray.frag");
    Shader invertShader("shaders/screen.vert", "shaders/invert.frag");
    Shader crtShader("shaders/screen.vert","shaders/crt.frag");
    Shader fishEyeShader("shaders/screen.vert","shaders/fisheye.frag");
    Shader nightVisionShader("shaders/screen.vert","shaders/nightvision.frag");
    Shader pixelationShader("shaders/screen.vert","shaders/pixelation.frag");
    Shader sepiaShader("shaders/screen.vert","shaders/sepia.frag");
    Shader vignetteShader("shaders/screen.vert","shaders/vignette.frag");
    Shader thermalShader("shaders/screen.vert", "shaders/thermal.frag");
    Shader glitchShader("shaders/screen.vert", "shaders/glitch.frag");
    Shader blurShader("shaders/screen.vert", "shaders/blur.frag");
    Shader bloomShader("shaders/screen.vert", "shaders/bloom.frag");
    Shader sharpShader("shaders/screen.vert", "shaders/sharp.frag");
    Shader AOShader("shaders/screen.vert", "shaders/AO.frag");
    Shader filmGrainShader("shaders/screen.vert", "shaders/filmGrain.frag");
    Shader DoFShader("shaders/screen.vert", "shaders/DoF.frag");

    std::vector<Shader*> postShaders = {&grayShader, &invertShader, &crtShader, &fishEyeShader,
                                        &nightVisionShader, &pixelationShader, &sepiaShader, &vignetteShader,
                                        &thermalShader, &glitchShader, &blurShader, &bloomShader,
										&sharpShader, &AOShader, &filmGrainShader, &DoFShader};

    std::vector<DrawableModel*> models = {
        new DrawableModel(GL_STATIC_DRAW, "resources/house/house.obj", "resources/house/textures/"),
        new DrawableModel(GL_STATIC_DRAW, "resources/tea/tea.obj",   "resources/tea/textures/"),
        new DrawableModel(GL_STATIC_DRAW, "resources/kind/kind.obj", "resources/kind/textures/"),
        new DrawableModel(GL_STATIC_DRAW, "resources/oshi/oshi.obj", "resources/oshi/textures/"),
        new DrawableModel(GL_STATIC_DRAW, "resources/cubt/cubt.obj", "resources/cubt/textures/"),
        new DrawableModel(GL_STATIC_DRAW, "resources/plane/plane.obj","resources/plane/textures/")
    };

    glEnable(GL_DEPTH_TEST);

    createFramebuffer(fbo1, tex1, depthTex1, SCR_WIDTH, SCR_HEIGHT);
    createFramebuffer(fbo2, tex2, depthTex2, SCR_WIDTH, SCR_HEIGHT);

    PropertyInspector propertyInspector;
    ScreenQuad screenQuad; screenQuad.init();

    while (!glfwWindowShouldClose(windowObj.window)) {
        ImGui_ImplOpenGL3_NewFrame();
        ImGui_ImplGlfw_NewFrame();
        ImGui::NewFrame();
        processInput(windowObj.window);
        propertyInspector.render(windowObj, camera, models);
        camera.Update(frameCounter.deltaTime);
        frameCounter.update(false);
        auto color = propertyInspector.background_color;
        glClearColor(color[0], color[1], color[2], 1.0f);
        glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

        glm::mat4 model = glm::mat4(1.0f);
		auto position = propertyInspector.position;
		model = glm::translate(model, glm::vec3(position[0], position[1], position[2]));
		auto rotation = propertyInspector.rotation;
		model = glm::rotate(model, glm::radians(rotation[0]), glm::vec3(1.0f, 0.0f, 0.0f));

		if (propertyInspector.turntable)
			rotation[1] += frameCounter.deltaTime * 10.0f;

		rotation[1] = fmodf(rotation[1], 360.0f);
		model = glm::rotate(model, glm::radians(rotation[1]), glm::vec3(0.0f, 1.0f, 0.0f));
		model = glm::rotate(model, glm::radians(rotation[2]), glm::vec3(0.0f, 0.0f, 1.0f));

		auto scale = propertyInspector.scale;
		model = glm::scale(model, glm::vec3(scale[0], scale[1], scale[2]));

		glm::mat4 view       = camera.GetViewMatrix(!fpsMode);
        glm::mat4 projection = glm::perspective(
            glm::radians(camera.Zoom),
            float(SCR_WIDTH) / float(SCR_HEIGHT),
            0.1f, 1000.0f
        );

        glBindFramebuffer(GL_FRAMEBUFFER, fbo1);
        glViewport(0, 0, SCR_WIDTH, SCR_HEIGHT);
        glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

        defaultShader.use();
        defaultShader.setFloat("time", glfwGetTime());
        defaultShader.setMat4("model",      model);
        defaultShader.setMat4("view",       view);
        defaultShader.setMat4("projection", projection);
        defaultShader.setVec3("camPos", fpsMode ? camera.Position : camera.OrbitPosition);
        models[propertyInspector.m_current]->Draw();

        GLuint readTex  = tex1;
        GLuint depthTex  = depthTex1;
        GLuint writeFBO = fbo2;
        glDisable(GL_DEPTH_TEST);
        for (int idx : propertyInspector.selected_shaders) {
            Shader* post = postShaders[idx];
            glBindFramebuffer(GL_FRAMEBUFFER, writeFBO);

            GLenum drawBuffers[1] = {GL_COLOR_ATTACHMENT0};
            glDrawBuffers(1, drawBuffers);

            glViewport(0, 0, SCR_WIDTH, SCR_HEIGHT);
            glClear(GL_COLOR_BUFFER_BIT);

            glDisable(GL_DEPTH_TEST);
            post->use();
            post->setInt("ourTexture", 0);
			post->setInt("depthTexture", 1);
            post->setFloat("time", glfwGetTime());
            post->setVec2("resolution", SCR_WIDTH, SCR_HEIGHT);

            glActiveTexture(GL_TEXTURE0);
            glBindTexture(GL_TEXTURE_2D, readTex);
			glActiveTexture(GL_TEXTURE1);
			glBindTexture(GL_TEXTURE_2D, depthTex);
            screenQuad.draw();

            readTex  = (readTex  == tex1 ? tex2 : tex1);
            depthTex  = (depthTex  == depthTex1 ? depthTex2 : depthTex1);
            writeFBO = (writeFBO == fbo2 ? fbo1 : fbo2);
        }
        glEnable(GL_DEPTH_TEST);

        glBindFramebuffer(GL_FRAMEBUFFER, 0);
        glViewport(0, 0, SCR_WIDTH, SCR_HEIGHT);
        glClear(GL_COLOR_BUFFER_BIT);

        screenShader.use(); 
        screenShader.setInt("ourTexture", 0);
        glActiveTexture(GL_TEXTURE0);
        glBindTexture(GL_TEXTURE_2D, readTex);
        screenQuad.draw(); 

        // ——— ImGui render & swap ———
        ImGui::Render();
        ImGui_ImplOpenGL3_RenderDrawData(ImGui::GetDrawData());
        glfwSwapBuffers(windowObj.window);
        glfwPollEvents();
    }

    // Cleanup
    ImGui_ImplOpenGL3_Shutdown();
    ImGui_ImplGlfw_Shutdown();
    glfwTerminate();
    return 0;
}

bool firstMouse = true;

void focus(GLFWwindow *window) {
  glfwSetInputMode(window, GLFW_CURSOR, GLFW_CURSOR_DISABLED);
}

void unfocus(GLFWwindow *window) {
  glfwSetInputMode(window, GLFW_CURSOR, GLFW_CURSOR_NORMAL);
  firstMouse = true;
}

void toggleCursor(GLFWwindow *window, int key, int scancode, int action,
                  int mods) {
  if (key == GLFW_KEY_GRAVE_ACCENT && action == GLFW_PRESS) {
    fpsMode = !fpsMode;
    if (fpsMode)
      focus(window);
    else
      unfocus(window);
  }
}

void processInput(GLFWwindow *window) {
  if (glfwGetKey(window, GLFW_KEY_ESCAPE) == GLFW_PRESS)
    glfwSetWindowShouldClose(window, true);

  ImGuiIO &io = ImGui::GetIO();
  if (!fpsMode && !io.WantCaptureMouse) {
    if (glfwGetMouseButton(window, GLFW_MOUSE_BUTTON_1) ||
        glfwGetMouseButton(window, GLFW_MOUSE_BUTTON_2))
      focus(window);
    else if (glfwGetInputMode(window, GLFW_CURSOR) == GLFW_CURSOR_DISABLED)
      unfocus(window);
  }

  if (fpsMode) {
    float dt = frameCounter.deltaTime;
    if (glfwGetKey(window, GLFW_KEY_LEFT_CONTROL) == GLFW_PRESS)
      dt *= 2.5f;
    if (glfwGetKey(window, GLFW_KEY_W) == GLFW_PRESS)
      camera.ProcessKeyboard(FORWARD, dt);
    if (glfwGetKey(window, GLFW_KEY_A) == GLFW_PRESS)
      camera.ProcessKeyboard(LEFT, dt);
    if (glfwGetKey(window, GLFW_KEY_S) == GLFW_PRESS)
      camera.ProcessKeyboard(BACKWARD, dt);
    if (glfwGetKey(window, GLFW_KEY_D) == GLFW_PRESS)
      camera.ProcessKeyboard(RIGHT, dt);
    if (glfwGetKey(window, GLFW_KEY_LEFT_SHIFT) == GLFW_PRESS)
      camera.ProcessKeyboard(DOWN, dt);
    if (glfwGetKey(window, GLFW_KEY_SPACE) == GLFW_PRESS)
      camera.ProcessKeyboard(UP, dt);
  }
}

float lastX, lastY;
void mouse_callback(GLFWwindow *window, double xposIn, double yposIn) {
  float xpos = static_cast<float>(xposIn);
  float ypos = static_cast<float>(yposIn);

  if (firstMouse) {
    lastX = xpos;
    lastY = ypos;
    firstMouse = false;
  }

  float xoffset = xpos - lastX;
  float yoffset =
      lastY - ypos; // reversed since y-coordinates go from bottom to top

  lastX = xpos;
  lastY = ypos;

  auto pan = glfwGetMouseButton(window, GLFW_MOUSE_BUTTON_2);

  if (glfwGetInputMode(window, GLFW_CURSOR) == GLFW_CURSOR_DISABLED)
    camera.ProcessMouseMovement(xoffset, yoffset, !fpsMode, pan);
}

void scroll_callback(GLFWwindow *window, double xoffset, double yoffset) {
  camera.ProcessMouseScroll(-yoffset, !fpsMode);
}

void framebuffer_size_callback(GLFWwindow *window, int width, int height) {
  glViewport(0, 0, width, height);
};
