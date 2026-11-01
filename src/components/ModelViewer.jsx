import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default function ModelViewer() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // Scene Setup
    const scene = new THREE.Scene();

    // Perspective Camera with dynamic FOV preserving full horizontal span across all aspect ratios
    const baseFov = 52;
    const initialAspect = container.clientWidth / container.clientHeight;
    const initialFov = initialAspect < 1.0
      ? (2 * Math.atan(Math.tan((baseFov * Math.PI) / 360) / initialAspect) * 180) / Math.PI
      : baseFov;

    const camera = new THREE.PerspectiveCamera(
      initialFov,
      initialAspect,
      0.1,
      100
    );
    camera.position.set(0, 0.55, 4.8);
    camera.lookAt(0, 0.12, 0);

    // High-performance WebGL Renderer with Alpha (transparent background)
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    // Calibrated Studio Lighting: perfectly balanced to render all diffuse texture details without washout
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.72);
    scene.add(ambientLight);

    // Warm Key Light (reveals casing contours, badges, and keys without blowing out highlights)
    const keyLight = new THREE.DirectionalLight(0xfff6ea, 1.1);
    keyLight.position.set(3.5, 4.5, 3.5);
    scene.add(keyLight);

    // Soft Cool Fill Light (front-left)
    const fillLight = new THREE.DirectionalLight(0xd5e5ff, 0.55);
    fillLight.position.set(-3.5, 2.5, 2.5);
    scene.add(fillLight);

    // Subtle Overhead Rim Light
    const topLight = new THREE.DirectionalLight(0xffffff, 0.4);
    topLight.position.set(0, 5, 1);
    scene.add(topLight);

    // Direct Front Eye Light: illuminates Windows 98 screen, keyboard keys, and LED indicators
    const frontFill = new THREE.DirectionalLight(0xfff8ee, 0.45);
    frontFill.position.set(0, 1.2, 4.2);
    scene.add(frontFill);

    // Model Root Group
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    // Mouse Tracking & Interaction State
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let isDragging = false;
    let previousMouseX = 0;
    let dragRotationY = -0.35;

    // High-Resolution 2048x2048 Authentic Retro Diffuse Texture
    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
    const textureLoader = new THREE.TextureLoader();
    const retroTexture = textureLoader.load(
      '/retro_computer_diffuse.png',
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = maxAnisotropy;
        tex.generateMipmaps = true;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.flipY = false;
        tex.needsUpdate = true;

        if (modelGroup) {
          modelGroup.traverse((child) => {
            if (child.isMesh && child.material) {
              child.material.map = tex;
              child.material.needsUpdate = true;
            }
          });
        }
      }
    );
    retroTexture.colorSpace = THREE.SRGBColorSpace;
    retroTexture.flipY = false;
    retroTexture.anisotropy = maxAnisotropy;

    // Load .GLB Model
    const loader = new GLTFLoader();
    loader.load(
      '/retro_computer.glb',
      (gltf) => {
        const model = gltf.scene;

        // Restore prominent, original large model size as requested by user
        const box = new THREE.Box3().setFromObject(model);
        const size = new THREE.Vector3();
        box.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);

        // Scaled to full grand size (increased for impressive presence)
        const scale = 3.45 / (maxDim || 1);
        model.scale.setScalar(scale);

        // Recompute center after scale and center geometry strictly at (0, 0, 0)
        const scaledBox = new THREE.Box3().setFromObject(model);
        const center = new THREE.Vector3();
        scaledBox.getCenter(center);

        // Center on all 3 axes so rotation pivots around true geometric centroid
        model.position.x = -center.x;
        model.position.y = -center.y;
        model.position.z = -center.z;

        // Position modelGroup elevated in view (well above the bottom)
        modelGroup.position.set(0, 0.12, 0);

        // Configure shadows & guarantee crisp, complete texture rendering on all meshes
        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material) {
              const targetMap = child.material.map || retroTexture;
              targetMap.colorSpace = THREE.SRGBColorSpace;
              targetMap.anisotropy = maxAnisotropy;
              targetMap.flipY = false;
              targetMap.generateMipmaps = true;
              targetMap.minFilter = THREE.LinearMipmapLinearFilter;
              targetMap.magFilter = THREE.LinearFilter;
              targetMap.needsUpdate = true;

              child.material.map = targetMap;
              child.material.roughness = 0.82;
              child.material.metalness = 0.04;
              child.material.color.setHex(0xffffff);
              child.material.side = THREE.DoubleSide;
              child.material.needsUpdate = true;
            }
          }
        });

        modelGroup.add(model);
        setLoaded(true);
      },
      undefined,
      (error) => {
        console.error('Error loading 3D GLB model:', error);
      }
    );

    // Mouse Move Parallax
    const handleMouseMove = (e) => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      mouse.targetX = (e.clientX / windowWidth) * 2 - 1;
      mouse.targetY = -(e.clientY / windowHeight) * 2 + 1;

      if (isDragging) {
        const deltaX = e.clientX - previousMouseX;
        dragRotationY += deltaX * 0.008;
        previousMouseX = e.clientX;
      }
    };

    // Drag Interaction
    const handleMouseDown = (e) => {
      isDragging = true;
      previousMouseX = e.clientX;
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    // Touch Interaction for Mobile
    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        previousMouseX = e.touches[0].clientX;
      }
    };

    const handleTouchMove = (e) => {
      if (isDragging && e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - previousMouseX;
        dragRotationY += deltaX * 0.008;
        previousMouseX = e.touches[0].clientX;
      }
    };

    const handleTouchEnd = () => {
      isDragging = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    // Resize Handler with dynamic FOV ensuring no parts get cut when window is resized
    const handleResize = () => {
      if (!container || !renderer) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      const aspect = width / height;
      camera.aspect = aspect;

      // Keep horizontal viewing span locked so large 3D model never clips on narrow viewports
      if (aspect < 1.0) {
        camera.fov = (2 * Math.atan(Math.tan((baseFov * Math.PI) / 360) / aspect) * 180) / Math.PI;
      } else {
        camera.fov = baseFov;
      }
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse interpolation (easing)
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Subtle breathing float elevated comfortably above bottom
      const floatOffset = Math.sin(elapsedTime * 1.5) * 0.025;
      modelGroup.position.y = 0.12 + floatOffset;

      // Combined rotation: mouse parallax + user drag + gentle idle drift
      const baseRotationY = dragRotationY + Math.sin(elapsedTime * 0.4) * 0.12;
      modelGroup.rotation.y = baseRotationY + mouse.x * 0.35;
      modelGroup.rotation.x = -mouse.y * 0.08 + Math.sin(elapsedTime * 1.2) * 0.015;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('resize', handleResize);

      scene.traverse((obj) => {
        if (obj.isMesh) {
          obj.geometry?.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((mat) => mat.dispose());
          } else {
            obj.material?.dispose();
          }
        }
      });
      retroTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`model-3d-container ${loaded ? 'is-loaded' : ''}`}
      title="Interactive 3D Retro Computer // Drag to rotate"
    >
      <canvas ref={canvasRef} className="model-3d-canvas" />
    </div>
  );
}
