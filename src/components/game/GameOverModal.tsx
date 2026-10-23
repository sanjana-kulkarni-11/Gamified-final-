/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, Home, Zap, Coins, Award, Sparkles, BookOpen } from 'lucide-react';
import { ENVIRONMENTAL_FACTS } from '../../data/initialData';

interface GameOverModalProps {
  stats: {
    score: number;
    distance: number;
    orbs: number;
    tokens: number;
    knowledgeFragments: number;
    codeGatesCleared?: number;
    multiplier: number;
  };
  highScore: number;
  isNewHigh: boolean;
  xpEarned: number;
  onRestart: () => void;
  onHome: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  stats,
  highScore,
  isNewHigh,
  xpEarned,
  onRestart,
  onHome,
}) => {
  useEffect(() => {
    if (isNewHigh) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#38bdf8', '#f59e0b', '#a855f7'],
        });
      } catch {
        // Safe fallback
      }
    }
  }, [isNewHigh]);

  // Pick a random environmental takeaway fact for this run
  const randomFact = ENVIRONMENTAL_FACTS[Math.floor(Math.random() * ENVIRONMENTAL_FACTS.length)];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-in fade-in duration-300 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-md w-full p-6 shadow-2xl text-center relative overflow-hidden my-4">
        {/* Glow accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-emerald-500 via-cyan-400 to-amber-400" />

        {/* Title */}
        <div className="mb-2">
          {isNewHigh ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>New Personal Best!</span>
            </div>
          ) : (
            <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
              Sprint Complete
            </div>
          )}
          <h2 className="text-3xl font-black text-white tracking-tight uppercase">Run Results</h2>
        </div>

        {/* Score display */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 my-4">
          <div className="text-xs uppercase text-slate-400 font-semibold mb-1">Total Score</div>
          <div className="text-4xl font-black text-white font-mono tracking-tight text-emerald-400">
            {stats.score.toLocaleString()}
          </div>
          <div className="text-xs text-slate-400 mt-1 font-mono">
            Best Record: <span className="text-slate-200 font-bold">{Math.max(stats.score, highScore).toLocaleString()}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-left">
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-2.5">
            <div className="text-[11px] text-slate-400 font-medium">Distance Travelled</div>
            <div className="text-lg font-bold text-cyan-300 font-mono mt-0.5">{stats.distance.toLocaleString()} m</div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-2.5">
            <div className="text-[11px] text-slate-400 font-medium">BCA Gates Cleared</div>
            <div className="text-lg font-bold text-cyan-400 font-mono mt-0.5 flex items-center gap-1">
              <span>⚡</span>
              <span>{stats.codeGatesCleared || 0} Gates</span>
            </div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-2.5">
            <div className="text-[11px] text-slate-400 font-medium">Recycling Tokens</div>
            <div className="text-lg font-bold text-amber-300 font-mono mt-0.5 flex items-center gap-1">
              <Coins className="w-4 h-4" />
              <span>+{stats.tokens}</span>
            </div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-2.5">
            <div className="text-[11px] text-slate-400 font-medium">Educational XP</div>
            <div className="text-lg font-bold text-purple-400 font-mono mt-0.5 flex items-center gap-1">
              <Award className="w-4 h-4" />
              <span>+{xpEarned} XP</span>
            </div>
          </div>
        </div>

        {/* Environmental Learning Byte */}
        <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-3.5 mb-5 text-left">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wide mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>BCA Green Tech Byte</span>
          </div>
          <h4 className="text-sm font-bold text-emerald-200 mb-1">{randomFact.title}</h4>
          <p className="text-xs text-slate-300 leading-relaxed mb-1.5">{randomFact.fact}</p>
          <div className="text-[11px] text-emerald-300/90 bg-emerald-900/30 rounded p-1.5 border border-emerald-500/20">
            <span className="font-semibold text-emerald-200">Developer Takeaway: </span>
            {randomFact.bcaTakeaway}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={onRestart}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black rounded-xl uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 active:scale-95 transition-all cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Sprint Again</span>
          </button>

          <button
            onClick={onHome}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Return to Campus Hub</span>
          </button>
        </div>
      </div>
    </div>
  );
};
