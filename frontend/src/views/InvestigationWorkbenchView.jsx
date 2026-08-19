import React, { useState, useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext';
import CodeMirror from '@uiw/react-codemirror';
import { sql } from '@codemirror/lang-sql';
import DetectiveBoard from '../components/DetectiveBoard';
import { Terminal, Play, Trash2, ShieldAlert, CheckCircle2, HelpCircle, Users, Eye, Search, Microscope, History, Network, ChevronLeft, ChevronRight, Check } from 'lucide-react';

export default function InvestigationWorkbenchView({ selectedCaseId, onSelectCase, onShowCaseSolved }) {
  const { db, player, isCaseUnlocked, completeCase, showToast } = usePlayer();
  const [activeCase, setActiveCase] = useState(null);
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

  // Pagination for query results
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Load case bundle whenever selectedCaseId changes
  useEffect(() => {
    const caseId = parseInt(selectedCaseId, 10);
    const caseData = db?.game_cases?.find((c) => c.id === caseId) || db?.game_cases?.[0];
    setActiveCase(caseData);

    const defaultQuery = `SELECT * FROM suspects WHERE case_id = ${caseId};`;
    setQuery(defaultQuery);

    const loadBundle = async () => {
      try {
        const res = await fetch(`/api/cases/${caseId}/full`);
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
      if (db) {
        setCaseBundle({
          case: caseData,
          suspects: db.suspects?.filter((s) => s.case_id === caseId) || [],
          witnesses: db.witnesses?.filter((w) => w.case_id === caseId) || [],
          evidence: db.evidence_locker?.filter((e) => e.case_id === caseId) || [],
          forensics: db.forensic_analysis?.filter((f) => f.case_id === caseId) || [],
          timeline: db.timeline?.filter((t) => t.case_id === caseId) || [],
          objectives: db.objectives?.filter((o) => o.case_id === caseId) || [],
          clues: db.clues?.filter((c) => c.case_id === caseId) || [],
        });
      }
    };

    loadBundle();
  }, [selectedCaseId, db]);

  // Execute SQL Query
  const handleRunQuery = async () => {
    if (!query.trim()) return;
    setIsExecuting(true);
    setQueryError(null);
    const startTime = performance.now();

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
        if (json.success) {
          setQueryResults(json.results || []);
          setCurrentPage(1);
          showToast(`⚡ QUERY ACCEPTED: ${(json.results || []).length} evidence rows extracted`, 'success');
        } else {
          setQueryError(json.error || 'Syntax error in SQL query');
          setQueryResults(null);
        }
      } else {
        const json = await res.json().catch(() => ({}));
        setQueryError(json.error || 'SQL Query Execution Failed');
        setQueryResults(null);
      }
    } catch (err) {
      setQueryError(`Client Execution Exception: ${err.message}`);
      setQueryResults(null);
    } finally {
      setIsExecuting(false);
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

  if (!activeCase) return null;

  const totalRows = queryResults?.length || 0;
  const totalPages = Math.ceil(totalRows / rowsPerPage) || 1;
  const displayedRows = queryResults?.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage) || [];

  return (
    <div className="max-w-[1540px] mx-auto px-4 py-4 space-y-4">
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

        {/* Case Selector Dropdown & Indict Button */}
        <div className="flex items-center gap-3">
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

      {/* 3-Column Workstation Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Objectives & Hints (3 Cols) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Objectives Card */}
          <div className="bg-[#141419] border border-[#262633] rounded-lg p-4 space-y-3 shadow-xl">
            <h3 className="text-xs font-bold text-[#d4af37] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#262633] pb-2 font-mono">
              <CheckCircle2 className="w-4 h-4 text-[#d4af37]" /> Investigation Objectives
            </h3>
            <div className="space-y-2 text-xs">
              {caseBundle?.objectives?.length > 0 ? (
                caseBundle.objectives.map((obj, i) => (
                  <div key={i} className="flex items-start gap-2 bg-[#0a0a0c] p-2.5 rounded border border-[#262633]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-[#e0e0e0] leading-snug">{obj.description || obj.title}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[#8a8a9e]">Examine suspect roster and forensic laboratory logs.</p>
              )}
            </div>
          </div>

          {/* Clue Hints Card */}
          <div className="bg-[#141419] border border-[#262633] rounded-lg p-4 space-y-3 shadow-xl">
            <h3 className="text-xs font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1.5 border-b border-[#262633] pb-2 font-mono">
              <HelpCircle className="w-4 h-4 text-amber-500" /> Investigative Clues
            </h3>
            <div className="space-y-2 text-xs">
              {caseBundle?.clues?.length > 0 ? (
                caseBundle.clues.map((clue, idx) => (
                  <div key={idx} className="bg-[#0a0a0c] border border-[#262633] p-2.5 rounded space-y-1">
                    <div className="flex justify-between items-center text-[#d4af37] font-bold text-[11px]">
                      <span>{clue.title || `Clue #${idx + 1}`}</span>
                      <button
                        onClick={() => setRevealedHints(prev => ({ ...prev, [idx]: !prev[idx] }))}
                        className="text-[10px] text-[#8a8a9e] hover:text-[#d4af37] border border-[#262633] px-1.5 py-0.5 rounded"
                      >
                        {revealedHints[idx] ? 'Hide' : 'Reveal Hint'}
                      </button>
                    </div>
                    {revealedHints[idx] ? (
                      <p className="text-xs text-[#e0e0e0] italic leading-relaxed pt-1 border-t border-[#262633]">
                        {clue.description || clue.hint_text}
                      </p>
                    ) : (
                      <p className="text-[10px] text-[#8a8a9e]">Click reveal to view forensic clue hint.</p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs text-[#8a8a9e]">No additional clues required for this investigation.</p>
              )}
            </div>
          </div>

          {/* SQL Templates Card */}
          <div className="bg-[#141419] border border-[#262633] rounded-lg p-4 space-y-3 shadow-xl">
            <h3 className="text-xs font-bold text-[#d4af37] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#262633] pb-2 font-mono">
              <Terminal className="w-4 h-4 text-[#d4af37]" /> Query Templates
            </h3>
            <div className="flex flex-col gap-1.5 text-xs font-mono">
              {[
                { label: 'SELECT Suspects', tpl: `SELECT * FROM suspects WHERE case_id = ${activeCase.id};` },
                { label: 'SELECT Evidence', tpl: `SELECT * FROM evidence_locker WHERE case_id = ${activeCase.id};` },
                { label: 'SELECT Forensics', tpl: `SELECT * FROM forensic_analysis WHERE case_id = ${activeCase.id};` },
                { label: 'SELECT Timeline', tpl: `SELECT * FROM timeline WHERE case_id = ${activeCase.id} ORDER BY time ASC;` },
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setQuery(item.tpl)}
                  className="bg-[#0a0a0c] hover:bg-[#262633] text-[#8a8a9e] hover:text-[#d4af37] text-left p-2 rounded border border-[#262633] transition-colors truncate"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center Column: CodeMirror SQL Terminal & Data Table (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
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
                height="160px"
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

          {/* Results Data Table */}
          <div className="bg-[#141419] border border-[#262633] rounded-lg p-4 space-y-3 min-h-[240px] shadow-xl">
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
              <div className="overflow-x-auto">
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
              <p className="text-xs text-[#8a8a9e] text-center py-10 font-mono">
                No query executed yet. Run a SQL query above to view canonical evidence rows.
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Tabbed Intelligence Dossier + Detective Board (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#141419] border border-[#262633] rounded-lg p-4 space-y-3 shadow-xl">
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
              <DetectiveBoard caseBundle={caseBundle} activeCaseId={activeCase.id} />
            ) : (
              <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1 text-xs">
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
