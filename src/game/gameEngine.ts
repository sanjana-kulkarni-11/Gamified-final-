/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { GameMode, ObstacleType, CollectibleType, PowerUpType, PowerUpActiveState, CharacterConfig, CharacterSkin } from '../types/game';
import { CityEnvironment, LANE_POSITIONS, isSoftwareGl } from './threeScene';
import { 
  createCharacterModel, 
  CharacterRig, 
  createRoadBarrier, 
  createOverheadPipe, 
  createHoverVehicle, 
  createConstructionBlock, 
  createPollutionCloud, 
  createEWastePile, 
  createMaintenanceDrone,
  createEnergyOrb,
  createRecyclingToken,
  createEcoCrystal,
  createKnowledgeFragment,
  createPowerUpPickup,
  createShieldDome,
  createCodeGateMesh,
} from './proceduralModels';
import { SYLLABUS_GATES } from '../data/initialData';
import { SyllabusGateChoice } from '../types/game';
import { soundManager } from '../audio/soundManager';

interface ActiveObstacle {
  id: string;
  type: ObstacleType;
  lane: number;
  z: number;
  mesh: THREE.Group;
  width: number;
  height: number;
  minY: number; // For slide-under vs jump-over clearance
  maxY: number;
  cleared: boolean;
}

interface ActiveCollectible {
  id: string;
  type: CollectibleType | PowerUpType;
  isPowerUp: boolean;
  lane: number;
  z: number;
  mesh: THREE.Group;
  collected: boolean;
}

export interface GameEngineCallbacks {
  onScoreUpdate: (score: number, distance: number, orbs: number, tokens: number, multiplier: number) => void;
  onPowerUpUpdate: (activePowerUps: PowerUpActiveState[]) => void;
  onKnowledgeFragment: (questionData?: unknown) => void;
  onGateFeedback?: (feedback: { title: string; subtitle: string; isOptimal: boolean; explanation: string }) => void;
  onGameOver: (finalStats: {
    score: number;
    distance: number;
    orbs: number;
    tokens: number;
    knowledgeFragments: number;
    codeGatesCleared: number;
    multiplier: number;
  }) => void;
}

interface ActiveCodeGate {
  id: string;
  z: number;
  choice: SyllabusGateChoice;
  mesh: THREE.Group;
  cleared: boolean;
}

export class GameEngine {
  private env: CityEnvironment;
  private mode: GameMode;
  private characterConfig: CharacterConfig;
  private characterSkin?: CharacterSkin;
  private callbacks: GameEngineCallbacks;

  // Running state
  public isRunning: boolean = false;
  public isPaused: boolean = false;
  private isGameOver: boolean = false;
  private frameId: number = 0;
  private lastTime: number = 0;

  // Player position & physics
  private currentLane: number = 1; // 0: Left, 1: Center, 2: Right
  private targetX: number = 0;
  private currentX: number = 0;
  private currentY: number = 0;
  private velocityY: number = 0;
  private isJumping: boolean = false;
  private isSliding: boolean = false;
  private slideTimer: number = 0;
  private playerZ: number = 0;

  // Speeds & scaling
  private baseSpeed: number = 11.5; // units per second - relaxed, comfortable pacing
  private currentSpeed: number = 11.5;
  private totalDistance: number = 0;
  private score: number = 0;
  private energyOrbsCount: number = 0;
  private recyclingTokensCount: number = 0;
  private knowledgeFragmentsCount: number = 0;
  private currentMultiplier: number = 1;
  private restorationLevel: number = 1;

  // Power-Ups
  private activePowerUps: Map<PowerUpType, { remaining: number; total: number }> = new Map();
  private hasShield: boolean = false;
  private invulnerableTimer: number = 0;
  private revivesRemaining: number = 2; // Up to 2 emergency recovery saves per run for maximum distance!

  // 3D entities
  private characterRig: CharacterRig;
  private shieldMesh: THREE.Mesh;
  private obstacles: ActiveObstacle[] = [];
  private collectibles: ActiveCollectible[] = [];
  private codeGates: ActiveCodeGate[] = [];
  private codeGatesClearedCount: number = 0;
  private lastGateZ: number = 0;
  private nextSpawnZ: number = -40;

