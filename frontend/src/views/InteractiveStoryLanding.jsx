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
  Skull
} from 'lucide-react';
import {
  playCordPullSound,
  playLightSwitchSound,
  playMagnifierPickupSound,
  playClueFoundSound,
  playRedButtonPressSound,
  playRoomEnterBreachSound,
  playSpookyWhisperSound,
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

  // Magnifier mechanics & Cursor position
  const [hasMagnifier, setHasMagnifier] = useState(false);
  const [mousePos, setMousePos] = useState({ x: -500, y: -500 });
  const [hasInspectedTopRight, setHasInspectedTopRight] = useState(false);

  // Dead-center instruction display state
  const [currentHintText, setCurrentHintText] = useState(null);
  const [muted, setMuted] = useState(getIsMuted());

  // Room container ref for relative mouse tracking
  const roomRef = useRef(null);
  const hintTimeoutRef = useRef(null);

  // Track mouse coordinates for magnifying glass and inspect hotspot
  const handleMouseMove = (e) => {
    let clientX, clientY;
    if (e.touches && e.touches[0]) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    if (roomRef.current) {
      const rect = roomRef.current.getBoundingClientRect();
      const relX = clientX - rect.left;
      const relY = clientY - rect.top;
      setMousePos({ x: relX, y: relY });

      // Check if magnifying glass is inspecting top-right clue hotspot
      if (hasMagnifier && stage === 'LOOK_TOP_RIGHT' && !hasInspectedTopRight) {
        if (clientX > window.innerWidth - 340 && clientY < 240) {
          playClueFoundSound();
          setHasInspectedTopRight(true);
          setStage('PRESS_BUTTON');
          setCurrentHintText(null);
        }
      }
    } else {
      setMousePos({ x: clientX, y: clientY });
    }
  };

  // Helper to show hint text with slow fade-in and fade-out and spooky whisper
  const triggerHint = (text, durationMs = 3800) => {
    if (stage === 'EXITING') return;
    playSpookyWhisperSound();
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
    pullStartY.current = e.clientY || (e.touches && e.touches[0]?.clientY);
    playCordPullSound();
  };

  const handleCordMouseMove = (e) => {
    if (isLightOn) return;
    const currentY = e.clientY || (e.touches && e.touches[0]?.clientY);

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
  // 3. RED BUTTON PRESS -> DRAMATIC FINALE
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
  // 4. SUSPENSEFUL REPEATING HINTS STATE MACHINE
  // Strictly gated to user progress.
  // -----------------------------------------------------------------
  useEffect(() => {
    if (stage === 'EXITING') return;

    let intervalId;
    let initialTimeoutId;

    if (stage === 'LIGHT_OFF') {
      // Stage 1: Waiting for user to pull the cord
      initialTimeoutId = setTimeout(() => {
        triggerHint("Pull the chord", 3800);

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

  // -----------------------------------------------------------------
  // 5. CRIME ROOM EVIDENCE SCENE
  // ONLY illuminated inside the magnifying glass circular lens!
  // -----------------------------------------------------------------
  const renderCrimeSceneContent = () => {
    return (
      <div className="absolute inset-0 w-full h-full select-none">
        {/* Crime Board Red String */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-60">
          <line x1="82%" y1="18%" x2="50%" y2="38%" stroke="#b21818" strokeWidth="1.8" strokeDasharray="5 3" />
          <line x1="50%" y1="38%" x2="22%" y2="58%" stroke="#b21818" strokeWidth="1.8" strokeDasharray="5 3" />
        </svg>

        {/* TOP LEFT: Wiretap Dispatch Snippet */}
        <div className="absolute top-6 left-6 sm:top-8 sm:left-8 flex items-center gap-2">
          <div className="px-3 py-1.5 rounded text-[10px] font-mono border bg-[#14110b] border-[#8c7b58] text-[#f0e2b6] shadow-lg">
            <span className="flex items-center gap-2 font-bold tracking-wider">
              <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" />
              <span>WIRETAP: 02:14 AM // ENCRYPTED SQL INJECTION DETECTED</span>
            </span>
          </div>
        </div>

        {/* TOP RIGHT: The Classified Mastermind Dossier Hotspot */}
        <div className="absolute top-6 right-5 sm:top-8 sm:right-10 max-w-[260px] sm:max-w-[300px]">
          <div className="p-4 rounded border bg-[#16130e] border-[#c7a760] shadow-[0_0_35px_rgba(212,175,55,0.4)]">
            <div className="w-2.5 h-2.5 rounded-full bg-red-600 shadow-[0_0_8px_#ef4444] mx-auto -mt-2 mb-2" />

            <div className="flex items-center justify-between border-b border-[#3d3420] pb-1.5 mb-2 text-[#f0d48f]">
              <span className="text-[10px] font-mono tracking-widest font-bold">
                DOSSIER // CELL 09
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-red-950 text-red-300 border border-red-800">
                TOP SECRET
              </span>
            </div>

            <div className="space-y-1 text-[11px] font-mono leading-snug">
              <p className="text-[#f5f0dc]">
                <span className="font-normal opacity-80">MASTERMIND:</span>{" "}
                <strong className="text-[#f0d48f]">THE SUTRADHAR</strong>
              </p>
              <p className="text-[10px] text-[#d6c79a] leading-tight">
                Infiltrated 18 state police jurisdictions. Manipulates real-time forensic database tables.
              </p>
            </div>

            <div className="mt-2.5 pt-2 border-t border-[#3d3420] text-[10px] font-mono text-emerald-400 font-bold">
              <span>🔍 [UV DECRYPTED: ARCHIVE CIPHER 884-VX • BREACH READY]</span>
            </div>
          </div>
        </div>

        {/* CENTERPIECE: PROJECT VRITARA & GAME DETAILS */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-24 sm:pt-28 pointer-events-none px-4 text-center">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-1 rounded text-[10px] sm:text-xs font-mono font-bold tracking-widest uppercase border bg-[#1c160a] border-[#8c7b58] text-[#f2d894] shadow-md">
              <Shield className="w-3.5 h-3.5 text-red-500" />
              CBI FORENSIC TASK FORCE SPECIAL UNIT
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-serif tracking-[0.16em] text-[#f3d98b] drop-shadow-[0_4px_30px_rgba(212,175,55,0.5)]">
              PROJECT VRITARA
            </h1>

            <p className="text-xs sm:text-base md:text-lg font-serif italic tracking-[0.25em] uppercase font-semibold text-[#c7a760]">
              “Things aren’t always what they seem”
            </p>

            {/* Core Game Pillars */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-[10px] sm:text-xs font-mono">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded border bg-[#18140c] border-[#5e4f2b] text-[#ebd8a7]">
                <Skull className="w-3.5 h-3.5 text-red-400" />
                <strong>18 INTERCONNECTED COLD CASES</strong>
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded border bg-[#18140c] border-[#5e4f2b] text-[#ebd8a7]">
                <Database className="w-3.5 h-3.5 text-[#e5c777]" />
                <strong>SQL FORENSIC WEAPON</strong>
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded border bg-[#18140c] border-[#5e4f2b] text-[#ebd8a7]">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <strong>1 NATIONWIDE CONSPIRACY</strong>
              </span>
            </div>
          </div>

          {/* REAL SQL FORENSIC QUERY TERMINAL STRIP ON THE DESK */}
          <div className="mt-6 max-w-lg w-full rounded p-3 text-left font-mono text-[10px] sm:text-[11px] border shadow-2xl bg-[#0e1014] border-[#8c7b58] text-neutral-200">
            <div className="flex items-center justify-between border-b border-[#26241d] pb-1 mb-1.5 text-[9px] text-[#c7a760]">
              <span className="flex items-center gap-1 font-bold">
                <Terminal className="w-3 h-3" />
                FORENSIC_DB_QUERY // CASE_00.sql
              </span>
              <span className="text-emerald-400 font-bold">
                SQL ENGINE ACTIVE
              </span>
            </div>
            <p className="text-emerald-300 font-mono leading-tight">
              <span className="text-[#f0d48f] font-bold">SELECT</span> suspect_id, alibi, poison_trace <br />
              <span className="text-[#f0d48f] font-bold">FROM</span> autopsy_and_call_logs <br />
              <span className="text-[#f0d48f] font-bold">WHERE</span> incident_time = <span className="text-amber-300">'02:14:00'</span> <br />
              <span className="text-[#f0d48f] font-bold">ORDER BY</span> alibi_discrepancy <span className="text-red-400 font-bold">DESC</span>;
            </p>
          </div>
        </div>

        {/* LEFT SIDE: Active Case Archives */}
        <div className="hidden lg:block absolute bottom-8 left-8 sm:bottom-12 sm:left-12 max-w-[260px] p-4 rounded font-mono text-[11px] border bg-[#14120e] border-[#5e4f2b] shadow-2xl">
          <div className="flex items-center gap-1.5 text-[10px] font-bold border-b border-[#332a18] text-[#e2c174] pb-1 mb-2">
            <FileText className="w-3.5 h-3.5" />
            <span>ACTIVE CASE ARCHIVES</span>
          </div>
          <ul className="space-y-1.5 text-[10px] text-[#d6c9a3]">
            <li>• Case 00: Nagabhavan Poisoning</li>
            <li>• Case 01: The Hacked Telemetry</li>
            <li>• Case 07: Red Sandalwood Syndicate</li>
            <li>• Case 18: The Sutradhar Convergence</li>
          </ul>
        </div>
      </div>
    );
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
      {/* 1. ROOM BACKGROUND: PURE NOIR DARKNESS (No ambient leak) */}
      {/* ------------------------------------------------------------- */}
      <div 
        className={`absolute inset-0 transition-opacity duration-1000 pointer-events-none ${
          isLightOn ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          // Only a tiny, faint incandescent filament halo around the hanging bulb
          background: `radial-gradient(circle 180px at 50% 32%, rgba(200, 160, 65, 0.08) 0%, rgba(5, 5, 5, 0.95) 75%, #020203 100%)`,
        }}
      />

      {/* ------------------------------------------------------------- */}
      {/* 2. ILLUMINATED SPOTLIGHT LAYER (STRICTLY CLIPPED TO LENS) */}
      {/* Content is completely invisible until searched with magnifier! */}
      {/* ------------------------------------------------------------- */}
      {isLightOn && hasMagnifier && (
        <div 
          className="absolute inset-0 pointer-events-none z-20"
          style={{
            clipPath: `circle(95px at ${mousePos.x}px ${mousePos.y}px)`,
            WebkitClipPath: `circle(95px at ${mousePos.x}px ${mousePos.y}px)`,
          }}
        >
          {/* Light yellow ambiance background under the magnifying glass */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle 125px at ${mousePos.x}px ${mousePos.y}px, rgba(250, 220, 110, 0.35) 0%, rgba(212, 175, 55, 0.22) 60%, rgba(20, 16, 8, 0.85) 100%)`,
            }}
          />

          {/* Fully visible, crisp, illuminated crime scene content */}
          <div className="absolute inset-0 filter brightness-125 contrast-125">
            {renderCrimeSceneContent()}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. INTERACTIVE CONTROLS (MAGNIFIER RESTING, RED BUTTON, AUDIO) */}
      {/* ------------------------------------------------------------- */}
      {isLightOn && (
        <div className="absolute inset-0 z-30 pointer-events-none">
          {/* Minimal Audio Toggle */}
          <button
            onClick={handleToggleMute}
            className="pointer-events-auto absolute top-6 left-6 p-2 text-neutral-600 hover:text-neutral-300 transition-colors"
            title="Toggle Sound Effects"
          >
            {muted ? <VolumeX className="w-4 h-4 text-neutral-600" /> : <Volume2 className="w-4 h-4 text-[#8c7b58]" />}
          </button>

          {/* Magnifying Glass resting on the desk before pickup */}
          {!hasMagnifier && (
            <div
              onClick={handlePickupMagnifier}
              className="pointer-events-auto absolute top-[60%] right-[18%] sm:right-[22%] cursor-pointer group flex flex-col items-center"
              title="Pick up Magnifying Glass to search details"
            >
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-[#8c7b58] bg-[#0d0c0a]/90 flex items-center justify-center shadow-[0_0_20px_rgba(140,123,88,0.3)] group-hover:scale-110 group-hover:border-[#c7a760] transition-all duration-300">
                <Search className="w-7 h-7 sm:w-8 sm:h-8 text-[#8c7b58] group-hover:text-[#c7a760] transition-colors" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              </div>
              <span className="mt-1.5 px-2 py-0.5 rounded bg-[#0a0a0d]/90 border border-[#4a3b1d] text-[9px] font-mono font-bold text-[#c7a760] uppercase tracking-wider shadow">
                EQUIP MAGNIFIER
              </span>
            </div>
          )}

          {/* The Small Red Industrial Push Button in Bottom Right Corner */}
          <div className="pointer-events-auto fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40">
            <div className="relative flex flex-col items-center">
              <button
                onClick={handleRedButtonClick}
                disabled={stage === 'EXITING'}
                className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-b from-red-600 via-red-700 to-red-950 border-2 border-red-950 shadow-[0_4px_0_#380808,0_6px_16px_rgba(180,20,20,0.5)] active:translate-y-1 active:shadow-[0_1px_0_#380808] hover:brightness-110 transition-all flex items-center justify-center group"
                title="Press to Enter Room"
              >
                <div className="absolute top-1 left-2 right-2 h-3 rounded-full bg-white/20 blur-[0.5px]" />
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
      {/* 4. THE CENTER HANGING LIGHT BULB & PULL CORD */}
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
          {/* Faint filament glow when ON */}
          {isLightOn && (
            <div className="absolute -inset-5 rounded-full bg-amber-400/20 blur-md animate-pulse pointer-events-none" />
          )}

          <div 
            className={`relative w-11 h-13 rounded-b-full rounded-t-md border transition-all duration-300 flex items-center justify-center ${
              isLightOn 
                ? 'bg-amber-100/90 border-amber-300 shadow-[0_0_15px_rgba(255,210,90,0.5)]' 
                : 'bg-black/80 border-[#2b2b32] shadow-inner'
            }`}
          >
            {/* Filament Wire */}
            <div 
              className={`w-3.5 h-5 border transition-all duration-200 rounded-sm ${
                isLightOn 
                  ? 'border-yellow-200 bg-yellow-300 shadow-[0_0_5px_#fff,0_0_10px_#f59e0b]' 
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
      {/* 5. ACTIVE MAGNIFYING GLASS CURSOR FRAME (Moves with cursor) */}
      {/* ------------------------------------------------------------- */}
      {hasMagnifier && (
        <div
          className="fixed pointer-events-none z-40 transform -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${mousePos.x}px`,
            top: `${mousePos.y}px`,
          }}
        >
          {/* Antique Brass Bezel Frame */}
          <div className="relative w-[190px] h-[190px] rounded-full border-4 border-[#c7a760] shadow-[0_0_30px_rgba(212,175,55,0.4),inset_0_0_20px_rgba(255,255,255,0.2)] flex items-center justify-center">
            {/* Fine crosshairs */}
            <div className="absolute inset-0 flex items-center justify-center opacity-30">
              <div className="w-full h-[1px] bg-[#c7a760]" />
              <div className="h-full w-[1px] bg-[#c7a760]" />
            </div>
            {/* Lens flare streak */}
            <div className="absolute top-3 left-4 w-12 h-6 rounded-full bg-white/20 blur-[2px] rotate-[-25deg]" />
            <span className="absolute bottom-2 text-[8px] font-mono tracking-widest text-[#f5df9f] bg-black/75 px-1.5 py-0.5 rounded border border-[#8c7b58]/50">
              FORENSIC ILLUMINATOR
            </span>
          </div>

          {/* Wooden / Brass Handle */}
          <div 
            className="w-4 h-16 bg-gradient-to-b from-[#5c4014] to-[#1a1103] rounded-b border border-[#78541a] absolute -bottom-12 -right-4 rotate-[-45deg] origin-top-left shadow-2xl"
          />
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 6. CRYPTIC & SPOOKY DEAD-CENTER INSTRUCTIONS */}
      {/* ------------------------------------------------------------- */}
      <AnimatePresence mode="wait">
        {currentHintText && (
          <motion.div
            key={currentHintText}
            initial={{ opacity: 0, scale: 0.92, filter: 'blur(4px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(6px)' }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center p-6 text-center"
          >
            {/* Dark eerie vignette with subtle blood-red shadow */}
            <div className="max-w-4xl px-8 py-6 rounded-2xl bg-black/85 border border-red-950/40 shadow-[0_0_80px_rgba(139,0,0,0.6)] backdrop-blur-md relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-950/10 to-transparent pointer-events-none" />
              <h2 className="spooky-cryptic-text text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-[0.35em] sm:tracking-[0.45em] leading-relaxed drop-shadow-[0_0_25px_rgba(255,26,60,0.95)]">
                {currentHintText}
              </h2>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ------------------------------------------------------------- */}
      {/* 7. CINEMATIC BLACKOUT ON FINAL EXIT */}
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
