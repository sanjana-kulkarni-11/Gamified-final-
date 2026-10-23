/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { StudentProgress } from '../../types/game';
import { storageService } from '../../services/storageService';
import { Settings, Volume2, VolumeX, RotateCcw, Download, Upload, Shield, X, AlertTriangle } from 'lucide-react';

interface SettingsModalProps {
  progress: StudentProgress;
  onUpdateProgress: (updated: StudentProgress) => void;
  onClose: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  progress,
  onUpdateProgress,
  onClose,
  isMuted,
  onToggleMute,
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(progress, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `ecorush_progress_${progress.userId}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        storageService.saveProgress(json);
        onUpdateProgress(json);
        alert('Student progress restored successfully!');
      } catch {
        alert('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    storageService.resetAllData();
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-white uppercase tracking-wide">Game Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          {/* Audio setting */}
          <div className="flex justify-between items-center p-3 bg-slate-950/70 border border-slate-800 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-800 rounded-xl">
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              </div>
              <div>
                <div className="text-xs font-bold text-white">Audio & Music Synthesizer</div>
                <div className="text-[11px] text-slate-400">Web Audio API procedural sound engine</div>
              </div>
            </div>

            <button
              onClick={onToggleMute}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isMuted ? 'bg-slate-800 text-slate-400' : 'bg-emerald-500 text-slate-950'
              }`}
            >
              {isMuted ? 'Muted' : 'Enabled'}
            </button>
          </div>

          {/* Controls Reference */}
          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl text-xs">
            <div className="font-bold text-white uppercase tracking-wider mb-2 text-[11px]">
              Controls Reference
            </div>
            <div className="grid grid-cols-2 gap-2 text-slate-300">
              <div><span className="text-cyan-400 font-mono font-bold">A / ←</span> Left Lane</div>
              <div><span className="text-cyan-400 font-mono font-bold">D / →</span> Right Lane</div>
              <div><span className="text-emerald-400 font-mono font-bold">W / ↑ / Space</span> Jump</div>
              <div><span className="text-amber-400 font-mono font-bold">S / ↓</span> Slide / Crouch</div>
              <div><span className="text-purple-400 font-mono font-bold">Touch Swipe</span> All directions</div>
              <div><span className="text-slate-400 font-mono font-bold">Esc / P</span> Pause / Resume</div>
            </div>
          </div>

          {/* Backup / Export / Import */}
          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl text-xs">
            <div className="font-bold text-white uppercase tracking-wider mb-2 text-[11px]">
              Data Backup & Sync
            </div>
            <p className="text-[11px] text-slate-400 mb-3">
              Storage mode: <span className="text-emerald-400 font-semibold">{storageService.isSupabaseConfigured() ? 'Cloud Database (Supabase)' : 'Local Offline Storage (Persisted)'}</span>
            </p>

            <div className="flex gap-2">
              <button
                onClick={handleExportData}
                className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Progress</span>
              </button>

              <label className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-center">
                <Upload className="w-3.5 h-3.5" />
                <span>Import Backup</span>
                <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
              </label>
            </div>
          </div>

          {/* Reset Progress Section */}
          <div className="p-4 bg-rose-950/20 border border-rose-500/30 rounded-2xl text-xs">
            {!showConfirmReset ? (
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-bold text-rose-300">Reset Student Progress</div>
                  <div className="text-[11px] text-slate-400">Clear all runs, tokens, and unlocks</div>
                </div>
                <button
                  onClick={() => setShowConfirmReset(true)}
                  className="px-3 py-1.5 bg-rose-950 border border-rose-500/50 hover:bg-rose-900 text-rose-300 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Reset
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 text-rose-400 font-bold mb-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Are you absolutely sure?</span>
                </div>
                <p className="text-[11px] text-slate-300 mb-3">
                  This will erase your high score ({progress.highScore.toLocaleString()}), tokens, and unlocked characters.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowConfirmReset(false)}
                    className="flex-1 py-1.5 bg-slate-800 text-slate-300 rounded-lg font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleResetData}
                    className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold"
                  >
                    Yes, Reset Everything
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
