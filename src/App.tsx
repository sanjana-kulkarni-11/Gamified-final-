/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GameMode, CharacterConfig, CharacterSkin, StudentProgress, PowerUpActiveState, RunSummary, QuizQuestion, LearningModule } from './types/game';
import { INITIAL_CHARACTERS, INITIAL_SKINS, INITIAL_MISSIONS } from './data/initialData';
import { storageService } from './services/storageService';
import { soundManager } from './audio/soundManager';

// Components
import { GameCanvas } from './components/game/GameCanvas';
import { GameHUD } from './components/game/GameHUD';
import { StartMenu } from './components/game/StartMenu';
import { CampaignRoadMap } from './components/game/CampaignRoadMap';
import { PauseModal } from './components/game/PauseModal';
import { GameOverModal } from './components/game/GameOverModal';
import { KnowledgeCheckpointModal } from './components/game/KnowledgeCheckpointModal';
import { StudentDashboard } from './components/platform/StudentDashboard';
import { TeacherDashboard } from './components/platform/TeacherDashboard';
import { AdminModuleBuilder } from './components/platform/AdminModuleBuilder';
import { LeaderboardView } from './components/platform/LeaderboardView';
import { ShopView } from './components/platform/ShopView';
import { AchievementsView } from './components/platform/AchievementsView';
import { SettingsModal } from './components/platform/SettingsModal';
import { CodeSnakesAndLadders } from './components/games/CodeSnakesAndLadders';
import { KahootBlitzArena } from './components/games/KahootBlitzArena';
import { SyllabusUploadModal } from './components/platform/SyllabusUploadModal';
import { TopicNotesModal } from './components/platform/TopicNotesModal';
import { LoginModal } from './components/platform/LoginModal';
import { ReferenceLanding } from './components/platform/ReferenceLanding';

import { Play, BookOpen, Trophy, ShoppingBag, Award, Users, ShieldAlert, Settings, Volume2, VolumeX, Coins, Zap, Map, Gamepad2, Dice5, Flame, Upload, UserRound, LogOut } from 'lucide-react';

