import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Search } from 'lucide-react';
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
          background: `radial-gradient(circle 680px at 50% 34%, rgba(195, 155, 65, 0.18) 0%, rgba(18, 14, 9, 0.8) 50%, #020203 78%)`,
        }}
      >
        {/* Soft, dim vertical light cone */}
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[650px] h-full opacity-60"
          style={{
            background: 'conic-gradient(from 180deg at 50% 30%, transparent 75deg, rgba(255, 220, 130, 0.05) 86deg, rgba(255, 210, 110, 0.09) 90deg, rgba(255, 220, 130, 0.05) 94deg, transparent 105deg)',
            filter: 'blur(16px)',
          }}
        />

        {/* Faint subtle dust particles */}
        <div className="absolute inset-0 opacity-25">
          <div className="absolute w-1.5 h-1.5 rounded-full bg-amber-200/40 blur-[1px] top-[38%] left-[49%] animate-pulse" />
          <div className="absolute w-1 h-1 rounded-full bg-amber-300/30 blur-[1px] top-[44%] left-[52%] animate-ping" style={{ animationDuration: '5s' }} />
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. THE MYSTERY SCENE & OBJECTS */}
      {/* ------------------------------------------------------------- */}
      {isLightOn && (
        <div className="absolute inset-0 z-10 pointer-events-auto">

          {/* Minimalist Audio Toggle in extreme top-left corner */}
          <button
            onClick={handleToggleMute}
            className="absolute top-6 left-6 z-30 p-2 text-neutral-600 hover:text-neutral-300 transition-colors"
            title="Toggle Sound Effects"
          >
            {muted ? <VolumeX className="w-4 h-4 text-neutral-600" /> : <Volume2 className="w-4 h-4 text-[#8c7b58]" />}
          </button>

          {/* TOP RIGHT: Shadowy Confidential Dossier */}
          <div
            onMouseEnter={handleTopRightInspect}
            className="absolute top-8 right-8 sm:top-10 sm:right-12 z-20 cursor-crosshair group"
          >
            {/* Dark dossier envelope silhouette pinned to the wall */}
            <div 
              className={`p-3.5 sm:p-4 rounded border transition-all duration-700 max-w-[220px] sm:max-w-[260px] ${
                hasInspectedTopRight
                  ? 'bg-[#0e0d0c] border-[#8c7b58]/50 shadow-[0_0_20px_rgba(140,123,88,0.2)]'
                  : 'bg-[#070708]/90 border-neutral-900/80 shadow-md opacity-40 group-hover:opacity-70'
              }`}
            >
              {/* Pinned thumbtack mark */}
              <div className="w-2 h-2 rounded-full bg-red-900 mx-auto -mt-2 mb-2 shadow" />

              <div className="text-[10px] font-mono tracking-widest text-[#7a6a4a] uppercase font-bold border-b border-neutral-800 pb-1 mb-1.5">
                DOSSIER // 09
              </div>

              {/* Secret Details only illuminated clearly through magnifier */}
              <p className="text-[11px] font-mono text-neutral-400 leading-snug">
                {hasMagnifier || hasInspectedTopRight ? (
                  <span className="text-[#c7a760] font-bold">
                    "SUTRADHAR CELL CONFIRMED — CIPHER 884-VX"
                  </span>
                ) : (
                  <span className="blur-[1.5px] text-neutral-600">
                    [CLASSIFIED INTEL - REQUIRES MAGNIFIER]
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* DEAD-CENTER ILLUMINATED EMBLEM: PROJECT VRITARA */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pt-28 sm:pt-32 pointer-events-none px-4 text-center">
            {/* Dark Antique Title */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.2 }}
              className="space-y-2 pointer-events-auto"
            >
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-serif tracking-[0.16em] text-[#8c7b58] drop-shadow-[0_2px_18px_rgba(0,0,0,0.95)]">
                PROJECT VRITARA
              </h1>

              {/* Tagline: Subtle, moody italic serif */}
              <p className="text-xs sm:text-sm md:text-base font-serif italic text-[#6e6044] tracking-[0.25em] uppercase font-medium">
                “Things aren’t always what they seem”
              </p>
            </motion.div>
          </div>

          {/* SUBTLE MYSTERY OBJECTS ON THE TABLE (Dark shadows, no bright cards) */}
          
          {/* Shadow Object: Faint Evidence Marker #18 on the left */}
          <div className="hidden sm:block absolute bottom-12 left-12 p-3 opacity-30 pointer-events-none">
            <div className="w-8 h-10 border border-amber-900/40 rounded-t flex items-center justify-center text-[10px] font-mono text-[#7a6a4a]">
              #18
            </div>
          </div>

          {/* Shadow Object: Vintage Cassette Reel Silhouette */}
          <div className="hidden md:block absolute top-[52%] left-[14%] w-16 h-10 rounded border border-neutral-900 bg-neutral-950/60 opacity-30 pointer-events-none flex items-center justify-around px-2">
            <div className="w-4 h-4 rounded-full border border-neutral-800" />
            <div className="w-4 h-4 rounded-full border border-neutral-800" />
          </div>

          {/* THE MAGNIFYING GLASS (Resting naturally in the shadows on the desk) */}
          {!hasMagnifier && (
            <div
              onClick={handlePickupMagnifier}
              className="absolute top-[62%] right-[22%] sm:right-[26%] z-20 cursor-pointer group flex flex-col items-center"
              title="Pick up Magnifying Glass"
            >
              {/* Subtle ambient glint */}
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-[#8c7b58]/80 bg-[#0d0c0a]/90 flex items-center justify-center shadow-[0_0_15px_rgba(140,123,88,0.25)] group-hover:scale-105 group-hover:border-[#c7a760] transition-transform duration-300">
                <Search className="w-7 h-7 sm:w-8 sm:h-8 text-[#8c7b58] group-hover:text-[#c7a760] transition-colors" />
                {/* Gentle glint dot */}
                <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-amber-400/60 animate-ping" />
              </div>
            </div>
          )}

          {/* THE SMALL RED BUTTON (Bottom Right Corner for all screens) */}
          <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-30 pointer-events-auto">
            <div className="relative flex flex-col items-center">
              {/* Tactile small dark-housed red industrial push button */}
              <button
                onClick={handleRedButtonClick}
                disabled={stage === 'EXITING'}
                className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-b from-red-600 via-red-700 to-red-950 border-2 border-red-950 shadow-[0_4px_0_#380808,0_6px_16px_rgba(180,20,20,0.4)] active:translate-y-1 active:shadow-[0_1px_0_#380808] hover:brightness-110 transition-all flex items-center justify-center group"
                title="Enter Room"
              >
                {/* Subtle specular glint */}
                <div className="absolute top-1 left-2 right-2 h-3 rounded-full bg-white/20 blur-[0.5px]" />
                
                {/* Central glowing indicator core */}
                <div className="w-2.5 h-2.5 rounded-full bg-red-400 group-hover:bg-red-300 shadow-[0_0_8px_#ef4444] animate-pulse" />
              </button>
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
          <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-full border-2 border-[#8c7b58] bg-amber-400/5 backdrop-brightness-125 shadow-[0_0_25px_rgba(140,123,88,0.3),inset_0_0_15px_rgba(255,255,255,0.15)] flex items-center justify-center">
            {/* Fine crosshairs */}
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <div className="w-full h-[1px] bg-[#8c7b58]" />
              <div className="h-full w-[1px] bg-[#8c7b58]" />
            </div>
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
            <div className="max-w-4xl px-8 py-6 rounded-2xl bg-black/60 backdrop-blur-[2px]">
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
