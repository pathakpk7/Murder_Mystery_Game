import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { usePlayer } from '../context/PlayerContext';
import { Shield, GraduationCap, Key, Scroll, Skull, Network, Crown, Database, Filter, Link, History, UserCheck, Play, ArrowRight, CheckCircle2, Terminal, Award, Users, Eye, Search, Microscope, Trophy } from 'lucide-react';

export default function HomeView({ onNavigate, onOpenBriefing, onOpenAuth }) {
  const { player, loginUser } = usePlayer();
  const [authName, setAuthName] = useState(player.name || 'Prasoon Pathak');
  const [authEmail, setAuthEmail] = useState(player.email || 'prasoon.pathak@vritra-tf.gov.in');

  const handleInlineSubmit = (e) => {
    e.preventDefault();
    if (authName.trim() && authEmail.trim()) {
      loginUser(authName.trim(), authEmail.trim());
      onNavigate('cases');
    }
  };

  const completedCount = player.completedCases.length;

  return (
    <div className="space-y-24 pb-20 pt-6">
      {/* 1. Cinematic Opening Intro */}
      <section className="text-center max-w-4xl mx-auto px-4 space-y-8 min-h-[70vh] flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="flex justify-center"
        >
          <div className="relative group p-1">
            <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-red-700 via-[#d4af37] to-red-900 opacity-70 blur-md group-hover:opacity-100 transition duration-500" />
            <img
              src="/logo.jpg"
              alt="Murder Mystery - Project Vritra Emblem"
              className="relative w-40 h-40 sm:w-52 sm:h-52 rounded-full border-2 border-[#d4af37] object-cover shadow-2xl shadow-red-950/90 group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <span className="inline-flex items-center gap-2 bg-red-950/60 border border-red-500/40 text-red-400 px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-widest animate-pulse">
            <Shield className="w-4 h-4" />
            PROJECT VRITRA • CLASSIFIED INVESTIGATION NETWORK
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-4"
        >
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-[#e0e0e0] font-serif glow-text leading-tight">
            PROJECT VRITRA
          </h1>
          <p className="text-lg sm:text-xl font-mono text-[#d4af37] tracking-widest uppercase font-semibold">
            THE TRUTH IS NEVER IN ONE PLACE.
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-base text-[#8a8a9e] max-w-2xl mx-auto leading-relaxed"
        >
          18 Interconnected Cases. 1 Nationwide Conspiracy. Step into the shoes of an elite Task Force investigator in India. Use real SQL queries as your primary forensic weapon to interrogate suspects, examine poison reports, and expose <em>The Sutradhar</em>.
        </motion.p>

        {/* Hero Operational Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-2"
        >
          <div className="bg-[#141419] border border-[#262633] p-4 rounded-lg text-center shadow-xl">
            <p className="text-3xl font-black text-[#d4af37]">19</p>
            <p className="text-[11px] text-[#8a8a9e] font-mono">Case Files</p>
          </div>
          <div className="bg-[#141419] border border-[#262633] p-4 rounded-lg text-center shadow-xl">
            <p className="text-3xl font-black text-[#d4af37]">4</p>
            <p className="text-[11px] text-[#8a8a9e] font-mono">Dramatic Acts</p>
          </div>
          <div className="bg-[#141419] border border-[#262633] p-4 rounded-lg text-center shadow-xl">
            <p className="text-3xl font-black text-[#d4af37]">{completedCount} / 18</p>
            <p className="text-[11px] text-[#8a8a9e] font-mono">Cases Solved</p>
          </div>
          <div className="bg-[#141419] border border-[#262633] p-4 rounded-lg text-center shadow-xl">
            <p className="text-3xl font-black text-red-500">1</p>
            <p className="text-[11px] text-[#8a8a9e] font-mono">Mastermind</p>
          </div>
        </motion.div>

        {/* Hero CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-4 pt-4"
        >
          <button
            onClick={() => onOpenBriefing(0)}
            className="flex items-center gap-2 bg-[#8b0000] hover:bg-[#b22222] text-white px-7 py-3.5 rounded-md font-bold text-xs uppercase tracking-wider shadow-xl shadow-red-950/60 transition-all hover:scale-105"
          >
            <GraduationCap className="w-4 h-4" />
            BEGIN INVESTIGATION (CASE 0)
          </button>
          <button
            onClick={() => onNavigate('cases')}
            className="flex items-center gap-2 bg-[#141419] hover:bg-[#262633] text-[#e0e0e0] border border-[#262633] hover:border-[#d4af37] px-7 py-3.5 rounded-md font-bold text-xs uppercase tracking-wider transition-all"
          >
            <Scroll className="w-4 h-4 text-[#d4af37]" />
            ENTER CASE DOSSIER
          </button>
        </motion.div>
      </section>

      {/* 2. Narrative Spatial Evidence Wall */}
      <section className="bg-[#141419]/60 border-y border-[#262633] py-20 px-4">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold text-red-400 bg-red-950/40 border border-red-500/30 px-3.5 py-1 rounded">
              CLASSIFIED EVIDENCE WALL
            </span>
            <h2 className="text-3xl font-extrabold text-[#e0e0e0] font-serif">The Nagabhavan Homicide & The Sutradhar</h2>
            <p className="text-xs text-[#8a8a9e] max-w-xl mx-auto">
              Every case connects back to an ancient Sanskrit cipher and an offshore bank ledger engineered by Dr. Vedant Kashyap.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#0a0a0c] border-l-4 border-l-red-600 border border-[#262633] p-5 rounded-r-lg space-y-2 shadow-xl">
              <span className="text-[10px] font-mono font-bold text-red-500">EVIDENCE ITEM #01</span>
              <h3 className="text-sm font-bold text-[#e0e0e0]">Nagabhavan Study Homicide</h3>
              <p className="text-xs text-[#8a8a9e] leading-relaxed">
                Industrialist Vikramaditya Nagabhavan found poisoned inside a sealed locked room. Traces of synthetic Somalatha toxins identified on glassware.
              </p>
            </div>

            <div className="bg-[#0a0a0c] border-l-4 border-l-[#d4af37] border border-[#262633] p-5 rounded-r-lg space-y-2 shadow-xl">
              <span className="text-[10px] font-mono font-bold text-[#d4af37]">EVIDENCE ITEM #02</span>
              <h3 className="text-sm font-bold text-[#e0e0e0]">Saptarishi Shell Network</h3>
              <p className="text-xs text-[#8a8a9e] leading-relaxed">
                12 offshore Swiss accounts transferring wire payments exceeding 1,000,000 INR directly to Saptarishi research laboratories.
              </p>
            </div>

            <div className="bg-[#0a0a0c] border-l-4 border-l-amber-500 border border-[#262633] p-5 rounded-r-lg space-y-2 shadow-xl">
              <span className="text-[10px] font-mono font-bold text-amber-500">EVIDENCE ITEM #03</span>
              <h3 className="text-sm font-bold text-[#e0e0e0]">Maya Protocol AI Engine</h3>
              <p className="text-xs text-[#8a8a9e] leading-relaxed">
                An artificial intelligence system generating manufactured fingerprint evidence rows and erasing whistleblower identities from government servers.
              </p>
            </div>

            <div className="bg-[#0a0a0c] border-l-4 border-l-emerald-500 border border-[#262633] p-5 rounded-r-lg space-y-2 shadow-xl">
              <span className="text-[10px] font-mono font-bold text-emerald-400">EVIDENCE ITEM #04</span>
              <h3 className="text-sm font-bold text-[#e0e0e0]">Dr. Vedant Kashyap</h3>
              <p className="text-xs text-[#8a8a9e] leading-relaxed">
                The ghost mastermind (*The Sutradhar*) manipulating evidence behind 18 interconnected homicides across India.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. How Investigation Works (7-Stage Journey) */}
      <section className="max-w-6xl mx-auto px-4 space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono font-bold text-[#d4af37] bg-[#d4af37]/10 border border-[#d4af37]/30 px-3 py-1 rounded">
            INVESTIGATION WORKFLOW
          </span>
          <h2 className="text-3xl font-extrabold text-[#e0e0e0] font-serif">How Investigation Works</h2>
          <p className="text-xs text-[#8a8a9e]">Master database forensic queries to advance through Project Vritra</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { num: "01", title: "RECEIVE CASE", desc: "Open classified dossier files and mission briefings." },
            { num: "02", title: "READ STORY", desc: "Examine suspect motives, witness statements, and crime scene backstory." },
            { num: "03", title: "QUERY DATABASE", desc: "Execute SELECT, WHERE, JOIN, and ORDER BY queries in CodeMirror SQL terminal." },
            { num: "04", title: "DISCOVER EVIDENCE", desc: "Uncover hidden toxins, fingerprint reports, and altered CCTV timestamps." },
            { num: "05", title: "CONNECT CLUES", desc: "Inspect spatial node connections on the Interactive Detective Board." },
            { num: "06", title: "SOLVE CASE", desc: "Indict the primary culprit and earn +500 XP and 3 Stars." },
            { num: "07", title: "ADVANCE VRITRA", desc: "Unlock promotion ranks and advance toward Dr. Kashyap in Case 18." },
          ].map((stage, idx) => (
            <div key={idx} className="bg-[#141419] border border-[#262633] p-5 rounded-lg space-y-2 hover:border-[#d4af37]/50 transition-colors">
              <span className="text-2xl font-black text-[#d4af37] font-mono">{stage.num}</span>
              <h4 className="font-mono text-xs font-bold text-[#e0e0e0]">{stage.title}</h4>
              <p className="text-xs text-[#8a8a9e] leading-relaxed">{stage.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. SQL As Primary Forensic Weapon Showcase */}
      <section className="bg-[#070709] border-y border-[#262633] py-20 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs font-mono font-bold text-[#d4af37] bg-[#d4af37]/10 border border-[#d4af37]/30 px-3 py-1 rounded">
              PRIMARY INVESTIGATIVE INSTRUMENT
            </span>
            <h2 className="text-3xl font-extrabold text-[#e0e0e0] font-serif">SQL Is Your Forensic Instrument</h2>
            <p className="text-xs sm:text-sm text-[#8a8a9e] leading-relaxed">
              No point-and-click guessing. Every clue, witness alibi contradiction, and financial transfer must be uncovered through canonical PostgreSQL queries.
            </p>
            <div className="space-y-2 font-mono text-xs text-[#e0e0e0]">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" /> <span>Query accepted → Evidence rows extracted</span>
              </div>
              <div className="flex items-center gap-2 text-[#d4af37]">
                <CheckCircle2 className="w-4 h-4" /> <span>Cross-reference fingerprints with suspects</span>
              </div>
            </div>
          </div>

          <div className="bg-[#141419] border border-[#262633] rounded-lg p-5 space-y-3 shadow-2xl font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#262633] pb-2 text-[#8a8a9e]">
              <span>TERMINAL SIMULATION</span>
              <span className="text-emerald-400">⚡ 12ms</span>
            </div>
            <div className="bg-[#0a0a0c] p-3 rounded border border-[#262633] text-emerald-400">
              <code>SELECT s.name, s.motive, f.analysis_result FROM suspects s JOIN forensics f ON s.case_id = f.case_id WHERE s.case_id = 1;</code>
            </div>
            <div className="bg-[#0a0a0c] p-3 rounded border border-[#262633] space-y-1 text-[#8a8a9e]">
              <p className="text-[#d4af37] font-bold">QUERY EXECUTED • 1 MATCHING ROW</p>
              <p>Raghav Sethi | Financial Dispute | Fingerprint Match 99.4%</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Final Dramatic CTA */}
      <section className="text-center max-w-3xl mx-auto px-4 space-y-6 pt-10">
        <span className="text-xs font-mono font-bold text-red-400 bg-red-950/40 border border-red-500/30 px-3.5 py-1 rounded">
          THE FILE IS OPEN
        </span>
        <h2 className="text-4xl font-extrabold text-[#e0e0e0] font-serif">The Question Is Whether You Can Solve It</h2>
        <p className="text-xs text-[#8a8a9e]">Enlist in the Vritra Task Force and start Case 0 training today.</p>

        <div className="flex justify-center gap-4 pt-2">
          <button
            onClick={() => onOpenBriefing(0)}
            className="flex items-center gap-2 bg-[#8b0000] hover:bg-[#b22222] text-white px-8 py-3.5 rounded text-xs font-bold uppercase tracking-wider shadow-xl shadow-red-950/60 transition-transform hover:scale-105"
          >
            <Play className="w-4 h-4 fill-white" />
            JOIN THE TASK FORCE
          </button>
          <button
            onClick={() => onNavigate('cases')}
            className="flex items-center gap-2 bg-[#141419] hover:bg-[#262633] text-[#e0e0e0] border border-[#262633] px-8 py-3.5 rounded text-xs font-bold uppercase tracking-wider"
          >
            VIEW CASES DOSSIER
          </button>
        </div>
      </section>
    </div>
  );
}