  constructor(
    env: CityEnvironment,
    characterConfig: CharacterConfig,
    characterSkin: CharacterSkin | undefined,
    mode: GameMode,
    restorationLevel: number,
    callbacks: GameEngineCallbacks,
  ) {
    this.env = env;
    this.mode = mode;
    this.characterConfig = characterConfig;
    this.characterSkin = characterSkin;
    this.restorationLevel = restorationLevel;
    this.callbacks = callbacks;

    // Build character rig
    this.characterRig = createCharacterModel(characterConfig, characterSkin);
    this.env.scene.add(this.characterRig.root);

    // Build shield dome
    this.shieldMesh = createShieldDome();
    this.shieldMesh.visible = false;
    this.characterRig.root.add(this.shieldMesh);

    // Initial position
    this.currentLane = 1;
    this.targetX = LANE_POSITIONS[1];
    this.currentX = this.targetX;
    this.characterRig.root.position.set(0, 0, 0);

    // Speed bonus from character (moderated for long, comfortable runs)
    this.baseSpeed = 11.5 * characterConfig.speedBonus;
    this.currentSpeed = this.baseSpeed;
  }

  public start() {
    this.isRunning = true;
    this.isPaused = false;
    this.isGameOver = false;
    this.lastTime = performance.now();
    soundManager.startMusic();
    this.tick();
  }

  public pause() {
    this.isPaused = true;
  }

  public resume() {
    if (this.isGameOver) return;
    this.isPaused = false;
    this.lastTime = performance.now();
  }

  // Input Handlers
  public moveLeft() {
    if (this.isPaused || this.isGameOver) return;
    if (this.currentLane > 0) {
      this.currentLane--;
      this.targetX = LANE_POSITIONS[this.currentLane];
      soundManager.playLaneSwitch();
    }
  }

  public moveRight() {
    if (this.isPaused || this.isGameOver) return;
    if (this.currentLane < 2) {
      this.currentLane++;
      this.targetX = LANE_POSITIONS[this.currentLane];
      soundManager.playLaneSwitch();
    }
  }

  public jump() {
    if (this.isPaused || this.isGameOver) return;
    // Allow jumping from ground or during super jump
    if (!this.isJumping) {
      this.isJumping = true;
      this.isSliding = false;
      const superJumpActive = this.activePowerUps.has('super_jump');
      this.velocityY = superJumpActive ? 17.5 : 13.5;
      soundManager.playJump();
    }
  }

  public slide() {
    if (this.isPaused || this.isGameOver) return;
    if (this.isJumping) {
      // Fast fall when pressing down in air
      this.velocityY = -20;
    } else if (!this.isSliding) {
      this.isSliding = true;
      this.slideTimer = 0.82; // ~0.8s slide duration
      soundManager.playSlide();
    }
  }

  private tick = () => {
    if (!this.isRunning) return;

    const now = performance.now();
    const rawDelta = (now - this.lastTime) / 1000;
    this.lastTime = now;
    // Clamp delta time to avoid large jumps during tab switches
    const delta = Math.min(rawDelta, 0.1);

    if (!this.isPaused && !this.isGameOver) {
      this.update(delta);
    }

    // Render frame
    this.env.renderer.render(this.env.scene, this.env.camera);

    if (isSoftwareGl) {
      // Soft WebGL pacing
      window.setTimeout(() => {
        if (this.isRunning) this.frameId = requestAnimationFrame(this.tick);
      }, 50);
    } else {
      this.frameId = requestAnimationFrame(this.tick);
    }
  };

