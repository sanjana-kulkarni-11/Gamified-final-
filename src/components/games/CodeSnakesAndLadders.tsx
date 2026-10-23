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
  Shield,
  Zap,
  Dice5,
  Award,
  ArrowUpRight,
  TrendingDown,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Bot,
  User,
  AlertTriangle,
  Trophy,
} from 'lucide-react';
import { PixelRunnerSprite } from '../pixel/PixelArtAssets';

interface CodeSnakesAndLaddersProps {
  progress: StudentProgress;
  onUpdateProgress: (updated: StudentProgress) => void;
  onExit: () => void;
  activeTopicTitle?: string;
  topicQuestions?: QuizQuestion[];
}

interface Ladder {
  start: number;
  end: number;
  title: string;
  topic: string;
}

interface Snake {
  head: number;
  tail: number;
  title: string;
  bugType: string;
}

const LADDERS: Ladder[] = [
  { start: 4, end: 25, title: 'O(1) Hash Map Index', topic: 'Data Structures' },
  { start: 12, end: 33, title: 'Binary Search Tree Balance', topic: 'Algorithms' },
  { start: 28, end: 54, title: 'B+ Tree Database Index', topic: 'DBMS' },
  { start: 41, end: 63, title: 'StringBuilder GC Optimization', topic: 'Java OOP' },
  { start: 53, end: 76, title: 'DP Memoization Cache', topic: 'Algorithms' },
  { start: 71, end: 92, title: 'Docker Kernel Sharing', topic: 'Cloud Systems' },
  { start: 80, end: 99, title: 'Distributed Microservice', topic: 'Architecture' },
];

const SNAKES: Snake[] = [
  { head: 34, tail: 10, title: 'Memory Leak (C malloc)', bugType: 'C Memory' },
  { head: 48, tail: 16, title: 'SQL Injection Vulnerability', bugType: 'DBMS Security' },
  { head: 62, tail: 38, title: 'Unindexed Table Full Scan', bugType: 'SQL Query' },
  { head: 75, tail: 46, title: 'Stop-The-World GC Pause', bugType: 'JVM Memory' },
  { head: 88, tail: 56, title: 'Deadlock in Multithreading', bugType: 'Operating Systems' },
  { head: 95, tail: 74, title: 'Buffer Overflow Exploit', bugType: 'Cyber Security' },
  { head: 98, tail: 42, title: 'NullPointerException Crash', bugType: 'Java Runtime' },
];

// Helper to get row and col on 10x10 serpentine board
function getTileCoords(tile: number): { rowFromBottom: number; col: number; xPercent: number; yPercent: number } {
  const index = tile - 1;
  const rowFromBottom = Math.floor(index / 10);
  const isOddRow = rowFromBottom % 2 === 1;
  const colInRow = index % 10;
  const col = isOddRow ? 9 - colInRow : colInRow;

  // Percentage for CSS absolute positioning (center of cell)
  const xPercent = (col * 10) + 5;
  const yPercent = ((9 - rowFromBottom) * 10) + 5;

  return { rowFromBottom, col, xPercent, yPercent };
}

