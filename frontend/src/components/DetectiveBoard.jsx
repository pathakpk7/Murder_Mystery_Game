import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Eye, Microscope, ShieldAlert, X, Link, AlertTriangle } from 'lucide-react';

export default function DetectiveBoard({ caseBundle, activeCaseId }) {
  const [selectedNode, setSelectedNode] = useState(null);

  const suspects = caseBundle?.suspects || [];
  const evidence = caseBundle?.evidence || [];
  const witnesses = caseBundle?.witnesses || [];
  const forensics = caseBundle?.forensics || [];

  // Generate spatial nodes around central case node
  const nodes = [
    // Central Node
    { id: 'center', type: 'case', label: `CASE ${activeCaseId.toString().padStart(2, '0')}`, sub: caseBundle?.case?.title || 'Active Investigation', x: 50, y: 50 },

    // Suspect Nodes (top semicircle)
    ...suspects.slice(0, 4).map((s, idx) => ({
      id: `suspect-${idx}`,
      type: 'suspect',
      label: s.name,
      sub: s.occupation || s.role || 'Suspect',
      data: s,
      x: 20 + idx * 20,
      y: 20
    })),

    // Evidence Nodes (left side)
    ...evidence.slice(0, 3).map((e, idx) => ({
      id: `evidence-${idx}`,
      type: 'evidence',
      label: e.item_name || e.name,
      sub: e.found_location || 'Evidence',
      data: e,
      x: 15,
      y: 40 + idx * 25
    })),

    // Witness Nodes (right side)
    ...witnesses.slice(0, 3).map((w, idx) => ({
      id: `witness-${idx}`,
      type: 'witness',
      label: w.name,
      sub: w.role || 'Witness Statement',
      data: w,
      x: 85,
      y: 40 + idx * 25
    })),

    // Forensic Nodes (bottom)
    ...forensics.slice(0, 2).map((f, idx) => ({
      id: `forensic-${idx}`,
      type: 'forensic',
      label: f.analysis_type || f.title,
      sub: f.lab_tech || 'Laboratory Report',
      data: f,
      x: 35 + idx * 30,
      y: 80
    }))
  ];

  const getBorderColor = (type) => {
    switch (type) {
      case 'case': return 'border-red-600 bg-red-950/80 text-white';
      case 'suspect': return 'border-[#d4af37] bg-[#141419] text-[#e0e0e0]';
      case 'evidence': return 'border-emerald-500 bg-[#141419] text-[#e0e0e0]';
      case 'witness': return 'border-cyan-500 bg-[#141419] text-[#e0e0e0]';
      case 'forensic': return 'border-purple-500 bg-[#141419] text-[#e0e0e0]';
      default: return 'border-[#262633] bg-[#141419]';
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'case': return <ShieldAlert className="w-5 h-5 text-red-500" />;
      case 'suspect': return <Users className="w-4 h-4 text-[#d4af37]" />;
      case 'evidence': return <Search className="w-4 h-4 text-emerald-400" />;
      case 'witness': return <Eye className="w-4 h-4 text-cyan-400" />;
      case 'forensic': return <Microscope className="w-4 h-4 text-purple-400" />;
      default: return <Link className="w-4 h-4" />;
    }
  };

  return (
    <div className="relative bg-[#070709] border border-[#262633] rounded-lg p-6 min-h-[460px] overflow-hidden shadow-2xl space-y-4">
      {/* Board Header */}
      <div className="flex items-center justify-between border-b border-[#262633] pb-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span className="font-bold text-[#d4af37]">SPATIAL DETECTIVE BOARD • ACTIVE CRIME SCENE GRAPH</span>
        </div>
        <span className="text-[#8a8a9e]">Case {activeCaseId} • Click node to inspect</span>
      </div>

      {/* SVG Connecting Lines Canvas */}
      <div className="relative w-full h-[380px] bg-[radial-gradient(#262633_1px,transparent_1px)] [background-size:16px_16px]">
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {nodes.filter(n => n.id !== 'center').map((node, i) => (
            <motion.line
              key={i}
              x1="50%"
              y1="50%"
              x2={`${node.x}%`}
              y2={`${node.y}%`}
              stroke={node.type === 'suspect' ? '#d4af37' : node.type === 'evidence' ? '#10b981' : node.type === 'witness' ? '#06b6d4' : '#a855f7'}
              strokeWidth="1.5"
              strokeDasharray="4 4"
              initial={{ pathLength: 0, opacity: 0.3 }}
              animate={{ pathLength: 1, opacity: 0.7 }}
              transition={{ duration: 1, delay: i * 0.1 }}
            />
          ))}
        </svg>

        {/* Render Interactive Nodes */}
        {nodes.map((node) => (
          <motion.div
            key={node.id}
            onClick={() => node.data && setSelectedNode(node)}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            style={{ left: `${node.x}%`, top: `${node.y}%`, transform: 'translate(-50%, -50%)' }}
            className={`absolute cursor-pointer border-2 rounded-lg p-2.5 shadow-xl transition-all max-w-[140px] ${getBorderColor(node.type)}`}
          >
            <div className="flex items-center gap-1.5 font-bold text-xs truncate">
              {getIcon(node.type)}
              <span className="truncate">{node.label}</span>
            </div>
            <p className="text-[10px] text-[#8a8a9e] truncate mt-0.5">{node.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Selected Node Inspection Drawer Modal */}
      {selectedNode && (
        <div className="absolute bottom-4 left-4 right-4 bg-[#141419] border border-[#d4af37] p-4 rounded-lg shadow-2xl z-30 space-y-2 animate-in slide-in-from-bottom-5">
          <div className="flex items-center justify-between border-b border-[#262633] pb-2">
            <span className="text-xs font-bold text-[#d4af37] uppercase flex items-center gap-1.5 font-mono">
              {getIcon(selectedNode.type)}
              {selectedNode.type.toUpperCase()}: {selectedNode.label}
            </span>
            <button onClick={() => setSelectedNode(null)} className="text-[#8a8a9e] hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="text-xs text-[#e0e0e0] space-y-1">
            {selectedNode.data.motive && <p><strong>Motive:</strong> {selectedNode.data.motive}</p>}
            {selectedNode.data.alibi && <p><strong>Alibi:</strong> {selectedNode.data.alibi}</p>}
            {selectedNode.data.description && <p><strong>Description:</strong> {selectedNode.data.description}</p>}
            {selectedNode.data.statement && <p><strong>Statement:</strong> "{selectedNode.data.statement}"</p>}
            {selectedNode.data.findings && <p><strong>Findings:</strong> {selectedNode.data.findings}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
