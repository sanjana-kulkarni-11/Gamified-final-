/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { QuizQuestion } from '../../types/game';
import { storageService } from '../../services/storageService';
import { CheckCircle2, XCircle, Zap, FastForward } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';

interface KnowledgeCheckpointModalProps {
  onComplete: (correct: boolean) => void;
  questions?: QuizQuestion[];
  activeTopicTitle?: string;
}

export const KnowledgeCheckpointModal: React.FC<KnowledgeCheckpointModalProps> = ({ 
  onComplete,
  questions,
  activeTopicTitle,
}) => {
  // Pick question from topic questions or storageService modules
  const allQuestions: QuizQuestion[] = (questions && questions.length > 0)
    ? questions
    : storageService.getModules().flatMap((m) => m.quizQuestions);

  const [question] = useState<QuizQuestion>(
    allQuestions[Math.floor(Math.random() * allQuestions.length)]
  );

  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);

  const handleSelect = (idx: number) => {
    if (hasAnswered) return;
    setSelectedIdx(idx);
    setHasAnswered(true);
    const isCorrect = idx === question.correctIndex;
    if (isCorrect) {
      soundManager.playPowerUp();
    } else {
      soundManager.playCrash();
    }

    // Auto resume after 1.8 seconds with results
    setTimeout(() => {
      onComplete(isCorrect);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-cyan-500/50 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative text-left">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-bold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 fill-cyan-400" />
              <span>Holo-Knowledge Checkpoint</span>
            </div>
            {activeTopicTitle && (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-pixel">
                🎯 {activeTopicTitle}
              </span>
            )}
          </div>

          <button
            onClick={() => onComplete(false)}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-medium transition-colors"
          >
            <span>Skip</span>
            <FastForward className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wide mb-1">
          <span>{question.semester}</span>
          <span>•</span>
          <span>{question.topic}</span>
        </div>
        <h3 className="text-base font-bold text-white mb-2 leading-snug">
          {question.question}
        </h3>

        {question.codeSnippet && (
          <pre className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono text-cyan-300 mb-3 overflow-x-auto">
            <code>{question.codeSnippet}</code>
          </pre>
        )}

        <div className="flex flex-col gap-2.5 mb-4">
          {question.options.map((opt, idx) => {
            let btnStyle = 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700 text-slate-200';
            let icon = null;

            if (hasAnswered) {
              if (idx === question.correctIndex) {
                btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200';
                icon = <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
              } else if (idx === selectedIdx) {
                btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200';
                icon = <XCircle className="w-5 h-5 text-rose-400 shrink-0" />;
              } else {
                btnStyle = 'opacity-40 bg-slate-800/40 border-slate-700 text-slate-400';
              }
            }

            return (
              <button
                key={idx}
                disabled={hasAnswered}
                onClick={() => handleSelect(idx)}
                className={`w-full p-3.5 rounded-xl border text-sm font-medium flex items-center justify-between text-left transition-all ${btnStyle}`}
              >
                <span>{opt}</span>
                {icon}
              </button>
            );
          })}
        </div>

        {hasAnswered && (
          <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 animate-in fade-in duration-200">
            <span className="font-bold text-cyan-300">Explanation: </span>
            {question.explanation}
          </div>
        )}
      </div>
    </div>
  );
};
