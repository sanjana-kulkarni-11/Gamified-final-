/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { INITIAL_LEARNING_MODULES, DEMO_LEADERBOARD } from '../../data/initialData';
import { Users, BookOpen, CheckCircle, BarChart3, Plus, ArrowUpRight, Award } from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const [selectedBatch, setSelectedBatch] = useState<string>('BCA 3rd Sem A');
  const [assignedModules, setAssignedModules] = useState<string[]>([
    'mod_green_computing',
    'mod_ewaste',
  ]);

  const batches = ['BCA 3rd Sem A', 'BCA 3rd Sem B', 'BCA 5th Sem AI/DS'];

  // Filter students by selected batch
  const cohort = DEMO_LEADERBOARD.filter((s) => s.batch === selectedBatch);

  const toggleModuleAssignment = (moduleId: string) => {
    if (assignedModules.includes(moduleId)) {
      setAssignedModules(assignedModules.filter((id) => id !== moduleId));
    } else {
      setAssignedModules([...assignedModules, moduleId]);
    }
  };

  const avgQuizScore = Math.round(
    cohort.reduce((acc, curr) => acc + curr.quizScore, 0) / (cohort.length || 1)
  );

  const avgDistance = Math.round(
    cohort.reduce((acc, curr) => acc + curr.longestDistance, 0) / (cohort.length || 1)
  );

  return (
    <div className="w-full max-w-5xl mx-auto py-6 px-4">
      {/* Teacher Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-cyan-400 mb-1">
            <Users className="w-4 h-4" />
            <span>Faculty Command Center</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">Classroom Sustainability Analytics</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Monitor BCA student engagement across 3D endless runner runs and environmental modules.
          </p>
        </div>

        {/* Batch Selector */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-xl p-1.5">
          {batches.map((b) => (
            <button
              key={b}
              onClick={() => setSelectedBatch(b)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedBatch === b
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Cohort Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="text-xs text-slate-400 font-medium">Cohort Enrollment</div>
          <div className="text-2xl font-black text-white font-mono mt-1">{cohort.length} Students</div>
          <div className="text-[11px] text-emerald-400 mt-0.5">100% Active in EcoRush</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="text-xs text-slate-400 font-medium">Average Quiz Score</div>
          <div className="text-2xl font-black text-cyan-300 font-mono mt-1">{avgQuizScore}%</div>
          <div className="text-[11px] text-cyan-400 mt-0.5">Above Target Baseline</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="text-xs text-slate-400 font-medium">Avg Distance Sprinted</div>
          <div className="text-2xl font-black text-amber-300 font-mono mt-1">{avgDistance.toLocaleString()} m</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Campus Metric</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="text-xs text-slate-400 font-medium">Assigned Modules</div>
          <div className="text-2xl font-black text-purple-400 font-mono mt-1">{assignedModules.length} Active</div>
          <div className="text-[11px] text-purple-300 mt-0.5">BCA Green Syllabus</div>
        </div>
      </div>

      {/* Module Assignment Manager */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-base font-bold text-white uppercase tracking-wide">
              Module Assignment for {selectedBatch}
            </h3>
            <p className="text-xs text-slate-400">
              Toggle syllabus modules required for this semester cohort
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {INITIAL_LEARNING_MODULES.map((mod) => {
            const isAssigned = assignedModules.includes(mod.id);
            return (
              <div
                key={mod.id}
                onClick={() => toggleModuleAssignment(mod.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex justify-between items-center ${
                  isAssigned
                    ? 'bg-emerald-950/40 border-emerald-500/80 ring-1 ring-emerald-500/20'
                    : 'bg-slate-950/60 border-slate-800 opacity-60 hover:opacity-100'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 px-2 py-0.5 rounded bg-slate-800">
                      {mod.subject}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {mod.semester}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white mt-1">{mod.title}</h4>
                  <div className="text-xs text-slate-400">{mod.quizQuestions.length} assessment items</div>
                </div>

                <div
                  className={`w-6 h-6 rounded-lg border flex items-center justify-center font-bold text-xs ${
                    isAssigned
                      ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                      : 'border-slate-700 text-transparent'
                  }`}
                >
                  ✓
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Student Roster Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
        <h3 className="text-base font-bold text-white uppercase tracking-wide mb-4">
          Student Progress & Performance Log
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Highest Score</th>
                <th className="py-3 px-4">Distance Run</th>
                <th className="py-3 px-4">Tokens Gathered</th>
                <th className="py-3 px-4">Quiz Mastery</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {cohort.map((s, idx) => (
                <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-sans font-bold text-white flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-xs">
                      #{idx + 1}
                    </span>
                    <span>{s.nickname}</span>
                  </td>
                  <td className="py-3.5 px-4 text-emerald-300 font-bold">{s.highScore.toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-cyan-300">{s.longestDistance.toLocaleString()} m</td>
                  <td className="py-3.5 px-4 text-amber-300">{s.totalTokens}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded font-bold ${
                        s.quizScore >= 90
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {s.quizScore}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-sans">
                    <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Compliant
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
