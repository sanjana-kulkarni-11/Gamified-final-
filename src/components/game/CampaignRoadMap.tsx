/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { GameMode, CharacterConfig, CharacterSkin, StudentProgress, QuizQuestion, LearningModule, SyllabusRoadmapStation } from '../../types/game';
import { storageService } from '../../services/storageService';
import { soundManager } from '../../audio/soundManager';
import {
  PixelStar,
  PixelHeart,
  PixelCastle,
  PixelTreasureChest,
  PixelSignpost,
  PixelRunnerSprite,
  PixelAchievementBadge,
} from '../pixel/PixelArtAssets';
import {
  Play,
  Zap,
  BookOpen,
  Award,
  Sparkles,
  ChevronRight,
  CheckCircle,
  FileText,
  Share2,
  Link,
  ShoppingBag,
  DollarSign,
  Trophy,
  X,
  Compass,
  Upload,
  Gamepad2,
  Dice5,
  Flame,
  Cpu,
  Shield,
  Layers,
  Lock
} from 'lucide-react';

interface CampaignRoadMapProps {
  progress: StudentProgress;
  selectedCharacter: CharacterConfig;
  selectedSkin?: CharacterSkin;
  onSelectCharacter: (char: CharacterConfig) => void;
  onStartGame: (mode: GameMode, topicContext?: { topicTitle: string; moduleId?: string; questions?: QuizQuestion[] }) => void;
  onNavigateTab: (tab: 'hub' | 'learn' | 'leaderboard' | 'shop' | 'achievements' | 'teacher' | 'admin' | 'games') => void;
  onOpenMiniGame?: (game: 'snakes' | 'kahoot', topicContext?: { topicTitle: string; moduleId?: string; questions?: QuizQuestion[] }) => void;
  onOpenSyllabusUpload?: () => void;
  onOpenTopicNotes?: (module: LearningModule) => void;
}

export interface StationDef {
  id: number;
  badge: string;
  title: string;
  subTitle: string;
  description: string;
  color: string;
  flagColor: string;
  icon?: React.ReactNode;
  iconName?: string;
  semester: string;
  topics: string[];
  energySaving: string;
  moduleId?: string;
}

const DEFAULT_STATIONS: StationDef[] = [
  {
    id: 1,
    badge: '1',
    title: 'BLOG & DSA FOUNDATIONS',
    subTitle: 'Sem 1-2: C & Data Structures',
    description: 'Master O(n log n) algorithms and dynamic memory allocation in C to slash server compute watts.',
    color: 'border-purple-500 bg-[#1e1438]',
    flagColor: '#9333ea',
    iconName: 'file-text',
    semester: 'Sem 1-2',
    topics: ['Arrays & Pointers in C', 'Merge & Quick Sort (O(n log n))', 'Dynamic Memory & Energy Saving', 'Linked Lists'],
    energySaving: '64% CPU Watt Reduction',
    moduleId: 'mod_green_computing'
  },
  {
    id: 2,
    badge: '2',
    title: 'PINTEREST & NETWORKS',
    subTitle: 'Sem 3: OS & Computer Networks',
    description: 'Optimize packet routing, Round Robin process scheduling, and lightweight MQTT protocols.',
    color: 'border-red-500 bg-[#2b1016]',
    flagColor: '#ef4444',
    iconName: 'share-2',
    semester: 'Sem 3',
    topics: ['TCP/IP & Subnetting', 'Process Scheduling (Round Robin)', 'Packet Compression', 'Virtual Memory Paging'],
    energySaving: '42% Network Power Saved',
    moduleId: 'mod_ewaste'
  },
  {
    id: 3,
    badge: '3',
    title: 'AFFILIATE OFFERS & DBMS',
    subTitle: 'Sem 4: DBMS & SQL Tuning',
    description: 'Index SQL queries with B+ Trees to eradicate expensive table full-scans and disk I/O.',
    color: 'border-amber-500 bg-[#2b1f0c]',
    flagColor: '#f59e0b',
    iconName: 'link',
    semester: 'Sem 4',
    topics: ['B-Tree Indexing', '3NF Normalization', 'ACID Transactions', 'Query Optimizer Plans'],
    energySaving: '78% Disk I/O Savings',
    moduleId: 'mod_cloud_lifecycle'
  },
  {
    id: 4,
    badge: '4',
    title: 'DIGITAL PRODUCTS & OOP',
    subTitle: 'Sem 5: Java & Microservices',
    description: 'Build passive systems with clean garbage-collected Java architectures and microservices.',
    color: 'border-emerald-500 bg-[#0f2a1a]',
    flagColor: '#22c55e',
    iconName: 'shopping-bag',
    semester: 'Sem 5',
    topics: ['Java JVM Garbage Collector Tuning', 'Polymorphism & Design Patterns', 'RESTful Microservices', 'Memory Leak Prevention'],
    energySaving: '55% RAM Footprint Cut',
    moduleId: 'mod_green_computing'
  },
  {
    id: 5,
    badge: '5',
    title: 'INCOME & CLOUD/E-WASTE',
    subTitle: 'Sem 6: Cloud Computing & Green IT',
    description: 'Deploy carbon-neutral serverless cloud architectures, scale-to-zero, and circular e-waste recycling.',
    color: 'border-blue-500 bg-[#0f1f3d]',
    flagColor: '#3b82f6',
    iconName: 'dollar-sign',
    semester: 'Sem 6',
    topics: ['Serverless Scale-to-Zero', 'Docker & Kubernetes Pod Density', 'Electronic Waste Lifecycle', 'Data Center PUE Index'],
    energySaving: '85% Carbon Emissions Slashed',
    moduleId: 'mod_ewaste'
  },
];

