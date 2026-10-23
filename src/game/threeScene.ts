/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export const TRACK_WIDTH = 7.4;
export const LANE_WIDTH = 2.4;
export const LANE_POSITIONS = [-2.4, 0, 2.4]; // Left (0), Center (1), Right (2)
export const SEGMENT_LENGTH = 40;
export const NUM_SEGMENTS = 6;

// Software WebGL probe
export const isSoftwareGl = (() => {
  try {
    const gl = document.createElement('canvas').getContext('webgl2');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return false;
  }
})();

export interface CityEnvironment {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  ambientLight: THREE.HemisphereLight;
  sunLight: THREE.DirectionalLight;
  segments: THREE.Group[];
  metroTrain: THREE.Group;
  metroTrack: THREE.Group;
  updateScenery: (playerZ: number, restorationLevel: number, delta: number) => void;
  dispose: () => void;
}

/**
 * Creates the high-performance Three.js scene, camera, lighting, and procedural city segments
 */
export function initThreeScene(container: HTMLElement): CityEnvironment {
  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || window.innerHeight;

  // Scene setup
  const scene = new THREE.Scene();
  const skyColor = new THREE.Color(0x0a192f); // Deep futuristic midnight teal
  scene.background = skyColor;
  scene.fog = new THREE.FogExp2(0x0a192f, 0.012);

  // Camera setup - 3rd person chase camera angled down onto track
  const camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 350);
  camera.position.set(0, 3.8, 6.2);
  camera.lookAt(0, 1.4, -6.0);

  // WebGL Renderer
  const renderer = new THREE.WebGLRenderer({
    antialias: !isSoftwareGl,
    powerPreference: 'high-performance',
    alpha: false,
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.shadowMap.enabled = !isSoftwareGl;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  container.appendChild(renderer.domElement);

  // Studio Environment Reflection via RoomEnvironment
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
  pmremGenerator.dispose();

  // Balanced Lighting Rig (Warm Key + Cool Sky Hemisphere Fill)
  const ambientLight = new THREE.HemisphereLight(0x38bdf8, 0x064e3b, 1.1);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(0xfffbeb, 1.6);
  sunLight.position.set(15, 25, 10);
  if (!isSoftwareGl) {
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 1;
    sunLight.shadow.camera.far = 120;
    sunLight.shadow.camera.left = -16;
    sunLight.shadow.camera.right = 16;
    sunLight.shadow.camera.top = 20;
    sunLight.shadow.camera.bottom = -10;
    sunLight.shadow.bias = -0.0005;
    sunLight.shadow.normalBias = 0.02;
  }
  scene.add(sunLight);

  // Reusable Materials for Track & City
  const roadMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a, // Dark asphalt
    roughness: 0.65,
    metalness: 0.2,
  });

  const curbMat = new THREE.MeshStandardMaterial({
    color: 0x10b981, // Emerald neon curb
    emissive: 0x059669,
    emissiveIntensity: 0.4,
    roughness: 0.4,
  });

  const dividerMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8, // Cyan neon lane lines
    emissive: 0x0284c7,
    emissiveIntensity: 0.9,
    roughness: 0.2,
  });

  const sidewalkMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.7,
    metalness: 0.1,
  });

  const buildingMat = new THREE.MeshStandardMaterial({
    color: 0x090d16,
    roughness: 0.35,
    metalness: 0.7,
  });

  const glassWindowMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x0369a1,
    emissiveIntensity: 0.5,
    roughness: 0.1,
    metalness: 0.9,
  });

  const solarPanelMat = new THREE.MeshStandardMaterial({
    color: 0x1d4ed8,
    emissive: 0x1e40af,
    emissiveIntensity: 0.6,
    roughness: 0.2,
    metalness: 0.8,
  });

  const foliageMat = new THREE.MeshStandardMaterial({
    color: 0x10b981,
    roughness: 0.8,
    metalness: 0.05,
  });

  const trunkMat = new THREE.MeshStandardMaterial({
    color: 0x475569,
    roughness: 0.9,
  });

  // Function to create one modular city segment
  function createSegment(segZ: number): THREE.Group {
    const seg = new THREE.Group();
    seg.position.z = segZ;

    // 1. Road surface
    const roadGeo = new THREE.PlaneGeometry(TRACK_WIDTH, SEGMENT_LENGTH);
    roadGeo.rotateX(-Math.PI / 2);
    const roadMesh = new THREE.Mesh(roadGeo, roadMat);
    roadMesh.receiveShadow = true;
    seg.add(roadMesh);

    // 2. Glowing Lane Dividers (at X = -1.2 and X = 1.2)
    const dividerGeo = new THREE.PlaneGeometry(0.12, SEGMENT_LENGTH);
    dividerGeo.rotateX(-Math.PI / 2);

    const leftDivider = new THREE.Mesh(dividerGeo, dividerMat);
    leftDivider.position.set(-1.2, 0.015, 0);
    seg.add(leftDivider);

    const rightDivider = new THREE.Mesh(dividerGeo, dividerMat);
    rightDivider.position.set(1.2, 0.015, 0);
    seg.add(rightDivider);

    // 3. Side Curbs
    const curbGeo = new THREE.BoxGeometry(0.3, 0.25, SEGMENT_LENGTH);
    const leftCurb = new THREE.Mesh(curbGeo, curbMat);
    leftCurb.position.set(-TRACK_WIDTH / 2 - 0.15, 0.12, 0);
    leftCurb.receiveShadow = true;
    seg.add(leftCurb);

    const rightCurb = new THREE.Mesh(curbGeo, curbMat);
    rightCurb.position.set(TRACK_WIDTH / 2 + 0.15, 0.12, 0);
    rightCurb.receiveShadow = true;
    seg.add(rightCurb);

    // 4. Sidewalks
    const swGeo = new THREE.BoxGeometry(6.0, 0.2, SEGMENT_LENGTH);
    const leftSw = new THREE.Mesh(swGeo, sidewalkMat);
    leftSw.position.set(-TRACK_WIDTH / 2 - 3.3, 0.1, 0);
    leftSw.receiveShadow = true;
    seg.add(leftSw);

    const rightSw = new THREE.Mesh(swGeo, sidewalkMat);
    rightSw.position.set(TRACK_WIDTH / 2 + 3.3, 0.1, 0);
    rightSw.receiveShadow = true;
    seg.add(rightSw);

    // 5. Buildings along left and right sides
    const buildingHeights = [18, 28, 22, 35, 15, 26];
    for (let i = 0; i < 3; i++) {
      const zOffset = (i - 1) * 13;

      // Left building
      const hLeft = buildingHeights[(i * 2) % buildingHeights.length];
      const bLeftGeo = new THREE.BoxGeometry(7, hLeft, 11);
      const bLeft = new THREE.Mesh(bLeftGeo, buildingMat);
      bLeft.position.set(-11, hLeft / 2, zOffset);
      bLeft.castShadow = true;
      bLeft.receiveShadow = true;
      seg.add(bLeft);

      // Window grid strip on building
      const winGeo = new THREE.BoxGeometry(0.1, hLeft * 0.7, 9);
      const winMeshLeft = new THREE.Mesh(winGeo, glassWindowMat);
      winMeshLeft.position.set(-7.45, hLeft / 2, zOffset);
      seg.add(winMeshLeft);

      // Solar rooftop array
      const solarGeo = new THREE.BoxGeometry(5.5, 0.4, 8);
      const solarMeshLeft = new THREE.Mesh(solarGeo, solarPanelMat);
      solarMeshLeft.position.set(-11, hLeft + 0.2, zOffset);
      seg.add(solarMeshLeft);

      // Right building
      const hRight = buildingHeights[(i * 2 + 1) % buildingHeights.length];
      const bRightGeo = new THREE.BoxGeometry(7, hRight, 11);
      const bRight = new THREE.Mesh(bRightGeo, buildingMat);
      bRight.position.set(11, hRight / 2, zOffset);
      bRight.castShadow = true;
      bRight.receiveShadow = true;
      seg.add(bRight);

      const winMeshRight = new THREE.Mesh(winGeo, glassWindowMat);
      winMeshRight.position.set(7.45, hRight / 2, zOffset);
      seg.add(winMeshRight);

      const solarMeshRight = new THREE.Mesh(solarGeo, solarPanelMat);
      solarMeshRight.position.set(11, hRight + 0.2, zOffset);
      seg.add(solarMeshRight);
    }

    // 6. Cyber Trees / Vertical Planters along the curb
    for (let k = 0; k < 2; k++) {
      const zTree = (k - 0.5) * 18;
      // Left tree
      const treeGroupLeft = new THREE.Group();
      treeGroupLeft.position.set(-4.8, 0.2, zTree);

      const trunkGeo = new THREE.CylinderGeometry(0.15, 0.2, 1.4, 6);
      trunkGeo.translate(0, 0.7, 0);
      const trunkLeft = new THREE.Mesh(trunkGeo, trunkMat);
      treeGroupLeft.add(trunkLeft);

      const foliageGeo = new THREE.DodecahedronGeometry(0.85);
      const foliageLeft = new THREE.Mesh(foliageGeo, foliageMat);
      foliageLeft.position.y = 1.9;
      foliageLeft.castShadow = true;
      treeGroupLeft.add(foliageLeft);
      seg.add(treeGroupLeft);

      // Right tree
      const treeGroupRight = new THREE.Group();
      treeGroupRight.position.set(4.8, 0.2, zTree);

      const trunkRight = new THREE.Mesh(trunkGeo, trunkMat);
      treeGroupRight.add(trunkRight);

      const foliageRight = new THREE.Mesh(foliageGeo, foliageMat);
      foliageRight.position.y = 1.9;
      foliageRight.castShadow = true;
      treeGroupRight.add(foliageRight);
      seg.add(treeGroupRight);
    }

    // 7. Futuristic Streetlight arches
    const lampArchGeo = new THREE.TorusGeometry(5.2, 0.12, 6, 16, Math.PI);
    const lampArchMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.8,
      roughness: 0.2,
    });
    const arch = new THREE.Mesh(lampArchGeo, lampArchMat);
    arch.position.set(0, 0, 0);
    arch.rotation.z = 0;
    seg.add(arch);

    // Lamp center glowing eco beacon
    const beaconGeo = new THREE.SphereGeometry(0.25, 8, 8);
    const beaconMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x10b981,
      emissiveIntensity: 1.5,
    });
    const beacon = new THREE.Mesh(beaconGeo, beaconMat);
    beacon.position.set(0, 5.2, 0);
    seg.add(beacon);

    return seg;
  }

  // Create initial pool of segments
  const segments: THREE.Group[] = [];
  for (let s = 0; s < NUM_SEGMENTS; s++) {
    const segZ = -s * SEGMENT_LENGTH;
    const seg = createSegment(segZ);
    scene.add(seg);
    segments.push(seg);
  }

  // --- Overhead Elevated Metro Monorail Track & Train ---
  const metroTrack = new THREE.Group();
  metroTrack.position.set(0, 7.5, 0);

  const trackGirderGeo = new THREE.BoxGeometry(2.2, 0.45, 300);
  const trackMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.4,
    metalness: 0.8,
  });
  const girder = new THREE.Mesh(trackGirderGeo, trackMat);
  metroTrack.add(girder);

  // Monorail center magnetic rail
  const magRailGeo = new THREE.BoxGeometry(0.4, 0.18, 300);
  const magMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x0284c7,
    emissiveIntensity: 1.2,
  });
  const magRail = new THREE.Mesh(magRailGeo, magMat);
  magRail.position.y = 0.28;
  metroTrack.add(magRail);

  scene.add(metroTrack);

  // Sleek Aerodynamic Futuristic Metro Train
  const metroTrain = new THREE.Group();
  metroTrain.position.set(0, 8.4, -40);

  const trainBodyGeo = new THREE.BoxGeometry(2.0, 1.4, 18);
  const trainBodyMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.2,
    metalness: 0.85,
  });
  const trainBody = new THREE.Mesh(trainBodyGeo, trainBodyMat);
  metroTrain.add(trainBody);

  // Train aerodynamic nose cone
  const noseGeo = new THREE.ConeGeometry(1.2, 2.5, 4);
  noseGeo.rotateX(-Math.PI / 2);
  const noseMesh = new THREE.Mesh(noseGeo, trainBodyMat);
  noseMesh.position.set(0, 0, -9.8);
  metroTrain.add(noseMesh);

  // Train continuous cyan glass passenger strip
  const trainWinGeo = new THREE.BoxGeometry(2.05, 0.45, 16);
  const trainWin = new THREE.Mesh(trainWinGeo, glassWindowMat);
  trainWin.position.set(0, 0.2, 0);
  metroTrain.add(trainWin);

  scene.add(metroTrain);

  // Scenery update method (recycles segments forward as player moves along -Z)
  const updateScenery = (playerZ: number, restorationLevel: number, delta: number) => {
    // 1. Sliding window check for segments
    segments.forEach((seg) => {
      // If segment is far behind the player camera (playerZ is decreasing negative)
      if (seg.position.z > playerZ + 25) {
        // Find most distant segment
        let minZ = 0;
        segments.forEach((s) => {
          if (s.position.z < minZ) minZ = s.position.z;
        });
        seg.position.z = minZ - SEGMENT_LENGTH;
      }
    });

    // 2. Metro monorail track follows player
    metroTrack.position.z = playerZ - 60;

    // 3. Animate futuristic metro train zooming ahead
    metroTrain.position.z -= 45 * delta;
    if (metroTrain.position.z < playerZ - 200) {
      metroTrain.position.z = playerZ + 120; // reset far behind to zip past again!
    }

    // 4. City Environmental Restoration Visuals
    // Shift fog and lighting based on restoration level (1 = Smoggy to 5 = Pristine Bio-City)
    const factor = Math.min(5, Math.max(1, restorationLevel)) / 5; // 0.2 to 1.0
    
    // Smoggy dark slate -> Crisp vibrant teal-emerald eco atmosphere
    const r = THREE.MathUtils.lerp(0.08, 0.02, factor);
    const g = THREE.MathUtils.lerp(0.09, 0.16, factor);
    const b = THREE.MathUtils.lerp(0.12, 0.24, factor);
    skyColor.setRGB(r, g, b);
    scene.background = skyColor;
    if (scene.fog) {
      (scene.fog as THREE.FogExp2).color.setRGB(r, g, b);
      (scene.fog as THREE.FogExp2).density = THREE.MathUtils.lerp(0.016, 0.007, factor);
    }

    sunLight.intensity = THREE.MathUtils.lerp(1.2, 1.85, factor);
    ambientLight.intensity = THREE.MathUtils.lerp(0.8, 1.35, factor);
  };

  const dispose = () => {
    renderer.dispose();
    if (renderer.domElement && renderer.domElement.parentNode) {
      renderer.domElement.parentNode.removeChild(renderer.domElement);
    }
  };

  return {
    scene,
    camera,
    renderer,
    ambientLight,
    sunLight,
    segments,
    metroTrain,
    metroTrack,
    updateScenery,
    dispose,
  };
}
