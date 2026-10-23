/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LearningModule } from '../../types/game';
import { soundManager } from '../../audio/soundManager';
import {
  X,
  BookOpen,
  Code,
  CheckCircle,
  Lightbulb,
  Gamepad2,
  Play,
  Dice5,
  Flame,
  Copy,
  Check,
  Download,
  Share2,
  Clock,
  Sparkles,
  Leaf
} from 'lucide-react';

interface TopicNotesModalProps {
  module: LearningModule;
  onClose: () => void;
  onPlayGame: (gameType: 'runner' | 'snakes' | 'kahoot', module: LearningModule) => void;
}

export const TopicNotesModal: React.FC<TopicNotesModalProps> = ({
  module,
  onClose,
  onPlayGame,
}) => {
  const [activeTab, setActiveTab] = useState<'notes' | 'code' | 'exam' | 'games'>('notes');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  const notesSections = module.notesSections && module.notesSections.length > 0
    ? module.notesSections
    : [
        {
          title: '1. Theoretical Framework & Core Principles',
          content: module.content || ['Detailed lecture notes and architectural foundations.'],
          examTip: 'Focus on time vs space complexities and structural definitions in examination essays.'
        }
      ];

  const handleCopyCode = (snippet: string) => {
    navigator.clipboard.writeText(snippet);
    setCopiedCode(true);
    soundManager.playPowerUp();
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDownloadNotes = () => {
    const textContent = `
=====================================================
${module.title.toUpperCase()}
Subject: ${module.subject} | Unit: ${module.semester} | Read Time: ${module.readTime}
=====================================================

OVERVIEW & SUMMARY:
${module.summary}

-----------------------------------------------------
RESPECTED STUDY NOTES:
-----------------------------------------------------
${notesSections.map(s => `
[${s.title}]
${s.content.join('\n')}

${s.codeSnippet ? `CODE IMPLEMENTATION:\n${s.codeSnippet}\n` : ''}
${s.examTip ? `EXAM TIP: ${s.examTip}\n` : ''}
`).join('\n')}

-----------------------------------------------------
KEY EXAM TAKEAWAYS:
-----------------------------------------------------
${module.keyTakeaways.map((k, i) => `${i + 1}. ${k}`).join('\n')}

-----------------------------------------------------
GREEN COMPUTING & EFFICIENCY IMPACT:
-----------------------------------------------------
${module.greenITImpact || 'Optimized algorithmic execution reduces CPU thermal footprint.'}
=====================================================
    `.trim();

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${module.title.replace(/[^a-zA-Z0-9]/g, '_')}_StudyNotes.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    soundManager.playPowerUp();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#0c1324] border-2 border-cyan-500/50 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-[#0d1c38] via-[#102a45] to-[#0d1c38] p-5 border-b border-cyan-500/30 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 font-pixel text-lg shadow-inner shrink-0">
              📖
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-pixel bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                  {module.semester || 'Unit Topic'}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-silkscreen bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  {module.readTime}
                </span>
                <span className="text-[11px] font-mono text-emerald-400">
                  🌱 {module.greenITImpact ? module.greenITImpact.split('&')[0] : 'Green Optimized'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-sans tracking-tight">
                {module.title}
              </h2>
              <div className="text-xs font-mono text-slate-400">
                Curriculum Subject: <span className="text-cyan-300 font-semibold">{module.subject}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadNotes}
              title="Download Notes (.txt)"
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all flex items-center gap-1.5 text-xs font-pixel"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Save Notes</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation & Games Highlight */}
        <div className="bg-[#080d19] px-5 py-2.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('notes')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-pixel uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'notes'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Respected Notes</span>
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-pixel uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'code'
                  ? 'bg-purple-500 text-white font-bold shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Code Snippets</span>
            </button>
            <button
              onClick={() => setActiveTab('exam')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-pixel uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'exam'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Exam Takeaways</span>
            </button>
            <button
              onClick={() => setActiveTab('games')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-pixel uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'games'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                  : 'text-emerald-400 hover:text-white hover:bg-emerald-950/40 border border-emerald-500/30'
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>Play 3 Games</span>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs font-pixel text-slate-400">
            <span>QUIZ QUESTIONS:</span>
            <span className="text-cyan-400 font-mono font-bold">{module.quizQuestions?.length || 4} available</span>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* TOPIC BANNER SUMMARY */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 via-cyan-950/30 to-slate-900 border border-cyan-500/30 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-pixel text-cyan-300 uppercase tracking-wider mb-1">
                TOPIC ABSTRACT & OBJECTIVES
              </div>
              <p className="text-sm text-slate-200 leading-relaxed font-sans">
                {module.summary}
              </p>
            </div>
          </div>

          {/* TAB 1: RESPECTED STUDY NOTES */}
          {activeTab === 'notes' && (
            <div className="space-y-6">
              {notesSections.map((sec, idx) => (
                <div key={idx} className="bg-[#0b1324] border border-slate-800 rounded-2xl p-5 shadow-lg">
                  <h3 className="text-base font-bold text-cyan-200 font-sans flex items-center gap-2 mb-3">
                    <span className="w-6 h-6 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-400 font-pixel text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span>{sec.title}</span>
                  </h3>

                  <div className="space-y-2.5 text-sm text-slate-300 leading-relaxed font-sans mb-4">
                    {sec.content.map((p, pIdx) => (
                      <p key={pIdx}>{p}</p>
                    ))}
                  </div>

                  {sec.codeSnippet && (
                    <div className="mt-3 rounded-xl overflow-hidden border border-slate-800 bg-[#070b14]">
                      <div className="bg-slate-900 px-3.5 py-1.5 flex items-center justify-between border-b border-slate-800 text-[11px] font-mono text-slate-400">
                        <span>Implementation Syntax</span>
                        <button
                          onClick={() => handleCopyCode(sec.codeSnippet!)}
                          className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors"
                        >
                          {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <pre className="p-3 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">
                        <code>{sec.codeSnippet}</code>
                      </pre>
                    </div>
                  )}

                  {sec.examTip && (
                    <div className="mt-3 p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 flex items-start gap-2.5">
                      <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div className="text-xs text-amber-200 leading-relaxed font-sans">
                        <strong className="font-bold text-amber-300 font-pixel text-[10px] uppercase block mb-0.5">
                          High-Yield Exam Strategy:
                        </strong>
                        {sec.examTip}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: CODE SNIPPETS & ALGORITHMS */}
          {activeTab === 'code' && (
            <div className="space-y-5">
              <div className="text-xs font-pixel text-purple-300 uppercase">
                WORKING CODE BENCHMARKS & EXECUTIONS
              </div>

              {notesSections.filter(s => s.codeSnippet).map((s, idx) => (
                <div key={idx} className="bg-[#090d19] border border-purple-500/40 rounded-2xl overflow-hidden shadow-xl">
                  <div className="bg-purple-950/60 px-4 py-2.5 border-b border-purple-500/30 flex items-center justify-between">
                    <span className="font-pixel text-xs text-purple-200">{s.title}</span>
                    <button
                      onClick={() => handleCopyCode(s.codeSnippet!)}
                      className="px-2.5 py-1 rounded-lg bg-purple-900/60 hover:bg-purple-800 text-purple-200 text-xs font-mono flex items-center gap-1.5 transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Snippet</span>
                    </button>
                  </div>
                  <pre className="p-4 text-xs font-mono text-purple-200 overflow-x-auto bg-[#060913] leading-relaxed">
                    <code>{s.codeSnippet}</code>
                  </pre>
                </div>
              ))}

              {notesSections.every(s => !s.codeSnippet) && (
                <div className="p-8 text-center text-slate-400 text-sm">
                  Code comparisons for this module are available in the Interactive Code Workbench!
                </div>
              )}
            </div>
          )}

          {/* TAB 3: EXAM TAKEAWAYS */}
          {activeTab === 'exam' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/50 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-pixel text-xs text-amber-300 uppercase mb-1">
                    ESSENTIAL BCA EXAM CHEAT-SHEET
                  </h4>
                  <p className="text-xs text-slate-300">
                    Memorize these core axioms, asymptotic complexities, and architecture principles before starting quizzes or sprint challenges.
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                {module.keyTakeaways.map((takeaway, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3 hover:border-amber-500/40 transition-colors"
                  >
                    <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 font-pixel text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-sm text-slate-200 font-sans leading-relaxed">{takeaway}</span>
                  </div>
                ))}
              </div>

              {module.greenITImpact && (
                <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-500/40 flex items-start gap-3">
                  <Leaf className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-pixel text-xs text-emerald-300 uppercase mb-1">
                      GREEN COMPUTING & ENVIRONMENTAL IMPACT
                    </h5>
                    <p className="text-xs text-emerald-200/90 leading-relaxed">
                      {module.greenITImpact}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: THE 3 GAMES AVAILABLE FOR THIS TOPIC */}
          <div className="pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Gamepad2 className="w-4 h-4 text-emerald-400" />
                <h4 className="font-pixel text-xs text-emerald-300 uppercase">
                  PLAY THE 3 GAMES FOR THIS TOPIC (FROM STUDENT'S PLACE)
                </h4>
              </div>
              <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                Loads questions & checkpoints on this topic!
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Game 1: 3D Sprint */}
              <div className="p-3.5 rounded-2xl bg-slate-900 border-2 border-red-500/40 hover:border-red-500 transition-all flex flex-col justify-between group shadow-lg">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-pixel text-[10px] text-red-400">GAME 1</span>
                    <span className="text-xs">🏃</span>
                  </div>
                  <h5 className="font-pixel text-xs text-white mb-1 group-hover:text-red-300">
                    3D SPRINT RUNNER
                  </h5>
                  <p className="text-[11px] text-slate-400 mb-3">
                    Sprint past obstacles while clearing Code Gates and holo-checkpoints themed on {module.title.slice(0, 25)}...
                  </p>
                </div>
                <button
                  onClick={() => onPlayGame('runner', module)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 font-pixel text-[10px] text-white flex items-center justify-center gap-1.5 shadow-md transition-transform active:scale-95 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>PLAY 3D RUNNER</span>
                </button>
              </div>

              {/* Game 2: Code Snakes & Ladders */}
              <div className="p-3.5 rounded-2xl bg-slate-900 border-2 border-emerald-500/40 hover:border-emerald-500 transition-all flex flex-col justify-between group shadow-lg">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-pixel text-[10px] text-emerald-400">GAME 2</span>
                    <span className="text-xs">🐍</span>
                  </div>
                  <h5 className="font-pixel text-xs text-white mb-1 group-hover:text-emerald-300">
                    CODE SNAKES & LADDERS
                  </h5>
                  <p className="text-[11px] text-slate-400 mb-3">
                    Climb algorithmic ladders and tame bug snakes by answering questions on this exact topic!
                  </p>
                </div>
                <button
                  onClick={() => onPlayGame('snakes', module)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 font-pixel text-[10px] text-slate-950 font-bold flex items-center justify-center gap-1.5 shadow-md transition-transform active:scale-95 cursor-pointer"
                >
                  <Dice5 className="w-3.5 h-3.5" />
                  <span>PLAY SNAKES & LADDERS</span>
                </button>
              </div>

              {/* Game 3: Kahoot Blitz Arena */}
              <div className="p-3.5 rounded-2xl bg-slate-900 border-2 border-amber-500/40 hover:border-amber-500 transition-all flex flex-col justify-between group shadow-lg">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-pixel text-[10px] text-amber-400">GAME 3</span>
                    <span className="text-xs">⚡</span>
                  </div>
                  <h5 className="font-pixel text-xs text-white mb-1 group-hover:text-amber-300">
                    KAHOOT BLITZ ARENA
                  </h5>
                  <p className="text-[11px] text-slate-400 mb-3">
                    Live multiplayer battle against bots. Speed and accuracy on {module.title.slice(0, 22)} crown the champion!
                  </p>
                </div>
                <button
                  onClick={() => onPlayGame('kahoot', module)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 font-pixel text-[10px] text-slate-950 font-bold flex items-center justify-center gap-1.5 shadow-md transition-transform active:scale-95 cursor-pointer"
                >
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  <span>PLAY KAHOOT BLITZ</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer Actions */}
        <div className="bg-[#080d19] p-4 border-t border-slate-800 flex items-center justify-between">
          <div className="text-[11px] text-slate-400 font-mono">
            Topic ID: <span className="text-slate-300">{module.id}</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-pixel text-xs border border-slate-700 transition-colors cursor-pointer"
          >
            Close Notes
          </button>
        </div>
      </div>
    </div>
  );
};
