import React from 'react';
import { usePlayer } from '../context/PlayerContext';
import { X, Lock, Play, Clock, Award, FolderOpen } from 'lucide-react';

export default function BriefingModal({ caseData, isOpen, onClose, onStartInvestigation }) {
  const { isCaseUnlocked } = usePlayer();

  if (!isOpen || !caseData) return null;

  const unlocked = isCaseUnlocked(caseData.id);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#141419] border border-[#262633] rounded-lg max-w-2xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Title Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#262633] bg-[#0a0a0c]">
          <div className="flex items-center gap-2.5">
            <img src="/logo.jpg" alt="Logo" className="w-6 h-6 rounded-full border border-[#d4af37]/50 object-cover" />
            <span className="bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/30 px-2 py-0.5 rounded text-xs font-bold font-mono">
              CASE {caseData.id.toString().padStart(2, '0')}
            </span>
            <h3 className="text-base font-bold text-[#e0e0e0] truncate max-w-md">{caseData.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#8a8a9e] hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Metadata badges */}
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="bg-[#0a0a0c] border border-[#262633] px-3 py-1 rounded text-[#8a8a9e] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
              Est. Duration: {caseData.estimated_duration_minutes || 15} mins
            </span>
            <span className="bg-[#0a0a0c] border border-[#262633] px-3 py-1 rounded text-[#8a8a9e] flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-[#d4af37]" />
              Difficulty: <span className="capitalize font-semibold text-[#d4af37]">{caseData.difficulty || 'medium'}</span>
            </span>
            <span className="bg-[#0a0a0c] border border-[#262633] px-3 py-1 rounded text-[#8a8a9e] flex items-center gap-1.5">
              <FolderOpen className="w-3.5 h-3.5 text-[#d4af37]" />
              Theme: {caseData.mythology_theme || 'Saptarishi'}
            </span>
          </div>

          {/* Story Background */}
          <div className="bg-[#0a0a0c] border border-[#262633] p-4 rounded-md space-y-2">
            <h4 className="text-xs font-bold text-[#d4af37] uppercase tracking-wider">Mission Briefing & Background:</h4>
            <p className="text-sm text-[#e0e0e0] leading-relaxed">
              {caseData.story_background || caseData.description}
            </p>
          </div>

          {!unlocked && (
            <div className="bg-red-950/30 border border-red-500/30 rounded p-4 text-xs text-red-400 flex items-center gap-3">
              <Lock className="w-5 h-5 shrink-0 text-red-400" />
              <div>
                <strong className="font-bold block text-sm">🔒 CLASSIFIED CASE FILE</strong>
                You must complete Case {caseData.id - 1} first to unlock clearance for Case {caseData.id}.
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#8a8a9e] hover:text-[#e0e0e0] transition-colors"
            >
              Close Dossier
            </button>
            {unlocked ? (
              <button
                onClick={() => {
                  onClose();
                  onStartInvestigation(caseData.id);
                }}
                className="flex items-center gap-2 bg-[#8b0000] hover:bg-[#b22222] text-white px-5 py-2.5 rounded text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-red-950/50"
              >
                <Play className="w-4 h-4 fill-white" />
                ENTER INVESTIGATION TERMINAL
              </button>
            ) : (
              <button
                disabled
                className="flex items-center gap-2 bg-[#262633] text-[#8a8a9e] px-5 py-2.5 rounded text-xs font-bold uppercase tracking-wider cursor-not-allowed opacity-60"
              >
                <Lock className="w-4 h-4" />
                LOCKED: SOLVE CASE {caseData.id - 1} FIRST
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
