import React from 'react';
import { usePlayer } from '../context/PlayerContext';
import { Users, Shield, Award } from 'lucide-react';

export default function TaskForceView() {
  const { db } = usePlayer();
  const characters = db?.characters || [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div className="border-b border-[#262633] pb-6">
        <span className="text-xs font-mono font-bold text-[#d4af37] bg-[#d4af37]/10 border border-[#d4af37]/30 px-3 py-1 rounded">
          PERSONNEL DIRECTORY
        </span>
        <h1 className="text-3xl font-extrabold text-[#e0e0e0] mt-2">Investigation Task Force</h1>
        <p className="text-xs text-[#8a8a9e]">The multidisciplinary division assigned to dismantle Project Vritra</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {characters.map((char, idx) => (
          <div key={idx} className="bg-[#141419] border border-[#262633] hover:border-[#d4af37]/50 rounded-lg p-5 space-y-3 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37]">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#e0e0e0]">{char.name}</h3>
                <p className="text-xs text-[#d4af37] font-semibold">{char.role}</p>
              </div>
            </div>

            <div className="space-y-1 text-xs text-[#8a8a9e] border-t border-[#262633] pt-3">
              <p><strong>Department:</strong> {char.department}</p>
              <p><strong>Expertise:</strong> {char.expertise}</p>
              <p><strong>Personality:</strong> {char.personality}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
