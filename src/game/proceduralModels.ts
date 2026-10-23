/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { CharacterConfig, CharacterSkin, PowerUpType, SyllabusGateChoice } from '../types/game';

// Shared materials and geometries for optimal draw-call reuse & zero memory leaks
const pbrRoughPlastic = new THREE.MeshStandardMaterial({
  color: 0x1e293b,
  roughness: 0.8,
  metalness: 0.1,
});

const pbrDarkMetal = new THREE.MeshStandardMaterial({
  color: 0x0f172a,
  roughness: 0.35,
  metalness: 0.85,
});

const pbrSilverMetal = new THREE.MeshStandardMaterial({
  color: 0x94a3b8,
  roughness: 0.25,
  metalness: 0.9,
});

const pbrGoldMetal = new THREE.MeshStandardMaterial({
  color: 0xf59e0b,
  roughness: 0.2,
  metalness: 0.9,
});

const pbrNeonGreen = new THREE.MeshStandardMaterial({
  color: 0x10b981,
  emissive: 0x059669,
  emissiveIntensity: 0.8,
  roughness: 0.3,
  metalness: 0.2,
});

const pbrNeonCyan = new THREE.MeshStandardMaterial({
  color: 0x06b6d4,
  emissive: 0x0891b2,
  emissiveIntensity: 0.9,
  roughness: 0.2,
  metalness: 0.1,
});

// Helper to create a procedural texture for hazard stripes
function createHazardTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(0, 0, 128, 128);
  
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  for (let i = -128; i < 256; i += 32) {
    ctx.moveTo(i, 0);
    ctx.lineTo(i + 32, 0);
    ctx.lineTo(i - 16, 128);
    ctx.lineTo(i - 48, 128);
  }
  ctx.fill();

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const hazardTexture = createHazardTexture();
const hazardMaterial = new THREE.MeshStandardMaterial({
  map: hazardTexture,
  roughness: 0.5,
  metalness: 0.3,
});

export interface CharacterRig {
  root: THREE.Group;
  torsoGroup: THREE.Group;
  headGroup: THREE.Group;
  leftArm: THREE.Group;
  rightArm: THREE.Group;
  leftLeg: THREE.Group;
  rightLeg: THREE.Group;
  backpack: THREE.Mesh;
  visorMesh: THREE.Mesh;
  glowAura?: THREE.Mesh;
  updateAnimation: (time: number, isJumping: boolean, isSliding: boolean, speedMultiplier: number) => void;
}

/**
 * Creates a composite 9-part procedural articulated character model with running kinematics
 */
