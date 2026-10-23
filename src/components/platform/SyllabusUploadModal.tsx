/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { 
  syllabusParserService, 
  PRESET_SYLLABUSES, 
  ParsedSyllabusResult 
} from '../../services/syllabusParserService';
import { storageService } from '../../services/storageService';
import { soundManager } from '../../audio/soundManager';
import confetti from 'canvas-confetti';
import {
  X,
  Upload,
  FileText,
  Sparkles,
  CheckCircle,
  HelpCircle,
  Layers,
  ArrowRight,
  BookOpen,
  RotateCcw,
  AlertCircle,
  Zap,
  Globe
} from 'lucide-react';

interface SyllabusUploadModalProps {
  onClose: () => void;
  onSyllabusApplied: (result: ParsedSyllabusResult) => void;
}

export const SyllabusUploadModal: React.FC<SyllabusUploadModalProps> = ({
  onClose,
  onSyllabusApplied,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste' | 'presets'>('presets');
  const [syllabusTitle, setSyllabusTitle] = useState<string>('BCA Computer Science Syllabus 2026');
  const [pastedText, setPastedText] = useState<string>(PRESET_SYLLABUSES[0].sampleText);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Quick live detection
  const detectedUnitsCount = (pastedText.match(/unit|module|chapter|week|\n[0-9]+\./gi) || []).length;

  const handleSelectPreset = (presetId: string) => {
    const preset = PRESET_SYLLABUSES.find((p) => p.id === presetId);
    if (!preset) return;
    setSyllabusTitle(preset.name);
    setPastedText(preset.sampleText);
    soundManager.playWhoosh();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    setSelectedFileName(file.name);
    setErrorMsg(null);

    const baseName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
    setSyllabusTitle(baseName.toUpperCase());

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setPastedText(content);
        setActiveTab('paste'); // Switch to paste tab so user can review
        soundManager.playPowerUp();
      }
    };
    reader.onerror = () => {
      setErrorMsg('Failed to read file. Please ensure it is a valid text, markdown, or JSON file.');
    };
    reader.readAsText(file);
  };

  const handleGenerate = () => {
    if (!pastedText.trim()) {
      setErrorMsg('Please enter or upload syllabus content first.');
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);

    try {
      // Parse with syllabusParserService
      const result = syllabusParserService.parseSyllabus(pastedText, syllabusTitle);

      // Persist to storage
      storageService.saveModules(result.modules);
      storageService.saveSyllabusRoadmap(result.stations);
      storageService.saveActiveSyllabusTitle(result.syllabusTitle);

      soundManager.playPowerUp();

      // Trigger Confetti Celebration!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}

      onSyllabusApplied(result);
      onClose();
    } catch (err) {
      console.error(err);
      setErrorMsg('Error generating syllabus roadmap. Check your format and try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResetToDefault = () => {
    storageService.resetSyllabusToDefault();
    const defaultModules = storageService.getModules();
    soundManager.playWhoosh();
    onSyllabusApplied({
      syllabusTitle: 'BCA Green Computing & Core Curriculum',
      modules: defaultModules,
      stations: [] // will trigger default stations fallback
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#0b1222] border-2 border-amber-400/60 rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#171b30] via-[#1a233d] to-[#171b30] p-5 border-b border-amber-500/30 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 font-pixel text-xl shadow-inner shrink-0">
              📤
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-pixel bg-amber-950 text-amber-300 border border-amber-500/40 uppercase">
                  Curriculum Engine
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Syllabus-to-Roadmap AI Synthesizer
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-sans">
                Upload Syllabus &amp; Generate Topic Roadmap
              </h2>
              <p className="text-xs text-slate-300 font-sans mt-0.5">
                Upload your syllabus or pick a curriculum. Automatically generates topic stations, respected notes, and adapts the 3 games!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="bg-[#070c18] px-5 py-2.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('presets')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-pixel uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'presets'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Instant Presets</span>
            </button>

            <button
              onClick={() => setActiveTab('upload')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-pixel uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'upload'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload File (.txt, .json, .md)</span>
            </button>

            <button
              onClick={() => setActiveTab('paste')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-pixel uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'paste'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Paste Text</span>
            </button>
          </div>

          <button
            onClick={handleResetToDefault}
            className="text-xs font-mono text-slate-400 hover:text-amber-400 flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset to EcoRush Default</span>
          </button>
        </div>

        {/* Body Form */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* Syllabus Title Field */}
          <div>
            <label className="block text-xs font-pixel text-slate-300 uppercase mb-1.5">
              Course / Syllabus Title:
            </label>
            <input
              type="text"
              value={syllabusTitle}
              onChange={(e) => setSyllabusTitle(e.target.value)}
              placeholder="e.g. BCA 3rd Sem Data Structures &amp; Systems"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400 font-sans"
            />
          </div>

          {/* TAB 1: PRESETS */}
          {activeTab === 'presets' && (
            <div className="space-y-3">
              <div className="text-xs font-pixel text-amber-300 uppercase">
                CHOOSE A PRE-CONFIGURED SYLLABUS (1-CLICK TEST):
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PRESET_SYLLABUSES.map((p) => {
                  const isSelected = syllabusTitle === p.name;
                  return (
                    <div
                      key={p.id}
                      onClick={() => handleSelectPreset(p.id)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-amber-950/40 border-amber-400 shadow-lg scale-[1.01]'
                          : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-xl">{p.icon}</span>
                          <h4 className="font-pixel text-xs text-white leading-tight">
                            {p.name}
                          </h4>
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-2 font-sans mb-3">
                          {p.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[10px] font-mono">
                        <span className="text-amber-400 font-semibold">
                          {isSelected ? '✓ Selected' : 'Click to select'}
                        </span>
                        <span className="text-slate-500">4-5 Roadmap Units</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: FILE UPLOAD */}
          {activeTab === 'upload' && (
            <div className="space-y-3">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
                  dragActive
                    ? 'border-cyan-400 bg-cyan-950/30'
                    : 'border-slate-700 bg-slate-900/50 hover:border-cyan-500/70 hover:bg-slate-900'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".txt,.json,.md,.text"
                  className="hidden"
                />
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-2xl mb-3 shadow-inner">
                  📁
                </div>
                <h4 className="text-sm font-bold text-white mb-1 font-sans">
                  {selectedFileName ? `Loaded: ${selectedFileName}` : 'Drag & Drop your Syllabus file here'}
                </h4>
                <p className="text-xs text-slate-400 max-w-sm mb-3">
                  Accepts Syllabus text documents, Markdown files, or JSON course outlines (.txt, .md, .json)
                </p>
                <span className="px-4 py-1.5 rounded-xl bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-pixel text-[10px] uppercase">
                  Browse Files
                </span>
              </div>
            </div>
          )}

          {/* TAB 3: PASTE TEXT */}
          {activeTab === 'paste' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-pixel text-emerald-300 uppercase">
                  Syllabus Outline &amp; Topic Units:
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  Detected ~{Math.max(1, detectedUnitsCount)} topics/units
                </span>
              </div>
              <textarea
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                rows={10}
                placeholder="Paste your syllabus units here... e.g.&#10;UNIT 1: Arrays and Linked Lists&#10;- Pointers and Dynamic Memory in C&#10;- Merge Sort and Quick Sort&#10;&#10;UNIT 2: Operating Systems..."
                className="w-full p-3.5 rounded-2xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-mono leading-relaxed focus:outline-none focus:border-emerald-400 resize-none shadow-inner"
              />
            </div>
          )}

          {/* Error display */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/50 flex items-center gap-2 text-xs text-red-200">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* What will be generated summary banner */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-pixel text-xs">
                ✓
              </div>
              <div>
                <div className="font-pixel text-[11px] text-white">WHAT THIS WILL CREATE:</div>
                <div className="text-slate-400 text-[11px]">
                  Topic Roadmap Nodes + Respected Notes + 3 Playable Games for each topic
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-300 font-mono text-[11px]">
              <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700">🏃 3D Runner</span>
              <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700">🐍 Snakes</span>
              <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700">⚡ Kahoot</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-[#070c18] p-4 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-pixel text-xs border border-slate-700 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleGenerate}
            disabled={isProcessing}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-pixel text-xs font-black border-2 border-black pixel-btn-shadow flex items-center gap-2 transition-transform active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 fill-slate-950" />
            <span>{isProcessing ? 'GENERATING ROADMAP...' : 'GENERATE ROADMAP & RESPECTED NOTES'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
