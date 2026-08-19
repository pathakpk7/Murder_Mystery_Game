import React, { useState, useEffect, useRef } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { User, Shield, LogOut, Key, BarChart3, IdCard, ChevronDown } from 'lucide-react';

export default function UserDropdown({ onNavigate, onOpenAuth }) {
  const { player, logoutUser } = usePlayer();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isLoggedIn = player && player.email && player.name !== 'Guest Detective' && player.rank !== 'Unassigned';

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-[#141419] border border-[#262633] hover:border-[#d4af37] px-3 py-1.5 rounded-md text-xs font-semibold text-[#d4af37] transition-all"
        title="Investigator Identity & Menu"
      >
        <Shield className="w-3.5 h-3.5 text-[#d4af37]" />
        <span>{isLoggedIn ? player.name : 'Guest Detective'}</span>
        <ChevronDown className="w-3 h-3 text-[#d4af37]" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-60 bg-[#141419] border border-[#262633] rounded-md shadow-2xl py-2 z-50 flex flex-col divide-y divide-[#262633]">
          <div className="px-4 py-2">
            <p className="text-sm font-bold text-[#e0e0e0] truncate">{isLoggedIn ? player.name : 'Guest Detective'}</p>
            <p className="text-xs text-[#8a8a9e] truncate">{isLoggedIn ? player.email : 'Not Logged In'}</p>
          </div>

          <div className="py-1">
            <button
              onClick={() => { setIsOpen(false); onNavigate('progress'); }}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#e0e0e0] hover:bg-[#d4af37]/10 hover:text-[#d4af37] transition-colors text-left"
            >
              <BarChart3 className="w-4 h-4 text-[#d4af37]" />
              View Detective Progress
            </button>
            <button
              onClick={() => { setIsOpen(false); onNavigate('credentials'); }}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#e0e0e0] hover:bg-[#d4af37]/10 hover:text-[#d4af37] transition-colors text-left"
            >
              <IdCard className="w-4 h-4 text-[#d4af37]" />
              Edit Credentials
            </button>
          </div>

          <div className="py-1">
            {isLoggedIn ? (
              <button
                onClick={() => { setIsOpen(false); logoutUser(); }}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors text-left"
              >
                <LogOut className="w-4 h-4 text-red-400" />
                Logout / Switch Agent
              </button>
            ) : (
              <button
                onClick={() => { setIsOpen(false); onOpenAuth(); }}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#d4af37] hover:bg-[#d4af37]/10 transition-colors text-left"
              >
                <Key className="w-4 h-4 text-[#d4af37]" />
                Login / Register Agent
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
