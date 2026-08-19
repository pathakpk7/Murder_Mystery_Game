import React, { useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { FolderOpen, Lock, Play, FileText, CheckCircle2, Clock, Award } from 'lucide-react';

export default function CasesDossierView({ onStartInvestigation, onOpenBriefing }) {
  const { db, player, isCaseUnlocked } = usePlayer();
  const [activeActFilter, setActiveActFilter] = useState('all');

  const cases = db?.game_cases || [];

  const filteredCases = cases.filter((c) => {
    if (activeActFilter === 'all') return true;
    if (activeActFilter === 'tutorial') return c.id === 0;
    if (activeActFilter === 'act1') return c.id >= 1 && c.id <= 5;
    if (activeActFilter === 'act2') return c.id >= 6 && c.id <= 10;
    if (activeActFilter === 'act3') return c.id >= 11 && c.id <= 15;
    if (activeActFilter === 'act4') return c.id >= 16 && c.id <= 18;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Dossier Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#262633] pb-6">
        <div>
          <span className="text-xs font-mono font-bold text-[#d4af37] bg-[#d4af37]/10 border border-[#d4af37]/30 px-3 py-1 rounded">
            CLASSIFIED FILES DIRECTORY
          </span>
          <h1 className="text-3xl font-extrabold text-[#e0e0e0] mt-2">Cases Dossier</h1>
          <p className="text-xs text-[#8a8a9e]">19 Interconnected Homicide Files • 4 Master Story Arcs</p>
        </div>

        {/* Act Filter Tabs */}
        <div className="flex flex-wrap gap-1 bg-[#141419] p-1 border border-[#262633] rounded-md">
          {[
            { id: 'all', label: 'All Files (19)' },
            { id: 'tutorial', label: 'Tutorial' },
            { id: 'act1', label: 'Act I (1-5)' },
            { id: 'act2', label: 'Act II (6-10)' },
            { id: 'act3', label: 'Act III (11-15)' },
            { id: 'act4', label: 'Act IV (16-18)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveActFilter(tab.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
                activeActFilter === tab.id
                  ? 'bg-[#d4af37] text-black font-bold'
                  : 'text-[#8a8a9e] hover:text-[#e0e0e0]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of 19 Case Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCases.map((c) => {
          const unlocked = isCaseUnlocked(c.id);
          const completed = player.completedCases.includes(c.id);
          const progress = player.caseProgress[c.id] || {};
          const score = progress.score || 0;

          return (
            <div
              key={c.id}
              className={`bg-[#141419] border rounded-lg overflow-hidden flex flex-col justify-between transition-all duration-200 ${
                completed
                  ? 'border-emerald-500/50 shadow-lg shadow-emerald-950/20'
                  : unlocked
                  ? 'border-[#262633] hover:border-[#d4af37]/60 shadow-lg'
                  : 'border-[#262633]/60 opacity-75'
              }`}
            >
              {/* Card Header */}
              <div className="bg-[#0a0a0c] px-5 py-3 border-b border-[#262633] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#d4af37] bg-[#d4af37]/10 px-2 py-0.5 rounded border border-[#d4af37]/20">
                    CASE {c.id.toString().padStart(2, '0')}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-[#8a8a9e]">
                    {c.difficulty || 'medium'}
                  </span>
                </div>

                {completed ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Solved
                  </span>
                ) : unlocked ? (
                  <span className="text-xs font-semibold text-[#d4af37]">Active</span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-red-400">
                    <Lock className="w-3.5 h-3.5" /> Locked
                  </span>
                )}
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-3 flex-1">
                <h3 className="text-base font-bold text-[#e0e0e0] leading-snug line-clamp-1">{c.title}</h3>
                <p className="text-xs text-[#8a8a9e] leading-relaxed line-clamp-3">{c.description}</p>

                <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-[#8a8a9e]">
                  <span className="flex items-center gap-1 bg-[#0a0a0c] px-2.5 py-1 rounded border border-[#262633]">
                    <Clock className="w-3 h-3 text-[#d4af37]" /> {c.estimated_duration_minutes || 15}m
                  </span>
                  <span className="flex items-center gap-1 bg-[#0a0a0c] px-2.5 py-1 rounded border border-[#262633]">
                    <Award className="w-3 h-3 text-[#d4af37]" /> {c.mythology_theme || 'Saptarishi'}
                  </span>
                </div>
              </div>

              {/* Card Footer Buttons (50% / 50% flex width) */}
              <div className="p-4 bg-[#0a0a0c]/80 border-t border-[#262633] flex gap-2">
                <button
                  onClick={() => onOpenBriefing(c.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-[#141419] hover:bg-[#262633] text-[#e0e0e0] border border-[#262633] py-2 rounded text-xs font-bold uppercase transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-[#d4af37]" />
                  BRIEFING
                </button>

                {unlocked ? (
                  <button
                    onClick={() => onStartInvestigation(c.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-[#8b0000] hover:bg-[#b22222] text-white py-2 rounded text-xs font-bold uppercase transition-colors shadow-md"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    INVESTIGATE
                  </button>
                ) : (
                  <button
                    disabled
                    className="flex-1 flex items-center justify-center gap-1.5 bg-[#262633] text-[#8a8a9e] py-2 rounded text-xs font-bold uppercase cursor-not-allowed opacity-60"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    LOCKED
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