  private update(delta: number) {
    const elapsedSec = performance.now() / 1000;

    // 1. Update Power-Up Timers & Status
    const powerUpsToKeep: PowerUpActiveState[] = [];
    const isSolarBoost = this.activePowerUps.has('solar_boost');
    const isMagnet = this.activePowerUps.has('magnet');

    this.activePowerUps.forEach((state, type) => {
      state.remaining -= delta;
      if (state.remaining > 0) {
        powerUpsToKeep.push({
          type,
          remainingTime: state.remaining,
          totalDuration: state.total,
        });
      } else {
        this.activePowerUps.delete(type);
        if (type === 'shield') {
          this.hasShield = false;
          this.shieldMesh.visible = false;
        }
      }
    });
    this.callbacks.onPowerUpUpdate(powerUpsToKeep);

    if (this.invulnerableTimer > 0) {
      this.invulnerableTimer -= delta;
      // Visual flicker
      this.characterRig.root.visible = Math.floor(elapsedSec * 20) % 2 === 0;
    } else {
      this.characterRig.root.visible = true;
    }

    // 2. Calculate dynamic running speed
    // Moderate speed scaling ensures the student can run thousands of meters comfortably
    const speedBoost = isSolarBoost ? 1.4 : 1.0;
    this.currentSpeed = (this.baseSpeed + Math.min(6.5, this.totalDistance * 0.0015)) * speedBoost;

    // Move forward along -Z axis
    const moveZ = this.currentSpeed * delta;
    this.playerZ -= moveZ;
    this.totalDistance += moveZ;

    // Score accumulation
    this.currentMultiplier = (isSolarBoost ? 2 : 1) * (this.characterConfig.modelType === 'sprinter' ? 1.2 : 1.0);
    this.score += Math.round(moveZ * 1.8 * this.currentMultiplier);

    // 3. Lane interpolation (Crisp and responsive lane shifting)
    this.currentX = THREE.MathUtils.damp(this.currentX, this.targetX, 22, delta);

    // 4. Jump & Gravity physics (Floatier, more forgiving jump height and hang time)
    const gravity = 27; // m/s^2
    if (this.isJumping) {
      this.currentY += this.velocityY * delta;
      this.velocityY -= gravity * delta;

      if (this.currentY <= 0) {
        this.currentY = 0;
        this.velocityY = 0;
        this.isJumping = false;
      }
    }

    // 5. Slide timer
    if (this.isSliding) {
      this.slideTimer -= delta;
      if (this.slideTimer <= 0) {
        this.isSliding = false;
      }
    }

    // Apply positions to character
    this.characterRig.root.position.set(this.currentX, this.currentY, this.playerZ);
    // Smooth camera chase following player
    this.env.camera.position.set(
      this.currentX * 0.45,
      3.8 + this.currentY * 0.35,
      this.playerZ + 6.2
    );
    this.env.camera.lookAt(this.currentX * 0.25, 1.4 + this.currentY * 0.2, this.playerZ - 6.0);

    // Character limb running animation
    this.characterRig.updateAnimation(elapsedSec, this.isJumping, this.isSliding, this.currentSpeed / 12);

    // Shield follow
    if (this.hasShield) {
      this.shieldMesh.visible = true;
      this.shieldMesh.rotation.y += delta * 1.5;
    }

    // 6. Update Procedural City Scenery & Metro Track
    this.env.updateScenery(this.playerZ, this.restorationLevel, delta);

    // 7. Spawn new obstacles & collectibles ahead
    this.manageSpawning();

    // 8. Update & animate active collectibles (rotations + magnet pull)
    this.updateCollectibles(delta, isMagnet);

    // 9. Update & check collisions with obstacles
    this.updateObstacles(delta, isSolarBoost);

    // Broadcast HUD stats
    this.callbacks.onScoreUpdate(
      this.score,
      Math.floor(this.totalDistance),
      this.energyOrbsCount,
      this.recyclingTokensCount,
      this.currentMultiplier,
    );
  }

  // --- Procedural Generation & Fair Spawning System ---
  private manageSpawning() {
    // Generate up to 180 units ahead of player
    while (this.nextSpawnZ > this.playerZ - 180) {
      this.spawnPatternAt(this.nextSpawnZ);
      // Generous spacing between obstacle patterns gives plenty of reaction room
      const spacing = Math.max(26, 38 - Math.min(8, this.totalDistance * 0.0016));
      this.nextSpawnZ -= spacing;
    }

    // Garbage collection of passed obstacles and collectibles
    const purgeZ = this.playerZ + 20;

    this.obstacles = this.obstacles.filter((obs) => {
      if (obs.z > purgeZ) {
        this.env.scene.remove(obs.mesh);
        return false;
      }
      return true;
    });

    this.collectibles = this.collectibles.filter((col) => {
      if (col.z > purgeZ || col.collected) {
        this.env.scene.remove(col.mesh);
        return false;
      }
      return true;
    });

    this.codeGates = this.codeGates.filter((gate) => {
      if (gate.z > purgeZ) {
        this.env.scene.remove(gate.mesh);
        return false;
      }
      return true;
    });
  }