export function createCharacterModel(config: CharacterConfig, skin?: CharacterSkin): CharacterRig {
  const root = new THREE.Group();

  const suitColor = new THREE.Color(skin?.palette.suit || config.primaryColor);
  const trimColor = new THREE.Color(skin?.palette.trim || '#1e293b');
  const visorColor = new THREE.Color(skin?.palette.visor || config.accentColor);

  const suitMat = new THREE.MeshStandardMaterial({
    color: suitColor,
    roughness: 0.45,
    metalness: 0.35,
  });

  const trimMat = new THREE.MeshStandardMaterial({
    color: trimColor,
    roughness: 0.7,
    metalness: 0.2,
  });

  const visorMat = new THREE.MeshStandardMaterial({
    color: visorColor,
    emissive: visorColor,
    emissiveIntensity: 0.9,
    roughness: 0.1,
    metalness: 0.9,
  });

  const skinMat = new THREE.MeshStandardMaterial({
    color: 0xd4a373, // Natural warm tone
    roughness: 0.65,
    metalness: 0.05,
  });

  // 1. Torso Group
  const torsoGroup = new THREE.Group();
  torsoGroup.position.y = 0.95; // Hip height
  root.add(torsoGroup);

  // Main Torso Mesh
  const torsoGeo = new THREE.BoxGeometry(0.5, 0.6, 0.3);
  const torsoMesh = new THREE.Mesh(torsoGeo, suitMat);
  torsoMesh.castShadow = true;
  torsoGroup.add(torsoMesh);

  // Chest Solar Core (Accent)
  const coreGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.05, 12);
  coreGeo.rotateX(Math.PI / 2);
  const coreMat = new THREE.MeshStandardMaterial({
    color: config.accentColor,
    emissive: config.accentColor,
    emissiveIntensity: 1.2,
    roughness: 0.2,
  });
  const coreMesh = new THREE.Mesh(coreGeo, coreMat);
  coreMesh.position.set(0, 0.08, 0.16);
  torsoGroup.add(coreMesh);

  // Backpack / Battery Unit
  const packGeo = new THREE.BoxGeometry(0.36, 0.42, 0.18);
  const packMesh = new THREE.Mesh(packGeo, pbrDarkMetal);
  packMesh.position.set(0, 0.04, -0.22);
  packMesh.castShadow = true;
  torsoGroup.add(packMesh);

  // Backpack LED indicator
  const ledGeo = new THREE.BoxGeometry(0.24, 0.06, 0.02);
  const ledMesh = new THREE.Mesh(ledGeo, pbrNeonGreen);
  ledMesh.position.set(0, 0.12, -0.32);
  torsoGroup.add(ledMesh);

  // 2. Head Group
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 0.45, 0);
  torsoGroup.add(headGroup);

  const headGeo = new THREE.BoxGeometry(0.32, 0.32, 0.32);
  const headMesh = new THREE.Mesh(headGeo, skinMat);
  headMesh.castShadow = true;
  headGroup.add(headMesh);

  // Helmet / Hair cap
  const hairGeo = new THREE.BoxGeometry(0.34, 0.18, 0.34);
  const hairMesh = new THREE.Mesh(hairGeo, trimMat);
  hairMesh.position.set(0, 0.12, -0.02);
  headGroup.add(hairMesh);

  // Visor
  const visorGeo = new THREE.BoxGeometry(0.34, 0.12, 0.12);
  const visorMesh = new THREE.Mesh(visorGeo, visorMat);
  visorMesh.position.set(0, 0.02, 0.14);
  headGroup.add(visorMesh);

  // 3. Arms (Pivots at shoulder)
  const armGeo = new THREE.BoxGeometry(0.14, 0.5, 0.14);
  armGeo.translate(0, -0.22, 0); // Pivot at top

  const leftArm = new THREE.Group();
  leftArm.position.set(-0.35, 0.22, 0);
  const leftArmMesh = new THREE.Mesh(armGeo, suitMat);
  leftArmMesh.castShadow = true;
  leftArm.add(leftArmMesh);
  torsoGroup.add(leftArm);

  const rightArm = new THREE.Group();
  rightArm.position.set(0.35, 0.22, 0);
  const rightArmMesh = new THREE.Mesh(armGeo, suitMat);
  rightArmMesh.castShadow = true;
  rightArm.add(rightArmMesh);
  torsoGroup.add(rightArm);

  // 4. Legs (Pivots at hip)
  const legGeo = new THREE.BoxGeometry(0.16, 0.55, 0.16);
  legGeo.translate(0, -0.25, 0); // Pivot at top

  const shoeGeo = new THREE.BoxGeometry(0.18, 0.12, 0.28);
  shoeGeo.translate(0, -0.5, 0.06);

  // Left Leg
  const leftLeg = new THREE.Group();
  leftLeg.position.set(-0.16, -0.28, 0);
  const leftLegMesh = new THREE.Mesh(legGeo, trimMat);
  leftLegMesh.castShadow = true;
  leftLeg.add(leftLegMesh);

  const leftShoe = new THREE.Mesh(shoeGeo, visorMat);
  leftShoe.castShadow = true;
  leftLeg.add(leftShoe);
  root.add(leftLeg);

  // Right Leg
  const rightLeg = new THREE.Group();
  rightLeg.position.set(0.16, -0.28, 0);
  const rightLegMesh = new THREE.Mesh(legGeo, trimMat);
  rightLegMesh.castShadow = true;
  rightLeg.add(rightLegMesh);

  const rightShoe = new THREE.Mesh(shoeGeo, visorMat);
  rightShoe.castShadow = true;
  rightLeg.add(rightShoe);
  root.add(rightLeg);

  // Subtle Contact Shadow Plane under feet
  const shadowGeo = new THREE.PlaneGeometry(0.9, 0.9);
  shadowGeo.rotateX(-Math.PI / 2);
  const shadowMat = new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.45,
    depthWrite: false,
  });
  const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
  shadowMesh.position.y = 0.02;
  root.add(shadowMesh);

  // Animation method
  const updateAnimation = (time: number, isJumping: boolean, isSliding: boolean, speedMultiplier: number) => {
    if (isSliding) {
      // Slide posture: torso crouches low, angles backward, legs extend forward
      torsoGroup.position.y = 0.45;
      torsoGroup.rotation.x = 0.55;
      torsoGroup.rotation.y = 0;
      headGroup.rotation.x = -0.4;
      leftArm.rotation.x = -0.8;
      rightArm.rotation.x = -0.8;
      leftLeg.position.y = 0.25;
      rightLeg.position.y = 0.25;
      leftLeg.rotation.x = -1.2;
      rightLeg.rotation.x = -1.1;
      leftLeg.rotation.z = -0.15;
      rightLeg.rotation.z = 0.15;
    } else if (isJumping) {
      // Jump posture: tuck legs, arms raised
      torsoGroup.position.y = 0.95;
      torsoGroup.rotation.x = -0.1;
      torsoGroup.rotation.y = 0;
      headGroup.rotation.x = 0.1;
      leftArm.rotation.x = -1.6;
      rightArm.rotation.x = -1.4;
      leftLeg.position.y = 0.7;
      rightLeg.position.y = 0.7;
      leftLeg.rotation.x = 0.8;
      rightLeg.rotation.x = 0.9;
      leftLeg.rotation.z = 0;
      rightLeg.rotation.z = 0;
    } else {
      // Normal running cycle
      const runFreq = 14 * speedMultiplier;
      const angle = Math.sin(time * runFreq);

      // Body bobbing
      torsoGroup.position.y = 0.95 + Math.abs(Math.sin(time * runFreq)) * 0.08;
      torsoGroup.rotation.x = 0.15; // Leaning forward slightly into sprint
      torsoGroup.rotation.y = Math.sin(time * runFreq) * 0.08; // Natural hip twist
      headGroup.rotation.x = -0.1;

      // Arm swing (opposite of legs)
      leftArm.rotation.x = -angle * 0.9;
      rightArm.rotation.x = angle * 0.9;
      leftArm.rotation.z = 0.15;
      rightArm.rotation.z = -0.15;

      // Leg swing
      leftLeg.position.y = 0.7;
      rightLeg.position.y = 0.7;
      leftLeg.rotation.x = angle * 1.1;
      rightLeg.rotation.x = -angle * 1.1;
      leftLeg.rotation.z = 0;
      rightLeg.rotation.z = 0;
    }
  };

  return {
    root,
    torsoGroup,
    headGroup,
    leftArm,
    rightArm,
    leftLeg,
    rightLeg,
    backpack: packMesh,
    visorMesh,
    updateAnimation,
  };
}

