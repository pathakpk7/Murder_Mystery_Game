// Evidence Locker System
// Handles categorized evidence with progressive unlocking

const evidenceLocker = {
    // Evidence categories
    categories: {
        'witness_statements': { icon: 'fas fa-user-tie', color: '#3b82f6', name: 'Witness Statements' },
        'evidence': { icon: 'fas fa-fingerprint', color: '#22c55e', name: 'Evidence' },
        'forensics': { icon: 'fas fa-microscope', color: '#f59e0b', name: 'Forensics' },
        'timeline': { icon: 'fas fa-clock', color: '#ec4899', name: 'Timeline' },
        'documents': { icon: 'fas fa-file-alt', color: '#8b5cf6', name: 'Recovered Documents' }
    },

    // Player's unlocked evidence
    unlockedEvidence: [],

    // Add evidence to locker
    addEvidence(categoryId, evidenceId, evidenceType, data) {
        const evidence = {
            id: Date.now(),
            categoryId: categoryId,
            evidenceId: evidenceId,
            evidenceType: evidenceType,
            data: data,
            unlockedAt: new Date().toISOString(),
            isNew: true
        };

        this.unlockedEvidence.push(evidence);
        this.saveEvidence();
        
        // Show notification
        notificationSystem.notifyEvidenceUpdated(evidenceId);
        
        return evidence;
    },

    // Get evidence by category
    getEvidenceByCategory(categoryId) {
        return this.unlockedEvidence.filter(e => e.categoryId === categoryId);
    },

    // Get all evidence
    getAllEvidence() {
        return this.unlockedEvidence;
    },

    // Get new evidence (not yet viewed)
    getNewEvidence() {
        return this.unlockedEvidence.filter(e => e.isNew);
    },

    // Mark evidence as viewed
    markAsViewed(evidenceId) {
        const evidence = this.unlockedEvidence.find(e => e.id === evidenceId);
        if (evidence) {
            evidence.isNew = false;
            this.saveEvidence();
        }
    },

    // Mark all as viewed
    markAllAsViewed() {
        this.unlockedEvidence.forEach(e => {
            e.isNew = false;
        });
        this.saveEvidence();
    },

    // Save evidence to localStorage
    saveEvidence() {
        localStorage.setItem('evidence_locker', JSON.stringify(this.unlockedEvidence));
    },

    // Load evidence from localStorage
    loadEvidence() {
        const saved = localStorage.getItem('evidence_locker');
        if (saved) {
            this.unlockedEvidence = JSON.parse(saved);
        }
    },

    // Render evidence locker panel
    renderEvidenceLocker(containerId, caseId = null) {
        const container = document.getElementById(containerId);
        if (!container) return;

        let evidenceToShow = this.unlockedEvidence;
        if (caseId) {
            evidenceToShow = evidenceToShow.filter(e => e.data.caseId === caseId);
        }

        if (evidenceToShow.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: var(--spacing-xl); color: var(--color-text-muted);">
                    <i class="fas fa-lock" style="font-size: 2rem; margin-bottom: var(--spacing-md);"></i>
                    <p>No evidence collected yet. Complete objectives to unlock evidence.</p>
                </div>
            `;
            return;
        }

        // Group by category
        const grouped = {};
        evidenceToShow.forEach(e => {
            if (!grouped[e.categoryId]) {
                grouped[e.categoryId] = [];
            }
            grouped[e.categoryId].push(e);
        });

        let html = '';
        Object.keys(grouped).forEach(categoryId => {
            const category = this.categories[categoryId];
            const items = grouped[categoryId];
            
            html += `
                <div class="evidence-category">
                    <div class="category-header" onclick="this.nextElementSibling.classList.toggle('collapsed')">
                        <div class="category-title">
                            <i class="${category.icon}" style="color: ${category.color};"></i>
                            <span>${category.name}</span>
                            <span class="category-count">${items.length}</span>
                        </div>
                        <i class="fas fa-chevron-down category-toggle"></i>
                    </div>
                    <div class="category-content">
                        ${items.map(item => this.renderEvidenceItem(item)).join('')}
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    },

    // Render individual evidence item
    renderEvidenceItem(item) {
        const category = this.categories[item.categoryId];
        const isNewClass = item.isNew ? 'new-evidence' : '';
        
        return `
            <div class="evidence-item ${isNewClass}" data-id="${item.id}">
                <div class="evidence-icon" style="color: ${category.color};">
                    <i class="${category.icon}"></i>
                </div>
                <div class="evidence-details">
                    <div class="evidence-title">${item.data.title || item.data.name || 'Evidence'}</div>
                    <div class="evidence-description">${item.data.description || item.data.statement || item.data.event || ''}</div>
                    ${item.data.location ? `<div class="evidence-meta"><i class="fas fa-map-marker-alt"></i> ${item.data.location}</div>` : ''}
                    ${item.data.type ? `<div class="evidence-meta"><i class="fas fa-tag"></i> ${item.data.type}</div>` : ''}
                    ${item.data.time ? `<div class="evidence-meta"><i class="fas fa-clock"></i> ${item.data.time}</div>` : ''}
                </div>
                ${item.isNew ? '<div class="new-badge">NEW</div>' : ''}
            </div>
        `;
    },

    // Render compact evidence locker (for sidebar)
    renderCompactLocker(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const newEvidence = this.getNewEvidence();
        const totalCount = this.unlockedEvidence.length;

        container.innerHTML = `
            <div class="compact-locker">
                <div class="locker-header" onclick="evidenceLocker.renderEvidenceLocker('evidenceLockerModal')">
                    <i class="fas fa-fingerprint"></i>
                    <span>Evidence Locker</span>
                    <span class="locker-count">${totalCount}</span>
                </div>
                ${newEvidence.length > 0 ? `
                    <div class="locker-new">
                        <i class="fas fa-bell"></i>
                        <span>${newEvidence.length} new evidence</span>
                    </div>
                ` : ''}
            </div>
        `;
    },

    // Get evidence count by category
    getCategoryCounts() {
        const counts = {};
        Object.keys(this.categories).forEach(cat => {
            counts[cat] = this.getEvidenceByCategory(cat).length;
        });
        return counts;
    }
};

// Add CSS styles
const style = document.createElement('style');
style.textContent = `
    .evidence-category {
        background: var(--color-bg-secondary);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        margin-bottom: var(--spacing-md);
        overflow: hidden;
    }

    .category-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--spacing-md);
        background: var(--color-dark-gray);
        cursor: pointer;
        transition: background 0.3s ease;
    }

    .category-header:hover {
        background: var(--color-slate);
    }

    .category-title {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
        font-weight: 600;
        color: var(--color-text-primary);
    }

    .category-count {
        background: var(--color-crimson);
        color: var(--color-text-primary);
        padding: 2px 8px;
        border-radius: 10px;
        font-size: 0.75rem;
        font-weight: 600;
    }

    .category-toggle {
        color: var(--color-text-muted);
        transition: transform 0.3s ease;
    }

    .category-content.collapsed {
        display: none;
    }

    .category-header[aria-expanded="true"] .category-toggle {
        transform: rotate(180deg);
    }

    .evidence-item {
        display: flex;
        gap: var(--spacing-md);
        padding: var(--spacing-md);
        border-bottom: 1px solid var(--color-border);
        position: relative;
    }

    .evidence-item:last-child {
        border-bottom: none;
    }

    .evidence-item.new-evidence {
        background: rgba(212, 175, 55, 0.05);
    }

    .evidence-icon {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--color-dark-gray);
        border-radius: var(--radius-md);
        flex-shrink: 0;
    }

    .evidence-details {
        flex: 1;
    }

    .evidence-title {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--color-text-primary);
        margin-bottom: var(--spacing-xs);
    }

    .evidence-description {
        font-size: 0.875rem;
        color: var(--color-text-secondary);
        line-height: 1.5;
        margin-bottom: var(--spacing-xs);
    }

    .evidence-meta {
        font-size: 0.75rem;
        color: var(--color-text-muted);
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
    }

    .new-badge {
        position: absolute;
        top: var(--spacing-sm);
        right: var(--spacing-sm);
        background: var(--color-crimson);
        color: var(--color-text-primary);
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 0.625rem;
        font-weight: 600;
    }

    .compact-locker {
        background: var(--color-bg-secondary);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        padding: var(--spacing-md);
    }

    .locker-header {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
        cursor: pointer;
        font-weight: 600;
        color: var(--color-text-primary);
    }

    .locker-count {
        background: var(--color-gold);
        color: var(--color-deep-black);
        padding: 2px 8px;
        border-radius: 10px;
        font-size: 0.75rem;
        font-weight: 600;
    }

    .locker-new {
        margin-top: var(--spacing-sm);
        padding: var(--spacing-sm);
        background: rgba(212, 175, 55, 0.1);
        border: 1px solid var(--color-gold);
        border-radius: var(--radius-md);
        font-size: 0.75rem;
        color: var(--color-gold);
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
    }
`;
document.head.appendChild(style);

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    evidenceLocker.loadEvidence();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = evidenceLocker;
}
