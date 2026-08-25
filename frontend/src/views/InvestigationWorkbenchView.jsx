import React, { useState, useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext';
import canonicalDb from '../data/canonicalData.js';
import { getApiUrl } from '../api/config.js';
import CodeMirror from '@uiw/react-codemirror';
import { sql } from '@codemirror/lang-sql';
import DetectiveBoard from '../components/DetectiveBoard';
import { 
  Terminal, Play, Trash2, ShieldAlert, CheckCircle2, HelpCircle, Users, Eye, Search, 
  Microscope, History, Network, ChevronLeft, ChevronRight, Check, ChevronDown, ChevronUp, Copy, BookOpen
} from 'lucide-react';

export default function InvestigationWorkbenchView({ selectedCaseId, onSelectCase, onShowCaseSolved }) {
  const { db, player, isCaseUnlocked, completeCase, showToast, unlockClueOrTemplate, isClueUnlocked, awardXP } = usePlayer();

  const parsedCaseId = parseInt(selectedCaseId ?? 0, 10);
  const validCaseId = isNaN(parsedCaseId) ? 0 : parsedCaseId;

  const [activeCase, setActiveCase] = useState(() => {
    return (
      db?.game_cases?.find((c) => c.id === validCaseId) ||
      db?.game_cases?.[0] ||
      canonicalDb?.game_cases?.find((c) => c.id === validCaseId) ||
      canonicalDb?.game_cases?.[0]
    );
  });
  const [caseBundle, setCaseBundle] = useState(null);
  const [query, setQuery] = useState('');
  const [queryResults, setQueryResults] = useState(null);
  const [queryError, setQueryError] = useState(null);
  const [queryTime, setQueryTime] = useState(0);
  const [isExecuting, setIsExecuting] = useState(false);
  const [intelTab, setIntelTab] = useState('suspects');
  const [showAccusationModal, setShowAccusationModal] = useState(false);
  const [selectedCulprit, setSelectedCulprit] = useState('');
  const [revealedHints, setRevealedHints] = useState({});

  // Expanded State for Bottom Row Cards
  const [expandedClues, setExpandedClues] = useState({});
  const [expandedTemplates, setExpandedTemplates] = useState({});

  // Pagination for query results
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Resizable Workstation Panels Ratio State (%)
  const [panelRatio, setPanelRatio] = useState({ left: 25, center: 42, right: 33 });

  // Objectives Collapsible State
  const [isObjectivesCollapsed, setIsObjectivesCollapsed] = useState(false);

  // Specific case clues dictionary (Cases 0 through 18)
  const caseSpecificClues = {
    0: [
      { title: "Clue #1: Missing Item ID", text: "Query `SELECT * FROM evidence_locker WHERE case_id = 0;` to inspect missing item records and locate fingerprint ID #409." },
      { title: "Clue #2: Fingerprint Verification", text: "Match `fingerprint_id` #409 against `suspects` roster using `SELECT * FROM suspects WHERE case_id = 0;`." }
    ],
    1: [
      { title: "Clue #1: Somalatha Poison Residues", text: "Query `SELECT * FROM forensic_analysis WHERE case_id = 1;` to identify Somalatha neuro-toxin residue on the study glassware." },
      { title: "Clue #2: CCTV Timestamp Contradiction", text: "Check `timeline` where `case_id = 1` for suspect entry times between 21:00 and 22:30. Compare Vikram Nagabhavan's statement against the estate entrance log." }
    ],
    2: [
      { title: "Clue #1: Ceremonial Soma Goblet", text: "Execute `SELECT * FROM evidence_locker WHERE case_id = 2;` to analyze chemical formula markers on the silver goblet." },
      { title: "Clue #2: Symposium Guest List", text: "Cross-reference `suspects` with `witnesses` to identify who prepared Acharya Devendra Mishra's beverage prior to the collapse." }
    ],
    3: [
      { title: "Clue #1: Sanskrit Folio Cipher", text: "Query `SELECT * FROM evidence_locker WHERE case_id = 3;` to examine palm-leaf manuscript #88 and Professor Vedika Rao's translation notes." },
      { title: "Clue #2: Archive Vault Keycard", text: "Check `timeline` entries where `event_location = 'Temple Vault'` between 14:00 and 15:30." }
    ],
    4: [
      { title: "Clue #1: Serpent Symbol Engraving", text: "Query `SELECT * FROM forensic_analysis WHERE case_id = 4;` to inspect the 7-headed Naga engraving found on the monastic cell wall." },
      { title: "Clue #2: Monastery Guest Ledger", text: "Cross-reference `suspects` where `occupation != 'Monk'` to isolate non-monastic visitors at Rudra Peeth Monastery." }
    ],
    5: [
      { title: "Clue #1: Accelerant Chemical Traces", text: "Run `SELECT * FROM forensic_analysis WHERE case_id = 5;` to verify synthetic accelerant residues used in Devendra Pratap Singh's residence fire." },
      { title: "Clue #2: Saptarishi Funding Trail", text: "Examine `evidence_locker` for corporate wire transfer receipts linking Saptarishi Bio-Tech to Devendra Oberoi." }
    ],
    6: [
      { title: "Clue #1: Erased Identity Alias", text: "Query `SELECT * FROM suspects WHERE case_id = 6;` and compare national ID numbers against `timeline` birth registry records." },
      { title: "Clue #2: Maya Protocol Digital Footprint", text: "Check `evidence_locker` for altered IP address logs generated by Maya Protocol server nodes." }
    ],
    7: [
      { title: "Clue #1: Offshore Bank Account Ledgers", text: "Execute `SELECT * FROM evidence_locker WHERE case_id = 7;` to trace 12 Swiss shell accounts transferring funds to Shadow Two." },
      { title: "Clue #2: Cryptographic Keycard", text: "Query `forensic_analysis` for hardware security module serial numbers recovered from the vault." }
    ],
    8: [
      { title: "Clue #1: Synthetic Fingerprint Injection", text: "Query `SELECT * FROM forensic_analysis WHERE case_id = 8;` to detect manufactured digital fingerprint rows injected into police databases." },
      { title: "Clue #2: CCTV Frame Alteration", text: "Cross-reference `timeline` timestamp gaps between 01:15 AM and 01:45 AM at the government server facility." }
    ],
    9: [
      { title: "Clue #1: Swiss Shell Banking Receipts", text: "Query `SELECT * FROM evidence_locker WHERE case_id = 9;` to uncover Devika Oberoi's offshore transfers." },
      { title: "Clue #2: Shadow Two Directives", text: "Cross-reference `suspects` motives with financial ledgers." }
    ],
    10: [
      { title: "Clue #1: Judicial Surveillance Orders", text: "Query `SELECT * FROM evidence_locker WHERE case_id = 10;` to inspect wiretap authorizations signed by Justice K. M. Shastri." },
      { title: "Clue #2: Erased Arrest Warrants", text: "Check `timeline` for deleted police warrant log entries." }
    ],
    11: [
      { title: "Clue #1: Paramilitary Weapons Shipment", text: "Query `SELECT * FROM evidence_locker WHERE case_id = 11;` for military weapon serial numbers linked to General Vikram Ranawat." },
      { title: "Clue #2: Defense Armory Manifest", text: "Cross-reference `forensic_analysis` ballistics reports." }
    ],
    12: [
      { title: "Clue #1: Deepfake Audio Broadcast", text: "Query `SELECT * FROM forensic_analysis WHERE case_id = 12;` for audio spectral analysis proving Rohan Varma's deepfake broadcast." },
      { title: "Clue #2: Media Server IP Trace", text: "Check `evidence_locker` for broadcast server logs." }
    ],
    13: [
      { title: "Clue #1: Crimson Yagna Event Plan", text: "Query `SELECT * FROM evidence_locker WHERE case_id = 13;` to inspect Harshwardhan Rathore's political crisis plan." },
      { title: "Clue #2: Crisis Funding Accounts", text: "Cross-reference `suspects` where `case_id = 13`." }
    ],
    14: [
      { title: "Clue #1: Oracle AI Prediction Log", text: "Query `SELECT * FROM forensic_analysis WHERE case_id = 14;` for crisis prediction algorithms." },
      { title: "Clue #2: Server Facility Access", text: "Check `timeline` for Oracle lab entry logs." }
    ],
    15: [
      { title: "Clue #1: Seven Shadows Council Minutes", text: "Query `SELECT * FROM evidence_locker WHERE case_id = 15;` for encrypted council meeting folios." },
      { title: "Clue #2: Council Member Signatures", text: "Cross-reference `suspects` with the Seven Shadows directory." }
    ],
    16: [
      { title: "Clue #1: Ninth Realm Bunker Map", text: "Query `SELECT * FROM evidence_locker WHERE case_id = 16;` for architectural blueprints of the New Delhi bunker." },
      { title: "Clue #2: Security Access Codes", text: "Inspect `forensic_analysis` keycard decryption logs." }
    ],
    17: [
      { title: "Clue #1: Vritra Cycle Master Ledgers", text: "Query `SELECT * FROM evidence_locker WHERE case_id = 17;` for 20 years of Project Vritra records." },
      { title: "Clue #2: Dr. Vedant Kashyap Fingerprints", text: "Cross-reference `forensic_analysis` DNA and fingerprint markers." }
    ],
    18: [
      { title: "Clue #1: Sutradhar Final Directive", text: "Execute `SELECT * FROM evidence_locker WHERE case_id = 18;` to uncover Dr. Vedant Kashyap's master plan." },
      { title: "Clue #2: Complete Evidence Network", text: "Query `SELECT * FROM suspects WHERE case_id = 18;` and cross-reference all 17 previous case discoveries to indict The Sutradhar." }
    ]
  };

  // Expandable Query Templates Data
  const queryTemplates = [
    {
      id: 'tpl-suspects',
      label: 'SELECT Suspects Roster',
      query: (caseId) => `SELECT * FROM suspects WHERE case_id = ${caseId};`,
      purpose: 'Forensic Suspect Analysis',
      tables: 'suspects',
      explanation: 'Extracts all prime suspects associated with the case, including occupation, reported alibi, motive, and primary suspect status.',
      insights: 'Cross-reference suspect alibi timestamps against crime scene entrance logs.'
    },
    {
      id: 'tpl-evidence',
      label: 'SELECT Evidence Locker',
      query: (caseId) => `SELECT * FROM evidence_locker WHERE case_id = ${caseId};`,
      purpose: 'Physical & Digital Artifact Inspection',
      tables: 'evidence_locker',
      explanation: 'Retrieves cataloged physical evidence, Somalatha toxicological samples, Sanskrit folios, and hardware keycards collected from the crime scene.',
      insights: 'Reveals found locations, serial numbers, accelerant traces, and chemical markers.'
    },
    {
      id: 'tpl-forensics',
      label: 'SELECT Laboratory Findings',
      query: (caseId) => `SELECT * FROM forensic_analysis WHERE case_id = ${caseId};`,
      purpose: 'Toxicology & Ballistics Verification',
      tables: 'forensic_analysis',
      explanation: 'Queries lab reports for Somalatha neuro-toxin residues, synthetic fingerprint injections, audio deepfake spectrographs, and cipher decryptions.',
      insights: 'Exposes scientific contradictions between police reports and raw laboratory data.'
    },
    {
      id: 'tpl-timeline',
      label: 'SELECT Chronological Timeline',
      query: (caseId) => `SELECT * FROM timeline WHERE case_id = ${caseId} ORDER BY time ASC;`,
      purpose: 'Event Sequence & Timestamp Reconstruction',
      tables: 'timeline',
      explanation: 'Lists all verified time-stamped events prior to and immediately following the homicide.',
      insights: 'Uncovers altered CCTV timestamps, unconfirmed alibis, and missing time intervals.'
    }
  ];

  // Load case bundle whenever selectedCaseId changes
  useEffect(() => {
    const parsed = parseInt(selectedCaseId ?? 0, 10);
    const caseId = isNaN(parsed) ? 0 : parsed;
    const sourceDb = db || canonicalDb;

    const caseData =
      sourceDb?.game_cases?.find((c) => c.id === caseId) ||
      sourceDb?.game_cases?.[0] ||
      canonicalDb?.game_cases?.[0];

    if (caseData) {
      setActiveCase(caseData);
    }

    const defaultQuery = `SELECT * FROM suspects WHERE case_id = ${caseId};`;
    setQuery(defaultQuery);

    const loadBundle = async () => {
      try {
        const res = await fetch(getApiUrl(`/api/cases/${caseId}/full`));
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setCaseBundle(json.data);
            return;
          }
        }
      } catch (err) {
        console.log('API bundle fallback to canonical in-memory DB');
      }

      // In-memory fallback
      if (sourceDb) {
        setCaseBundle({
          case: caseData,
          suspects: sourceDb.suspects?.filter((s) => s.case_id === caseId) || [],
          witnesses: sourceDb.witnesses?.filter((w) => w.case_id === caseId) || [],
          evidence: sourceDb.evidence_locker?.filter((e) => e.case_id === caseId) || [],
          forensics: sourceDb.forensic_analysis?.filter((f) => f.case_id === caseId) || [],
          timeline: sourceDb.timeline?.filter((t) => t.case_id === caseId) || [],
          objectives: sourceDb.objectives?.filter((o) => o.case_id === caseId) || [],
          clues: sourceDb.clues?.filter((c) => c.case_id === caseId) || [],
        });
      }
    };

    loadBundle();
  }, [selectedCaseId, db]);

  // Mouse Drag Handle 1 (Left vs Center)
  const handleMouseDownLeft = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startLeft = panelRatio.left;
    const startCenter = panelRatio.center;

    const handleMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaPercent = (deltaX / window.innerWidth) * 100;
      const newLeft = Math.max(15, Math.min(45, startLeft + deltaPercent));
      const newCenter = Math.max(20, startCenter - (newLeft - startLeft));
      setPanelRatio(prev => ({ ...prev, left: Math.round(newLeft), center: Math.round(newCenter) }));
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Mouse Drag Handle 2 (Center vs Right)
  const handleMouseDownRight = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startCenter = panelRatio.center;
    const startRight = panelRatio.right;

    const handleMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaPercent = (deltaX / window.innerWidth) * 100;
      const newCenter = Math.max(20, Math.min(65, startCenter + deltaPercent));
      const newRight = Math.max(15, startRight - (newCenter - startCenter));
      setPanelRatio(prev => ({ ...prev, center: Math.round(newCenter), right: Math.round(newRight) }));
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // In-memory query evaluation fallback
  const evaluateInMemoryQuery = (sqlStr) => {
    if (!sqlStr) return [];
    const cleanSql = sqlStr.trim();

    const caseId = activeCase?.id !== undefined ? activeCase.id : 0;
    let rows = [];

    // Detect target table name
    const fromMatch = cleanSql.match(/FROM\s+[`"]?([a-zA-Z0-9_]+)[`"]?/i);
    const tableName = fromMatch ? fromMatch[1].toLowerCase() : '';

    const sourceDb = db || canonicalDb;
    if (!sourceDb) return [];

    if (tableName.includes('suspect')) {
      rows = caseBundle?.suspects?.length ? caseBundle.suspects : (sourceDb.suspects?.filter(s => s.case_id === caseId) || []);
      if (!rows.length) rows = sourceDb.suspects || [];
    } else if (tableName.includes('witness')) {
      rows = caseBundle?.witnesses?.length ? caseBundle.witnesses : (sourceDb.witnesses?.filter(w => w.case_id === caseId) || []);
      if (!rows.length) rows = sourceDb.witnesses || [];
    } else if (tableName.includes('evidence') || tableName.includes('locker')) {
      rows = caseBundle?.evidence?.length ? caseBundle.evidence : (sourceDb.evidence_locker?.filter(e => e.case_id === caseId) || []);
      if (!rows.length) rows = sourceDb.evidence_locker || [];
    } else if (tableName.includes('forensic') || tableName.includes('lab')) {
      rows = caseBundle?.forensics?.length ? caseBundle.forensics : (sourceDb.forensic_analysis?.filter(f => f.case_id === caseId) || []);
      if (!rows.length) rows = sourceDb.forensic_analysis || [];
    } else if (tableName.includes('timeline') || tableName.includes('event')) {
      rows = caseBundle?.timeline?.length ? caseBundle.timeline : (sourceDb.timeline?.filter(t => t.case_id === caseId) || []);
      if (!rows.length) rows = sourceDb.timeline || [];
    } else if (tableName.includes('case')) {
      rows = sourceDb.game_cases || [];
    } else if (tableName.includes('ledger') || tableName.includes('financial') || tableName.includes('cipher') || tableName.includes('surveillance')) {
      rows = sourceDb.evidence_locker?.filter(e => e.case_id === caseId) || sourceDb.evidence_locker || [];
    } else {
      rows = (caseBundle?.suspects?.length ? caseBundle.suspects : sourceDb.suspects) || [];
    }

    // Check if SQL contains explicit `WHERE case_id = X`
    const whereMatch = cleanSql.match(/WHERE\s+([\s\S]*?)(?:GROUP\s+BY|ORDER\s+BY|LIMIT|$)/i);
    if (whereMatch) {
      const caseWhereMatch = whereMatch[1].match(/case_id\s*=\s*(\d+)/i);
      if (caseWhereMatch) {
        const targetId = parseInt(caseWhereMatch[1], 10);
        const filtered = rows.filter(r => r.case_id === undefined || r.case_id === targetId);
        if (filtered.length > 0) rows = filtered;
      }
    }

    return rows;
  };

  // Execute SQL Query
  const handleRunQuery = async () => {
    if (!query.trim()) return;
    setIsExecuting(true);
    setQueryError(null);
    const startTime = performance.now();

    let queryAccepted = false;
    let results = [];

    try {
      const res = await fetch('/api/query/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim(), case_id: activeCase?.id || 1 }),
      });

      const endTime = performance.now();
      setQueryTime(Math.round(endTime - startTime));

      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.results) && json.results.length > 0) {
          results = json.results;
          queryAccepted = true;
        }
      }
    } catch (err) {
      console.log('Query API unreachable, engaging in-memory query engine');
    }

    // Fallback to in-memory canonical engine if backend returned empty or unreachable
    if (!queryAccepted) {
      results = evaluateInMemoryQuery(query.trim());
      const endTime = performance.now();
      setQueryTime(Math.round(endTime - startTime));
    }

    setQueryResults(results);
    setCurrentPage(1);
    setIsExecuting(false);

    if (results && results.length > 0) {
      awardXP(25, `${results.length} evidence rows extracted`);
    } else {
      showToast('⚠️ Query executed cleanly, but returned 0 evidence rows.', 'info');
    }
  };

  // Submit Accusation
  const handleAccusationSubmit = (e) => {
    e.preventDefault();
    if (!selectedCulprit) return;

    const suspects = caseBundle?.suspects || [];
    const culpritObj = suspects.find((s) => s.name === selectedCulprit || s.is_guilty);
    const isCorrect = culpritObj?.is_guilty || selectedCulprit === culpritObj?.name;

    setShowAccusationModal(false);

    if (isCorrect || activeCase?.id === 0) {
      completeCase(activeCase?.id || 1);
      onShowCaseSolved(activeCase?.id || 1, selectedCulprit);
    } else {
      showToast(`❌ Accusation Inconclusive: Evidence statements do not corroborate ${selectedCulprit} as primary perpetrator.`, 'error');
    }
  };

  const currentActiveCase = activeCase || db?.game_cases?.[0] || canonicalDb?.game_cases?.[0];
  if (!currentActiveCase) return null;

  const totalRows = queryResults?.length || 0;
  const totalPages = Math.ceil(totalRows / rowsPerPage) || 1;
  const displayedRows = queryResults?.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage) || [];

  // Active case specific clues list
  const currentCaseClues = [
    ...(caseSpecificClues[activeCase.id] || []),
    ...(caseBundle?.clues || [])
  ];

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-4 space-y-4">
      {/* Top Workstation Header Bar */}
      <div className="bg-[#141419] border border-[#262633] rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xl">
        <div className="flex items-center gap-3">
          <span className="bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] px-3 py-1 rounded text-xs font-mono font-bold">
            CASE {activeCase.id.toString().padStart(2, '0')}
          </span>
          <div>
            <h2 className="text-lg font-bold text-[#e0e0e0] leading-tight font-serif">{activeCase.title}</h2>
            <p className="text-xs text-[#8a8a9e]">Act {activeCase.act || 1} • {activeCase.mythology_theme || 'Saptarishi'} Mystery</p>
          </div>
        </div>

        {/* Resizable Layout Presets & Case Selector */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Quick Resizable Panel Presets */}
          <div className="hidden lg:flex items-center gap-1 bg-[#0a0a0c] border border-[#262633] p-1 rounded text-[10px] font-mono text-[#8a8a9e]">
            <span className="px-1 text-[#d4af37] font-bold">LAYOUT:</span>
            <button
              onClick={() => setPanelRatio({ left: 25, center: 42, right: 33 })}
              className={`px-2 py-0.5 rounded transition-colors ${panelRatio.center === 42 ? 'bg-[#d4af37] text-black font-bold' : 'hover:text-[#e0e0e0]'}`}
              title="Default Layout"
            >
              Default
            </button>
            <button
              onClick={() => setPanelRatio({ left: 18, center: 57, right: 25 })}
              className={`px-2 py-0.5 rounded transition-colors ${panelRatio.center === 57 ? 'bg-[#d4af37] text-black font-bold' : 'hover:text-[#e0e0e0]'}`}
              title="Focus Terminal (Expanded SQL Editor)"
            >
              Terminal
            </button>
            <button
              onClick={() => setPanelRatio({ left: 18, center: 32, right: 50 })}
              className={`px-2 py-0.5 rounded transition-colors ${panelRatio.right === 50 ? 'bg-[#d4af37] text-black font-bold' : 'hover:text-[#e0e0e0]'}`}
              title="Focus Detective Board"
            >
              Board
            </button>
          </div>

          <select
            value={activeCase.id}
            onChange={(e) => onSelectCase(parseInt(e.target.value, 10))}
            className="bg-[#0a0a0c] border border-[#262633] text-xs font-mono text-[#e0e0e0] rounded px-3 py-2 outline-none focus:border-[#d4af37]"
          >
            {db?.game_cases?.map((c) => {
              const unlocked = isCaseUnlocked(c.id);
              return (
                <option key={c.id} value={c.id} disabled={!unlocked}>
                  {unlocked ? '' : '🔒 '}Case {c.id}: {c.title}
                </option>
              );
            })}
          </select>

          <button
            onClick={() => setShowAccusationModal(true)}
            className="flex items-center gap-1.5 bg-[#8b0000] hover:bg-[#b22222] text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-red-950/50"
          >
            <ShieldAlert className="w-4 h-4 text-white" />
            INDICT SUSPECT
          </button>
        </div>
      </div>

      {/* TOP ROW: 3 EQUAL HEIGHT WORKSTATION CARDS (Objectives, SQL Terminal, Intelligence Dossiers) */}
      <div className="flex flex-col lg:flex-row gap-2 items-stretch w-full overflow-hidden min-h-[580px]">
        {/* PANEL 1 (LEFT TOP): Investigation Objectives Card */}
        <div
          style={{ flex: `${panelRatio.left} ${panelRatio.left} 0%` }}
          className="w-full min-w-0 flex flex-col transition-all duration-75"
        >
          <div className="bg-[#141419] border border-[#262633] rounded-lg p-5 flex flex-col h-full shadow-xl space-y-4">
            <div
              onClick={() => setIsObjectivesCollapsed(prev => !prev)}
              className="border-b border-[#262633] pb-3 flex justify-between items-center cursor-pointer hover:opacity-90 select-none"
            >
              <div>
                <h3 className="text-xs font-bold text-[#d4af37] uppercase tracking-wider flex items-center gap-1.5 font-mono">
                  <CheckCircle2 className="w-4 h-4 text-[#d4af37]" /> Investigation Objectives
                </h3>
                <span className="text-[10px] text-[#8a8a9e] font-mono">
                  CASE {activeCase.id.toString().padStart(2, '0')} • TARGET CHECKLIST
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/30 px-2 py-0.5 rounded">
                  {(caseBundle?.objectives || []).length || 5} TASKS
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsObjectivesCollapsed(prev => !prev);
                  }}
                  className="text-[#8a8a9e] hover:text-[#d4af37] border border-[#262633] p-1 rounded"
                  title={isObjectivesCollapsed ? 'Expand Objectives' : 'Collapse Objectives'}
                >
                  {isObjectivesCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Scrollable Objectives List (Hidden when Collapsed) */}
            {!isObjectivesCollapsed ? (
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 text-xs animate-in fade-in duration-200">
                {caseBundle?.objectives?.length > 0 ? (
                  caseBundle.objectives.map((obj, i) => (
                    <div key={i} className="flex items-start gap-3 bg-[#0a0a0c] p-3 rounded border border-[#262633] hover:border-[#d4af37]/40 transition-colors">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <span className="text-[#e0e0e0] font-semibold block leading-snug">{obj.description || obj.title}</span>
                        <span className="text-[10px] text-[#8a8a9e] block font-mono">Execute queries to verify database statements</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="space-y-2">
                    {[
                      "Review all suspects connected to the victim",
                      "Examine witness testimony statements",
                      "Query evidence locker for physical artifacts",
                      "Inspect forensic lab findings for toxicology markers",
                      "Reconstruct chronological event timeline"
                    ].map((desc, idx) => (
                      <div key={idx} className="flex items-start gap-3 bg-[#0a0a0c] p-3 rounded border border-[#262633]">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-[#e0e0e0] leading-snug">{desc}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col justify-center items-center text-center p-4 text-xs font-mono text-[#8a8a9e]">
                <CheckCircle2 className="w-8 h-8 text-[#d4af37]/40 mb-2" />
                <span className="text-[#d4af37] font-bold block">OBJECTIVES COLLAPSED</span>
                <span className="text-[10px]">Click header or toggle icon to expand checklist</span>
              </div>
            )}
          </div>
        </div>

        {/* Resizable Splitter Handle 1 (Drag Left vs Center) */}
        <div
          onMouseDown={handleMouseDownLeft}
          className="hidden lg:flex flex-col justify-center items-center cursor-col-resize px-1 group hover:bg-[#d4af37]/20 rounded transition-colors shrink-0"
          title="Drag to resize Left & Center panels"
        >
          <div className="w-1 h-12 bg-[#262633] group-hover:bg-[#d4af37] rounded" />
        </div>

        {/* PANEL 2 (CENTER TOP): SQL Forensic Terminal & Execution Results */}
        <div
          style={{ flex: `${panelRatio.center} ${panelRatio.center} 0%` }}
          className="w-full min-w-0 flex flex-col transition-all duration-75 space-y-3"
        >
          {/* SQL Editor Card */}
          <div className="bg-[#141419] border border-[#262633] rounded-lg p-4 space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#262633] pb-2">
              <span className="text-xs font-bold text-[#e0e0e0] flex items-center gap-2 font-mono">
                <Terminal className="w-4 h-4 text-[#d4af37]" /> SQL Forensic Terminal
              </span>
              <span className="text-[10px] font-mono text-[#8a8a9e]">PostgreSQL / Supabase</span>
            </div>

            {/* CodeMirror SQL Editor */}
            <div className="border border-[#262633] rounded overflow-hidden">
              <CodeMirror
                value={query}
                height="150px"
                extensions={[sql()]}
                theme="dark"
                onChange={(value) => setQuery(value)}
              />
            </div>

            {/* Controls Bar */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRunQuery}
                  disabled={isExecuting}
                  className="flex items-center gap-1.5 bg-[#8b0000] hover:bg-[#b22222] text-white px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-colors shadow"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  {isExecuting ? 'Running...' : 'Run Query (Ctrl+Enter)'}
                </button>
                <button
                  onClick={() => setQuery('')}
                  className="flex items-center gap-1 bg-[#0a0a0c] hover:bg-[#262633] text-[#8a8a9e] px-2.5 py-1.5 rounded text-xs border border-[#262633]"
                  title="Clear Editor"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="text-[#d4af37] font-bold">{totalRows} rows</span>
                <span className="text-[#8a8a9e]">⚡ {queryTime}ms</span>
              </div>
            </div>
          </div>

          {/* Results Data Table Card (Fills remaining height) */}
          <div className="bg-[#141419] border border-[#262633] rounded-lg p-4 flex-1 flex flex-col space-y-3 min-w-0 shadow-xl overflow-hidden">
            <h4 className="text-xs font-bold text-[#d4af37] uppercase tracking-wider flex items-center justify-between border-b border-[#262633] pb-2 font-mono">
              <span>Execution Results</span>
              {totalPages > 1 && (
                <div className="flex items-center gap-2 text-xs text-[#8a8a9e]">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    className="disabled:opacity-40 hover:text-white"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span>Page {currentPage} of {totalPages}</span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    className="disabled:opacity-40 hover:text-white"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </h4>

            {queryError ? (
              <div className="bg-red-950/40 border border-red-500/40 rounded p-3 text-xs font-mono text-red-400">
                ⚠️ {queryError}
              </div>
            ) : displayedRows.length > 0 ? (
              <div className="overflow-x-auto overflow-y-auto flex-1 w-full min-w-0">
                <table className="w-full text-left text-xs font-mono border-collapse">
                  <thead>
                    <tr className="bg-[#0a0a0c] border-b border-[#262633] text-[#d4af37]">
                      {Object.keys(displayedRows[0]).map((key) => (
                        <th key={key} className="p-2 border-r border-[#262633] whitespace-nowrap">{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {displayedRows.map((row, rIdx) => (
                      <tr key={rIdx} className="border-b border-[#262633]/60 hover:bg-[#262633]/30">
                        {Object.values(row).map((val, cIdx) => (
                          <td key={cIdx} className="p-2 border-r border-[#262633]/40 text-[#e0e0e0] max-w-[200px] truncate">
                            {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-[#8a8a9e] text-center my-auto py-8 font-mono">
                No query executed yet. Run a SQL query above to view canonical evidence rows.
              </p>
            )}
          </div>
        </div>

        {/* Resizable Splitter Handle 2 (Drag Center vs Right) */}
        <div
          onMouseDown={handleMouseDownRight}
          className="hidden lg:flex flex-col justify-center items-center cursor-col-resize px-1 group hover:bg-[#d4af37]/20 rounded transition-colors shrink-0"
          title="Drag to resize Center & Right panels"
        >
          <div className="w-1 h-12 bg-[#262633] group-hover:bg-[#d4af37] rounded" />
        </div>

        {/* PANEL 3 (RIGHT TOP): Tabbed Intelligence Dossier & Detective Board Card */}
        <div
          style={{ flex: `${panelRatio.right} ${panelRatio.right} 0%` }}
          className="w-full min-w-0 flex flex-col transition-all duration-75"
        >
          <div className="bg-[#141419] border border-[#262633] rounded-lg p-4 flex flex-col h-full space-y-3 shadow-xl overflow-hidden">
            {/* Intel Tabs */}
            <div className="flex flex-wrap gap-1 border-b border-[#262633] pb-2 text-xs font-mono">
              {[
                { id: 'suspects', label: 'Suspects', icon: Users },
                { id: 'witnesses', label: 'Witnesses', icon: Eye },
                { id: 'evidence', label: 'Evidence', icon: Search },
                { id: 'forensics', label: 'Forensics', icon: Microscope },
                { id: 'timeline', label: 'Timeline', icon: History },
                { id: 'board', label: 'Detective Board', icon: Network },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setIntelTab(tab.id)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors ${
                      intelTab === tab.id
                        ? 'bg-[#d4af37] text-black font-bold'
                        : 'text-[#8a8a9e] hover:text-[#e0e0e0]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab Content Display */}
            {intelTab === 'board' ? (
              <div className="flex-1 overflow-hidden">
                <DetectiveBoard caseBundle={caseBundle} activeCaseId={activeCase.id} />
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-xs">
                {intelTab === 'suspects' && (
                  caseBundle?.suspects?.length > 0 ? (
                    caseBundle.suspects.map((s, i) => (
                      <div key={i} className="bg-[#0a0a0c] border border-[#262633] p-3 rounded space-y-1">
                        <div className="flex justify-between font-bold text-[#d4af37]">
                          <span>{s.name}</span>
                          <span className="text-[#8a8a9e] font-normal">{s.occupation || s.role}</span>
                        </div>
                        <p className="text-[#8a8a9e]"><strong>Motive:</strong> {s.motive || 'Under Investigation'}</p>
                        <p className="text-[#8a8a9e]"><strong>Alibi:</strong> {s.alibi || 'Unconfirmed'}</p>
                      </div>
                    ))
                  ) : <p className="text-[#8a8a9e]">No suspect profiles found.</p>
                )}

                {intelTab === 'witnesses' && (
                  caseBundle?.witnesses?.length > 0 ? (
                    caseBundle.witnesses.map((w, i) => (
                      <div key={i} className="bg-[#0a0a0c] border border-[#262633] p-3 rounded space-y-1">
                        <span className="font-bold text-[#d4af37] block">{w.name} ({w.role})</span>
                        <p className="text-[#e0e0e0] italic">"{w.statement || w.testimony}"</p>
                      </div>
                    ))
                  ) : <p className="text-[#8a8a9e]">No witness statements logged.</p>
                )}

                {intelTab === 'evidence' && (
                  caseBundle?.evidence?.length > 0 ? (
                    caseBundle.evidence.map((e, i) => (
                      <div key={i} className="bg-[#0a0a0c] border border-[#262633] p-3 rounded space-y-1">
                        <span className="font-bold text-emerald-400 block">{e.item_name || e.name}</span>
                        <p className="text-[#8a8a9e]">{e.description}</p>
                        <p className="text-[10px] text-[#d4af37]">Location: {e.found_location || 'Crime Scene'}</p>
                      </div>
                    ))
                  ) : <p className="text-[#8a8a9e]">No physical evidence items cataloged.</p>
                )}

                {intelTab === 'forensics' && (
                  caseBundle?.forensics?.length > 0 ? (
                    caseBundle.forensics.map((f, i) => (
                      <div key={i} className="bg-[#0a0a0c] border border-[#262633] p-3 rounded space-y-1">
                        <span className="font-bold text-[#d4af37] block">{f.analysis_type || f.title}</span>
                        <p className="text-[#e0e0e0] font-mono">{f.result || f.findings}</p>
                      </div>
                    ))
                  ) : <p className="text-[#8a8a9e]">No forensic lab reports available.</p>
                )}

                {intelTab === 'timeline' && (
                  caseBundle?.timeline?.length > 0 ? (
                    caseBundle.timeline.map((t, i) => (
                      <div key={i} className="bg-[#0a0a0c] border border-[#262633] p-3 rounded space-y-1 font-mono">
                        <span className="text-[#d4af37] font-bold block">{t.time || t.timestamp}</span>
                        <p className="text-[#e0e0e0] font-sans">{t.event || t.description}</p>
                      </div>
                    ))
                  ) : <p className="text-[#8a8a9e]">No timeline entries logged.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BOTTOM ROW: INVESTIGATIVE CLUES & QUERY TEMPLATES (Side by Side Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* BOTTOM LEFT BOX: Investigative Clues */}
        <div className="bg-[#141419] border border-[#262633] rounded-lg p-5 space-y-3 shadow-xl">
          <div className="flex justify-between items-center border-b border-[#262633] pb-2">
            <h3 className="text-xs font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <HelpCircle className="w-4 h-4 text-amber-500" /> Case {activeCase.id} Specific Clues & Forensic Guidance
            </h3>
            <span className="text-[10px] font-mono text-[#8a8a9e]">
              {currentCaseClues.length} CLUES CATALOGED
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {currentCaseClues.map((clue, idx) => {
              const clueKey = `clue-${activeCase.id}-${idx}`;
              const unlocked = isClueUnlocked(clueKey);
              const isExpanded = expandedClues[idx];

              return (
                <div key={idx} className="bg-[#0a0a0c] border border-[#262633] rounded p-3 space-y-2 hover:border-amber-500/40 transition-colors">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#d4af37] text-xs font-mono">
                      {clue.title || `Forensic Clue #${idx + 1}`}
                    </span>
                    {unlocked ? (
                      <button
                        onClick={() => setExpandedClues(prev => ({ ...prev, [idx]: !prev[idx] }))}
                        className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 border border-emerald-500/40 bg-emerald-950/20 px-2 py-0.5 rounded"
                      >
                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        {isExpanded ? 'Hide Solution' : '⚡ Exact Solution'}
                      </button>
                    ) : (
                      <button
                        onClick={() => unlockClueOrTemplate(clueKey, 25)}
                        className="flex items-center gap-1 text-[10px] font-mono font-bold text-amber-400 bg-amber-950/40 border border-amber-500/40 px-2 py-0.5 rounded hover:bg-amber-900/60 transition-colors"
                      >
                        🔒 UNLOCK SOLUTION (25 XP)
                      </button>
                    )}
                  </div>

                  {/* General Clue Hint Text (Always Visible) */}
                  <p className="text-xs text-[#e0e0e0] leading-relaxed">
                    {clue.text || clue.description || clue.hint_text}
                  </p>

                  {/* Unlocked Exact Solution */}
                  {unlocked && isExpanded && (
                    <div className="bg-[#141419] border border-[#262633] p-2.5 rounded text-[11px] font-mono text-amber-400 space-y-1 animate-in fade-in duration-200">
                      <span className="font-bold block text-[#d4af37]">EXACT SQL QUERY SOLUTION:</span>
                      <code className="text-emerald-400 block bg-[#0a0a0c] p-1.5 rounded border border-[#262633]">
                        SELECT * FROM {idx === 0 ? 'suspects' : idx === 1 ? 'forensic_analysis' : 'evidence_locker'} WHERE case_id = {activeCase.id};
                      </code>
                      <span className="font-bold block text-[#d4af37] pt-1">INVESTIGATIVE TECHNIQUE:</span>
                      <p className="text-[#8a8a9e] font-sans">
                        Cross-reference database records in the SQL terminal to isolate anomalies in evidence statements.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* BOTTOM RIGHT BOX: Expandable Query Templates */}
        <div className="bg-[#141419] border border-[#262633] rounded-lg p-5 space-y-3 shadow-xl">
          <div className="flex justify-between items-center border-b border-[#262633] pb-2">
            <h3 className="text-xs font-bold text-[#d4af37] uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <BookOpen className="w-4 h-4 text-[#d4af37]" /> Interactive SQL Query Templates
            </h3>
            <span className="text-[10px] font-mono text-[#8a8a9e]">EXACT CODE REQUIRES 25 XP</span>
          </div>

          <div className="space-y-2 text-xs">
            {queryTemplates.map((tpl) => {
              const templateKey = `tpl-${activeCase.id}-${tpl.id}`;
              const unlocked = isClueUnlocked(templateKey);
              const isExpanded = expandedTemplates[tpl.id];
              const sqlCode = tpl.query(activeCase.id);

              return (
                <div key={tpl.id} className="bg-[#0a0a0c] border border-[#262633] rounded p-3 space-y-2 hover:border-[#d4af37]/50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="space-y-0.5">
                      <span className="font-bold text-[#e0e0e0] text-xs font-mono">{tpl.label}</span>
                      <span className="text-[10px] text-[#d4af37] block font-mono font-semibold">{tpl.purpose}</span>
                      <p className="text-[11px] text-[#8a8a9e] pt-0.5">{tpl.explanation}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      {unlocked ? (
                        <>
                          <button
                            onClick={() => {
                              setQuery(sqlCode);
                              showToast(`Loaded "${tpl.label}" into SQL terminal`, 'info');
                            }}
                            className="flex items-center gap-1 bg-[#d4af37]/10 hover:bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40 px-2.5 py-1 rounded text-[10px] font-mono font-bold"
                            title="Load SQL query into terminal"
                          >
                            <Copy className="w-3 h-3" /> LOAD SQL
                          </button>
                          <button
                            onClick={() => setExpandedTemplates(prev => ({ ...prev, [tpl.id]: !prev[tpl.id] }))}
                            className="text-[10px] font-mono text-[#8a8a9e] hover:text-[#d4af37] border border-[#262633] px-2 py-1 rounded"
                          >
                            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => unlockClueOrTemplate(templateKey, 25)}
                          className="flex items-center gap-1 text-[10px] font-mono font-bold text-[#d4af37] bg-[#d4af37]/10 border border-[#d4af37]/40 px-2.5 py-1 rounded hover:bg-[#d4af37]/20 transition-colors"
                        >
                          🔒 UNLOCK EXACT CODE (25 XP)
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Expanded Template Content (Only if Unlocked) */}
                  {unlocked && isExpanded && (
                    <div className="space-y-2.5 pt-2 border-t border-[#262633] text-xs animate-in fade-in duration-200">
                      <div className="bg-[#141419] p-2.5 rounded border border-[#262633] font-mono text-[11px] text-[#d4af37]">
                        <code>{sqlCode}</code>
                      </div>
                      <div className="space-y-1 text-[#8a8a9e]">
                        <p><strong className="text-[#e0e0e0]">Target Tables:</strong> <code className="text-[#d4af37]">{tpl.tables}</code></p>
                        <p><strong className="text-[#e0e0e0]">Expected Insights:</strong> {tpl.insights}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Accusation Modal */}
      {showAccusationModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#141419] border border-[#8b0000] rounded-lg max-w-md w-full shadow-2xl overflow-hidden">
            <div className="bg-[#0a0a0c] px-6 py-4 border-b border-[#262633] flex items-center justify-between">
              <h3 className="text-base font-bold text-red-500 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5" /> Formal Culprit Indictment
              </h3>
              <button onClick={() => setShowAccusationModal(false)} className="text-[#8a8a9e] hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleAccusationSubmit} className="p-6 space-y-4">
              <p className="text-xs text-[#8a8a9e]">
                Select the primary perpetrator responsible for the homicide in Case {activeCase.id}.
              </p>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#d4af37]">Primary Suspect:</label>
                <select
                  value={selectedCulprit}
                  onChange={(e) => setSelectedCulprit(e.target.value)}
                  className="w-full bg-[#0a0a0c] border border-[#262633] focus:border-[#d4af37] text-xs text-[#e0e0e0] rounded px-3 py-2 outline-none"
                  required
                >
                  <option value="">-- Select Person of Interest --</option>
                  {(caseBundle?.suspects || []).map((s, idx) => (
                    <option key={idx} value={s.name}>{s.name} ({s.occupation || s.role || 'Suspect'})</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAccusationModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#8a8a9e] hover:text-[#e0e0e0]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#8b0000] hover:bg-[#b22222] text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-wider"
                >
                  Confirm Indictment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
