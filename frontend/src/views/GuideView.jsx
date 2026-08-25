import React, { useState } from 'react';
import { BookOpen, Shield, ChevronLeft, ChevronRight, Lock, Unlock, Copy, Check, Terminal, MapPin, Skull, FileText } from 'lucide-react';

export default function GuideView() {
  const [currentPage, setCurrentPage] = useState(0); // 0 = Cover, 1-19 = Cases 0-18
  const [decryptedPages, setDecryptedPages] = useState({});
  const [copiedQueryIndex, setCopiedQueryIndex] = useState(null);

  const guideData = [
    {
      caseId: 0,
      title: "Detective Academy: Missing Evidence",
      act: "Tutorial",
      difficulty: "Easy",
      duration: 15,
      theme: "Training Protocol",
      primarySuspect: "Raghav Sethi (Fingerprint ID #409)",
      story: "You have just joined the Investigation Division under Prasoon Pathak. Before working on live homicides, you must audit the evidence locker to learn SQL filtering and sorting.",
      clues: [
        "Status column contains 'Missing' entries.",
        "Evidence items are tagged by laboratory department.",
        "Group by item_type to locate inventory discrepancies."
      ],
      queries: [
        { title: "Audit All Locker Records", sql: "SELECT * FROM evidence_locker;" },
        { title: "Isolate Missing Evidence Items", sql: "SELECT * FROM evidence_locker WHERE status = 'Missing';" },
        { title: "Group Inventory Count by Type", sql: "SELECT item_type, COUNT(*) FROM evidence_locker GROUP BY item_type;" },
        { title: "Sort Items Chronologically", sql: "SELECT * FROM evidence_locker ORDER BY date_added ASC;" }
      ]
    },
    {
      caseId: 1,
      title: "The Nagabhavan Estate Mystery",
      act: "Act I — The Pattern",
      difficulty: "Easy",
      duration: 20,
      theme: "Naga Serpent Symbol",
      primarySuspect: "Raghav Sethi (Business Rival)",
      story: "Industrialist Rajveer Rathore is found dead inside his sealed study at Nagabhavan Estate. What appears to be suicide reveals signs of synthetic Soma poisoning.",
      clues: [
        "A rare Naga serpent emblem carved under the mahogany desk.",
        "Fingerprint laboratory analysis matches suspect Raghav Sethi.",
        "Altered CCTV timestamps reveal an alibi gap between 11:30 PM and 1 midnight."
      ],
      queries: [
        { title: "Interrogate Registered Suspects", sql: "SELECT * FROM suspects WHERE case_id = 1;" },
        { title: "Review Witness Statements", sql: "SELECT * FROM witnesses WHERE case_id = 1;" },
        { title: "Examine Forensic Toxicology Reports", sql: "SELECT * FROM forensics WHERE case_id = 1;" },
        { title: "Reconstruct Crime Scene Timeline", sql: "SELECT * FROM timeline WHERE case_id = 1 ORDER BY time ASC;" },
        { title: "Uncover Serpent Symbol Evidence", sql: "SELECT * FROM evidence WHERE case_id = 1 AND description LIKE '%serpent%';" }
      ]
    },
    {
      caseId: 2,
      title: "The Poisoned Soma",
      act: "Act I — The Pattern",
      difficulty: "Easy",
      duration: 25,
      theme: "Soma Ritual",
      primarySuspect: "Dr. Acharya Devendra Mishra / Saptarishi Chemist",
      story: "Scholar Devendra Mishra collapses during a private symposium after drinking a ceremonial Soma preparation. Forensic reports point to synthetic Somalatha toxins.",
      clues: [
        "Traces of synthetic Somalatha alkaloid in the brass goblet.",
        "Laboratory transfer notes link the toxin to Saptarishi research labs.",
        "Server alibi gaps during the ceremonial toast."
      ],
      queries: [
        { title: "Query Suspect Rosters", sql: "SELECT * FROM suspects WHERE case_id = 2;" },
        { title: "Isolate Chemical Toxicology Findings", sql: "SELECT * FROM forensics WHERE case_id = 2 AND toxic_signature = 'Soma-Synthetic';" },
        { title: "Reconstruct Chronological Timeline", sql: "SELECT * FROM timeline WHERE case_id = 2 ORDER BY time ASC;" }
      ]
    },
    {
      caseId: 3,
      title: "The Temple Cipher",
      act: "Act I — The Pattern",
      difficulty: "Easy",
      duration: 30,
      theme: "Ancient Temple Records",
      primarySuspect: "Acharya Vedika Rao (Temple Gate Curator)",
      story: "A temple archivist is murdered after decoding an ancient Sanskrit inscription describing the Ninth Mandala and its secret network.",
      clues: [
        "Encrypted parchment fragment hidden behind the Sun Temple altar.",
        "Missing palm-leaf manuscript detailing ancient serpent dynasties."
      ],
      queries: [
        { title: "Search Serpent Cipher Evidence", sql: "SELECT * FROM evidence WHERE case_id = 3 AND description LIKE '%serpent%';" },
        { title: "Audit Temple Gate Access Logs", sql: "SELECT * FROM suspects WHERE case_id = 3;" }
      ]
    },
    {
      caseId: 4,
      title: "The Silent Devotee",
      act: "Act I — The Pattern",
      difficulty: "Easy",
      duration: 30,
      theme: "Monastic Secrets",
      primarySuspect: "Swami Narottam (Monastery Head)",
      story: "A monk who took a vow of silence is murdered at Rudra Peeth Monastery. Before dying, he writes a final cipher in sacred ash.",
      clues: [
        "Ash cipher matches the Nagabhavan serpent emblem.",
        "Monastery gate access logs contradict suspect witness statements."
      ],
      queries: [
        { title: "Join Suspects with Alibi Timelines", sql: "SELECT s.name, t.time, t.event FROM suspects s JOIN timeline t ON s.id = t.suspect_id WHERE s.case_id = 4;" },
        { title: "Search Sacred Ash Evidence", sql: "SELECT * FROM evidence WHERE case_id = 4 AND item_name LIKE '%Ash%';" }
      ]
    },
    {
      caseId: 5,
      title: "The Ashes of Dharma",
      act: "Act I — The Pattern",
      difficulty: "Easy",
      duration: 35,
      theme: "Dharma and Power",
      primarySuspect: "Devendra Oberoi (Saptarishi Bio-Tech Arsonist)",
      story: "Politician Devendra Pratap Singh dies in an arson fire hours before exposing Project Vritra. Intercepted radio transmissions mention 'The Seven Shadows'.",
      clues: [
        "Military arson accelerant residues found in the estate study.",
        "Radio intercepts linking firebombers to the Ninth Mandala."
      ],
      queries: [
        { title: "Isolate Ninth Mandala Motives", sql: "SELECT * FROM suspects WHERE case_id = 5 AND primary_motive = 'Ninth Mandala';" },
        { title: "Audit Arson Forensic Reports", sql: "SELECT * FROM forensics WHERE case_id = 5 AND analysis_type = 'Arson Accelerant';" }
      ]
    },
    {
      caseId: 6,
      title: "The Twin Illusion",
      act: "Act II — The Conspiracy",
      difficulty: "Medium",
      duration: 40,
      theme: "Maya and Identity",
      primarySuspect: "Vikramaditya Rathore (The Twin Identity)",
      story: "A man declared dead 5 years ago resurfaces in offshore bank ledgers under an alias, transferring funds to Saptarishi accounts.",
      clues: [
        "Dual passport records registered under corporate aliases.",
        "Wire transfers exceeding 1,000,000 INR."
      ],
      queries: [
        { title: "Audit High-Value Financial Transfers", sql: "SELECT * FROM financial_ledgers WHERE case_id = 6 AND amount > 1000000;" },
        { title: "Isolate Suspect Aliases", sql: "SELECT * FROM suspects WHERE case_id = 6 AND alias_name IS NOT NULL;" }
      ]
    },
    {
      caseId: 7,
      title: "The Wheel of Time",
      act: "Act II — The Conspiracy",
      difficulty: "Medium",
      duration: 45,
      theme: "Kalachakra",
      primarySuspect: "Anand Vardhan (Kalachakra System Analyst)",
      story: "A government data analyst is murdered after discovering altered historical event logs and manipulated government servers.",
      clues: [
        "Altered database timestamps on central server racks.",
        "High-credibility witness statements contradicting police reports."
      ],
      queries: [
        { title: "Query High-Credibility Witnesses", sql: "SELECT * FROM witness_statements WHERE case_id = 7 AND credibility_score > 8;" },
        { title: "Reconstruct Audit Timeline", sql: "SELECT * FROM timeline WHERE case_id = 7 ORDER BY time ASC;" }
      ]
    },
    {
      caseId: 8,
      title: "The Forgotten Monk",
      act: "Act II — The Conspiracy",
      difficulty: "Medium",
      duration: 45,
      theme: "Memory and Samskara",
      primarySuspect: "Dr. Rohan Acharya (Neuroscience Director)",
      story: "Classified records reveal a monk subjected to psychological memory suppression experiments in a hidden laboratory.",
      clues: [
        "Encrypted clinical notes stored in evidence locker.",
        "Synthetic neuro-toxin forensic reports."
      ],
      queries: [
        { title: "Inspect Encrypted Evidence Files", sql: "SELECT * FROM evidence_locker WHERE case_id = 8 AND is_encrypted = true;" },
        { title: "Audit Neurological Forensic Reports", sql: "SELECT * FROM forensics WHERE case_id = 8 AND type = 'Neurological';" }
      ]
    },
    {
      caseId: 9,
      title: "The Serpent Ledger",
      act: "Act II — The Conspiracy",
      difficulty: "Medium",
      duration: 50,
      theme: "Naga Treasury",
      primarySuspect: "Rajat Bhandari (Chartered Accountant)",
      story: "An auditor is murdered after tracing a web of 12 shell corporations back to Dr. Vedant Kashyap (*The Sutradhar*).",
      clues: [
        "Offshore Swiss bank codes matching Saptarishi accounts.",
        "Encrypted PDF ledgers recovered from victim's laptop."
      ],
      queries: [
        { title: "Audit Kashyap Laboratory Reports", sql: "SELECT * FROM forensic_analysis WHERE case_id = 9 AND lab_tech = 'Dr. Vedant Kashyap';" },
        { title: "Query Financial Shell Ledgers", sql: "SELECT * FROM financial_ledgers WHERE case_id = 9;" }
      ]
    },
    {
      caseId: 10,
      title: "The Vanishing Disciple",
      act: "Act II — The Conspiracy",
      difficulty: "Medium",
      duration: 55,
      theme: "Maya and Identity",
      primarySuspect: "Ashwin Kapoor (National Records Officer)",
      story: "A key whistleblower disappears from police custody, and his birth records vanish from government database servers.",
      clues: [
        "Erased database rows matching whistleblower identity.",
        "Synthetic identity certificates produced by inner circle."
      ],
      queries: [
        { title: "Identify Primary Guilty Perpetrator", sql: "SELECT * FROM suspects WHERE case_id = 10 AND is_guilty = true;" },
        { title: "Search Erased Evidence Records", sql: "SELECT * FROM evidence WHERE case_id = 10 AND status = 'Erased';" }
      ]
    },
    {
      caseId: 11,
      title: "The Seven Shadows",
      act: "Act III — The System",
      difficulty: "Hard",
      duration: 60,
      theme: "Sapta Rishi Parallel",
      primarySuspect: "Viraj Khatri (Former Intelligence Director)",
      story: "A retired general is assassinated after drafting a dossier on the 7 shadow directors controlling Project Vritra.",
      clues: [
        "Encrypted shadow council roster.",
        "Ballistic rifling matching military sniper rifles."
      ],
      queries: [
        { title: "Query Shadow Council Roster", sql: "SELECT * FROM suspects WHERE case_id = 11 AND rank_title = 'Shadow Council';" },
        { title: "Audit Ballistic Forensic Reports", sql: "SELECT * FROM forensics WHERE case_id = 11 AND type = 'Ballistics';" }
      ]
    },
    {
      caseId: 12,
      title: "The Maya Protocol",
      act: "Act III — The System",
      difficulty: "Hard",
      duration: 65,
      theme: "Maya AI",
      primarySuspect: "Shadow #1 — Devendra Oberoi (The Architect)",
      story: "A digital investigator discovers an AI system that generates synthetic crime scene evidence automatically.",
      clues: [
        "AI deepfake audio recordings.",
        "Manufactured fingerprint evidence rows."
      ],
      queries: [
        { title: "Query AI Surveillance Logs", sql: "SELECT * FROM ai_surveillance_logs WHERE case_id = 12;" },
        { title: "Isolate Synthetic Evidence Rows", sql: "SELECT * FROM evidence_locker WHERE case_id = 12 AND is_synthetic = true;" }
      ]
    },
    {
      caseId: 13,
      title: "The Crimson Yagna",
      act: "Act III — The System",
      difficulty: "Hard",
      duration: 70,
      theme: "Sacrifice and Order",
      primarySuspect: "Shadow #2 — Rajat Bhandari (The Banker)",
      story: "A sociologist is murdered after proving that 15 public riots over 20 years were intentionally engineered by the Ninth Mandala.",
      clues: [
        "Psychological profiling ledgers.",
        "Financial payouts to riot leaders."
      ],
      queries: [
        { title: "Query Predictive Yagna Cases", sql: "SELECT * FROM predictive_cases WHERE case_id = 13;" },
        { title: "Audit Orchestrator Suspect Profiles", sql: "SELECT * FROM suspects WHERE case_id = 13 AND role = 'Orchestrator';" }
      ]
    },
    {
      caseId: 14,
      title: "The Oracle Network",
      act: "Act III — The System",
      difficulty: "Hard",
      duration: 75,
      theme: "Trikal Darshan",
      primarySuspect: "Shadow #3 — Acharya Vedika (The Scholar)",
      story: "An engineer on the Oracle Predictive System is found dead inside the server vault after leaking predictive algorithms.",
      clues: [
        "Server rack access logs.",
        "Encrypted predictive code repository."
      ],
      queries: [
        { title: "Isolate Synthetic Vault Evidence", sql: "SELECT * FROM evidence_locker WHERE case_id = 14 AND is_synthetic = true;" },
        { title: "Reconstruct Server Vault Timeline", sql: "SELECT * FROM timeline WHERE case_id = 14 ORDER BY time ASC;" }
      ]
    },
    {
      caseId: 15,
      title: "The Hidden Manuscript",
      act: "Act III — The System",
      difficulty: "Hard",
      duration: 80,
      theme: "Mahabharata - Sutradhar",
      primarySuspect: "Shadow #4 — Viraj Khatri (The General)",
      story: "A historian is killed while translating a 300-year-old manuscript outlining the philosophical blueprint for Project Vritra.",
      clues: [
        "Sanskrit parchment folio describing the Sutradhar.",
        "Ancient wax seal matching Ninth Mandala emblems."
      ],
      queries: [
        { title: "Isolate Treasonous Suspect Profiles", sql: "SELECT * FROM suspects WHERE case_id = 15 AND high_treason = true;" },
        { title: "Query Manuscript Evidence Records", sql: "SELECT * FROM evidence WHERE case_id = 15 AND type = 'Manuscript';" }
      ]
    },
    {
      caseId: 16,
      title: "The Vritra Cycle",
      act: "Act IV — The Architect",
      difficulty: "Hard",
      duration: 90,
      theme: "Cycle of Creation and Destruction",
      primarySuspect: "Shadow #5 — Ishaan Trivedi (The Cryptographer)",
      story: "An archivist is murdered inside the master vault, leaving behind a hard drive linking all 18 cases directly to Dr. Kashyap.",
      clues: [
        "Master case index hard drive.",
        "Biometric access logs."
      ],
      queries: [
        { title: "Query Sutradhar Codename Records", sql: "SELECT * FROM suspects WHERE case_id = 16 AND codename = 'Sutradhar';" },
        { title: "Audit Vault Forensic Reports", sql: "SELECT * FROM forensics WHERE case_id = 16;" }
      ]
    },
    {
      caseId: 17,
      title: "The Ninth Realm",
      act: "Act IV — The Architect",
      difficulty: "Hard",
      duration: 95,
      theme: "Navam Loka",
      primarySuspect: "Maya Protocol AI Central Engine Core",
      story: "Prasoon Task Force raids the underground command bunker of the Ninth Mandala in New Delhi.",
      clues: [
        "Mainframe server logs.",
        "Encrypted 256-bit security ciphers."
      ],
      queries: [
        { title: "Decrypt 256-Bit Security Ciphers", sql: "SELECT * FROM ciphers WHERE case_id = 17 AND key_length = 256;" },
        { title: "Query Bunker Command Suspects", sql: "SELECT * FROM suspects WHERE case_id = 17;" }
      ]
    },
    {
      caseId: 18,
      title: "The Last Witness",
      act: "Act IV — The Architect",
      difficulty: "Hard",
      duration: 120,
      theme: "End of Kali Yuga",
      primarySuspect: "Dr. Vedant Kashyap (The Sutradhar Mastermind)",
      story: "Dr. Vedant Kashyap (*The Sutradhar*) makes his final move. You must execute final SQL queries to indict the mastermind behind Project Vritra.",
      clues: [
        "Direct wire transfers from Kashyap's private account.",
        "Somalatha poison formula signature.",
        "Biometric security video corroboration."
      ],
      queries: [
        { title: "Interrogate Mastermind Dr. Vedant Kashyap", sql: "SELECT * FROM suspects WHERE case_id = 18 AND name = 'Dr. Vedant Kashyap';" },
        { title: "Cross-Reference Biometric Culprit Match", sql: "SELECT * FROM forensics WHERE case_id = 18 AND culprit_match = 'Dr. Vedant Kashyap';" },
        { title: "Execute Final Indictment Join Query", sql: "SELECT s.name, s.role, f.toxic_signature, t.event FROM suspects s JOIN forensics f ON s.case_id = f.case_id JOIN timeline t ON s.case_id = t.case_id WHERE s.case_id = 18 AND s.is_guilty = true;" }
      ]
    }
  ];

  const currentCase = currentPage > 0 ? guideData[currentPage - 1] : null;
  const isDecrypted = decryptedPages[currentPage] || false;

  const toggleDecryption = (pageNum) => {
    setDecryptedPages((prev) => ({
      ...prev,
      [pageNum]: !prev[pageNum]
    }));
  };

  const handleCopyQuery = (sqlText, idx) => {
    navigator.clipboard.writeText(sqlText);
    setCopiedQueryIndex(idx);
    setTimeout(() => setCopiedQueryIndex(null), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Dossier Book Title Header */}
      <div className="text-center space-y-2 border-b border-[#262633] pb-6">
        <span className="inline-flex items-center gap-1.5 bg-red-950/50 border border-red-500/40 text-red-400 px-3.5 py-1 rounded-full text-xs font-mono font-bold tracking-widest">
          <Skull className="w-3.5 h-3.5" />
          CLASSIFIED FIELD DOSSIER • BLOODSHED & INVESTIGATION
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#e0e0e0] font-serif tracking-tight glow-text">
          The Sutradhar Casebook
        </h1>
        <p className="text-xs text-[#8a8a9e]">Flip through the pages of the Task Force manual to uncover case clues & forensic SQL decrypts</p>
      </div>

      {/* Book Frame Container (Dark Leather & Blood-Red Crimson Aesthetic) */}
      <div className="relative bg-[#0d0d12] border-4 border-[#8b0000] rounded-xl shadow-2xl overflow-hidden p-6 sm:p-10 space-y-8 min-h-[580px] flex flex-col justify-between" style={{
        backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(139, 0, 0, 0.05) 0%, rgba(10, 10, 12, 0.95) 100%)'
      }}>
        {/* Brass Corner Accents */}
        <div className="absolute top-2 left-2 text-[#d4af37]/40 text-xs font-mono">◆ CLASSIFIED</div>
        <div className="absolute top-2 right-2 text-[#d4af37]/40 text-xs font-mono">TASK FORCE TOP SECRET ◆</div>

        {/* Page Content: Cover (Page 0) or Case Dossier Page (Pages 1-19) */}
        {currentPage === 0 ? (
          /* Page 0: Cover & Interactive Chapter Map */
          <div className="space-y-8 text-center my-auto">
            <div className="space-y-3">
              <div className="w-20 h-20 mx-auto rounded-full bg-red-950/60 border-2 border-[#d4af37] flex items-center justify-center text-[#d4af37] shadow-xl">
                <BookOpen className="w-10 h-10" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#d4af37] font-serif">
                PROJECT VRITRA MASTER INVESTIGATION MAP
              </h2>
              <p className="text-xs text-[#8a8a9e] max-w-lg mx-auto leading-relaxed">
                This field casebook contains official crime scene dossiers, forensic clues, and encrypted SQL query walkthroughs for all 19 cases. Click any node below to turn directly to that case file.
              </p>
            </div>

            {/* Interactive Chapter Node Map Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 pt-4 max-w-4xl mx-auto">
              {guideData.map((g, idx) => (
                <button
                  key={g.caseId}
                  onClick={() => setCurrentPage(idx + 1)}
                  className="bg-[#141419] hover:bg-[#8b0000]/20 border border-[#262633] hover:border-[#d4af37] p-2.5 rounded-md text-left transition-all group space-y-1"
                >
                  <div className="flex items-center justify-between text-[10px] font-mono font-bold text-[#d4af37]">
                    <span>CASE {g.caseId.toString().padStart(2, '0')}</span>
                    <MapPin className="w-3 h-3 text-[#d4af37] group-hover:scale-110" />
                  </div>
                  <p className="text-[11px] font-semibold text-[#e0e0e0] truncate group-hover:text-white">{g.title}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Case Page (Pages 1-19) */
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Case Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#8b0000]/40 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#d4af37] bg-[#d4af37]/10 px-2.5 py-0.5 rounded border border-[#d4af37]/30">
                    CASE {currentCase.caseId.toString().padStart(2, '0')} • PAGE {currentPage} OF 19
                  </span>
                  <span className="text-xs font-bold text-red-400 font-mono">{currentCase.act}</span>
                </div>
                <h2 className="text-2xl font-extrabold text-[#e0e0e0] font-serif mt-1">{currentCase.title}</h2>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="bg-[#141419] border border-[#262633] px-3 py-1 rounded text-[#8a8a9e]">
                  Difficulty: <strong className="text-[#d4af37]">{currentCase.difficulty}</strong>
                </span>
                <span className="bg-[#141419] border border-[#262633] px-3 py-1 rounded text-[#8a8a9e]">
                  Theme: <strong className="text-[#e0e0e0]">{currentCase.theme}</strong>
                </span>
              </div>
            </div>

            {/* Story Backdrop */}
            <div className="bg-[#0a0a0c] border border-[#262633] p-4 rounded-md space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#262633] pb-2">
                <h4 className="text-xs font-bold text-[#d4af37] uppercase tracking-wider flex items-center gap-1.5 font-mono">
                  <FileText className="w-3.5 h-3.5" /> Crime Scene Briefing & Backstory
                </h4>
                {currentCase?.primarySuspect && (
                  <span className="text-xs font-mono font-bold text-red-400 bg-red-950/60 border border-red-500/50 px-2.5 py-1 rounded inline-flex items-center gap-1 shadow-md">
                    <Skull className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    <span>Primary Suspect: <strong className="text-white">{currentCase.primarySuspect}</strong></span>
                  </span>
                )}
              </div>
              <p className="text-xs text-[#e0e0e0] leading-relaxed pt-0.5">{currentCase.story}</p>
            </div>

            {/* Clues Breakdown */}
            <div className="bg-[#0a0a0c] border border-[#262633] p-4 rounded-md space-y-2">
              <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                <Skull className="w-3.5 h-3.5" /> Key Forensic Clues
              </h4>
              <ul className="list-disc list-inside text-xs text-[#8a8a9e] space-y-1">
                {currentCase.clues.map((clue, idx) => (
                  <li key={idx} className="leading-snug">{clue}</li>
                ))}
              </ul>
            </div>

            {/* Encrypted SQL Evidence Box (Hidden until Decrypted) */}
            <div className="bg-[#141419] border border-[#8b0000]/60 p-5 rounded-md space-y-4">
              <div className="flex items-center justify-between border-b border-[#262633] pb-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#d4af37]">
                  <Terminal className="w-4 h-4" />
                  <span>ENCRYPTED FORENSIC SQL EVIDENCE LEDGER</span>
                </div>

                <button
                  onClick={() => toggleDecryption(currentPage)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded text-xs font-bold uppercase transition-all ${
                    isDecrypted
                      ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-400'
                      : 'bg-[#8b0000] hover:bg-[#b22222] text-white shadow-md'
                  }`}
                >
                  {isDecrypted ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                  {isDecrypted ? 'Hide Decryption' : '🔓 Decrypt SQL Queries'}
                </button>
              </div>

              {isDecrypted ? (
                <div className="space-y-3 animate-in fade-in duration-200">
                  {currentCase.queries.map((q, qIdx) => (
                    <div key={qIdx} className="bg-[#0a0a0c] border border-[#262633] p-3 rounded font-mono text-xs space-y-1">
                      <div className="flex items-center justify-between text-[#d4af37] font-bold">
                        <span>Step {qIdx + 1}: {q.title}</span>
                        <button
                          onClick={() => handleCopyQuery(q.sql, qIdx)}
                          className="flex items-center gap-1 text-[10px] text-[#8a8a9e] hover:text-[#d4af37] border border-[#262633] px-2 py-0.5 rounded transition-colors"
                        >
                          {copiedQueryIndex === qIdx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          {copiedQueryIndex === qIdx ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                      <code className="text-emerald-400 block whitespace-pre-wrap">{q.sql}</code>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center text-xs text-[#8a8a9e] space-y-2">
                  <Lock className="w-8 h-8 text-red-500/60 mx-auto" />
                  <p>SQL Solution queries are encrypted to prevent spoilers. Click <strong>"🔓 DECRYPT SQL QUERIES"</strong> to reveal exact forensic queries.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer Navigation Bar (Flip Previous / Next Page) */}
        <div className="flex items-center justify-between border-t border-[#8b0000]/40 pt-4 text-xs font-mono">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 0))}
            disabled={currentPage === 0}
            className="flex items-center gap-1.5 bg-[#141419] hover:bg-[#262633] disabled:opacity-40 disabled:hover:bg-[#141419] text-[#e0e0e0] px-4 py-2 rounded border border-[#262633] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous Page
          </button>

          <button
            onClick={() => setCurrentPage(0)}
            className="text-[#d4af37] hover:underline font-bold"
          >
            {currentPage === 0 ? 'COVER INDEX MAP' : 'CHAPTER MAP INDEX'}
          </button>

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, 19))}
            disabled={currentPage === 19}
            className="flex items-center gap-1.5 bg-[#8b0000] hover:bg-[#b22222] disabled:opacity-40 text-white px-4 py-2 rounded transition-colors shadow"
          >
            Next Page
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
