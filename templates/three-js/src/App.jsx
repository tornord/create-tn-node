import * as dat from "lil-gui";
import * as THREE from "three";
import React, { useEffect, useRef } from "react";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import styled from "@emotion/styled";

const StyledApp = styled.div(
  () => `
    .webgl
    {
        position: fixed;
        top: 0;
        left: 0;
        outline: none;

        // background: #11e8bb; /* Old browsers */
        background: linear-gradient(to bottom, #e3e9ec 0%, #a099a4 100%);
    }
  `
);

export function App() {
  const ref = useRef(null);

  useEffect(() => {
    // const params = { backgroundColor: 0xb7bad7 };

    // Debug
    const gui = new dat.GUI();

    // Canvas
    const canvas = ref.current;

    // Scene
    const scene = new THREE.Scene();

    // Scene background
    // scene.background = new THREE.Color(params.backgroundColor);
    // gui.addColor(params, "backgroundColor").onChange(() => {
    //   scene.background = new THREE.Color(params.backgroundColor);
    // });

    // Texture loader
    const textureLoader = new THREE.TextureLoader();

    // GLTF loader
    const gltfLoader = new GLTFLoader();

    // Light
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x404040, 1.5);
    hemiLight.position.set(0, 1, 0);
    scene.add(hemiLight);

    const spotLight = new THREE.SpotLight(0xffffff, 600);
    spotLight.position.set(0, 10, 0);
    spotLight.castShadow = true;
    spotLight.shadow.radius = 5;
    spotLight.shadow.blurSamples = 25;
    scene.add(spotLight);
    // scene.add(new THREE.SpotLightHelper(spotLight, 1));

    // Textures & material
    const useColorMap = false;
    const colorsMaterial = new THREE.MeshStandardMaterial({
      depthTest: true,
      depthWrite: true,
      side: THREE.DoubleSide,
    });
    if (useColorMap) {
      const colorMapTexture = textureLoader.load("colormap.jpg");
      colorMapTexture.flipY = false;
      colorMapTexture.colorSpace = THREE.SRGBColorSpace;
      colorsMaterial.map = colorMapTexture;
    } else {
      colorsMaterial.color = new THREE.Color(0x00388eb9);
    }

    const mixers = []; // Array of mixers in case of many models

    // Model
    gltfLoader.load("model.glb", (gltf) => {
      const model = gltf.scene;
      const mixer = new THREE.AnimationMixer(model);
      mixers.push(mixer);

      if (colorsMaterial) {
        model.traverse((child) => {
          if (child.isMesh) {
            if (child.name === "Ground") {
              child.receiveShadow = true;
            } else {
              child.castShadow = true;
            }
          }
          child.material = colorsMaterial;
        });
      }

      const actions = [];
      for (let i = 0; i < gltf.animations.length; i++) {
        const clip = gltf.animations[i];
        // const n = clip.name.toLowerCase();
        const action = mixer.clipAction(clip);
        action.setLoop(THREE.LoopRepeat);
        action.clampWhenFinished = true;
        action.enable = true;
        action.play();
        actions.push(action);
      }

      scene.add(model);
    });

    // Window sizes
    const sizes = { width: window.innerWidth, height: window.innerHeight };

    // Base camera
    const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100);
    camera.position.x = 12;
    camera.position.y = 6;
    camera.position.z = -12;
    scene.add(camera);
    gui.add(camera.position, "x", -20, 20, 0.01);

    // Controls
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.setClearColor(0x000000, 0.0);

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

      // Update animation mixers
      for (const mixer of mixers) {
        mixer.setTime(elapsedTime);
      }

      // Render
      renderer.render(scene, camera);

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
