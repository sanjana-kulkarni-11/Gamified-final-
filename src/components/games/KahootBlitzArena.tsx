/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { StudentProgress, QuizQuestion } from '../../types/game';
import { INITIAL_LEARNING_MODULES } from '../../data/initialData';
import { soundManager } from '../../audio/soundManager';
import { storageService } from '../../services/storageService';
import {
  Trophy,
  Flame,
  Zap,
  Timer,
  Award,
  RotateCcw,
  Sparkles,
  Users,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

interface KahootBlitzArenaProps {
  progress: StudentProgress;
  onUpdateProgress: (updated: StudentProgress) => void;
  onExit: () => void;
  activeTopicTitle?: string;
  topicQuestions?: QuizQuestion[];
}

interface Contestant {
  id: string;
  name: string;
  avatar: string;
  score: number;
  streak: number;
  accuracy: number; // 0 to 1
  isPlayer?: boolean;
}

const INITIAL_CONTESTANTS: Contestant[] = [
  { id: 'player', name: 'You (BCA Scholar)', avatar: '🎓', score: 0, streak: 0, accuracy: 1.0, isPlayer: true },
  { id: 'c1', name: 'Priya (DBMS Wizard)', avatar: '👩‍💻', score: 0, streak: 0, accuracy: 0.8 },
  { id: 'c2', name: 'Rohan (Systems Hacker)', avatar: '👨‍💻', score: 0, streak: 0, accuracy: 0.72 },
  { id: 'c3', name: 'Ananya (Cloud Architect)', avatar: '⚡', score: 0, streak: 0, accuracy: 0.85 },
];

export const KahootBlitzArena: React.FC<KahootBlitzArenaProps> = ({
  progress,
  onUpdateProgress,
  onExit,
  activeTopicTitle,
  topicQuestions,
}) => {
  // Pool of all questions shuffled
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [contestants, setContestants] = useState<Contestant[]>(INITIAL_CONTESTANTS);
  
  // Game phases: 'question' | 'breakdown' | 'leaderboard' | 'podium'
  const [phase, setPhase] = useState<'question' | 'breakdown' | 'leaderboard' | 'podium'>('question');
  
  // Question Timer (15 seconds)
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  const [answerTimeMs, setAnswerTimeMs] = useState<number>(0);
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);

  // Initialize questions on mount or when topic changes
  useEffect(() => {
    const qPool = (topicQuestions && topicQuestions.length > 0)
      ? topicQuestions
      : storageService.getModules().flatMap((m) => m.quizQuestions);
    const shuffled = [...qPool].sort(() => 0.5 - Math.random()).slice(0, Math.min(8, qPool.length));
    setQuestions(shuffled);
    setCurrentQIndex(0);
    setContestants(INITIAL_CONTESTANTS.map(c => ({ ...c, score: 0, streak: 0 })));
    if (shuffled.length > 0) {
      startQuestion(shuffled[0]);
    }
  }, [topicQuestions]);

  const startQuestion = (q: QuizQuestion) => {
    setPhase('question');
    setTimeLeft(15);
    setSelectedOption(null);
    setHasAnswered(false);
    setQuestionStartTime(Date.now());
  };

  // Timer loop
  useEffect(() => {
    if (phase !== 'question' || hasAnswered) return;

    if (timeLeft <= 0) {
      handleTimeExpired();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, timeLeft, hasAnswered]);

  const handleTimeExpired = () => {
    handleSelectAnswer(-1); // Timed out
  };

  const handleSelectAnswer = (optionIdx: number) => {
    if (hasAnswered || phase !== 'question') return;

    const timeSpentMs = Date.now() - questionStartTime;
    setAnswerTimeMs(timeSpentMs);
    setSelectedOption(optionIdx);
    setHasAnswered(true);

    const activeQ = questions[currentQIndex];
    const isCorrect = optionIdx === activeQ.correctIndex;

    if (isCorrect) {
      soundManager.playQuizCorrect();
    } else {
      soundManager.playQuizWrong();
    }

    // Calculate score points (Speed-based: max 1000 points + streak bonus)
    const speedRatio = Math.max(0, (15000 - timeSpentMs) / 15000);
    const basePoints = isCorrect ? Math.round(500 + speedRatio * 500) : 0;

    // Simulate classmates responding
    setContestants((prev) =>
      prev.map((c) => {
        if (c.isPlayer) {
          const nextStreak = isCorrect ? c.streak + 1 : 0;
          const streakMultiplier = nextStreak > 2 ? 1.5 : nextStreak > 1 ? 1.2 : 1.0;
          const pointsEarned = Math.round(basePoints * streakMultiplier);
          return {
            ...c,
            score: c.score + pointsEarned,
            streak: nextStreak,
          };
        } else {
          // AI Classmate response
          const aiCorrect = Math.random() < c.accuracy;
          const aiSpeed = 0.3 + Math.random() * 0.6; // random response time
          const aiBase = aiCorrect ? Math.round(500 + aiSpeed * 500) : 0;
          const nextStreak = aiCorrect ? c.streak + 1 : 0;
          const multiplier = nextStreak > 2 ? 1.4 : 1.0;
          return {
            ...c,
            score: c.score + Math.round(aiBase * multiplier),
            streak: nextStreak,
          };
        }
      })
    );

    // Transition to breakdown after 1.2 seconds
    setTimeout(() => {
      setPhase('breakdown');
    }, 1200);
  };

  const handleNextFromBreakdown = () => {
    setPhase('leaderboard');
  };

  const handleNextQuestion = () => {
    if (currentQIndex + 1 < questions.length) {
      const nextIdx = currentQIndex + 1;
      setCurrentQIndex(nextIdx);
      startQuestion(questions[nextIdx]);
    } else {
      // Game completed -> Podium!
      setPhase('podium');
      soundManager.playStreakFanfare();

      const sorted = [...contestants].sort((a, b) => b.score - a.score);
      const playerRank = sorted.findIndex((c) => c.isPlayer) + 1;

      // Award XP based on podium position
      const xpBonus = playerRank === 1 ? 250 : playerRank === 2 ? 180 : 120;
      const tokenBonus = playerRank === 1 ? 75 : playerRank === 2 ? 50 : 25;

      const updated = {
        ...progress,
        xp: progress.xp + xpBonus,
        recyclingTokens: progress.recyclingTokens + tokenBonus,
      };
      storageService.saveProgress(updated);
      onUpdateProgress(updated);
    }
  };

  const handleRestart = () => {
    const allQ = INITIAL_LEARNING_MODULES.flatMap((m) => m.quizQuestions);
    const shuffled = [...allQ].sort(() => 0.5 - Math.random()).slice(0, 7);
    setQuestions(shuffled);
    setCurrentQIndex(0);
    setContestants(INITIAL_CONTESTANTS.map(c => ({ ...c, score: 0, streak: 0 })));
    startQuestion(shuffled[0]);
  };

  const activeQuestion = questions[currentQIndex];
  const sortedLeaderboard = [...contestants].sort((a, b) => b.score - a.score);
  const playerRank = sortedLeaderboard.findIndex((c) => c.isPlayer) + 1;

  if (!activeQuestion) {
    return <div className="p-8 text-center text-white">Loading Arena Questions...</div>;
  }

  // Answer button configurations matching signature Kahoot 4-quadrant style
  const answerBlocks = [
    {
      shape: '▲',
      color: 'bg-rose-600 hover:bg-rose-500 active:bg-rose-700 border-rose-400 text-white shadow-rose-900/40',
      badgeBg: 'bg-rose-700',
    },
    {
      shape: '◆',
      color: 'bg-blue-600 hover:bg-blue-500 active:bg-blue-700 border-blue-400 text-white shadow-blue-900/40',
      badgeBg: 'bg-blue-700',
    },
    {
      shape: '●',
      color: 'bg-amber-500 hover:bg-amber-400 active:bg-amber-600 border-amber-300 text-slate-950 shadow-amber-900/40',
      badgeBg: 'bg-amber-600',
    },
    {
      shape: '■',
      color: 'bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 border-emerald-400 text-white shadow-emerald-900/40',
      badgeBg: 'bg-emerald-700',
    },
  ];

  return (
    <div className="min-h-[85vh] flex flex-col p-4 max-w-5xl mx-auto animate-in fade-in duration-300">
      {/* Top Kahoot Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/90 border border-purple-500/30 p-4 rounded-2xl shadow-xl backdrop-blur-md mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-950/80 border border-purple-500/50 rounded-xl text-purple-400">
            <Trophy className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-pixel text-xs text-purple-400 uppercase tracking-widest">
                Kahoot Blitz Battle
              </span>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-700 px-2 py-0.5 rounded-full font-mono">
                Round {currentQIndex + 1} of {questions.length}
              </span>
              {activeTopicTitle && (
                <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-500/50 px-2.5 py-0.5 rounded-full font-pixel animate-pulse">
                  ⚡ {activeTopicTitle}
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-white tracking-wide">
              BCA Semester Championship Arena
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 px-4 py-2 rounded-xl">
            <span className="text-xs text-slate-400 font-bold uppercase">Your Rank:</span>
            <span className="font-pixel text-sm text-amber-400">#{playerRank}</span>
            <span className="text-xs text-slate-500">({sortedLeaderboard.find(c => c.isPlayer)?.score || 0} pts)</span>
          </div>

          <button
            onClick={onExit}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all border border-slate-700"
          >
            Back to Hub
          </button>
        </div>
      </div>

      {/* PHASE 1: ACTIVE KAHOOT QUESTION */}
      {phase === 'question' && (
        <div className="flex flex-col flex-1 gap-4">
          {/* Question Box & Timer */}
          <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-2xl relative text-center">
            {/* Timer circle badge */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider">
                {activeQuestion.semester} • {activeQuestion.topic}
              </span>
              <div
                className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-pixel text-lg font-bold shadow-lg ${
                  timeLeft <= 4
                    ? 'border-rose-500 text-rose-400 bg-rose-950 animate-ping'
                    : 'border-cyan-500 text-cyan-300 bg-cyan-950'
                }`}
              >
                {timeLeft}
              </div>
            </div>

            <h3 className="text-lg md:text-2xl font-bold text-white max-w-3xl mx-auto my-3 leading-snug">
              {activeQuestion.question}
            </h3>

            {activeQuestion.codeSnippet && (
              <pre className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs font-mono text-cyan-300 my-3 max-w-2xl mx-auto overflow-x-auto text-left">
                <code>{activeQuestion.codeSnippet}</code>
              </pre>
            )}

            {/* Live Progress Bar for Timer */}
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden mt-3 border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-1000 ease-linear"
                style={{ width: `${(timeLeft / 15) * 100}%` }}
              />
            </div>
          </div>

          {/* 4 Colored Kahoot Answer Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
            {activeQuestion.options.map((opt, idx) => {
              const style = answerBlocks[idx % answerBlocks.length];
              const isSelected = selectedOption === idx;

              return (
                <button
                  key={idx}
                  disabled={hasAnswered}
                  onClick={() => handleSelectAnswer(idx)}
                  className={`min-h-[110px] p-5 rounded-2xl border-2 flex items-center gap-4 text-left font-bold text-base md:text-lg transition-all shadow-xl select-none ${style.color} ${
                    isSelected ? 'ring-4 ring-white scale-[1.02]' : ''
                  } ${hasAnswered && !isSelected ? 'opacity-40' : ''}`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl shadow-inner ${style.badgeBg}`}
                  >
                    {style.shape}
                  </div>
                  <span className="flex-1 leading-snug">{opt}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* PHASE 2: QUESTION BREAKDOWN & SYLLABUS LESSON */}
      {phase === 'breakdown' && (
        <div className="bg-slate-900 border-2 border-cyan-500/40 p-8 rounded-3xl shadow-2xl flex-1 flex flex-col justify-between animate-in zoom-in-95 duration-200">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {selectedOption === activeQuestion.correctIndex ? (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-300 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Correct Answer! (+Speed Bonus)</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-950 border border-rose-500 text-rose-300 font-bold text-sm">
                    <XCircle className="w-4 h-4 text-rose-400" />
                    <span>Incorrect / Time Out</span>
                  </div>
                )}
              </div>

              <div className="text-xs text-slate-400 font-mono">
                Answered in {(answerTimeMs / 1000).toFixed(2)}s
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">
              {activeQuestion.question}
            </h3>

            <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 mb-6">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
                Correct Answer:
              </div>
              <div className="text-base font-bold text-white">
                {activeQuestion.options[activeQuestion.correctIndex]}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 text-sm leading-relaxed mb-6">
              <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase text-xs mb-2">
                <HelpCircle className="w-4 h-4" />
                <span>BCA Curriculum Explanation</span>
              </div>
              <p>{activeQuestion.explanation}</p>
            </div>
          </div>

          <button
            onClick={handleNextFromBreakdown}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-purple-900/30 transition-all"
          >
            <span>View Live Leaderboard</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* PHASE 3: LIVE CLASSROOM LEADERBOARD */}
      {phase === 'leaderboard' && (
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl flex-1 flex flex-col justify-between animate-in fade-in duration-200">
          <div>
            <div className="text-center mb-6">
              <span className="font-pixel text-xs text-purple-400 uppercase tracking-widest">
                Classroom Standings
              </span>
              <h3 className="text-2xl font-bold text-white mt-1">
                Live Scoreboard After Round {currentQIndex + 1}
              </h3>
            </div>

            <div className="space-y-3 max-w-xl mx-auto">
              {sortedLeaderboard.map((c, idx) => {
                const isPlayer = c.isPlayer;
                return (
                  <div
                    key={c.id}
                    className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                      isPlayer
                        ? 'bg-cyan-950/80 border-cyan-400 shadow-lg shadow-cyan-950'
                        : 'bg-slate-950/80 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-pixel text-base font-bold text-slate-400 w-6">
                        #{idx + 1}
                      </span>
                      <span className="text-2xl">{c.avatar}</span>
                      <div>
                        <div className="font-bold text-white text-sm flex items-center gap-2">
                          <span>{c.name}</span>
                          {c.streak > 1 && (
                            <span className="flex items-center text-[10px] bg-amber-950 text-amber-300 border border-amber-600 px-2 py-0.5 rounded-full font-mono">
                              <Flame className="w-3 h-3 text-amber-400 fill-amber-400" />
                              {c.streak} Streak
                            </span>
                          )}
                        </div>
                        {isPlayer && (
                          <span className="text-[10px] text-cyan-300 font-medium">
                            That's you!
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="font-pixel text-sm font-bold text-cyan-400">
                      {c.score.toLocaleString()} pts
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={handleNextQuestion}
            className="w-full mt-6 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/40 transition-all"
          >
            <span>
              {currentQIndex + 1 < questions.length
                ? `Proceed to Question ${currentQIndex + 2}`
                : 'Conclude Battle & View Podium'}
            </span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* PHASE 4: PODIUM CELEBRATION */}
      {phase === 'podium' && (
        <div className="bg-slate-900 border-2 border-amber-500/50 p-8 rounded-3xl shadow-2xl flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-300">
          <div className="p-4 rounded-3xl bg-amber-500/20 border-2 border-amber-400 text-5xl mb-4 shadow-xl">
            🏆
          </div>

          <span className="font-pixel text-xs text-amber-400 uppercase tracking-widest">
            Championship Results
          </span>
          <h3 className="text-3xl font-black text-white mt-1 mb-6">
            BCA Blitz Podium
          </h3>

          {/* 3-Tier Podium Display */}
          <div className="flex items-end justify-center gap-4 w-full max-w-lg mb-8">
            {/* 2nd Place */}
            <div className="flex-1 flex flex-col items-center">
              <div className="text-2xl mb-1">{sortedLeaderboard[1]?.avatar}</div>
              <div className="text-xs font-bold text-slate-300 truncate max-w-[90px]">
                {sortedLeaderboard[1]?.name}
              </div>
              <div className="text-[10px] text-cyan-400 font-mono mb-2">
                {sortedLeaderboard[1]?.score} pts
              </div>
              <div className="w-full h-24 bg-slate-800 border-t-4 border-slate-400 rounded-t-2xl flex items-center justify-center font-pixel text-lg text-slate-300 shadow-xl">
                2nd
              </div>
            </div>

            {/* 1st Place */}
            <div className="flex-1 flex flex-col items-center">
              <div className="text-4xl mb-1">{sortedLeaderboard[0]?.avatar}</div>
              <div className="text-xs font-bold text-amber-300 truncate max-w-[100px]">
                {sortedLeaderboard[0]?.name}
              </div>
              <div className="text-[10px] text-amber-400 font-mono mb-2">
                {sortedLeaderboard[0]?.score} pts
              </div>
              <div className="w-full h-36 bg-gradient-to-b from-amber-600 to-amber-900 border-t-4 border-amber-300 rounded-t-2xl flex items-center justify-center font-pixel text-2xl text-amber-100 shadow-2xl">
                1st 👑
              </div>
            </div>

            {/* 3rd Place */}
            <div className="flex-1 flex flex-col items-center">
              <div className="text-2xl mb-1">{sortedLeaderboard[2]?.avatar}</div>
              <div className="text-xs font-bold text-amber-700 truncate max-w-[90px]">
                {sortedLeaderboard[2]?.name}
              </div>
              <div className="text-[10px] text-amber-700 font-mono mb-2">
                {sortedLeaderboard[2]?.score} pts
              </div>
              <div className="w-full h-16 bg-slate-800 border-t-4 border-amber-700 rounded-t-2xl flex items-center justify-center font-pixel text-base text-amber-600 shadow-xl">
                3rd
              </div>
            </div>
          </div>

          {/* Player Rewards Box */}
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl max-w-md w-full mb-6 flex justify-around">
            <div className="text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Your Finish
              </span>
              <span className="font-pixel text-base text-amber-400">
                #{playerRank} Place
              </span>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                XP Rewarded
              </span>
              <span className="font-pixel text-base text-cyan-400">
                +{playerRank === 1 ? 250 : playerRank === 2 ? 180 : 120} XP
              </span>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Tokens Won
              </span>
              <span className="font-pixel text-base text-emerald-400">
                +{playerRank === 1 ? 75 : playerRank === 2 ? 50 : 25} 🪙
              </span>
            </div>
          </div>

          <div className="flex gap-4 w-full max-w-md">
            <button
              onClick={handleRestart}
              className="flex-1 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Play New Battle</span>
            </button>

            <button
              onClick={onExit}
              className="flex-1 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all border border-slate-700"
            >
              <span>Back to Hub</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
