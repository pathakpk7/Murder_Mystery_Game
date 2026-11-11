import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Volume2, 
  VolumeX, 
  Search, 
  Terminal, 
  Database, 
  Shield, 
  FileText, 
  Radio, 
  Key, 
  Skull,
  Eye,
  AlertTriangle
} from 'lucide-react';
import {
  playCordPullSound,
  playLightSwitchSound,
  playMagnifierPickupSound,
  playClueFoundSound,
  playRedButtonPressSound,
  playRoomEnterBreachSound,
  toggleMute,
  getIsMuted
} from '../utils/mysteryAudio';

export default function InteractiveStoryLanding({ onEnterRoom }) {
  // Stage flow:
  // 1. 'LIGHT_OFF'     -> User needs to pull the cord
  // 2. 'LOOK_MAGNIFIER' -> Light is ON, user needs to pick up magnifying glass
  // 3. 'LOOK_TOP_RIGHT' -> User has magnifier, needs to inspect top right details
  // 4. 'PRESS_BUTTON'   -> Details inspected, user needs to press the red button
  // 5. 'EXITING'        -> Button clicked, final dramatic monologues & enter room
  const [stage, setStage] = useState('LIGHT_OFF');

  // Cord & Lamp mechanics
  const [isLightOn, setIsLightOn] = useState(false);
  const [cordY, setCordY] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const pullStartY = useRef(null);

  // Magnifier mechanics
  const [hasMagnifier, setHasMagnifier] = useState(false);
  const [mousePos, setMousePos] = useState({ x: -500, y: -500 });
  const [hasInspectedTopRight, setHasInspectedTopRight] = useState(false);

  // Dead-center instruction display state
  const [currentHintText, setCurrentHintText] = useState(null);
  const [muted, setMuted] = useState(getIsMuted());

  // Room container ref for relative mouse tracking
  const roomRef = useRef(null);
  const hintTimeoutRef = useRef(null);

  // Track mouse coordinates for magnifying glass
  const handleMouseMove = (e) => {
    if (roomRef.current) {
      const rect = roomRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    } else {
      setMousePos({ x: e.clientX, y: e.clientY });
    }
  };

  // Helper to show hint text with slow fade-in and fade-out
  const triggerHint = (text, durationMs = 3800) => {
    if (stage === 'EXITING') return;
    setCurrentHintText(text);
    if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
    hintTimeoutRef.current = setTimeout(() => {
      setCurrentHintText(null);
    }, durationMs);
  };

  // -----------------------------------------------------------------
  // 1. PULL CORD INTERACTION (Hover-slide down or drag)
  // -----------------------------------------------------------------
  const triggerLightSwitch = () => {
    if (isLightOn) return;
    playCordPullSound();
    playLightSwitchSound();
    setIsLightOn(true);
    setCordY(45);
    setTimeout(() => setCordY(0), 300);
    setStage('LOOK_MAGNIFIER');
    setCurrentHintText(null);
  };

  const handleCordMouseDown = (e) => {
    if (isLightOn) return;
    setIsPulling(true);
    pullStartY.current = e.clientY || (e.touches && e.touches[0].clientY);
    playCordPullSound();
  };

  const handleCordMouseMove = (e) => {
    if (isLightOn) return;
    const currentY = e.clientY || (e.touches && e.touches[0]?.clientY);

    // Support both active drag and hover slide-down
    if (pullStartY.current === null) {
      pullStartY.current = currentY;
      return;
    }

    const delta = currentY - pullStartY.current;
    if (delta > 0) {
      const clamped = Math.min(delta, 55);
      setCordY(clamped);
      if (clamped >= 35) {
        triggerLightSwitch();
        setIsPulling(false);
        pullStartY.current = null;
      }
    }
  };

  const handleCordEnd = () => {
    setIsPulling(false);
    pullStartY.current = null;
    if (!isLightOn) {
      setCordY(0);
    }
  };

  // -----------------------------------------------------------------
  // 2. MAGNIFYING GLASS PICKUP
  // -----------------------------------------------------------------
  const handlePickupMagnifier = () => {
    if (!isLightOn || hasMagnifier || stage === 'EXITING') return;
    playMagnifierPickupSound();
    setHasMagnifier(true);
    setStage('LOOK_TOP_RIGHT');
    setCurrentHintText(null);
  };

  // -----------------------------------------------------------------
  // 3. TOP RIGHT CLUE INSPECTION
  // -----------------------------------------------------------------
  const handleTopRightInspect = () => {
    if (hasMagnifier && !hasInspectedTopRight && stage === 'LOOK_TOP_RIGHT') {
      playClueFoundSound();
      setHasInspectedTopRight(true);
      setStage('PRESS_BUTTON');
      setCurrentHintText(null);
    }
  };

  // -----------------------------------------------------------------
  // 4. RED BUTTON PRESS -> DRAMATIC FINALE
  // -----------------------------------------------------------------
  const handleRedButtonClick = () => {
    if (stage === 'EXITING') return;
    setStage('EXITING');
    playRedButtonPressSound();

    if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);

    // 11. "FINALLY.... FELT LIKE TEACHING A PRESCHOOLER HOW TO WALK"
    setCurrentHintText("FINALLY.... FELT LIKE TEACHING A PRESCHOOLER HOW TO WALK");

    setTimeout(() => {
      // 12. "DO NOT DISAPPOINT ME ! DO YOUR BEST ? I FEAR WHAT COULD BE YOUR BEST , ANYWAYS HERE YOU GOOOO..!!!!! "
      setCurrentHintText("DO NOT DISAPPOINT ME ! DO YOUR BEST ? I FEAR WHAT COULD BE YOUR BEST , ANYWAYS HERE YOU GOOOO..!!!!! ");
      playRoomEnterBreachSound();

      setTimeout(() => {
        onEnterRoom();
      }, 4200);
    }, 3400);
  };

  // -----------------------------------------------------------------
  // 5. SUSPENSEFUL REPEATING HINTS STATE MACHINE
  // Do NOT rush user. Repeat instructions until they move forward.
  // -----------------------------------------------------------------
  useEffect(() => {
    if (stage === 'EXITING') return;

    let intervalId;
    let initialTimeoutId;

    if (stage === 'LIGHT_OFF') {
      // Stage 1: Waiting for user to pull the cord
      // Initial suspenseful silence of 9 seconds
      initialTimeoutId = setTimeout(() => {
        triggerHint("Pull the chord", 3800);

        // Repeat periodically with long suspenseful pauses until they pull it
        intervalId = setInterval(() => {
          triggerHint("Pull the chord", 3800);
        }, 15000);
      }, 9000);

    } else if (stage === 'LOOK_MAGNIFIER') {
      // Stage 2: Light is ON, waiting for user to pick up magnifying glass
      let toggleIndex = 0;
      const hints = [
        "LOOK FOR THE MAGNIFYING GLASS",
        "Didn't find it Yet, TOO SLOW. TOO BAD"
      ];

      initialTimeoutId = setTimeout(() => {
        triggerHint(hints[0], 3600);
        toggleIndex = 1;

        intervalId = setInterval(() => {
          triggerHint(hints[toggleIndex], 3600);
          toggleIndex = (toggleIndex + 1) % hints.length;
        }, 14000);
      }, 7000);

    } else if (stage === 'LOOK_TOP_RIGHT') {
      // Stage 3: Magnifier is picked up, waiting for user to inspect top right
      let index = 0;
      const hints = [
        "LOOK FOR THE TOP RIGHT ",
        "READ THE DETAILS ",
        "FEELS STUCK ? WHO TOLD YOU CAN INVESTIGATE KIDDO",
        "TOO NAIVE TO BE AN INVESTIGATOR"
      ];

      initialTimeoutId = setTimeout(() => {
        triggerHint(hints[0], 3600);
        index = 1;

        intervalId = setInterval(() => {
          triggerHint(hints[index], 3600);
          index = (index + 1) % hints.length;
        }, 13000);
      }, 5000);

    } else if (stage === 'PRESS_BUTTON') {
      // Stage 4: Details inspected, waiting for user to press the red button
      let index = 0;
      const hints = [
        "LOOK AT THE BOTTOM RIGHT CORNER ",
        "STILL STUCK ",
        "PRESS THE RED BUTTON"
      ];

      initialTimeoutId = setTimeout(() => {
        triggerHint(hints[0], 3600);
        index = 1;

        intervalId = setInterval(() => {
          triggerHint(hints[index], 3600);
          index = (index + 1) % hints.length;
        }, 11000);
      }, 4000);
    }

    return () => {
      if (initialTimeoutId) clearTimeout(initialTimeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [stage]);

  const handleToggleMute = () => {
    const s = toggleMute();
    setMuted(s);
  };

  return (
    <div
      ref={roomRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleMouseMove}
      className="relative w-screen h-screen overflow-hidden bg-[#020203] select-none font-serif text-neutral-300"
      style={{ cursor: hasMagnifier ? 'none' : 'default' }}
    >
      {/* ------------------------------------------------------------- */}
      {/* 1. ROOM ATMOSPHERE & LIGHT CONE */}
      {/* ------------------------------------------------------------- */}
      <div 
        className={`absolute inset-0 transition-opacity duration-1000 pointer-events-none ${
          isLightOn ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: `radial-gradient(circle 800px at 50% 32%, rgba(200, 160, 65, 0.16) 0%, rgba(16, 12, 8, 0.85) 55%, #020203 82%)`,
        }}
      >
        {/* Soft, dim vertical light cone */}
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[750px] h-full opacity-60"
          style={{
            background: 'conic-gradient(from 180deg at 50% 28%, transparent 72deg, rgba(255, 220, 130, 0.05) 85deg, rgba(255, 210, 110, 0.08) 90deg, rgba(255, 220, 130, 0.05) 95deg, transparent 108deg)',
            filter: 'blur(16px)',
          }}
        />

        {/* Ambient corkboard & dark wood desk texture pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(#d4af37 0.75px, transparent 0.75px)`,
            backgroundSize: '24px 24px',
          }}
        />

        {/* Floating dust specks in the incandescent light */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute w-1.5 h-1.5 rounded-full bg-amber-200/50 blur-[1px] top-[36%] left-[49%] animate-pulse" />
          <div className="absolute w-1 h-1 rounded-full bg-amber-300/40 blur-[1px] top-[42%] left-[53%] animate-ping" style={{ animationDuration: '6s' }} />
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. THE DETECTIVE EVIDENCE ROOM & WEBSITE DETAILS */}
      {/* ------------------------------------------------------------- */}
      {isLightOn && (
        <div className="absolute inset-0 z-10 pointer-events-auto">

          {/* SVG RED THREADS CONNECTING CLUES ACROSS THE BOARD */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40 z-0">
            {/* Thread from Top Right Suspect Dossier to Center Project Vritara */}
            <line x1="82%" y1="18%" x2="50%" y2="38%" stroke="#8b0000" strokeWidth="1.5" strokeDasharray="4 2" />
            {/* Thread from Center to Left Cases Index */}
            <line x1="50%" y1="38%" x2="22%" y2="58%" stroke="#8b0000" strokeWidth="1.5" strokeDasharray="4 2" />
            {/* Thread from Left Cases to Bottom Credentials */}
            <line x1="22%" y1="58%" x2="20%" y2="82%" stroke="#8b0000" strokeWidth="1.5" strokeDasharray="4 2" />
          </svg>

          {/* TOP LEFT: Minimal Audio Toggle & Police Radio Intercept */}
          <div className="absolute top-5 left-5 sm:top-8 sm:left-8 z-30 flex items-center gap-3">
            <button
              onClick={handleToggleMute}
              className="p-2 sm:px-3 sm:py-1.5 rounded bg-[#0a0a0d]/80 border border-[#4a3b1d]/40 text-[#8c7b58] hover:text-[#d4af37] hover:border-[#8c7b58] transition-all text-xs font-mono flex items-center gap-2 backdrop-blur-sm"
              title="Toggle Audio Effects"
            >
              {muted ? <VolumeX className="w-4 h-4 text-neutral-600" /> : <Volume2 className="w-4 h-4 text-[#c7a760]" />}
              <span className="hidden sm:inline font-bold text-[10px] tracking-wider">{muted ? "MUTED" : "POLICE AUDIO ON"}</span>
            </button>

            {/* Wiretap Radio Intercept Badge */}
            <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded bg-[#0a0a0d]/70 border border-[#262633] text-[10px] font-mono text-neutral-400">
              <Radio className="w-3 h-3 text-red-500 animate-pulse" />
              <span>WIRETAP: 02:14 AM // ENCRYPTED SQL INJECTION DETECTED</span>
            </div>
          </div>

          {/* TOP RIGHT: The Classified Mastermind Dossier (The Clue target for the handler hint) */}
          <div
            onMouseEnter={handleTopRightInspect}
            className="absolute top-6 right-5 sm:top-8 sm:right-10 z-20 cursor-crosshair group max-w-[240px] sm:max-w-[290px]"
          >
            <div 
              className={`p-3.5 sm:p-4 rounded border transition-all duration-500 relative ${
                hasInspectedTopRight
                  ? 'bg-[#100f0d]/95 border-[#8c7b58] shadow-[0_0_25px_rgba(140,123,88,0.25)]'
                  : 'bg-[#0a090b]/90 border-[#382f1b]/60 shadow-xl opacity-80 group-hover:opacity-100 group-hover:border-[#6b582b]'
              }`}
            >
              {/* Red thumbtack marker */}
              <div className="w-2.5 h-2.5 rounded-full bg-red-700 mx-auto -mt-2 mb-2 shadow-[0_0_6px_#ef4444]" />

              <div className="flex items-center justify-between border-b border-[#2b2416] pb-1.5 mb-2">
                <span className="text-[10px] font-mono tracking-widest text-[#c7a760] font-bold">
                  DOSSIER // CELL 09
                </span>
                <span className="text-[9px] font-mono bg-red-950/80 border border-red-800 text-red-300 px-1 rounded">
                  TOP SECRET
                </span>
              </div>

              <div className="space-y-1 text-[11px] font-mono text-neutral-300 leading-snug">
                <p>
                  <strong className="text-neutral-400 font-normal">MASTERMIND:</strong>{" "}
                  <span className="text-[#e2c174] font-bold">THE SUTRADHAR</span>
                </p>
                <p className="text-[10px] text-neutral-400 leading-tight">
                  Infiltrated 18 state police jurisdictions. Manipulates real-time forensic database tables.
                </p>
              </div>

              {/* Secret UV Clue revealed by Magnifier or upon inspection */}
              <div className="mt-2.5 pt-2 border-t border-[#2b2416] text-[10px] font-mono">
                {hasMagnifier || hasInspectedTopRight ? (
                  <span className="text-emerald-400 font-bold block animate-pulse">
                    🔍 [UV DECRYPTED: ARCHIVE CIPHER 884-VX • BUTTON ENGAGED]
                  </span>
                ) : (
                  <span className="text-neutral-500 italic block">
                    • [INSPECT WITH MAGNIFIER]
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* MAIN CENTERPIECE: PROJECT VRITARA & GAME MISSION BRIEFING */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pt-24 sm:pt-28 pointer-events-none px-4 text-center">
            {/* Title: Antique Metallic Gold Header */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="space-y-2 pointer-events-auto"
            >
              <div className="inline-flex items-center gap-2 px-3 py-0.5 mb-1 rounded bg-[#120f09]/80 border border-[#4a3916] text-[10px] sm:text-xs font-mono font-bold tracking-widest text-[#c7a760] uppercase shadow-md">
                <Shield className="w-3.5 h-3.5 text-red-500" />
                CBI FORENSIC TASK FORCE SPECIAL UNIT
              </div>

              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-serif tracking-[0.16em] text-[#c7a760] drop-shadow-[0_4px_25px_rgba(0,0,0,0.95)]">
                PROJECT VRITARA
              </h1>

              {/* Tagline: Atmospheric Gold Noir Serif */}
              <p className="text-xs sm:text-base md:text-lg font-serif italic text-[#8c7b58] tracking-[0.25em] uppercase font-semibold">
                “Things aren’t always what they seem”
              </p>

              {/* Core Game Features / Website Details Bar */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-[10px] sm:text-xs font-mono text-neutral-400">
                <span className="flex items-center gap-1.5 bg-[#0a0a0c]/80 border border-[#2b2416] px-2.5 py-1 rounded">
                  <Skull className="w-3.5 h-3.5 text-red-400" />
                  <strong>18 INTERCONNECTED COLD CASES</strong>
                </span>
                <span className="hidden sm:inline text-neutral-600">•</span>
                <span className="flex items-center gap-1.5 bg-[#0a0a0c]/80 border border-[#2b2416] px-2.5 py-1 rounded">
                  <Database className="w-3.5 h-3.5 text-[#c7a760]" />
                  <strong>SQL FORENSIC WEAPON</strong>
                </span>
                <span className="hidden sm:inline text-neutral-600">•</span>
                <span className="flex items-center gap-1.5 bg-[#0a0a0c]/80 border border-[#2b2416] px-2.5 py-1 rounded">
                  <Key className="w-3.5 h-3.5 text-amber-400" />
                  <strong>1 NATIONWIDE CONSPIRACY</strong>
                </span>
              </div>
            </motion.div>

            {/* REAL SQL FORENSIC QUERY TERMINAL STRIP ON THE EVIDENCE DESK */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.4 }}
              className="mt-6 pointer-events-auto max-w-lg w-full bg-[#08080a]/90 border border-[#2b2416] rounded p-2.5 text-left font-mono text-[10px] sm:text-[11px] shadow-2xl backdrop-blur-sm"
            >
              <div className="flex items-center justify-between border-b border-[#1c1810] pb-1 mb-1.5 text-neutral-500 text-[9px]">
                <span className="flex items-center gap-1 text-[#c7a760]">
                  <Terminal className="w-3 h-3 text-[#c7a760]" />
                  FORENSIC_DB_QUERY // CASE_00.sql
                </span>
                <span className="text-emerald-500 font-bold">SQL ENGINE ACTIVE</span>
              </div>
              <p className="text-emerald-400 font-mono leading-tight">
                <span className="text-[#c7a760] font-bold">SELECT</span> suspect_id, alibi, poison_trace <br />
                <span className="text-[#c7a760] font-bold">FROM</span> autopsy_and_call_logs <br />
                <span className="text-[#c7a760] font-bold">WHERE</span> incident_time = <span className="text-amber-300">'02:14:00'</span> <br />
                <span className="text-[#c7a760] font-bold">ORDER BY</span> alibi_discrepancy <span className="text-red-400 font-bold">DESC</span>;
              </p>
            </motion.div>
          </div>

          {/* LEFT SIDE: 18 Cases Dossier Index & Evidence Marker */}
          <div className="hidden lg:block absolute bottom-8 left-8 sm:bottom-12 sm:left-12 z-20 max-w-[260px] p-3.5 rounded bg-[#0c0b0e]/90 border border-[#2b2416] shadow-2xl font-mono text-[11px]">
            <div className="flex items-center gap-1.5 text-[10px] text-[#c7a760] font-bold border-b border-[#221c11] pb-1 mb-2">
              <FileText className="w-3.5 h-3.5 text-[#c7a760]" />
              <span>ACTIVE CASE ARCHIVES</span>
            </div>
            <ul className="space-y-1 text-[10px] text-neutral-400">
              <li className="text-neutral-300 font-semibold">• Case 00: Nagabhavan Poisoning</li>
              <li>• Case 01: The Hacked Telemetry</li>
              <li>• Case 07: Red Sandalwood Syndicate</li>
              <li>• Case 18: The Sutradhar Convergence</li>
            </ul>
            <div className="mt-2 pt-1.5 border-t border-[#221c11] flex items-center justify-between text-[9px] text-[#8c7b58]">
              <span>STATUS: 18 OPEN</span>
              <span className="text-red-400 font-bold">UNSOLVED</span>
            </div>
          </div>

          {/* THE MAGNIFYING GLASS (Resting on the desk with an eerie brass glint) */}
          {!hasMagnifier && (
            <div
              onClick={handlePickupMagnifier}
              className="absolute top-[62%] right-[18%] sm:right-[22%] z-20 cursor-pointer group flex flex-col items-center"
              title="Pick up Magnifying Glass to search details"
            >
              {/* Subtle pulsating glint */}
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-[#8c7b58] bg-[#0d0c0a]/90 flex items-center justify-center shadow-[0_0_20px_rgba(140,123,88,0.3)] group-hover:scale-110 group-hover:border-[#c7a760] transition-all duration-300">
                <Search className="w-7 h-7 sm:w-8 sm:h-8 text-[#8c7b58] group-hover:text-[#c7a760] transition-colors" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              </div>
              <span className="mt-1.5 px-2 py-0.5 rounded bg-[#0a0a0d]/90 border border-[#4a3b1d] text-[9px] font-mono font-bold text-[#c7a760] uppercase tracking-wider shadow">
                EQUIP MAGNIFIER
              </span>
            </div>
          )}

          {/* THE SMALL RED BUTTON (Bottom Right Corner for all screens) */}
          <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-30 pointer-events-auto">
            <div className="relative flex flex-col items-center">
              {/* Tactile small dark-housed red industrial push button */}
              <button
                onClick={handleRedButtonClick}
                disabled={stage === 'EXITING'}
                className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-b from-red-600 via-red-700 to-red-950 border-2 border-red-950 shadow-[0_4px_0_#380808,0_6px_16px_rgba(180,20,20,0.5)] active:translate-y-1 active:shadow-[0_1px_0_#380808] hover:brightness-110 transition-all flex items-center justify-center group"
                title="Press to Enter Room"
              >
                {/* Subtle specular glint */}
                <div className="absolute top-1 left-2 right-2 h-3 rounded-full bg-white/20 blur-[0.5px]" />
                
                {/* Central glowing indicator core */}
                <div className="w-2.5 h-2.5 rounded-full bg-red-400 group-hover:bg-red-300 shadow-[0_0_8px_#ef4444] animate-pulse" />
              </button>

              <span className="mt-1.5 text-[9px] font-mono tracking-widest text-[#8c7b58] uppercase font-bold text-center">
                ENTER
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. THE CENTER HANGING LIGHT BULB & PULL CORD */}
      {/* ------------------------------------------------------------- */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-none"
        style={{ width: '100px' }}
      >
        {/* Wire from ceiling */}
        <div 
          className="w-[2px] bg-gradient-to-b from-black via-[#161618] to-[#25252b]"
          style={{ height: '30vh' }}
        />

        {/* Vintage brass lamp socket */}
        <div className="w-6 h-7 bg-gradient-to-b from-[#5c471c] via-[#8c6d26] to-[#3d2e0f] rounded-t-sm shadow-lg border border-[#2b200b]" />

        {/* Bulb Glass */}
        <div className="relative flex flex-col items-center -mt-0.5">
          {/* Warm incandescent halo when ON */}
          {isLightOn && (
            <div className="absolute -inset-8 rounded-full bg-amber-400/30 blur-xl animate-pulse pointer-events-none" />
          )}

          <div 
            className={`relative w-11 h-13 rounded-b-full rounded-t-md border transition-all duration-300 flex items-center justify-center ${
              isLightOn 
                ? 'bg-amber-100/90 border-amber-300 shadow-[0_0_35px_rgba(255,210,90,0.8)]' 
                : 'bg-black/80 border-[#2b2b32] shadow-inner'
            }`}
          >
            {/* Filament Wire */}
            <div 
              className={`w-3.5 h-5 border transition-all duration-200 rounded-sm ${
                isLightOn 
                  ? 'border-yellow-200 bg-yellow-300 shadow-[0_0_8px_#fff,0_0_15px_#f59e0b]' 
                  : 'border-[#1f1b14] opacity-30'
              }`}
            />
          </div>
        </div>

        {/* The Pull Cord Chain Switch */}
        <div 
          className="relative pointer-events-auto flex flex-col items-center cursor-pointer select-none py-3 px-6"
          style={{
            transform: `translateY(${cordY}px)`,
            transition: isPulling ? 'none' : 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
          onClick={() => {
            if (!isLightOn) triggerLightSwitch();
          }}
          onMouseDown={handleCordMouseDown}
          onMouseMove={handleCordMouseMove}
          onMouseUp={handleCordEnd}
          onTouchStart={handleCordMouseDown}
          onTouchMove={handleCordMouseMove}
          onTouchEnd={handleCordEnd}
          onMouseEnter={(e) => {
            pullStartY.current = e.clientY;
          }}
          onMouseLeave={handleCordEnd}
          title={isLightOn ? "Light Switch (ON)" : "Slide down to turn light ON"}
        >
          {/* Beaded Chain */}
          <div className="flex flex-col items-center gap-[3px] py-1">
            {Array.from({ length: 13 }).map((_, i) => (
              <div 
                key={i}
                className={`w-1.5 h-1.5 rounded-full ${
                  isLightOn 
                    ? 'bg-gradient-to-b from-[#a88a32] to-[#695217]' 
                    : 'bg-gradient-to-b from-[#544d42] to-[#26231c]'
                }`}
              />
            ))}
          </div>

          {/* Acorn Pull Bell */}
          <div 
            className={`w-3.5 h-5 rounded-b-full rounded-t-sm border shadow-lg ${
              isLightOn
                ? 'bg-gradient-to-b from-[#d4af37] to-[#785b14] border-[#9c7b22]'
                : 'bg-gradient-to-b from-[#4d4438] to-[#1c1813] border-[#383127]'
            }`}
          />
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4. ACTIVE MAGNIFYING GLASS CURSOR LENS */}
      {/* ------------------------------------------------------------- */}
      {hasMagnifier && (
        <div
          className="fixed pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${mousePos.x}px`,
            top: `${mousePos.y}px`,
          }}
        >
          {/* Forensic Optic Lens */}
          <div className="relative w-36 h-36 sm:w-42 sm:h-42 rounded-full border-2 border-[#c7a760] bg-amber-400/5 backdrop-brightness-125 shadow-[0_0_25px_rgba(199,167,96,0.35),inset_0_0_15px_rgba(255,255,255,0.15)] flex items-center justify-center">
            {/* Fine crosshairs */}
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <div className="w-full h-[1px] bg-[#c7a760]" />
              <div className="h-full w-[1px] bg-[#c7a760]" />
            </div>
            <span className="absolute bottom-2 text-[8px] font-mono tracking-widest text-[#c7a760] bg-black/60 px-1 rounded">
              UV OPTIC ZOOM
            </span>
          </div>

          {/* Wooden / Brass Handle */}
          <div 
            className="w-3.5 h-14 bg-gradient-to-b from-[#5c4014] to-[#1a1103] rounded-b border border-[#78541a] absolute -bottom-10 -right-3 rotate-[-45deg] origin-top-left shadow-2xl"
          />
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 5. SUSPENSEFUL DEAD-CENTER INSTRUCTIONS (Slow fade-in/out) */}
      {/* ------------------------------------------------------------- */}
      <AnimatePresence mode="wait">
        {currentHintText && (
          <motion.div
            key={currentHintText}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.03 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center p-6 text-center"
          >
            {/* Soft dark vignette behind the floating text */}
            <div className="max-w-4xl px-8 py-6 rounded-2xl bg-black/70 backdrop-blur-[2px]">
              <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-mono uppercase font-black tracking-widest text-red-600/90 drop-shadow-[0_0_25px_rgba(220,38,38,0.8)] leading-relaxed">
                {currentHintText}
              </h2>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ------------------------------------------------------------- */}
      {/* 6. CINEMATIC BLACKOUT ON FINAL EXIT */}
      {/* ------------------------------------------------------------- */}
      {stage === 'EXITING' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0.2, 0.9, 1] }}
          transition={{ duration: 4.2, times: [0, 0.2, 0.45, 0.85, 1] }}
          className="fixed inset-0 z-[60] bg-black pointer-events-none"
        />
      )}
    </div>
  );
}
