/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GameMode, CharacterConfig, CharacterSkin, StudentProgress } from '../../types/game';
import { INITIAL_CHARACTERS } from '../../data/initialData';
import { soundManager } from '../../audio/soundManager';
import {
  PixelCloud,
  PixelStar,
  PixelBook,
  PixelFlask,
  PixelHeart,
  PixelGraduateAvatar,
  PixelPetCat,
  PixelCursor,
} from '../pixel/PixelArtAssets';
import {
  Play,
  Zap,
  BookOpen,
  Trophy,
  ShoppingBag,
  Sparkles,
  Layers,
  ChevronDown,
  Award,
  Cpu,
  GraduationCap
} from 'lucide-react';

interface StartMenuProps {
  progress: StudentProgress;
  selectedCharacter: CharacterConfig;
  selectedSkin?: CharacterSkin;
  onSelectCharacter: (char: CharacterConfig) => void;
  onStartGame: (mode: GameMode) => void;
  onNavigateTab: (tab: 'hub' | 'learn' | 'leaderboard' | 'shop' | 'achievements' | 'teacher' | 'admin') => void;
}

export const StartMenu: React.FC<StartMenuProps> = ({
  progress,
  selectedCharacter,
  onSelectCharacter,
  onStartGame,
  onNavigateTab,
}) => {
  const [selectedMode, setSelectedMode] = useState<GameMode>('endless');
  const [showOptionsPanel, setShowOptionsPanel] = useState<boolean>(false);
  const [showCharacterModal, setShowCharacterModal] = useState<boolean>(false);

  const modes: { id: GameMode; title: string; desc: string; icon: string; tag: string }[] = [
    {
      id: 'endless',
      title: 'Endless Run',
      desc: 'Infinite 3D smart city sprint with live BCA Code Gates & power-ups.',
      icon: '⚡',
      tag: 'Classic 3D',
    },
    {
      id: 'knowledge',
      title: 'Knowledge Run',
      desc: 'Turbocharged sprint loaded with BCA Exam Checkpoints & bonus tokens.',
      icon: '🎓',
      tag: 'BCA Challenge',
    },
    {
      id: 'missions',
      title: 'Eco Missions',
      desc: 'Complete high-impact urban greening objectives across Bengaluru.',
      icon: '🌱',
      tag: 'Quests',
    },
    {
      id: 'daily',
      title: 'Daily Challenge',
      desc: 'Fixed daily seed route with 250 bonus recycling tokens.',
      icon: '📅',
      tag: 'Daily 2X',
    },
  ];

  const handlePlayClick = () => {
    soundManager.playCountdown(true);
    onStartGame(selectedMode);
  };

  const handleBackClick = () => {
    soundManager.playWhoosh();
    setShowOptionsPanel((prev) => !prev);
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] bg-retro-grid text-white flex flex-col justify-between overflow-x-hidden select-none p-3 sm:p-6">
      {/* Pixel Clouds in the Sky */}
      <div className="absolute top-2 left-2 sm:left-8 pointer-events-none z-0 opacity-90 animate-pixel-float">
        <PixelCloud className="w-36 sm:w-56 h-auto" />
      </div>

      <div className="absolute top-3 right-2 sm:right-8 pointer-events-none z-0 opacity-90 animate-pixel-float" style={{ animationDelay: '1.8s' }}>
        <PixelCloud className="w-40 sm:w-64 h-auto" />
      </div>

      {/* Floating Golden Stars (✦) matching the reference positions */}
      <div className="absolute top-14 left-[24%] pointer-events-none z-0 animate-pixel-twinkle">
        <PixelStar size={24} />
      </div>
      <div className="absolute top-8 left-[32%] pointer-events-none z-0 animate-pixel-twinkle" style={{ animationDelay: '0.9s' }}>
        <PixelStar size={30} />
      </div>
      <div className="absolute top-20 right-[25%] pointer-events-none z-0 animate-pixel-twinkle" style={{ animationDelay: '1.4s' }}>
        <PixelStar size={26} />
      </div>
      <div className="absolute top-36 right-[12%] pointer-events-none z-0 animate-pixel-twinkle hidden sm:block" style={{ animationDelay: '2s' }}>
        <PixelStar size={20} />
      </div>

      {/* Floating Academic Pixel Props */}
      {/* Mid-Left Floating Pixel Textbook */}
      <div className="absolute top-24 sm:top-36 left-4 sm:left-12 pointer-events-none z-10 animate-pixel-float hidden sm:block" style={{ animationDelay: '0.6s' }}>
        <PixelBook className="w-20 sm:w-28 h-auto drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)]" />
      </div>

      {/* Mid-Right Floating Pixel Lab / Code Flask */}
      <div className="absolute top-24 sm:top-32 right-4 sm:right-12 pointer-events-none z-10 animate-pixel-float hidden sm:block" style={{ animationDelay: '1.2s' }}>
        <PixelFlask className="w-18 sm:w-24 h-auto drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)]" />
      </div>

      {/* Top Banner / Student High-Score Pill */}
      <div className="relative z-20 flex flex-wrap justify-between items-center gap-2 max-w-4xl mx-auto w-full pt-1">
        <div className="flex items-center gap-2 bg-[#172554]/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border-2 border-[#3b82f6]/40 text-xs shadow-md">
          <GraduationCap className="w-4 h-4 text-cyan-300" />
          <span className="font-silkscreen text-[11px] text-cyan-200">BCA SEM 1-6 CURRICULUM</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#0f172a]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-amber-400/40 text-xs font-pixel text-amber-300 flex items-center gap-2 shadow-md">
            <span>BEST:</span>
            <span className="text-white">{progress.highScore.toLocaleString()}</span>
          </div>
          <div className="bg-[#0f172a]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-emerald-400/40 text-xs font-pixel text-emerald-300 flex items-center gap-2 shadow-md">
            <span>LEVEL:</span>
            <span className="text-white">{progress.level}</span>
          </div>
        </div>
      </div>

      {/* Centerpiece Hero: Gamification in Education */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center max-w-2xl mx-auto my-auto py-4 sm:py-6">
        {/* Main Pixel Title: Gamification */}
        <h1
          className="font-pixel text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight drop-shadow-[0_6px_0_#181a3d] leading-none mb-3 transform hover:scale-[1.02] transition-transform duration-200 cursor-default"
          style={{ letterSpacing: '0.04em' }}
        >
          Gamification
        </h1>

        {/* Subtitle in Monospace / Retro Sans */}
        <div className="text-xl sm:text-3xl font-silkscreen font-bold text-white tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] mb-5">
          in BCA Education
        </div>

        {/* 5 Pixel Hearts */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 my-2 filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
          {[1, 2, 3, 4, 5].map((heartIndex) => (
            <PixelHeart key={heartIndex} active={true} size={36} />
          ))}
        </div>

        <p className="text-sm sm:text-base text-cyan-100/90 font-medium max-w-lg mt-2 mb-6 drop-shadow-md text-center">
          Run the 3D smart city, pass optimal BCA algorithm gates, reduce server watts, and build zero-carbon apps!
        </p>

        {/* Action Buttons: Yellow BACK ◀ and Coral PLAY with Pixel Cursor */}
        <div className="relative flex items-center justify-center gap-6 sm:gap-10 w-full mt-2">
          {/* BACK ◀ Button (Yellow / Golden pill) */}
          <button
            onClick={handleBackClick}
            className="w-36 sm:w-44 py-3 sm:py-3.5 px-6 rounded-full bg-[#fbc02d] hover:bg-[#ffca28] text-[#111429] font-pixel text-xs sm:text-sm font-black border-4 border-[#111429] pixel-btn-shadow transition-transform active:translate-y-1 cursor-pointer flex items-center justify-center gap-2 group"
          >
            <span>BACK</span>
            <span className="text-xs group-hover:-translate-x-1 transition-transform">◀</span>
          </button>

          {/* PLAY Button (Coral Red pill with dark border and pixel cursor) */}
          <div className="relative">
            <button
              onClick={handlePlayClick}
              className="w-36 sm:w-44 py-3 sm:py-3.5 px-6 rounded-full bg-[#e54d58] hover:bg-[#ef5350] text-[#111429] font-pixel text-xs sm:text-sm font-black border-4 border-[#111429] pixel-btn-shadow transition-transform active:translate-y-1 cursor-pointer flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-[#111429]" />
              <span>PLAY</span>
            </button>

            {/* Pixel Cursor Pointer hovering at the bottom-right of the PLAY button */}
            <div className="absolute -bottom-5 -right-3 pointer-events-none transform translate-x-1 translate-y-1 animate-bounce">
              <PixelCursor className="w-8 h-8 drop-shadow-[0_3px_6px_rgba(0,0,0,0.6)]" />
            </div>
          </div>
        </div>

        {/* Quick Mode Pill Indicator */}
        <div className="mt-6 flex items-center gap-2 text-xs font-silkscreen text-white/90 bg-[#1e1b4b]/60 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/20">
          <span>MODE:</span>
          <span className="text-amber-300 uppercase font-bold">{selectedMode}</span>
          <span className="text-white/40">•</span>
          <span>HERO:</span>
          <span className="text-cyan-300 font-bold">{selectedCharacter.name}</span>
        </div>
      </div>

      {/* Collapsible / Modal Options Drawer for Modes & Character Selection */}
      {showOptionsPanel && (
        <div className="relative z-30 max-w-4xl mx-auto w-full mb-4 bg-[#0f172a]/95 backdrop-blur-xl border-4 border-[#1e293b] rounded-3xl p-5 shadow-2xl pixel-card-shadow animate-in fade-in slide-in-from-bottom-6 duration-200">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-700/80">
            <div className="flex items-center gap-2">
              <span className="text-xl">🎮</span>
              <h3 className="font-pixel text-sm sm:text-base text-white">SELECT GAME MODE</h3>
            </div>
            <button
              onClick={() => setShowOptionsPanel(false)}
              className="text-xs font-silkscreen text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800"
            >
              CLOSE [X]
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {modes.map((m) => {
              const isSelected = selectedMode === m.id;
              return (
                <div
                  key={m.id}
                  onClick={() => {
                    setSelectedMode(m.id);
                    soundManager.playWhoosh();
                  }}
                  className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#1e1b4b] border-amber-400 ring-2 ring-amber-400/40 text-white'
                      : 'bg-[#1e293b]/80 border-slate-700 hover:border-slate-500 text-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-2xl">{m.icon}</span>
                      <span className="text-[10px] font-pixel px-2 py-0.5 rounded bg-black/40 text-amber-300">
                        {m.tag}
                      </span>
                    </div>
                    <h4 className="font-pixel text-xs text-white mb-1.5">{m.title}</h4>
                    <p className="text-[11px] text-slate-300 leading-snug">{m.desc}</p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-white/10 flex justify-between items-center text-[10px] font-silkscreen">
                    <span className={isSelected ? 'text-amber-300 font-bold' : 'text-slate-400'}>
                      {isSelected ? 'SELECTED ✓' : 'CHOOSE'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick links to BCA curriculum & Character Selector */}
          <div className="mt-4 pt-3 border-t border-slate-700/80 flex flex-wrap justify-between items-center gap-3">
            <button
              onClick={() => setShowCharacterModal(true)}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-pixel text-[11px] flex items-center gap-2 shadow"
            >
              <span>SWITCH ECO-RUNNER:</span>
              <span className="text-cyan-200 underline">{selectedCharacter.name}</span>
            </button>

            <button
              onClick={() => onNavigateTab('learn')}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-pixel text-[11px] flex items-center gap-2 shadow"
            >
              <BookOpen className="w-4 h-4" />
              <span>OPEN BCA COURSE HUB</span>
            </button>
          </div>
        </div>
      )}

      {/* Character Modal */}
      {showCharacterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
          <div className="bg-[#0f172a] border-4 border-cyan-500 rounded-3xl p-6 max-w-2xl w-full shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-pixel text-sm text-cyan-300">SELECT YOUR BCA ECO-RUNNER</h3>
              <button
                onClick={() => setShowCharacterModal(false)}
                className="text-xs font-silkscreen text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800"
              >
                CLOSE [X]
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {INITIAL_CHARACTERS.map((char) => {
                const isSelected = selectedCharacter.id === char.id;
                return (
                  <div
                    key={char.id}
                    onClick={() => {
                      onSelectCharacter(char);
                      setShowCharacterModal(false);
                      soundManager.playWhoosh();
                    }}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-950/80 border-cyan-400 ring-2 ring-cyan-400/40'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div
                      className="w-10 h-10 rounded-xl mb-2 flex items-center justify-center font-pixel text-base"
                      style={{ backgroundColor: `${char.primaryColor}33`, color: char.primaryColor }}
                    >
                      {char.name[0]}
                    </div>
                    <div className="font-pixel text-xs text-white mb-1">{char.name}</div>
                    <div className="text-[11px] text-cyan-400 font-semibold mb-2">{char.title}</div>
                    <div className="text-[10px] text-slate-400 mb-2 leading-relaxed">{char.description}</div>
                    <div className="text-[10px] font-mono bg-slate-950 px-2 py-1 rounded text-emerald-300">
                      {char.roleSpecialty}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Row matching reference: Brand mark on the left, Cute Pixel Graduate & Cat at center */}
      <div className="relative z-20 flex flex-col sm:flex-row justify-between items-end max-w-4xl mx-auto w-full pt-4">
        {/* Brand mark on the bottom left (matches QuickSchools position with EcoRush branding) */}
        <div className="mb-2 sm:mb-0 flex items-center gap-2">
          <div className="font-silkscreen font-bold text-lg sm:text-xl text-white tracking-tight flex items-center gap-1 drop-shadow-md">
            <span>Quick</span>
            <span className="text-amber-400">Schools</span>
            <span className="text-[10px] ml-1 px-1.5 py-0.5 rounded bg-white/20 text-white font-mono">
              BCA
            </span>
          </div>
        </div>

        {/* Center: Pixel Art Graduate Student & Companion Cat from the reference image */}
        <div className="flex items-end justify-center gap-3 mx-auto sm:mr-12 -mb-2">
          {/* Cyber Pet Cat on the left */}
          <div className="transform translate-y-1 hover:-translate-y-1 transition-transform cursor-pointer" title="Pixel Mascot: Byte the Eco Cat">
            <PixelPetCat size={72} />
          </div>

          {/* Graduate Avatar with Mortarboard, Red Tie & Rosy Cheeks */}
          <div className="transform hover:scale-105 transition-transform cursor-pointer" title="BCA Graduate Student">
            <PixelGraduateAvatar size={150} />
          </div>
        </div>

        {/* Right Quick Nav Shortcuts */}
        <div className="flex items-center gap-2 mb-2">
          <button
            onClick={() => onNavigateTab('learn')}
            className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-silkscreen flex items-center gap-1.5 border border-white/20"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Courses</span>
          </button>
          <button
            onClick={() => onNavigateTab('leaderboard')}
            className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-silkscreen flex items-center gap-1.5 border border-white/20"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ranks</span>
          </button>
        </div>
      </div>
    </div>
  );
};