// --- Obstacle Builders ---

/**
 * Road barrier (Jump over or change lane) - height ~0.75m
 */
export function createRoadBarrier(): THREE.Group {
  const group = new THREE.Group();

  // Dual upright posts
  const postGeo = new THREE.BoxGeometry(0.14, 0.75, 0.14);
  const leftPost = new THREE.Mesh(postGeo, pbrDarkMetal);
  leftPost.position.set(-0.85, 0.375, 0);
  leftPost.castShadow = true;
  group.add(leftPost);

  const rightPost = new THREE.Mesh(postGeo, pbrDarkMetal);
  rightPost.position.set(0.85, 0.375, 0);
  rightPost.castShadow = true;
  group.add(rightPost);

  // Horizontal striped bar
  const barGeo = new THREE.BoxGeometry(1.85, 0.28, 0.12);
  const barMesh = new THREE.Mesh(barGeo, hazardMaterial);
  barMesh.position.set(0, 0.55, 0);
  barMesh.castShadow = true;
  group.add(barMesh);

  // Flashing amber caution lights on top
  const lightGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.1, 10);
  const lightMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    emissive: 0xd97706,
    emissiveIntensity: 1.5,
  });
  const leftLight = new THREE.Mesh(lightGeo, lightMat);
  leftLight.position.set(-0.85, 0.8, 0);
  group.add(leftLight);

  const rightLight = new THREE.Mesh(lightGeo, lightMat);
  rightLight.position.set(0.85, 0.8, 0);
  group.add(rightLight);

  return group;
}

/**
 * Overhead energy pipe / gantry (Slide under or switch lane) - bottom clearance ~1.25m
 */
