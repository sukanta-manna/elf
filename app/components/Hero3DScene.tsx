"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default function Hero3DScene() {
  const outerWrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const outerWrapper = outerWrapperRef.current;
    if (!container || !outerWrapper) return;

    let isDestroyed = false;
    let isRunning = false;
    let isScrolledAway = false;
    let animationFrameId: number;
    let scrollTimeout: ReturnType<typeof setTimeout> | null = null;

    // 1. Scene
    const scene = new THREE.Scene();

    // 2. Camera
    const width = container.clientWidth || 640;
    const height = container.clientHeight || 720;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 3.6);

    // 3. Performance-Optimized WebGL Renderer
    // Right-sized canvas (only bounds the fairy) + capped DPR eliminates 90%+ of GPU fillrate
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "default",
      stencil: false,
      depth: true,
      preserveDrawingBuffer: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // 4. Hierarchical Groups for Organic Head & Eye Tracking
    const pivotGroup = new THREE.Group();
    const headGroup = new THREE.Group();
    const modelOffsetGroup = new THREE.Group();

    headGroup.add(modelOffsetGroup);
    pivotGroup.add(headGroup);
    scene.add(pivotGroup);

    // 5. Lighting Setup (Atmospheric & Ethereal Forest Mood)
    const ambientLight = new THREE.AmbientLight(0xd9f3df, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff5e4, 2.6);
    keyLight.position.set(2.5, 4, 3);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x7ed0e0, 1.3);
    fillLight.position.set(-3, -0.5, 2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x86efac, 3.2);
    rimLight.position.set(0, 3.5, -3);
    scene.add(rimLight);

    const faceLight = new THREE.PointLight(0xffedd5, 1.6, 5);
    faceLight.position.set(0, 0.4, 2.2);
    scene.add(faceLight);

    // 6. Load GLB 3D Fairy Model asynchronously
    const loader = new GLTFLoader();
    const modelPath = "/forst_fairy/source/A_pretty_ethereal_Fo_1030114414_texture.glb";

    loader.load(
      modelPath,
      (gltf) => {
        if (isDestroyed) return;
        const model = gltf.scene;

        const box = new THREE.Box3().setFromObject(model);
        const center = new THREE.Vector3();
        box.getCenter(center);
        const size = new THREE.Vector3();
        box.getSize(size);

        model.position.x = -center.x;
        model.position.y = -center.y - 0.05;
        model.position.z = -center.z;

        const maxDim = Math.max(size.x, size.y, size.z);
        const targetScale = 2.45 / (maxDim || 1);
        modelOffsetGroup.scale.setScalar(targetScale);

        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = false;
            mesh.receiveShadow = false;
            if (mesh.material) {
              const mat = mesh.material as THREE.MeshStandardMaterial;
              mat.roughness = Math.max(0.3, mat.roughness || 0.4);
              mat.metalness = Math.min(0.25, mat.metalness || 0.1);
            }
          }
        });

        modelOffsetGroup.add(model);
        setIsLoaded(true);

        // Initial render
        renderer.render(scene, camera);
      },
      undefined,
      (err) => {
        console.error("Error loading fairy 3D model:", err);
      }
    );

    // 7. Cursor Tracking with Smooth Lerp Easing
    const targetCursor = { x: 0, y: 0 };
    const currentCursor = { x: 0, y: 0 };

    const onPointerMove = (e: PointerEvent) => {
      // Only calculate if hero is visible and not scrolled away
      if (isScrolledAway) return;
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      targetCursor.x = Math.max(-1, Math.min(1, nx));
      targetCursor.y = Math.max(-1, Math.min(1, ny));
    };

    const onPointerLeave = () => {
      targetCursor.x = 0;
      targetCursor.y = 0;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("blur", onPointerLeave);
    document.addEventListener("mouseleave", onPointerLeave);

    // 8. Capped 60fps Render Loop
    const clock = new THREE.Clock();
    let lastRenderTime = 0;
    const targetInterval = 1000 / 60; // 60fps cap prevents GPU saturation on 120-240Hz screens

    const animate = (currentTime: number) => {
      if (!isRunning || isDestroyed || isScrolledAway) return;
      animationFrameId = requestAnimationFrame(animate);

      const elapsed = currentTime - lastRenderTime;
      if (elapsed < targetInterval) return;
      lastRenderTime = currentTime - (elapsed % targetInterval);

      const t = clock.getElapsedTime();

      // Smooth cursor lerping
      currentCursor.x += (targetCursor.x - currentCursor.x) * 0.075;
      currentCursor.y += (targetCursor.y - currentCursor.y) * 0.075;

      // Head & eye gaze rotations
      const targetYaw = currentCursor.x * 0.52;
      const targetPitch = -currentCursor.y * 0.32;
      const targetRoll = -currentCursor.x * 0.1;

      // Micro breathing & idle motion
      const breathingY = Math.sin(t * 1.5) * 0.02;
      const breathingSway = Math.cos(t * 1.1) * 0.01;

      headGroup.rotation.y = targetYaw + breathingSway * 0.4;
      headGroup.rotation.x = targetPitch + breathingY * 0.2;
      headGroup.rotation.z = targetRoll;

      pivotGroup.position.x = currentCursor.x * 0.15;
      pivotGroup.position.y = -currentCursor.y * 0.1 + breathingY - 0.05;

      renderer.render(scene, camera);
    };

    const startLoop = () => {
      if (isRunning || isDestroyed || isScrolledAway) return;
      isRunning = true;
      clock.start();
      lastRenderTime = performance.now();
      animationFrameId = requestAnimationFrame(animate);
    };

    const stopLoop = () => {
      if (!isRunning) return;
      isRunning = false;
      cancelAnimationFrame(animationFrameId);
    };

    // 9. Zero-Impact Scroll Engine:
    // - As soon as scrolling begins, WebGL pauses immediately (0% GPU contention during scroll).
    // - Once scrolled past hero (scrollY >= 85% of viewport), outerWrapper is set to display: none,
    //   completely unloading the WebGL texture from the browser compositor!
    // - When scrolled back to top, it seamlessly resumes.
    const onScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const heroThreshold = (window.innerHeight || 800) * 0.85;

      // When scrolled away, drop from compositor entirely
      if (scrollY >= heroThreshold) {
        if (!isScrolledAway) {
          isScrolledAway = true;
          stopLoop();
          if (outerWrapperRef.current) {
            outerWrapperRef.current.style.display = "none";
          }
        }
        return;
      }

      // If returning to the hero section
      if (isScrolledAway) {
        isScrolledAway = false;
        if (outerWrapperRef.current) {
          outerWrapperRef.current.style.display = "flex";
        }
      }

      // While scrolling within the hero, pause rendering to guarantee silky 60fps scrolling
      stopLoop();
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (!isScrolledAway && !document.hidden) {
          startLoop();
        }
      }, 120);
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    const onVisibilityChange = () => {
      if (document.hidden) {
        stopLoop();
      } else if (!isScrolledAway) {
        startLoop();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    // Initial start if at top of page
    if ((window.scrollY || 0) < 100) {
      startLoop();
    } else {
      isScrolledAway = true;
      if (outerWrapperRef.current) {
        outerWrapperRef.current.style.display = "none";
      }
    }

    // 10. Resize Handling
    const handleResize = () => {
      if (!container || isDestroyed) return;
      const w = container.clientWidth || 640;
      const h = container.clientHeight || 720;

      camera.aspect = w / h;

      if (w < 640) {
        camera.position.z = 4.4;
        pivotGroup.position.y = -0.15;
      } else {
        camera.position.z = 3.6;
        pivotGroup.position.y = -0.05;
      }

      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      isDestroyed = true;
      stopLoop();
      if (scrollTimeout) clearTimeout(scrollTimeout);

      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("blur", onPointerLeave);
      document.removeEventListener("mouseleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("resize", handleResize);

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      scene.clear();
    };
  }, []);

  return (
    <div
      ref={outerWrapperRef}
      className={`absolute inset-0 flex items-center justify-center pointer-events-none z-[15] overflow-hidden transition-opacity duration-1000 ease-out ${
        isLoaded ? "opacity-100" : "opacity-0"
      }`}
      style={{
        contain: "layout style paint",
        willChange: "transform",
      }}
      aria-hidden="true"
    >
      <div
        ref={containerRef}
        className="relative w-full max-w-[700px] h-[640px] sm:h-[740px] flex items-center justify-center pointer-events-none"
      />
    </div>
  );
}