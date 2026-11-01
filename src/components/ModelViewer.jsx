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

    // Perspective Camera
    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0.1, 4.4);

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
    renderer.toneMappingExposure = 1.0;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    // Calibrated Studio Lighting setup (natural contrast, zero blowout)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    // Key Light (balanced from front-right)
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(3, 5, 5);
    scene.add(keyLight);

    // Soft Fill Light (from front-left)
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.9);
    fillLight.position.set(-4, 2, 4);
    scene.add(fillLight);

    // Top Overhead Light
    const topLight = new THREE.DirectionalLight(0xffffff, 0.6);
    topLight.position.set(0, 6, 2);
    scene.add(topLight);

    // Model Root Group
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    // Mouse Tracking & Interaction State
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let isDragging = false;
    let previousMouseX = 0;
    let dragRotationY = 0;

    // Load .GLB Model
    const loader = new GLTFLoader();
    loader.load(
      '/star_wars_shiny_bb8.glb',
      (gltf) => {
        const model = gltf.scene;

        // Compute Bounding Box to center pivot and ground to floor
        const box = new THREE.Box3().setFromObject(model);
        const center = new THREE.Vector3();
        box.getCenter(center);

        // Center X & Z, place base at Y = 0
        model.position.x = -center.x;
        model.position.y = -box.min.y;
        model.position.z = -center.z;

        // Position the model group so base is aligned with the bottom of view
        modelGroup.position.set(0, -1.5, 0);

        // Restore authentic Star Wars BB-8 materials (Pure White Body, Orange Rings, Black Eye Lens)
        model.traverse((child) => {
          if (child.isMesh && child.material) {
            const matName = (child.material.name || '').toLowerCase();

            if (matName.includes('shinywhite')) {
              // Main Body: Ceramic Studio White (balanced specular, no glare)
              child.material = new THREE.MeshStandardMaterial({
                color: 0xf0f2f5,
                roughness: 0.22,
                metalness: 0.02,
              });
            } else if (matName.includes('oranje')) {
              // Iconic Robot Yellow Rings (High-vibrancy pure yellow)
              child.material = new THREE.MeshStandardMaterial({
                color: new THREE.Color('#ffee00'),
                roughness: 0.2,
                metalness: 0.04,
              });
            } else if (matName.includes('zwart')) {
              // Deep Glossy Black Eye Lens
              child.material = new THREE.MeshStandardMaterial({
                color: 0x080808,
                roughness: 0.1,
                metalness: 0.15,
              });
            } else if (matName.includes('grijsvak')) {
              // Silver/Gray Maintenance Panels
              child.material = new THREE.MeshStandardMaterial({
                color: 0x8a919c,
                roughness: 0.3,
                metalness: 0.6,
              });
            } else if (matName.includes('knoop')) {
              // Metallic Antennas and Dials
              child.material = new THREE.MeshStandardMaterial({
                color: 0xbcc2cb,
                roughness: 0.25,
                metalness: 0.75,
              });
            } else if (matName.includes('bluelight')) {
              // Blue Optical Indicator
              child.material = new THREE.MeshStandardMaterial({
                color: 0x0088ff,
                emissive: 0x0088ff,
                emissiveIntensity: 1.2,
                roughness: 0.2,
              });
            } else if (matName.includes('redlight')) {
              // Red Optical Indicator
              child.material = new THREE.MeshStandardMaterial({
                color: 0xff2222,
                emissive: 0xff2222,
                emissiveIntensity: 1.2,
                roughness: 0.2,
              });
            } else {
              // Default to Pristine White
              child.material = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                roughness: 0.2,
                metalness: 0.02,
              });
            }

            child.material.needsUpdate = true;
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

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
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

      // Subtle breathing float
      const floatOffset = Math.sin(elapsedTime * 1.5) * 0.04;
      modelGroup.position.y = -1.5 + floatOffset;

      // Combined rotation: mouse parallax + user drag + gentle idle drift
      const baseRotationY = dragRotationY + Math.sin(elapsedTime * 0.4) * 0.15;
      modelGroup.rotation.y = baseRotationY + mouse.x * 0.4;
      modelGroup.rotation.x = -mouse.y * 0.15 + Math.sin(elapsedTime * 1.2) * 0.02;

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
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`model-3d-container ${loaded ? 'is-loaded' : ''}`}
      title="Interactive 3D BB-8 Model // Drag to rotate"
    >
      <canvas ref={canvasRef} className="model-3d-canvas" />
    </div>
  );
}