export function createOverheadPipe(): THREE.Group {
  const group = new THREE.Group();

  // Tall side pillars
  const pillarGeo = new THREE.BoxGeometry(0.16, 3.2, 0.16);
  const leftPillar = new THREE.Mesh(pillarGeo, pbrDarkMetal);
  leftPillar.position.set(-0.95, 1.6, 0);
  leftPillar.castShadow = true;
  group.add(leftPillar);

  const rightPillar = new THREE.Mesh(pillarGeo, pbrDarkMetal);
  rightPillar.position.set(0.95, 1.6, 0);
  rightPillar.castShadow = true;
  group.add(rightPillar);

  // Horizontal heavy cyber pipe
  const pipeGeo = new THREE.CylinderGeometry(0.24, 0.24, 2.05, 12);
  pipeGeo.rotateZ(Math.PI / 2);
  const pipeMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.3,
    metalness: 0.8,
  });
  const pipeMesh = new THREE.Mesh(pipeGeo, pipeMat);
  pipeMesh.position.set(0, 1.7, 0);
  pipeMesh.castShadow = true;
  group.add(pipeMesh);

  // Neon glowing lower energy conduit beam (requires sliding!)
  const neonBarGeo = new THREE.BoxGeometry(1.9, 0.16, 0.1);
  const neonMat = new THREE.MeshStandardMaterial({
    color: 0xef4444, // Warning red-orange
    emissive: 0xdc2626,
    emissiveIntensity: 1.4,
  });
  const neonMesh = new THREE.Mesh(neonBarGeo, neonMat);
  neonMesh.position.set(0, 1.35, 0);
  group.add(neonMesh);

  // Overhead holographic arrow pointing DOWN
  const arrowGeo = new THREE.ConeGeometry(0.18, 0.3, 4);
  arrowGeo.rotateZ(Math.PI);
  const arrowMesh = new THREE.Mesh(arrowGeo, pbrNeonCyan);
  arrowMesh.position.set(0, 2.2, 0);
  group.add(arrowMesh);

  return group;
}

/**
 * Autonomous Hover Eco-Vehicle (Tall obstacle, switch lane)
 */
export function createHoverVehicle(): THREE.Group {
  const group = new THREE.Group();

  // Vehicle main chassis
  const bodyGeo = new THREE.BoxGeometry(1.6, 1.1, 2.8);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0x1e3a8a, // Deep cyber blue
    roughness: 0.3,
    metalness: 0.7,
  });
  const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
  bodyMesh.position.set(0, 0.85, 0);
  bodyMesh.castShadow = true;
  group.add(bodyMesh);

  // Cabin / Windshield
  const cabinGeo = new THREE.BoxGeometry(1.4, 0.75, 1.6);
  const cabinMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    roughness: 0.1,
    metalness: 0.9,
    transparent: true,
    opacity: 0.85,
  });
  const cabinMesh = new THREE.Mesh(cabinGeo, cabinMat);
  cabinMesh.position.set(0, 1.5, -0.2);
  cabinMesh.castShadow = true;
  group.add(cabinMesh);

  // Front glowing LED light strip
  const lightStripGeo = new THREE.BoxGeometry(1.3, 0.1, 0.1);
  const lightStripMesh = new THREE.Mesh(lightStripGeo, pbrNeonCyan);
  lightStripMesh.position.set(0, 0.85, 1.42);
  group.add(lightStripMesh);

  // Rear red light strip
  const rearStripGeo = new THREE.BoxGeometry(1.3, 0.1, 0.1);
  const redMat = new THREE.MeshStandardMaterial({
    color: 0xef4444,
    emissive: 0xb91c1c,
    emissiveIntensity: 1.5,
  });
  const rearStripMesh = new THREE.Mesh(rearStripGeo, redMat);
  rearStripMesh.position.set(0, 0.85, -1.42);
  group.add(rearStripMesh);

  // Hover Repulsor Discs underneath (4 corners)
  const repulsorGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.1, 10);
  const repulsorMat = new THREE.MeshStandardMaterial({
    color: 0x06b6d4,
    emissive: 0x0891b2,
    emissiveIntensity: 1.2,
  });
  const offsets = [
    [-0.6, 0.25, 0.9],
    [0.6, 0.25, 0.9],
    [-0.6, 0.25, -0.9],
    [0.6, 0.25, -0.9],
  ];
  offsets.forEach(([x, y, z]) => {
    const r = new THREE.Mesh(repulsorGeo, repulsorMat);
    r.position.set(x, y, z);
    group.add(r);
  });

  return group;
}

/**
 * Holo Construction Block (Switch lane)
 */
