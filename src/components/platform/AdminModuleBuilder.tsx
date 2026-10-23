/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LearningModule, QuizQuestion, BCASemester, BCASubject } from '../../types/game';
import { INITIAL_LEARNING_MODULES } from '../../data/initialData';
import { ShieldAlert, Plus, Trash2, Edit3, Save, CheckCircle, Eye, EyeOff } from 'lucide-react';

export const AdminModuleBuilder: React.FC = () => {
  const [modules, setModules] = useState<LearningModule[]>(INITIAL_LEARNING_MODULES);
  const [editingModule, setEditingModule] = useState<LearningModule | null>(null);

  // Form states for creating/editing a module
  const [title, setTitle] = useState('');
  const [semester, setSemester] = useState<BCASemester | string>('Sem 3 (DSA & Operating Systems)');
  const [subject, setSubject] = useState<BCASubject | string>('Data Structures & Algorithms');
  const [readTime, setReadTime] = useState('5 min read');
  const [summary, setSummary] = useState('');
  const [contentParagraph, setContentParagraph] = useState('');

  // Form states for adding a question
  const [newQuestion, setNewQuestion] = useState('');
  const [option0, setOption0] = useState('');
  const [option1, setOption1] = useState('');
  const [option2, setOption2] = useState('');
  const [option3, setOption3] = useState('');
  const [correctIndex, setCorrectIndex] = useState(0);
  const [explanation, setExplanation] = useState('');

  const handleStartNew = () => {
    const newMod: LearningModule = {
      id: `mod_${Date.now()}`,
      title: 'New BCA Environmental Syllabus Module',
      semester: 'Sem 3 (DSA & Operating Systems)',
      subject: 'Data Structures & Algorithms',
      readTime: '4 min read',
      summary: 'Module summary overview for students.',
      content: ['Enter comprehensive syllabus lecture notes here...'],
      keyTakeaways: ['Core exam takeaway 1', 'Core exam takeaway 2'],
      quizQuestions: [],
      published: true,
      assignedBatches: ['BCA 3rd Sem A'],
    };
    setEditingModule(newMod);
    setTitle(newMod.title);
    setSemester(newMod.semester);
    setSubject(newMod.subject);
    setReadTime(newMod.readTime);
    setSummary(newMod.summary);
    setContentParagraph(newMod.content.join('\n\n'));
  };

  const handleEdit = (mod: LearningModule) => {
    setEditingModule(mod);
    setTitle(mod.title);
    setSemester(mod.semester);
    setSubject(mod.subject);
    setReadTime(mod.readTime);
    setSummary(mod.summary);
    setContentParagraph(mod.content.join('\n\n'));
  };

  const handleTogglePublish = (id: string) => {
    setModules(
      modules.map((m) => (m.id === id ? { ...m, published: !m.published } : m))
    );
  };

  const handleDelete = (id: string) => {
    setModules(modules.filter((m) => m.id !== id));
    if (editingModule?.id === id) setEditingModule(null);
  };

  const handleSaveModule = () => {
    if (!editingModule) return;
    const updated: LearningModule = {
      ...editingModule,
      title,
      semester,
      subject,
      readTime,
      summary,
      content: contentParagraph.split('\n\n').filter((p) => p.trim().length > 0),
    };

    const exists = modules.some((m) => m.id === updated.id);
    if (exists) {
      setModules(modules.map((m) => (m.id === updated.id ? updated : m)));
    } else {
      setModules([updated, ...modules]);
    }
    setEditingModule(null);
  };

  const handleAddQuestion = () => {
    if (!editingModule || !newQuestion.trim()) return;
    const q: QuizQuestion = {
      id: `q_${Date.now()}`,
      semester,
      question: newQuestion,
      options: [option0 || 'Option A', option1 || 'Option B', option2 || 'Option C', option3 || 'Option D'],
      correctIndex,
      explanation: explanation || 'Standard university syllabus principle.',
      topic: subject,
    };

    const updated = {
      ...editingModule,
      quizQuestions: [...editingModule.quizQuestions, q],
    };
    setEditingModule(updated);
    setModules(modules.map((m) => (m.id === updated.id ? updated : m)));

    // Reset question inputs
    setNewQuestion('');
    setOption0('');
    setOption1('');
    setOption2('');
    setOption3('');
    setExplanation('');
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-6 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-400 mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>Administrator Curriculum Console</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">Curriculum & Module Builder</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Publish university courseware and author assessment items for BCA college students.
          </p>
        </div>

        <button
          onClick={handleStartNew}
          className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Module</span>
        </button>
      </div>

      {editingModule ? (
        /* Edit / Author Form */
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 mb-8">
          <div className="flex justify-between items-center pb-4 mb-6 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white uppercase tracking-wide">
              Authoring: {title || 'Untitled Module'}
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setEditingModule(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveModule}
                className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black rounded-xl uppercase flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Module</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div className="sm:col-span-1">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
                Semester Tier
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value as BCASemester)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Sem 1-2 (Foundation & E-Waste)">Sem 1-2 (Foundation & E-Waste)</option>
                <option value="Sem 3 (DSA & Operating Systems)">Sem 3 (DSA & Operating Systems)</option>
                <option value="Sem 4 (DBMS & OOP Systems)">Sem 4 (DBMS & OOP Systems)</option>
                <option value="Sem 5-6 (Networks & Cloud Computing)">Sem 5-6 (Networks & Cloud Computing)</option>
              </select>
            </div>

            <div className="sm:col-span-1">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
                Curriculum Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value as BCASubject)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Data Structures & Algorithms">Data Structures & Algorithms</option>
                <option value="Operating Systems">Operating Systems</option>
                <option value="Database Management Systems">Database Management Systems</option>
                <option value="Computer Networks">Computer Networks</option>
                <option value="Cloud Computing & Sustainable Software">Cloud Computing & Sustainable Software</option>
                <option value="OOP with Java / C++">OOP with Java / C++</option>
                <option value="E-Waste Management & Cyber Law">E-Waste Management & Cyber Law</option>
              </select>
            </div>

            <div className="sm:col-span-1">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
                Estimated Read Time
              </label>
              <input
                type="text"
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
              Module Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
              Summary / Abstract
            </label>
            <input
              type="text"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
              Lesson Content (Separate paragraphs with double enter)
            </label>
            <textarea
              rows={6}
              value={contentParagraph}
              onChange={(e) => setContentParagraph(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-emerald-500 leading-relaxed font-sans"
            />
          </div>

          {/* Quiz Question Authoring Section */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5">
            <h4 className="text-sm font-bold text-cyan-300 uppercase tracking-wide mb-3">
              Quiz Questions ({editingModule.quizQuestions.length} Created)
            </h4>

            {/* Existing Questions List */}
            <div className="space-y-2 mb-4">
              {editingModule.quizQuestions.map((q, idx) => (
                <div key={q.id} className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-white">Q{idx + 1}: </span>
                    <span className="text-slate-300">{q.question}</span>
                    <span className="ml-2 text-emerald-400 font-semibold">({q.options[q.correctIndex]})</span>
                  </div>
                  <button
                    onClick={() => {
                      const updated = {
                        ...editingModule,
                        quizQuestions: editingModule.quizQuestions.filter((_, i) => i !== idx),
                      };
                      setEditingModule(updated);
                      setModules(modules.map((m) => (m.id === updated.id ? updated : m)));
                    }}
                    className="text-rose-400 hover:text-rose-300 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add New Question Inputs */}
            <div className="border-t border-slate-800 pt-4">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
                New Question Prompt
              </label>
              <input
                type="text"
                placeholder="e.g. Which Big-O complexity represents an optimal binary search on sorted data?"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white mb-3 focus:outline-none focus:border-cyan-500"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                <input
                  type="text"
                  placeholder="Option 1"
                  value={option0}
                  onChange={(e) => setOption0(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                />
                <input
                  type="text"
                  placeholder="Option 2"
                  value={option1}
                  onChange={(e) => setOption1(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                />
                <input
                  type="text"
                  placeholder="Option 3"
                  value={option2}
                  onChange={(e) => setOption2(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                />
                <input
                  type="text"
                  placeholder="Option 4"
                  value={option3}
                  onChange={(e) => setOption3(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-0.5">Correct Option Index</label>
                  <select
                    value={correctIndex}
                    onChange={(e) => setCorrectIndex(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                  >
                    <option value={0}>Option 1 is correct</option>
                    <option value={1}>Option 2 is correct</option>
                    <option value={2}>Option 3 is correct</option>
                    <option value={3}>Option 4 is correct</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-0.5">Curriculum Explanation</label>
                  <input
                    type="text"
                    placeholder="Short syllabus rationale..."
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                </div>
              </div>

              <button
                onClick={handleAddQuestion}
                className="py-2 px-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Question to Quiz</span>
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Modules Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
        <h3 className="text-base font-bold text-white uppercase tracking-wide mb-4">
          All Published & Draft Modules ({modules.length})
        </h3>

        <div className="space-y-3">
          {modules.map((m) => (
            <div
              key={m.id}
              className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:border-slate-700 transition-colors"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-cyan-400">
                    {m.subject}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {m.semester}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      m.published
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {m.published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white">{m.title}</h4>
                <div className="text-xs text-slate-400 mt-0.5">
                  {m.quizQuestions.length} Quiz questions • Assigned to: {m.assignedBatches.join(', ')}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleTogglePublish(m.id)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                  title={m.published ? 'Unpublish' : 'Publish'}
                >
                  {m.published ? <EyeOff className="w-4 h-4 text-amber-400" /> : <Eye className="w-4 h-4 text-emerald-400" />}
                </button>

                <button
                  onClick={() => handleEdit(m)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                  title="Edit Module"
                >
                  <Edit3 className="w-4 h-4 text-cyan-400" />
                </button>

                <button
                  onClick={() => handleDelete(m.id)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                  title="Delete Module"
                >
                  <Trash2 className="w-4 h-4 text-rose-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