  private spawnPatternAt(z: number) {
    // Check if it is time to spawn a BCA Syllabus Holographic Code Gate
    const gateInterval = this.mode === 'knowledge' ? 70 : 120;
    if (Math.abs(z - this.lastGateZ) >= gateInterval) {
      this.lastGateZ = z;
      this.spawnCodeGateAt(z);
      return; // Leave track open for clear algorithmic choice!
    }

    const obstacleTypes: ObstacleType[] = [
      'road_barrier',
      'overhead_pipe',
      'hover_vehicle',
      'construction_block',
      'pollution_cloud',
      'ewaste_pile',
      'maintenance_drone',
    ];

    // FAIRNESS RULE: Never block all 3 lanes without a viable path.
    // We select 1 or 2 lanes to place obstacles, guaranteeing at least one safe lane.
    const freeLane = Math.floor(Math.random() * 3); // 0, 1, or 2 is ALWAYS free
    const lanesToPopulate = [0, 1, 2].filter((l) => l !== freeLane);

    // Deciding obstacle density: 1 obstacle or 2 obstacles
    const count = Math.random() < 0.65 ? 1 : 2;
    const selectedLanes = lanesToPopulate.slice(0, count);

    selectedLanes.forEach((lane) => {
      const type = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
      this.addObstacle(type, lane, z);
    });

    // Spawn collectibles or power-ups in the open or jumping lanes!
    const collectibleLane = freeLane;
    const rnd = Math.random();

    if (rnd < 0.08) {
      // Spawn Power-Up pickup
      const powerUpTypes: PowerUpType[] = ['shield', 'magnet', 'super_jump', 'solar_boost'];
      const chosenType = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
      this.addPowerUp(chosenType, collectibleLane, z);
    } else if (rnd < 0.16) {
      // Spawn Rare Eco Crystal
      this.addCollectible('eco_crystal', collectibleLane, z);
    } else if (rnd < 0.25) {
      // Spawn Knowledge Fragment
      this.addCollectible('knowledge_fragment', collectibleLane, z);
    } else if (rnd < 0.45) {
      // Spawn Recycling Token
      this.addCollectible('recycling_token', collectibleLane, z);
    } else {
      // Spawn trail of 3 Energy Orbs
      for (let i = 0; i < 3; i++) {
        this.addCollectible('energy_orb', collectibleLane, z - i * 3.2);
      }
    }
  }

  private addObstacle(type: ObstacleType, lane: number, z: number) {
    let mesh: THREE.Group = createRoadBarrier();
    let width = 1.4;
    let height = 1.8;
    let minY = 0;
    let maxY = 1.8;

    switch (type) {
      case 'road_barrier':
        mesh = createRoadBarrier();
        height = 0.75;
        maxY = 0.8;
        break;
      case 'overhead_pipe':
        mesh = createOverheadPipe();
        minY = 1.25; // Player slides under!
        maxY = 3.2;
        break;
      case 'hover_vehicle':
        mesh = createHoverVehicle();
        height = 2.2;
        maxY = 2.2;
        break;
      case 'construction_block':
        mesh = createConstructionBlock();
        height = 1.6;
        maxY = 1.6;
        break;
      case 'pollution_cloud':
        mesh = createPollutionCloud();
        height = 1.6;
        maxY = 1.6;
        break;
      case 'ewaste_pile':
        mesh = createEWastePile();
        height = 0.85;
        maxY = 0.85;
        break;
      case 'maintenance_drone':
        mesh = createMaintenanceDrone();
        height = 1.8;
        minY = 0.5;
        maxY = 2.2;
        break;
    }

    mesh.position.set(LANE_POSITIONS[lane], 0, z);
    this.env.scene.add(mesh);

    this.obstacles.push({
      id: `obs_${Math.random().toString(36).substring(2, 9)}`,
      type,
      lane,
      z,
      mesh,
      width,
      height,
      minY,
      maxY,
      cleared: false,
    });
  }