export function createConstructionBlock(): THREE.Group {
  const group = new THREE.Group();

  const blockGeo = new THREE.BoxGeometry(1.6, 1.4, 0.8);
  const blockMesh = new THREE.Mesh(blockGeo, hazardMaterial);
  blockMesh.position.set(0, 0.7, 0);
  blockMesh.castShadow = true;
  group.add(blockMesh);

  // Top flashing hazard cone
  const coneGeo = new THREE.ConeGeometry(0.22, 0.55, 12);
  const coneMat = new THREE.MeshStandardMaterial({
    color: 0xf97316,
    roughness: 0.3,
  });
  const coneMesh = new THREE.Mesh(coneGeo, coneMat);
  coneMesh.position.set(0, 1.65, 0);
  group.add(coneMesh);

  return group;
}

/**
 * Pollution Smog Cloud (Avoid lane)
 */
export function createPollutionCloud(): THREE.Group {
  const group = new THREE.Group();

  const cloudMat = new THREE.MeshStandardMaterial({
    color: 0x475569,
    emissive: 0x334155,
    emissiveIntensity: 0.4,
    roughness: 0.9,
    transparent: true,
    opacity: 0.85,
  });

  // Multiple overlapping spheres forming a billowing toxic smog mass
  const sphereGeo = new THREE.SphereGeometry(0.55, 8, 8);
  const spherePositions = [
    [0, 0.7, 0],
    [-0.35, 0.9, 0.2],
    [0.35, 0.85, -0.2],
    [0, 1.25, 0],
    [-0.2, 1.4, -0.15],
  ];

  spherePositions.forEach(([x, y, z]) => {
    const sphere = new THREE.Mesh(sphereGeo, cloudMat);
    sphere.position.set(x, y, z);
    group.add(sphere);
  });

  // Warning biohazard toxic indicator
  const warningGeo = new THREE.TorusGeometry(0.45, 0.05, 8, 16);
  warningGeo.rotateX(Math.PI / 2);
  const warningMat = new THREE.MeshStandardMaterial({
    color: 0xa855f7, // Toxic purple
    emissive: 0x9333ea,
    emissiveIntensity: 1.2,
  });
  const warningMesh = new THREE.Mesh(warningGeo, warningMat);
  warningMesh.position.set(0, 0.1, 0);
  group.add(warningMesh);

  return group;
}

/**
 * E-Waste Scrap Pile (Jump over or switch lane)
 */
export function createEWastePile(): THREE.Group {
  const group = new THREE.Group();

  // Base metal scrap mound
  const moundGeo = new THREE.BoxGeometry(1.6, 0.5, 1.4);
  const scrapMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.7,
    metalness: 0.8,
  });
  const mound = new THREE.Mesh(moundGeo, scrapMat);
  mound.position.set(0, 0.25, 0);
  mound.castShadow = true;
  group.add(mound);

  // Protruding circuit boards and server fan units
  const boardGeo = new THREE.BoxGeometry(0.7, 0.04, 0.5);
  const boardMat = new THREE.MeshStandardMaterial({
    color: 0x15803d, // PCB Green
    roughness: 0.4,
    metalness: 0.4,
  });
  const board1 = new THREE.Mesh(boardGeo, boardMat);
  board1.position.set(-0.25, 0.55, 0.1);
  board1.rotation.set(0.2, 0.3, 0.15);
  group.add(board1);

  // Server fan cylinder
  const fanGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.15, 12);
  fanGeo.rotateX(Math.PI / 3);
  const fanMesh = new THREE.Mesh(fanGeo, pbrDarkMetal);
  fanMesh.position.set(0.35, 0.5, -0.2);
  group.add(fanMesh);

  return group;
}

/**
 * Moving Maintenance Drone
 */
export function createMaintenanceDrone(): THREE.Group {
  const group = new THREE.Group();

  // Central chassis
  const chassisGeo = new THREE.SphereGeometry(0.35, 12, 12);
  const droneChassis = new THREE.Mesh(chassisGeo, pbrSilverMetal);
  droneChassis.position.set(0, 1.4, 0);
  group.add(droneChassis);

  // Glowing scanner eye
  const eyeGeo = new THREE.SphereGeometry(0.12, 8, 8);
  const eyeMesh = new THREE.Mesh(eyeGeo, pbrNeonCyan);
  eyeMesh.position.set(0, 1.4, 0.3);
  group.add(eyeMesh);

  // Dual side thrusters
  const thrusterGeo = new THREE.CylinderGeometry(0.12, 0.14, 0.3, 8);
  const leftThruster = new THREE.Mesh(thrusterGeo, pbrDarkMetal);
  leftThruster.position.set(-0.55, 1.4, 0);
  group.add(leftThruster);

  const rightThruster = new THREE.Mesh(thrusterGeo, pbrDarkMetal);
  rightThruster.position.set(0.55, 1.4, 0);
  group.add(rightThruster);

  return group;
}

