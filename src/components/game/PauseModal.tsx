/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Play, RotateCcw, Home, Volume2, VolumeX } from 'lucide-react';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onHome: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestart,
  onHome,
  isMuted,
  onToggleMute,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-sm w-full p-6 shadow-2xl text-center">
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xl">
          ⏸
        </div>
        <h2 className="text-2xl font-black text-white tracking-wide uppercase mb-1">Game Paused</h2>
        <p className="text-sm text-slate-400 mb-6">Take a breather, eco-runner.</p>

        <div className="flex flex-col gap-3">
          <button
            onClick={onResume}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black rounded-xl uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
          >
            <Play className="w-5 h-5 fill-slate-950" />
            <span>Resume Sprint</span>
          </button>

          <button
            onClick={onRestart}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-bold rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restart Run</span>
          </button>

          <button
            onClick={onToggleMute}
            className="w-full py-2.5 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-300 font-medium rounded-xl flex items-center justify-center gap-2 transition-all"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
            <span>Sound: {isMuted ? 'Muted' : 'Enabled'}</span>
          </button>

          <button
            onClick={onHome}
            className="w-full py-2.5 text-slate-400 hover:text-white font-medium flex items-center justify-center gap-1.5 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Quit to Main Hub</span>
          </button>
        </div>
      </div>
    </div>
  );
};