function renderStationIcon(iconName?: string) {
  switch (iconName) {
    case 'share-2': return <Share2 className="w-5 h-5 text-rose-400" />;
    case 'link': return <Link className="w-5 h-5 text-amber-400" />;
    case 'shopping-bag': return <ShoppingBag className="w-5 h-5 text-emerald-400" />;
    case 'dollar-sign': return <DollarSign className="w-5 h-5 text-cyan-400" />;
    case 'cpu': return <Cpu className="w-5 h-5 text-blue-400" />;
    case 'shield': return <Shield className="w-5 h-5 text-pink-400" />;
    case 'file-text':
    default:
      return <FileText className="w-5 h-5 text-purple-400" />;
  }
}

export const CampaignRoadMap: React.FC<CampaignRoadMapProps> = ({
  progress,
  selectedCharacter,
  onStartGame,
  onNavigateTab,
  onOpenMiniGame,
  onOpenSyllabusUpload,
  onOpenTopicNotes,
}) => {
  const [activeStationId, setActiveStationId] = useState<number>(1);
  const [selectedStationModal, setSelectedStationModal] = useState<StationDef | null>(null);
  const [showChestModal, setShowChestModal] = useState<boolean>(false);
  const [stations, setStations] = useState<StationDef[]>(DEFAULT_STATIONS);
  const [syllabusTitle, setSyllabusTitle] = useState<string>('BCA Green Computing & Core Curriculum');
  const [allModules, setAllModules] = useState<LearningModule[]>([]);

  // Load custom syllabus roadmap if present
  useEffect(() => {
    const customRoadmap = storageService.getSyllabusRoadmap();
    const title = storageService.getActiveSyllabusTitle();
    const modules = storageService.getModules();
    setAllModules(modules);
    setSyllabusTitle(title);

    if (customRoadmap && customRoadmap.length > 0) {
      const mapped: StationDef[] = customRoadmap.map((st) => ({
        id: st.id,
        badge: st.badge,
        title: st.title,
        subTitle: st.subTitle,
        description: st.description,
        color: st.color,
        flagColor: st.flagColor,
        iconName: st.iconName,
        semester: st.semester,
        topics: st.topics,
        energySaving: st.energySaving,
        moduleId: st.moduleId,
      }));
      setStations(mapped);
    } else {
      setStations(DEFAULT_STATIONS);
    }
  }, []);

  const handleStartSprint = (targetStation?: StationDef) => {
    soundManager.playCountdown(true);
    if (targetStation) {
      const mod = allModules.find(m => m.id === targetStation.moduleId) || allModules[0];
      onStartGame('endless', {
        topicTitle: targetStation.title,
        moduleId: targetStation.moduleId,
        questions: mod?.quizQuestions
      });
    } else {
      onStartGame('endless');
    }
  };

  const handleStationClick = (station: StationDef) => {
    soundManager.playWhoosh();
    setActiveStationId(station.id);
    setSelectedStationModal(station);
  };

  // Find associated module for active station
  const activeModuleForModal = selectedStationModal
    ? allModules.find(m => m.id === selectedStationModal.moduleId) || allModules.find(m => m.title.toLowerCase().includes(selectedStationModal.title.toLowerCase())) || allModules[0]
    : allModules[0];

  return (
    <div className="relative w-full min-h-screen bg-[#070b14] text-white flex flex-col justify-between overflow-x-hidden select-none p-3 sm:p-5 font-sans">
      {/* =========================================================================
          TOP BANNER / HEADER (Matches Reference Exactly)
         ========================================================================= */}
      <div className="relative z-20 max-w-5xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-4 border-b-2 border-[#1e293b]/80 pb-3">
        {/* PLAYER 1 CARD (Top Left) */}
        <div className="flex items-center gap-3 bg-[#0d1527] border-2 border-[#1e293b] rounded-2xl px-3.5 py-2 shadow-xl pixel-card-shadow">
          <div className="relative w-11 h-11 bg-[#1e293b] rounded-xl flex items-center justify-center border border-white/10 overflow-hidden">
            <PixelRunnerSprite size={32} />
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="font-pixel text-[10px] text-slate-300">PLAYER 1</span>
              <div className="flex gap-1 ml-1">
                {[1, 2, 3].map((h) => (
                  <PixelHeart key={h} active={true} size={14} />
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-pixel text-[9px] text-emerald-400">LEVEL {progress.level}</span>
              <div className="w-20 bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, (progress.xp % 500) / 5)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* MASSIVE GOLDEN TITLE (Center) */}
        <div className="flex flex-col items-center text-center">
          <span className="font-pixel text-xs sm:text-sm tracking-widest text-slate-200 uppercase drop-shadow-md">
            THE ROAD TO
          </span>
          <h1
            className="font-pixel text-3xl sm:text-5xl md:text-6xl font-black text-[#fbc02d] tracking-tight drop-shadow-[0_5px_0_#78350f] my-1"
            style={{ textShadow: '0 4px 0 #78350f, 0 8px 12px rgba(0,0,0,0.8)' }}
          >
            $100/DAY
          </h1>
          {/* Banner with Gold Stars & Syllabus Pill */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-1">
            <div className="flex items-center gap-2 px-3 py-1 bg-black/60 rounded-full border border-amber-500/40 text-[10px] sm:text-xs font-silkscreen text-amber-300 tracking-wider">
              <PixelStar size={14} />
              <span>{syllabusTitle.toUpperCase()}</span>
              <PixelStar size={14} />
            </div>

            {onOpenSyllabusUpload && (
              <button
                onClick={onOpenSyllabusUpload}
                className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-pixel text-[9px] font-bold border border-black shadow flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
              >
                <Upload className="w-3 h-3 text-slate-950" />
                <span>UPLOAD SYLLABUS</span>
              </button>
            )}
          </div>
        </div>

        {/* GOAL CARD & CASTLE (Top Right) */}
        <div className="flex items-center gap-3">
          <div className="bg-[#0d1527] border-2 border-[#1e293b] rounded-2xl px-4 py-2 text-right shadow-xl">
            <div className="font-pixel text-[9px] text-slate-400">GOAL</div>
            <div className="font-pixel text-xs sm:text-sm text-emerald-400 font-bold">$100/DAY 🪙</div>
            <div className="text-[10px] font-mono text-cyan-300 mt-0.5">BCA DEGREE 100%</div>
          </div>
          {/* Blue Castle Graphic on Cliff */}
          <div className="hidden sm:block transform hover:scale-105 transition-transform" title="Neo-BCA Citadel">
            <PixelCastle size={68} />
          </div>
        </div>
      </div>

      {/* =========================================================================
          MAIN MAP VIEWPORT: The Winding Forest Cobblestone Road
         ========================================================================= */}
      <div className="relative z-10 max-w-5xl mx-auto w-full my-4 flex-1 flex flex-col lg:flex-row gap-6">
        {/* Left & Center: The Procedural Winding Overworld Map */}
        <div className="relative flex-1 rounded-3xl bg-[#0a141c] border-4 border-[#1e293b] overflow-hidden shadow-2xl p-4 sm:p-6 min-h-[580px] flex flex-col justify-between">
          {/* Grassy Overworld Terrain Pattern & River Background */}
          <div
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              backgroundImage: `
                radial-gradient(circle at 10% 20%, #15803d 0%, transparent 40%),
                radial-gradient(circle at 80% 30%, #1e3a8a 0%, transparent 45%),
                radial-gradient(circle at 30% 70%, #065f46 0%, transparent 50%),
                linear-gradient(rgba(255,255,255,0.03) 2px, transparent 2px),
                linear-gradient(90deg, rgba(255,255,255,0.03) 2px, transparent 2px)
              `,
              backgroundSize: '100% 100%, 100% 100%, 100% 100%, 32px 32px, 32px 32px',
            }}
          />

          {/* Decorative Waterfall & Streams on Left */}
          <div className="absolute top-10 left-3 pointer-events-none opacity-70 flex flex-col items-center">
            <div className="text-xl">🌊</div>
            <div className="w-2.5 h-28 bg-gradient-to-b from-cyan-400 via-blue-500 to-transparent rounded-full blur-[1px] animate-pulse" />
          </div>

          {/* Floating Dialogue Speech Bubble (Top Center) */}
          <div className="relative z-20 self-center max-w-sm text-center bg-[#0d1b2a]/95 border-2 border-cyan-400/80 rounded-2xl p-2.5 shadow-lg mb-2">
            <div className="font-pixel text-[9px] text-cyan-200 tracking-wide uppercase leading-relaxed mb-2">
              STUDY WHILE WINNING: SELECT YOUR GAMIFIED ARENA
            </div>
            {/* Gamified study game quick-selectors */}
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              <button
                onClick={() => onOpenMiniGame ? onOpenMiniGame('snakes') : onNavigateTab('games')}
                className="px-2.5 py-1 rounded-lg bg-emerald-950/90 hover:bg-emerald-850 border border-emerald-500/70 text-emerald-300 font-pixel text-[8px] flex items-center gap-1 shadow hover:scale-105 active:scale-95 transition-all"
              >
                <span>🎲</span>
                <span>CODE SNAKES (LUDO)</span>
              </button>
              <button
                onClick={() => onOpenMiniGame ? onOpenMiniGame('kahoot') : onNavigateTab('games')}
                className="px-2.5 py-1 rounded-lg bg-purple-950/90 hover:bg-purple-850 border border-purple-500/70 text-purple-300 font-pixel text-[8px] flex items-center gap-1 shadow hover:scale-105 active:scale-95 transition-all"
              >
                <span>⚡</span>
                <span>KAHOOT BLITZ</span>
              </button>
              <button
                onClick={() => handleStartSprint()}
                className="px-2.5 py-1 rounded-lg bg-amber-950/90 hover:bg-amber-850 border border-amber-500/70 text-amber-300 font-pixel text-[8px] flex items-center gap-1 shadow hover:scale-105 active:scale-95 transition-all"
              >
                <span>🏃</span>
                <span>3D RUNNER</span>
              </button>
            </div>
          </div>

          {/* START SIGNPOST & Glowing Runner Pedestal (Upper Left) */}
          <div className="relative z-20 flex items-center gap-3 ml-2 sm:ml-8 mt-1">
            <div className="relative">
              {/* Stepping Yellow Glowing Pedestal */}
              <div className="w-16 h-16 rounded-full border-4 border-amber-400 bg-amber-500/20 shadow-[0_0_25px_rgba(251,191,36,0.6)] flex items-center justify-center animate-pulse">
                <PixelRunnerSprite size={40} />
              </div>
              <div className="absolute -bottom-2 -right-1 text-xs">✨</div>
            </div>
            <div>
              <PixelSignpost />
              <button
                onClick={() => handleStartSprint()}
                className="mt-1 px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-pixel text-[9px] rounded-full shadow hover:scale-105 active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
              >
                <Play className="w-3 h-3 fill-slate-950" />
                <span>RUN SPRINT</span>
              </button>
            </div>
          </div>

          {/* THE 5 INTERACTIVE MILESTONE CARDS ALONG THE ROAD */}
          <div className="relative z-20 flex flex-col gap-4 my-2">
            {stations.map((st, index) => {
              const isSelected = activeStationId === st.id;
              // Alternate alignment left and right to match winding road in the image!
              const isLeft = index % 2 === 0;
              const unlockStatus = storageService.isTopicUnlocked(index, allModules, progress);
              const isUnlocked = unlockStatus.isUnlocked;

              return (
                <div
                  key={st.id}
                  className={`flex items-center gap-3 w-full ${
                    isLeft ? 'justify-start' : 'justify-end'
                  }`}
                >
                  {/* Station Interactive Card */}
                  <div
                    onClick={() => handleStationClick(st)}
                    className={`max-w-xs sm:max-w-sm w-full p-3 sm:p-3.5 rounded-2xl border-2 transition-all cursor-pointer shadow-xl ${
                      isSelected
                        ? `${isUnlocked ? st.color : 'bg-slate-900 border-amber-400'} ring-4 ring-amber-400/50 scale-[1.02]`
                        : isUnlocked
                        ? `${st.color} border-slate-700 hover:border-slate-500 hover:scale-[1.01]`
                        : 'bg-[#0a0f1d] border-slate-800 opacity-80 hover:opacity-100 hover:border-amber-500/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-lg font-pixel text-xs flex items-center justify-center font-bold ${
                          isUnlocked 
                            ? 'bg-black/40 border border-white/20 text-amber-300' 
                            : 'bg-amber-950/80 border border-amber-500/40 text-amber-400'
                        }`}>
                          {isUnlocked ? st.badge : '🔒'}
                        </span>
                        <h4 className="font-pixel text-[11px] sm:text-xs text-white leading-tight">
                          {st.title}
                        </h4>
                      </div>
                      <div className="p-1 rounded bg-black/30 shrink-0">
                        {isUnlocked ? (st.icon || renderStationIcon(st.iconName)) : <Lock className="w-4 h-4 text-amber-400" />}
                      </div>
                    </div>

                    <div className="text-[10px] font-silkscreen text-amber-300/90 mb-1">
                      {st.subTitle}
                    </div>
                    <p className="text-[11px] text-slate-300 leading-snug mb-2 font-normal">
                      {st.description}
                    </p>

                    <div className="flex justify-between items-center pt-1.5 border-t border-white/10 text-[10px] font-mono">
                      {isUnlocked ? (
                        <>
                          <span className="text-emerald-400 font-bold">{st.energySaving}</span>
                          <span className="text-cyan-300 flex items-center gap-0.5">
                            <span>EXPLORE</span>
                            <ChevronRight className="w-3 h-3" />
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-amber-400 font-pixel text-[9px] flex items-center gap-1">
                            <Lock className="w-3 h-3 text-amber-400" />
                            <span>LOCKED (75%+ ON PREVIOUS UNIT)</span>
                          </span>
                          <span className="text-slate-400 flex items-center gap-0.5">
                            <span>DETAILS</span>
                            <ChevronRight className="w-3 h-3" />
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Flag Post with Stepping Ring on Road */}
                  <div className="hidden sm:flex flex-col items-center shrink-0">
                    <div
                      className={`w-7 h-7 rounded-full border-2 flex items-center justify-center font-pixel text-[10px] font-bold shadow-md cursor-pointer hover:scale-110 transition-transform ${
                        !isUnlocked && 'opacity-60'
                      }`}
                      style={{
                        borderColor: isUnlocked ? st.flagColor : '#f59e0b',
                        backgroundColor: isUnlocked ? `${st.flagColor}33` : '#78350f33',
                        color: isUnlocked ? st.flagColor : '#f59e0b',
                      }}
                      onClick={() => handleStationClick(st)}
                    >
                      {isUnlocked ? '🚩' : '🔒'}
                    </div>
                    <div className="w-1 h-6 bg-slate-600 rounded-full" />
                    {/* Golden Stepping Cobblestone Ring */}
                    <div className="w-8 h-3 rounded-full border border-amber-400 bg-amber-500/20" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* BOTTOM OF MAP: Glowing Treasure Chest & Motivation Box */}
          <div className="relative z-20 flex flex-col sm:flex-row justify-between items-end gap-4 mt-2 pt-3 border-t border-slate-800">
            {/* Bottom Left Motivation Card */}
            <div className="bg-[#0f172a]/90 border-2 border-slate-700 rounded-2xl p-3 max-w-xs shadow-lg flex items-center gap-3">
              <div className="text-2xl">🏆</div>
              <div>
                <div className="font-pixel text-[9px] text-amber-300 mb-0.5">This isn't luck.</div>
                <div className="text-[11px] text-slate-300 font-medium leading-tight">
                  It's a system. Clean code &amp; persistent daily practice. You can do this!
                </div>
              </div>
            </div>

            {/* Glowing Treasure Chest & $100/DAY UNLOCKED Banner */}
            <div
              onClick={() => setShowChestModal(true)}
              className="flex flex-col items-center cursor-pointer group"
              title="Click to inspect Graduation Vault"
            >
              <div className="transform group-hover:scale-105 transition-transform drop-shadow-[0_0_25px_rgba(250,204,21,0.5)]">
                <PixelTreasureChest size={90} />
              </div>
              <div className="mt-1 px-3 py-1 rounded-full bg-[#fbc02d] text-[#111429] font-pixel text-[10px] font-black border-2 border-[#111429] pixel-btn-shadow group-hover:bg-[#ffca28] transition-colors">
                $100/DAY UNLOCKED!
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            RIGHT SIDEBAR: Achievements & Unlocks (Matches Reference Exactly)
           ========================================================================= */}
        <div className="w-full lg:w-72 shrink-0 flex flex-col gap-4">
          {/* Top Card: ACHIEVEMENT UNLOCKED Toast */}
          <div className="bg-[#0f172a] border-2 border-amber-400/80 rounded-2xl p-3.5 shadow-xl pixel-card-shadow flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-xl shrink-0">
              🏆
            </div>
            <div>
              <div className="font-pixel text-[8px] text-amber-400 uppercase tracking-wider">
                ACHIEVEMENT UNLOCKED
              </div>
              <div className="font-pixel text-[10px] text-white mt-0.5">FIRST STEP</div>
              <div className="text-[10px] text-slate-400 leading-snug">
                You've started your BCA eco-tech journey!
              </div>
            </div>
          </div>

          {/* ACHIEVEMENTS Vertical Progression Panel */}
          <div className="bg-[#0b1220] border-2 border-slate-700/80 rounded-3xl p-4 shadow-xl flex-1 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <h3 className="font-pixel text-xs text-white">ACHIEVEMENTS</h3>
                </div>
                <span className="font-mono text-[10px] text-slate-400">5 / 5 Badges</span>
              </div>

              <div className="flex flex-col gap-3">
                {/* 1. Content Creator (Blue Shield) */}
                <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                  <PixelAchievementBadge type="blue" symbol="★" size={34} />
                  <div>
                    <div className="font-pixel text-[10px] text-cyan-300">CONTENT CREATOR</div>
                    <div className="text-[10px] text-slate-400">Clear your first Big-O code sprint</div>
                  </div>
                </div>

                {/* 2. Traffic Builder (Red Shield) */}
                <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                  <PixelAchievementBadge type="red" symbol="⛨" size={34} />
                  <div>
                    <div className="font-pixel text-[10px] text-rose-300">TRAFFIC BUILDER</div>
                    <div className="text-[10px] text-slate-400">Stream 100 zero-loss packets</div>
                  </div>
                </div>

                {/* 3. First Sale (Gold Shield) */}
                <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                  <PixelAchievementBadge type="gold" symbol="$" size={34} />
                  <div>
                    <div className="font-pixel text-[10px] text-amber-300">FIRST SALE</div>
                    <div className="text-[10px] text-slate-400">Index database &amp; earn tokens</div>
                  </div>
                </div>

                {/* 4. Product Creator (Green Crown) */}
                <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                  <PixelAchievementBadge type="green" symbol="♔" size={34} />
                  <div>
                    <div className="font-pixel text-[10px] text-emerald-300">PRODUCT CREATOR</div>
                    <div className="text-[10px] text-slate-400">Deploy clean memory Java app</div>
                  </div>
                </div>

                {/* 5. Income Milestone (Purple Trophy) */}
                <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                  <PixelAchievementBadge type="purple" symbol="🏆" size={34} />
                  <div>
                    <div className="font-pixel text-[10px] text-purple-300">INCOME MILESTONE</div>
                    <div className="text-[10px] text-slate-400">Reach $100/day &amp; eco degree</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action in Sidebar */}
            <div className="mt-4 pt-3 border-t border-slate-800">
              <button
                onClick={() => onNavigateTab('learn')}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 font-pixel text-[10px] text-white flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>OPEN BCA CURRICULUM</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          BOTTOM HUD BAR (XP, Currency, Rank, Play Sprint)
         ========================================================================= */}
      <div className="relative z-20 max-w-5xl mx-auto w-full bg-[#0d1527] border-2 border-[#1e293b] rounded-2xl p-3 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        {/* XP Status */}
        <div className="flex items-center gap-3">
          <span className="font-pixel text-[10px] text-emerald-400">XP</span>
          <div className="w-32 sm:w-48 bg-slate-800 h-3 rounded-full overflow-hidden border border-slate-700">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(16,185,129,0.8)]"
              style={{ width: `${Math.min(100, (progress.xp / 2500) * 100)}%` }}
            />
          </div>
          <span className="font-mono text-xs text-slate-300 font-bold">{progress.xp} / 2500</span>
        </div>

        {/* Currency Status */}
        <div className="flex items-center gap-2">
          <span className="font-pixel text-[10px] text-slate-400">CURRENCY</span>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-black/50 border border-amber-500/40 rounded-xl font-mono text-xs font-bold text-amber-300">
            <span>🪙</span>
            <span>{progress.recyclingTokens.toLocaleString()}</span>
          </div>
        </div>

        {/* Rank Badge */}
        <div className="flex items-center gap-2">
          <span className="font-pixel text-[10px] text-slate-400">RANK</span>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-950/60 border border-amber-500/50 rounded-xl font-pixel text-[10px] text-amber-300">
            <span>ENTREPRENEUR</span>
            <span className="text-amber-400">👑</span>
          </div>
        </div>

        {/* Sprint Launch Button */}
        <button
          onClick={() => handleStartSprint()}
          className="px-5 py-2.5 rounded-full bg-[#e54d58] hover:bg-[#ef5350] text-[#111429] font-pixel text-xs font-black border-2 border-[#111429] pixel-btn-shadow transition-transform active:translate-y-1 cursor-pointer flex items-center gap-2"
        >
          <Play className="w-3.5 h-3.5 fill-[#111429]" />
          <span>PLAY 3D SPRINT</span>
        </button>
      </div>

      {/* =========================================================================
          STATION MODAL: Deep BCA Study & Sprint Launcher for Chosen Milestone
         ========================================================================= */}
      {selectedStationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[#0b1329] border-4 border-amber-400 rounded-3xl p-6 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-start mb-3 pb-2 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 font-pixel text-sm flex items-center justify-center font-bold">
                  {selectedStationModal.badge}
                </span>
                <div>
                  <h3 className="font-pixel text-sm text-white">{selectedStationModal.title}</h3>
                  <div className="text-[11px] font-silkscreen text-amber-300">
                    {selectedStationModal.subTitle}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedStationModal(null)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              {selectedStationModal.description}
            </p>

            <div className="mb-4">
              <div className="text-xs font-pixel text-cyan-300 mb-2">CURRICULUM SYLLABUS TOPICS:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedStationModal.topics.map((t, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-200 flex items-center gap-1.5"
                  >
                    <CheckCircle className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-emerald-950/70 border border-emerald-500/40 rounded-xl p-3 mb-4 flex items-center justify-between text-xs text-emerald-300">
              <span>Green Computing Impact:</span>
              <span className="font-pixel text-white">{selectedStationModal.energySaving}</span>
            </div>

            {/* Prerequisite Check / Respected Notes & Games */}
            {(() => {
              const activeStationIdx = stations.findIndex(s => s.id === selectedStationModal.id);
              const unlockCheck = storageService.isTopicUnlocked(activeStationIdx >= 0 ? activeStationIdx : 0, allModules, progress);

              if (!unlockCheck.isUnlocked) {
                return (
                  <div className="bg-amber-950/40 border-2 border-amber-500/50 rounded-2xl p-4 mb-4 text-left animate-in fade-in">
                    <div className="flex items-center gap-2 text-amber-300 font-pixel text-xs mb-1.5">
                      <Lock className="w-4 h-4 text-amber-400" />
                      <span>CONCEPT LOCKED BY UNIVERSITY PREREQUISITE</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed mb-3">
                      To access notes and games for <strong>{selectedStationModal.title}</strong>, university curriculum progression requires you to score at least <strong>75%</strong> on the quiz for <strong>{unlockCheck.prerequisiteModule?.title || `Unit ${selectedStationModal.id - 1}`}</strong>.
                    </p>
                    <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 flex items-center justify-between text-xs mb-3">
                      <span className="text-slate-400">Current Prerequisite Score:</span>
                      <span className="font-mono font-bold text-amber-400">
                        {unlockCheck.prerequisiteScore}% <span className="text-slate-500">/ 75% required</span>
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedStationModal(null);
                        onNavigateTab('learn');
                      }}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-pixel text-xs font-bold flex items-center justify-center gap-1.5 shadow transition-transform active:scale-95 cursor-pointer"
                    >
                      <span>GO TO PREREQUISITE QUIZ (NEED 75%+)</span>
                    </button>
                  </div>
                );
              }

              return (
                <>
                  {/* Respected Notes Launcher */}
                  <div className="mb-4">
                    <button
                      onClick={() => {
                        setSelectedStationModal(null);
                        if (onOpenTopicNotes && activeModuleForModal) {
                          onOpenTopicNotes(activeModuleForModal);
                        } else {
                          onNavigateTab('learn');
                        }
                      }}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-blue-500 text-white font-pixel text-xs flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer border border-cyan-400/50"
                    >
                      <BookOpen className="w-4 h-4 text-cyan-200" />
                      <span>READ RESPECTED NOTES &amp; CODE FOR {selectedStationModal.badge}</span>
                    </button>
                  </div>

                  {/* 3 Games available for this topic */}
                  <div className="pt-3 border-t border-slate-700/80">
                    <div className="text-[10px] font-pixel text-amber-300 uppercase mb-2 flex items-center gap-1.5">
                      <Gamepad2 className="w-3.5 h-3.5 text-amber-400" />
                      <span>PLAY 3 GAMES FOR THIS TOPIC:</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {/* Game 1: 3D Sprint */}
                      <button
                        onClick={() => {
                          setSelectedStationModal(null);
                          handleStartSprint(selectedStationModal);
                        }}
                        className="p-2.5 rounded-xl bg-red-950/70 hover:bg-red-900/90 border border-red-500/50 text-red-200 text-center flex flex-col items-center gap-1 transition-transform active:scale-95 cursor-pointer shadow"
                      >
                        <span className="text-sm">🏃</span>
                        <span className="font-pixel text-[9px] text-white">3D SPRINT</span>
                      </button>

                      {/* Game 2: Snakes & Ladders */}
                      <button
                        onClick={() => {
                          setSelectedStationModal(null);
                          if (onOpenMiniGame) {
                            onOpenMiniGame('snakes', {
                              topicTitle: selectedStationModal.title,
                              moduleId: selectedStationModal.moduleId,
                              questions: activeModuleForModal?.quizQuestions
                            });
                          } else {
                            onNavigateTab('games');
                          }
                        }}
                        className="p-2.5 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/90 border border-emerald-500/50 text-emerald-200 text-center flex flex-col items-center gap-1 transition-transform active:scale-95 cursor-pointer shadow"
                      >
                        <Dice5 className="w-4 h-4 text-emerald-400" />
                        <span className="font-pixel text-[9px] text-white">SNAKES</span>
                      </button>

                      {/* Game 3: Kahoot Blitz */}
                      <button
                        onClick={() => {
                          setSelectedStationModal(null);
                          if (onOpenMiniGame) {
                            onOpenMiniGame('kahoot', {
                              topicTitle: selectedStationModal.title,
                              moduleId: selectedStationModal.moduleId,
                              questions: activeModuleForModal?.quizQuestions
                            });
                          } else {
                            onNavigateTab('games');
                          }
                        }}
                        className="p-2.5 rounded-xl bg-amber-950/70 hover:bg-amber-900/90 border border-amber-500/50 text-amber-200 text-center flex flex-col items-center gap-1 transition-transform active:scale-95 cursor-pointer shadow"
                      >
                        <Flame className="w-4 h-4 text-amber-400 fill-current" />
                        <span className="font-pixel text-[9px] text-white">KAHOOT</span>
                      </button>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* =========================================================================
          TREASURE CHEST MODAL ($100/DAY UNLOCKED VAULT)
         ========================================================================= */}
      {showChestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[#0f172a] border-4 border-amber-400 rounded-3xl p-6 max-w-md w-full shadow-2xl text-center">
            <div className="flex justify-center mb-3">
              <PixelTreasureChest size={100} />
            </div>
            <h3 className="font-pixel text-base text-amber-300 mb-1">$100/DAY UNLOCKED!</h3>
            <div className="text-xs font-silkscreen text-emerald-400 mb-3">
              ECO GRADUATION &amp; CAREER MILESTONE
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Congratulations! By mastering Big-O algorithm efficiency, zero-loss routing, SQL indexing, and green cloud systems, you unlock high-paying software engineering opportunities and carbon-neutral certification.
            </p>

            <div className="bg-slate-900 border border-amber-500/40 rounded-xl p-3 mb-4 text-xs flex justify-around font-mono">
              <div>
                <div className="text-slate-400">REWARD TOKENS</div>
                <div className="text-amber-400 font-bold text-sm">+5,000 🪙</div>
              </div>
              <div>
                <div className="text-slate-400">CERTIFICATE</div>
                <div className="text-cyan-300 font-bold text-sm">BCA HONORS</div>
              </div>
            </div>

            <button
              onClick={() => setShowChestModal(false)}
              className="w-full py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-pixel text-xs font-black border-2 border-black"
            >
              CLAIM &amp; CONTINUE SPRINTING
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