// --- Collectible Builders ---

/**
 * Green Energy Orb (Standard currency & score bonus)
 */
export function createEnergyOrb(): THREE.Group {
  const group = new THREE.Group();

  // Core glowing emerald sphere
  const coreGeo = new THREE.SphereGeometry(0.26, 16, 16);
  const coreMesh = new THREE.Mesh(coreGeo, pbrNeonGreen);
  group.add(coreMesh);

  // Outer orbital ring
  const ringGeo = new THREE.TorusGeometry(0.42, 0.04, 8, 24);
  const ringMat = new THREE.MeshStandardMaterial({
    color: 0x34d399,
    emissive: 0x059669,
    emissiveIntensity: 0.6,
    metalness: 0.7,
    roughness: 0.2,
  });
  const ringMesh = new THREE.Mesh(ringGeo, ringMat);
  ringMesh.rotation.x = Math.PI / 4;
  group.add(ringMesh);

  group.position.y = 1.0;
  return group;
}

/**
 * Recycling Token (Golden hexagonal coin)
 */
export function createRecyclingToken(): THREE.Group {
  const group = new THREE.Group();

  // Hexagonal cylinder
  const coinGeo = new THREE.CylinderGeometry(0.36, 0.36, 0.1, 6);
  coinGeo.rotateX(Math.PI / 2);
  const coinMesh = new THREE.Mesh(coinGeo, pbrGoldMetal);
  group.add(coinMesh);

  // Center mobius loop / triangle accent
  const innerGeo = new THREE.TorusGeometry(0.18, 0.04, 6, 3);
  const innerMat = new THREE.MeshStandardMaterial({
    color: 0xfef08a,
    emissive: 0xd97706,
    emissiveIntensity: 0.8,
  });
  const innerMesh = new THREE.Mesh(innerGeo, innerMat);
  group.add(innerMesh);

  group.position.y = 1.0;
  return group;
}

/**
 * Rare Eco Crystal (Octahedron prismatic diamond)
 */
export function createEcoCrystal(): THREE.Group {
  const group = new THREE.Group();

  const crystalGeo = new THREE.OctahedronGeometry(0.4, 0);
  const crystalMat = new THREE.MeshPhysicalMaterial({
    color: 0x22d3ee,
    emissive: 0x0891b2,
    emissiveIntensity: 0.7,
    roughness: 0.1,
    metalness: 0.1,
    transmission: 0.7,
    ior: 1.6,
    transparent: true,
    opacity: 0.9,
  });
  const crystalMesh = new THREE.Mesh(crystalGeo, crystalMat);
  group.add(crystalMesh);

  // Inner floating core
  const innerCoreGeo = new THREE.OctahedronGeometry(0.2, 0);
  const innerCoreMesh = new THREE.Mesh(innerCoreGeo, pbrNeonGreen);
  group.add(innerCoreMesh);

  group.position.y = 1.1;
  return group;
}

/**
 * Knowledge Fragment (Holographic Data Cube with BCA Leaf Icon)
 */
export function createKnowledgeFragment(): THREE.Group {
  const group = new THREE.Group();

  // Hologram outer glass cube
  const cubeGeo = new THREE.BoxGeometry(0.55, 0.55, 0.55);
  const cubeMat = new THREE.MeshPhysicalMaterial({
    color: 0xa855f7, // Royal Purple / Cyan
    emissive: 0x7e22ce,
    emissiveIntensity: 0.8,
    roughness: 0.1,
    metalness: 0.3,
    transmission: 0.6,
    transparent: true,
    opacity: 0.85,
  });
  const cubeMesh = new THREE.Mesh(cubeGeo, cubeMat);
  group.add(cubeMesh);

  // Internal glowing knowledge sphere
  const innerGeo = new THREE.SphereGeometry(0.18, 12, 12);
  const innerMat = new THREE.MeshStandardMaterial({
    color: 0xf0abfc,
    emissive: 0xd946ef,
    emissiveIntensity: 1.4,
  });
  const innerMesh = new THREE.Mesh(innerGeo, innerMat);
  group.add(innerMesh);

  group.position.y = 1.1;
  return group;
}