  private addCollectible(type: CollectibleType, lane: number, z: number) {
    let mesh: THREE.Group;
    switch (type) {
      case 'energy_orb':
        mesh = createEnergyOrb();
        break;
      case 'recycling_token':
        mesh = createRecyclingToken();
        break;
      case 'eco_crystal':
        mesh = createEcoCrystal();
        break;
      case 'knowledge_fragment':
        mesh = createKnowledgeFragment();
        break;
    }

    mesh.position.set(LANE_POSITIONS[lane], 0.9, z);
    this.env.scene.add(mesh);

    this.collectibles.push({
      id: `col_${Math.random().toString(36).substring(2, 9)}`,
      type,
      isPowerUp: false,
      lane,
      z,
      mesh,
      collected: false,
    });
  }

  private addPowerUp(type: PowerUpType, lane: number, z: number) {
    const mesh = createPowerUpPickup(type);
    mesh.position.set(LANE_POSITIONS[lane], 1.0, z);
    this.env.scene.add(mesh);

    this.collectibles.push({
      id: `pw_${Math.random().toString(36).substring(2, 9)}`,
      type,
      isPowerUp: true,
      lane,
      z,
      mesh,
      collected: false,
    });
  }

  private spawnCodeGateAt(z: number) {
    const randomChoice = SYLLABUS_GATES[Math.floor(Math.random() * SYLLABUS_GATES.length)];
    const mesh = createCodeGateMesh(randomChoice);
    mesh.position.set(0, 0, z);
    this.env.scene.add(mesh);

    this.codeGates.push({
      id: `gate_${Math.random().toString(36).substring(2, 9)}`,
      z,
      choice: randomChoice,
      mesh,
      cleared: false,
    });
  }

  // --- Collectible Animation & Magnet Physics ---
  private updateCollectibles(delta: number, isMagnet: boolean) {
    const magnetRange = this.characterConfig.modelType === 'botanist' ? 14 : 10;

    this.collectibles.forEach((item) => {
      if (item.collected) return;

      // Gentle floating spin
      item.mesh.rotation.y += delta * 2.8;

      // Magnet pull towards player if magnet active
      if (isMagnet && !item.isPowerUp) {
        const dx = this.currentX - item.mesh.position.x;
        const dy = (this.currentY + 0.8) - item.mesh.position.y;
        const dz = this.playerZ - item.mesh.position.z;
        const dist = Math.hypot(dx, dy, dz);

        if (dist < magnetRange) {
          const pullSpeed = 24 * delta;
          item.mesh.position.x += (dx / dist) * pullSpeed;
          item.mesh.position.y += (dy / dist) * pullSpeed;
          item.mesh.position.z += (dz / dist) * pullSpeed;
        }
      }

      // Proximity collection detection
      const zDiff = Math.abs(item.mesh.position.z - this.playerZ);
      const xDiff = Math.abs(item.mesh.position.x - this.currentX);
      const yDiff = Math.abs(item.mesh.position.y - (this.currentY + 0.8));

      if (zDiff < 1.3 && xDiff < 1.1 && yDiff < 1.5) {
        item.collected = true;
        this.env.scene.remove(item.mesh);

        if (item.isPowerUp) {
          this.activatePowerUp(item.type as PowerUpType);
        } else {
          this.collectItem(item.type as CollectibleType);
        }
      }
    });
  }

  private collectItem(type: CollectibleType) {
    switch (type) {
      case 'energy_orb':
        this.energyOrbsCount += 1;
        this.score += 50 * this.currentMultiplier;
        soundManager.playOrb();
        break;
      case 'recycling_token':
        this.recyclingTokensCount += 1;
        this.score += 150 * this.currentMultiplier;
        soundManager.playToken();
        break;
      case 'eco_crystal':
        this.score += 500 * this.currentMultiplier;
        soundManager.playCrystal();
        break;
      case 'knowledge_fragment':
        this.knowledgeFragmentsCount += 1;
        this.score += 300 * this.currentMultiplier;
        soundManager.playKnowledgeFragment();
        this.callbacks.onKnowledgeFragment();
        break;
    }
  }

