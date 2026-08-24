import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayer } from '../context/PlayerContext';
import { 
  Scroll, Shield, Network, Eye, Skull, Crown, BookOpen, ChevronRight, Zap, Database, 
  Users, CheckCircle2, Lock, FileText, Search, Microscope, History, AlertTriangle, X,
  Radio, Award, Medal, ChevronDown, ChevronUp, Link as LinkIcon, ArrowRight, Play
} from 'lucide-react';

export default function LoreIntelView({ defaultSection = 'storyline', onNavigate }) {
  const { db, player, isCaseUnlocked } = usePlayer();
  const [activeSection, setActiveSection] = useState(defaultSection);

  // Single-Active Card Expansion State Algorithm: ONLY ONE CARD EXPANDED AT A TIME
  const [activeCardId, setActiveCardId] = useState(null);

  // Escape key listener to close active expanded card
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveCardId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleCard = (id) => {
    setActiveCardId(prev => (prev === id ? null : id));
  };

  // 1. Navigation Rail Sections
  const navSections = [
    { id: 'storyline', label: '01 STORYLINE', icon: History },
    { id: 'background', label: '02 BACKGROUND', icon: Scroll },
    { id: 'taskforce', label: '03 TASK FORCE', icon: Users },
    { id: 'cases', label: '04 CASE CHRONICLE', icon: FileText },
    { id: 'shadows', label: '05 SEVEN SHADOWS', icon: Eye },
    { id: 'maya', label: '06 MAYA PROTOCOL', icon: Database },
    { id: 'vritra', label: '07 PROJECT VRITRA', icon: Crown },
  ];

  // 2. Background Section Small Cards Data
  const backgroundItems = [
    {
      id: 'bg-vritra',
      tag: '01',
      title: 'VRITRA',
      classification: 'CLASSIFIED // CODENAME',
      label: 'RESTRICTED',
      summary: 'An obstacle blocking the natural flow of life.',
      fullText: 'In ancient Indian mythology, Vritra represents an obstacle that prevents the natural flow of life. Within Project Vritra, it is NOT a person—it is the codename for a long-running conspiracy that blocks truth, manipulates information, and protects those in power.',
      connectedTo: ['Nagabhavan Estate', 'Saptarishi Research Labs', 'Ninth Realm Bunker']
    },
    {
      id: 'bg-mandala',
      tag: '02',
      title: 'NINTH MANDALA',
      classification: 'HIGH PRIORITY // SECRET SOCIETY',
      label: 'EYES ONLY',
      summary: 'Covert organization operating through financial & political influence.',
      fullText: 'The Ninth Mandala is one of the oldest hidden organizations in the Project Vritra universe. Its members operate through financial influence, political manipulation, historical revision, and corporate fronts without public exposure.',
      connectedTo: ['Swiss Offshore Accounts', 'Judicial Warrants', 'Oracle AI Labs']
    },
    {
      id: 'bg-naga',
      tag: '03',
      title: 'NAGA EMBLEM',
      classification: 'FORENSIC LINK // RECURRING EMBLEM',
      label: 'FIELD REPORT',
      summary: 'A 7-headed serpent carved at crime scenes.',
      fullText: 'A carved 7-headed serpent emblem found at Nagabhavan Estate, Rudra Peeth Monastery, and offshore bank vaults. The emblem acts as an investigative link marking victims targeted by the shadow network.',
      connectedTo: ['Nagabhavan Study', 'Rudra Peeth Monastery', 'Offshore Vaults']
    },
    {
      id: 'bg-somalatha',
      tag: '04',
      title: 'SOMALATHA',
      classification: 'BIO-TOXIN // TOXICOLOGY REPORT',
      label: 'HIGH PRIORITY',
      summary: 'Undetectable synthetic neuro-toxin inducing cardiac arrest.',
      fullText: 'An undetectable synthetic neuro-toxin derived from ancient Ayurvedic botanical formulas. It induces cardiac arrest without leaving standard autopsy markers, used in homicides across Acts I and II.',
      connectedTo: ['Acharya Devendra Mishra', 'Nagabhavan Glassware', 'Saptarishi Bio-Tech']
    },
    {
      id: 'bg-manuscripts',
      tag: '05',
      title: 'TEMPLE MANUSCRIPTS',
      classification: 'HISTORICAL CIPHER // ARCHIVE',
      label: 'VERIFIED',
      summary: 'Ancient palm-leaf folios containing mathematical ciphers.',
      fullText: 'Centuries-old palm-leaf folios decoded by Professor Vedika Rao containing mathematical ciphers used to encrypt Project Vritra database files.',
      connectedTo: ['Rudra Peeth Monastery', 'Professor Vedika Rao Archive']
    },
    {
      id: 'bg-project',
      tag: '06',
      title: 'PROJECT VRITRA',
      classification: 'MASTER ARCHIVE // CONSPIRACY',
      label: 'CASE LINKED',
      summary: 'The 20-year systematic information manipulation agenda.',
      fullText: 'The master architecture orchestrating 18 homicides, evidence fabrication, and public record erasures across India.',
      connectedTo: ['Cases 1 through 18', 'Dr. Vedant Kashyap']
    }
  ];

  // 3. Task Force Canonical Personnel Data (docs/canon/03_CHARACTERS.md)
  const taskForcePersonnel = [
    {
      id: 'tf-prasoon',
      name: 'Prasoon Pathak',
      role: 'Lead Investigator',
      badge: 'PROTAGONIST',
      classification: 'CLEARANCE LEVEL 5',
      summary: 'Central protagonist leading the investigation.',
      intelligence: 'Prasoon is the central protagonist of the Task Force. Calm under pressure and highly observant, he connects seemingly isolated homicides to reveal systemic patterns. The player experiences every case through his perspective.',
      expertise: ['Pattern Recognition', 'Logical Deduction', 'Investigation Planning'],
      cases: 'Cases 0 through 18 (Lead Investigator)'
    },
    {
      id: 'tf-rudransh',
      name: 'ACP Rudransh Pathak',
      role: 'Police Liaison',
      badge: 'COMMAND',
      classification: 'OFFICIAL AUTHORITY',
      summary: 'Senior police commander providing legal warrants & police support.',
      intelligence: 'Senior officer bridging the Task Force with law enforcement. Disciplined and experienced, ACP Rudransh provides legal authority, search warrants, and paramilitary support when raiding Ninth Mandala facilities.',
      expertise: ['Police Operations', 'Legal Warrants', 'Tactical Coordination'],
      cases: 'Cases 1, 4, 6, 8, 10, 11, 17, 18'
    },
    {
      id: 'tf-gowrav',
      name: 'Gowrav Dubey',
      role: 'Digital Forensics Specialist',
      badge: 'CYBER',
      classification: 'DATA SECURITY',
      summary: 'Methodical cyber analyst responsible for SQL database extraction.',
      intelligence: 'Methodical cyber analyst responsible for device recovery, CCTV frame analysis, and database record extraction. Gowrav uncovers digital evidence rows that reveal when records have been tampered with.',
      expertise: ['SQL Querying', 'Digital Forensics', 'Cyber Security'],
      cases: 'Cases 0, 2, 5, 6, 8, 9, 12, 14, 18'
    },
    {
      id: 'tf-harsh',
      name: 'Harsh Shukla',
      role: 'Field Investigator',
      badge: 'FIELD',
      classification: 'TACTICAL',
      summary: 'Courageous investigator gathering physical crime scene evidence.',
      intelligence: 'Courageous field investigator who secures physical crime scenes, gathers toxicological samples, interviews reluctant witnesses, and collects physical evidence that becomes database records.',
      expertise: ['Crime Scene Search', 'Evidence Gathering', 'Surveillance'],
      cases: 'Cases 1, 3, 5, 7, 9, 13, 17'
    },
    {
      id: 'tf-tammana',
      name: 'Tammana Tiwari',
      role: 'Behavioral Analyst',
      badge: 'PROFILER',
      classification: 'PSYCHOLOGY',
      summary: 'Insightful criminal psychologist analyzing suspect motives & alibis.',
      intelligence: 'Insightful criminal psychologist who analyzes suspect behavior, interrogates suspects, and determines *why* crimes occurred rather than merely *how*. She uncovers hidden motives behind Somalatha poisonings.',
      expertise: ['Behavioral Profiling', 'Interrogation Support', 'Motive Analysis'],
      cases: 'Cases 1, 3, 5, 8, 10, 15, 18'
    },
    {
      id: 'tf-amisha',
      name: 'Amisha Singh',
      role: 'Investigative Journalist',
      badge: 'INTEL',
      classification: 'MEDIA ARCHIVE',
      summary: 'Independent researcher uncovering public records & offshore accounts.',
      intelligence: 'Fearless independent journalist who uncovers historical archives, corporate registry records, and offshore transaction trails that fall outside official police channels.',
      expertise: ['Archive Research', 'Corporate Registries', 'Open-source Intel'],
      cases: 'Cases 1, 5, 6, 8, 12, 13, 17, 18'
    },
    {
      id: 'tf-vedika',
      name: 'Professor Vedika Rao',
      role: 'Ancient Manuscript Expert',
      badge: 'SCHOLAR',
      classification: 'HISTORY',
      summary: 'Manuscript scholar decoding Sanskrit ciphers and palm-leaf folios.',
      intelligence: 'Scholarly manuscript expert specializing in ancient Indian history, Sanskrit ciphers, and temple palm-leaf folios. She decodes the Naga serpent symbolism and historical texts predating Project Vritra.',
      expertise: ['Ancient Indian History', 'Sanskrit Ciphers', 'Symbolic Analysis'],
      cases: 'Cases 2, 4, 7, 8, 15, 16, 17, 18'
    }
  ];

  // 4. The Seven Shadows Council Data
  const sevenShadows = [
    { id: 'sh-sutradhar', name: 'Dr. Vedant Kashyap', title: 'The Sutradhar', role: 'Mastermind & Oracle AI Architect', status: 'Primary Target (Case 18)', domain: 'Information Control & Master Plan' },
    { id: 'sh-one', name: 'General Vikram Ranawat', title: 'Shadow One', role: 'Military Defense & Paramilitary Arms', status: 'Indicted (Case 11)', domain: 'Armed Operations & Defense' },
    { id: 'sh-two', name: 'Devika Oberoi', title: 'Shadow Two', role: 'Global FinTech & Offshore Banking', status: 'Indicted (Case 9)', domain: 'Swiss Shell Banking Network' },
    { id: 'sh-three', name: 'Dr. Ananya Sen', title: 'Shadow Three', role: 'Synthetic Bio-Genetics & Somalatha Toxins', status: 'Indicted (Case 2)', domain: 'Botanical Poison Research' },
    { id: 'sh-four', name: 'Rohan Varma', title: 'Shadow Four', role: 'Media Manipulation & Maya Protocol AI', status: 'Indicted (Case 12)', domain: 'Media Control & Deepfake AI' },
    { id: 'sh-five', name: 'Justice K. M. Shastri', title: 'Shadow Five', role: 'Judicial Surveillance & Identity Eradication', status: 'Indicted (Case 10)', domain: 'Judicial Interference & Warrants' },
    { id: 'sh-six', name: 'Harshwardhan Rathore', title: 'Shadow Six', role: 'Political Engineering & Crimson Yagna', status: 'Indicted (Case 13)', domain: 'Political Manipulation & Crises' }
  ];

  const canonicalCases = db?.game_cases || [];

  return (
    <div className="max-w-[1440px] mx-auto px-4 py-8 space-y-10 selection:bg-[#d4af37]/30 selection:text-[#d4af37]">
      {/* Top Classification Header */}
      <div className="bg-[#141419] border border-[#262633] rounded-lg p-6 space-y-4 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#262633] pb-4">
          <div>
            <span className="text-[10px] font-mono font-bold text-red-500 bg-red-950/60 border border-red-500/40 px-3 py-1 rounded inline-flex items-center gap-1.5 uppercase tracking-widest">
              CLASSIFIED // VRITRA INVESTIGATION ARCHIVE
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#e0e0e0] font-serif glow-text mt-1">
              THE STORY BEHIND THE INVESTIGATION
            </h1>
            <p className="text-xs text-[#8a8a9e]">
              "Before you investigate the cases, understand the world they belong to."
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-[10px] font-mono">
            <div className="bg-[#0a0a0c] border border-[#262633] px-3 py-1 rounded">
              <span className="text-[#8a8a9e] block">CLASSIFICATION</span>
              <span className="text-red-400 font-bold">RESTRICTED</span>
            </div>
            <div className="bg-[#0a0a0c] border border-[#262633] px-3 py-1 rounded">
              <span className="text-[#8a8a9e] block">ARCHIVE STATUS</span>
              <span className="text-emerald-400 font-bold">ACTIVE</span>
            </div>
            <div className="bg-[#0a0a0c] border border-[#262633] px-3 py-1 rounded">
              <span className="text-[#8a8a9e] block">DOCUMENTED</span>
              <span className="text-[#d4af37] font-bold">18 CASES</span>
            </div>
            <div className="bg-[#0a0a0c] border border-[#262633] px-3 py-1 rounded">
              <span className="text-[#8a8a9e] block">ESC KEY</span>
              <span className="text-amber-400 font-bold">CLOSE DOSSIER</span>
            </div>
          </div>
        </div>

        {/* Horizontal Cinematic Navigation Rail */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {navSections.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => {
                  setActiveSection(sec.id);
                  setActiveCardId(null);
                }}
                className={`relative flex items-center gap-2 px-4 py-2 rounded text-xs font-mono font-bold uppercase transition-all whitespace-nowrap ${
                  isActive
                    ? 'text-[#d4af37] bg-[#d4af37]/10 border border-[#d4af37]/40 shadow-lg shadow-yellow-950/40'
                    : 'text-[#8a8a9e] hover:text-[#e0e0e0] bg-[#0a0a0c] border border-[#262633]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{sec.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeRailIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d4af37]"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 01 — STORYLINE */}
      {activeSection === 'storyline' && (
        <div className="space-y-12 animate-in fade-in duration-300">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-mono font-bold text-[#d4af37]">SECTION 01 • STORYLINE</span>
            <h2 className="text-3xl font-extrabold text-[#e0e0e0] font-serif">THE STORY</h2>
            <p className="text-sm text-[#8a8a9e] leading-relaxed font-serif italic">
              "The investigation begins with a murder. The murder leads to a pattern. The pattern leads to a system. The system leads to an architect."
            </p>
          </div>

          {/* Sequential Story Markers */}
          <div className="space-y-6 relative border-l-2 border-[#262633] pl-6 ml-4">
            {[
              { num: "01", label: "THE FIRST SIGN", desc: "A locked study at Nagabhavan Estate. Industrialist Vikramaditya Nagabhavan found dead. Synthetic Somalatha poison residues on glassware and an ancient 7-headed Naga emblem carved into the desk." },
              { num: "02", label: "THE PATTERN", desc: "Similar deaths occur across Rudra Peeth Monastery and research symposiums. Identical poison markers and ancient Sanskrit ciphers confirm these are not isolated homicides." },
              { num: "03", label: "THE CONSPIRACY", desc: "Cross-referencing database financial ledgers uncovers 12 offshore Swiss accounts transferring wire payments to Saptarishi bio-tech labs as key witnesses vanish." },
              { num: "04", label: "THE SYSTEM", desc: "The Task Force exposes 'The Seven Shadows' and uncovers the Maya Protocol—an artificial intelligence engine that injects synthetic evidence rows into police databases." },
              { num: "05", label: "THE ARCHITECT", desc: "Prasoon Task Force raids the Ninth Realm command bunker in New Delhi to indict Dr. Vedant Kashyap ('The Sutradhar') and dismantle Project Vritra." }
            ].map((marker, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative bg-[#141419] border border-[#262633] p-6 rounded-r-lg space-y-2 shadow-xl"
              >
                <div className="absolute -left-[31px] top-6 w-3 h-3 rounded-full bg-[#d4af37] border-2 border-[#070709]" />
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#d4af37]">
                  <span>MARKER {marker.num}</span>
                  <span>•</span>
                  <span>{marker.label}</span>
                </div>
                <p className="text-xs sm:text-sm text-[#e0e0e0] leading-relaxed">{marker.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 02 — BACKGROUND (SMALL SQUARE INTELLIGENCE CARD GRID WITH SINGLE-ACTIVE EXPANSION) */}
      {activeSection === 'background' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-[#d4af37]">SECTION 02 • BACKGROUND</span>
            <h2 className="text-2xl font-bold text-[#e0e0e0] font-serif">THE WORLD OF PROJECT VRITRA</h2>
            <p className="text-xs text-[#8a8a9e]">Click any small intelligence card to expand its classified file. Only one card expands at a time.</p>
          </div>

          {/* Small Square Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {backgroundItems.map((item) => {
              const isExpanded = activeCardId === item.id;
              return (
                <motion.div
                  key={item.id}
                  layout
                  onClick={() => toggleCard(item.id)}
                  className={`cursor-pointer border rounded-lg p-4 transition-all ${
                    isExpanded
                      ? 'col-span-2 sm:col-span-3 md:col-span-6 bg-[#141419] border-[#d4af37] shadow-2xl ring-1 ring-[#d4af37]/50'
                      : 'bg-[#0a0a0c] border-[#262633] hover:border-[#d4af37]/50 hover:bg-[#141419] hover:scale-[1.02]'
                  }`}
                >
                  {isExpanded ? (
                    <motion.div layout className="space-y-4 font-sans">
                      <div className="flex justify-between items-start border-b border-[#262633] pb-3">
                        <div>
                          <span className="text-[10px] font-mono font-bold text-[#d4af37] block">{item.classification}</span>
                          <h3 className="text-lg font-bold text-[#e0e0e0] font-serif">{item.title}</h3>
                        </div>
                        <span className="text-[10px] font-mono text-[#8a8a9e] border border-[#262633] px-2 py-1 rounded">
                          PRESS ESC TO CLOSE
                        </span>
                      </div>
                      <p className="text-xs text-[#e0e0e0] leading-relaxed">{item.fullText}</p>
                      <div className="bg-[#0a0a0c] border border-[#262633] p-3 rounded space-y-1 font-mono text-xs">
                        <span className="text-[#d4af37] font-bold block">CONNECTED LOCATIONS / ENTITIES:</span>
                        <div className="flex flex-wrap gap-2 text-[11px] text-[#8a8a9e] pt-1">
                          {item.connectedTo.map((c, i) => (
                            <span key={i} className="bg-[#141419] border border-[#262633] px-2 py-0.5 rounded text-[#e0e0e0]">
                              • {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div layout className="flex flex-col justify-between h-[150px] space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-mono text-[#d4af37]">
                        <span>{item.tag}</span>
                        <span className="bg-red-950/60 text-red-400 border border-red-500/30 px-1.5 py-0.5 rounded text-[9px] font-bold">
                          {item.label}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#e0e0e0] font-serif truncate">{item.title}</h4>
                        <p className="text-[10px] text-[#8a8a9e] line-clamp-2 mt-1">{item.summary}</p>
                      </div>
                      <span className="text-[9px] font-mono text-[#d4af37] flex items-center gap-1">
                        OPEN FILE <ChevronRight className="w-3 h-3" />
                      </span>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 03 — TASK FORCE (7 CANONICAL PERSONNEL CARDS WITH EXPANSION) */}
      {activeSection === 'taskforce' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-[#d4af37]">SECTION 03 • TASK FORCE</span>
            <h2 className="text-2xl font-bold text-[#e0e0e0] font-serif">THE VRITRA TASK FORCE</h2>
            <p className="text-xs text-[#8a8a9e]">"Seven investigators. One investigation too dangerous for conventional channels."</p>
          </div>

          {/* Personnel Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-3">
            {taskForcePersonnel.map((member) => {
              const isExpanded = activeCardId === member.id;
              return (
                <motion.div
                  key={member.id}
                  layout
                  onClick={() => toggleCard(member.id)}
                  className={`cursor-pointer border rounded-lg p-3.5 transition-all ${
                    isExpanded
                      ? 'col-span-2 sm:col-span-3 md:col-span-7 bg-[#141419] border-[#d4af37] shadow-2xl ring-1 ring-[#d4af37]/50'
                      : 'bg-[#0a0a0c] border-[#262633] hover:border-[#d4af37]/50 hover:bg-[#141419] hover:scale-105'
                  }`}
                >
                  {isExpanded ? (
                    <motion.div layout className="space-y-4 font-sans">
                      <div className="flex justify-between items-start border-b border-[#262633] pb-3">
                        <div>
                          <span className="text-[10px] font-mono font-bold text-[#d4af37]">{member.badge} • {member.classification}</span>
                          <h3 className="text-lg font-bold text-[#e0e0e0]">{member.name}</h3>
                          <p className="text-xs text-[#d4af37] font-semibold">{member.role}</p>
                        </div>
                        <span className="text-[10px] font-mono text-[#8a8a9e] border border-[#262633] px-2 py-1 rounded">
                          PRESS ESC TO CLOSE
                        </span>
                      </div>
                      <p className="text-xs text-[#e0e0e0] leading-relaxed">{member.intelligence}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono bg-[#0a0a0c] p-3 rounded border border-[#262633]">
                        <div>
                          <span className="text-[#d4af37] font-bold block">Case Involvement:</span>
                          <span className="text-[#8a8a9e]">{member.cases}</span>
                        </div>
                        <div>
                          <span className="text-[#d4af37] font-bold block">Core Expertise:</span>
                          <div className="flex flex-wrap gap-1 pt-1">
                            {member.expertise.map((e, i) => (
                              <span key={i} className="bg-[#141419] border border-[#262633] text-[10px] px-1.5 py-0.5 rounded text-[#e0e0e0]">
                                {e}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div layout className="flex flex-col justify-between h-[150px] space-y-2">
                      <div className="flex justify-between items-center text-[9px] font-mono text-[#d4af37]">
                        <Shield className="w-3.5 h-3.5" />
                        <span className="bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] px-1 py-0.5 rounded font-bold">
                          {member.badge}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#e0e0e0] truncate">{member.name}</h4>
                        <p className="text-[10px] text-[#d4af37] truncate">{member.role}</p>
                        <p className="text-[9px] text-[#8a8a9e] line-clamp-2 mt-1">{member.summary}</p>
                      </div>
                      <span className="text-[9px] font-mono text-[#d4af37] flex items-center gap-0.5">
                        OPEN DOSSIER <ChevronRight className="w-3 h-3" />
                      </span>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 04 — THE CASE CHRONICLE (4 ACTS MATRIX) */}
      {activeSection === 'cases' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-[#d4af37]">SECTION 04 • CASE CHRONICLE</span>
            <h2 className="text-2xl font-bold text-[#e0e0e0] font-serif">THE 18-CASE INVESTIGATION CHRONICLE</h2>
            <p className="text-xs text-[#8a8a9e]">Cases 1 through 18 form one continuous investigation across 4 Acts.</p>
          </div>

          {/* Cases Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {canonicalCases.map((c) => {
              const isExpanded = activeCardId === `case-${c.id}`;
              const unlocked = isCaseUnlocked(c.id);
              const isSolved = player.completedCases.includes(c.id);

              return (
                <motion.div
                  key={c.id}
                  layout
                  onClick={() => toggleCard(`case-${c.id}`)}
                  className={`cursor-pointer border rounded-lg p-3 transition-all ${
                    isExpanded
                      ? 'col-span-2 sm:col-span-3 md:col-span-6 bg-[#141419] border-[#d4af37] shadow-2xl ring-1 ring-[#d4af37]/50'
                      : isSolved
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-400'
                      : unlocked
                      ? 'bg-[#0a0a0c] border-[#262633] hover:border-[#d4af37]/50 hover:bg-[#141419] hover:scale-105'
                      : 'bg-[#0a0a0c] border-[#262633] opacity-60'
                  }`}
                >
                  {isExpanded ? (
                    <motion.div layout className="space-y-4 font-sans text-xs">
                      <div className="flex justify-between items-start border-b border-[#262633] pb-2">
                        <div>
                          <span className="text-[10px] font-mono font-bold text-[#d4af37]">
                            CASE {c.id.toString().padStart(2, '0')} DOSSIER • ACT {c.act || 1}
                          </span>
                          <h3 className="text-base font-bold text-[#e0e0e0]">{c.title}</h3>
                        </div>
                        <span className="text-[10px] font-mono text-[#8a8a9e] border border-[#262633] px-2 py-1 rounded">
                          PRESS ESC TO CLOSE
                        </span>
                      </div>
                      <p className="text-[#e0e0e0] leading-relaxed">{c.description || c.story_background}</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px] bg-[#0a0a0c] p-2.5 rounded border border-[#262633]">
                        <div><strong>Duration:</strong> ~{c.estimated_duration_minutes} min</div>
                        <div><strong>Difficulty:</strong> {c.difficulty}</div>
                        <div><strong>Mythology:</strong> {c.mythology_theme}</div>
                        <div><strong>Status:</strong> {isSolved ? 'SOLVED' : unlocked ? 'UNLOCKED' : 'LOCKED'}</div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div layout className="text-center space-y-1">
                      <span className="text-[9px] font-mono font-bold block text-[#d4af37]">
                        {isSolved ? '✓ SOLVED' : unlocked ? 'UNLOCKED' : '🔒 LOCKED'}
                      </span>
                      <span className="text-sm font-black font-mono block text-[#e0e0e0]">
                        CASE {c.id.toString().padStart(2, '0')}
                      </span>
                      <p className="text-[10px] truncate text-[#8a8a9e]">{c.title}</p>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 05 — THE SEVEN SHADOWS */}
      {activeSection === 'shadows' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-red-500">SECTION 05 • SEVEN SHADOWS</span>
            <h2 className="text-2xl font-bold text-[#e0e0e0] font-serif">THE SEVEN SHADOWS DIRECTORY</h2>
            <p className="text-xs text-[#8a8a9e]">Click any mastermind shadow card to expand classified dossier</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 gap-3">
            {sevenShadows.map((member) => {
              const isExpanded = activeCardId === member.id;
              return (
                <motion.div
                  key={member.id}
                  layout
                  onClick={() => toggleCard(member.id)}
                  className={`cursor-pointer border rounded-lg p-4 transition-all ${
                    isExpanded
                      ? 'col-span-1 sm:col-span-2 md:col-span-7 bg-[#141419] border-red-500 shadow-2xl ring-1 ring-red-500/50'
                      : 'bg-[#0a0a0c] border-[#262633] hover:border-red-500/50 hover:bg-[#141419]'
                  }`}
                >
                  {isExpanded ? (
                    <motion.div layout className="space-y-3 font-sans text-xs">
                      <div className="flex justify-between items-start border-b border-[#262633] pb-2">
                        <div>
                          <span className="text-[10px] font-mono font-bold text-red-400">{member.title}</span>
                          <h3 className="text-base font-bold text-[#e0e0e0]">{member.name}</h3>
                          <p className="text-xs text-[#d4af37]">{member.role}</p>
                        </div>
                        <span className="text-[10px] font-mono text-[#8a8a9e] border border-[#262633] px-2 py-1 rounded">
                          PRESS ESC TO CLOSE
                        </span>
                      </div>
                      <p className="text-[#8a8a9e]"><strong>Domain:</strong> {member.domain}</p>
                      <p className="text-red-400 font-mono"><strong>Status:</strong> {member.status}</p>
                    </motion.div>
                  ) : (
                    <motion.div layout className="space-y-1.5">
                      <span className="text-[10px] font-mono font-bold text-red-500 block">{member.title}</span>
                      <h4 className="text-xs font-bold text-[#e0e0e0] truncate">{member.name}</h4>
                      <p className="text-[10px] text-[#8a8a9e] truncate">{member.role}</p>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 06 — MAYA PROTOCOL */}
      {activeSection === 'maya' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="bg-[#141419] border border-[#262633] p-8 rounded-lg space-y-6 shadow-xl">
            <div className="border-b border-[#262633] pb-4">
              <span className="text-xs font-mono font-bold text-amber-500">SECTION 06 • MAYA PROTOCOL</span>
              <h2 className="text-2xl font-bold text-[#e0e0e0] font-serif">MAYA PROTOCOL AI ARCHITECTURE</h2>
              <p className="text-xs text-[#d4af37] font-mono uppercase">WHEN EVIDENCE ITSELF CAN NO LONGER BE TRUSTED.</p>
            </div>

            <p className="text-xs sm:text-sm text-[#e0e0e0] leading-relaxed">
              The <strong>Maya Protocol</strong> is an AI surveillance engine capable of injecting manufactured fingerprint evidence rows, fake audio calls, and altered CCTV timestamps into police databases.
            </p>

            <div className="space-y-2 font-mono text-xs">
              <span className="text-[#d4af37] font-bold block">Why SQL Breaks The Evidence Manipulation Loop:</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 text-center">
                {['DATABASE', 'RAW RECORDS', 'CROSS-REFERENCE', 'ANOMALY', 'CONTRADICTION', 'EVIDENCE', 'TRUTH'].map((step, idx) => (
                  <div key={idx} className="bg-[#0a0a0c] border border-[#262633] p-2.5 rounded text-[#d4af37] font-bold">
                    {step}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 08 — PROJECT VRITRA FINAL SYNTHESIS */}
      {activeSection === 'vritra' && (
        <div className="space-y-8 animate-in fade-in duration-300 text-center max-w-4xl mx-auto">
          <div className="bg-[#141419] border border-[#d4af37]/40 p-8 sm:p-12 rounded-lg space-y-6 shadow-2xl">
            <span className="text-xs font-mono font-bold text-red-500 bg-red-950/60 border border-red-500/40 px-3.5 py-1 rounded">
              PROJECT VRITRA FINAL DOSSIER
            </span>

            <p className="text-base sm:text-lg font-serif text-[#e0e0e0] italic leading-relaxed">
              "Every case was a fragment. Every clue was a thread. And someone was pulling them all."
            </p>

            <p className="text-xs sm:text-sm text-[#8a8a9e] leading-relaxed max-w-2xl mx-auto">
              You are ready to enter the investigation. Join Prasoon Pathak and execute bulletproof SQL queries to uncover the truth behind Project Vritra.
            </p>

            <div className="pt-4 flex justify-center gap-4">
              <button
                onClick={() => onNavigate ? onNavigate('investigation') : null}
                className="flex items-center gap-2 bg-[#8b0000] hover:bg-[#b22222] text-white px-8 py-3.5 rounded font-bold text-xs uppercase tracking-wider shadow-xl shadow-red-950/60 transition-transform hover:scale-105"
              >
                <Play className="w-4 h-4 fill-white" />
                ENTER INVESTIGATION
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
