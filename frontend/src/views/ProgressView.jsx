import React from 'react';
import { usePlayer } from '../context/PlayerContext';
import { BarChart3, Medal, Zap, CheckCircle2, Hourglass, Star, Trophy } from 'lucide-react';

export default function ProgressView() {
  const { db, player } = usePlayer();

  const completedCount = player.completedCases.length;
  const pct = Math.round((completedCount / 18) * 100);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="border-b border-[#262633] pb-6">
        <span className="text-xs font-mono font-bold text-[#d4af37] bg-[#d4af37]/10 border border-[#d4af37]/30 px-3 py-1 rounded">
          DETECTIVE DOSSIER
        </span>
        <h1 className="text-3xl font-extrabold text-[#e0e0e0] mt-2">Investigator Clearance & Progress</h1>
        <p className="text-xs text-[#8a8a9e]">Track total XP, rank promotion ladder, solved cases, and mission stars</p>
      </div>

      {/* User Stats Card */}
      <div className="bg-[#141419] border border-[#d4af37]/40 rounded-lg p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-[#d4af37]">{player.name}</h2>
          <p className="text-xs text-[#8a8a9e] font-mono">{player.email || 'prasoon.pathak@vritra-tf.gov.in'}</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-[#0a0a0c] border border-[#262633] px-4 py-2 rounded text-center">
            <span className="text-xs text-[#8a8a9e] block">Rank</span>
            <span className="text-sm font-bold text-[#e0e0e0]">{player.rank}</span>
          </div>

          <div className="bg-[#0a0a0c] border border-[#262633] px-4 py-2 rounded text-center">
            <span className="text-xs text-[#8a8a9e] block">Total XP</span>
            <span className="text-sm font-bold text-[#d4af37]">{player.xp.toLocaleString()} XP</span>
          </div>
        </div>
      </div>

      {/* Overall Campaign Progress Bar */}
      <div className="bg-[#141419] border border-[#262633] p-6 rounded-lg space-y-3">
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-[#8a8a9e]">Overall Mission Campaign Clearance:</span>
          <span className="text-[#d4af37] font-bold">{pct}% Complete</span>
        </div>
        <div className="h-3 bg-[#0a0a0c] rounded-full overflow-hidden border border-[#262633]">
          <div
            className="h-full bg-gradient-to-r from-red-800 to-[#d4af37] transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Solved Cases Checklist */}
      <div className="bg-[#141419] border border-[#262633] p-6 rounded-lg space-y-4">
        <h3 className="text-sm font-bold text-[#d4af37] uppercase tracking-wider flex items-center gap-2">
          <Trophy className="w-4 h-4 text-[#d4af37]" /> Solved Cases Campaign Checklist
        </h3>

        <div className="space-y-2">
          {db?.game_cases?.map((c) => {
            const isCompleted = player.completedCases.includes(c.id);
            const progress = player.caseProgress[c.id] || {};
            const stars = progress.stars || (isCompleted ? 3 : 0);
            const score = progress.score || 0;

            return (
              <div
                key={c.id}
                className="flex items-center justify-between bg-[#0a0a0c] border border-[#262633] p-3 rounded text-xs"
              >
                <div>
                  <span className="font-mono font-bold text-[#d4af37] mr-2">
                    CASE {c.id.toString().padStart(2, '0')}:
                  </span>
                  <span className="text-[#e0e0e0] font-semibold">{c.title}</span>
                </div>

                <div>
                  {isCompleted ? (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Solved ({'⭐'.repeat(stars)} • {score} pts)
                    </span>
                  ) : (
                    <span className="text-[#8a8a9e] flex items-center gap-1">
                      <Hourglass className="w-3.5 h-3.5" /> Pending Clearance
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
