import React, { useState, useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { IdCard, Save, LogOut, Database } from 'lucide-react';

export default function CredentialsView() {
  const { player, loginUser, logoutUser } = usePlayer();
  const [name, setName] = useState(player.name === 'Guest Detective' ? '' : (player.name || ''));
  const [email, setEmail] = useState(player.email || '');

  useEffect(() => {
    setName(player.name === 'Guest Detective' ? '' : (player.name || ''));
    setEmail(player.email || '');
  }, [player]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && email.trim()) {
      loginUser(name.trim(), email.trim());
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-8">
      <div className="border-b border-[#262633] pb-6 text-center">
        <span className="text-xs font-mono font-bold text-[#d4af37] bg-[#d4af37]/10 border border-[#d4af37]/30 px-3 py-1 rounded">
          IDENTITY SETTINGS
        </span>
        <h1 className="text-3xl font-extrabold text-[#e0e0e0] mt-2">Investigator Credentials</h1>
        <p className="text-xs text-[#8a8a9e]">Manage identity credentials and cloud database sync</p>
      </div>

      <div className="bg-[#141419] border border-[#262633] rounded-lg p-6 space-y-6 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#d4af37]">Investigator Full Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#0a0a0c] border border-[#262633] focus:border-[#d4af37] text-xs text-[#e0e0e0] rounded px-3 py-2 outline-none"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#d4af37]">Task Force Email / Clearance Code:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0a0a0c] border border-[#262633] focus:border-[#d4af37] text-xs text-[#e0e0e0] rounded px-3 py-2 outline-none"
              required
            />
          </div>

          <div className="bg-emerald-950/30 border border-emerald-500/30 rounded p-3 text-xs text-emerald-400 flex items-center gap-2.5">
            <Database className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>Connected to Supabase PostgreSQL for automatic progress sync across devices.</span>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={logoutUser}
              className="flex items-center gap-1.5 text-red-400 hover:text-red-300 text-xs font-semibold"
            >
              <LogOut className="w-4 h-4" /> Logout / Switch Agent
            </button>

            <button
              type="submit"
              className="flex items-center gap-1.5 bg-[#8b0000] hover:bg-[#b22222] text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-red-950/50"
            >
              <Save className="w-4 h-4" /> Save & Sync Credentials
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
