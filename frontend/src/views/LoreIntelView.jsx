import React, { useState } from 'react';
import { Scroll, Shield, Network, Eye, Skull, Crown, BookOpen, ChevronRight, Zap, Database } from 'lucide-react';

export default function LoreIntelView() {
  const [activeSection, setActiveSection] = useState('genesis');

  const storyArcs = [
    {
      act: "ACT I",
      title: "The Pattern (Cases 1–5)",
      color: "border-l-red-600 text-red-500",
      desc: "Industrialist Vikramaditya Nagabhavan is found poisoned inside a locked study at Nagabhavan Estate. Investigating the crime scene reveals synthetic Somalatha alkaloid residues, altered CCTV timestamps, and ancient Sanskrit temple ciphers bearing a recurring Naga serpent emblem."
    },
    {
      act: "ACT II",
      title: "The Conspiracy (Cases 6–10)",
      color: "border-l-[#d4af37] text-[#d4af37]",
      desc: "Cross-referencing forensic records with financial ledgers uncovers a web of 12 offshore shell accounts transferring funds to Saptarishi research laboratories. Key witnesses begin vanishing from police custody as government databases erase their digital identities."
    },
    {
      act: "ACT III",
      title: "The System (Cases 11–15)",
      color: "border-l-amber-500 text-amber-500",
      desc: "The Task Force exposes 'The Seven Shadows'—a secret council of intelligence directors, military chiefs, and tech barons. You discover the Maya Protocol: an AI surveillance engine that manufactures synthetic crime scene evidence and manipulates public narratives before homicides even occur."
    },
    {
      act: "ACT IV",
      title: "The Architect (Cases 16–18)",
      color: "border-l-emerald-500 text-emerald-400",
      desc: "In the final confrontation, Prasoon Task Force raids the underground Ninth Realm command bunker beneath New Delhi. Only bulletproof SQL queries, timeline reconstruction, and fingerprint corroboration will indict Dr. Vedant Kashyap (*The Sutradhar*) and dismantle Project Vritra."
    }
  ];

  const shadowCouncil = [
    { name: "Dr. Vedant Kashyap", codename: "The Sutradhar", domain: "Master Mind & Oracle AI Architect", status: "Primary Target (Case 18)" },
    { name: "General Vikram Ranawat", codename: "Shadow One", domain: "Military Defense & Paramilitary Arms", status: "Indicted (Case 11)" },
    { name: "Devika Oberoi", codename: "Shadow Two", domain: "Global FinTech & Offshore Banking", status: "Indicted (Case 9)" },
    { name: "Dr. Ananya Sen", codename: "Shadow Three", domain: "Synthetic Bio-Genetics & Somalatha Toxins", status: "Indicted (Case 2)" },
    { name: "Rohan Varma", codename: "Shadow Four", domain: "Media Manipulation & Maya Protocol AI", status: "Indicted (Case 12)" },
    { name: "Justice K. M. Shastri", codename: "Shadow Five", domain: "Judicial Surveillance & Identity Eradication", status: "Indicted (Case 10)" },
    { name: "Harshwardhan Rathore", codename: "Shadow Six", domain: "Political Engineering & Crimson Yagna", status: "Indicted (Case 13)" }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      {/* Page Header */}
      <div className="border-b border-[#262633] pb-6 space-y-2">
        <span className="text-xs font-mono font-bold text-[#d4af37] bg-[#d4af37]/10 border border-[#d4af37]/30 px-3 py-1 rounded">
          CLASSIFIED DEEP LORE & NARRATIVE ARCHIVE
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#e0e0e0] glow-text font-serif">
          Project Vritra Lore & Intel Dossier
        </h1>
        <p className="text-xs text-[#8a8a9e]">
          The Complete Backstory • The Saptarishi Shadow Network • The 4 Canonical Story Arcs • Ancient Vedic Ciphers
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#262633] pb-4">
        {[
          { id: 'genesis', label: '01. Mythological Genesis', icon: Scroll },
          { id: 'arcs', label: '02. The 4 Canonical Story Arcs', icon: Shield },
          { id: 'council', label: '03. The Seven Shadows Council', icon: Eye },
          { id: 'tech', label: '04. Maya Protocol & Oracle AI', icon: Network }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-bold uppercase transition-all ${
                activeSection === tab.id
                  ? 'bg-[#d4af37] text-black shadow-lg shadow-yellow-950/40'
                  : 'bg-[#141419] text-[#8a8a9e] hover:text-[#e0e0e0] border border-[#262633]'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Section 1: Genesis */}
      {activeSection === 'genesis' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="bg-[#141419] border border-[#262633] p-6 sm:p-8 rounded-lg space-y-4 shadow-xl">
            <h2 className="text-xl font-bold text-[#d4af37] font-serif flex items-center gap-2">
              <Scroll className="w-5 h-5 text-[#d4af37]" />
              The Ancient Genesis: Vritra & The Soma Rituals
            </h2>
            <p className="text-xs sm:text-sm text-[#e0e0e0] leading-relaxed">
              In ancient Sanskrit scriptures, <strong>Vritra</strong> (the serpent of drought and obstruction) personified the hoarding of knowledge and life-giving waters until slain by Indra. In the modern era, the Ninth Mandala resurrected this philosophy under <em>Project Vritra</em>—an covert intelligence agenda designed to hoard data, manipulate financial infrastructure, and control public truth across South Asia.
            </p>
            <p className="text-xs sm:text-sm text-[#8a8a9e] leading-relaxed">
              The murders across all 18 cases are tied together by the use of <strong>Somalatha extracts</strong>—synthetic neuro-toxins derived from ancient Ayurvedic formulas—and encrypted Sanskrit ciphers carved at crime scenes to mark victims targeted by the shadow network.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#0a0a0c] border border-[#262633] p-5 rounded-lg space-y-2">
              <h4 className="text-xs font-bold text-red-500 uppercase tracking-wider">01. The Naga Serpent Emblem</h4>
              <p className="text-xs text-[#8a8a9e]">A carved 7-headed serpent symbol found at Nagabhavan Estate, Rudra Peeth Monastery, and offshore bank vaults.</p>
            </div>
            <div className="bg-[#0a0a0c] border border-[#262633] p-5 rounded-lg space-y-2">
              <h4 className="text-xs font-bold text-[#d4af37] uppercase tracking-wider">02. Somalatha Toxin</h4>
              <p class="text-xs text-[#8a8a9e]">An undetectable synthetic botanical poison that induces cardiac arrest while leaving zero traces in standard autopsies.</p>
            </div>
            <div className="bg-[#0a0a0c] border border-[#262633] p-5 rounded-lg space-y-2">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">03. The Temple Manuscripts</h4>
              <p className="text-xs text-[#8a8a9e]">Ancient palm-leaf folios dating back centuries that contained the mathematical ciphers used to encrypt Project Vritra files.</p>
            </div>
          </div>
        </div>
      )}

      {/* Section 2: Story Arcs */}
      {activeSection === 'arcs' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-bold text-[#e0e0e0] font-serif">The 4 Canonical Story Arcs (Cases 1–18)</h2>
            <p className="text-xs text-[#8a8a9e]">Every solved case unlocks the next encrypted file in the Vritra campaign</p>
          </div>

          <div className="space-y-4">
            {storyArcs.map((arc, idx) => (
              <div key={idx} className={`bg-[#141419] border-l-4 ${arc.color} border border-[#262633] p-6 rounded-r-lg space-y-2 shadow-lg`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#d4af37]">{arc.act}</span>
                  <span className="text-xs font-semibold text-[#8a8a9e]">Campaign Phase {idx + 1}</span>
                </div>
                <h3 className={`text-lg font-bold ${arc.color.split(' ')[1]}`}>{arc.title}</h3>
                <p className="text-xs text-[#e0e0e0] leading-relaxed">{arc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 3: The Seven Shadows Council */}
      {activeSection === 'council' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-bold text-[#e0e0e0] font-serif">The Seven Shadows Council Directory</h2>
            <p className="text-xs text-[#8a8a9e]">The covert leadership behind 20 years of political homicides and database manipulation</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {shadowCouncil.map((member, idx) => (
              <div key={idx} className="bg-[#141419] border border-[#262633] hover:border-[#d4af37]/50 p-5 rounded-lg space-y-2 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-bold text-[#e0e0e0]">{member.name}</h3>
                    <span className="text-xs font-mono text-[#d4af37] font-semibold">{member.codename}</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-red-400 bg-red-950/50 border border-red-500/30 px-2 py-0.5 rounded">
                    {member.status}
                  </span>
                </div>
                <p className="text-xs text-[#8a8a9e]"><strong>Domain & Role:</strong> {member.domain}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 4: Maya Protocol & Oracle AI */}
      {activeSection === 'tech' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-[#141419] border border-[#262633] p-6 rounded-lg space-y-4 shadow-xl">
            <h2 className="text-xl font-bold text-amber-500 font-serif flex items-center gap-2">
              <Network className="w-5 h-5 text-amber-500" />
              The Maya Protocol & The Oracle Predictive Engine
            </h2>
            <p className="text-xs sm:text-sm text-[#e0e0e0] leading-relaxed">
              In Act III, Prasoon Task Force uncovers the <strong>Maya Protocol</strong>: an advanced artificial intelligence system capable of fabricating digital evidence, generating synthetic audio testimonies, and erasing victims from municipal birth and tax registries.
            </p>
            <p className="text-xs sm:text-sm text-[#8a8a9e] leading-relaxed">
              Paired with the <strong>Oracle Predictive Engine</strong>, the Ninth Mandala predicted social instability and engineered political crisis points years before they occurred. Solving Case 18 requires bypassing these predictive algorithms using raw SQL queries to expose Dr. Vedant Kashyap.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#0a0a0c] border border-[#262633] p-5 rounded-lg space-y-2">
              <h4 className="text-xs font-bold text-[#d4af37] uppercase tracking-wider flex items-center gap-1.5">
                <Database className="w-4 h-4" /> Synthetic Evidence Generator
              </h4>
              <p className="text-xs text-[#8a8a9e]">Injects manufactured fingerprint rows and deepfake phone calls into active police databases to frame innocent suspects.</p>
            </div>

            <div className="bg-[#0a0a0c] border border-[#262633] p-5 rounded-lg space-y-2">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-4 h-4" /> Predictive Crisis Engine
              </h4>
              <p className="text-xs text-[#8a8a9e]">Calculates optimal timing for assassinations and arson fires to achieve maximum political leverage for the Ninth Mandala.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
