import React, { useState, useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { X, IdCard, Save, Database } from 'lucide-react';

export default function AuthModal({ isOpen, onClose }) {
  const { player, loginUser } = usePlayer();
  const [name, setName] = useState(player.name || 'Prasoon Pathak');
  const [email, setEmail] = useState(player.email || 'prasoon.pathak@vritra-tf.gov.in');

  useEffect(() => {
    setName(player.name || 'Prasoon Pathak');
    setEmail(player.email || 'prasoon.pathak@vritra-tf.gov.in');
  }, [player]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && email.trim()) {
      loginUser(name.trim(), email.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#141419] border border-[#262633] rounded-lg max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#262633] bg-[#0a0a0c]">
          <h3 className="text-base font-bold text-[#e0e0e0] flex items-center gap-2.5">
            <img src="/logo.jpg" alt="Logo" className="w-6 h-6 rounded-full border border-[#d4af37]/50 object-cover" />
            Investigator Identity & Login
          </h3>
          <button
            onClick={onClose}
            className="text-[#8a8a9e] hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-xs text-[#8a8a9e] leading-relaxed">
            Enter your official Task Force Investigator Credentials to track XP, rank promotions, and sync solved case files to Supabase cloud storage.
          </p>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#d4af37]">Investigator Full Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#0a0a0c] border border-[#262633] focus:border-[#d4af37] text-sm text-[#e0e0e0] rounded px-3 py-2 outline-none transition-colors"
              placeholder="e.g. Prasoon Pathak"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#d4af37]">Task Force Email / Clearance Code:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0a0a0c] border border-[#262633] focus:border-[#d4af37] text-sm text-[#e0e0e0] rounded px-3 py-2 outline-none transition-colors"
              placeholder="e.g. prasoon.pathak@vritra-tf.gov.in"
              required
            />
          </div>

          <div className="bg-emerald-950/30 border border-emerald-500/30 rounded p-3 text-xs text-emerald-400 flex items-center gap-2.5">
            <Database className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>Connected to Supabase PostgreSQL for automatic progress sync across devices.</span>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#8a8a9e] hover:text-[#e0e0e0] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 bg-[#8b0000] hover:bg-[#b22222] text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-red-950/50"
            >
              <Save className="w-4 h-4" />
              Save Credentials
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