export default function App() {
  const [progress, setProgress] = useState<StudentProgress>(storageService.getProgress());
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => storageService.isUserLoggedIn());
  const [showLoginModal, setShowLoginModal] = useState<boolean>(() => !storageService.isUserLoggedIn());
  const [showReferenceLanding, setShowReferenceLanding] = useState<boolean>(true);
  const [currentTab, setCurrentTab] = useState<'hub' | 'games' | 'learn' | 'leaderboard' | 'shop' | 'achievements' | 'teacher' | 'admin'>('hub');
  const [hubView, setHubView] = useState<'campaign' | 'arcade'>('campaign');
  const [activeMiniGame, setActiveMiniGame] = useState<'none' | 'snakes' | 'kahoot'>('none');
  
  // Syllabus & Topic Notes state
  const [showSyllabusUploadModal, setShowSyllabusUploadModal] = useState<boolean>(false);
  const [activeNotesModule, setActiveNotesModule] = useState<LearningModule | null>(null);
  const [activeTopicContext, setActiveTopicContext] = useState<{
    topicTitle: string;
    moduleId?: string;
    questions?: QuizQuestion[];
  } | null>(null);
  const [roadmapRefreshKey, setRoadmapRefreshKey] = useState<number>(0);
  
  // Game lifecycle
  const [gameState, setGameState] = useState<'menu' | 'countdown' | 'playing' | 'paused' | 'checkpoint' | 'gameover'>('menu');
  const [gameMode, setGameMode] = useState<GameMode>('endless');
  const [countdownNum, setCountdownNum] = useState<number>(3);
  
  // Active in-game stats for HUD
  const [currentScore, setCurrentScore] = useState<number>(0);
  const [currentDistance, setCurrentDistance] = useState<number>(0);
  const [currentOrbs, setCurrentOrbs] = useState<number>(0);
  const [currentTokens, setCurrentTokens] = useState<number>(0);
  const [currentMultiplier, setCurrentMultiplier] = useState<number>(1);
  const [activePowerUps, setActivePowerUps] = useState<PowerUpActiveState[]>([]);

  // Post-game stats
  const [gameOverStats, setGameOverStats] = useState<{
    score: number;
    distance: number;
    orbs: number;
    tokens: number;
    knowledgeFragments: number;
    codeGatesCleared: number;
    multiplier: number;
  }>({ score: 0, distance: 0, orbs: 0, tokens: 0, knowledgeFragments: 0, codeGatesCleared: 0, multiplier: 1 });
  const [isNewHigh, setIsNewHigh] = useState<boolean>(false);
  const [lastXpEarned, setLastXpEarned] = useState<number>(0);
  const [gateFeedback, setGateFeedback] = useState<{ title: string; subtitle: string; isOptimal: boolean; explanation: string } | null>(null);

  // Audio and Settings
  const [isMuted, setIsMuted] = useState<boolean>(soundManager.getIsMuted());
  const [showSettings, setShowSettings] = useState<boolean>(false);

  // Selected character and skin
  const selectedCharacter = INITIAL_CHARACTERS.find((c) => c.id === progress.selectedCharacterId) || INITIAL_CHARACTERS[0];
  const selectedSkin = INITIAL_SKINS.find((s) => s.id === progress.selectedSkinId);

  const handleSelectCharacter = (char: CharacterConfig) => {
    const updated = { ...progress, selectedCharacterId: char.id };
    storageService.saveProgress(updated);
    setProgress(updated);
  };

  const handleToggleMute = () => {
    const nextMuted = soundManager.toggleMute();
    setIsMuted(nextMuted);
  };

  const handleLogout = () => {
    storageService.logoutUser();
    setIsLoggedIn(false);
    setShowReferenceLanding(true);
    setCurrentTab('hub');
    setGameState('menu');
    setShowLoginModal(true);
  };

  // Start game flow with 3-2-1 countdown
  const handleStartGame = (mode: GameMode, topicContext?: { topicTitle: string; moduleId?: string; questions?: QuizQuestion[] }) => {
    if (topicContext) {
      setActiveTopicContext(topicContext);
    }
    setGameMode(mode);
    setGameState('countdown');
    setCountdownNum(3);
    soundManager.playCountdown(false);

    let count = 3;
    const interval = window.setInterval(() => {
      count--;
      if (count > 0) {
        setCountdownNum(count);
        soundManager.playCountdown(false);
      } else if (count === 0) {
        setCountdownNum(0); // "GO!"
        soundManager.playCountdown(true);
      } else {
        window.clearInterval(interval);
        setGameState('playing');
      }
    }, 800);
  };

  const handleLandingNavigation = (tab: 'learn' | 'games' | 'achievements') => {
    setShowReferenceLanding(false);
    setActiveMiniGame('none');
    setCurrentTab(tab);
  };

  const handlePlayTopicGame = (gameType: 'runner' | 'snakes' | 'kahoot', module: LearningModule) => {
    const topicCtx = {
      topicTitle: module.title,
      moduleId: module.id,
      questions: module.quizQuestions,
    };
    setActiveTopicContext(topicCtx);

    if (gameType === 'runner') {
      handleStartGame('endless', topicCtx);
    } else if (gameType === 'snakes') {
      setActiveMiniGame('snakes');
      setCurrentTab('games');
    } else if (gameType === 'kahoot') {
      setActiveMiniGame('kahoot');
      setCurrentTab('games');
    }
  };

  const handleGateFeedback = (fb: { title: string; subtitle: string; isOptimal: boolean; explanation: string }) => {
    setGateFeedback(fb);
    setTimeout(() => {
      setGateFeedback(null);
    }, 3600);
  };

  const handleGameOver = (finalStats: {
    score: number;
    distance: number;
    orbs: number;
    tokens: number;
    knowledgeFragments: number;
    codeGatesCleared: number;
    multiplier: number;
  }) => {
    setGameOverStats(finalStats);
    const wasNewHigh = finalStats.score > progress.highScore;
    setIsNewHigh(wasNewHigh);

    // Calculate XP: 1 XP per 10m + 5 XP per orb + 10 XP per token + 50 per knowledge fragment + 100 per gate
    const xpEarned = Math.round(
      finalStats.distance * 0.1 + finalStats.orbs * 5 + finalStats.tokens * 10 + finalStats.knowledgeFragments * 50 + (finalStats.codeGatesCleared || 0) * 100
    );
    setLastXpEarned(xpEarned);

    const runSummary: RunSummary = {
      id: `run_${Date.now()}`,
      date: new Date().toISOString(),
      mode: gameMode,
      characterId: selectedCharacter.id,
      score: finalStats.score,
      distance: finalStats.distance,
      energyOrbs: finalStats.orbs,
      recyclingTokens: finalStats.tokens,
      knowledgeFragments: finalStats.knowledgeFragments,
      codeGatesCleared: finalStats.codeGatesCleared || 0,
      maxMultiplier: finalStats.multiplier,
      durationSeconds: Math.round(finalStats.distance / 20),
      xpEarned,
      environmentalFact: {
        title: 'BCA Green Computing & Algorithms',
        fact: 'Replacing O(n²) sorting with O(n log n) reduces server power draw by over 60%.',
        bcaTakeaway: 'Always analyze Big-O runtime and cache locality when architecting software systems.',
      },
    };

    const result = storageService.saveRun(runSummary);
    setProgress(result.updatedProgress);
    setGameState('gameover');
  };

  const handleCheckpointComplete = (correct: boolean) => {
    if (correct) {
      // Award instant bonus
      setCurrentScore((prev) => prev + 1000);
      setCurrentTokens((prev) => prev + 10);
    }
    setGameState('playing');
  };

  return (
    <div className="ecorush-theme flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden select-none font-sans">
      {/* Platform Navigation Bar (visible unless actively running in full focus) */}
      {gameState === 'menu' && !showReferenceLanding && (
        <header className="h-16 border-b-2 border-[#1e293b] bg-[#0c1222]/95 backdrop-blur-md px-4 flex items-center justify-between z-30 shrink-0 shadow-lg">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <div
                onClick={() => {
                  setCurrentTab('hub');
                  setShowReferenceLanding(true);
                }}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#fbc02d] to-[#e54d58] border-2 border-black flex items-center justify-center text-slate-950 font-black text-lg shadow-md group-hover:scale-105 transition-transform">
                🌱
              </div>
              <div>
                <div className="font-pixel text-xs tracking-tight text-white uppercase flex items-center gap-1.5">
                  <span>ECO<span className="text-amber-400">RUSH</span></span>
                  <span className="text-[9px] font-pixel px-1.5 py-0.5 rounded bg-blue-950 text-cyan-300 border border-cyan-500/30">
                    BCA
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-silkscreen">Gamification in BCA Education</div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5">
            <button
              onClick={() => {
                setCurrentTab('hub');
                setHubView('campaign');
              }}
              className={`px-3.5 py-1.5 rounded-full text-[11px] font-silkscreen uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer border-2 ${
                currentTab === 'hub' && hubView === 'campaign'
                  ? 'bg-[#fbc02d] text-[#111429] font-black border-[#111429] shadow'
                  : 'text-slate-300 border-transparent hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>Road to $100/Day</span>
            </button>

            <button
              onClick={() => {
                setCurrentTab('hub');
                setHubView('arcade');
              }}
              className={`px-3 py-1.5 rounded-full text-[11px] font-silkscreen uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer border-2 ${
                currentTab === 'hub' && hubView === 'arcade'
                  ? 'bg-[#e54d58] text-[#111429] font-black border-[#111429] shadow'
                  : 'text-slate-300 border-transparent hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Arcade Intro</span>
            </button>

            <button
              onClick={() => {
                setActiveMiniGame('none');
                setCurrentTab('games');
              }}
              className={`px-3.5 py-1.5 rounded-full text-[11px] font-silkscreen uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer border-2 ${
                currentTab === 'games'
                  ? 'bg-emerald-400 text-slate-950 font-black border-emerald-300 shadow'
                  : 'text-slate-300 border-transparent hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>Study Games</span>
            </button>

            <button
              onClick={() => setCurrentTab('learn')}
              className={`px-3.5 py-1.5 rounded-full text-[11px] font-silkscreen uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer border-2 ${
                currentTab === 'learn'
                  ? 'bg-cyan-400 text-slate-950 font-black border-cyan-300 shadow'
                  : 'text-slate-300 border-transparent hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>BCA Courses</span>
            </button>

            <button
              onClick={() => setCurrentTab('leaderboard')}
              className={`px-3.5 py-1.5 rounded-full text-[11px] font-silkscreen uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer border-2 ${
                currentTab === 'leaderboard'
                  ? 'bg-amber-400 text-slate-950 font-black border-amber-300 shadow'
                  : 'text-slate-300 border-transparent hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Leaderboard</span>
            </button>

            <button
              onClick={() => setCurrentTab('shop')}
              className={`px-3.5 py-1.5 rounded-full text-[11px] font-silkscreen uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer border-2 ${
                currentTab === 'shop'
                  ? 'bg-purple-400 text-slate-950 font-black border-purple-300 shadow'
                  : 'text-slate-300 border-transparent hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Eco Shop</span>
            </button>

            <button
              onClick={() => setCurrentTab('achievements')}
              className={`px-3.5 py-1.5 rounded-full text-[11px] font-silkscreen uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer border-2 ${
                currentTab === 'achievements'
                  ? 'bg-teal-400 text-slate-950 font-black border-teal-300 shadow'
                  : 'text-slate-300 border-transparent hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Accolades</span>
            </button>

            {/* Direct Syllabus Upload Shortcut */}
            <button
              onClick={() => setShowSyllabusUploadModal(true)}
              className="px-3.5 py-1.5 rounded-full text-[11px] font-silkscreen uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer border-2 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black border-black shadow hover:scale-105 active:scale-95"
            >
              <Upload className="w-3.5 h-3.5 text-slate-950" />
              <span>Upload Syllabus</span>
            </button>

            {/* Role-Specific Portal Tabs */}
            {progress.role === 'teacher' && (
              <button
                onClick={() => setCurrentTab('teacher')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                  currentTab === 'teacher'
                    ? 'bg-cyan-400 text-slate-950 font-black shadow-md'
                    : 'text-cyan-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Faculty Analytics</span>
              </button>
            )}

            {progress.role === 'admin' && (
              <button
                onClick={() => setCurrentTab('admin')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                  currentTab === 'admin'
                    ? 'bg-rose-500 text-slate-950 font-black shadow-md'
                    : 'text-rose-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Admin Console</span>
              </button>
            )}
          </nav>

          {/* Right Action Cluster: Profile and Audio */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowLoginModal(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 hover:text-white hover:border-emerald-500/50 text-xs"
              title="Switch local profile"
            >
              <UserRound className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline max-w-28 truncate">{progress.nickname}</span>
            </button>

            <button
              onClick={handleLogout}
              className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-rose-300 hover:border-rose-500/50 flex items-center justify-center transition-colors"
              title="Sign out"
              aria-label="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>

            {/* Token Pill */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold">
              <Coins className="w-3.5 h-3.5" />
              <span>{progress.recyclingTokens}</span>
            </div>

            {/* Audio Toggle */}
            <button
              onClick={handleToggleMute}
              className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              title="Toggle Audio"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Settings */}
            <button
              onClick={() => setShowSettings(true)}
              className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              title="Game Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </header>
      )}

      {/* Main Content Viewport */}
      {gameState === 'menu' && showReferenceLanding ? (
        <ReferenceLanding
          onLaunchGame={() => handleLandingNavigation('games')}
          onNavigate={handleLandingNavigation}
          onOpenProfile={() => setShowLoginModal(true)}
          role={progress.role}
          nickname={progress.nickname}
        />
      ) : (
      <main className="flex-1 relative overflow-hidden flex flex-col">
        {gameState === 'menu' ? (
          <div className="flex-1 overflow-y-auto">
            {currentTab === 'hub' && (
              hubView === 'campaign' ? (
                <CampaignRoadMap
                  key={roadmapRefreshKey}
                  progress={progress}
                  selectedCharacter={selectedCharacter}
                  selectedSkin={selectedSkin}
                  onSelectCharacter={handleSelectCharacter}
                  onStartGame={handleStartGame}
                  onNavigateTab={(t) => setCurrentTab(t)}
                  onOpenMiniGame={(g, topicCtx) => {
                    if (topicCtx) setActiveTopicContext(topicCtx);
                    setActiveMiniGame(g);
                    setCurrentTab('games');
                  }}
                  onOpenSyllabusUpload={() => setShowSyllabusUploadModal(true)}
                  onOpenTopicNotes={(mod) => setActiveNotesModule(mod)}
                />
              ) : (
                <StartMenu
                  progress={progress}
                  selectedCharacter={selectedCharacter}
                  selectedSkin={selectedSkin}
                  onSelectCharacter={handleSelectCharacter}
                  onStartGame={handleStartGame}
                  onNavigateTab={(t) => setCurrentTab(t)}
                />
              )
            )}

            {/* Study Games Arcade Hub & Mini-Games */}
            {currentTab === 'games' && (
              activeMiniGame === 'snakes' ? (
                <CodeSnakesAndLadders
                  progress={progress}
                  onUpdateProgress={setProgress}
                  onExit={() => {
                    setActiveMiniGame('none');
                    setActiveTopicContext(null);
                  }}
                  activeTopicTitle={activeTopicContext?.topicTitle}
                  topicQuestions={activeTopicContext?.questions}
                />
              ) : activeMiniGame === 'kahoot' ? (
                <KahootBlitzArena
                  progress={progress}
                  onUpdateProgress={setProgress}
                  onExit={() => {
                    setActiveMiniGame('none');
                    setActiveTopicContext(null);
                  }}
                  activeTopicTitle={activeTopicContext?.topicTitle}
                  topicQuestions={activeTopicContext?.questions}
                />
              ) : (
                <div className="max-w-6xl mx-auto p-4 sm:p-6 animate-in fade-in duration-300">
                  {/* Hero Header */}
                  <div className="bg-slate-900/90 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md mb-8 relative overflow-hidden">
                    <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-emerald-500/10 to-transparent pointer-events-none" />
                    <div className="relative z-10 max-w-2xl">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-3">
                        <Gamepad2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Curriculum Play Arena</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide mb-2">
                        BCA Study-While-Winning Games Hub
                      </h2>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        Master the entire BCA semester syllabus while playing! Dodge memory leaks in the 3D runner, tame bug bites with defense queries in Snakes & Ladders, and outsmart your classmates in live Kahoot blitzes.
                      </p>
                    </div>
                  </div>

                  {/* 3 Games Selection Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Game 1: 3D Infinite Cyber-Runner */}
                    <div className="bg-slate-900 border-2 border-cyan-500/40 hover:border-cyan-400 rounded-3xl p-6 shadow-xl flex flex-col justify-between transition-all hover:scale-[1.01]">
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <div className="w-14 h-14 rounded-2xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-3xl shadow-inner">
                            🏃‍♂️
                          </div>
                          <span className="text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded-full">
                            3D Action
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1">
                          3D Eco-Runner
                        </h3>
                        <div className="text-xs font-mono text-cyan-400 mb-3 font-semibold">
                          Relaxed Speed & Far Distance Sprint
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed mb-4">
                          Sprint through a futuristic campus at an accessible 11.5 m/s speed with generous spacing, 2 emergency recovery shields, and holographic syllabus gates!
                        </p>
                        <div className="space-y-1.5 text-xs text-slate-400 font-mono mb-4">
                          <div>✓ Accessible speed &amp; floaty jumps</div>
                          <div>✓ 2 Emergency Recovery Shields</div>
                          <div>✓ Big-O Holographic Gate Choices</div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 pt-4 border-t border-slate-800">
                        <button
                          onClick={() => handleStartGame('endless')}
                          className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-900/30 transition-all flex items-center justify-center gap-2"
                        >
                          <Play className="w-3.5 h-3.5 fill-slate-950" />
                          <span>Launch Endless Run</span>
                        </button>
                        <button
                          onClick={() => handleStartGame('knowledge')}
                          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold border border-slate-700 transition-all"
                        >
                          Knowledge Checkpoint Mode
                        </button>
                      </div>
                    </div>

                    {/* Game 2: Code Snakes & Algorithmic Ladders */}
                    <div className="bg-slate-900 border-2 border-emerald-500/50 hover:border-emerald-400 rounded-3xl p-6 shadow-xl flex flex-col justify-between transition-all hover:scale-[1.01]">
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <div className="w-14 h-14 rounded-2xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-3xl shadow-inner">
                            🎲
                          </div>
                          <span className="text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full">
                            Turn-Based Board
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1">
                          Code Snakes & Ladders
                        </h3>
                        <div className="text-xs font-mono text-emerald-400 mb-3 font-semibold">
                          Ludo Snake &amp; Bite with Quiz Defense
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed mb-4">
                          100-tile serpentine board with dice rolls. Bug snakes attempt to bite and drag you down, but answering BCA syllabus questions tames them and neutralizes bites!
                        </p>
                        <div className="space-y-1.5 text-xs text-slate-400 font-mono mb-4">
                          <div>✓ 100 tiles with 3D animated dice</div>
                          <div>✓ Tame bugs with syllabus quiz defense</div>
                          <div>✓ Algorithmic ladder acceleration</div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-800">
                        <button
                          onClick={() => setActiveMiniGame('snakes')}
                          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-900/30 transition-all flex items-center justify-center gap-2"
                        >
                          <Dice5 className="w-4 h-4" />
                          <span>Play Code Snakes</span>
                        </button>
                      </div>
                    </div>

                    {/* Game 3: BCA Kahoot Blitz Arena */}
                    <div className="bg-slate-900 border-2 border-purple-500/50 hover:border-purple-400 rounded-3xl p-6 shadow-xl flex flex-col justify-between transition-all hover:scale-[1.01]">
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <div className="w-14 h-14 rounded-2xl bg-purple-950 border border-purple-500/40 flex items-center justify-center text-3xl shadow-inner">
                            ⚡
                          </div>
                          <span className="text-[10px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-800 px-2 py-0.5 rounded-full">
                            Live Arena
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1">
                          BCA Kahoot Blitz Arena
                        </h3>
                        <div className="text-xs font-mono text-purple-400 mb-3 font-semibold">
                          4-Color Class Quiz Championship
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed mb-4">
                          Authentic 4-color Kahoot quiz battle against simulated classmates. Speed-based score multipliers, fire streaks, live scoreboard, and podium trophy!
                        </p>
                        <div className="space-y-1.5 text-xs text-slate-400 font-mono mb-4">
                          <div>✓ Signature 4-color Kahoot answer pads</div>
                          <div>✓ Speed multipliers &amp; fire streaks</div>
                          <div>✓ Live scoreboard &amp; podium celebration</div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-800">
                        <button
                          onClick={() => setActiveMiniGame('kahoot')}
                          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-purple-900/30 transition-all flex items-center justify-center gap-2"
                        >
                          <Flame className="w-4 h-4 fill-white" />
                          <span>Enter Kahoot Arena</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
            {currentTab === 'learn' && (
              <StudentDashboard
                key={roadmapRefreshKey}
                progress={progress}
                onUpdateProgress={setProgress}
                onPlayGame={handlePlayTopicGame}
                onOpenSyllabusUpload={() => setShowSyllabusUploadModal(true)}
                onOpenTopicNotesModal={(mod) => setActiveNotesModule(mod)}
              />
            )}
            {currentTab === 'leaderboard' && <LeaderboardView />}
            {currentTab === 'shop' && <ShopView progress={progress} onUpdateProgress={setProgress} />}
            {currentTab === 'achievements' && <AchievementsView progress={progress} onUpdateProgress={setProgress} />}
            {currentTab === 'teacher' && (progress.role === 'teacher' || progress.role === 'admin') && <TeacherDashboard />}
            {currentTab === 'admin' && progress.role === 'admin' && <AdminModuleBuilder />}
          </div>
        ) : (
          /* Active Gameplay Viewport */
          <div className="relative w-full h-full">
            <GameCanvas
              mode={gameMode}
              character={selectedCharacter}
              skin={selectedSkin}
              restorationLevel={progress.restorationLevel}
              onScoreUpdate={(s, d, o, t, m) => {
                setCurrentScore(s);
                setCurrentDistance(d);
                setCurrentOrbs(o);
                setCurrentTokens(t);
                setCurrentMultiplier(m);
              }}
              onPowerUpUpdate={setActivePowerUps}
              onKnowledgeFragment={() => {
                if (gameMode === 'knowledge') {
                  setGameState('checkpoint');
                }
              }}
              onGateFeedback={handleGateFeedback}
              onGameOver={handleGameOver}
              isPaused={gameState === 'paused' || gameState === 'checkpoint'}
              onTogglePause={() => {
                setGameState((prev) => (prev === 'paused' ? 'playing' : 'paused'));
              }}
            />

            {/* In-Game Heads-Up Display (HUD) */}
            <GameHUD
              score={currentScore}
              highScore={progress.highScore}
              distance={currentDistance}
              orbs={currentOrbs}
              tokens={currentTokens}
              multiplier={currentMultiplier}
              activePowerUps={activePowerUps}
              restorationLevel={progress.restorationLevel}
              gateFeedback={gateFeedback}
              onPause={() => setGameState('paused')}
              isMuted={isMuted}
              onToggleMute={handleToggleMute}
            />

            {/* Countdown Overlay (3 - 2 - 1 - GO!) */}
            {gameState === 'countdown' && (
              <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm pointer-events-none">
                <div className="text-center animate-in zoom-in-75 duration-300">
                  <div className="text-8xl sm:text-9xl font-black font-mono tracking-tighter text-emerald-400 drop-shadow-[0_0_35px_rgba(16,185,129,0.7)]">
                    {countdownNum > 0 ? countdownNum : 'GO!'}
                  </div>
                  <div className="text-sm font-bold uppercase tracking-widest text-slate-300 mt-2">
                    {countdownNum > 0 ? 'Charging Kinetic Turbines...' : 'Sprint For A Greener Future!'}
                  </div>
                </div>
              </div>
            )}

            {/* Pause Modal */}
            {gameState === 'paused' && (
              <PauseModal
                onResume={() => setGameState('playing')}
                onRestart={() => handleStartGame(gameMode)}
                onHome={() => setGameState('menu')}
                isMuted={isMuted}
                onToggleMute={handleToggleMute}
              />
            )}

            {/* Knowledge Checkpoint Modal */}
            {gameState === 'checkpoint' && (
              <KnowledgeCheckpointModal
                questions={activeTopicContext?.questions}
                activeTopicTitle={activeTopicContext?.topicTitle}
                onComplete={handleCheckpointComplete}
              />
            )}

            {/* Game Over Modal */}
            {gameState === 'gameover' && (
              <GameOverModal
                stats={gameOverStats}
                highScore={progress.highScore}
                isNewHigh={isNewHigh}
                xpEarned={lastXpEarned}
                onRestart={() => handleStartGame(gameMode)}
                onHome={() => setGameState('menu')}
              />
            )}
          </div>
        )}
      </main>
      )}

      {/* Settings Modal */}
      {showLoginModal && (
        <LoginModal
          currentProgress={progress}
          canClose={isLoggedIn}
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={(updated) => {
            setProgress(updated);
            setIsLoggedIn(true);
            setShowReferenceLanding(true);
            setCurrentTab('hub');
            setHubView('campaign');
            setShowLoginModal(false);
          }}
        />
      )}

      {showSettings && (
        <SettingsModal
          progress={progress}
          onUpdateProgress={setProgress}
          onClose={() => setShowSettings(false)}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />
      )}

      {/* Syllabus Upload & Topic Roadmap Synthesizer */}
      {showSyllabusUploadModal && (
        <SyllabusUploadModal
          onClose={() => setShowSyllabusUploadModal(false)}
          onSyllabusApplied={() => {
            setRoadmapRefreshKey((prev) => prev + 1);
            setCurrentTab('hub');
            setHubView('campaign');
          }}
        />
      )}

      {/* Topic Respected Notes Modal */}
      {activeNotesModule && (
        <TopicNotesModal
          module={activeNotesModule}
          onClose={() => setActiveNotesModule(null)}
          onPlayGame={(gameType, mod) => {
            setActiveNotesModule(null);
            handlePlayTopicGame(gameType, mod);
          }}
        />
      )}
    </div>
  );
}
