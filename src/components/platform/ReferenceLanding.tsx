import React from 'react';
import { BookOpen, Gamepad2 } from 'lucide-react';
import { UserRole } from '../../types/game';

interface ReferenceLandingProps {
  onLaunchGame: () => void;
  onNavigate: (tab: 'learn' | 'games' | 'achievements') => void;
  onOpenProfile: () => void;
  role: UserRole;
  nickname: string;
}

export const ReferenceLanding: React.FC<ReferenceLandingProps> = ({ onLaunchGame, onNavigate, onOpenProfile, role, nickname }) => (
  <main className="flex min-h-screen w-full items-center justify-center overflow-y-auto bg-slate-950 px-4 py-10 text-white">
    <section className="w-full max-w-4xl">
      <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-sm font-bold tracking-[0.3em] text-emerald-400">ECORUSH</div>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">What would you like to do?</h1>
          <p className="mt-2 text-slate-400">Welcome, {nickname}. Pick up where you want to start.</p>
        </div>
        <button onClick={onOpenProfile} className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:border-emerald-500 hover:text-white">
          {nickname} · {role}
        </button>
      </header>

      <div className="grid gap-5 sm:grid-cols-2">
        <button onClick={() => onNavigate('learn')} className="group rounded-3xl border border-cyan-500/30 bg-slate-900 p-7 text-left transition hover:-translate-y-1 hover:border-cyan-400 sm:p-9">
          <span className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300"><BookOpen size={28} /></span>
          <span className="block text-2xl font-bold">Study topics</span>
          <span className="mt-2 block leading-relaxed text-slate-400">Browse your course topics, read notes, and practice what you learn.</span>
          <span className="mt-7 inline-block text-sm font-semibold text-cyan-300">Open study topics →</span>
        </button>

        <button onClick={onLaunchGame} className="group rounded-3xl border border-emerald-500/30 bg-slate-900 p-7 text-left transition hover:-translate-y-1 hover:border-emerald-400 sm:p-9">
          <span className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300"><Gamepad2 size={28} /></span>
          <span className="block text-2xl font-bold">Play games</span>
          <span className="mt-2 block leading-relaxed text-slate-400">Choose a learning game or jump into the 3D Eco-Runner.</span>
          <span className="mt-7 inline-block text-sm font-semibold text-emerald-300">View games →</span>
        </button>
      </div>
    </section>
  </main>
);
