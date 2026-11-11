import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePlayer } from '../context/PlayerContext';
import { Shield, UserPlus, LogIn, Medal, Database, LogOut, Award, CheckCircle2, Lock, Sparkles, ArrowRight, FileText, Check, ShieldAlert } from 'lucide-react';

export default function CredentialsView({ onNavigate, onOpenBriefing }) {
  const { player, loginUser, logoutUser } = usePlayer();
  const [mode, setMode] = useState('signup'); // 'signup' | 'login'

  const isLoggedIn = Boolean(player && player.email);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [division, setDivision] = useState('SQL Digital Forensics');

  useEffect(() => {
    if (isLoggedIn) {
      setName(player.name || '');
      setEmail(player.email || '');
    } else {
      setName('');
      setEmail('');
    }
  }, [player, isLoggedIn]);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    if (name.trim() && email.trim()) {
      await loginUser(name.trim(), email.trim());
      if (onNavigate) {
        onNavigate('cases');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
      {/* 1. Illustrative Header Banner */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          <div className="relative group p-1">
            <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-[#d4af37] via-red-700 to-[#d4af37] opacity-60 blur-md group-hover:opacity-90 transition duration-500" />
            <img
              src="/logo.jpg"
              alt="Project Vritra Emblem"
              className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-[#d4af37] object-cover shadow-2xl shadow-red-950/90"
            />
          </div>
        </motion.div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] px-3.5 py-1 rounded-full text-xs font-mono font-bold tracking-widest uppercase">
            <Shield className="w-3.5 h-3.5" />
            CLASSIFIED RECRUITMENT PORTAL • NATIONAL TASK FORCE
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#e0e0e0] font-serif glow-text">
            JOIN THE TASK FORCE
          </h1>
          <p className="text-xs sm:text-sm text-[#8a8a9e] max-w-lg mx-auto leading-relaxed">
            Enlist as a new Task Force Investigator or sign in to your clearance profile. Designate your credentials to track XP, rank promotions, and sync case files across devices.
          </p>
        </div>
      </div>

      {/* 2. Active Session Card (If Logged In vs Guest) */}
      <div className={`border rounded-lg p-5 shadow-xl transition-all ${
        isLoggedIn 
          ? 'bg-[#141419] border-[#d4af37]/50 shadow-red-950/30' 
          : 'bg-[#141419]/90 border-amber-500/40 bg-gradient-to-r from-amber-950/20 via-[#141419] to-[#141419]'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-full border ${isLoggedIn ? 'bg-[#d4af37]/10 border-[#d4af37]/40 text-[#d4af37]' : 'bg-amber-500/10 border-amber-500/40 text-amber-400'}`}>
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#e0e0e0] font-serif">
                  {isLoggedIn ? player.name : 'Guest Detective'}
                </h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                  isLoggedIn ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-400' : 'bg-amber-950/80 border border-amber-500/40 text-amber-400'
                }`}>
                  {isLoggedIn ? 'Authenticated Clearance' : 'Unregistered Guest'}
                </span>
              </div>
              <p className="text-xs text-[#8a8a9e] font-mono mt-0.5">
                {isLoggedIn ? `${player.email} • Rank: ${player.rank}` : 'Temporary session. Sign up or log in below to preserve case progress.'}
              </p>
            </div>
          </div>

          {isLoggedIn && (
            <button
              onClick={logoutUser}
              className="flex items-center justify-center gap-2 bg-red-950/60 hover:bg-red-900/80 border border-red-500/40 text-red-300 px-4 py-2 rounded text-xs font-bold font-mono transition-colors shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
              Switch / Logout Agent
            </button>
          )}
        </div>
      </div>

      {/* 3. Illustrative Enlistment / Sign In Card */}
      <div className="bg-[#141419] border border-[#262633] rounded-xl shadow-2xl overflow-hidden">
        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-2 border-b border-[#262633] bg-[#0a0a0c]">
          <button
            onClick={() => setMode('signup')}
            className={`py-3.5 px-4 text-xs font-mono font-bold uppercase flex items-center justify-center gap-2 transition-colors border-r border-[#262633] ${
              mode === 'signup'
                ? 'bg-[#141419] text-[#d4af37] border-b-2 border-b-[#d4af37]'
                : 'text-[#8a8a9e] hover:text-[#e0e0e0]'
            }`}
          >
            <UserPlus className="w-4 h-4 text-[#d4af37]" />
            Enlist New Agent (Sign Up)
          </button>
          <button
            onClick={() => setMode('login')}
            className={`py-3.5 px-4 text-xs font-mono font-bold uppercase flex items-center justify-center gap-2 transition-colors ${
              mode === 'login'
                ? 'bg-[#141419] text-[#d4af37] border-b-2 border-b-[#d4af37]'
                : 'text-[#8a8a9e] hover:text-[#e0e0e0]'
            }`}
          >
            <LogIn className="w-4 h-4 text-[#d4af37]" />
            Existing Agent (Sign In)
          </button>
        </div>

        <form onSubmit={handleAuthSubmit} className="p-6 sm:p-8 space-y-6">
          {mode === 'signup' ? (
            <div className="space-y-4">
              <div className="bg-[#0a0a0c] border border-[#d4af37]/30 p-3.5 rounded-lg flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2 text-[#d4af37]">
                  <Medal className="w-4 h-4 text-[#d4af37] shrink-0" />
                  <span className="font-bold">DESIGNATED STARTING RANK:</span>
                </div>
                <span className="bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#d4af37] px-2.5 py-1 rounded font-bold uppercase">
                  Investigation Intern
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#d4af37] flex items-center gap-1 font-mono">
                  <span>Investigator Full Name</span>
                  <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Detective Vikram Sharma"
                  className="w-full bg-[#0a0a0c] border border-[#262633] focus:border-[#d4af37] text-sm text-[#e0e0e0] rounded-md px-3.5 py-2.5 outline-none transition-colors"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#d4af37] flex items-center gap-1 font-mono">
                  <span>Task Force Official Email / Clearance Code</span>
                  <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. vikram.sharma@vritra-tf.gov.in"
                  className="w-full bg-[#0a0a0c] border border-[#262633] focus:border-[#d4af37] text-sm text-[#e0e0e0] rounded-md px-3.5 py-2.5 outline-none transition-colors"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#8a8a9e] font-mono">Primary Task Force Division:</label>
                <select
                  value={division}
                  onChange={(e) => setDivision(e.target.value)}
                  className="w-full bg-[#0a0a0c] border border-[#262633] focus:border-[#d4af37] text-xs font-mono text-[#e0e0e0] rounded-md px-3.5 py-2.5 outline-none"
                >
                  <option value="SQL Digital Forensics">SQL Digital Forensics & Database Audit</option>
                  <option value="Toxicology & Chemical Analysis">Toxicology & Chemical Analysis (Somalatha Studies)</option>
                  <option value="Cyber Intelligence & Network Auditing">Cyber Intelligence & Maya Protocol Auditing</option>
                  <option value="Field Interrogation & Suspect Intelligence">Field Interrogation & Suspect Intelligence</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-[#0a0a0c] border border-cyan-500/30 p-3.5 rounded-lg flex items-center gap-2 text-xs font-mono text-cyan-400">
                <Database className="w-4 h-4 shrink-0 text-cyan-400" />
                <span>Enter your registered email to restore previous clearance rank, XP, and solved case progress.</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#d4af37] flex items-center gap-1 font-mono">
                  <span>Registered Investigator Name</span>
                  <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Detective Vikram Sharma"
                  className="w-full bg-[#0a0a0c] border border-[#262633] focus:border-[#d4af37] text-sm text-[#e0e0e0] rounded-md px-3.5 py-2.5 outline-none transition-colors"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#d4af37] flex items-center gap-1 font-mono">
                  <span>Registered Task Force Email</span>
                  <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. vikram.sharma@vritra-tf.gov.in"
                  className="w-full bg-[#0a0a0c] border border-[#262633] focus:border-[#d4af37] text-sm text-[#e0e0e0] rounded-md px-3.5 py-2.5 outline-none transition-colors"
                  required
                />
              </div>
            </div>
          )}

          {/* Database Sync Status Badge */}
          <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-lg p-3 text-xs text-emerald-400 flex items-center gap-2.5 font-mono">
            <Database className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>Connected to Supabase PostgreSQL & Local Clearance Vault. Automatic progress sync active.</span>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-[11px] text-[#8a8a9e] font-mono">
              {mode === 'signup' ? 'Enlisting grants immediate access to Case 0 Dossier.' : 'Sign in restores previous case files.'}
            </span>
            <button
              type="submit"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#8b0000] hover:bg-[#b22222] text-white px-7 py-3 rounded-md text-xs font-bold uppercase tracking-wider transition-all shadow-xl shadow-red-950/60 hover:scale-105"
            >
              {mode === 'signup' ? (
                <>
                  <UserPlus className="w-4 h-4" />
                  ENLIST & START CASE 0
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  SIGN IN & RESTORE CLEARANCE
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* 4. Illustrative Feature Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-[#141419] border border-[#262633] p-5 rounded-lg space-y-2 hover:border-[#d4af37]/40 transition-colors shadow-lg">
          <div className="flex items-center gap-2 text-[#d4af37]">
            <FileText className="w-5 h-5" />
            <h4 className="font-bold text-xs font-serif uppercase tracking-wider">18 Case Clearance</h4>
          </div>
          <p className="text-xs text-[#8a8a9e] leading-relaxed">
            Execute SQL queries against real database tables to uncover toxicological markers, altered CCTV logs, and financial ciphers.
          </p>
        </div>

        <div className="bg-[#141419] border border-[#262633] p-5 rounded-lg space-y-2 hover:border-[#d4af37]/40 transition-colors shadow-lg">
          <div className="flex items-center gap-2 text-[#d4af37]">
            <Award className="w-5 h-5" />
            <h4 className="font-bold text-xs font-serif uppercase tracking-wider">Rank Progression</h4>
          </div>
          <p className="text-xs text-[#8a8a9e] leading-relaxed">
            Advance from *Investigation Intern* up through *Lead Investigator* to *Task Force Chief* as you solve cases and earn forensic XP.
          </p>
        </div>

        <div className="bg-[#141419] border border-[#262633] p-5 rounded-lg space-y-2 hover:border-[#d4af37]/40 transition-colors shadow-lg">
          <div className="flex items-center gap-2 text-[#d4af37]">
            <Database className="w-5 h-5" />
            <h4 className="font-bold text-xs font-serif uppercase tracking-wider">Automatic Cloud Sync</h4>
          </div>
          <p className="text-xs text-[#8a8a9e] leading-relaxed">
            Your progress is securely saved across browser sessions and synced to PostgreSQL so you pick up right where you left off.
          </p>
        </div>
      </div>
    </div>
  );
}
