/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StudentProgress, Achievement } from '../../types/game';
import { storageService } from '../../services/storageService';
import { Award, Zap, Compass, Recycle, Flame, Cpu, ShieldCheck, Play, CheckCircle2, Coins } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';

interface AchievementsViewProps {
  progress: StudentProgress;
  onUpdateProgress: (updated: StudentProgress) => void;
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({ progress, onUpdateProgress }) => {
  const achievements: Achievement[] = storageService.getAchievements();

  const getIcon = (name: string) => {
    switch (name) {
      case 'Play':
        return <Play className="w-5 h-5 text-emerald-400" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-emerald-400" />;
      case 'Compass':
        return <Compass className="w-5 h-5 text-cyan-400" />;
      case 'Recycle':
        return <Recycle className="w-5 h-5 text-amber-400" />;
      case 'Award':
        return <Award className="w-5 h-5 text-purple-400" />;
      case 'Flame':
        return <Flame className="w-5 h-5 text-orange-400" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-blue-400" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-teal-400" />;
      default:
        return <Award className="w-5 h-5 text-emerald-400" />;
    }
  };

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-4">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider mb-2">
          <Award className="w-3.5 h-3.5" />
          <span>Campus Accolades</span>
        </div>
        <h2 className="text-3xl font-black text-white uppercase tracking-tight">Achievements</h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Complete high-impact environmental sustainability milestones across your runs and coursework.
        </p>

        {/* Unlocked status pill */}
        <div className="inline-flex items-center gap-2 mt-3 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-xs text-slate-300">
          <span>Unlocked:</span>
          <span className="font-bold text-emerald-400 font-mono">
            {unlockedCount} / {achievements.length} Badges
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {achievements.map((ach) => {
          // Determine progress metric
          let current = 0;
          if (ach.metric === 'high_score') current = progress.highScore;
          else if (ach.metric === 'total_distance') current = progress.totalDistance;
          else if (ach.metric === 'total_tokens') current = progress.totalTokensCollected;
          else if (ach.metric === 'runs_played') current = progress.totalRuns;
          else if (ach.metric === 'quizzes_completed') current = Object.keys(progress.completedQuizIds).length;

          const percent = Math.min(100, Math.round((current / ach.requirement) * 100));

          return (
            <div
              key={ach.id}
              className={`p-5 rounded-3xl border transition-all ${
                ach.unlocked
                  ? 'bg-slate-900/90 border-emerald-500/40 ring-1 ring-emerald-500/20 shadow-lg'
                  : 'bg-slate-950/60 border-slate-800'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                    ach.unlocked
                      ? 'bg-emerald-950/60 border-emerald-500/40'
                      : 'bg-slate-900 border-slate-800 opacity-60'
                  }`}
                >
                  {getIcon(ach.iconName)}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-sm font-bold text-white leading-tight">{ach.title}</h4>
                    {ach.unlocked ? (
                      <span className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Done</span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono text-slate-400">
                        {percent}%
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed mb-3">{ach.description}</p>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full transition-all duration-300 ${
                        ach.unlocked ? 'bg-emerald-400' : 'bg-slate-600'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400 font-mono">
                      {Math.min(current, ach.requirement).toLocaleString()} / {ach.requirement.toLocaleString()}
                    </span>

                    <span className="text-amber-400 font-mono font-bold flex items-center gap-1">
                      <Coins className="w-3 h-3" />
                      <span>+{ach.rewardTokens} Tokens</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
