import * as dat from "lil-gui";
import * as THREE from "three";
import React, { useEffect, useRef } from "react";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import styled from "@emotion/styled";

const StyledApp = styled.div(
  () => `

  `
);

export function App() {
  const ref = useRef(null);

  useEffect(() => {
    const params = { backgroundColor: 0xb7bad7 };

    // Debug
    const gui = new dat.GUI();

    // Canvas
    const canvas = ref.current;

    // Scene
    const scene = new THREE.Scene();

    // Scene background
    scene.background = new THREE.Color(params.backgroundColor);
    gui.addColor(params, "backgroundColor").onChange(() => {
      scene.background = new THREE.Color(params.backgroundColor);
    });

    // Texture loader
    const textureLoader = new THREE.TextureLoader();

    // Draco loader
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("draco/");

    // GLTF loader
    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    // Light
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x404040, 1.5);
    hemiLight.position.set(0, 1, 0);
    scene.add(hemiLight);

    // Textures & material
    const useColorMap = false;
    let colorsMaterial = null;
    if (useColorMap) {
      const colorMapTexture = textureLoader.load("colormap.jpg");
      colorMapTexture.flipY = false;
      colorMapTexture.encoding = THREE.sRGBEncoding;
      colorsMaterial = new THREE.MeshBasicMaterial({ map: colorMapTexture });
    }

    // Model
    gltfLoader.load("model.glb", (gltf) => {
      const model = gltf.scene;

      if (colorsMaterial) {
        model.traverse((child) => {
          child.material = colorsMaterial;
        });
      }

      scene.add(model);
    });

    // Window sizes
    const sizes = { width: window.innerWidth, height: window.innerHeight };

    // Base camera
    const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100);
    camera.position.x = 4;
    camera.position.y = 2;
    camera.position.z = -4;
    scene.add(camera);

    gui.add(camera.position, "x", 2, 6, 0.01);

    // Controls
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;

    window.addEventListener("resize", () => {
      // Update sizes
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;

      // Update camera
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();

      // Update renderer
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    // Animate
    const clock = new THREE.Clock();

    const tick = () => {
      const elapsedTime = clock.getElapsedTime(); // eslint-disable-line

      // Update controls
      controls.update();

      // Render
      renderer.render(scene, camera);
      renderer.setClearColor(0x000000, 0.0);

      // Call tick again on the next frame
      window.requestAnimationFrame(tick);
    };

    tick();
  }, []);

  return (
    <StyledApp>
      <canvas ref={ref} className="webgl"></canvas>
    </StyledApp>
  );
}