  private activatePowerUp(type: PowerUpType) {
    soundManager.playPowerUp();
    // Engineer gets 25% duration bonus
    const durationMultiplier = this.characterConfig.modelType === 'engineer' ? 1.25 : 1.0;
    const baseDurations: Record<PowerUpType, number> = {
      shield: 14 * durationMultiplier,
      magnet: 10 * durationMultiplier,
      super_jump: 9 * durationMultiplier,
      solar_boost: 6 * durationMultiplier,
    };

    const duration = baseDurations[type];
    this.activePowerUps.set(type, { remaining: duration, total: duration });

    if (type === 'shield') {
      this.hasShield = true;
      this.shieldMesh.visible = true;
    }
  }

  // --- Obstacle Collision Detection & BCA Syllabus Gates ---
  private updateObstacles(delta: number, isSolarBoost: boolean) {
    // 1. Process BCA Syllabus Holographic Code Gates (Always evaluated!)
    this.codeGates.forEach((gate) => {
      if (gate.cleared) return;
      const zDiff = Math.abs(gate.z - this.playerZ);

      if (zDiff < 1.4) {
        gate.cleared = true;

        if (this.currentX < -0.8) {
          // Player ran through Left Lane A
          const isOptimal = gate.choice.leftOption.isOptimal;
          if (isOptimal) {
            this.codeGatesClearedCount++;
            const bonus = (this.characterConfig.modelType === 'sprinter' ? 750 : 500) * this.currentMultiplier;
            this.score += bonus;
            this.activatePowerUp('solar_boost');
            soundManager.playPowerUp();
            this.callbacks.onGateFeedback?.({
              title: 'OPTIMAL ALGORITHM!',
              subtitle: gate.choice.leftOption.label,
              isOptimal: true,
              explanation: gate.choice.leftOption.explanation,
            });
          } else {
            soundManager.playCrash();
            this.callbacks.onGateFeedback?.({
              title: 'SUBOPTIMAL ALGORITHM',
              subtitle: gate.choice.leftOption.label,
              isOptimal: false,
              explanation: gate.choice.leftOption.explanation,
            });
          }
        } else if (this.currentX > 0.8) {
          // Player ran through Right Lane B
          const isOptimal = gate.choice.rightOption.isOptimal;
          if (isOptimal) {
            this.codeGatesClearedCount++;
            const bonus = (this.characterConfig.modelType === 'sprinter' ? 750 : 500) * this.currentMultiplier;
            this.score += bonus;
            this.activatePowerUp('solar_boost');
            soundManager.playPowerUp();
            this.callbacks.onGateFeedback?.({
              title: 'OPTIMAL ALGORITHM!',
              subtitle: gate.choice.rightOption.label,
              isOptimal: true,
              explanation: gate.choice.rightOption.explanation,
            });
          } else {
            soundManager.playCrash();
            this.callbacks.onGateFeedback?.({
              title: 'SUBOPTIMAL ALGORITHM',
              subtitle: gate.choice.rightOption.label,
              isOptimal: false,
              explanation: gate.choice.rightOption.explanation,
            });
          }
        } else {
          // Player ran into Center Divider Pillar
          if (!isSolarBoost) {
            if (this.hasShield) {
              this.hasShield = false;
              this.activePowerUps.delete('shield');
              this.shieldMesh.visible = false;
              this.invulnerableTimer = 1.4;
              soundManager.playShieldBreak();
            } else if (this.invulnerableTimer <= 0) {
              this.triggerGameOver();
            }
          }
        }
      }
    });

    // 2. Standard Obstacle Collisions
    if (isSolarBoost) return;
    if (this.invulnerableTimer > 0) return;

    const playerMinY = this.currentY;
    const playerMaxY = this.currentY + (this.isSliding ? 0.7 : 1.8);

    this.obstacles.forEach((obs) => {
      if (obs.cleared) return;

      // Animate drone oscillation
      if (obs.type === 'maintenance_drone') {
        obs.mesh.position.y = 1.3 + Math.sin(performance.now() * 0.005) * 0.4;
      }

      const zDiff = Math.abs(obs.z - this.playerZ);
      const xDiff = Math.abs(LANE_POSITIONS[obs.lane] - this.currentX);

      // Generous, forgiving collision volume: close calls don't end the run
      if (zDiff < 0.82 && xDiff < 0.72) {
        const verticalOverlap = !(playerMaxY < obs.minY + 0.15 || playerMinY > obs.maxY - 0.15);

        if (verticalOverlap) {
          if (this.hasShield) {
            this.hasShield = false;
            this.activePowerUps.delete('shield');
            this.shieldMesh.visible = false;
            this.invulnerableTimer = 1.8;
            obs.cleared = true;
            soundManager.playShieldBreak();
          } else if (this.revivesRemaining > 0) {
            // Emergency recovery: absorbs collision, activates shield, keeps the run going!
            this.revivesRemaining--;
            obs.cleared = true;
            this.invulnerableTimer = 2.4;
            this.activatePowerUp('shield');
            soundManager.playShieldBreak();
            this.callbacks.onGateFeedback?.({
              title: 'EMERGENCY SHIELD ACTIVATED!',
              subtitle: `Glitch absorbed! (${this.revivesRemaining} recovery remaining)`,
              isOptimal: true,
              explanation: 'Your eco-exosuit auto-deployed emergency kinetic dampeners to keep your streak alive.',
            });
          } else {
            this.triggerGameOver();
          }
        }
      }
    });
  }

