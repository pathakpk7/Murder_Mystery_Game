import React, { useState, useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext';
import UserDropdown from './UserDropdown';
import { Terminal, Medal, Zap, Menu, X, ShieldAlert, Radio } from 'lucide-react';

export default function Navbar({ currentView, onNavigate, onOpenAuth }) {
  const { player } = usePlayer();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'HOME' },
    { id: 'cases', label: 'CASES DOSSIER' },
    { id: 'investigation', label: 'INVESTIGATION' },
    { id: 'story', label: 'LORE & INTEL' },
    { id: 'leaderboard', label: 'LEADERBOARD' },
    { id: 'credentials', label: 'CREDENTIALS' },
    { id: 'guide', label: 'GUIDE' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-[#070709]/95 backdrop-blur-md border-b border-[#262633] py-2 shadow-2xl' 
        : 'bg-[#0a0a0c]/80 backdrop-blur-sm border-b border-[#262633]/60 py-3'
    }`}>
      <div className="max-w-[1440px] mx-auto px-4 flex items-center justify-between gap-4">
        {/* Brand Logo & Telemetry Ping */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 text-base font-extrabold text-[#e0e0e0] whitespace-nowrap group font-serif tracking-tight"
        >
          <div className="relative flex items-center justify-center">
            <img 
              src="/logo.jpg" 
              alt="Murder Mystery Logo" 
              className="w-8 h-8 rounded-full border border-[#d4af37]/60 object-cover group-hover:scale-110 transition-transform shadow-md shadow-red-950/60" 
            />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping border border-[#070709]" />
          </div>
          <span className="glow-text">PROJECT VRITRA</span>
        </button>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`px-2.5 py-1 text-[11px] font-mono font-bold uppercase tracking-wider rounded transition-all whitespace-nowrap ${
                currentView === item.id
                  ? 'text-[#d4af37] bg-[#d4af37]/10 border border-[#d4af37]/30'
                  : 'text-[#8a8a9e] hover:text-[#d4af37] hover:bg-[#d4af37]/5'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Header User Stats & Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <UserDropdown onNavigate={onNavigate} onOpenAuth={onOpenAuth} />

          <div className="hidden sm:flex items-center gap-2 bg-[#141419] border border-[#262633] px-2.5 py-1 rounded text-xs font-semibold text-[#8a8a9e]">
            <Medal className="w-4 h-4 text-[#d4af37] shrink-0" />
            <div className="flex flex-col text-[10px] font-mono leading-tight font-bold text-[#e0e0e0] uppercase">
              {player.rank.split(' ').map((word, i) => (
                <span key={i} className={i === 0 ? "text-[#d4af37]" : "text-[#e0e0e0]"}>{word}</span>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-1 bg-[#141419] border border-[#262633] px-2.5 py-1 rounded text-xs font-semibold text-[#d4af37] whitespace-nowrap font-mono">
            <Zap className="w-3.5 h-3.5 fill-[#d4af37]" />
            <span>{player.xp.toLocaleString()} XP</span>
          </div>

          <button
            onClick={() => onNavigate('investigation')}
            className="flex items-center gap-1.5 bg-[#8b0000] hover:bg-[#b22222] text-white px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap shadow-lg shadow-red-950/50"
            title="Resume Active Investigation"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>WORKBENCH</span>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-[#e0e0e0] p-1 rounded hover:bg-[#141419]"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#141419] border-b border-[#262633] px-4 py-3 flex flex-col gap-1.5 mt-2 animate-in slide-in-from-top-5">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate(item.id);
              }}
              className={`px-3 py-2 text-xs font-mono font-bold uppercase text-left rounded transition-colors ${
                currentView === item.id
                  ? 'text-[#d4af37] bg-[#d4af37]/10 border border-[#d4af37]/30'
                  : 'text-[#8a8a9e] hover:text-[#d4af37]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
