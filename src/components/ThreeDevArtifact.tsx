import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sparkles, RotateCw, Eye, Box, Trophy, Video } from 'lucide-react';

interface ThreeDevArtifactProps {
  leagueColor?: string;
  className?: string;
}

export const ThreeDevArtifact: React.FC<ThreeDevArtifactProps> = ({
  className = '',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [modelType, setModelType] = useState<'trophy' | 'satellite' | 'cube'>('trophy');
  const [isRotating, setIsRotating] = useState(true);

  // Store refs so animation loop has access to latest state without re-creating scene
  const isRotatingRef = useRef(isRotating);
  isRotatingRef.current = isRotating;
  const modelTypeRef = useRef(modelType);
  modelTypeRef.current = modelType;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const width = container.clientWidth || 340;
    const height = container.clientHeight || 280;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 4.2);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    container.appendChild(renderer.domElement);

    // 3-point Studio Lighting Rig
    const ambientLight = new THREE.HemisphereLight(0x6366f1, 0x1e1b4b, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.5);
    keyLight.position.set(3, 4, 3);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 2.0);
    rimLight.position.set(-3, 2, -2);
    scene.add(rimLight);

    // Contact ground shadow plane
    const shadowGeo = new THREE.PlaneGeometry(3, 3);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x0f172a,
      transparent: true,
      opacity: 0.25,
      depthWrite: false,
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.0;
    scene.add(shadowPlane);

    // Root Artifact Group
    const artifactGroup = new THREE.Group();
    scene.add(artifactGroup);

    // Materials
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.2,
      metalness: 0.85,
    });
    const purpleGemMat = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6,
      roughness: 0.1,
      metalness: 0.3,
      emissive: 0x4c1d95,
      emissiveIntensity: 0.3,
    });
    const cyanMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      roughness: 0.2,
      metalness: 0.7,
      wireframe: false,
    });
    const darkSlateMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.5,
      metalness: 0.4,
    });

    // Helper: Build Trophy (Composite 3-7 parts)
    const trophyGroup = new THREE.Group();
    // 1. Base pedestal
    const baseGeo = new THREE.CylinderGeometry(0.8, 0.9, 0.2, 32);
    const baseMesh = new THREE.Mesh(baseGeo, darkSlateMat);
    baseMesh.position.y = -0.9;
    trophyGroup.add(baseMesh);

    // 2. Gold stem
    const stemGeo = new THREE.CylinderGeometry(0.2, 0.4, 0.6, 24);
    const stemMesh = new THREE.Mesh(stemGeo, goldMat);
    stemMesh.position.y = -0.5;
    trophyGroup.add(stemMesh);

    // 3. Faceted Central League Gem (Octahedron)
    const gemGeo = new THREE.OctahedronGeometry(0.75, 1);
    const gemMesh = new THREE.Mesh(gemGeo, purpleGemMat);
    gemMesh.position.y = 0.25;
    trophyGroup.add(gemMesh);

    // 4. Orbiting Metallic Ring 1
    const ringGeo1 = new THREE.TorusGeometry(1.05, 0.04, 16, 64);
    const ringMesh1 = new THREE.Mesh(ringGeo1, goldMat);
    ringMesh1.position.y = 0.25;
    ringMesh1.rotation.x = Math.PI / 3;
    trophyGroup.add(ringMesh1);

    // 5. Orbiting Metallic Ring 2
    const ringGeo2 = new THREE.TorusGeometry(1.2, 0.03, 16, 64);
    const ringMesh2 = new THREE.Mesh(ringGeo2, cyanMat);
    ringMesh2.position.y = 0.25;
    ringMesh2.rotation.y = Math.PI / 4;
    trophyGroup.add(ringMesh2);

    // Satellite Group (Google Meet theme)
    const satGroup = new THREE.Group();
    const satBodyGeo = new THREE.BoxGeometry(0.7, 0.7, 0.7);
    const satBody = new THREE.Mesh(satBodyGeo, goldMat);
    satGroup.add(satBody);

    const dishGeo = new THREE.CylinderGeometry(0.5, 0.1, 0.2, 24);
    const dish = new THREE.Mesh(dishGeo, cyanMat);
    dish.position.y = 0.55;
    satGroup.add(dish);

    const panelGeo = new THREE.BoxGeometry(1.6, 0.35, 0.04);
    const leftPanel = new THREE.Mesh(panelGeo, darkSlateMat);
    leftPanel.position.x = -1.1;
    const rightPanel = new THREE.Mesh(panelGeo, darkSlateMat);
    rightPanel.position.x = 1.1;
    satGroup.add(leftPanel);
    satGroup.add(rightPanel);

    // Web Cube Group
    const cubeGroup = new THREE.Group();
    const outerCubeGeo = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    const outerCube = new THREE.Mesh(outerCubeGeo, cyanMat);
    cubeGroup.add(outerCube);

    const innerCoreGeo = new THREE.OctahedronGeometry(0.5);
    const innerCore = new THREE.Mesh(innerCoreGeo, purpleGemMat);
    cubeGroup.add(innerCore);

    // Set initial model
    artifactGroup.add(trophyGroup);

    // Pointer Drag Interaction
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotationY = 0;
    let targetRotationX = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      targetRotationY += deltaX * 0.012;
      targetRotationX += deltaY * 0.012;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    // Animation Loop
    let frameId = 0;
    const clock = new THREE.Clock();

    function tick() {
      const delta = clock.getDelta();

      // Model swapping check
      const currentType = modelTypeRef.current;
      if (currentType === 'trophy' && artifactGroup.children[0] !== trophyGroup) {
        artifactGroup.clear();
        artifactGroup.add(trophyGroup);
      } else if (currentType === 'satellite' && artifactGroup.children[0] !== satGroup) {
        artifactGroup.clear();
        artifactGroup.add(satGroup);
      } else if (currentType === 'cube' && artifactGroup.children[0] !== cubeGroup) {
        artifactGroup.clear();
        artifactGroup.add(cubeGroup);
      }

      // Auto rotation when enabled and not dragging
      if (isRotatingRef.current && !isDragging) {
        targetRotationY += delta * 0.6;
      }

      // Smooth exponential damping
      artifactGroup.rotation.y = THREE.MathUtils.damp(artifactGroup.rotation.y, targetRotationY, 8, delta);
      artifactGroup.rotation.x = THREE.MathUtils.damp(artifactGroup.rotation.x, targetRotationX, 8, delta);

      // Gentle floating bob
      const time = clock.getElapsedTime();
      artifactGroup.position.y = Math.sin(time * 2) * 0.08;

      // Rotate sub-parts
      ringMesh1.rotation.z += delta * 0.8;
      ringMesh2.rotation.x -= delta * 0.6;
      if (currentType === 'cube') {
        innerCore.rotation.x += delta * 1.5;
        innerCore.rotation.y += delta * 1.2;
      }

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(tick);
    }

    tick();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className={`relative bg-gradient-to-b from-indigo-950/20 to-purple-950/20 rounded-3xl border border-indigo-500/20 p-4 overflow-hidden backdrop-blur-sm ${className}`}>
      
      {/* Top 3D Badge */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-[11px] font-extrabold text-indigo-300">
          <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
          <span>Interactive 3D Spatial Artifact</span>
        </span>
      </div>

      {/* Controls Overlay */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-700/60 backdrop-blur">
        <button
          onClick={() => setModelType('trophy')}
          title="League Trophy"
          aria-label="3D League Trophy"
          className={`p-1.5 rounded-lg text-xs transition-colors ${
            modelType === 'trophy' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Trophy className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setModelType('satellite')}
          title="Google Meet Satellite"
          aria-label="3D Meet Satellite"
          className={`p-1.5 rounded-lg text-xs transition-colors ${
            modelType === 'satellite' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Video className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setModelType('cube')}
          title="Web Matrix Cube"
          aria-label="3D Web Matrix Cube"
          className={`p-1.5 rounded-lg text-xs transition-colors ${
            modelType === 'cube' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Box className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setIsRotating(!isRotating)}
          title={isRotating ? 'Pause rotation' : 'Resume rotation'}
          aria-label="Toggle 3D auto-rotation"
          className={`p-1.5 rounded-lg text-xs transition-colors ${
            isRotating ? 'text-indigo-400 hover:text-indigo-300' : 'text-slate-500'
          }`}
        >
          <RotateCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* WebGL Canvas Container */}
      <div
        ref={mountRef}
        className="w-full h-64 sm:h-72 cursor-grab active:cursor-grabbing flex items-center justify-center"
      />

      {/* Bottom Hint */}
      <div className="text-center text-[11px] text-slate-400 mt-1 flex items-center justify-center gap-1.5">
        <span>Click and drag to rotate in 3D space</span>
      </div>

    </div>
  );
};
