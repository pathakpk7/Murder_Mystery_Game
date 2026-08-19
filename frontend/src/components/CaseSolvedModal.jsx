import React from 'react';
import { Trophy, Star, Unlock, X, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CaseSolvedModal({ isOpen, onClose, caseId, culprit, onNextCase }) {
  React.useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#141419] border border-[#d4af37]/50 rounded-lg max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-[#0a0a0c] px-6 py-4 border-b border-[#262633] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#d4af37]" />
            <h3 className="text-base font-bold text-[#d4af37]">CASE {caseId} SOLVED & CLOSED</h3>
          </div>
          <button onClick={onClose} className="text-[#8a8a9e] hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] mb-2">
            <Trophy className="w-8 h-8" />
          </div>

          <h2 className="text-xl font-extrabold text-[#e0e0e0]">Indictment Confirmed!</h2>
          <p className="text-xs text-[#8a8a9e] leading-relaxed">
            Perpetrator <strong>{culprit}</strong> has been successfully convicted. Forensic lab records and timeline statements corroborate all charges.
          </p>

          <div className="grid grid-cols-3 gap-2 bg-[#0a0a0c] border border-[#262633] p-3 rounded-md text-xs font-semibold">
            <div className="flex flex-col items-center gap-1 text-[#d4af37]">
              <Trophy className="w-4 h-4" />
              <span>+500 XP</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-[#d4af37]">
              <Star className="w-4 h-4 fill-[#d4af37]" />
              <span>3 Stars</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-emerald-400">
              <Unlock className="w-4 h-4" />
              <span>Case {caseId + 1} Unlocked</span>
            </div>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#8a8a9e] hover:text-[#e0e0e0]"
            >
              Return to Dossier
            </button>
            <button
              onClick={() => {
                onClose();
                if (onNextCase) onNextCase(caseId + 1);
              }}
              className="flex items-center gap-2 bg-[#8b0000] hover:bg-[#b22222] text-white px-5 py-2.5 rounded text-xs font-bold uppercase tracking-wider"
            >
              <span>PROCEED TO CASE {caseId + 1}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
