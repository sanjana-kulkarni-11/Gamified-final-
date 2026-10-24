/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { StudentProgress, UserRole } from '../../types/game';
import { storageService } from '../../services/storageService';
import { soundManager } from '../../audio/soundManager';
import {
  X,
  User,
  Mail,
  Sparkles,
  CheckCircle,
} from 'lucide-react';

interface LoginModalProps {
  currentProgress: StudentProgress;
  canClose?: boolean;
  onClose: () => void;
  onLoginSuccess: (updated: StudentProgress) => void;
}

const DEMO_ACCOUNTS = [
  {
    name: 'Kavya Sharma',
    email: 'kavya.bca@campus.edu',
    batch: 'BCA 3rd Sem A',
    role: 'student' as UserRole,
    avatar: '🎓',
    title: 'Top BCA Scholar'
  },
  {
    name: 'Aarav Patel',
    email: 'aarav.dev@campus.edu',
    batch: 'BCA 3rd Sem B',
    role: 'student' as UserRole,
    avatar: '👨‍💻',
    title: 'Algorithm Sprint Champ'
  },
  {
    name: 'Dr. Ananya Ray',
    email: 'ananya.ray@faculty.edu',
    batch: 'Faculty of Computing',
    role: 'teacher' as UserRole,
    avatar: '👩‍🏫',
    title: 'Professor & HOD'
  },
  {
    name: 'System Admin',
    email: 'admin@ecorush.edu',
    batch: 'Campus Admin Console',
    role: 'admin' as UserRole,
    avatar: '🛡️',
    title: 'System Administrator'
  }
];

export const LoginModal: React.FC<LoginModalProps> = ({
  currentProgress,
  canClose = true,
  onClose,
  onLoginSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [name, setName] = useState<string>(currentProgress.nickname);
  const [email, setEmail] = useState<string>(currentProgress.email);
  const [batch, setBatch] = useState<string>(currentProgress.batch);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const batches = [
    'BCA 3rd Sem A',
    'BCA 3rd Sem B',
    'BCA 4th Sem Systems',
    'BCA 5th Sem AI/DS',
    'BCA 6th Sem Cloud'
  ];

  const handleQuickLogin = (demo: typeof DEMO_ACCOUNTS[0]) => {
    setName(demo.name);
    setEmail(demo.email);
    setBatch(demo.batch);
    soundManager.playPowerUp();

    const loggedIn = storageService.loginUser({
      nickname: demo.name,
      email: demo.email,
      batch: demo.batch,
      role: demo.role,
    }, rememberMe);
    onLoginSuccess(loggedIn);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter your full student name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid university email address.');
      return;
    }

    soundManager.playPowerUp();
    const loggedIn = storageService.loginUser({
      nickname: name.trim(),
      email: email.trim(),
      batch,
      role: 'student',
    }, rememberMe);

    onLoginSuccess(loggedIn);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#0b1222] border-2 border-emerald-500/60 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#0d1d36] via-[#102a45] to-[#0d1d36] p-5 border-b border-emerald-500/30 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 text-xl shadow-inner font-pixel">
              🎓
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-pixel bg-emerald-950 text-emerald-300 border border-emerald-500/40 uppercase">
                  Authentication Portal
                </span>
              </div>
              <h2 className="text-xl font-black text-white font-sans tracking-tight">
                {activeTab === 'login' ? 'Student Profile Login' : 'Create Student Profile'}
              </h2>
              <div className="text-xs text-slate-400">
                This prototype saves your profile and progress in this browser. Use a demo profile for faculty or admin views.
              </div>
            </div>
          </div>

          {canClose && <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>}
        </div>

        {/* Tab Switcher */}
        <div className="bg-[#070c18] px-5 py-2.5 border-b border-slate-800 flex items-center gap-2">
          <button
            onClick={() => {
              setActiveTab('login');
              setErrorMsg(null);
            }}
            className={`px-4 py-1.5 rounded-xl text-xs font-pixel uppercase transition-all cursor-pointer ${
              activeTab === 'login'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setActiveTab('register');
              setErrorMsg(null);
            }}
            className={`px-4 py-1.5 rounded-xl text-xs font-pixel uppercase transition-all cursor-pointer ${
              activeTab === 'register'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            New Student Register
          </button>
        </div>

        {/* Quick Demo Login Pills */}
        <div className="px-5 pt-4 pb-1">
          <div className="text-[10px] font-pixel text-slate-400 uppercase mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>DEMO PROFILES:</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {DEMO_ACCOUNTS.map((demo, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickLogin(demo)}
                className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 flex items-center gap-2 text-left transition-all group cursor-pointer"
              >
                <span className="text-xl group-hover:scale-110 transition-transform">{demo.avatar}</span>
                <div className="overflow-hidden">
                  <div className="font-pixel text-[10px] text-white truncate">{demo.name}</div>
                  <div className="text-[9px] text-emerald-400 font-mono truncate">{demo.batch}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-500/50 text-xs text-rose-200">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-xs font-pixel text-slate-300 uppercase mb-1">
              Full Name / Campus Nickname
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Kavya Sharma"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-sans focus:outline-none focus:border-emerald-400"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-pixel text-slate-300 uppercase mb-1">
              University Email / Student ID
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. kavya.bca@campus.edu"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-sans focus:outline-none focus:border-emerald-400"
                required
              />
            </div>
          </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-pixel text-slate-300 uppercase mb-1">
                Batch / Semester
              </label>
              <select
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-sans focus:outline-none focus:border-emerald-400"
              >
                {batches.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-pixel text-slate-300 uppercase mb-1">
                Portal Role
              </label>
              <div className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-xs font-sans">
                Student Scholar
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded bg-slate-900 border-slate-700 text-emerald-500 focus:ring-0"
              />
              <span>Remember login on this browser</span>
            </label>
            <span className="text-[11px] font-mono text-emerald-400">✓ Auto-saves Progress</span>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-between gap-3">
            {canClose && <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-pixel text-xs border border-slate-700 transition-colors"
            >
              Cancel
            </button>}

            <button
              type="submit"
              className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-pixel text-xs font-black border-2 border-black pixel-btn-shadow shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{activeTab === 'login' ? 'SIGN IN & ENTER PORTAL' : 'CREATE ACCOUNT & ENTER'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
