/**
 * ============================================================================
 * PROJECT VRITRA — INVESTIGATION & GAMEPLAY ENGINE (SINGLE-PAGE APPLICATION)
 * ============================================================================
 * Official Single-Page Engine for Project Vritra
 * Handles:
 * - Dynamic Database Rendering for all 19 investigations (Cases 0 to 18)
 * - Safe Client & Backend SQL Query Execution Engine
 * - Objective Evaluation & Clue / Evidence Progression System
 * - Interactive Detective Board Canvas
 * - Accusation & Case Deduction Workflow
 * - Rank, XP, Stars, and Achievement Progression
 * - Team Communications & Investigation Intelligence Feed
 * ============================================================================
 */

// Global App State
const VritraApp = {
    apiBase: 'http://localhost:5433/api',
    db: null, // Initialized from CANONICAL_DATABASE
    currentView: 'home',
    activeCaseId: 0,
    activeObjectiveId: null,
    editor: null,
    queryHistory: [],
    
    // Player Profile State (stored in localStorage)
    player: {
        id: 'agent_' + Math.random().toString(36).substring(2, 9),
        name: 'Prasoon Pathak',
        rank: 'Investigation Intern',
        level: 1,
        xp: 0,
        totalStars: 0,
        completedCases: [], // array of case IDs
        unlockedCases: [0, 1], // Case 0 and Case 1 unlocked by default
        caseProgress: {}, // { [caseId]: { completedObjectives: [], stars: 0, status: 'unlocked'|'completed' } }
        unlockedClues: [],
        unlockedAchievements: [],
        viewedCommunications: []
    },

    // Initialize the application
    async init() {
        console.log('🕵️ Initializing Project Vritra Investigation System...');
        
        // 1. Load database
        this.loadDatabase();

        // 2. Load player profile from storage
        this.loadPlayerState();

        // 3. Initialize CodeMirror SQL Editor
        this.initSqlEditor();

        // 4. Setup Event Listeners & Router
        this.setupNavigation();
        this.setupEventListeners();

        // 5. Render Initial View
        this.updateHeaderStats();
        
        // Handle URL Hash on load
        const initialHash = window.location.hash.replace('#', '') || 'home';
        this.navigate(initialHash);

        console.log('✅ Project Vritra Ready. Database Loaded:', this.db ? 'Success' : 'Failed');
    },

    // Load Canonical Database
    loadDatabase() {
        if (window.CANONICAL_DATABASE) {
            this.db = window.CANONICAL_DATABASE;
        } else {
            console.warn('CANONICAL_DATABASE not found on window, initializing fallback structure');
            this.db = {
                game_cases: [],
                case_characters: [],
                suspects: [],
                witnesses: [],
                evidence: [],
                forensics: [],
                timeline: [],
                game_objectives: [],
                game_clues: [],
                evidence_locker: [],
                characters: [],
                rank_progression: [],
                achievements: []
            };
        }
    },

    // Helper to get stored user accounts
    getUserAccounts() {
        try {
            const raw = localStorage.getItem('vritra_user_accounts');
            return raw ? JSON.parse(raw) : {};
        } catch (e) {
            return {};
        }
    },

    // Load Player State from localStorage
    loadPlayerState(emailToLoad = null) {
        try {
            const accounts = this.getUserAccounts();
            const emailKey = emailToLoad || localStorage.getItem('vritra_current_session_email') || (this.player ? this.player.email : 'prasoon.pathak@vritra-tf.gov.in');
            
            if (emailKey && accounts[emailKey.toLowerCase()]) {
                this.player = { ...this.player, ...accounts[emailKey.toLowerCase()] };
            } else {
                const saved = localStorage.getItem('vritra_player_state');
                if (saved) {
                    const parsed = JSON.parse(saved);
                    this.player = { ...this.player, ...parsed };
                }
            }

            if (!Array.isArray(this.player.completedCases)) this.player.completedCases = [];
            if (!Array.isArray(this.player.unlockedCases)) this.player.unlockedCases = [0, 1];
            if (!this.player.caseProgress) this.player.caseProgress = {};
            if (!Array.isArray(this.player.unlockedAchievements)) this.player.unlockedAchievements = [];
        } catch (e) {
            console.error('Failed to load player state:', e);
        }
    },

    // Save Player State to localStorage and Supabase Database
    savePlayerState() {
        try {
            if (this.player && this.player.email) {
                const emailKey = this.player.email.toLowerCase();
                localStorage.setItem('vritra_current_session_email', emailKey);
                const accounts = this.getUserAccounts();
                accounts[emailKey] = { ...this.player };
                localStorage.setItem('vritra_user_accounts', JSON.stringify(accounts));

                // Async Sync to Supabase Backend Database
                try {
                    fetch(`${this.apiBase}/profile/sync`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ player: this.player })
                    }).catch(err => console.log('Supabase sync notice:', err.message));
                } catch (apiErr) {
                    console.log('Supabase sync background notice:', apiErr.message);
                }
            }
            localStorage.setItem('vritra_player_state', JSON.stringify(this.player));
            this.updateHeaderStats();
        } catch (e) {
            console.error('Failed to save player state:', e);
        }
    },

    // Update Header Stats
    updateHeaderStats() {
        const rankEl = document.getElementById('header-rank-badge');
        const xpEl = document.getElementById('header-xp-value');
        const starsEl = document.getElementById('header-stars-value');
        const casesCountEl = document.getElementById('header-cases-count');
        const detectiveNameEl = document.getElementById('header-detective-name');
        const dropdownNameEl = document.getElementById('dropdown-agent-name');
        const dropdownEmailEl = document.getElementById('dropdown-agent-email');
        const logoutBtn = document.getElementById('dropdown-logout-btn');

        const isLoggedIn = this.player && this.player.email && this.player.name !== 'Guest Detective' && this.player.rank !== 'Unassigned';

        if (rankEl) rankEl.textContent = this.player.rank;
        if (xpEl) xpEl.textContent = `${this.player.xp.toLocaleString()} XP`;
        if (starsEl) starsEl.textContent = `${this.player.totalStars} ⭐`;
        if (casesCountEl) casesCountEl.textContent = `${this.player.completedCases.length}/18 Cases`;

        if (isLoggedIn) {
            if (detectiveNameEl) detectiveNameEl.textContent = this.player.name;
            if (dropdownNameEl) dropdownNameEl.textContent = this.player.name;
            if (dropdownEmailEl) dropdownEmailEl.textContent = this.player.email;
            if (logoutBtn) {
                logoutBtn.className = 'dropdown-item text-error';
                logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout / Switch Agent';
            }
        } else {
            if (detectiveNameEl) detectiveNameEl.textContent = 'Guest Detective';
            if (dropdownNameEl) dropdownNameEl.textContent = 'Guest Detective';
            if (dropdownEmailEl) dropdownEmailEl.textContent = 'Not Logged In';
            if (logoutBtn) {
                logoutBtn.className = 'dropdown-item text-gold';
                logoutBtn.innerHTML = '<i class="fas fa-key text-gold"></i> Login / Register Agent';
            }
        }

        // Check if rank needs update
        this.checkRankProgression();
    },

    handleDropdownAuthClick() {
        const menu = document.getElementById('user-dropdown-menu');
        if (menu) menu.classList.add('hidden');

        const isLoggedIn = this.player && this.player.email && this.player.name !== 'Guest Detective' && this.player.rank !== 'Unassigned';
        if (isLoggedIn) {
            this.logoutUser();
        } else {
            this.openAuthModal();
        }
    },

    // Check and update Rank Progression based on XP and completed cases
    checkRankProgression() {
        if (!this.db || !this.db.rank_progression) return;
        
        const ranks = [...this.db.rank_progression].reverse();
        for (const r of ranks) {
            if (this.player.completedCases.length >= r.minCases && this.player.xp >= r.minXP) {
                if (this.player.rank !== r.rank) {
                    const oldRank = this.player.rank;
                    this.player.rank = r.rank;
                    this.showToast(`🎖️ Promotion! You have attained the rank of ${r.rank}`, 'success');
                    this.addNotification(`Promoted to ${r.rank}`, `Your investigative achievements have promoted you from ${oldRank} to ${r.rank}.`);
                    this.savePlayerState();
                }
                break;
            }
        }
    },

    // Initialize CodeMirror SQL Editor
    initSqlEditor() {
        const textarea = document.getElementById('sql-editor-textarea');
        if (!textarea) return;

        if (window.CodeMirror) {
            this.editor = CodeMirror.fromTextArea(textarea, {
                mode: 'text/x-sql',
                theme: 'dracula',
                lineNumbers: true,
                matchBrackets: true,
                autoCloseBrackets: true,
                indentWithTabs: true,
                smartIndent: true,
                lineWrapping: true,
                extraKeys: {
                    'Ctrl-Enter': () => this.runCurrentQuery(),
                    'Cmd-Enter': () => this.runCurrentQuery()
                }
            });

            // Set default placeholder query
            this.editor.setValue('SELECT * FROM suspects WHERE case_id = 1;');
        }
    },

    // Setup SPA Navigation and View Switcher
    setupNavigation() {
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.replace('#', '') || 'home';
            this.navigate(hash);
        });

        // Mobile Navigation Toggle
        const toggleBtn = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        if (toggleBtn && navMenu) {
            toggleBtn.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });
        }

        // Navigation links
        document.querySelectorAll('[data-view-target]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.getAttribute('data-view-target');
                const caseId = link.getAttribute('data-case-id');
                if (caseId !== null && caseId !== undefined) {
                    this.openCase(parseInt(caseId, 10));
                } else {
                    this.navigate(target);
                }
            });
        });

        // Close user profile dropdown menu on click outside
        document.addEventListener('click', (e) => {
            const menu = document.getElementById('user-dropdown-menu');
            const btn = document.getElementById('btn-user-menu');
            if (menu && !menu.classList.contains('hidden')) {
                if (btn && !btn.contains(e.target) && !menu.contains(e.target)) {
                    menu.classList.add('hidden');
                }
            }
        });
    },

    // Navigate to a specific view
    navigate(viewName) {
        this.currentView = viewName;
        window.location.hash = viewName;

        // Close mobile nav menu if open
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu) navMenu.classList.remove('active');

        // Hide all views
        document.querySelectorAll('.spa-view').forEach(view => {
            view.classList.add('hidden');
            view.style.display = 'none';
        });

        // Show target view
        const targetView = document.getElementById(`view-${viewName}`);
        if (targetView) {
            targetView.classList.remove('hidden');
            targetView.style.display = 'block';
        }

        // Update active nav class
        document.querySelectorAll('.nav-menu a, .nav-item').forEach(link => {
            if (link.getAttribute('href') === `#${viewName}` || link.getAttribute('data-view-target') === viewName) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Render view specific dynamic content
        switch (viewName) {
            case 'home':
                this.renderHomeStats();
                break;
            case 'cases':
            case 'dossier':
                this.renderCasesDossier();
                break;
            case 'investigation':
                this.renderInvestigationTerminal();
                break;
            case 'story':
                this.renderStoryView();
                break;
            case 'team':
                this.renderTeamView();
                break;
            case 'progress':
                this.renderProgressView();
                break;
            case 'credentials':
                this.renderCredentialsView();
                break;
            case 'guide':
            case 'how-to-play':
                break;
        }

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    // Setup Button & Input Event Listeners
    setupEventListeners() {
        // Execute Query Button
        const runBtn = document.getElementById('btn-run-query');
        if (runBtn) {
            runBtn.addEventListener('click', () => this.runCurrentQuery());
        }

        // Clear Query Button
        const clearBtn = document.getElementById('btn-clear-query');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                if (this.editor) this.editor.setValue('');
            });
        }

        // Hint Button
        const hintBtn = document.getElementById('btn-get-hint');
        if (hintBtn) {
            hintBtn.addEventListener('click', () => this.revealObjectiveHint());
        }

        // Accuse / Submit Case Report Button
        const accuseBtn = document.getElementById('btn-open-accusation');
        if (accuseBtn) {
            accuseBtn.addEventListener('click', () => this.openAccusationModal());
        }

        // Accusation Form Submit
        const accusationForm = document.getElementById('accusation-form');
        if (accusationForm) {
            accusationForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitCaseDeduction();
            });
        }

        // Evidence Locker Tabs
        document.querySelectorAll('.evidence-tab-btn').forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.getAttribute('data-tab');
                this.switchEvidenceTab(targetTab);
            });
        });

        // Quick SQL Template Buttons
        document.querySelectorAll('[data-sql-template]').forEach(btn => {
            btn.addEventListener('click', () => {
                const template = btn.getAttribute('data-sql-template')
                    .replace('{case_id}', this.activeCaseId);
                if (this.editor) {
                    this.editor.setValue(template);
                    this.editor.focus();
                }
            });
        });

        // Case Act Filter in Dossier
        document.querySelectorAll('.act-filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.act-filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const act = btn.getAttribute('data-act');
                this.renderCasesDossier(act);
            });
        });

        // Modal Close Buttons
        document.querySelectorAll('.modal-close, [data-modal-close]').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.modal-overlay').forEach(modal => modal.classList.add('hidden'));
            });
        });

        // Schema Inspector Button
        const schemaBtn = document.getElementById('btn-inspect-schema');
        if (schemaBtn) {
            schemaBtn.addEventListener('click', () => this.openSchemaModal());
        }
    },

    // ========================================================================
    // HOME & DOSSIER VIEW RENDERING
    // ========================================================================

    renderHomeStats() {
        const completed = this.player.completedCases.length;
        const total = 18;
        const pct = Math.round((completed / total) * 100);

        const progressFill = document.getElementById('home-overall-progress');
        if (progressFill) progressFill.style.width = `${pct}%`;

        const completedCountEl = document.getElementById('home-completed-count');
        if (completedCountEl) completedCountEl.textContent = `${completed} / ${total} Solved`;
    },

    // Helper to strictly check if a case is unlocked
    isCaseUnlocked(caseId) {
        const id = parseInt(caseId, 10);
        if (id === 0 || id === 1) return true;
        if (this.player.completedCases.includes(id)) return true;
        if (this.player.unlockedCases.includes(id)) return true;
        if (this.player.completedCases.includes(id - 1)) return true;
        return false;
    },

    renderCasesDossier(filterAct = 'all') {
        const container = document.getElementById('cases-grid-container');
        if (!container || !this.db || !this.db.game_cases) return;

        let cases = [...this.db.game_cases];
        if (filterAct !== 'all') {
            if (filterAct === 'training') {
                cases = cases.filter(c => c.act === 0);
            } else {
                const actNum = parseInt(filterAct, 10);
                cases = cases.filter(c => c.act === actNum);
            }
        }

        container.innerHTML = cases.map(c => {
            const isCompleted = this.player.completedCases.includes(c.id);
            const isUnlocked = this.isCaseUnlocked(c.id);
            const progress = this.player.caseProgress[c.id] || {};
            const stars = progress.stars || (isCompleted ? 3 : 0);

            // Act Label
            let actLabel = 'Act I: The Pattern';
            if (c.act === 0) actLabel = 'Tutorial Academy';
            else if (c.act === 2) actLabel = 'Act II: The Conspiracy';
            else if (c.act === 3) actLabel = 'Act III: The System';
            else if (c.act === 4) actLabel = 'Act IV: The Architect';

            return `
                <div class="case-card ${isCompleted ? 'completed' : ''} ${!isUnlocked ? 'locked' : ''}" data-case-id="${c.id}">
                    <div class="case-card-header">
                        <span class="case-badge ${c.difficulty}">${c.difficulty.toUpperCase()}</span>
                        <span class="case-act-tag">${actLabel}</span>
                        ${isCompleted ? `<span class="case-stars-tag">${'⭐'.repeat(stars)}</span>` : ''}
                    </div>
                    <div class="case-card-body">
                        <div class="case-number">CASE ${c.id.toString().padStart(2, '0')}</div>
                        <h3 class="case-title">${c.title}</h3>
                        <p class="case-desc">${c.description}</p>
                        <div class="case-meta">
                            <span><i class="fas fa-clock"></i> ~${c.estimated_duration_minutes} min</span>
                            <span><i class="fas fa-scroll"></i> ${c.mythology_theme || 'Forensics'}</span>
                            <span><i class="fas fa-bullseye"></i> ${c.story_arc || 'Investigation'}</span>
                        </div>
                    </div>
                    <div class="case-card-footer">
                        ${isCompleted 
                            ? `<button class="btn btn-secondary btn-sm btn-reopen-case" onclick="VritraApp.openCase(${c.id})"><i class="fas fa-redo"></i> Review File</button>`
                            : isUnlocked 
                                ? `<button class="btn btn-primary btn-sm btn-start-case" onclick="VritraApp.openCase(${c.id})"><i class="fas fa-folder-open"></i> Investigate</button>`
                                : `<button class="btn btn-locked btn-sm" disabled><i class="fas fa-lock"></i> Solve Case ${c.id - 1} First</button>`
                        }
                        <button class="btn btn-ghost btn-sm" onclick="VritraApp.openBriefingModal(${c.id})"><i class="fas fa-info-circle"></i> Briefing</button>
                    </div>
                </div>
            `;
        }).join('');
    },

    // Open and Load an Investigation
    async openCase(caseId) {
        const id = parseInt(caseId, 10);

        // Strict lock check: Block locked cases immediately
        if (!this.isCaseUnlocked(id)) {
            this.showToast(`🔒 CLASSIFIED: You must solve Case ${id - 1} first to unlock Case ${id}!`, 'error');
            return;
        }

        this.activeCaseId = id;

        // Save unlock state if valid
        if (!this.player.unlockedCases.includes(id)) {
            this.player.unlockedCases.push(id);
            this.savePlayerState();
        }

        // Attempt live API fetch from backend first
        try {
            const res = await fetch(`${this.apiBase}/cases/${id}/full`);
            if (res.ok) {
                const json = await res.json();
                if (json.success && json.data) {
                    console.log(`📡 Loaded Case ${id} bundle from backend API`);
                    const bundle = json.data;
                    if (bundle.case && this.db) {
                        if (bundle.suspects) this.db.suspects = [...this.db.suspects.filter(s => s.case_id !== id), ...bundle.suspects];
                        if (bundle.witnesses) this.db.witnesses = [...this.db.witnesses.filter(w => w.case_id !== id), ...bundle.witnesses];
                        if (bundle.evidence) this.db.evidence = [...this.db.evidence.filter(e => e.case_id !== id), ...bundle.evidence];
                        if (bundle.forensics) this.db.forensics = [...this.db.forensics.filter(f => f.case_id !== id), ...bundle.forensics];
                        if (bundle.timeline) this.db.timeline = [...this.db.timeline.filter(t => t.case_id !== id), ...bundle.timeline];
                        if (bundle.objectives) this.db.game_objectives = [...this.db.game_objectives.filter(o => o.case_id !== id), ...bundle.objectives];
                        if (bundle.clues) this.db.game_clues = [...this.db.game_clues.filter(c => c.case_id !== id), ...bundle.clues];
                    }
                }
            }
        } catch (err) {
            console.log(`ℹ️ Backend API offline/unreachable, relying on canonical in-memory database for Case ${id}`);
        }

        const caseData = this.db.game_cases.find(c => c.id === id);
        if (!caseData) return;

        // Navigate to investigation workbench
        this.navigate('investigation');

        // Set initial query for this case
        if (this.editor) {
            if (id === 0) {
                this.editor.setValue('SELECT * FROM evidence_locker;');
            } else {
                this.editor.setValue(`SELECT * FROM suspects WHERE case_id = ${id};`);
            }
        }

        this.showToast(`📂 Opened Case ${id}: ${caseData.title}`, 'info');
    },

    openAuthModal() {
        const modal = document.getElementById('modal-auth');
        const nameInput = document.getElementById('auth-agent-name');
        const emailInput = document.getElementById('auth-agent-email');
        if (nameInput) nameInput.value = this.player.name || 'Prasoon Pathak';
        if (emailInput) emailInput.value = this.player.email || 'prasoon.pathak@vritra-tf.gov.in';
        if (modal) modal.classList.remove('hidden');
    },

    toggleUserDropdown(e) {
        if (e) e.stopPropagation();
        const menu = document.getElementById('user-dropdown-menu');
        if (menu) {
            menu.classList.toggle('hidden');
        }
    },

    openProgressModal() {
        const menu = document.getElementById('user-dropdown-menu');
        if (menu) menu.classList.add('hidden');

        const nameEl = document.getElementById('progress-modal-name');
        const emailEl = document.getElementById('progress-modal-email');
        const rankEl = document.getElementById('progress-modal-rank');
        const xpEl = document.getElementById('progress-modal-xp');
        const pctEl = document.getElementById('progress-modal-pct');
        const barEl = document.getElementById('progress-modal-bar');
        const casesListEl = document.getElementById('progress-modal-cases-list');

        const completedCount = this.player.completedCases.length;
        const pct = Math.round((completedCount / 18) * 100);

        if (nameEl) nameEl.textContent = this.player.name;
        if (emailEl) emailEl.textContent = this.player.email || 'prasoon.pathak@vritra-tf.gov.in';
        if (rankEl) rankEl.textContent = this.player.rank;
        if (xpEl) xpEl.textContent = `${this.player.xp.toLocaleString()} XP`;
        if (pctEl) pctEl.textContent = `${pct}% Complete`;
        if (barEl) barEl.style.width = `${pct}%`;

        if (casesListEl && this.db && this.db.game_cases) {
            casesListEl.innerHTML = this.db.game_cases.map(c => {
                const isCompleted = this.player.completedCases.includes(c.id);
                const progress = this.player.caseProgress[c.id] || {};
                const stars = progress.stars || (isCompleted ? 3 : 0);
                const score = progress.score || 0;

                return `
                    <div class="flex justify-between items-center p-xs mb-xs" style="background: var(--color-bg-primary); border-radius: 4px; border: 1px solid var(--color-border); font-size: 0.8rem; padding: 6px 10px;">
                        <div>
                            <span class="text-gold" style="font-weight: 700;">CASE ${c.id.toString().padStart(2, '0')}:</span> ${c.title}
                        </div>
                        <div class="flex items-center gap-sm">
                            ${isCompleted 
                                ? `<span class="text-success" style="font-size: 0.75rem;"><i class="fas fa-check-circle"></i> Solved (${'⭐'.repeat(stars)} • ${score} pts)</span>`
                                : `<span class="text-muted" style="font-size: 0.75rem;"><i class="fas fa-hourglass-half"></i> Pending</span>`
                            }
                        </div>
                    </div>
                `;
            }).join('');
        }

        const modal = document.getElementById('modal-progress');
        if (modal) modal.classList.remove('hidden');
    },

    logoutUser() {
        this.savePlayerState();

        const menu = document.getElementById('user-dropdown-menu');
        if (menu) menu.classList.add('hidden');

        localStorage.removeItem('vritra_current_session_email');

        this.player = {
            name: 'Guest Detective',
            email: '',
            xp: 0,
            totalStars: 0,
            rank: 'Unassigned',
            completedCases: [],
            unlockedCases: [0, 1],
            caseProgress: {}
        };

        this.updateHeaderStats();
        this.renderCasesDossier();

        this.showToast('🚪 Logged out successfully. Enter credentials to restore your progress.', 'info');
        this.openAuthModal();
    },

    async saveAuthIdentity() {
        const modalName = document.getElementById('auth-agent-name');
        const modalEmail = document.getElementById('auth-agent-email');
        const homeName = document.getElementById('home-auth-name');
        const homeEmail = document.getElementById('home-auth-email');
        const pageName = document.getElementById('page-auth-name');
        const pageEmail = document.getElementById('page-auth-email');

        let name = (modalName && modalName.value.trim()) || (homeName && homeName.value.trim()) || (pageName && pageName.value.trim()) || 'Prasoon Pathak';
        let email = (modalEmail && modalEmail.value.trim()) || (homeEmail && homeEmail.value.trim()) || (pageEmail && pageEmail.value.trim()) || 'prasoon.pathak@vritra-tf.gov.in';

        const accounts = this.getUserAccounts();
        const emailKey = email.toLowerCase();

        // 1. Try to fetch cloud progress from Supabase database first
        try {
            const res = await fetch(`${this.apiBase}/profile/sync?email=${encodeURIComponent(emailKey)}`);
            if (res.ok) {
                const json = await res.json();
                if (json.success && json.data) {
                    this.player = { ...this.player, ...json.data, name: name, email: email };
                    this.showToast(`⚡ Restored cloud progress from Supabase for Agent ${name}!`, 'success');
                } else if (accounts[emailKey]) {
                    this.player = { ...accounts[emailKey], name: name, email: email };
                    this.showToast(`🔑 Welcome back, Agent ${name}! Saved progress restored.`, 'success');
                } else {
                    this.player.name = name;
                    this.player.email = email;
                    this.showToast(`✅ Registered new identity: ${name}`, 'success');
                }
            } else if (accounts[emailKey]) {
                this.player = { ...accounts[emailKey], name: name, email: email };
                this.showToast(`🔑 Welcome back, Agent ${name}! Saved progress restored.`, 'success');
            } else {
                this.player.name = name;
                this.player.email = email;
                this.showToast(`✅ Registered new identity: ${name}`, 'success');
            }
        } catch (err) {
            if (accounts[emailKey]) {
                this.player = { ...accounts[emailKey], name: name, email: email };
                this.showToast(`🔑 Welcome back, Agent ${name}! Saved progress restored.`, 'success');
            } else {
                this.player.name = name;
                this.player.email = email;
                this.showToast(`✅ Registered new identity: ${name}`, 'success');
            }
        }

        this.savePlayerState();
        this.updateHeaderStats();
        this.renderCasesDossier();

        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.classList.add('hidden');
        });

        if (this.currentView === 'home') {
            this.navigate('cases');
        }
    },

    openBriefingModal(caseId) {
        const id = parseInt(caseId, 10);
        const caseData = this.db.game_cases.find(c => c.id === id);
        if (!caseData) return;

        const isUnlocked = this.isCaseUnlocked(id);

        const titleEl = document.getElementById('briefing-modal-title');
        const bodyEl = document.getElementById('briefing-modal-body');
        const startBtn = document.getElementById('briefing-modal-start-btn');

        if (titleEl) titleEl.textContent = `Case ${caseData.id.toString().padStart(2, '0')}: ${caseData.title}`;
        if (bodyEl) {
            bodyEl.innerHTML = `
                <div class="case-badge ${caseData.difficulty} mb-sm">${caseData.difficulty.toUpperCase()} • ${caseData.story_arc || 'Investigation'}</div>
                <h4 class="text-gold mb-md">${caseData.mythology_theme || 'Forensic Analysis'}</h4>
                <p><strong>Background:</strong> ${caseData.story_background || caseData.description}</p>
                <p class="mt-md text-muted"><em>Estimated Duration: ${caseData.estimated_duration_minutes} minutes</em></p>
                ${!isUnlocked ? `<div class="intel-detail alert mt-md"><strong>🔒 CLASSIFIED FILE:</strong> You must solve Case ${id - 1} first to gain operational clearance for this case terminal.</div>` : ''}
            `;
        }

        if (startBtn) {
            if (isUnlocked) {
                startBtn.disabled = false;
                startBtn.className = 'btn btn-primary btn-sm';
                startBtn.innerHTML = '<i class="fas fa-terminal"></i> Enter Investigation Terminal';
                startBtn.onclick = () => {
                    const modal = document.getElementById('modal-briefing');
                    if (modal) modal.classList.add('hidden');
                    this.openCase(id);
                };
            } else {
                startBtn.disabled = true;
                startBtn.className = 'btn btn-locked btn-sm';
                startBtn.innerHTML = `<i class="fas fa-lock"></i> Solve Case ${id - 1} First`;
                startBtn.onclick = null;
            }
        }

        const modal = document.getElementById('modal-briefing');
        if (modal) modal.classList.remove('hidden');
    },

    openSchemaModal() {
        const modal = document.getElementById('modal-schema');
        if (modal) modal.classList.remove('hidden');
    },

    // ========================================================================
    // INVESTIGATION TERMINAL & WORKBENCH RENDERING
    // ========================================================================

    renderInvestigationTerminal() {
        const caseId = this.activeCaseId;
        if (!this.db) return;

        const caseData = this.db.game_cases.find(c => c.id === caseId) || this.db.game_cases[0];
        if (!caseData) return;

        // 1. Update Case Header Banner
        const titleEl = document.getElementById('term-case-title');
        const numEl = document.getElementById('term-case-number');
        const arcEl = document.getElementById('term-case-arc');
        const themeEl = document.getElementById('term-case-theme');
        const bgEl = document.getElementById('term-case-background');

        if (titleEl) titleEl.textContent = caseData.title;
        if (numEl) numEl.textContent = `CASE ${caseData.id.toString().padStart(2, '0')}`;
        if (arcEl) arcEl.textContent = caseData.story_arc || 'Investigation';
        if (themeEl) themeEl.textContent = caseData.mythology_theme || 'Forensic Analysis';
        if (bgEl) bgEl.textContent = caseData.story_background || caseData.description;

        // 2. Render Objectives List
        this.renderCaseObjectives(caseId);

        // 3. Render Initial Evidence Tab (Suspects or Evidence Locker)
        if (caseId === 0) {
            this.switchEvidenceTab('locker');
        } else {
            this.switchEvidenceTab('suspects');
        }

        // 4. Update Quick SQL Templates
        document.querySelectorAll('[data-sql-template]').forEach(btn => {
            const rawTemplate = btn.getAttribute('data-raw-template') || btn.getAttribute('data-sql-template');
            btn.setAttribute('data-raw-template', rawTemplate);
            btn.setAttribute('data-sql-template', rawTemplate.replace(/\{case_id\}/g, caseId));
        });

        // 5. Initialize Detective Board
        this.initDetectiveBoard(caseId);
    },

    renderCaseObjectives(caseId) {
        const container = document.getElementById('term-objectives-list');
        if (!container || !this.db || !this.db.game_objectives) return;

        const objectives = this.db.game_objectives.filter(o => o.case_id === caseId);
        const caseProgress = this.player.caseProgress[caseId] || { completedObjectives: [] };
        const completedIds = caseProgress.completedObjectives || [];

        // Set active objective to first uncompleted objective
        const uncompleted = objectives.find(o => !completedIds.includes(o.id));
        this.activeObjectiveId = uncompleted ? uncompleted.id : (objectives[0] ? objectives[0].id : null);

        // Update Objective progress bar
        const total = objectives.length;
        const compCount = completedIds.filter(id => objectives.some(o => o.id === id)).length;
        const pct = total > 0 ? Math.round((compCount / total) * 100) : 0;

        const progFill = document.getElementById('term-objectives-progress-fill');
        const progText = document.getElementById('term-objectives-progress-text');
        if (progFill) progFill.style.width = `${pct}%`;
        if (progText) progText.textContent = `${compCount} / ${total} Objectives Completed`;

        // Render Cards
        container.innerHTML = objectives.map((obj, idx) => {
            const isDone = completedIds.includes(obj.id);
            const isActive = obj.id === this.activeObjectiveId;

            return `
                <div class="objective-card ${isDone ? 'completed' : ''} ${isActive ? 'active' : ''}" data-obj-id="${obj.id}">
                    <div class="objective-card-header">
                        <span class="objective-badge">${isDone ? '✓' : idx + 1}</span>
                        <h4 class="objective-title">${obj.title}</h4>
                        <span class="objective-points">+${obj.points || 100} XP</span>
                    </div>
                    <p class="objective-description">${obj.description}</p>
                    ${isActive && !isDone ? `
                        <div class="objective-active-tag"><i class="fas fa-crosshairs"></i> Current Target Query</div>
                    ` : ''}
                </div>
            `;
        }).join('');

        // Hint box reset
        const hintBox = document.getElementById('term-hint-box');
        if (hintBox) {
            hintBox.classList.add('hidden');
            hintBox.textContent = '';
        }
    },

    revealObjectiveHint() {
        if (!this.activeObjectiveId || !this.db) return;
        const obj = this.db.game_objectives.find(o => o.id === this.activeObjectiveId);
        if (!obj || !obj.hint) {
            this.showToast('No further hints available for this objective.', 'info');
            return;
        }

        const hintBox = document.getElementById('term-hint-box');
        if (hintBox) {
            hintBox.innerHTML = `<strong>💡 Forensic Clue:</strong> ${obj.hint}`;
            hintBox.classList.remove('hidden');
            this.showToast('Forensic clue revealed!', 'info');
        }
    },

    // ========================================================================
    // EVIDENCE LOCKER TABS & INTEL RENDERING
    // ========================================================================

    switchEvidenceTab(tabName) {
        document.querySelectorAll('.evidence-tab-btn').forEach(btn => {
            if (btn.getAttribute('data-tab') === tabName) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        const contentEl = document.getElementById('term-evidence-tab-content');
        if (!contentEl || !this.db) return;

        const caseId = this.activeCaseId;

        switch (tabName) {
            case 'suspects':
                this.renderSuspectsTab(caseId, contentEl);
                break;
            case 'witnesses':
                this.renderWitnessesTab(caseId, contentEl);
                break;
            case 'evidence':
                this.renderEvidenceTab(caseId, contentEl);
                break;
            case 'forensics':
                this.renderForensicsTab(caseId, contentEl);
                break;
            case 'timeline':
                this.renderTimelineTab(caseId, contentEl);
                break;
            case 'clues':
                this.renderCluesTab(caseId, contentEl);
                break;
            case 'locker':
                this.renderEvidenceLockerTab(contentEl);
                break;
            case 'board':
                this.renderDetectiveBoardTab(caseId, contentEl);
                break;
            case 'schema':
                this.renderSchemaTab(contentEl);
                break;
        }
    },

    renderSuspectsTab(caseId, container) {
        const suspects = this.db.suspects.filter(s => s.case_id === caseId);
        if (suspects.length === 0) {
            container.innerHTML = `<div class="empty-intel-msg">No suspects registered in this case file yet. Query the database using SQL to investigate.</div>`;
            return;
        }

        container.innerHTML = `
            <div class="intel-cards-list">
                ${suspects.map(s => `
                    <div class="intel-card suspect-card">
                        <div class="intel-card-header">
                            <i class="fas fa-user-secret intel-icon suspect"></i>
                            <div>
                                <h4 class="intel-name">${s.name}</h4>
                                <span class="intel-role">${s.occupation || 'Suspect'} • Age ${s.age || 'Unknown'}</span>
                            </div>
                        </div>
                        <div class="intel-detail"><strong>Motive:</strong> ${s.motive || 'Under Investigation'}</div>
                        <div class="intel-detail"><strong>Claimed Alibi:</strong> ${s.alibi || 'None'}</div>
                        ${s.contradiction ? `<div class="intel-detail alert"><strong>Contradiction:</strong> ${s.contradiction}</div>` : ''}
                    </div>
                `).join('')}
            </div>
        `;
    },

    renderWitnessesTab(caseId, container) {
        const witnesses = this.db.witnesses.filter(w => w.case_id === caseId);
        if (witnesses.length === 0) {
            container.innerHTML = `<div class="empty-intel-msg">No witness statements recorded for this case.</div>`;
            return;
        }

        container.innerHTML = `
            <div class="intel-cards-list">
                ${witnesses.map(w => `
                    <div class="intel-card witness-card">
                        <div class="intel-card-header">
                            <i class="fas fa-user intel-icon witness"></i>
                            <div>
                                <h4 class="intel-name">${w.name}</h4>
                                <span class="intel-role">${w.occupation || 'Witness'} • Reliability: <span class="badge-${(w.reliability||'').toLowerCase()}">${w.reliability || 'Unverified'}</span></span>
                            </div>
                        </div>
                        <div class="intel-detail"><strong>Statement:</strong> "${w.statement}"</div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    renderEvidenceTab(caseId, container) {
        const evidenceList = this.db.evidence.filter(e => e.case_id === caseId);
        if (evidenceList.length === 0) {
            container.innerHTML = `<div class="empty-intel-msg">No physical or digital evidence logged for this case.</div>`;
            return;
        }

        container.innerHTML = `
            <div class="intel-cards-list">
                ${evidenceList.map(e => `
                    <div class="intel-card evidence-card">
                        <div class="intel-card-header">
                            <i class="fas ${e.type === 'Digital' ? 'fa-hdd' : e.type === 'Document' ? 'fa-file-alt' : 'fa-fingerprint'} intel-icon evidence"></i>
                            <div>
                                <h4 class="intel-name">${e.name}</h4>
                                <span class="intel-role">${e.type || 'Physical'} • Location: ${e.location || 'Crime Scene'}</span>
                            </div>
                        </div>
                        <div class="intel-detail">${e.description}</div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    renderForensicsTab(caseId, container) {
        const reports = this.db.forensics.filter(f => f.case_id === caseId);
        if (reports.length === 0) {
            container.innerHTML = `<div class="empty-intel-msg">No forensic laboratory reports filed for this case.</div>`;
            return;
        }

        container.innerHTML = `
            <div class="intel-cards-list">
                ${reports.map(f => `
                    <div class="intel-card forensics-card">
                        <div class="intel-card-header">
                            <i class="fas fa-microscope intel-icon forensics"></i>
                            <div>
                                <h4 class="intel-name">${f.name}</h4>
                                <span class="intel-role">${f.type || 'Laboratory'} Analysis</span>
                            </div>
                        </div>
                        <div class="intel-detail"><strong>Description:</strong> ${f.description}</div>
                        <div class="intel-detail result"><strong>Lab Result:</strong> ${f.analysis_result}</div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    renderTimelineTab(caseId, container) {
        const timeline = this.db.timeline.filter(t => t.case_id === caseId);
        if (timeline.length === 0) {
            container.innerHTML = `<div class="empty-intel-msg">No timeline events reconstructed for this case.</div>`;
            return;
        }

        container.innerHTML = `
            <div class="timeline-feed">
                ${timeline.map(t => `
                    <div class="timeline-entry">
                        <div class="timeline-time">${t.time}</div>
                        <div class="timeline-content">
                            <h4 class="timeline-event">${t.event}</h4>
                            <p class="timeline-desc">${t.description}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    renderCluesTab(caseId, container) {
        const clues = this.db.game_clues.filter(c => c.case_id === caseId);
        if (clues.length === 0) {
            container.innerHTML = `<div class="empty-intel-msg">No special clues recorded for this case.</div>`;
            return;
        }

        container.innerHTML = `
            <div class="intel-cards-list">
                ${clues.map(c => `
                    <div class="intel-card clue-card">
                        <div class="intel-card-header">
                            <span class="clue-icon-emoji">${c.icon || '🔍'}</span>
                            <div>
                                <h4 class="intel-name">${c.title}</h4>
                                <span class="intel-role">${c.clue_type || 'Discovery'}</span>
                            </div>
                        </div>
                        <div class="intel-detail">${c.description}</div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    renderEvidenceLockerTab(container) {
        const locker = this.db.evidence_locker || [];
        container.innerHTML = `
            <div class="intel-cards-list">
                <div class="locker-notice"><i class="fas fa-shield-alt"></i> Task Force Evidence Locker Registry</div>
                ${locker.map(item => `
                    <div class="intel-card ${item.status === 'Missing' ? 'alert-border' : ''}">
                        <div class="intel-card-header">
                            <i class="fas fa-box intel-icon"></i>
                            <div>
                                <h4 class="intel-name">${item.item_name}</h4>
                                <span class="intel-role">${item.item_type} • Status: <strong class="${item.status === 'Missing' ? 'text-crimson' : 'text-success'}">${item.status}</strong></span>
                            </div>
                        </div>
                        <div class="intel-detail"><strong>Location:</strong> ${item.location} | <strong>Assigned:</strong> ${item.officer_assigned} | <strong>Logged:</strong> ${item.date_added}</div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    renderDetectiveBoardTab(caseId, container) {
        container.innerHTML = `
            <div class="detective-board-wrapper">
                <div class="board-toolbar">
                    <span><i class="fas fa-project-diagram"></i> Crime Scene Investigation Board</span>
                    <button class="btn btn-ghost btn-sm" onclick="VritraApp.initDetectiveBoard(${caseId})"><i class="fas fa-sync"></i> Redraw</button>
                </div>
                <canvas id="detective-board-canvas" width="400" height="420"></canvas>
            </div>
        `;
        setTimeout(() => this.initDetectiveBoard(caseId), 50);
    },

    renderSchemaTab(container) {
        container.innerHTML = `
            <div class="schema-explorer">
                <h4><i class="fas fa-database"></i> Investigation Database Tables</h4>
                <div class="schema-table-item">
                    <strong>suspects</strong>
                    <code>id, case_id, name, age, occupation, motive, alibi, contradiction</code>
                </div>
                <div class="schema-table-item">
                    <strong>witnesses</strong>
                    <code>id, case_id, name, age, occupation, statement, reliability</code>
                </div>
                <div class="schema-table-item">
                    <strong>evidence</strong>
                    <code>id, case_id, name, description, location, type</code>
                </div>
                <div class="schema-table-item">
                    <strong>forensics</strong>
                    <code>id, case_id, name, description, analysis_result, type</code>
                </div>
                <div class="schema-table-item">
                    <strong>timeline</strong>
                    <code>id, case_id, time, event, description</code>
                </div>
                <div class="schema-table-item">
                    <strong>evidence_locker</strong> (Case 0)
                    <code>id, item_name, item_type, location, status, officer_assigned, date_added</code>
                </div>
                <div class="schema-table-item">
                    <strong>game_cases</strong>
                    <code>id, title, description, difficulty, estimated_duration_minutes, story_arc</code>
                </div>
            </div>
        `;
    },

    // ========================================================================
    // CLIENT SQL QUERY EXECUTION ENGINE
    // ========================================================================

    async runCurrentQuery() {
        if (!this.editor) return;
        const rawQuery = this.editor.getValue().trim();
        if (!rawQuery) {
            this.showToast('Please enter a SQL query to execute.', 'warning');
            return;
        }

        const runBtn = document.getElementById('btn-run-query');
        if (runBtn) {
            runBtn.disabled = true;
            runBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Executing...';
        }

        const startTime = performance.now();

        try {
            // Execute SQL query against local/backend database
            const result = await this.executeSQL(rawQuery, this.activeCaseId);
            const endTime = performance.now();
            const durationMs = Math.round(endTime - startTime);

            // Display Results
            this.displayQueryResults(result, durationMs, rawQuery);

            // Evaluate Objective Progress
            this.evaluateObjectiveProgress(rawQuery, result);

            // Record History
            this.queryHistory.unshift({
                query: rawQuery,
                rowsCount: result.length,
                time: new Date().toLocaleTimeString(),
                durationMs
            });

        } catch (error) {
            console.error('SQL Execution Error:', error);
            this.displayQueryError(error.message);
        } finally {
            if (runBtn) {
                runBtn.disabled = false;
                runBtn.innerHTML = '<i class="fas fa-play"></i> Run Query (Ctrl+Enter)';
            }
        }
    },

    // Relational SQL Processor
    async executeSQL(sql, currentCaseId) {
        // Clean and validate query
        const cleanSql = sql.replace(/;+$/, '').trim();
        
        // Security check: Only SELECT allowed
        if (!/^SELECT\s+/i.test(cleanSql)) {
            throw new Error('SECURITY VIOLATION: Only SELECT read-only queries are permitted on the investigation terminal.');
        }

        // Match table from FROM clause
        const fromMatch = cleanSql.match(/FROM\s+([a-zA-Z0-9_]+)/i);
        if (!fromMatch) {
            throw new Error('SQL Syntax Error: Missing FROM clause.');
        }

        const primaryTable = fromMatch[1].toLowerCase();
        let rows = this.db[primaryTable];
        if (!rows) {
            throw new Error(`Table '${primaryTable}' does not exist in the investigation database.`);
        }

        // Clone rows
        let data = JSON.parse(JSON.stringify(rows));

        // Filter by case_id if table has case_id and query doesn't specify case_id
        if (data.length > 0 && 'case_id' in data[0] && !cleanSql.toLowerCase().includes('case_id')) {
            data = data.filter(r => r.case_id === currentCaseId);
        }

        // Handle JOIN
        const joinMatch = cleanSql.match(/JOIN\s+([a-zA-Z0-9_]+)\s+ON\s+([a-zA-Z0-9_.]+)\s*=\s*([a-zA-Z0-9_.]+)/i);
        if (joinMatch) {
            const joinTable = joinMatch[1].toLowerCase();
            const leftCol = joinMatch[2].split('.').pop();
            const rightCol = joinMatch[3].split('.').pop();
            const joinRows = this.db[joinTable] || [];

            const joined = [];
            data.forEach(mainRow => {
                const matches = joinRows.filter(jRow => jRow[rightCol] === mainRow[leftCol] || jRow[leftCol] === mainRow[rightCol]);
                matches.forEach(m => joined.push({ ...mainRow, ...m }));
            });
            if (joined.length > 0) data = joined;
        }

        // Handle WHERE clause filtering
        const whereMatch = cleanSql.match(/WHERE\s+([\s\S]*?)(?:GROUP\s+BY|ORDER\s+BY|LIMIT|$)/i);
        if (whereMatch) {
            const whereClause = whereMatch[1].trim();
            data = this.filterRowsByWhere(data, whereClause);
        }

        // Handle GROUP BY & Aggregates
        const groupByMatch = cleanSql.match(/GROUP\s+BY\s+([a-zA-Z0-9_,\s]+)/i);
        if (groupByMatch) {
            const groupCols = groupByMatch[1].split(',').map(c => c.trim().toLowerCase());
            data = this.groupRows(data, groupCols, cleanSql);
        }

        // Handle ORDER BY
        const orderByMatch = cleanSql.match(/ORDER\s+BY\s+([a-zA-Z0-9_]+)(?:\s+(ASC|DESC))?/i);
        if (orderByMatch) {
            const orderCol = orderByMatch[1].toLowerCase();
            const isDesc = (orderByMatch[2] || 'ASC').toUpperCase() === 'DESC';
            data.sort((a, b) => {
                let valA = a[orderCol];
                let valB = b[orderCol];
                if (valA === undefined) return 1;
                if (valB === undefined) return -1;
                if (typeof valA === 'number' && typeof valB === 'number') {
                    return isDesc ? valB - valA : valA - valB;
                }
                valA = String(valA).toLowerCase();
                valB = String(valB).toLowerCase();
                return isDesc ? valB.localeCompare(valA) : valA.localeCompare(valB);
            });
        }

        // Handle LIMIT
        const limitMatch = cleanSql.match(/LIMIT\s+(\d+)/i);
        if (limitMatch) {
            const limit = parseInt(limitMatch[1], 10);
            data = data.slice(0, limit);
        }

        // Handle Column Projections (SELECT cols)
        const selectMatch = cleanSql.match(/^SELECT\s+([\s\S]*?)\s+FROM/i);
        if (selectMatch) {
            const selectColsStr = selectMatch[1].trim();
            if (selectColsStr !== '*' && !groupByMatch) {
                const projectedCols = selectColsStr.split(',').map(c => c.trim());
                data = data.map(row => {
                    const newRow = {};
                    projectedCols.forEach(col => {
                        const colKey = col.split(/\s+as\s+/i)[0].trim().split('.').pop().toLowerCase();
                        const alias = col.split(/\s+as\s+/i)[1] ? col.split(/\s+as\s+/i)[1].trim() : colKey;
                        newRow[alias] = row[colKey] !== undefined ? row[colKey] : null;
                    });
                    return newRow;
                });
            }
        }

        return data;
    },

    // Evaluates WHERE conditions against row objects
    filterRowsByWhere(rows, whereStr) {
        return rows.filter(row => {
            // Split multiple AND clauses
            const conditions = whereStr.split(/\s+AND\s+/i);
            return conditions.every(cond => {
                cond = cond.trim();
                
                // Equals (=)
                let eq = cond.match(/([a-zA-Z0-9_.]+)\s*=\s*['"]?([^'"]+)['"]?/i);
                if (eq) {
                    const col = eq[1].split('.').pop().toLowerCase();
                    const val = eq[2].trim();
                    const rowVal = String(row[col] !== undefined ? row[col] : '').toLowerCase();
                    return rowVal === val.toLowerCase();
                }

                // Not equals (!= or <>)
                let neq = cond.match(/([a-zA-Z0-9_.]+)\s*(?:!=|<>)\s*['"]?([^'"]+)['"]?/i);
                if (neq) {
                    const col = neq[1].split('.').pop().toLowerCase();
                    const val = neq[2].trim();
                    const rowVal = String(row[col] !== undefined ? row[col] : '').toLowerCase();
                    return rowVal !== val.toLowerCase();
                }

                // LIKE
                let like = cond.match(/([a-zA-Z0-9_.]+)\s+LIKE\s+['"]%?([^'"%]+)%?['"]/i);
                if (like) {
                    const col = like[1].split('.').pop().toLowerCase();
                    const val = like[2].toLowerCase();
                    const rowVal = String(row[col] !== undefined ? row[col] : '').toLowerCase();
                    return rowVal.includes(val);
                }

                // Greater than / Less than
                let gt = cond.match(/([a-zA-Z0-9_.]+)\s*>\s*(\d+)/i);
                if (gt) {
                    const col = gt[1].split('.').pop().toLowerCase();
                    const val = Number(gt[2]);
                    return Number(row[col]) > val;
                }

                let lt = cond.match(/([a-zA-Z0-9_.]+)\s*<\s*(\d+)/i);
                if (lt) {
                    const col = lt[1].split('.').pop().toLowerCase();
                    const val = Number(lt[2]);
                    return Number(row[col]) < val;
                }

                return true;
            });
        });
    },

    // Groups rows for aggregate queries
    groupRows(rows, groupCols, sql) {
        const groups = {};
        rows.forEach(r => {
            const key = groupCols.map(c => r[c]).join('__');
            if (!groups[key]) groups[key] = [];
            groups[key].push(r);
        });

        const hasCount = /COUNT\s*\(/i.test(sql);
        const result = [];

        for (const key in groups) {
            const groupRows = groups[key];
            const first = groupRows[0];
            const rowObj = {};
            groupCols.forEach(col => {
                rowObj[col] = first[col];
            });
            if (hasCount) {
                rowObj['count'] = groupRows.length;
            }
            result.push(rowObj);
        }

        return result;
    },

    // Display query results table in workbench
    displayQueryResults(rows, durationMs, query) {
        const container = document.getElementById('term-results-container');
        const countBadge = document.getElementById('term-results-count-badge');
        const timerBadge = document.getElementById('term-results-timer-badge');

        if (countBadge) countBadge.textContent = `${rows.length} row${rows.length === 1 ? '' : 's'}`;
        if (timerBadge) timerBadge.textContent = `⚡ ${durationMs}ms`;

        if (!container) return;

        if (!rows || rows.length === 0) {
            container.innerHTML = `
                <div class="results-empty-state">
                    <i class="fas fa-search"></i>
                    <p>Query executed successfully, but returned 0 records.</p>
                </div>
            `;
            return;
        }

        const columns = Object.keys(rows[0]);

        const tableHtml = `
            <table class="results-data-table">
                <thead>
                    <tr>
                        <th class="row-num-col">#</th>
                        ${columns.map(col => `<th>${col}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${rows.map((row, idx) => `
                        <tr>
                            <td class="row-num-col">${idx + 1}</td>
                            ${columns.map(col => `<td>${this.escapeHtml(row[col])}</td>`).join('')}
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        container.innerHTML = tableHtml;
    },

    displayQueryError(errMsg) {
        const container = document.getElementById('term-results-container');
        const countBadge = document.getElementById('term-results-count-badge');
        const timerBadge = document.getElementById('term-results-timer-badge');

        if (countBadge) countBadge.textContent = 'Error';
        if (timerBadge) timerBadge.textContent = 'Failed';

        if (container) {
            container.innerHTML = `
                <div class="results-error-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h4>SQL Execution Error</h4>
                    <p>${errMsg}</p>
                </div>
            `;
        }
        this.showToast(`SQL Error: ${errMsg}`, 'error');
    },

    // ========================================================================
    // OBJECTIVE EVALUATION & PROGRESSION
    // ========================================================================

    evaluateObjectiveProgress(query, queryResult) {
        if (!this.activeObjectiveId || !this.db) return;

        const obj = this.db.game_objectives.find(o => o.id === this.activeObjectiveId);
        if (!obj) return;

        const caseId = this.activeCaseId;
        const caseProgress = this.player.caseProgress[caseId] || { completedObjectives: [], stars: 0 };
        if (caseProgress.completedObjectives.includes(obj.id)) return;

        // Normalization helper
        const norm = (str) => (str || '').trim().replace(/;+$/, '').replace(/\s+/g, ' ').toUpperCase();
        const userNorm = norm(query);
        const expNorm = norm(obj.expected_query);

        // Check if queries match or semantic match
        let isCorrect = false;
        if (userNorm === expNorm) {
            isCorrect = true;
        } else if (queryResult && queryResult.length > 0) {
            // Check table match and intent
            const fromUser = userNorm.match(/FROM\s+([A-Z0-9_]+)/);
            const fromExp = expNorm.match(/FROM\s+([A-Z0-9_]+)/);
            if (fromUser && fromExp && fromUser[1] === fromExp[1]) {
                isCorrect = true;
            }
        }

        if (isCorrect) {
            // Mark objective complete
            caseProgress.completedObjectives.push(obj.id);
            this.player.caseProgress[caseId] = caseProgress;
            
            // Add XP
            const earnedXP = obj.points || 100;
            this.player.xp += earnedXP;
            
            this.showToast(`🎯 Objective Complete: ${obj.title} (+${earnedXP} XP)`, 'success');
            this.savePlayerState();

            // Re-render objectives list
            this.renderCaseObjectives(caseId);

            // Check if all objectives for this case are finished
            const allCaseObjectives = this.db.game_objectives.filter(o => o.case_id === caseId);
            const allDone = allCaseObjectives.every(o => caseProgress.completedObjectives.includes(o.id));
            if (allDone) {
                this.showToast(`⭐ All case objectives met! Submit your Investigation Report to solve Case ${caseId}.`, 'success');
                const accuseBtn = document.getElementById('btn-open-accusation');
                if (accuseBtn) accuseBtn.classList.add('pulse');
            }
        }
    },

    // ========================================================================
    // ACCUSATION & CASE DEDUCTION WORKFLOW
    // ========================================================================

    openAccusationModal() {
        const modal = document.getElementById('modal-accusation');
        if (!modal || !this.db) return;

        const caseId = this.activeCaseId;
        const caseData = this.db.game_cases.find(c => c.id === caseId);
        const suspects = this.db.suspects.filter(s => s.case_id === caseId);

        const modalTitle = document.getElementById('accuse-modal-case-title');
        const suspectSelect = document.getElementById('accuse-suspect-select');

        if (modalTitle && caseData) {
            modalTitle.textContent = `Case ${caseId}: ${caseData.title}`;
        }

        if (suspectSelect) {
            if (caseId === 0) {
                // Tutorial special
                suspectSelect.innerHTML = `
                    <option value="">-- Select Audit Finding --</option>
                    <option value="missing_evidence">Missing Evidence Discovered in Locker A-15 & Lab 2</option>
                `;
            } else {
                suspectSelect.innerHTML = `
                    <option value="">-- Select Prime Suspect --</option>
                    ${suspects.map(s => `<option value="${s.name}">${s.name} (${s.occupation || 'Suspect'})</option>`).join('')}
                `;
            }
        }

        modal.classList.remove('hidden');
    },

    submitCaseDeduction() {
        const caseId = this.activeCaseId;
        const suspectSelect = document.getElementById('accuse-suspect-select');
        const motiveInput = document.getElementById('accuse-motive-input');
        const evidenceInput = document.getElementById('accuse-evidence-input');

        const selectedSuspect = suspectSelect ? suspectSelect.value : '';
        if (!selectedSuspect) {
            this.showToast('Please select a suspect to submit your deduction.', 'warning');
            return;
        }

        // Canonical killers per case
        const CANONICAL_SOLUTIONS = {
            0: 'missing_evidence',
            1: 'Raghav Sethi',
            2: 'Dr. Madhavan Joshi',
            3: 'Kallol Sen',
            4: 'Swami Shankarananda',
            5: 'Devabrata Ray',
            6: 'Vikram & Vivek Malhotra',
            7: 'Kalyan Sen',
            8: 'Swami Dayanand',
            9: 'Sudhir Varma',
            10: 'Aniket Deshpande',
            11: 'Varun Somayaji',
            12: 'Dr. Siddharth Nair',
            13: 'Keshava Namboodiri',
            14: 'Dr. Alok Sen',
            15: 'Prof. Radhamadhav Tripathi',
            16: 'Indrajit Bhattacharya',
            17: 'Naveen Kashyap',
            18: 'Dr. Vedant Kashyap'
        };

        const targetKiller = CANONICAL_SOLUTIONS[caseId] || selectedSuspect;
        const isCorrect = (selectedSuspect.toLowerCase() === targetKiller.toLowerCase()) || caseId === 0;

        // Close accusation modal
        document.getElementById('modal-accusation').classList.add('hidden');

        if (isCorrect) {
            // Case solved!
            if (!this.player.completedCases.includes(caseId)) {
                this.player.completedCases.push(caseId);
                this.player.xp += 500;
                this.player.totalStars += 3;
            }

            // Unlock next case
            const nextCaseId = caseId + 1;
            if (nextCaseId <= 18 && !this.player.unlockedCases.includes(nextCaseId)) {
                this.player.unlockedCases.push(nextCaseId);
            }

            this.savePlayerState();
            this.showCaseSolvedModal(caseId, selectedSuspect);
        } else {
            this.showToast(`❌ Accusation Inconclusive: Forensics and witness statements do not corroborate ${selectedSuspect} as the primary perpetrator. Continue your investigation.`, 'error');
        }
    },

    showCaseSolvedModal(caseId, culprit) {
        const modal = document.getElementById('modal-case-solved');
        if (!modal) return;

        const caseData = this.db.game_cases.find(c => c.id === caseId);
        const titleEl = document.getElementById('solved-modal-case-title');
        const descEl = document.getElementById('solved-modal-debrief');

        if (titleEl && caseData) titleEl.textContent = `CASE ${caseId}: ${caseData.title}`;
        if (descEl) {
            descEl.innerHTML = `
                <p>Outstanding detective work, Investigator <strong>${this.player.name}</strong>. The evidence gathered corroborated all charges, uncovering another layer of Project Vritra.</p>
                <div class="solved-reward-box">
                    <span><i class="fas fa-trophy text-gold"></i> +500 XP Earned</span>
                    <span><i class="fas fa-star text-gold"></i> 3 Stars Awarded</span>
                    <span><i class="fas fa-unlock text-success"></i> Case ${caseId + 1} Unlocked</span>
                </div>
            `;
        }

        modal.classList.remove('hidden');
    },

    openBriefingModal(caseId) {
        const modal = document.getElementById('modal-briefing');
        if (!modal || !this.db) return;

        const caseData = this.db.game_cases.find(c => c.id === caseId);
        if (!caseData) return;

        const titleEl = document.getElementById('briefing-modal-title');
        const bodyEl = document.getElementById('briefing-modal-body');
        const startBtn = document.getElementById('briefing-modal-start-btn');

        if (titleEl) titleEl.textContent = `Case Briefing: ${caseData.title}`;
        if (bodyEl) {
            bodyEl.innerHTML = `
                <div class="briefing-meta-grid">
                    <div><strong>Difficulty:</strong> ${caseData.difficulty.toUpperCase()}</div>
                    <div><strong>Duration:</strong> ~${caseData.estimated_duration_minutes} Minutes</div>
                    <div><strong>Story Arc:</strong> ${caseData.story_arc || 'Investigation'}</div>
                    <div><strong>Mythology Theme:</strong> ${caseData.mythology_theme || 'N/A'}</div>
                </div>
                <hr style="border-color: var(--color-border); margin: var(--spacing-md) 0;">
                <p><strong>Incident Summary:</strong></p>
                <p>${caseData.description}</p>
                <p><strong>Task Force Intelligence:</strong></p>
                <p>${caseData.story_background || 'Classified investigative record.'}</p>
            `;
        }

        if (startBtn) {
            startBtn.onclick = () => {
                modal.classList.add('hidden');
                VritraApp.openCase(caseId);
            };
        }

        modal.classList.remove('hidden');
    },

    openSchemaModal() {
        const modal = document.getElementById('modal-schema');
        if (modal) modal.classList.remove('hidden');
    },

    // ========================================================================
    // DETECTIVE BOARD INTERACTIVE CANVAS
    // ========================================================================

    initDetectiveBoard(caseId) {
        const canvas = document.getElementById('detective-board-canvas');
        if (!canvas || !this.db) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        // Clear canvas
        ctx.fillStyle = '#111115';
        ctx.fillRect(0, 0, width, height);

        // Draw pinboard grid lines
        ctx.strokeStyle = '#22222a';
        ctx.lineWidth = 1;
        for (let x = 0; x < width; x += 30) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
        for (let y = 0; y < height; y += 30) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        // Get nodes for this case
        const suspects = this.db.suspects.filter(s => s.case_id === caseId).slice(0, 4);
        const evidenceItems = this.db.evidence.filter(e => e.case_id === caseId).slice(0, 3);
        const victimName = caseId === 1 ? 'Rajveer Rathore' : caseId === 2 ? 'Dr. Ramanujan' : 'Victim / Target';

        const centerNode = { name: victimName, type: 'Victim', x: width / 2, y: height / 2 - 20, color: '#ef4444' };

        const nodes = [centerNode];

        // Place suspects in circle
        suspects.forEach((s, idx) => {
            const angle = (idx * Math.PI * 2) / (suspects.length || 1) + 0.3;
            nodes.push({
                name: s.name,
                type: 'Suspect',
                x: width / 2 + Math.cos(angle) * 120,
                y: height / 2 + Math.sin(angle) * 110 - 10,
                color: '#f59e0b'
            });
        });

        // Place evidence
        evidenceItems.forEach((e, idx) => {
            nodes.push({
                name: e.name.substring(0, 16),
                type: 'Evidence',
                x: 60 + idx * 130,
                y: height - 50,
                color: '#22c55e'
            });
        });

        // Draw red connecting yarn threads
        ctx.strokeStyle = '#a52a2a';
        ctx.lineWidth = 1.5;
        for (let i = 1; i < nodes.length; i++) {
            ctx.beginPath();
            ctx.moveTo(centerNode.x, centerNode.y);
            ctx.lineTo(nodes[i].x, nodes[i].y);
            ctx.stroke();
        }

        // Draw Nodes
        nodes.forEach(node => {
            // Clamp node positions to keep labels inside canvas
            const clampedX = Math.max(50, Math.min(width - 50, node.x));
            const clampedY = Math.max(30, Math.min(height - 45, node.y));

            // Pin circle
            ctx.fillStyle = node.color;
            ctx.beginPath();
            ctx.arc(clampedX, clampedY, 14, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Label Card
            ctx.fillStyle = 'rgba(26, 26, 32, 0.9)';
            ctx.strokeStyle = '#3d3d4d';
            ctx.lineWidth = 1;
            const textWidth = ctx.measureText(node.name).width;
            ctx.fillRect(clampedX - textWidth / 2 - 6, clampedY + 18, textWidth + 12, 18);
            ctx.strokeRect(clampedX - textWidth / 2 - 6, clampedY + 18, textWidth + 12, 18);

            ctx.fillStyle = '#e0e0e0';
            ctx.font = '10px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(node.name, clampedX, clampedY + 31);
        });
    },

    // ========================================================================
    // TEAM & STORY & LEADERBOARD VIEWS
    // ========================================================================

    renderTeamView() {
        const container = document.getElementById('team-grid-container');
        if (!container || !this.db || !this.db.characters) return;

        container.innerHTML = this.db.characters.map(char => `
            <div class="team-character-card" style="border-top: 3px solid ${char.color || 'var(--color-gold)'}">
                <div class="char-avatar-circle" style="background: ${char.color || 'var(--color-gold)'}22; color: ${char.color || 'var(--color-gold)'}">
                    <i class="${char.icon || 'fas fa-user-secret'}"></i>
                </div>
                <h3 class="char-name">${char.name}</h3>
                <span class="char-role">${char.role}</span>
                <span class="char-dept">${char.department}</span>
                <p class="char-desc"><strong>Expertise:</strong> ${char.expertise}</p>
                <p class="char-desc"><strong>Personality:</strong> ${char.personality}</p>
            </div>
        `).join('');
    },

    renderStoryView() {
        // Story view populated with canonical lore
    },

    renderProgressView() {
        const nameEl = document.getElementById('page-progress-name');
        const emailEl = document.getElementById('page-progress-email');
        const rankEl = document.getElementById('page-progress-rank');
        const xpEl = document.getElementById('page-progress-xp');
        const pctEl = document.getElementById('page-progress-pct');
        const barEl = document.getElementById('page-progress-bar');
        const casesListEl = document.getElementById('page-progress-cases-list');

        const completedCount = this.player.completedCases.length;
        const pct = Math.round((completedCount / 18) * 100);

        if (nameEl) nameEl.textContent = this.player.name;
        if (emailEl) emailEl.textContent = this.player.email || 'prasoon.pathak@vritra-tf.gov.in';
        if (rankEl) rankEl.textContent = this.player.rank;
        if (xpEl) xpEl.textContent = `${this.player.xp.toLocaleString()} XP`;
        if (pctEl) pctEl.textContent = `${pct}% Complete`;
        if (barEl) barEl.style.width = `${pct}%`;

        if (casesListEl && this.db && this.db.game_cases) {
            casesListEl.innerHTML = this.db.game_cases.map(c => {
                const isCompleted = this.player.completedCases.includes(c.id);
                const progress = this.player.caseProgress[c.id] || {};
                const stars = progress.stars || (isCompleted ? 3 : 0);
                const score = progress.score || 0;

                return `
                    <div class="flex justify-between items-center p-sm mb-xs" style="background: var(--color-bg-secondary); border-radius: var(--radius-sm); border: 1px solid var(--color-border); font-size: 0.85rem; padding: 10px 14px;">
                        <div>
                            <span class="text-gold" style="font-weight: 700;">CASE ${c.id.toString().padStart(2, '0')}:</span> ${c.title}
                        </div>
                        <div class="flex items-center gap-sm">
                            ${isCompleted 
                                ? `<span class="text-success" style="font-weight: 600;"><i class="fas fa-check-circle"></i> Solved (${'⭐'.repeat(stars)} • ${score} pts)</span>`
                                : `<span class="text-muted"><i class="fas fa-hourglass-half"></i> Pending Clearance</span>`
                            }
                        </div>
                    </div>
                `;
            }).join('');
        }
    },

    renderCredentialsView() {
        const nameInput = document.getElementById('page-auth-name');
        const emailInput = document.getElementById('page-auth-email');
        if (nameInput) nameInput.value = this.player.name || 'Prasoon Pathak';
        if (emailInput) emailInput.value = this.player.email || 'prasoon.pathak@vritra-tf.gov.in';
    },

    renderLeaderboardView() {
        const ranksList = document.getElementById('leaderboard-ranks-list');
        const achievList = document.getElementById('leaderboard-achievements-list');

        if (ranksList && this.db && this.db.rank_progression) {
            ranksList.innerHTML = this.db.rank_progression.map((r, idx) => {
                const isCurrent = this.player.rank === r.rank;
                return `
                    <div class="rank-row ${isCurrent ? 'current-rank' : ''}">
                        <span class="rank-badge-icon">${r.badge || '🏅'}</span>
                        <div class="rank-info">
                            <h4>${r.rank} ${isCurrent ? '<span class="current-tag">ACTIVE RANK</span>' : ''}</h4>
                            <p>${r.description}</p>
                        </div>
                        <div class="rank-req">
                            <span>${r.minCases} Cases</span>
                            <span>${r.minXP.toLocaleString()} XP</span>
                        </div>
                    </div>
                `;
            }).join('');
        }

        if (achievList && this.db && this.db.achievements) {
            achievList.innerHTML = this.db.achievements.map(a => {
                const isUnlocked = this.player.unlockedAchievements.includes(a.id);
                return `
                    <div class="achievement-card ${isUnlocked ? 'unlocked' : 'locked'}">
                        <span class="achievement-icon">${a.icon || '🏆'}</span>
                        <div>
                            <h4>${a.name}</h4>
                            <p>${a.description}</p>
                            <span class="achievement-points">+${a.points} XP</span>
                        </div>
                    </div>
                `;
            }).join('');
        }
    },

    // ========================================================================
    // NOTIFICATIONS & TOASTS
    // ========================================================================

    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toast-container') || this.createToastContainer();
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle'}"></i>
            <span>${this.escapeHtml(message)}</span>
        `;
        toastContainer.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    },

    createToastContainer() {
        const container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
        return container;
    },

    addNotification(title, message) {
        // Notification logged
        console.log(`[Notification] ${title}: ${message}`);
    },

    escapeHtml(str) {
        if (str === null || str === undefined) return '<span class="null-val">NULL</span>';
        if (typeof str === 'boolean') return `<span class="bool-val">${str}</span>`;
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }
};

// Global Bootstrapper
document.addEventListener('DOMContentLoaded', () => {
    window.VritraApp = VritraApp;
    VritraApp.init();
});