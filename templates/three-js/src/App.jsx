import * as dat from "lil-gui";
import * as THREE from "three";
import React, { useEffect, useRef } from "react";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import styled from "@emotion/styled";

const StyledApp = styled.div(
  () => `
    width: 100%;
    height: 600px;
    
    svg {
      background: #eee;

      @keyframes draw {
        from {
          stroke-dashoffset: 1;
        }
        to {
          stroke-dashoffset: 0;
        }
      }

      .heart {
        stroke-dasharray: 1;
        stroke-dashoffset: 1;
        stroke: red;
        stroke-width: 5;
        fill: none;
        animation: draw 5s linear alternate infinite;
      }
    }
  `
);

export function App() {
  const ref = useRef(null);

  useEffect(() => {
    /**
     * Base
     */
    // Debug
    const gui = new dat.GUI({
      width: 400,
    });

    // Canvas
    const canvas = ref.current;

    // Scene
    const scene = new THREE.Scene();

    /**
     * Loaders
     */
    // Texture loader
    const textureLoader = new THREE.TextureLoader();

    // Draco loader
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("draco/");

    // GLTF loader
    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    /**
     * Textures
     */
    const bakedTexture = textureLoader.load("baked.jpg");
    bakedTexture.flipY = false;
    bakedTexture.encoding = THREE.sRGBEncoding;

    /**
     * Materials
     */
    // Baked material
    const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture });

    // Pole light material
    const poleLightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffe5 });

    // Portal light material
    const portalLightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

    gui.addColor(poleLightMaterial, "color");

    /**
     * Model
     */
    gltfLoader.load("portal.glb", (gltf) => {
      gltf.scene.traverse((child) => {
        child.material = bakedMaterial;
      });
      scene.add(gltf.scene);

      // Get each object
      const portalLightMesh = gltf.scene.children.find((child) => child.name === "portalLight");
      const poleLightAMesh = gltf.scene.children.find((child) => child.name === "poleLightA");
      const poleLightBMesh = gltf.scene.children.find((child) => child.name === "poleLightB");

      // Apply materials
      portalLightMesh.material = portalLightMaterial;
      poleLightAMesh.material = poleLightMaterial;
      poleLightBMesh.material = poleLightMaterial;
    });

    /**
     * Sizes
     */
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    /**
     * Camera
     */
    // Base camera
    const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100);
    camera.position.x = 4;
    camera.position.y = 2;
    camera.position.z = 4;
    scene.add(camera);

    gui.add(camera.position, "x", 2, 6, 0.01);

    // Controls
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;

    /**
     * Renderer
     */
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
    });
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

    /**
     * Animate
     */
    const clock = new THREE.Clock();

    const tick = () => {
      const elapsedTime = clock.getElapsedTime(); // eslint-disable-line

      // Update controls
      controls.update();

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
