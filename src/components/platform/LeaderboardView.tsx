/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LeaderboardEntry } from '../../types/game';
import { storageService } from '../../services/storageService';
import { Trophy, Flame, Coins, Award, Sparkles, Filter } from 'lucide-react';

export const LeaderboardView: React.FC = () => {
  const [category, setCategory] = useState<'score' | 'distance' | 'tokens' | 'quiz' | 'gates'>('score');
  const [timeFilter, setTimeFilter] = useState<'weekly' | 'alltime'>('alltime');
  const [selectedBatch, setSelectedBatch] = useState<string>('all');

  const entries: LeaderboardEntry[] = storageService.getLeaderboard();

  // Filter entries
  const filtered = entries.filter((e) => {
    if (selectedBatch !== 'all' && e.batch !== selectedBatch) return false;
    return true;
  });

  // Sort by active category
  const sorted = [...filtered].sort((a, b) => {
    if (category === 'score') return b.highScore - a.highScore;
    if (category === 'distance') return b.longestDistance - a.longestDistance;
    if (category === 'tokens') return b.totalTokens - a.totalTokens;
    if (category === 'quiz') return b.quizScore - a.quizScore;
    if (category === 'gates') return (b.syllabusGatesMastered || 0) - (a.syllabusGatesMastered || 0);
    return 0;
  });

  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-4">
      {/* Title */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
          <Trophy className="w-3.5 h-3.5" />
          <span>Campus Eco-Runners</span>
        </div>
        <h2 className="text-3xl font-black text-white uppercase tracking-tight">Leaderboard</h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Rankings across BCA college students in high scores, distance, recycling tokens, and sustainability quizzes.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        <button
          onClick={() => setCategory('score')}
          className={`p-3 rounded-2xl border text-xs font-bold uppercase tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer ${
            category === 'score'
              ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md font-black'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Highest Score</span>
        </button>

        <button
          onClick={() => setCategory('distance')}
          className={`p-3 rounded-2xl border text-xs font-bold uppercase tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer ${
            category === 'distance'
              ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md font-black'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>Distance (m)</span>
        </button>

        <button
          onClick={() => setCategory('tokens')}
          className={`p-3 rounded-2xl border text-xs font-bold uppercase tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer ${
            category === 'tokens'
              ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md font-black'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Coins className="w-4 h-4" />
          <span>Tokens Earned</span>
        </button>

        <button
          onClick={() => setCategory('quiz')}
          className={`p-3 rounded-2xl border text-xs font-bold uppercase tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer ${
            category === 'quiz'
              ? 'bg-purple-500 text-slate-950 border-purple-400 shadow-md font-black'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Quiz Score</span>
        </button>

        <button
          onClick={() => setCategory('gates')}
          className={`p-3 rounded-2xl border text-xs font-bold uppercase tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer col-span-2 sm:col-span-1 ${
            category === 'gates'
              ? 'bg-teal-400 text-slate-950 border-teal-300 shadow-md font-black'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <span>⚡</span>
          <span>BCA Code Gates</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 mb-6 flex flex-wrap justify-between items-center gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400 font-semibold">Batch:</span>
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All BCA Batches</option>
            <option value="BCA 3rd Sem A">BCA 3rd Sem A</option>
            <option value="BCA 3rd Sem B">BCA 3rd Sem B</option>
            <option value="BCA 5th Sem AI/DS">BCA 5th Sem AI/DS</option>
            <option value="BCA 1st Sem A">BCA 1st Sem A</option>
            <option value="BCA 1st Sem B">BCA 1st Sem B</option>
          </select>
        </div>

        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setTimeFilter('weekly')}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${
              timeFilter === 'weekly' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setTimeFilter('alltime')}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${
              timeFilter === 'alltime' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            All-Time
          </button>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="divide-y divide-slate-800/60 font-mono text-xs">
          {sorted.map((item, idx) => {
            const isTop3 = idx < 3;
            const rankBadge =
              idx === 0
                ? '🥇'
                : idx === 1
                ? '🥈'
                : idx === 2
                ? '🥉'
                : `#${idx + 1}`;

            let primaryStat = item.highScore.toLocaleString();
            let statUnit = 'pts';
            if (category === 'distance') {
              primaryStat = item.longestDistance.toLocaleString();
              statUnit = 'm';
            } else if (category === 'tokens') {
              primaryStat = item.totalTokens.toLocaleString();
              statUnit = 'tokens';
            } else if (category === 'quiz') {
              primaryStat = `${item.quizScore}%`;
              statUnit = 'avg';
            } else if (category === 'gates') {
              primaryStat = `${item.syllabusGatesMastered || 0}`;
              statUnit = 'gates';
            }

            return (
              <div
                key={item.id}
                className={`p-4 flex items-center justify-between transition-colors ${
                  item.isCurrentPlayer
                    ? 'bg-emerald-950/40 border-l-4 border-emerald-400'
                    : 'hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-8 text-center text-sm font-black text-slate-300">
                    {rankBadge}
                  </div>

                  <div>
                    <div className="font-sans font-bold text-sm text-white flex items-center gap-2">
                      <span>{item.nickname}</span>
                      {item.isCurrentPlayer && (
                        <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950">
                          You
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 font-sans mt-0.5">{item.batch}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div
                    className={`text-base font-black tracking-tight ${
                      isTop3 ? 'text-emerald-400' : 'text-white'
                    }`}
                  >
                    {primaryStat}
                  </div>
                  <div className="text-[10px] text-slate-500 uppercase">{statUnit}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
