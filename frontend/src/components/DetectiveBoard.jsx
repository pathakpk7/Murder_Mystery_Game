import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, Eye, Microscope, ShieldAlert, X, Link, Maximize2, Minimize2, Filter, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

export default function DetectiveBoard({ caseBundle, activeCaseId }) {
  const [selectedNode, setSelectedNode] = useState(null);
  const [hoveredNodeId, setHoveredNodeId] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  const safeCaseId = activeCaseId ?? 0;
  const suspects = caseBundle?.suspects || [];
  const evidence = caseBundle?.evidence || [];
  const witnesses = caseBundle?.witnesses || [];
  const forensics = caseBundle?.forensics || [];

  const handleZoom = (delta) => {
    setZoomLevel(prev => Math.min(1.8, Math.max(0.7, +(prev + delta).toFixed(1))));
  };

  // Generate non-overlapping orbital spatial nodes
  const generateNodes = () => {
    const nodeList = [
      // Central Case Node (always centered at 50%, 50%)
      {
        id: 'center',
        type: 'case',
        label: `CASE ${safeCaseId.toString().padStart(2, '0')}`,
        sub: caseBundle?.case?.title || 'Active Investigation',
        x: 50,
        y: 50,
        data: caseBundle?.case
      }
    ];

    if (activeFilter !== 'all') {
      // Single category filter: distribute active nodes evenly around a 360-degree circle
      let targetItems = [];
      if (activeFilter === 'suspect') targetItems = suspects.map((s, i) => ({ item: s, id: `suspect-${i}`, type: 'suspect', label: s.name, sub: s.occupation || s.role || 'Suspect' }));
      else if (activeFilter === 'evidence') targetItems = evidence.map((e, i) => ({ item: e, id: `evidence-${i}`, type: 'evidence', label: e.item_name || e.name, sub: e.found_location || 'Crime Scene Evidence' }));
      else if (activeFilter === 'witness') targetItems = witnesses.map((w, i) => ({ item: w, id: `witness-${i}`, type: 'witness', label: w.name, sub: w.role || 'Witness Statement' }));
      else if (activeFilter === 'forensic') targetItems = forensics.map((f, i) => ({ item: f, id: `forensic-${i}`, type: 'forensic', label: f.analysis_type || f.title || f.name, sub: f.lab_tech || 'Laboratory Report' }));

      const count = targetItems.length;
      targetItems.forEach((t, idx) => {
        const angleDeg = (idx * (360 / Math.max(count, 1))) - 90;
        const angleRad = (angleDeg * Math.PI) / 180;
        const radius = idx % 2 === 0 ? 32 : 42;
        const xPos = 50 + radius * 1.15 * Math.cos(angleRad);
        const yPos = 50 + radius * 0.85 * Math.sin(angleRad);

        nodeList.push({
          id: t.id,
          type: t.type,
          label: t.label,
          sub: t.sub,
          data: t.item,
          x: Math.round(Math.max(12, Math.min(88, xPos))),
          y: Math.round(Math.max(12, Math.min(88, yPos)))
        });
      });

      return nodeList;
    }

    // "All" mode: Four distinct quadrant sectors with staggered inner/outer orbits
    // 1. Suspects (Top Sector: -135deg to -45deg)
    const sCount = suspects.length;
    suspects.forEach((s, idx) => {
      const startAngle = -135;
      const endAngle = -45;
      const step = sCount > 1 ? (endAngle - startAngle) / (sCount - 1) : 0;
      const angleDeg = sCount === 1 ? -90 : startAngle + idx * step;
      const angleRad = (angleDeg * Math.PI) / 180;
      const radius = idx % 2 === 0 ? 30 : 42;
      const xPos = 50 + radius * 1.15 * Math.cos(angleRad);
      const yPos = 50 + radius * 0.85 * Math.sin(angleRad);

      nodeList.push({
        id: `suspect-${idx}`,
        type: 'suspect',
        label: s.name,
        sub: s.occupation || s.role || 'Suspect',
        data: s,
        x: Math.round(Math.max(10, Math.min(90, xPos))),
        y: Math.round(Math.max(10, Math.min(88, yPos)))
      });
    });

    // 2. Witnesses (Right Sector: -35deg to 35deg)
    const wCount = witnesses.length;
    witnesses.forEach((w, idx) => {
      const startAngle = -35;
      const endAngle = 35;
      const step = wCount > 1 ? (endAngle - startAngle) / (wCount - 1) : 0;
      const angleDeg = wCount === 1 ? 0 : startAngle + idx * step;
      const angleRad = (angleDeg * Math.PI) / 180;
      const radius = idx % 2 === 0 ? 32 : 42;
      const xPos = 50 + radius * 1.15 * Math.cos(angleRad);
      const yPos = 50 + radius * 0.85 * Math.sin(angleRad);

      nodeList.push({
        id: `witness-${idx}`,
        type: 'witness',
        label: w.name,
        sub: w.role || 'Witness Statement',
        data: w,
        x: Math.round(Math.max(10, Math.min(90, xPos))),
        y: Math.round(Math.max(12, Math.min(88, yPos)))
      });
    });

    // 3. Evidence (Left Sector: 145deg to 215deg)
    const eCount = evidence.length;
    evidence.forEach((e, idx) => {
      const startAngle = 145;
      const endAngle = 215;
      const step = eCount > 1 ? (endAngle - startAngle) / (eCount - 1) : 0;
      const angleDeg = eCount === 1 ? 180 : startAngle + idx * step;
      const angleRad = (angleDeg * Math.PI) / 180;
      const radius = idx % 2 === 0 ? 32 : 42;
      const xPos = 50 + radius * 1.15 * Math.cos(angleRad);
      const yPos = 50 + radius * 0.85 * Math.sin(angleRad);

      nodeList.push({
        id: `evidence-${idx}`,
        type: 'evidence',
        label: e.item_name || e.name,
        sub: e.found_location || 'Crime Scene Evidence',
        data: e,
        x: Math.round(Math.max(10, Math.min(90, xPos))),
        y: Math.round(Math.max(12, Math.min(88, yPos)))
      });
    });

    // 4. Forensics (Bottom Sector: 55deg to 125deg)
    const fCount = forensics.length;
    forensics.forEach((f, idx) => {
      const startAngle = 55;
      const endAngle = 125;
      const step = fCount > 1 ? (endAngle - startAngle) / (fCount - 1) : 0;
      const angleDeg = fCount === 1 ? 90 : startAngle + idx * step;
      const angleRad = (angleDeg * Math.PI) / 180;
      const radius = idx % 2 === 0 ? 30 : 42;
      const xPos = 50 + radius * 1.15 * Math.cos(angleRad);
      const yPos = 50 + radius * 0.85 * Math.sin(angleRad);

      nodeList.push({
        id: `forensic-${idx}`,
        type: 'forensic',
        label: f.analysis_type || f.title || f.name,
        sub: f.lab_tech || 'Laboratory Report',
        data: f,
        x: Math.round(Math.max(10, Math.min(90, xPos))),
        y: Math.round(Math.max(12, Math.min(90, yPos)))
      });
    });

    return nodeList;
  };

  const allNodes = generateNodes();

  const getBorderColor = (type, isHovered, isSelected) => {
    if (isSelected) return 'border-[#d4af37] bg-[#1a180f] text-white shadow-[0_0_20px_rgba(212,175,55,0.6)] ring-2 ring-[#d4af37]/50';
    if (isHovered) return 'border-white bg-[#1a1a24] text-white shadow-xl ring-1 ring-white/50';

    switch (type) {
      case 'case': return 'border-red-600 bg-red-950/90 text-white shadow-lg shadow-red-950/50';
      case 'suspect': return 'border-amber-500/80 bg-[#141419] text-[#e0e0e0] hover:border-amber-400';
      case 'evidence': return 'border-emerald-500/80 bg-[#141419] text-[#e0e0e0] hover:border-emerald-400';
      case 'witness': return 'border-cyan-500/80 bg-[#141419] text-[#e0e0e0] hover:border-cyan-400';
      case 'forensic': return 'border-purple-500/80 bg-[#141419] text-[#e0e0e0] hover:border-purple-400';
      default: return 'border-[#262633] bg-[#141419]';
    }
  };

  const getLineColor = (type) => {
    switch (type) {
      case 'suspect': return '#f59e0b';
      case 'evidence': return '#10b981';
      case 'witness': return '#06b6d4';
      case 'forensic': return '#a855f7';
      default: return '#8a8a9e';
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'case': return <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" />;
      case 'suspect': return <Users className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
      case 'evidence': return <Search className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
      case 'witness': return <Eye className="w-3.5 h-3.5 text-cyan-400 shrink-0" />;
      case 'forensic': return <Microscope className="w-3.5 h-3.5 text-purple-400 shrink-0" />;
      default: return <Link className="w-3.5 h-3.5 shrink-0" />;
    }
  };

  const isNodeVisible = (node) => {
    if (activeFilter === 'all') return true;
    if (node.type === 'case') return true;
    return node.type === activeFilter;
  };

  return (
    <div className={`relative bg-[#070709] border border-[#262633] rounded-lg flex flex-col shadow-2xl overflow-hidden ${isFullscreen ? 'fixed inset-4 z-50 p-6 bg-[#070709]/95 backdrop-blur-xl border-[#d4af37]/50' : 'p-4 min-h-[500px] h-full'}`}>
      {/* Board Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#262633] pb-3 text-xs font-mono shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span className="font-bold text-[#d4af37] tracking-wider uppercase">
            ORBITAL DETECTIVE BOARD • CASE {safeCaseId.toString().padStart(2, '0')}
          </span>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1 bg-[#0a0a0c] border border-[#262633] p-1 rounded">
          <Filter className="w-3 h-3 text-[#8a8a9e] ml-1 mr-0.5" />
          {[
            { id: 'all', label: 'All', count: allNodes.length - 1 },
            { id: 'suspect', label: 'Suspects', count: suspects.length },
            { id: 'evidence', label: 'Evidence', count: evidence.length },
            { id: 'witness', label: 'Witnesses', count: witnesses.length },
            { id: 'forensic', label: 'Forensics', count: forensics.length },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveFilter(item.id)}
              className={`px-2 py-0.5 rounded text-[10px] transition-colors flex items-center gap-1 ${
                activeFilter === item.id
                  ? 'bg-[#d4af37] text-black font-bold'
                  : 'text-[#8a8a9e] hover:text-[#e0e0e0]'
              }`}
            >
              {item.label}
              <span className="opacity-70 text-[9px]">({item.count})</span>
            </button>
          ))}
        </div>

        {/* Zoom & Fullscreen Controls */}
        <div className="flex items-center gap-1.5 text-[#8a8a9e]">
          <div className="flex items-center gap-1 bg-[#0a0a0c] border border-[#262633] px-1 py-0.5 rounded">
            <button
              onClick={() => handleZoom(-0.1)}
              className="p-1 hover:text-white transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-bold text-[#d4af37] px-1">{Math.round(zoomLevel * 100)}%</span>
            <button
              onClick={() => handleZoom(0.1)}
              className="p-1 hover:text-white transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1 hover:text-white transition-colors border-l border-[#262633] ml-0.5 pl-1.5"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3 h-3 text-[#8a8a9e]" />
            </button>
          </div>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1 hover:text-white bg-[#0a0a0c] border border-[#262633] rounded transition-colors ml-1"
            title={isFullscreen ? 'Minimize View' : 'Expand Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 text-[#d4af37]" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* SVG Connecting Lines & Interactive Radial Graph Canvas */}
      <div className="relative flex-1 w-full min-h-[400px] bg-[radial-gradient(#262633_1px,transparent_1px)] [background-size:20px_20px] overflow-auto my-2 rounded border border-[#262633]/40 flex items-center justify-center">
        <div 
          className="relative w-full h-full min-h-[400px] transition-transform duration-200"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
        >
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {allNodes.filter(n => n.id !== 'center' && isNodeVisible(n)).map((node) => {
              const isHovered = hoveredNodeId === node.id;
              const isSelected = selectedNode?.id === node.id;
              const strokeColor = getLineColor(node.type);
              const strokeWidth = isSelected ? 2.5 : isHovered ? 2.2 : 1.2;
              const opacity = (hoveredNodeId || selectedNode) 
                ? (isHovered || isSelected ? 1 : 0.15) 
                : 0.45;

              return (
                <line
                  key={node.id}
                  x1="50%"
                  y1="50%"
                  x2={`${node.x}%`}
                  y2={`${node.y}%`}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeDasharray={isSelected || isHovered ? 'none' : '4 4'}
                  opacity={opacity}
                  className="transition-all duration-300"
                />
              );
            })}
          </svg>

          {/* Render Interactive Radial Nodes */}
          {allNodes.filter(isNodeVisible).map((node) => {
            const isHovered = hoveredNodeId === node.id;
            const isSelected = selectedNode?.id === node.id;
            const isDimmed = (hoveredNodeId || selectedNode) && !isHovered && !isSelected && node.id !== 'center';

            return (
              <motion.div
                key={node.id}
                onClick={() => setSelectedNode(node)}
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ 
                  scale: isSelected ? 1.1 : isHovered ? 1.08 : 1, 
                  opacity: isDimmed ? 0.35 : 1 
                }}
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: isSelected ? 30 : isHovered ? 25 : node.id === 'center' ? 20 : 10,
                }}
                className={`absolute cursor-pointer border rounded-lg px-2.5 py-1.5 shadow-xl transition-all select-none max-w-[130px] sm:max-w-[150px] ${getBorderColor(
                  node.type,
                  isHovered,
                  isSelected
                )}`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  {getIcon(node.type)}
                  <span className="truncate">{node.label}</span>
                </div>
                <p className="text-[10px] text-[#8a8a9e] truncate mt-0.5 font-mono">
                  {node.sub}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Selected Node Inspection Drawer Modal */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="bg-[#141419] border border-[#d4af37] p-3.5 rounded-lg shadow-2xl z-30 space-y-2 shrink-0 animate-in fade-in"
          >
            <div className="flex items-center justify-between border-b border-[#262633] pb-2">
              <span className="text-xs font-bold text-[#d4af37] uppercase flex items-center gap-1.5 font-mono tracking-wide">
                {getIcon(selectedNode.type)}
                {selectedNode.type.toUpperCase()}: {selectedNode.label}
              </span>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-[#8a8a9e] hover:text-white border border-[#262633] p-0.5 rounded"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {selectedNode.data ? (
              <div className="text-xs text-[#e0e0e0] grid grid-cols-1 md:grid-cols-2 gap-2 font-mono">
                {selectedNode.data.occupation && (
                  <div>
                    <strong className="text-[#8a8a9e]">Role / Occupation:</strong> {selectedNode.data.occupation}
                  </div>
                )}
                {selectedNode.data.motive && (
                  <div>
                    <strong className="text-[#8a8a9e]">Motive:</strong> {selectedNode.data.motive}
                  </div>
                )}
                {selectedNode.data.alibi && (
                  <div>
                    <strong className="text-[#8a8a9e]">Alibi:</strong> {selectedNode.data.alibi}
                  </div>
                )}
                {selectedNode.data.found_location && (
                  <div>
                    <strong className="text-[#8a8a9e]">Found Location:</strong> {selectedNode.data.found_location}
                  </div>
                )}
                {selectedNode.data.description && (
                  <div className="col-span-full">
                    <strong className="text-[#8a8a9e]">Description:</strong> {selectedNode.data.description}
                  </div>
                )}
                {selectedNode.data.statement && (
                  <div className="col-span-full italic text-[#d4af37]">
                    "{selectedNode.data.statement}"
                  </div>
                )}
                {selectedNode.data.findings && (
                  <div className="col-span-full text-emerald-400">
                    <strong className="text-[#8a8a9e]">Lab Findings:</strong> {selectedNode.data.findings}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-[#8a8a9e] font-mono">
                Central investigation node representing Case {safeCaseId}. Query suspects, evidence, and timeline to discover connections.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
