// Detective Board System
// Visual board with progressive connection unlocking

const detectiveBoard = {
    // Node types and their icons
    nodeTypes: {
        'victim': { icon: 'fas fa-skull', color: '#ef4444', name: 'Victim' },
        'witness': { icon: 'fas fa-user', color: '#3b82f6', name: 'Witness' },
        'suspect': { icon: 'fas fa-user-secret', color: '#f59e0b', name: 'Suspect' },
        'evidence': { icon: 'fas fa-fingerprint', color: '#22c55e', name: 'Evidence' },
        'location': { icon: 'fas fa-map-marker-alt', color: '#8b5cf6', name: 'Location' }
    },

    // Board nodes
    nodes: [],

    // Board connections
    connections: [],

    // Unlocked nodes
    unlockedNodes: [],

    // Unlocked connections
    unlockedConnections: [],

    // Initialize board for a case
    initializeBoard(caseId) {
        // Load board data from database (mock for now)
        this.loadBoardData(caseId);
        this.loadProgress(caseId);
    },

    // Load board data from database
    loadBoardData(caseId) {
        // In production, this would fetch from API
        // Mock data for demonstration
        this.nodes = [
            { id: 1, type: 'victim', name: 'Victim', x: 400, y: 300, isCenter: true },
            { id: 2, type: 'witness', name: 'Witness 1', x: 200, y: 200 },
            { id: 3, type: 'witness', name: 'Witness 2', x: 600, y: 200 },
            { id: 4, type: 'suspect', name: 'Suspect 1', x: 200, y: 400 },
            { id: 5, type: 'suspect', name: 'Suspect 2', x: 600, y: 400 },
            { id: 6, type: 'evidence', name: 'Evidence 1', x: 300, y: 150 },
            { id: 7, type: 'evidence', name: 'Evidence 2', x: 500, y: 150 },
            { id: 8, type: 'location', name: 'Crime Scene', x: 400, y: 450 }
        ];

        this.connections = [
            { from: 1, to: 2, type: 'witness' },
            { from: 1, to: 3, type: 'witness' },
            { from: 2, to: 4, type: 'suspect' },
            { from: 3, to: 5, type: 'suspect' },
            { from: 2, to: 6, type: 'evidence' },
            { from: 3, to: 7, type: 'evidence' },
            { from: 1, to: 8, type: 'location' }
        ];
    },

    // Load player progress
    loadProgress(caseId) {
        const progressKey = `board_progress_${caseId}`;
        const saved = localStorage.getItem(progressKey);
        
        if (saved) {
            const progress = JSON.parse(saved);
            this.unlockedNodes = progress.unlockedNodes || [];
            this.unlockedConnections = progress.unlockedConnections || [];
        } else {
            // Start with only the center node (victim) unlocked
            const centerNode = this.nodes.find(n => n.isCenter);
            if (centerNode) {
                this.unlockedNodes = [centerNode.id];
            }
        }
    },

    // Save progress
    saveProgress(caseId) {
        const progressKey = `board_progress_${caseId}`;
        const progress = {
            unlockedNodes: this.unlockedNodes,
            unlockedConnections: this.unlockedConnections
        };
        localStorage.setItem(progressKey, JSON.stringify(progress));
    },

    // Unlock a node
    unlockNode(nodeId) {
        if (!this.unlockedNodes.includes(nodeId)) {
            this.unlockedNodes.push(nodeId);
            
            // Auto-unlock connections to already unlocked nodes
            this.connections.forEach(conn => {
                if (conn.from === nodeId && this.unlockedNodes.includes(conn.to)) {
                    this.unlockConnection(conn.from, conn.to);
                }
                if (conn.to === nodeId && this.unlockedNodes.includes(conn.from)) {
                    this.unlockConnection(conn.from, conn.to);
                }
            });
            
            return true;
        }
        return false;
    },

    // Unlock a connection
    unlockConnection(fromId, toId) {
        const connectionKey = `${fromId}-${toId}`;
        const reverseKey = `${toId}-${fromId}`;
        
        if (!this.unlockedConnections.includes(connectionKey) && !this.unlockedConnections.includes(reverseKey)) {
            this.unlockedConnections.push(connectionKey);
            return true;
        }
        return false;
    },

    // Check if node is unlocked
    isNodeUnlocked(nodeId) {
        return this.unlockedNodes.includes(nodeId);
    },

    // Check if connection is unlocked
    isConnectionUnlocked(fromId, toId) {
        const connectionKey = `${fromId}-${toId}`;
        const reverseKey = `${toId}-${fromId}`;
        return this.unlockedConnections.includes(connectionKey) || this.unlockedConnections.includes(reverseKey);
    },

    // Render detective board
    renderBoard(containerId, caseId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        this.initializeBoard(caseId);

        let html = `
            <div class="detective-board">
                <svg class="board-svg" viewBox="0 0 800 600">
                    <!-- Connections -->
                    ${this.renderConnections()}
                    <!-- Nodes -->
                    ${this.renderNodes()}
                </svg>
                <div class="board-legend">
                    ${this.renderLegend()}
                </div>
            </div>
        `;

        container.innerHTML = html;
    },

    // Render connections
    renderConnections() {
        return this.connections.map(conn => {
            const fromNode = this.nodes.find(n => n.id === conn.from);
            const toNode = this.nodes.find(n => n.id === conn.to);
            const isUnlocked = this.isConnectionUnlocked(conn.from, conn.to);
            
            if (!fromNode || !toNode) return '';
            
            const strokeColor = isUnlocked ? '#d4af37' : '#334155';
            const strokeWidth = isUnlocked ? 2 : 1;
            const strokeDasharray = isUnlocked ? 'none' : '5,5';
            
            return `
                <line
                    x1="${fromNode.x}"
                    y1="${fromNode.y}"
                    x2="${toNode.x}"
                    y2="${toNode.y}"
                    stroke="${strokeColor}"
                    stroke-width="${strokeWidth}"
                    stroke-dasharray="${strokeDasharray}"
                    class="board-connection ${isUnlocked ? 'unlocked' : 'locked'}"
                />
            `;
        }).join('');
    },

    // Render nodes
    renderNodes() {
        return this.nodes.map(node => {
            const isUnlocked = this.isNodeUnlocked(node.id);
            const nodeType = this.nodeTypes[node.type];
            
            if (!nodeType) return '';
            
            const fillColor = isUnlocked ? nodeType.color : '#1e293b';
            const strokeColor = isUnlocked ? '#d4af37' : '#334155';
            const opacity = isUnlocked ? 1 : 0.5;
            
            return `
                <g class="board-node ${isUnlocked ? 'unlocked' : 'locked'}" data-id="${node.id}" onclick="detectiveBoard.onNodeClick(${node.id})">
                    <circle
                        cx="${node.x}"
                        cy="${node.y}"
                        r="${node.isCenter ? 50 : 35}"
                        fill="${fillColor}"
                        stroke="${strokeColor}"
                        stroke-width="3"
                        opacity="${opacity}"
                    />
                    <text
                        x="${node.x}"
                        y="${node.y}"
                        text-anchor="middle"
                        dominant-baseline="middle"
                        fill="white"
                        font-size="${node.isCenter ? 24 : 16}"
                        font-weight="600"
                    >
                        ${isUnlocked ? nodeType.icon : '?'}
                    </text>
                    ${isUnlocked ? `
                        <text
                            x="${node.x}"
                            y="${node.y + (node.isCenter ? 70 : 50)}"
                            text-anchor="middle"
                            fill="#d4af37"
                            font-size="12"
                            font-weight="600"
                        >
                            ${node.name}
                        </text>
                    ` : ''}
                </g>
            `;
        }).join('');
    },

    // Render legend
    renderLegend() {
        return Object.entries(this.nodeTypes).map(([type, config]) => `
            <div class="legend-item">
                <div class="legend-icon" style="background: ${config.color};">
                    <i class="${config.icon}"></i>
                </div>
                <span>${config.name}</span>
            </div>
        `).join('');
    },

    // Handle node click
    onNodeClick(nodeId) {
        const node = this.nodes.find(n => n.id === nodeId);
        if (!node) return;

        if (this.isNodeUnlocked(nodeId)) {
            // Show node details
            this.showNodeDetails(node);
        } else {
            // Node is locked
            notificationSystem.addNotification('evidence_updated', `This node is locked. Complete more objectives to unlock it.`);
        }
    },

    // Show node details
    showNodeDetails(node) {
        const nodeType = this.nodeTypes[node.type];
        
        const modal = document.createElement('div');
        modal.className = 'node-details-modal';
        modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--color-bg-secondary);
            border: 1px solid var(--color-gold);
            border-radius: var(--radius-lg);
            padding: var(--spacing-2xl);
            z-index: 10000;
            max-width: 400px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        `;
        
        modal.innerHTML = `
            <div style="text-align: center;">
                <div style="width: 60px; height: 60px; background: ${nodeType.color}; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto var(--spacing-md);">
                    <i class="${nodeType.icon}" style="color: white; font-size: 1.5rem;"></i>
                </div>
                <h3 style="color: var(--color-text-primary); margin-bottom: var(--spacing-sm);">${node.name}</h3>
                <p style="color: var(--color-text-secondary); margin-bottom: var(--spacing-lg);">${nodeType.name}</p>
                <button class="btn btn-secondary btn-full" onclick="this.parentElement.parentElement.remove()">Close</button>
            </div>
        `;
        
        document.body.appendChild(modal);
    },

    // Get unlock progress percentage
    getProgressPercentage() {
        const totalNodes = this.nodes.length;
        const unlockedCount = this.unlockedNodes.length;
        return Math.round((unlockedCount / totalNodes) * 100);
    }
};

// Add CSS styles
const style = document.createElement('style');
style.textContent = `
    .detective-board {
        background: var(--color-dark-gray);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-lg);
        padding: var(--spacing-xl);
        position: relative;
    }

    .board-svg {
        width: 100%;
        height: auto;
        min-height: 400px;
    }

    .board-connection {
        transition: all 0.3s ease;
    }

    .board-connection.unlocked {
        stroke-dasharray: none;
    }

    .board-node {
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .board-node:hover {
        filter: brightness(1.2);
    }

    .board-node.locked {
        cursor: not-allowed;
    }

    .board-legend {
        display: flex;
        flex-wrap: wrap;
        gap: var(--spacing-md);
        margin-top: var(--spacing-lg);
        padding-top: var(--spacing-lg);
        border-top: 1px solid var(--color-border);
    }

    .legend-item {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        font-size: 0.875rem;
        color: var(--color-text-secondary);
    }

    .legend-icon {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 0.75rem;
    }

    @media (max-width: 768px) {
        .board-svg {
            min-height: 300px;
        }
    }
`;
document.head.appendChild(style);

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    // Board will be initialized when needed
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = detectiveBoard;
}
