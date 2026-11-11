import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Volume2, 
  VolumeX, 
  Search, 
  FileText, 
  Compass, 
  AlertTriangle, 
  Radio, 
  Eye, 
  Sparkles,
  ArrowRight,
  Shield,
  HelpCircle
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
  // Lighting & cord state
  const [isLightOn, setIsLightOn] = useState(false);
  const [cordY, setCordY] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const [isHoveringCord, setIsHoveringCord] = useState(false);
  const pullStartY = useRef(null);

  // Magnifying glass state
  const [hasMagnifier, setHasMagnifier] = useState(false);
  const [mousePos, setMousePos] = useState({ x: -500, y: -500 });
  const [cluesFound, setCluesFound] = useState({
    topRight: false,
    dossier: false,
    emblem: false,
    note: false,
  });

  // Handler Instructions Sequence (Addon)
  // 1. "Pull the chord"
  // 2. "LOOK FOR THE MAGNIFYING GLASS"
  // 3. "Didn't find it Yet, TOO SLOW. TOO BAD"
  // 4. "LOOK FOR THE TOP RIGHT "
  // 5. "READ THE DETAILS "
  // 6. "FEELS STUCK ? WHO TOLD YOU CAN INVESTIGATE KIDDO"
  // 7. "TOO NAIVE TO BE AN INVESTIGATOR"
  // 8. "LOOK AT THE BOTTOM RIGHT CORNER "
  // 9. "STILL STUCK "
  // 10. "PRESS THE RED BUTTON"
  // 11. "FINALLY.... FELT LIKE TEACHING A PRESCHOOLER HOW TO WALK"
  // 12. "DO NOT DISAPPOINT ME ! DO YOUR BEST ? I FEAR WHAT COULD BE YOUR BEST , ANYWAYS HERE YOU GOOOO..!!!!! "
  
  const [currentHintText, setCurrentHintText] = useState(null);
  const [hintIndex, setHintIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [muted, setMuted] = useState(getIsMuted());

  // Room container ref for relative mouse tracking
  const roomRef = useRef(null);

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

  // Pull Cord Interaction (Hover slide down or click/drag down)
  const triggerLightSwitch = () => {
    if (isLightOn) return;
    playCordPullSound();
    playLightSwitchSound();
    setIsLightOn(true);
    setCordY(45);
    setTimeout(() => setCordY(0), 300);
  };

  const handleCordMouseDown = (e) => {
    if (isLightOn) return;
    setIsPulling(true);
    pullStartY.current = e.clientY || (e.touches && e.touches[0].clientY);
    playCordPullSound();
  };

  const handleCordMouseMove = (e) => {
    if (!isPulling && !isHoveringCord) return;
    const currentY = e.clientY || (e.touches && e.touches[0]?.clientY);

    if (isPulling && pullStartY.current !== null) {
      const delta = currentY - pullStartY.current;
      if (delta > 0) {
        const clamped = Math.min(delta, 55);
        setCordY(clamped);
        if (clamped >= 40 && !isLightOn) {
          triggerLightSwitch();
          setIsPulling(false);
          pullStartY.current = null;
        }
      }
    } else if (isHoveringCord && !isLightOn) {
      // Hover slide-down mechanic
      if (pullStartY.current === null) {
        pullStartY.current = currentY;
      } else {
        const delta = currentY - pullStartY.current;
        if (delta > 0) {
          const clamped = Math.min(delta, 50);
          setCordY(clamped);
          if (clamped >= 35) {
            triggerLightSwitch();
            setIsHoveringCord(false);
            pullStartY.current = null;
          }
        }
      }
    }
  };

  const handleCordEnd = () => {
    setIsPulling(false);
    setIsHoveringCord(false);
    pullStartY.current = null;
    if (!isLightOn) {
      setCordY(0);
    }
  };

  // Turn on audio toggle
  const handleToggleMute = () => {
    const state = toggleMute();
    setMuted(state);
  };

  // Pickup Magnifying Glass
  const handlePickupMagnifier = () => {
    if (!isLightOn || isExiting) return;
    playMagnifierPickupSound();
    setHasMagnifier(true);
  };

  // Clue discovery check
  const handleClueHover = (clueKey) => {
    if (hasMagnifier && !cluesFound[clueKey]) {
      playClueFoundSound();
      setCluesFound((prev) => ({ ...prev, [clueKey]: true }));
    }
  };

  // Red Button Click Handler -> Initiates dramatic monologues & enter room
  const handleRedButtonClick = () => {
    if (isExiting) return;
    setIsExiting(true);
    playRedButtonPressSound();

    // 11. "FINALLY.... FELT LIKE TEACHING A PRESCHOOLER HOW TO WALK"
    setCurrentHintText("FINALLY.... FELT LIKE TEACHING A PRESCHOOLER HOW TO WALK");

    setTimeout(() => {
      // 12. "DO NOT DISAPPOINT ME ! DO YOUR BEST ? I FEAR WHAT COULD BE YOUR BEST , ANYWAYS HERE YOU GOOOO..!!!!! "
      setCurrentHintText("DO NOT DISAPPOINT ME ! DO YOUR BEST ? I FEAR WHAT COULD BE YOUR BEST , ANYWAYS HERE YOU GOOOO..!!!!! ");
      playRoomEnterBreachSound();

      setTimeout(() => {
        // Transition to home page
        onEnterRoom();
      }, 3400);
    }, 2800);
  };

  // ---------------------------------------------------------------------
  // HINT TIMELINE SCHEDULER (Slow fading in & fading out in dead centre)
  // ---------------------------------------------------------------------
  const showHintTemporarily = (text, durationMs = 3800) => {
    if (isExiting) return;
    setCurrentHintText(text);
    const timer = setTimeout(() => {
      setCurrentHintText((curr) => (curr === text ? null : curr));
    }, durationMs);
    return timer;
  };

  // Sequence progression when user is idle or stuck
  useEffect(() => {
    if (isExiting) return;

    let timer;

    // Step 1: Light is off
    if (!isLightOn) {
      timer = setTimeout(() => {
        showHintTemporarily("Pull the chord", 4200);
      }, 3500);
      return () => clearTimeout(timer);
    }

    // Step 2..10: Light is on, schedule subsequent handler instructions
    const hintSequence = [
      { id: 1, text: "LOOK FOR THE MAGNIFYING GLASS", delay: 1200 },
      { id: 2, text: "Didn't find it Yet, TOO SLOW. TOO BAD", delay: 7000 },
      { id: 3, text: "LOOK FOR THE TOP RIGHT ", delay: 13000 },
      { id: 4, text: "READ THE DETAILS ", delay: 19000 },
      { id: 5, text: "FEELS STUCK ? WHO TOLD YOU CAN INVESTIGATE KIDDO", delay: 25000 },
      { id: 6, text: "TOO NAIVE TO BE AN INVESTIGATOR", delay: 31000 },
      { id: 7, text: "LOOK AT THE BOTTOM RIGHT CORNER ", delay: 37000 },
      { id: 8, text: "STILL STUCK ", delay: 43000 },
      { id: 9, text: "PRESS THE RED BUTTON", delay: 48000 },
    ];

    const timeouts = hintSequence.map((item) => {
      return setTimeout(() => {
        if (!isExiting) {
          showHintTemporarily(item.text, 3600);
        }
      }, item.delay);
    });

    return () => {
      timeouts.forEach((t) => clearTimeout(t));
    };
  }, [isLightOn, isExiting]);

  // Manual Nudge button to advance hint if user clicks "Stuck?"
  const handleStuckNudge = () => {
    if (isExiting) return;
    if (!isLightOn) {
      showHintTemporarily("Pull the chord", 4000);
      return;
    }
    const hintsPool = [
      "LOOK FOR THE MAGNIFYING GLASS",
      "Didn't find it Yet, TOO SLOW. TOO BAD",
      "LOOK FOR THE TOP RIGHT ",
      "READ THE DETAILS ",
      "FEELS STUCK ? WHO TOLD YOU CAN INVESTIGATE KIDDO",
      "TOO NAIVE TO BE AN INVESTIGATOR",
      "LOOK AT THE BOTTOM RIGHT CORNER ",
      "STILL STUCK ",
      "PRESS THE RED BUTTON"
    ];
    const nextIdx = (hintIndex + 1) % hintsPool.length;
    setHintIndex(nextIdx);
    showHintTemporarily(hintsPool[nextIdx], 4000);
  };

  return (
    <div
      ref={roomRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleMouseMove}
      className="relative w-screen h-screen overflow-hidden bg-[#030305] select-none font-sans text-gray-200"
      style={{ cursor: hasMagnifier ? 'none' : 'default' }}
    >
      {/* ----------------------------------------------------------- */}
      {/* 1. ROOM BACKGROUND & LIGHTING ATMOSPHERE */}
      {/* ----------------------------------------------------------- */}
      
      {/* Lit Room Canvas (revealed when light is on) */}
      <div 
        className={`absolute inset-0 transition-opacity duration-1000 ${
          isLightOn ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: `radial-gradient(circle 750px at 50% 38%, rgba(212, 175, 55, 0.28) 0%, rgba(20, 16, 10, 0.85) 55%, #050507 90%)`,
        }}
      >
        {/* Subtle Room Wall & Floor Grid Texture */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(rgba(212, 175, 55, 0.15) 1px, transparent 1px), linear-gradient(to bottom, transparent 65%, rgba(0,0,0,0.85) 100%)`,
            backgroundSize: '36px 36px, 100% 100%',
          }}
        />

        {/* Ambient Cone of Light from the Hanging Bulb */}
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-full pointer-events-none"
          style={{
            background: 'conic-gradient(from 180deg at 50% 32%, transparent 70deg, rgba(255, 230, 150, 0.08) 85deg, rgba(255, 220, 120, 0.14) 90deg, rgba(255, 230, 150, 0.08) 95deg, transparent 110deg)',
            filter: 'blur(12px)',
          }}
        />

        {/* Floating dust motes / particulate atmospheric glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
          <div className="absolute w-2 h-2 rounded-full bg-amber-300/40 blur-[1px] top-1/3 left-[48%] animate-pulse" />
          <div className="absolute w-1.5 h-1.5 rounded-full bg-amber-200/30 blur-[1px] top-1/2 left-[53%] animate-ping" style={{ animationDuration: '4s' }} />
          <div className="absolute w-2.5 h-2.5 rounded-full bg-amber-400/20 blur-[2px] top-[40%] left-[45%] animate-pulse" style={{ animationDuration: '3s' }} />
        </div>
      </div>

      {/* ----------------------------------------------------------- */}
      {/* 2. THE INVESTIGATION ROOM CONTENT & OBJECTS */}
      {/* ----------------------------------------------------------- */}
      {isLightOn && (
        <div className="absolute inset-0 z-10 pointer-events-auto">

          {/* TOP RIGHT CORNER: Mystery Evidence Clue Board Snippet */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            onMouseEnter={() => handleClueHover('topRight')}
            className="absolute top-5 right-5 sm:top-8 sm:right-8 max-w-[200px] sm:max-w-[260px] p-3 rounded bg-[#0d0d12]/90 border border-[#d4af37]/40 shadow-xl backdrop-blur-md group hover:border-[#d4af37] transition-colors"
          >
            <div className="flex items-center gap-1.5 text-[10px] font-mono tracking-widest text-[#d4af37] uppercase font-bold border-b border-[#262633] pb-1.5 mb-2">
              <Shield className="w-3.5 h-3.5 text-red-500" />
              <span>CLASSIFIED DOSSIER // 09</span>
            </div>
            <p className="text-[11px] font-mono text-gray-300 leading-snug">
              "Suspect spotted in Mumbai central terminal. Signal intercepts point directly to the <span className="text-[#d4af37] font-semibold">Sutradhar Cell</span>."
            </p>
            {/* Hidden UV Detail revealed when inspected */}
            <div className="mt-2 text-[10px] font-mono text-emerald-400/90 bg-emerald-950/40 p-1 rounded border border-emerald-500/20">
              {hasMagnifier ? "🔍 [UV DECRYPTED: BYPASS CODE 9924]" : "• [INSPECT WITH MAGNIFIER]"}
            </div>
          </motion.div>

          {/* TOP LEFT: Audio Toggle & Quick Instructions */}
          <div className="absolute top-5 left-5 sm:top-8 sm:left-8 z-30 flex items-center gap-3">
            <button
              onClick={handleToggleMute}
              className="p-2 sm:px-3 sm:py-1.5 rounded-lg bg-[#141419]/90 border border-gray-700/60 hover:border-[#d4af37] text-gray-400 hover:text-white transition-all text-xs font-mono flex items-center gap-2 backdrop-blur-sm shadow-md"
              title="Toggle Audio Effects"
            >
              {muted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-[#d4af37]" />}
              <span className="hidden sm:inline">{muted ? "MUTED" : "SFX ON"}</span>
            </button>

            <button
              onClick={handleStuckNudge}
              className="px-2.5 py-1.5 rounded-lg bg-red-950/40 border border-red-500/40 hover:border-red-400 text-red-300 hover:text-white transition-all text-xs font-mono flex items-center gap-1.5 backdrop-blur-sm shadow-md"
              title="Need Help? Click if stuck"
            >
              <HelpCircle className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden sm:inline">STUCK?</span>
            </button>
          </div>

          {/* MAIN ROOM CENTERPIECE: PROJECT VRITARA & TAGLINE */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pt-28 sm:pt-36 pointer-events-none px-4 text-center">
            {/* Top Classified Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              onMouseEnter={() => handleClueHover('emblem')}
              className="pointer-events-auto cursor-help mb-3"
            >
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-950/70 border border-red-500/50 text-red-400 text-[10px] sm:text-xs font-mono font-bold tracking-widest shadow-lg">
                <Radio className="w-3 h-3 text-red-500 animate-pulse" />
                RESTRICTED FORENSIC ARCHIVE
              </span>
            </motion.div>

            {/* SCREEN TITLE: PROJECT VRITARA */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="space-y-2 pointer-events-auto"
            >
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-serif tracking-tight text-[#f3f3f3] drop-shadow-[0_0_35px_rgba(212,175,55,0.45)]">
                PROJECT VRITARA
              </h1>

              {/* TAGLINE: "Things aren't always what they seem" */}
              <p className="text-sm sm:text-lg md:text-xl font-mono text-[#d4af37] tracking-[0.25em] sm:tracking-[0.35em] uppercase font-bold drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                “Things aren’t always what they seem”
              </p>

              {hasMagnifier && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="pt-2 text-[10px] sm:text-xs font-mono text-emerald-400 bg-emerald-950/50 px-3 py-1 rounded border border-emerald-500/40 inline-flex items-center gap-1.5 shadow-lg"
                >
                  <Search className="w-3.5 h-3.5 text-emerald-400 animate-spin" style={{ animationDuration: '4s' }} />
                  <span>[HIDDEN WATERMARK DETECTED: 18 CONVERGING COLD CASES // SUTRADHAR CIPHER ACTIVE]</span>
                </motion.div>
              )}
            </motion.div>

            {/* SUBTEXT / INTEL DESCRIPTION */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-4 max-w-xl text-xs sm:text-sm font-mono text-gray-400 text-center leading-relaxed"
            >
              Examine the room. Gather the forensic relics. An intricate web of deception awaits behind closed doors.
            </motion.p>
          </div>

          {/* ----------------------------------------------------------- */}
          {/* MYSTERY OBJECTS SCATTERED ON THE SCREEN / EVIDENCE DESK */}
          {/* ----------------------------------------------------------- */}

          {/* Object 1: Crime Evidence Dossier (Bottom Left) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            onMouseEnter={() => handleClueHover('dossier')}
            className="absolute bottom-8 left-6 sm:bottom-12 sm:left-12 max-w-[220px] sm:max-w-[280px] p-3 sm:p-4 rounded-lg bg-[#111116]/95 border border-[#d4af37]/30 shadow-2xl backdrop-blur-md group hover:border-[#d4af37] transition-all"
          >
            <div className="flex items-center justify-between text-[10px] font-mono font-bold text-red-400 mb-2 border-b border-gray-800 pb-1">
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#d4af37]" />
                EVIDENCE FILE #18
              </span>
              <span className="text-[9px] bg-red-950 px-1.5 py-0.5 rounded text-red-300">CONFIDENTIAL</span>
            </div>
            <p className="text-[11px] font-mono text-gray-300 leading-tight">
              Tox screen confirms synthetic peptide toxin. Dispatch radio logs were doctored between 01:50 - 02:20 AM.
            </p>
            {/* Fingerprint clue */}
            <div className="mt-2 flex items-center justify-between text-[9px] font-mono text-gray-400 pt-2 border-t border-gray-800/80">
              <span>LATENT PRINT: MATCH #88</span>
              <span className="text-amber-400 font-bold">BLOOD SPATTER +</span>
            </div>
          </motion.div>

          {/* Object 2: Torn Handwritten Notebook Note (Left-Center) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            onMouseEnter={() => handleClueHover('note')}
            className="hidden md:block absolute top-[52%] left-[10%] max-w-[190px] p-3 bg-[#e8dfc8] text-[#1a1814] rounded shadow-2xl rotate-[-4deg] font-serif border border-amber-900/30"
          >
            <div className="text-[9px] font-mono font-bold uppercase tracking-wider text-red-800 border-b border-amber-900/20 pb-1 mb-1">
              • Field Log Notes
            </div>
            <p className="text-[11px] leading-tight italic font-semibold">
              "Never trust the primary suspect. Look into the database backups before the evidence vanishes..."
            </p>
            <div className="text-[8px] font-mono text-gray-600 mt-2 text-right">
              02:15 AM • ARCHIVE
            </div>
          </motion.div>

          {/* Object 3: The Magnifying Glass (Resting on table or picked up) */}
          {!hasMagnifier && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              onClick={handlePickupMagnifier}
              className="absolute top-[58%] right-[14%] sm:right-[18%] z-30 cursor-pointer group flex flex-col items-center"
              title="Click to pick up Magnifying Glass"
            >
              {/* Pulsing glow aura */}
              <div className="absolute -inset-3 rounded-full bg-amber-500/20 blur-md group-hover:bg-amber-400/40 transition-all animate-pulse" />
              
              {/* Magnifying Glass SVG Illustration */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center p-2 rounded-full border-2 border-[#d4af37] bg-[#141419]/90 shadow-2xl group-hover:scale-110 group-hover:border-amber-400 transition-all duration-300">
                <Search className="w-8 h-8 sm:w-10 sm:h-10 text-[#d4af37] group-hover:text-amber-300 transition-colors drop-shadow" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                </span>
              </div>

              <span className="mt-2 px-2.5 py-1 rounded bg-[#0a0a0c]/90 border border-[#d4af37]/60 text-[10px] sm:text-[11px] font-mono font-bold text-[#d4af37] group-hover:text-white transition-colors tracking-wider whitespace-nowrap shadow-lg">
                CLICK TO SEARCH DETAILS
              </span>
            </motion.div>
          )}

          {/* Active Magnifying Glass Status Bar when held */}
          {hasMagnifier && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-auto bg-[#0a0a0c]/90 border border-[#d4af37]/50 px-4 py-1.5 rounded-full backdrop-blur-md shadow-2xl flex items-center gap-3 text-xs font-mono text-[#d4af37]">
              <Search className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span className="font-bold">MAGNIFYING GLASS ACTIVE — MOVE OVER SCREEN TO INSPECT</span>
              <button
                onClick={() => setHasMagnifier(false)}
                className="bg-[#262633] hover:bg-[#d4af37] text-white hover:text-black px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors"
              >
                Put Down
              </button>
            </div>
          )}

          {/* ----------------------------------------------------------- */}
          {/* THE SMALL RED BUTTON (BOTTOM RIGHT CORNER FOR ALL SCREENS) */}
          {/* ----------------------------------------------------------- */}
          <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 pointer-events-auto">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col items-center"
            >
              {/* Industrial Warning Label Above Button */}
              <div className="mb-2 px-2 py-0.5 rounded bg-black/80 border border-red-500/50 text-[9px] sm:text-[10px] font-mono font-bold tracking-widest text-red-400 uppercase flex items-center gap-1 shadow-md">
                <AlertTriangle className="w-3 h-3 text-red-500" />
                <span>BREACH PROTOCOL</span>
              </div>

              {/* The Industrial Red Push Button */}
              <div className="relative group p-2 rounded-2xl bg-gradient-to-b from-[#2a2a35] to-[#121217] border-2 border-red-900/60 shadow-2xl">
                {/* Outer hazard rim */}
                <div className="absolute inset-0 rounded-2xl border border-yellow-500/20 pointer-events-none" />

                {/* Red Push Button Cap */}
                <button
                  onClick={handleRedButtonClick}
                  disabled={isExiting}
                  className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-b from-red-500 via-red-600 to-red-800 border-4 border-red-950 shadow-[0_6px_0_#4a0d0d,0_12px_24px_rgba(220,38,38,0.5)] active:translate-y-1 active:shadow-[0_2px_0_#4a0d0d,0_4px_12px_rgba(220,38,38,0.6)] hover:brightness-110 transition-all flex flex-col items-center justify-center text-white"
                  title="Press to Enter Room"
                >
                  {/* Glossy Button Highlight */}
                  <div className="absolute top-1 left-2 right-2 h-4 rounded-full bg-white/30 blur-[1px]" />
                  
                  {/* Central Power/Breach Icon */}
                  <Radio className="w-5 h-5 sm:w-6 sm:h-6 text-white drop-shadow animate-pulse" />
                  <span className="text-[8px] sm:text-[9px] font-mono font-black uppercase tracking-tighter text-red-100">
                    ENTER
                  </span>
                </button>
              </div>

              <span className="mt-1.5 text-[9px] sm:text-[10px] font-mono text-gray-400 tracking-wider uppercase font-bold text-center">
                PRESS TO ENTER
              </span>
            </motion.div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------- */}
      {/* 3. THE CENTER HANGING LIGHT BULB & PULL CORD MECHANIC */}
      {/* ----------------------------------------------------------- */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-none"
        style={{ width: '120px' }}
      >
        {/* Electrical ceiling wire dropping down to center */}
        <div 
          className="w-[3px] bg-gradient-to-b from-black via-[#1c1c24] to-[#2b2b36] shadow-md transition-all duration-150"
          style={{ height: '32vh' }}
        />

        {/* Vintage Brass Lamp Socket Fixture */}
        <div className="relative w-7 h-8 bg-gradient-to-b from-[#7d6023] via-[#b38e3a] to-[#594212] rounded-t-sm shadow-lg border border-[#3b2d10]">
          <div className="w-full h-1 bg-[#2b200b] mt-1" />
          <div className="w-full h-1 bg-[#2b200b] mt-2" />
        </div>

        {/* The Edison Incandescent Glass Light Bulb */}
        <div className="relative flex flex-col items-center -mt-0.5">
          {/* Glowing Radial Halo when light is ON */}
          {isLightOn && (
            <div className="absolute -inset-10 rounded-full bg-amber-400/40 blur-2xl animate-pulse pointer-events-none" />
          )}

          {/* Bulb Glass Body */}
          <div 
            className={`relative w-12 h-14 rounded-b-full rounded-t-md border transition-all duration-300 flex items-center justify-center ${
              isLightOn 
                ? 'bg-amber-100/90 border-amber-300 shadow-[0_0_50px_rgba(255,220,100,0.9),0_0_100px_rgba(255,180,50,0.6)]' 
                : 'bg-black/60 border-[#383842] shadow-inner'
            }`}
          >
            {/* Glass reflection streak */}
            <div className="absolute top-2 left-2 w-1.5 h-6 rounded-full bg-white/40 rotate-12 blur-[0.5px]" />

            {/* Glowing Filament Wire */}
            <div 
              className={`w-4 h-6 border-2 transition-all duration-200 rounded-sm ${
                isLightOn 
                  ? 'border-yellow-200 bg-yellow-300 shadow-[0_0_12px_#fff,0_0_20px_#f59e0b]' 
                  : 'border-[#2d271e] opacity-40'
              }`}
            />
          </div>
        </div>

        {/* --------------------------------------------------------- */}
        {/* THE PULL CORD / CHAIN SWITCH */}
        {/* --------------------------------------------------------- */}
        <div 
          className="relative pointer-events-auto flex flex-col items-center cursor-pointer select-none py-2 px-6"
          style={{
            transform: `translateY(${cordY}px)`,
            transition: isPulling ? 'none' : 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
          onClick={() => {
            if (!isLightOn) {
              triggerLightSwitch();
            }
          }}
          onMouseDown={handleCordMouseDown}
          onMouseMove={handleCordMouseMove}
          onMouseUp={handleCordEnd}
          onTouchStart={handleCordMouseDown}
          onTouchMove={handleCordMouseMove}
          onTouchEnd={handleCordEnd}
          onMouseEnter={(e) => {
            setIsHoveringCord(true);
            pullStartY.current = e.clientY;
          }}
          onMouseLeave={handleCordEnd}
          title={isLightOn ? "Light Switch (ON)" : "Slide down or click to turn light ON"}
        >
          {/* Metallic beaded chain links */}
          <div className="flex flex-col items-center gap-[3px] py-1">
            {Array.from({ length: 14 }).map((_, i) => (
              <div 
                key={i}
                className={`w-1.5 h-1.5 rounded-full shadow-sm transition-colors duration-200 ${
                  isLightOn 
                    ? 'bg-gradient-to-b from-[#d4af37] to-[#8c6d1f]' 
                    : 'bg-gradient-to-b from-[#6b6255] to-[#3a352d]'
                }`}
              />
            ))}
          </div>

          {/* Hanging Bell / Acorn Pull Handle */}
          <div 
            className={`relative w-4 h-6 rounded-b-full rounded-t-sm border shadow-lg transition-transform hover:scale-110 flex items-center justify-center ${
              isLightOn
                ? 'bg-gradient-to-b from-[#ecd078] to-[#997321] border-[#d4af37]'
                : 'bg-gradient-to-b from-[#695d4e] to-[#26211a] border-[#554b3e]'
            }`}
          >
            {/* Subtle specular sheen */}
            <div className="w-1 h-3 rounded bg-white/40 mb-1" />
          </div>

          {/* Helpful callout before light is turned on */}
          {!isLightOn && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: [0.6, 1, 0.6], y: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 2.2 }}
              className="mt-3 px-3 py-1 rounded-full bg-[#141419]/90 border border-amber-500/40 text-[10px] sm:text-xs font-mono font-bold text-amber-300 whitespace-nowrap shadow-xl"
            >
              ↕ SLIDE DOWN TO TURN ON
            </motion.div>
          )}
        </div>
      </div>

      {/* ----------------------------------------------------------- */}
      {/* 4. DYNAMIC MAGNIFYING GLASS CURSOR / LENS EFFECT */}
      {/* ----------------------------------------------------------- */}
      {hasMagnifier && (
        <div
          className="fixed pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${mousePos.x}px`,
            top: `${mousePos.y}px`,
          }}
        >
          {/* Glass Lens Frame */}
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full border-4 border-[#d4af37] bg-amber-400/10 backdrop-brightness-125 backdrop-contrast-125 shadow-[0_0_30px_rgba(212,175,55,0.4),inset_0_0_20px_rgba(255,255,255,0.3)] overflow-hidden flex items-center justify-center">
            {/* Lens Reflection Glare */}
            <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-white/20 blur-md pointer-events-none" />
            
            {/* Tactical Crosshair Reticle */}
            <div className="absolute inset-0 flex items-center justify-center opacity-30">
              <div className="w-full h-[1px] bg-red-400" />
              <div className="h-full w-[1px] bg-red-400" />
            </div>

            {/* Micro forensic magnification text indicator */}
            <span className="absolute bottom-2 text-[8px] font-mono font-bold tracking-widest text-[#d4af37] bg-black/60 px-1.5 py-0.5 rounded">
              UV 1.6X ZOOM
            </span>
          </div>

          {/* Wooden / Brass Handle sticking out bottom-right */}
          <div 
            className="w-4 h-16 bg-gradient-to-b from-[#6b4c1b] via-[#452e0d] to-[#1e1303] rounded-b border border-[#8a6829] shadow-2xl absolute -bottom-12 -right-4 rotate-[-45deg] origin-top-left"
          />
        </div>
      )}

      {/* ----------------------------------------------------------- */}
      {/* 5. THE ADDON: INSTRUCTIONS & SARCASM IN DEAD CENTRE */}
      {/* ----------------------------------------------------------- */}
      <AnimatePresence mode="wait">
        {currentHintText && (
          <motion.div
            key={currentHintText}
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05, y: -15 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center p-4 sm:p-6"
          >
            {/* Atmospheric Backdrop Blur behind Center Text */}
            <div className="max-w-4xl w-full px-6 py-6 sm:py-8 rounded-2xl bg-black/75 border border-red-900/60 shadow-[0_0_50px_rgba(0,0,0,0.9),0_0_30px_rgba(185,28,28,0.3)] backdrop-blur-md text-center">
              {/* Handler Callout Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 mb-3 rounded-full bg-red-950/80 border border-red-500/50 text-[10px] sm:text-xs font-mono font-bold tracking-widest text-red-400 uppercase">
                <Radio className="w-3 h-3 text-red-500 animate-ping" />
                <span>TASK FORCE DISPATCH // SUTRADHAR COMM</span>
              </div>

              {/* Dead Centre Responsive Instruction / Insult Text */}
              <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black font-mono tracking-wider sm:tracking-widest text-red-500 uppercase drop-shadow-[0_0_20px_rgba(239,68,68,0.85)] leading-tight">
                {currentHintText}
              </h2>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ----------------------------------------------------------- */}
      {/* 6. CINEMATIC BREACH TRANSITION FLASH WHEN EXITING */}
      {/* ----------------------------------------------------------- */}
      {isExiting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.4, 0.1, 0.9, 1] }}
          transition={{ duration: 3.4, times: [0, 0.2, 0.5, 0.85, 1] }}
          className="fixed inset-0 z-[60] bg-black pointer-events-none"
        />
      )}
    </div>
  );
}