/**
 * Power-Up World Pickups (Shield, Magnet, Super Jump, Solar Boost)
 */
export function createPowerUpPickup(type: PowerUpType): THREE.Group {
  const group = new THREE.Group();

  // Outer floating capsule
  const capsuleGeo = new THREE.CapsuleGeometry(0.25, 0.4, 8, 16);
  let color = 0x10b981;
  let emissive = 0x059669;

  if (type === 'shield') {
    color = 0x06b6d4; // Cyan
    emissive = 0x0284c7;
  } else if (type === 'magnet') {
    color = 0xf43f5e; // Rose / Red
    emissive = 0xe11d48;
  } else if (type === 'super_jump') {
    color = 0xa855f7; // Purple
    emissive = 0x7e22ce;
  } else if (type === 'solar_boost') {
    color = 0xf59e0b; // Gold
    emissive = 0xd97706;
  }

  const capsuleMat = new THREE.MeshPhysicalMaterial({
    color,
    emissive,
    emissiveIntensity: 0.9,
    roughness: 0.2,
    metalness: 0.3,
    transmission: 0.5,
    transparent: true,
    opacity: 0.9,
  });
  const capsuleMesh = new THREE.Mesh(capsuleGeo, capsuleMat);
  group.add(capsuleMesh);

  // Symbolic interior icon
  if (type === 'shield') {
    // Shield ring
    const ringGeo = new THREE.TorusGeometry(0.28, 0.05, 8, 16);
    const ringMesh = new THREE.Mesh(ringGeo, pbrSilverMetal);
    group.add(ringMesh);
  } else if (type === 'magnet') {
    // Horseshoe shape approximation
    const magnetGeo = new THREE.TorusGeometry(0.22, 0.06, 8, 12, Math.PI);
    const magnetMesh = new THREE.Mesh(magnetGeo, pbrDarkMetal);
    magnetMesh.rotation.z = Math.PI;
    group.add(magnetMesh);
  } else if (type === 'super_jump') {
    // Winged chevron
    const wingGeo = new THREE.ConeGeometry(0.18, 0.35, 4);
    const wingMesh = new THREE.Mesh(wingGeo, pbrGoldMetal);
    group.add(wingMesh);
  } else if (type === 'solar_boost') {
    // Mini sun gear
    const sunGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.08, 8);
    const sunMesh = new THREE.Mesh(sunGeo, pbrGoldMetal);
    group.add(sunMesh);
  }

  group.position.y = 1.1;
  return group;
}

/**
 * Creates the protective Eco Shield dome around the character
 */