export const CodeSnakesAndLadders: React.FC<CodeSnakesAndLaddersProps> = ({
  progress,
  onUpdateProgress,
  onExit,
  activeTopicTitle,
  topicQuestions,
}) => {
  const [playerPos, setPlayerPos] = useState<number>(1);
  const [botPos, setBotPos] = useState<number>(1);
  const [currentTurn, setCurrentTurn] = useState<'player' | 'bot'>('player');
  const [diceValue, setDiceValue] = useState<number>(1);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [gameLog, setGameLog] = useState<string[]>([
    activeTopicTitle ? `Topic Focus Active: ${activeTopicTitle}` : 'Welcome to Code Snakes & Algorithmic Ladders!',
    'Roll the dice to advance. Answer BCA questions to tame bug snakes and avoid bites!',
  ]);
  const [winner, setWinner] = useState<'player' | 'bot' | null>(null);

  // Snake Bite Defense Question Modal State
  const [activeQuestion, setActiveQuestion] = useState<QuizQuestion | null>(null);
  const [questionContext, setQuestionContext] = useState<{
    type: 'snake_defense' | 'ladder_bonus';
    snake?: Snake;
    ladder?: Ladder;
    targetPos?: number;
  } | null>(null);
  const [selectedAnswerIdx, setSelectedAnswerIdx] = useState<number | null>(null);
  const [hasAnsweredQuestion, setHasAnsweredQuestion] = useState<boolean>(false);
  const [questionTimer, setQuestionTimer] = useState<number>(20);

  // Pool of questions: prioritize topicQuestions if provided, fallback to storageService modules
  const allQuestions: QuizQuestion[] = (topicQuestions && topicQuestions.length > 0)
    ? topicQuestions
    : storageService.getModules().flatMap((m) => m.quizQuestions);

  // Question countdown timer
  useEffect(() => {
    if (!activeQuestion || hasAnsweredQuestion) return;

    if (questionTimer <= 0) {
      handleAnswerSelect(-1); // timeout = incorrect
      return;
    }

    const timer = setInterval(() => {
      setQuestionTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [activeQuestion, hasAnsweredQuestion, questionTimer]);

  const addLog = (msg: string) => {
    setGameLog((prev) => [msg, ...prev.slice(0, 15)]);
  };

  // Roll dice for current turn
  const handleRollDice = () => {
    if (isRolling || winner || currentTurn !== 'player' || activeQuestion) return;

    setIsRolling(true);
    soundManager.playDiceRoll();

    let rollAnimCount = 0;
    const rollInterval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
      rollAnimCount++;
      if (rollAnimCount > 8) {
        clearInterval(rollInterval);
        const finalRoll = Math.floor(Math.random() * 6) + 1;
        setDiceValue(finalRoll);
        setIsRolling(false);
        processPlayerMove(finalRoll);
      }
    }, 70);
  };

  const processPlayerMove = (roll: number) => {
    let nextPos = playerPos + roll;
    if (nextPos > 100) {
      // Must land on 100 exactly, or bounce back
      nextPos = 100 - (nextPos - 100);
      addLog(`🎲 You rolled ${roll}. Bounced back from tile 100 to tile ${nextPos}.`);
    } else {
      addLog(`🎲 You rolled ${roll}! Advanced to tile ${nextPos}.`);
    }

    setPlayerPos(nextPos);
    soundManager.playLaneSwitch();

    // Check for win
    if (nextPos === 100) {
      handleVictory('player');
      return;
    }

    // Check for Snake Head
    const hitSnake = SNAKES.find((s) => s.head === nextPos);
    if (hitSnake) {
      // Trigger Bite Defense Quiz!
      const randomQ = allQuestions[Math.floor(Math.random() * allQuestions.length)];
      setActiveQuestion(randomQ);
      setQuestionContext({ type: 'snake_defense', snake: hitSnake });
      setSelectedAnswerIdx(null);
      setHasAnsweredQuestion(false);
      setQuestionTimer(20);
      soundManager.playCrash();
      return;
    }

    // Check for Ladder
    const hitLadder = LADDERS.find((l) => l.start === nextPos);
    if (hitLadder) {
      soundManager.playPowerUp();
      addLog(`🪜 ALGORITHMIC LADDER! Climbed via "${hitLadder.title}" from tile ${nextPos} to ${hitLadder.end}!`);
      setPlayerPos(hitLadder.end);
      if (hitLadder.end === 100) {
        handleVictory('player');
        return;
      }
      // Optional bonus question for double rewards
      const randomQ = allQuestions[Math.floor(Math.random() * allQuestions.length)];
      setActiveQuestion(randomQ);
      setQuestionContext({ type: 'ladder_bonus', ladder: hitLadder, targetPos: hitLadder.end });
      setSelectedAnswerIdx(null);
      setHasAnsweredQuestion(false);
      setQuestionTimer(20);
      return;
    }

    // End turn -> AI Turn
    setCurrentTurn('bot');
    setTimeout(() => {
      executeBotTurn();
    }, 1200);
  };

  const handleAnswerSelect = (idx: number) => {
    if (hasAnsweredQuestion || !activeQuestion || !questionContext) return;

    setSelectedAnswerIdx(idx);
    setHasAnsweredQuestion(true);
    const isCorrect = idx === activeQuestion.correctIndex;

    if (questionContext.type === 'snake_defense') {
      const snake = questionContext.snake!;
      if (isCorrect) {
        soundManager.playQuizCorrect();
        addLog(`🛡️ DEFENDED! You answered correctly and tamed the ${snake.title}! No bite inflicted!`);
        // Award XP and tokens
        const updated = {
          ...progress,
          xp: progress.xp + 60,
          recyclingTokens: progress.recyclingTokens + 20,
        };
        storageService.saveProgress(updated);
        onUpdateProgress(updated);
      } else {
        soundManager.playQuizWrong();
        addLog(`🐍 BITTEN! Incorrect answer. The ${snake.title} bit you! Slid down from ${snake.head} to ${snake.tail}.`);
        setPlayerPos(snake.tail);
      }
    } else if (questionContext.type === 'ladder_bonus') {
      if (isCorrect) {
        soundManager.playQuizCorrect();
        addLog(`⚡ BONUS ACCELERATION! Mastered ladder theory! Earned +100 XP and +30 Tokens!`);
        const updated = {
          ...progress,
          xp: progress.xp + 100,
          recyclingTokens: progress.recyclingTokens + 30,
        };
        storageService.saveProgress(updated);
        onUpdateProgress(updated);
      } else {
        soundManager.playQuizWrong();
        addLog(`Passed ladder, but missed the theory bonus. Keep studying!`);
      }
    }

    // Close modal after 2.2 seconds and pass turn to bot
    setTimeout(() => {
      setActiveQuestion(null);
      setQuestionContext(null);
      setCurrentTurn('bot');
      setTimeout(() => {
        executeBotTurn();
      }, 1000);
    }, 2200);
  };

  const executeBotTurn = () => {
    if (winner) return;

    setIsRolling(true);
    soundManager.playDiceRoll();

    setTimeout(() => {
      const botRoll = Math.floor(Math.random() * 6) + 1;
      setDiceValue(botRoll);
      setIsRolling(false);

      let nextBotPos = botPos + botRoll;
      if (nextBotPos > 100) {
        nextBotPos = 100 - (nextBotPos - 100);
        addLog(`🤖 BugBot rolled ${botRoll}. Bounced back to tile ${nextBotPos}.`);
      } else {
        addLog(`🤖 BugBot rolled ${botRoll}! Moved to tile ${nextBotPos}.`);
      }

      setBotPos(nextBotPos);

      if (nextBotPos === 100) {
        handleVictory('bot');
        return;
      }

      // Check snake for bot
      const snake = SNAKES.find((s) => s.head === nextBotPos);
      if (snake) {
        // Bot has 55% chance to defend
        const botDefended = Math.random() < 0.55;
        if (botDefended) {
          addLog(`🤖 BugBot solved the defense query and tamed the ${snake.title}!`);
        } else {
          addLog(`🤖 BugBot got bitten by ${snake.title}! Slid down to ${snake.tail}.`);
          setBotPos(snake.tail);
        }
      }

      // Check ladder for bot
      const ladder = LADDERS.find((l) => l.start === nextBotPos);
      if (ladder) {
        addLog(`🤖 BugBot climbed "${ladder.title}" from tile ${nextBotPos} to ${ladder.end}!`);
        setBotPos(ladder.end);
        if (ladder.end === 100) {
          handleVictory('bot');
          return;
        }
      }

      // Switch back to player
      setCurrentTurn('player');
    }, 1000);
  };

  const handleVictory = (who: 'player' | 'bot') => {
    setWinner(who);
    if (who === 'player') {
      soundManager.playStreakFanfare();
      addLog(`🏆 CHAMPION! You conquered the Code Snakes & Ladders syllabus board!`);
      const updated = {
        ...progress,
        xp: progress.xp + 300,
        recyclingTokens: progress.recyclingTokens + 100,
      };
      storageService.saveProgress(updated);
      onUpdateProgress(updated);
    } else {
      soundManager.playCrash();
      addLog(`🤖 BugBot reached tile 100 first! Rematch to reclaim the title!`);
    }
  };

  const handleRestart = () => {
    setPlayerPos(1);
    setBotPos(1);
    setCurrentTurn('player');
    setDiceValue(1);
    setWinner(null);
    setActiveQuestion(null);
    setGameLog([
      'New match started!',
      'Roll the dice to climb algorithmic ladders and avoid bug bites!',
    ]);
  };

  return (
    <div className="min-h-[85vh] flex flex-col p-4 max-w-6xl mx-auto animate-in fade-in duration-300">
      {/* Top Header & Status */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/90 border border-emerald-500/30 p-4 rounded-2xl shadow-xl backdrop-blur-md mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-400">
            <Zap className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-pixel text-xs text-emerald-400 uppercase tracking-widest">
                Ludo Snake & Bite
              </span>
              <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded-full font-mono">
                BCA Edition
              </span>
              {activeTopicTitle && (
                <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500/50 px-2.5 py-0.5 rounded-full font-pixel animate-pulse">
                  🎯 {activeTopicTitle}
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-white tracking-wide">
              Code Snakes & Algorithmic Ladders
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-slate-950/70 border border-slate-800 px-4 py-2 rounded-xl">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full bg-cyan-400 border border-cyan-200" />
              <span className="text-xs font-bold text-cyan-300">You (Tile {playerPos})</span>
            </div>
            <span className="text-slate-600">vs</span>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full bg-rose-500 border border-rose-300" />
              <span className="text-xs font-bold text-rose-300">BugBot (Tile {botPos})</span>
            </div>
          </div>

          <button
            onClick={onExit}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all border border-slate-700"
          >
            Back to Hub
          </button>
        </div>
      </div>

      {/* Main Game Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* 10x10 Serpentine Board Container (8 cols) */}
        <div className="lg:col-span-8 bg-slate-950/90 border-2 border-emerald-500/40 rounded-3xl p-4 shadow-2xl relative overflow-hidden">
          {/* Subtle Grid Pattern Overlay */}
          <div className="absolute inset-0 bg-retro-grid opacity-15 pointer-events-none" />

          {/* 10x10 Grid Tiles */}
          <div className="relative aspect-square w-full grid grid-cols-10 grid-rows-10 gap-1.5 p-1 rounded-2xl bg-slate-900/60 border border-slate-800">
            {/* Generate 100 tiles numbered serpentine from bottom to top */}
            {Array.from({ length: 100 }).map((_, i) => {
              // Row from top (0 is row 10, 9 is row 1)
              const rowFromTop = Math.floor(i / 10);
              const rowFromBottom = 9 - rowFromTop;
              const isOddRow = rowFromBottom % 2 === 1;
              const colInRow = i % 10;
              const col = isOddRow ? 9 - colInRow : colInRow;
              const tileNumber = rowFromBottom * 10 + col + 1;

              const isLadderStart = LADDERS.find((l) => l.start === tileNumber);
              const isLadderEnd = LADDERS.find((l) => l.end === tileNumber);
              const isSnakeHead = SNAKES.find((s) => s.head === tileNumber);
              const isSnakeTail = SNAKES.find((s) => s.tail === tileNumber);

              const hasPlayer = playerPos === tileNumber;
              const hasBot = botPos === tileNumber;

              let tileBg = 'bg-slate-900/90 border-slate-800 text-slate-400';
              if (isSnakeHead) {
                tileBg = 'bg-rose-950/70 border-rose-500/70 text-rose-300 shadow-inner shadow-rose-950';
              } else if (isLadderStart) {
                tileBg = 'bg-emerald-950/70 border-emerald-500/70 text-emerald-300 shadow-inner shadow-emerald-950';
              } else if (tileNumber === 100) {
                tileBg = 'bg-amber-950/80 border-amber-400 text-amber-200 animate-pulse';
              } else if (tileNumber % 2 === 0) {
                tileBg = 'bg-slate-900/40 border-slate-800/80 text-slate-400';
              }

              return (
                <div
                  key={tileNumber}
                  className={`relative rounded-lg border text-[11px] font-mono p-1 flex flex-col justify-between transition-all select-none ${tileBg}`}
                >
                  <div className="flex justify-between items-center leading-none">
                    <span className="font-bold text-[10px]">{tileNumber}</span>
                    {tileNumber === 100 && (
                      <Trophy className="w-3.5 h-3.5 text-amber-300" />
                    )}
                    {isSnakeHead && (
                      <span className="text-[12px]" title={`Snake: ${isSnakeHead.title}`}>
                        🐍
                      </span>
                    )}
                    {isLadderStart && (
                      <span className="text-[12px]" title={`Ladder: ${isLadderStart.title}`}>
                        🪜
                      </span>
                    )}
                  </div>

                  {/* Tile Topic / Tooltip Badge */}
                  {isSnakeHead && (
                    <span className="text-[7.5px] text-rose-300 font-bold truncate leading-tight">
                      BITE!
                    </span>
                  )}
                  {isLadderStart && (
                    <span className="text-[7.5px] text-emerald-300 font-bold truncate leading-tight">
                      BOOST
                    </span>
                  )}

                  {/* Player & Bot Token Avatars */}
                  <div className="absolute inset-0 flex items-center justify-center gap-1 pointer-events-none">
                    {hasPlayer && (
                      <div className="w-5 h-5 rounded-full bg-cyan-500 border-2 border-white shadow-lg flex items-center justify-center text-[10px] text-white font-bold animate-bounce z-20">
                        🎓
                      </div>
                    )}
                    {hasBot && (
                      <div className="w-5 h-5 rounded-full bg-rose-600 border-2 border-white shadow-lg flex items-center justify-center text-[10px] text-white font-bold animate-pulse z-10">
                        🤖
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* SVG Overlay Lines for Ladders and Snakes */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none p-4" style={{ overflow: 'visible' }}>
            <defs>
              <linearGradient id="ladderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.85" />
              </linearGradient>
              <linearGradient id="snakeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#881337" stopOpacity="0.85" />
              </linearGradient>
            </defs>

            {/* Render Ladder Connectors */}
            {LADDERS.map((l) => {
              const startCoords = getTileCoords(l.start);
              const endCoords = getTileCoords(l.end);
              return (
                <g key={`ladder_${l.start}`}>
                  <line
                    x1={`${startCoords.xPercent}%`}
                    y1={`${startCoords.yPercent}%`}
                    x2={`${endCoords.xPercent}%`}
                    y2={`${endCoords.yPercent}%`}
                    stroke="url(#ladderGrad)"
                    strokeWidth="3.5"
                    strokeDasharray="4 3"
                    strokeLinecap="round"
                    className="opacity-75"
                  />
                  <circle
                    cx={`${endCoords.xPercent}%`}
                    cy={`${endCoords.yPercent}%`}
                    r="4"
                    fill="#10b981"
                    className="animate-ping"
                  />
                </g>
              );
            })}

            {/* Render Snake Curves */}
            {SNAKES.map((s) => {
              const headCoords = getTileCoords(s.head);
              const tailCoords = getTileCoords(s.tail);
              // Calculate curved midpoint
              const midX = (headCoords.xPercent + tailCoords.xPercent) / 2 + 5;
              const midY = (headCoords.yPercent + tailCoords.yPercent) / 2 - 5;
              return (
                <path
                  key={`snake_${s.head}`}
                  d={`M ${headCoords.xPercent} ${headCoords.yPercent} Q ${midX} ${midY} ${tailCoords.xPercent} ${tailCoords.yPercent}`}
                  fill="none"
                  stroke="url(#snakeGrad)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  className="opacity-80"
                />
              );
            })}
          </svg>
        </div>

        {/* Right Controls & Info Panel (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Turn & Dice Action Box */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl text-center relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
                Current Turn
              </span>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                  currentTurn === 'player'
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50'
                    : 'bg-rose-950 text-rose-300 border border-rose-500/50'
                }`}
              >
                {currentTurn === 'player' ? 'Your Roll' : 'BugBot Rolling...'}
              </span>
            </div>

            {/* Dice Visual */}
            <div className="my-4 flex justify-center">
              <div
                className={`w-20 h-20 bg-gradient-to-br from-slate-800 to-slate-950 border-2 ${
                  currentTurn === 'player' ? 'border-cyan-400' : 'border-rose-400'
                } rounded-2xl shadow-2xl flex items-center justify-center transition-transform ${
                  isRolling ? 'rotate-45 scale-110 animate-spin' : ''
                }`}
              >
                <span className="font-pixel text-3xl font-bold text-white">
                  {diceValue}
                </span>
              </div>
            </div>

            {/* Roll Dice Button */}
            <button
              onClick={handleRollDice}
              disabled={currentTurn !== 'player' || isRolling || winner !== null || activeQuestion !== null}
              className={`w-full py-4 rounded-xl font-bold text-sm tracking-wide uppercase flex items-center justify-center gap-2 transition-all shadow-lg ${
                currentTurn === 'player' && !isRolling && !winner && !activeQuestion
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 shadow-emerald-500/20 active:scale-95'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
            >
              <Dice5 className="w-5 h-5" />
              <span>{isRolling ? 'Rolling Dice...' : 'Roll Dice (1 - 6)'}</span>
            </button>

            {winner && (
              <button
                onClick={handleRestart}
                className="w-full mt-3 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Play Rematch</span>
              </button>
            )}
          </div>

          {/* Legend Guide */}
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl text-xs space-y-2.5">
            <h4 className="font-bold text-white text-sm mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Syllabus Rulebook</span>
            </h4>
            <div className="flex items-start gap-2.5 text-slate-300">
              <span className="text-base leading-none">🪜</span>
              <div>
                <strong className="text-emerald-400">Algorithmic Ladders:</strong> Fast-track up the board (O(1) Hash Maps, B+ Trees, Docker). Complete bonus questions for +100 XP!
              </div>
            </div>
            <div className="flex items-start gap-2.5 text-slate-300">
              <span className="text-base leading-none">🐍</span>
              <div>
                <strong className="text-rose-400">Bug Snake Bites:</strong> Memory leaks, SQL injections, and null pointers try to bite you. Answer the BCA question to <em>tame the snake</em> and prevent falling!
              </div>
            </div>
          </div>

          {/* Live Action Game Feed */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex-1">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Match Log
            </h4>
            <div className="space-y-1.5 max-h-48 overflow-y-auto text-xs font-mono pr-1">
              {gameLog.map((log, idx) => (
                <div
                  key={idx}
                  className={`py-1 px-2 rounded ${
                    idx === 0
                      ? 'bg-slate-800/90 text-cyan-300 font-medium'
                      : 'text-slate-400'
                  }`}
                >
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SNAKE BITE DEFENSE & LADDER BONUS MODAL */}
      {activeQuestion && questionContext && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div
            className={`border rounded-3xl max-w-xl w-full p-6 shadow-2xl relative text-left ${
              questionContext.type === 'snake_defense'
                ? 'bg-slate-900 border-rose-500/60 shadow-rose-950/50'
                : 'bg-slate-900 border-emerald-500/60 shadow-emerald-950/50'
            }`}
          >
            {/* Header banner */}
            <div className="flex justify-between items-center mb-3">
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  questionContext.type === 'snake_defense'
                    ? 'bg-rose-950/80 border border-rose-500/50 text-rose-300'
                    : 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-300'
                }`}
              >
                {questionContext.type === 'snake_defense' ? (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                    <span>Bug Snake Bite Defense!</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Algorithmic Ladder Mastery Bonus</span>
                  </>
                )}
              </div>

              <div className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-950 text-amber-300 border border-slate-800">
                ⏱️ {questionTimer}s
              </div>
            </div>

            <div className="mb-3">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                {activeQuestion.semester} • {activeQuestion.topic}
              </div>
              <h3 className="text-base font-bold text-white mt-1 leading-snug">
                {activeQuestion.question}
              </h3>
            </div>

            {activeQuestion.codeSnippet && (
              <pre className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono text-cyan-300 mb-3 overflow-x-auto">
                <code>{activeQuestion.codeSnippet}</code>
              </pre>
            )}

            {/* Answer Options */}
            <div className="flex flex-col gap-2.5 mb-4">
              {activeQuestion.options.map((opt, idx) => {
                let btnStyle = 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700 text-slate-200';
                let icon = null;

                if (hasAnsweredQuestion) {
                  if (idx === activeQuestion.correctIndex) {
                    btnStyle = 'bg-emerald-950/90 border-emerald-500 text-emerald-200';
                    icon = <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
                  } else if (idx === selectedAnswerIdx) {
                    btnStyle = 'bg-rose-950/90 border-rose-500 text-rose-200';
                    icon = <XCircle className="w-5 h-5 text-rose-400 shrink-0" />;
                  } else {
                    btnStyle = 'opacity-40 bg-slate-800/40 border-slate-700 text-slate-400';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={hasAnsweredQuestion}
                    onClick={() => handleAnswerSelect(idx)}
                    className={`w-full p-3.5 rounded-xl border text-xs md:text-sm font-medium flex items-center justify-between text-left transition-all ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {icon}
                  </button>
                );
              })}
            </div>

            {/* Explanation reveal */}
            {hasAnsweredQuestion && (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed animate-in fade-in">
                <span className="font-bold text-emerald-400 block mb-1">
                  Syllabus Breakdown:
                </span>
                {activeQuestion.explanation}
              </div>
            )}
          </div>
        </div>
      )}

      {/* VICTORY / DEFEAT MODAL */}
      {winner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-slate-900 border-2 border-emerald-500 rounded-3xl max-w-md w-full p-8 text-center shadow-2xl relative">
            <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-4xl shadow-xl">
              {winner === 'player' ? '🏆' : '🤖'}
            </div>

            <h3 className="text-2xl font-black text-white mb-2">
              {winner === 'player' ? 'VICTORY ACHIEVED!' : 'BUGBOT WON!'}
            </h3>

            <p className="text-sm text-slate-300 mb-6 leading-relaxed">
              {winner === 'player'
                ? 'Outstanding algorithmic execution! You navigated through all 100 tiles, tamed the bug snakes, and conquered the BCA curriculum board!'
                : 'BugBot reached Tile 100 first. Sharpen your syllabus defense skills and roll again to claim the crown!'}
            </p>

            {winner === 'player' && (
              <div className="flex justify-center gap-4 mb-6">
                <div className="bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-xl">
                  <div className="text-[10px] uppercase font-bold text-slate-400">XP Earned</div>
                  <div className="text-lg font-bold text-cyan-300">+300 XP</div>
                </div>
                <div className="bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-xl">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Tokens</div>
                  <div className="text-lg font-bold text-amber-300">+100 🪙</div>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleRestart}
                className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all"
              >
                Play Again
              </button>
              <button
                onClick={onExit}
                className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider transition-all"
              >
                Back to Hub
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