  private triggerGameOver() {
    this.isGameOver = true;
    this.isRunning = false;
    soundManager.stopMusic();
    soundManager.playCrash();

    this.callbacks.onGameOver({
      score: this.score,
      distance: Math.floor(this.totalDistance),
      orbs: this.energyOrbsCount,
      tokens: this.recyclingTokensCount,
      knowledgeFragments: this.knowledgeFragmentsCount,
      codeGatesCleared: this.codeGatesClearedCount,
      multiplier: this.currentMultiplier,
    });
  }

  public restart(characterConfig: CharacterConfig, characterSkin: CharacterSkin | undefined, mode: GameMode, restorationLevel: number) {
    this.destroy();

    this.mode = mode;
    this.characterConfig = characterConfig;
    this.characterSkin = characterSkin;
    this.restorationLevel = restorationLevel;

    // Reset stats
    this.currentLane = 1;
    this.targetX = LANE_POSITIONS[1];
    this.currentX = this.targetX;
    this.currentY = 0;
    this.velocityY = 0;
    this.isJumping = false;
    this.isSliding = false;
    this.playerZ = 0;
    this.totalDistance = 0;
    this.score = 0;
    this.energyOrbsCount = 0;
    this.recyclingTokensCount = 0;
    this.knowledgeFragmentsCount = 0;
    this.codeGatesClearedCount = 0;
    this.lastGateZ = 0;
    this.baseSpeed = 11.5 * characterConfig.speedBonus;
    this.currentSpeed = this.baseSpeed;
    this.nextSpawnZ = -40;
    this.activePowerUps.clear();
    this.hasShield = false;
    this.invulnerableTimer = 0;
    this.revivesRemaining = 2;

    // Rebuild character
    this.characterRig = createCharacterModel(characterConfig, characterSkin);
    this.env.scene.add(this.characterRig.root);

    this.shieldMesh = createShieldDome();
    this.shieldMesh.visible = false;
    this.characterRig.root.add(this.shieldMesh);

    this.start();
  }

  public destroy() {
    this.isRunning = false;
    cancelAnimationFrame(this.frameId);
    soundManager.stopMusic();

    if (this.characterRig?.root) {
      this.env.scene.remove(this.characterRig.root);
    }
    this.obstacles.forEach((o) => this.env.scene.remove(o.mesh));
    this.collectibles.forEach((c) => this.env.scene.remove(c.mesh));
    this.codeGates.forEach((g) => this.env.scene.remove(g.mesh));
    this.obstacles = [];
    this.collectibles = [];
    this.codeGates = [];
  }
}