export function createShieldDome(): THREE.Mesh {
  const geo = new THREE.SphereGeometry(1.2, 24, 24);
  const mat = new THREE.MeshPhysicalMaterial({
    color: 0x34d399,
    emissive: 0x10b981,
    emissiveIntensity: 0.6,
    roughness: 0.1,
    metalness: 0.2,
    transmission: 0.85,
    transparent: true,
    opacity: 0.65,
    depthWrite: false,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.y = 0.9;
  return mesh;
}

/**
 * Creates a procedural high-resolution CanvasTexture for holographic gate text
 */
function createGateTextTexture(title: string, subtitle: string, themeColor: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 160;
  const ctx = canvas.getContext('2d')!;

  // Background
  ctx.fillStyle = '#090d16';
  ctx.fillRect(0, 0, 512, 160);

  // Neon glowing border
  ctx.strokeStyle = themeColor;
  ctx.lineWidth = 6;
  ctx.strokeRect(6, 6, 500, 148);

  // Header tag
  ctx.fillStyle = themeColor;
  ctx.font = 'bold 22px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(subtitle.toUpperCase(), 256, 42);

  // Main text
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 30px system-ui, sans-serif';
  ctx.fillText(title, 256, 96);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

/**
 * Creates an interactive 3D BCA Syllabus Holographic Code Gate
 */
export function createCodeGateMesh(choice: SyllabusGateChoice): THREE.Group {
  const group = new THREE.Group();

  // 1. Grand Arch Gantry Structure spanning all 3 lanes (Width: 8m, Height: 4.5m)
  const gantryGeo = new THREE.BoxGeometry(8.2, 0.4, 0.5);
  const gantryMesh = new THREE.Mesh(gantryGeo, pbrDarkMetal);
  gantryMesh.position.set(0, 4.2, 0);
  group.add(gantryMesh);

  // Left and Right outer support pillars
  const pillarGeo = new THREE.BoxGeometry(0.35, 4.4, 0.5);
  const leftPillar = new THREE.Mesh(pillarGeo, pbrDarkMetal);
  leftPillar.position.set(-3.9, 2.2, 0);
  group.add(leftPillar);

  const rightPillar = new THREE.Mesh(pillarGeo, pbrDarkMetal);
  rightPillar.position.set(3.9, 2.2, 0);
  group.add(rightPillar);

  // Center lane divider pillar (separating Left and Right choices)
  const centerPillarGeo = new THREE.BoxGeometry(0.4, 3.6, 0.4);
  const centerPillar = new THREE.Mesh(centerPillarGeo, pbrSilverMetal);
  centerPillar.position.set(0, 1.8, 0);
  group.add(centerPillar);

  // Center warning beacon
  const beaconGeo = new THREE.OctahedronGeometry(0.35);
  const beaconMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    emissive: 0xd97706,
    emissiveIntensity: 1.2,
  });
  const beacon = new THREE.Mesh(beaconGeo, beaconMat);
  beacon.position.set(0, 3.6, 0);
  group.add(beacon);

  // 2. Top Header Display: Syllabus Prompt
  const promptTex = createGateTextTexture(choice.prompt, `BCA SYLLABUS GATE: ${choice.topic}`, '#38bdf8');
  const promptMat = new THREE.MeshBasicMaterial({ map: promptTex, transparent: true });
  const promptGeo = new THREE.PlaneGeometry(6.2, 1.6);
  const promptBoard = new THREE.Mesh(promptGeo, promptMat);
  promptBoard.position.set(0, 5.2, 0.26);
  group.add(promptBoard);

  // 3. Left Lane Option Gate (at X = -2.4)
  const leftColor = choice.leftOption.isOptimal ? '#10b981' : '#f59e0b';
  const leftTex = createGateTextTexture(choice.leftOption.label, '[LEFT LANE A]', leftColor);
  const leftSignMat = new THREE.MeshBasicMaterial({ map: leftTex, transparent: true });
  const signGeo = new THREE.PlaneGeometry(2.6, 0.85);

  const leftSign = new THREE.Mesh(signGeo, leftSignMat);
  leftSign.position.set(-2.4, 3.2, 0.2);
  group.add(leftSign);

  // Left Holographic Energy Curtain
  const curtainGeo = new THREE.PlaneGeometry(2.1, 2.8);
  const leftCurtainMat = new THREE.MeshStandardMaterial({
    color: choice.leftOption.isOptimal ? 0x10b981 : 0xf59e0b,
    emissive: choice.leftOption.isOptimal ? 0x059669 : 0xb45309,
    emissiveIntensity: 0.6,
    transparent: true,
    opacity: 0.45,
    roughness: 0.2,
    metalness: 0.1,
  });
  const leftCurtain = new THREE.Mesh(curtainGeo, leftCurtainMat);
  leftCurtain.position.set(-2.4, 1.4, 0);
  group.add(leftCurtain);

  // 4. Right Lane Option Gate (at X = +2.4)
  const rightColor = choice.rightOption.isOptimal ? '#10b981' : '#f59e0b';
  const rightTex = createGateTextTexture(choice.rightOption.label, '[RIGHT LANE B]', rightColor);
  const rightSignMat = new THREE.MeshBasicMaterial({ map: rightTex, transparent: true });

  const rightSign = new THREE.Mesh(signGeo, rightSignMat);
  rightSign.position.set(2.4, 3.2, 0.2);
  group.add(rightSign);

  // Right Holographic Energy Curtain
  const rightCurtainMat = new THREE.MeshStandardMaterial({
    color: choice.rightOption.isOptimal ? 0x10b981 : 0xf59e0b,
    emissive: choice.rightOption.isOptimal ? 0x059669 : 0xb45309,
    emissiveIntensity: 0.6,
    transparent: true,
    opacity: 0.45,
    roughness: 0.2,
    metalness: 0.1,
  });
  const rightCurtain = new THREE.Mesh(curtainGeo, rightCurtainMat);
  rightCurtain.position.set(2.4, 1.4, 0);
  group.add(rightCurtain);

  return group;
}

