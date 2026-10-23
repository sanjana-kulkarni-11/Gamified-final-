/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PowerUpActiveState } from '../../types/game';
import { Pause, Volume2, VolumeX, Shield, Magnet, ArrowUpCircle, Sun, Zap, Coins } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';
import { PixelHeart } from '../pixel/PixelArtAssets';

interface GameHUDProps {
  score: number;
  highScore: number;
  distance: number;
  orbs: number;
  tokens: number;
  multiplier: number;
  activePowerUps: PowerUpActiveState[];
  restorationLevel: number;
  gateFeedback?: { title: string; subtitle: string; isOptimal: boolean; explanation: string } | null;
  onPause: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  score,
  highScore,
  distance,
  orbs,
  tokens,
  multiplier,
  activePowerUps,
  restorationLevel,
  gateFeedback,
  onPause,
  isMuted,
  onToggleMute,
}) => {
  const getPowerUpIcon = (type: string) => {
    switch (type) {
      case 'shield':
        return <Shield className="w-4 h-4 text-cyan-400" />;
      case 'magnet':
        return <Magnet className="w-4 h-4 text-rose-400" />;
      case 'super_jump':
        return <ArrowUpCircle className="w-4 h-4 text-purple-400" />;
      case 'solar_boost':
        return <Sun className="w-4 h-4 text-amber-400" />;
      default:
        return null;
    }
  };

  const getPowerUpLabel = (type: string) => {
    switch (type) {
      case 'shield':
        return 'Eco Shield';
      case 'magnet':
        return 'Token Magnet';
      case 'super_jump':
        return 'Super Jump';
      case 'solar_boost':
        return 'Solar Boost 2x';
      default:
        return type;
    }
  };

  const getPowerUpColor = (type: string) => {
    switch (type) {
      case 'shield':
        return 'bg-cyan-500';
      case 'magnet':
        return 'bg-rose-500';
      case 'super_jump':
        return 'bg-purple-500';
      case 'solar_boost':
        return 'bg-amber-400';
      default:
        return 'bg-emerald-500';
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none select-none flex flex-col justify-between p-4 z-10">
      {/* Top HUD Bar */}
      <div className="flex justify-between items-start w-full">
        {/* Left: Score & Distance */}
        <div className="flex flex-col gap-1 pointer-events-auto">
          <div className="bg-[#0f172a]/90 border-2 border-slate-700/70 rounded-2xl px-4 py-2 shadow-lg backdrop-blur-md">
            <div className="text-[10px] font-silkscreen uppercase tracking-wider text-slate-400">Score</div>
            <div className="text-xl sm:text-2xl font-black tracking-tight text-white font-pixel">
              {score.toLocaleString()}
            </div>
            {highScore > 0 && (
              <div className="text-[10px] text-emerald-400 font-silkscreen mt-0.5">
                BEST: {highScore.toLocaleString()}
              </div>
            )}
          </div>

          <div className="bg-[#0f172a]/90 border border-slate-700/60 rounded-xl px-3 py-1.5 shadow-md flex items-center gap-2">
            <span className="text-[10px] font-silkscreen text-slate-400">DIST:</span>
            <span className="text-xs font-bold font-pixel text-cyan-300">{distance.toLocaleString()}m</span>
          </div>

          {/* Restoration Stage Indicator */}
          <div className="bg-emerald-950/80 border border-emerald-500/40 rounded-xl px-3 py-1 flex items-center gap-1.5 text-[11px] text-emerald-300 font-medium">
            <span>🌱</span>
            <span className="font-silkscreen text-[10px]">RESTORATION:</span>
            <span className="font-pixel text-[10px] text-emerald-200">{restorationLevel}/5</span>
          </div>
        </div>

        {/* Center: 5 Pixel Hearts Life Indicator & Multiplier Badge */}
        <div className="flex flex-col items-center gap-1.5 pointer-events-auto">
          <div className="bg-[#0f172a]/90 border-2 border-[#1e293b] rounded-full px-4 py-1.5 shadow-xl flex items-center gap-2 backdrop-blur-md">
            {[1, 2, 3, 4, 5].map((heartIdx) => {
              // Active hearts can reflect shield or base energy
              const hasShield = activePowerUps.some((p) => p.type === 'shield');
              const isActive = heartIdx <= (hasShield ? 5 : 4);
              return <PixelHeart key={heartIdx} active={isActive} size={22} />;
            })}
          </div>

          {multiplier > 1 && (
            <div className="bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-pixel px-3 py-1 rounded-full shadow-lg text-[10px] tracking-wide uppercase flex items-center gap-1.5 pointer-events-auto animate-bounce border-2 border-black">
              <Zap className="w-3.5 h-3.5 fill-slate-950" />
              <span>{multiplier}X SOLAR BOOST</span>
            </div>
          )}
        </div>

        {/* Right: Currency Counters & Action Buttons */}
        <div className="flex flex-col items-end gap-2 pointer-events-auto">
          <div className="flex gap-2">
            {/* Energy Orbs */}
            <div className="bg-slate-900/85 border border-emerald-500/40 rounded-xl px-3 py-1.5 flex items-center gap-2 shadow-md">
              <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400" />
              <span className="font-bold font-mono text-white text-sm">{orbs}</span>
            </div>

            {/* Recycling Tokens */}
            <div className="bg-slate-900/85 border border-amber-500/40 rounded-xl px-3 py-1.5 flex items-center gap-2 shadow-md">
              <Coins className="w-4 h-4 text-amber-400" />
              <span className="font-bold font-mono text-amber-300 text-sm">{tokens}</span>
            </div>
          </div>

          {/* Controls: Mute & Pause */}
          <div className="flex gap-2 mt-1">
            <button
              onClick={onToggleMute}
              className="w-10 h-10 bg-slate-900/85 border border-slate-700/60 active:bg-slate-800 text-slate-300 hover:text-white rounded-xl flex items-center justify-center shadow-md transition-colors"
              aria-label="Toggle Mute"
            >
              {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5" />}
            </button>

            <button
              onClick={onPause}
              className="w-10 h-10 bg-slate-900/85 border border-slate-700/60 active:bg-slate-800 text-slate-300 hover:text-white rounded-xl flex items-center justify-center shadow-md transition-colors"
              aria-label="Pause Game"
            >
              <Pause className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* In-Game Holographic Code Gate Feedback Popup */}
      {gateFeedback && (
        <div className="self-center max-w-md w-full pointer-events-auto animate-in slide-in-from-top-4 duration-200">
          <div
            className={`p-3.5 rounded-2xl border shadow-2xl backdrop-blur-md ${
              gateFeedback.isOptimal
                ? 'bg-emerald-950/90 border-emerald-400 text-emerald-100 ring-2 ring-emerald-500/40'
                : 'bg-amber-950/90 border-amber-500 text-amber-100 ring-2 ring-amber-500/40'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base">{gateFeedback.isOptimal ? '⚡' : '⚠️'}</span>
              <span className="text-xs font-black uppercase tracking-wider">
                {gateFeedback.title}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900/60 font-bold ml-auto">
                {gateFeedback.subtitle}
              </span>
            </div>
            <p className="text-xs leading-relaxed opacity-90">{gateFeedback.explanation}</p>
          </div>
        </div>
      )}

      {/* Active Power-Ups Stack (Clean minimal cards with timers) */}
      {activePowerUps.length > 0 && (
        <div className="self-center flex flex-col gap-1.5 items-center max-w-xs w-full pointer-events-auto">
          {activePowerUps.map((pu) => {
            const percent = Math.max(0, Math.min(100, (pu.remainingTime / pu.totalDuration) * 100));
            return (
              <div
                key={pu.type}
                className="w-full bg-slate-950/80 border border-slate-700/70 rounded-xl p-2 shadow-lg backdrop-blur-md flex items-center gap-2.5"
              >
                {getPowerUpIcon(pu.type)}
                <div className="flex-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-200 mb-1">
                    <span>{getPowerUpLabel(pu.type)}</span>
                    <span className="font-mono text-slate-400">{pu.remainingTime.toFixed(1)}s</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getPowerUpColor(pu.type)} transition-all duration-100 ease-linear`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom subtle lane controls guide (desktop only) */}
      <div className="hidden md:flex justify-center pb-2 text-[11px] text-slate-400/80 uppercase tracking-widest gap-6 font-medium">
        <span>[A / ←] Left</span>
        <span>[D / →] Right</span>
        <span>[W / ↑ / Space] Jump</span>
        <span>[S / ↓] Slide</span>
        <span>[ESC / P] Pause</span>
      </div>
    </div>
  );
};
