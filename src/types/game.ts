/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type GameMode = 'endless' | 'missions' | 'knowledge' | 'daily';

export type UserRole = 'student' | 'teacher' | 'admin';

export type PowerUpType = 'shield' | 'magnet' | 'super_jump' | 'solar_boost';

export interface PowerUpActiveState {
  type: PowerUpType;
  remainingTime: number; // seconds
  totalDuration: number;
}

export type ObstacleType = 
  | 'road_barrier'      // Jump over or switch lane
  | 'overhead_pipe'     // Slide under or switch lane
  | 'hover_vehicle'     // Tall obstacle, switch lane
  | 'construction_block'// Switch lane
  | 'pollution_cloud'   // Dodge lane
  | 'ewaste_pile'       // Dodge or jump
  | 'maintenance_drone' // Moving lane or floating hazard
  | 'code_gate';        // Interactive BCA Syllabus Code Gate!

export type CollectibleType = 
  | 'energy_orb'        // Standard green energy + score
  | 'recycling_token'   // Currency for unlocks
  | 'eco_crystal'       // Rare crystal + multiplier
  | 'knowledge_fragment';// Environmental & BCA Syllabus quiz XP

export type BCASemester = 
  | 'Sem 1-2 (Foundation & E-Waste)' 
  | 'Sem 3 (DSA & Operating Systems)' 
  | 'Sem 4 (DBMS & OOP Systems)' 
  | 'Sem 5-6 (Networks & Cloud Computing)';

export type BCASubject = 
  | 'Data Structures & Algorithms'
  | 'Operating Systems'
  | 'Database Management Systems'
  | 'Computer Networks'
  | 'Cloud Computing & Sustainable Software'
  | 'OOP with Java / C++'
  | 'E-Waste Management & Cyber Law';

export interface CharacterConfig {
  id: string;
  name: string;
  title: string;
  description: string;
  roleSpecialty: string;
  speedBonus: number;
  unlockedByDefault: boolean;
  tokenCost: number;
  primaryColor: string;
  accentColor: string;
  modelType: 'sprinter' | 'engineer' | 'botanist';
}

export interface CharacterSkin {
  id: string;
  characterId: string;
  name: string;
  description: string;
  tokenCost: number;
  palette: {
    suit: string;
    trim: string;
    visor: string;
  };
}

export interface TrailEffect {
  id: string;
  name: string;
  description: string;
  tokenCost: number;
  color: string;
  glowColor: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  targetCount: number;
  currentCount: number;
  type: 'distance' | 'orbs' | 'tokens' | 'knowledge' | 'clean_run' | 'jump_count' | 'slide_count' | 'syllabus_gates';
  rewardTokens: number;
  rewardXP: number;
  completed: boolean;
  claimed: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  requirement: number;
  currentValue: number;
  metric: 'high_score' | 'total_distance' | 'total_tokens' | 'quizzes_completed' | 'runs_played' | 'shield_saves' | 'solar_boosts' | 'clean_runs' | 'code_gates_passed';
  unlocked: boolean;
  unlockedAt?: string;
  rewardTokens: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic: BCASubject | string;
  semester: BCASemester | string;
  codeSnippet?: string;
}

export interface CodeEfficiencyComparison {
  id: string;
  title: string;
  subject: BCASubject;
  problemStatement: string;
  naiveCode: {
    title: string;
    code: string;
    complexity: string;
    cpuCycles: string;
    estimatedEnergy: string;
    explanation: string;
  };
  optimizedCode: {
    title: string;
    code: string;
    complexity: string;
    cpuCycles: string;
    estimatedEnergy: string;
    explanation: string;
  };
  energySavedPercent: number;
  bcaTakeaway: string;
}

export interface TopicNoteSection {
  title: string;
  content: string[];
  codeSnippet?: string;
  examTip?: string;
}

export interface LearningModule {
  id: string;
  title: string;
  semester: BCASemester | string;
  subject: BCASubject | string;
  readTime: string;
  summary: string;
  content: string[];
  keyTakeaways: string[];
  codeComparisons?: CodeEfficiencyComparison[];
  quizQuestions: QuizQuestion[];
  published: boolean;
  assignedBatches: string[];
  unitNumber?: number;
  notesSections?: TopicNoteSection[];
  greenITImpact?: string;
}

export interface SyllabusRoadmapStation {
  id: number;
  badge: string;
  title: string;
  subTitle: string;
  description: string;
  color: string;
  flagColor: string;
  iconName?: string;
  semester: string;
  topics: string[];
  energySaving: string;
  moduleId: string;
}

export interface SyllabusGateChoice {
  prompt: string;
  topic: BCASubject;
  leftOption: {
    label: string;
    isOptimal: boolean;
    explanation: string;
  };
  rightOption: {
    label: string;
    isOptimal: boolean;
    explanation: string;
  };
}

export interface RunSummary {
  id: string;
  date: string;
  mode: GameMode;
  characterId: string;
  score: number;
  distance: number; // meters
  energyOrbs: number;
  recyclingTokens: number;
  knowledgeFragments: number;
  codeGatesCleared: number;
  maxMultiplier: number;
  durationSeconds: number;
  xpEarned: number;
  environmentalFact: {
    title: string;
    fact: string;
    bcaTakeaway: string;
  };
}

export interface LeaderboardEntry {
  id: string;
  nickname: string;
  batch: string; // e.g. "BCA 3rd Sem A"
  highScore: number;
  longestDistance: number;
  totalTokens: number;
  quizScore: number;
  syllabusGatesMastered: number;
  isCurrentPlayer?: boolean;
  avatarSeed: string;
}

export interface StudentProgress {
  userId: string;
  nickname: string;
  email: string;
  batch: string;
  role: UserRole;
  level: number;
  xp: number;
  recyclingTokens: number;
  ecoCrystals: number;
  highScore: number;
  longestDistance: number;
  totalRuns: number;
  totalDistance: number;
  totalOrbs: number;
  totalTokensCollected: number;
  totalGatesCleared: number;
  selectedCharacterId: string;
  selectedSkinId: string;
  selectedTrailId: string;
  unlockedCharacterIds: string[];
  unlockedSkinIds: string[];
  unlockedTrailIds: string[];
  completedQuizIds: Record<string, number>; // moduleId -> score%
  unlockedAchievements: string[];
  restorationLevel: number; // 1 to 5
}
