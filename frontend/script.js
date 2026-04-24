// Murder Mystery Detective Game - Interactive JavaScript

// LocalStorage utility functions - Only for playerId and login state (not game data)
function saveLoginState() {
    try {
        if (gameState.playerId) {
            localStorage.setItem('mm_player_id', gameState.playerId);
        }
        if (gameState.detectiveName) {
            localStorage.setItem('mm_detective_name', gameState.detectiveName);
        }
        if (gameState.isLoggedIn) {
            localStorage.setItem('mm_logged_in', '1');
        }
    } catch (e) {
        console.warn('Failed to save login state:', e);
    }
}

function loadLoginState() {
    try {
        const playerId = localStorage.getItem('mm_player_id');
        const detectiveName = localStorage.getItem('mm_detective_name');
        const isLoggedIn = localStorage.getItem('mm_logged_in') === '1';
        
        return {
            playerId: playerId || null,
            detectiveName: detectiveName || '',
            isLoggedIn: isLoggedIn
        };
    } catch (e) {
        console.warn('Failed to load login state:', e);
    }
    return { playerId: null, detectiveName: '', isLoggedIn: false };
}

// Game State - Initialize from login state only, game data comes from backend
const loginState = loadLoginState();
let gameState = {
    isLoggedIn: loginState.isLoggedIn,
    detectiveName: loginState.detectiveName,
    playerId: loginState.playerId,
    progress: 0,
    discoveredClues: [],
    suspects: [],
    currentQuery: '',
    queryHistory: [],
    currentLevel: 1,
    totalLevels: 5,
    levelFlags: {},
    levelCompleted: false,
    // Persisted across navigation (loaded from backend)
    flagsByLevel: {},
    completedLevels: {},
    currentCaseId: 1,
    storyStage: 1,
    inventory: []
};

// Level configuration (5 levels)
const LEVELS = [
    {
        id: 1,
        objective: "Identify all witnesses with unverified alibis and rank suspects by suspicion.",
        stageDescription: "Initial triage: separate verified vs unverified alibis and see who looks most suspicious.",
        hints: [
            "Filter witnesses by alibi status.",
            "Order suspects by their suspicion score descending.",
            "Look for any cluster of high suspicion." 
        ],
        validators: {
            found_unverified_witnesses: (q, r) => /from\s+witnesses/.test(q) && /alibi_verified/.test(q) && /false/.test(q) && r.length > 0,
            ranked_suspects: (q, r) => /from\s+suspects/.test(q) && /order\s+by/.test(q) && /suspicion_level/.test(q)
        },
        summary: (flags) => [
            ["Unverified alibi witnesses", flags.found_unverified_witnesses ? "Identified" : "Pending"],
            ["Suspects ranked", flags.ranked_suspects ? "Yes" : "No"]
        ]
    },
    {
        id: 2,
        objective: "Investigate each unverified person by name and corroborate with critical forensics.",
        stageDescription: "Focused questioning: review statements of unverified witnesses and compare with critical lab findings.",
        hints: [
            "Search witnesses by exact full name.",
            "Cross-check forensics marked 'Critical'.",
            "Correlate names appearing in both datasets."
        ],
        validators: {
            checked_eleanor: (q, r) => /from\s+witnesses/.test(q) && /name\s*=\s*['\"]mrs\.\s*eleanor\s*blackwood['\"]/.test(q),
            checked_sarah: (q, r) => /from\s+witnesses/.test(q) && /name\s*=\s*['\"]sarah\s*mitchell['\"]/.test(q),
            checked_thomas: (q, r) => /from\s+witnesses/.test(q) && /name\s*=\s*['\"]thomas\s*blackwood['\"]/.test(q),
            saw_critical_forensics: (q, r) => /from\s+forensics/.test(q) && /significance/.test(q) && /critical/.test(q)
        },
        summary: (flags) => [
            ["Interviewed Eleanor", flags.checked_eleanor ? "Yes" : "No"],
            ["Interviewed Sarah", flags.checked_sarah ? "Yes" : "No"],
            ["Interviewed Thomas", flags.checked_thomas ? "Yes" : "No"],
            ["Critical forensics reviewed", flags.saw_critical_forensics ? "Yes" : "No"],
        ]
    },
    {
        id: 3,
        objective: "Align timeline of events with witness claims.",
        stageDescription: "Reconstruction: compare claimed movements with the timeline of noises, sightings and discovery.",
        hints: [
            "Retrieve the full timeline.",
            "Look at timestamps around 10:00–11:30 PM.",
            "Match witness names between timeline and interviews."
        ],
        validators: {
            pulled_timeline: (q, r) => /from\s+timeline/.test(q),
            referenced_sarah: (q, r) => /from\s+witnesses/.test(q) && /sarah/.test(q),
            referenced_thomas: (q, r) => /from\s+witnesses/.test(q) && /thomas/.test(q)
        },
        summary: (flags) => [
            ["Timeline loaded", flags.pulled_timeline ? "Yes" : "No"],
            ["Cross-checked Sarah", flags.referenced_sarah ? "Yes" : "No"],
            ["Cross-checked Thomas", flags.referenced_thomas ? "Yes" : "No"]
        ]
    },
    {
        id: 4,
        objective: "Narrow suspects using high suspicion threshold and forensic matches.",
        stageDescription: "Filtering: isolate top suspects and ensure evidence corroboration exists.",
        hints: [
            "Filter suspects above a suspicion threshold.",
            "Search for forensic matches by person name.",
            "Focus on names that appear in both filters."
        ],
        validators: {
            filtered_high_suspicion: (q, r) => /from\s+suspects/.test(q) && /suspicion_level/.test(q) && />\s*\d+/.test(q),
            matched_forensics_any: (q, r) => /from\s+forensics/.test(q) && /match/.test(q)
        },
        summary: (flags) => [
            ["High suspicion filtered", flags.filtered_high_suspicion ? "Yes" : "No"],
            ["Forensic matches checked", flags.matched_forensics_any ? "Yes" : "No"]
        ]
    },
    {
        id: 5,
        objective: "Name the main culprit based on DNA and behavior evidence.",
        stageDescription: "Conclusion: confirm the individual with both critical DNA evidence and top suspicion.",
        hints: [
            "Inspect the suspect with highest suspicion.",
            "Check for a DNA match in forensics.",
            "Confirm their alibi conflicts with the timeline."
        ],
        validators: {
            checked_thomas_suspect: (q, r) => /from\s+suspects/.test(q) && /name\s*=\s*['\"]thomas\s*blackwood['\"]/.test(q),
            matched_forensics: (q, r) => /from\s+forensics/.test(q) && /match/.test(q) && /thomas\s*blackwood/.test(q)
        },
        summary: (flags) => [
            ["Thomas profile reviewed", flags.checked_thomas_suspect ? "Yes" : "No"],
            ["DNA match confirmed", flags.matched_forensics ? "Yes" : "No"]
        ]
    }
];

function showGameUI(username) {
    // Ensure login section is hidden and game shown, without form reload side-effects
    try {
        detectiveNameSpan.textContent = username || gameState.detectiveName || 'Detective';
    } catch {}
    loginSection.style.display = 'none';
    loginSection.style.opacity = '0';
    loginSection.style.transform = 'translateY(-100vh)';
    gameSection.classList.remove('hidden');
    gameSection.style.opacity = '1';
    gameSection.style.transform = 'translateY(0)';
}

// Sample Database (In a real app, this would be connected to a backend)
const mockDatabase = {
    witnesses: [
        { id: 1, name: 'Mrs. Eleanor Blackwood', relationship: 'Wife', alibi_verified: 'false', statement: 'I was in my room reading when I heard the commotion.' },
        { id: 2, name: 'James Blackwood', relationship: 'Son', alibi_verified: 'true', statement: 'I was at the library studying until 11 PM.' },
        { id: 3, name: 'Sarah Mitchell', relationship: 'Maid', alibi_verified: 'false', statement: 'I was cleaning the kitchen when I heard screams.' },
        { id: 4, name: 'Dr. Robert Chen', relationship: 'Family Doctor', alibi_verified: 'true', statement: 'I was at the hospital until midnight.' },
        { id: 5, name: 'Thomas Blackwood', relationship: 'Brother', alibi_verified: 'false', statement: 'I was in the garden smoking when it happened.' }
    ],
    suspects: [
        { id: 1, name: 'Mrs. Eleanor Blackwood', motive: 'Inheritance', alibi: 'Unverified', suspicious_behavior: 'Found with victim\'s will', suspicion_level: 85 },
        { id: 2, name: 'James Blackwood', motive: 'Financial debt', alibi: 'Verified', suspicious_behavior: 'None reported', suspicion_level: 30 },
        { id: 3, name: 'Sarah Mitchell', motive: 'Blackmail', alibi: 'Unverified', suspicious_behavior: 'Overheard arguing with victim', suspicion_level: 70 },
        { id: 4, name: 'Dr. Robert Chen', motive: 'Medical malpractice cover-up', alibi: 'Verified', suspicious_behavior: 'None reported', suspicion_level: 25 },
        { id: 5, name: 'Thomas Blackwood', motive: 'Business rivalry', alibi: 'Unverified', suspicious_behavior: 'Last seen with victim', suspicion_level: 90 }
    ],
    forensics: [
        { id: 1, evidence_type: 'Fingerprint', location: 'Study door handle', match: 'Sarah Mitchell', significance: 'High' },
        { id: 2, evidence_type: 'DNA', location: 'Victim\'s clothing', match: 'Thomas Blackwood', significance: 'Critical' },
        { id: 3, evidence_type: 'Weapon', location: 'Study floor', description: 'Letter opener with blood', significance: 'Critical' },
        { id: 4, evidence_type: 'Fiber', location: 'Victim\'s hand', match: 'Mrs. Eleanor Blackwood\'s dress', significance: 'Medium' }
    ],
    timeline: [
        { time: '9:30 PM', event: 'Victim last seen alive in study', witness: 'Sarah Mitchell' },
        { time: '10:00 PM', event: 'Heard arguing in study', witness: 'Mrs. Eleanor Blackwood' },
        { time: '10:15 PM', event: 'Study door slammed', witness: 'Thomas Blackwood' },
        { time: '11:30 PM', event: 'Body discovered', witness: 'Sarah Mitchell' },
        { time: '11:45 PM', event: 'Police called', witness: 'Mrs. Eleanor Blackwood' }
    ]
};

// DOM Elements
const loadingScreen = document.getElementById('loading-screen');
const loginSection = document.getElementById('login-section');
const gameSection = document.getElementById('game-section');
const loginForm = document.getElementById('loginForm');
const detectiveNameSpan = document.getElementById('detective-name');
const progressPercentage = document.getElementById('progress-percentage');
const progressFill = document.querySelector('.progress-fill');
const sqlQuery = document.getElementById('sqlQuery');
const executeBtn = document.getElementById('executeQuery');
const resultsContainer = document.getElementById('resultsContainer');
const resultCount = document.getElementById('result-count');
const executionTime = document.getElementById('execution-time');
const cluesContainer = document.getElementById('cluesContainer');
const suspectsGrid = document.getElementById('suspectsGrid');
const evidenceModal = document.getElementById('evidenceModal');
const hintModal = document.getElementById('hintModal');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const hintText = document.getElementById('hintText');
const nextStageBtn = document.getElementById('nextStageBtn');
const currentLevelEl = document.getElementById('currentLevel');
const totalLevelsEl = document.getElementById('totalLevels');
const levelStatusEl = document.getElementById('levelStatus');
const objectiveText = document.getElementById('objectiveText');
const suggestedQueriesEl = document.getElementById('suggestedQueries');
const hintsHeader = document.getElementById('hintsHeader');
const congratsModal = document.getElementById('congratsModal');
const closeCongratsModal = document.getElementById('closeCongratsModal');
const congratsText = document.getElementById('congratsText');
const backstoryModal = document.getElementById('backstoryModal');
const closeBackstoryModal = document.getElementById('closeBackstoryModal');
const caseTitle = document.getElementById('caseTitle');
const knowMoreBtn = document.getElementById('knowMoreBtn');
const prevStageBtn = document.getElementById('prevStageBtn');
const summaryBody = document.getElementById('summaryBody');
const stageDescription = document.getElementById('stageDescription');
// Story & Inventory DOM
const storyContent = document.getElementById('storyContent');
const storyOptions = document.getElementById('storyOptions');
const inventoryList = document.getElementById('inventoryList');

// Initialize the game
document.addEventListener('DOMContentLoaded', async function() {
    // Check backend connection (don't block if it fails)
    try {
        const backendConnected = await checkBackendConnection();
        if (!backendConnected) {
            console.warn('⚠️ Backend server is not running!');
            console.warn('To start the backend:');
            console.warn('1. Navigate to: murder-mystery-game/backend');
            console.warn('2. Run: npm start');
            console.warn('3. Or double-click: START_BACKEND.bat');
            // Don't show alert that might cause issues, just log to console
        }
    } catch (e) {
        console.warn('Backend connection check failed:', e);
    }
    
    initializeGame();
    setupEventListeners();
    showLoadingScreen();
});

function initializeGame() {
    // Default: hide game section
    gameSection.classList.add('hidden');
    
    // Restore persisted login session - load game state from backend if logged in
    if (gameState.isLoggedIn && gameState.playerId) {
        showGameUI(gameState.detectiveName);
        
        // Load game state from backend
        (async () => {
            try {
                await loadGameStateFromBackend();
                await loadStory(gameState.currentCaseId, gameState.storyStage);
                
                // Load initial clue if none exist
                if (gameState.discoveredClues.length === 0) {
                    addClue('Initial Investigation', 'Lord Blackwood was found with a mysterious key in his hand', 'fas fa-key');
                }
            } catch (err) {
                showNotification('Failed to load game state: ' + err.message, 'error');
                console.error('Failed to load game state:', err);
            }
        })();
    }
    
    // Initialize suspects grid
    populateSuspectsGrid();
    
    // Initialize levels UI
    totalLevelsEl.textContent = gameState.totalLevels;
    
    // Initialize flags maps
    if (!gameState.flagsByLevel) gameState.flagsByLevel = {};
    if (!gameState.completedLevels) gameState.completedLevels = {};
    
    loadLevel(gameState.currentLevel);
    
    // Update progress display
    recomputeProgress();
}

function setupEventListeners() {
    // Login: prefer explicit button click to avoid form submit reloads
    const loginBtn = document.getElementById('loginSubmit');
    if (loginBtn) loginBtn.addEventListener('click', handleLogin);
    // Fallback: also bind submit with preventDefault
    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    
    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    
    // SQL query execution
    executeBtn.addEventListener('click', executeQuery);
    nextStageBtn.addEventListener('click', advanceLevel);
    prevStageBtn.addEventListener('click', retreatLevel);
    
    // Toolbar buttons
    document.querySelectorAll('.tool-btn').forEach(btn => {
        btn.addEventListener('click', handleToolAction);
    });
    
    // Evidence cards
    document.querySelectorAll('.view-evidence-btn').forEach(btn => {
        btn.addEventListener('click', showEvidenceModal);
    });
    
    // Modal close buttons
    document.getElementById('closeModal').addEventListener('click', closeModal);
    document.getElementById('closeHintModal').addEventListener('click', closeHintModal);
    if (closeCongratsModal) closeCongratsModal.addEventListener('click', () => congratsModal.classList.remove('active'));
    if (closeBackstoryModal) closeBackstoryModal.addEventListener('click', () => backstoryModal.classList.remove('active'));
    if (caseTitle) caseTitle.addEventListener('click', () => backstoryModal.classList.add('active'));
    if (knowMoreBtn) knowMoreBtn.addEventListener('click', () => backstoryModal.classList.add('active'));
    
    // Close modals when clicking outside
    evidenceModal.addEventListener('click', function(e) {
        if (e.target === evidenceModal) closeModal();
    });
    
    hintModal.addEventListener('click', function(e) {
        if (e.target === hintModal) closeHintModal();
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);

    // Suggested queries click to fill
    if (suggestedQueriesEl) {
        suggestedQueriesEl.addEventListener('click', (e) => {
            if (e.target && e.target.tagName === 'LI') {
                showNotification('Hint selected. Use it to craft your own query.', 'info');
            }
        });
    }

    // Toggle hints visibility
    if (hintsHeader && suggestedQueriesEl) {
        hintsHeader.addEventListener('click', () => {
            suggestedQueriesEl.classList.toggle('collapsed');
        });
    }
}
function showLoadingScreen() {
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
    }, 3000);
}

// Backend integration - Required, no fallbacks
const API_BASE = 'http://localhost:5050';

async function api(path, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    try {
        const res = await fetch(`${API_BASE}${path}`, {
            method: options.method || 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers || {})
            },
            body: options.body ? JSON.stringify(options.body) : undefined,
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!res.ok) {
            const text = await res.text().catch(() => '');
            let errorMessage = `HTTP ${res.status}`;
            try {
                const errorObj = JSON.parse(text);
                errorMessage = errorObj.error || errorObj.details || errorMessage;
            } catch (e) {
                errorMessage = text || errorMessage;
            }
            throw new Error(errorMessage);
        }
        
        const ct = res.headers.get('content-type') || '';
        return ct.includes('application/json') ? res.json() : res.text();
    } catch (e) {
        clearTimeout(timeoutId);
        if (e.name === 'AbortError' || e.message.includes('Failed to fetch') || e.message.includes('NetworkError')) {
            const errorMsg = `Cannot connect to backend server at ${API_BASE}. Please make sure the backend is running:\n\n1. Open a terminal\n2. Navigate to: murder-mystery-game/backend\n3. Run: npm start\n\nOr double-click: START_BACKEND.bat`;
            throw new Error(errorMsg);
        }
        throw e;
    }
}

// Check backend connectivity on page load
async function checkBackendConnection() {
    try {
        await api('/api/health');
        return true;
    } catch (e) {
        return false;
    }
}

async function createPlayerProfile(username) {
    if (!username) throw new Error('Username is required');
    
    // Create player profile in backend
    const data = await api('/api/players', { method: 'POST', body: { username } });
    if (!data || !data.playerId) {
        throw new Error('Failed to create player profile');
    }
    
    gameState.playerId = data.playerId;
    gameState.detectiveName = username;
    
    // Save playerId to localStorage for persistence across sessions
    localStorage.setItem('mm_player_id', data.playerId);
    
    return data.playerId;
}

async function loadClues(caseId) {
    if (!gameState.playerId) throw new Error('Player ID required');
    
    // Load clues from backend
    const rows = await api(`/api/case/${caseId}/clues`);
    if (Array.isArray(rows)) {
        rows.forEach(c => {
            const title = c.title || c.slug || 'Clue';
            const content = c.content || '';
            addClue(title, content, 'fas fa-search', false); // false = don't save to localStorage, use backend
        });
    }
    
    // Also load discovered clues from player's game state
    await loadGameStateFromBackend();
}

async function loadStory(caseId, stage) {
    // Load story from backend
    const data = await api(`/api/case/${caseId}/story/${stage}`);
    if (data && data.nodes) {
        renderStory(data);
    } else {
        // Fallback if no story nodes returned
        const defaultStory = {
            stage: stage,
            nodes: [{
                nodeKey: 'intro',
                dialogue: 'You arrive at Blackwood Manor. The crime scene is locked down. Where do you begin your investigation?',
                nextOptions: [
                    { label: 'Interview the Maid', goto: 'maid_interview' },
                    { label: 'Inspect the Study', goto: 'inspect_study' },
                    { label: 'Review Evidence Database', goto: 'evidence_review' }
                ]
            }]
        };
        renderStory(defaultStory);
    }
}

// Load game state from backend
async function loadGameStateFromBackend() {
    if (!gameState.playerId) return;
    
    try {
        const state = await api(`/api/player/${gameState.playerId}/game-state`);
        
        // Update gameState from backend
        gameState.progress = state.progress || 0;
        gameState.currentLevel = state.currentLevel || 1;
        gameState.currentCaseId = state.currentCaseId || 1;
        gameState.storyStage = state.storyStage || 1;
        gameState.flagsByLevel = state.flagsByLevel || {};
        gameState.completedLevels = state.completedLevels || {};
        gameState.discoveredClues = state.discoveredClues || [];
        gameState.queryHistory = state.queryHistory || [];
        gameState.inventory = state.inventory || [];
        gameState.detectiveName = state.detectiveName || gameState.detectiveName;
        
        // Restore discovered clues in UI
        if (gameState.discoveredClues.length > 0) {
            gameState.discoveredClues.forEach(clue => {
                addClue(clue.title, clue.description, clue.icon || 'fas fa-search', false);
            });
        }
        
        // Update progress display
        recomputeProgress();
        
        // Restore level if needed
        if (state.currentLevel) {
            loadLevel(state.currentLevel);
        }
    } catch (e) {
        console.error('Failed to load game state from backend:', e);
        throw new Error('Failed to load game state: ' + e.message);
    }
}

// Save game state to backend
async function saveGameStateToBackend() {
    if (!gameState.playerId) return;
    
    try {
        await api(`/api/player/${gameState.playerId}/game-state`, {
            method: 'POST',
            body: {
                progress: gameState.progress,
                currentLevel: gameState.currentLevel,
                flagsByLevel: gameState.flagsByLevel,
                completedLevels: gameState.completedLevels,
                discoveredClues: gameState.discoveredClues,
                queryHistory: gameState.queryHistory,
                inventory: gameState.inventory
            }
        });
    } catch (e) {
        console.error('Failed to save game state to backend:', e);
        throw new Error('Failed to save game state: ' + e.message);
    }
}

function renderStory(data) {
    if (!storyContent || !storyOptions) return;
    storyContent.innerHTML = '';
    storyOptions.innerHTML = '';
    if (!data || !Array.isArray(data.nodes) || data.nodes.length === 0) {
        return;
    }
    const node = data.nodes[0];
    const p = document.createElement('p');
    p.textContent = node.dialogue || '';
    storyContent.appendChild(p);
    const opts = Array.isArray(node.nextOptions) ? node.nextOptions : [];
    opts.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = opt.label || 'Continue';
        btn.addEventListener('click', () => {
            // For now, just show the selected option and advance stage if available
            showNotification(`Selected: ${btn.textContent}`, 'info');
        });
        storyOptions.appendChild(btn);
    });
}

async function handleLogin(e) {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (!username || !password) {
        showNotification('Please enter username and password', 'error');
        return;
    }
    
    // Show loading state
    const loginBtn = document.getElementById('loginSubmit');
    const originalText = loginBtn.innerHTML;
    loginBtn.disabled = true;
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Connecting...</span>';
    
    try {
        // Create player profile in backend
        const playerId = await createPlayerProfile(username);
        
        gameState.isLoggedIn = true;
        gameState.detectiveName = username;
        gameState.playerId = playerId;
        
        // Save login state to localStorage
        saveLoginState();
        
        // Animate login transition
        loginSection.style.transform = 'translateY(-100vh)';
        loginSection.style.opacity = '0';
        
        setTimeout(async () => {
            // Show main UI
            showGameUI(username);
            
            // Animate game section entrance
            gameSection.style.opacity = '0';
            gameSection.style.transform = 'translateY(50px)';
            
            setTimeout(() => {
                gameSection.style.transition = 'all 0.8s ease-out';
            }, 100);

            try {
                // Load game state from backend
                await loadGameStateFromBackend();
                
                // Load clues and story from backend
                await loadClues(gameState.currentCaseId);
                await loadStory(gameState.currentCaseId, gameState.storyStage);
                
                // Add initial clue if none exist
                if (gameState.discoveredClues.length === 0) {
                    addClue('Initial Investigation', 'Lord Blackwood was found with a mysterious key in his hand', 'fas fa-key');
                }
                
                showNotification('Welcome back, Detective ' + username + '!', 'success');
            } catch (err) {
                showNotification('Error loading game data: ' + err.message, 'error');
                console.error('Error loading game data:', err);
            }
        }, 500);
    } catch (err) {
        loginBtn.disabled = false;
        loginBtn.innerHTML = originalText;
        showNotification('Login failed: ' + err.message, 'error');
        console.error('Login error:', err);
    }
}

async function handleLogout() {
    // Save state to backend before logout
    try {
        if (gameState.playerId) {
            await saveGameStateToBackend();
        }
    } catch (err) {
        console.error('Failed to save game state before logout:', err);
        showNotification('Warning: Game state may not have been saved', 'error');
    }
    
    gameState.isLoggedIn = false;
    gameState.detectiveName = '';
    // Keep playerId for resume, but clear other state
    
    try {
        localStorage.removeItem('mm_logged_in');
        // Keep mm_player_id and mm_detective_name for resume
    } catch {}
    
    // Reset progress bar display
    updateProgress(gameState.progress);
    
    // Animate logout transition
    gameSection.style.transition = 'all 0.5s ease-in';
    gameSection.style.opacity = '0';
    gameSection.style.transform = 'translateY(-50px)';
    
    setTimeout(() => {
        gameSection.classList.add('hidden');
        loginSection.style.display = 'block';
        loginSection.style.transform = 'translateY(0)';
        loginSection.style.opacity = '1';
        
        // Reset form
        loginForm.reset();
    }, 500);
}

async function executeQuery() {
    const query = sqlQuery.value.trim();
    
    if (!query) {
        showNotification('Please enter a SQL query', 'error');
        return;
    }
    
    // Save current query to gameState
    gameState.currentQuery = query;
    
    // Simulate query execution
    const startTime = Date.now();
    executeBtn.disabled = true;
    executeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Executing...</span>';
    
    setTimeout(async () => {
        const endTime = Date.now();
        const executionTimeMs = endTime - startTime;
        
        try {
            const results = simulateSQLExecution(query);
            displayQueryResults(results, executionTimeMs);
            updateProgress(gameState.progress + 5);
            await validateLevelProgress(query, results);
            
            // Add to query history
            gameState.queryHistory.push({
                query: query,
                results: results,
                timestamp: new Date().toISOString(),
                executionTime: executionTimeMs
            });
            
            // Save game state to backend after query execution
            if (gameState.playerId) {
                try {
                    await saveGameStateToBackend();
                } catch (e) {
                    console.error('Failed to save query history:', e);
                }
            }
            
        } catch (error) {
            displayQueryError(error.message);
        }
        
        executeBtn.disabled = false;
        executeBtn.innerHTML = '<i class="fas fa-play"></i> <span>Execute Query</span>';
    }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
}

function simulateSQLExecution(query) {
    const lowerQuery = query.toLowerCase();
    
    // Simple SQL simulation
    if (lowerQuery.includes('select * from witnesses')) {
        // Filter by name or alibi if specified
        const nameMatch = lowerQuery.match(/where\s+name\s*=\s*['\"]([^'\"]+)['\"]/);
        if (nameMatch) {
            const target = nameMatch[1].toLowerCase();
            return mockDatabase.witnesses.filter(w => w.name.toLowerCase() === target);
        }
        return mockDatabase.witnesses;
    } else if (lowerQuery.includes('select * from suspects')) {
        const nameMatch = lowerQuery.match(/where\s+name\s*=\s*['\"]([^'\"]+)['\"]/);
        if (nameMatch) {
            const target = nameMatch[1].toLowerCase();
            return mockDatabase.suspects.filter(s => s.name.toLowerCase() === target);
        }
        return mockDatabase.suspects;
    } else if (lowerQuery.includes('select * from forensics')) {
        if (lowerQuery.includes('where')) {
            const significanceMatch = lowerQuery.match(/significance\s*=\s*['\"]([^'\"]+)['\"]/);
            const matchName = lowerQuery.match(/match\s*=\s*['\"]([^'\"]+)['\"]/);
            let rows = mockDatabase.forensics;
            if (significanceMatch) {
                const val = significanceMatch[1].toLowerCase();
                rows = rows.filter(f => f.significance.toLowerCase() === val);
            }
            if (matchName) {
                const val = matchName[1].toLowerCase();
                rows = rows.filter(f => (f.match || '').toLowerCase() === val);
            }
            return rows;
        }
        return mockDatabase.forensics;
    } else if (lowerQuery.includes('select * from timeline')) {
        return mockDatabase.timeline;
    } else if (lowerQuery.includes('witnesses') && lowerQuery.includes('where') && lowerQuery.includes('alibi_verified')) {
        if (lowerQuery.includes('false')) {
            return mockDatabase.witnesses.filter(w => w.alibi_verified === 'false');
        } else if (lowerQuery.includes('true')) {
            return mockDatabase.witnesses.filter(w => w.alibi_verified === 'true');
        }
    } else if (lowerQuery.includes('suspects') && lowerQuery.includes('where') && lowerQuery.includes('suspicion_level')) {
        if (lowerQuery.includes('>')) {
            const threshold = parseInt(lowerQuery.match(/>\s*(\d+)/)?.[1] || '50');
            return mockDatabase.suspects.filter(s => s.suspicion_level > threshold);
        }
    } else if (lowerQuery.includes('forensics') && lowerQuery.includes('where') && lowerQuery.includes('significance')) {
        if (lowerQuery.includes('critical')) {
            return mockDatabase.forensics.filter(f => f.significance === 'Critical');
        } else if (lowerQuery.includes('high')) {
            return mockDatabase.forensics.filter(f => f.significance === 'High');
        }
    } else if (lowerQuery.includes('order by') && lowerQuery.includes('suspicion_level')) {
        return [...mockDatabase.suspects].sort((a, b) => b.suspicion_level - a.suspicion_level);
    } else if (lowerQuery.includes('count(*)')) {
        if (lowerQuery.includes('witnesses')) {
            return [{ count: mockDatabase.witnesses.length }];
        } else if (lowerQuery.includes('suspects')) {
            return [{ count: mockDatabase.suspects.length }];
        }
    }
    
    // Default: return empty result for unrecognized queries
    return [];
}

async function loadLevel(level) {
    gameState.currentLevel = level;
    // Restore flags/completion if previously achieved
    const saved = gameState.flagsByLevel[level] || {};
    gameState.levelFlags = { ...(saved.flags || {}) };
    gameState.levelCompleted = !!saved.completed;
    
    // Save current level to backend
    if (gameState.playerId) {
        try {
            await saveGameStateToBackend();
        } catch (e) {
            console.error('Failed to save level change:', e);
        }
    }
    
    if (currentLevelEl) currentLevelEl.textContent = String(level);
    if (levelStatusEl) levelStatusEl.textContent = gameState.levelCompleted ? 'Completed' : 'In progress';
    const L = LEVELS[level - 1];
    if (objectiveText) objectiveText.textContent = L.objective;
    if (suggestedQueriesEl) {
        suggestedQueriesEl.innerHTML = '';
        L.hints.forEach(h => {
            const li = document.createElement('li');
            li.textContent = h;
            suggestedQueriesEl.appendChild(li);
        });
    }
    if (nextStageBtn) {
        // Allow advancing if already completed previously
        nextStageBtn.disabled = !gameState.levelCompleted || level === gameState.totalLevels;
    }
    if (prevStageBtn) {
        prevStageBtn.disabled = level === 1;
    }
    if (suggestedQueriesEl && !suggestedQueriesEl.classList.contains('collapsed')) {
        // keep hints hidden by default on each level load
        suggestedQueriesEl.classList.add('collapsed');
    }
    renderSummary();
    // Close any lingering modals on level switch
    if (congratsModal) congratsModal.classList.remove('active');
    if (hintModal) hintModal.classList.remove('active');
    if (evidenceModal) evidenceModal.classList.remove('active');
    // Recompute progress when navigating
    recomputeProgress();
}

async function validateLevelProgress(query, results) {
    const q = query.toLowerCase();
    const rules = LEVELS[gameState.currentLevel - 1].validators;
    Object.keys(rules).forEach(key => {
        if (!gameState.levelFlags[key] && rules[key](q, results)) {
            gameState.levelFlags[key] = true;
        }
    });
    // Check completion
    const allMet = Object.keys(rules).every(k => !!gameState.levelFlags[k]);
    if (allMet && !gameState.levelCompleted) {
        gameState.levelCompleted = true;
        // Persist completion and flags for this level
        gameState.flagsByLevel[gameState.currentLevel] = {
            flags: { ...gameState.levelFlags },
            completed: true
        };
        gameState.completedLevels[gameState.currentLevel] = true;
        
        // Save to backend
        try {
            await saveGameStateToBackend();
        } catch (e) {
            console.error('Failed to save level progress:', e);
        }
        
        if (levelStatusEl) levelStatusEl.textContent = 'Completed';
        if (nextStageBtn) nextStageBtn.disabled = gameState.currentLevel === gameState.totalLevels ? true : false;
        if (congratsModal) {
            const levelNum = gameState.currentLevel;
            congratsText.textContent = levelNum < gameState.totalLevels
                ? `Congratulations! You completed Level ${levelNum}. Click Next to proceed.`
                : `Brilliant! You have solved the case and identified the culprit.`;
            congratsModal.classList.add('active');
        }
    }
    renderSummary();
    recomputeProgress();
    
    // Save progress after validation
    try {
        await saveGameStateToBackend();
    } catch (e) {
        console.error('Failed to save progress:', e);
    }
}

function advanceLevel() {
    // Allow advancing only if this level is completed (persisted)
    const completed = !!(gameState.completedLevels[gameState.currentLevel] || gameState.levelCompleted);
    if (!completed) return;
    if (gameState.currentLevel < gameState.totalLevels) {
        congratsModal.classList.remove('active');
        loadLevel(gameState.currentLevel + 1);
        showNotification(`Advanced to Level ${gameState.currentLevel}`, 'success');
    } else {
        showNotification('Case closed! The main culprit is caught.', 'success');
        recomputeProgress(true);
    }
}

function retreatLevel() {
    if (gameState.currentLevel > 1) {
        loadLevel(gameState.currentLevel - 1);
        showNotification(`Returned to Level ${gameState.currentLevel}`, 'info');
    }
}

function renderSummary() {
    const L = LEVELS[gameState.currentLevel - 1];
    if (stageDescription) stageDescription.textContent = L.stageDescription;
    if (!summaryBody) return;
    const rows = L.summary ? L.summary(gameState.levelFlags) : [];
    summaryBody.innerHTML = '';
    rows.forEach(([k, v]) => {
        const tr = document.createElement('tr');
        const td1 = document.createElement('td');
        const td2 = document.createElement('td');
        td1.textContent = k;
        td2.textContent = v;
        tr.appendChild(td1);
        tr.appendChild(td2);
        summaryBody.appendChild(tr);
    });
}

function displayQueryResults(results, executionTime) {
    resultCount.textContent = `${results.length} rows returned`;
    executionTime.textContent = `${executionTime}ms`;
    
    if (results.length === 0) {
        resultsContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-database"></i>
                <p>No results found</p>
            </div>
        `;
        return;
    }
    
    // Create table
    const table = document.createElement('table');
    table.className = 'results-table';
    
    // Create header
    const headerRow = document.createElement('tr');
    const headers = Object.keys(results[0]);
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header.replace(/_/g, ' ').toUpperCase();
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);
    
    // Create rows
    results.forEach(row => {
        const tr = document.createElement('tr');
        headers.forEach(header => {
            const td = document.createElement('td');
            td.textContent = row[header];
            tr.appendChild(td);
        });
        table.appendChild(tr);
    });
    
    resultsContainer.innerHTML = '';
    resultsContainer.appendChild(table);
    
    // Add CSS for table
    if (!document.getElementById('table-styles')) {
        const style = document.createElement('style');
        style.id = 'table-styles';
        style.textContent = `
            .results-table {
                width: 100%;
                border-collapse: collapse;
                font-family: 'Courier New', monospace;
                font-size: 0.9rem;
            }
            .results-table th,
            .results-table td {
                padding: 0.8rem;
                text-align: left;
                border-bottom: 1px solid rgba(220, 20, 60, 0.3);
            }
            .results-table th {
                background: rgba(26, 26, 26, 0.8);
                color: #dc143c;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .results-table td {
                color: #e0e0e0;
            }
            .results-table tr:hover {
                background: rgba(220, 20, 60, 0.1);
            }
        `;
        document.head.appendChild(style);
    }
    
    // Check for new clues based on results
    checkForNewClues(results);
}

function displayQueryError(errorMessage) {
    resultsContainer.innerHTML = `
        <div class="query-error">
            <i class="fas fa-exclamation-triangle"></i>
            <h4>Query Error</h4>
            <p>${errorMessage}</p>
        </div>
    `;
    
    // Add CSS for error display
    if (!document.getElementById('error-styles')) {
        const style = document.createElement('style');
        style.id = 'error-styles';
        style.textContent = `
            .query-error {
                text-align: center;
                padding: 2rem;
                color: #ff6b6b;
            }
            .query-error i {
                font-size: 2rem;
                margin-bottom: 1rem;
            }
            .query-error h4 {
                margin-bottom: 1rem;
                color: #ff6b6b;
            }
        `;
        document.head.appendChild(style);
    }
}

function checkForNewClues(results) {
    // Check if results reveal new clues
    if (results.some(r => r.suspicion_level > 80)) {
        addClue('High Suspicion Alert', 'A suspect with very high suspicion level has been identified', 'fas fa-exclamation-triangle');
    }
    
    if (results.some(r => r.significance === 'Critical')) {
        addClue('Critical Evidence', 'Critical forensic evidence has been discovered', 'fas fa-microscope');
    }
    
    if (results.some(r => r.alibi_verified === 'false')) {
        addClue('Unverified Alibis', 'Multiple witnesses have unverified alibis', 'fas fa-question-circle');
    }
}

async function addClue(title, description, icon, saveToBackend = true) {
    // Check if clue already exists
    if (gameState.discoveredClues.some(clue => clue.title === title)) {
        return;
    }
    
    const clue = { title, description, icon, timestamp: new Date().toISOString() };
    gameState.discoveredClues.push(clue);
    
    // Save clue to backend
    if (saveToBackend && gameState.playerId) {
        try {
            await api(`/api/player/${gameState.playerId}/clues`, {
                method: 'POST',
                body: { title, description, icon }
            });
        } catch (e) {
            console.error('Failed to save clue to backend:', e);
            // Still show the clue in UI even if backend save fails
        }
    }
    
    const clueElement = document.createElement('div');
    clueElement.className = 'clue-item';
    clueElement.innerHTML = `
        <div class="clue-icon">
            <i class="${icon}"></i>
        </div>
        <div class="clue-content">
            <h4>${title}</h4>
            <p>${description}</p>
        </div>
    `;
    
    cluesContainer.appendChild(clueElement);
    
    // Animate new clue
    clueElement.style.opacity = '0';
    clueElement.style.transform = 'translateX(-50px)';
    
    setTimeout(() => {
        clueElement.style.transition = 'all 0.5s ease-out';
        clueElement.style.opacity = '1';
        clueElement.style.transform = 'translateX(0)';
    }, 100);
}

function populateSuspectsGrid() {
    suspectsGrid.innerHTML = '';
    
    mockDatabase.suspects.forEach(suspect => {
        const suspectCard = document.createElement('div');
        suspectCard.className = 'suspect-card';
        suspectCard.innerHTML = `
            <div class="suspect-header">
                <h3>${suspect.name}</h3>
                <div class="suspicion-level">
                    <span class="suspicion-score">${suspect.suspicion_level}%</span>
                    <div class="suspicion-bar">
                        <div class="suspicion-fill" style="width: ${suspect.suspicion_level}%"></div>
                    </div>
                </div>
            </div>
            <div class="suspect-details">
                <p><strong>Motive:</strong> ${suspect.motive}</p>
                <p><strong>Alibi:</strong> ${suspect.alibi}</p>
                <p><strong>Behavior:</strong> ${suspect.suspicious_behavior}</p>
            </div>
        `;
        
        suspectsGrid.appendChild(suspectCard);
    });
    
    // Add CSS for suspect cards
    if (!document.getElementById('suspect-styles')) {
        const style = document.createElement('style');
        style.id = 'suspect-styles';
        style.textContent = `
            .suspect-card {
                background: rgba(26, 26, 26, 0.8);
                border: 1px solid rgba(220, 20, 60, 0.2);
                border-radius: 15px;
                padding: 1.5rem;
                transition: all 0.3s ease;
                backdrop-filter: blur(10px);
            }
            .suspect-card:hover {
                transform: translateY(-5px);
                border-color: rgba(220, 20, 60, 0.4);
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            }
            .suspect-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1rem;
            }
            .suspect-header h3 {
                color: #e0e0e0;
                font-family: 'Cinzel', serif;
                margin: 0;
            }
            .suspicion-level {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            .suspicion-score {
                color: #dc143c;
                font-weight: 600;
                font-size: 0.9rem;
            }
            .suspicion-bar {
                width: 60px;
                height: 4px;
                background: #333;
                border-radius: 2px;
                overflow: hidden;
            }
            .suspicion-fill {
                height: 100%;
                background: linear-gradient(90deg, #8b0000, #dc143c);
                transition: width 0.5s ease;
            }
            .suspect-details p {
                color: #b0b0b0;
                margin-bottom: 0.5rem;
                font-size: 0.9rem;
            }
            .suspect-details strong {
                color: #dc143c;
            }
        `;
        document.head.appendChild(style);
    }
}

function showEvidenceModal(e) {
    const evidenceType = e.target.getAttribute('data-target');
    const evidenceData = mockDatabase[evidenceType];
    
    modalTitle.textContent = evidenceType.charAt(0).toUpperCase() + evidenceType.slice(1);
    
    let content = '';
    if (evidenceData) {
        content = '<div class="evidence-list">';
        evidenceData.forEach(item => {
            content += `
                <div class="evidence-item">
                    <h4>${item.name || item.evidence_type || item.time}</h4>
                    <p>${item.statement || item.motive || item.event || item.description}</p>
                    ${item.relationship ? `<small>Relationship: ${item.relationship}</small>` : ''}
                    ${item.alibi_verified ? `<small>Alibi: ${item.alibi_verified}</small>` : ''}
                    ${item.suspicion_level ? `<small>Suspicion: ${item.suspicion_level}%</small>` : ''}
                    ${item.significance ? `<small>Significance: ${item.significance}</small>` : ''}
                    ${item.witness ? `<small>Witness: ${item.witness}</small>` : ''}
                </div>
            `;
        });
        content += '</div>';
    }
    
    modalBody.innerHTML = content;
    evidenceModal.classList.add('active');
    
    // Add CSS for evidence modal
    if (!document.getElementById('evidence-modal-styles')) {
        const style = document.createElement('style');
        style.id = 'evidence-modal-styles';
        style.textContent = `
            .evidence-list {
                display: grid;
                gap: 1rem;
            }
            .evidence-item {
                background: rgba(45, 45, 45, 0.8);
                border: 1px solid rgba(220, 20, 60, 0.2);
                border-radius: 10px;
                padding: 1rem;
            }
            .evidence-item h4 {
                color: #dc143c;
                margin-bottom: 0.5rem;
                font-family: 'Cinzel', serif;
            }
            .evidence-item p {
                color: #e0e0e0;
                margin-bottom: 0.5rem;
            }
            .evidence-item small {
                color: #b0b0b0;
                display: block;
                margin-bottom: 0.25rem;
            }
        `;
        document.head.appendChild(style);
    }
}

function closeModal() {
    evidenceModal.classList.remove('active');
}

function closeHintModal() {
    hintModal.classList.remove('active');
}

function handleToolAction(e) {
    const action = e.target.closest('.tool-btn').getAttribute('data-action');
    
    switch (action) {
        case 'format':
            formatSQLQuery();
            break;
        case 'clear':
            sqlQuery.value = '';
            sqlQuery.focus();
            break;
        case 'hint':
            showHint();
            break;
    }
}

function formatSQLQuery() {
    const query = sqlQuery.value.trim();
    if (query) {
        // Simple SQL formatting
        const formatted = query
            .replace(/\bselect\b/gi, 'SELECT')
            .replace(/\bfrom\b/gi, 'FROM')
            .replace(/\bwhere\b/gi, 'WHERE')
            .replace(/\border by\b/gi, 'ORDER BY')
            .replace(/\bgroup by\b/gi, 'GROUP BY')
            .replace(/\bhaving\b/gi, 'HAVING')
            .replace(/\bcount\b/gi, 'COUNT')
            .replace(/\bmax\b/gi, 'MAX')
            .replace(/\bmin\b/gi, 'MIN')
            .replace(/\bsum\b/gi, 'SUM')
            .replace(/\bavg\b/gi, 'AVG');
        
        sqlQuery.value = formatted;
        showNotification('Query formatted', 'success');
    }
}

function showHint() {
    const lvl = LEVELS[gameState.currentLevel - 1];
    const randomHint = lvl.hints[Math.floor(Math.random() * lvl.hints.length)];
    hintText.textContent = randomHint;
    hintModal.classList.add('active');
}

function updateProgress(newProgress) {
    // Kept for backward compatibility but delegate to recompute
    gameState.progress = Math.min(newProgress, 100);
    progressPercentage.textContent = `${gameState.progress}%`;
    progressFill.style.width = `${gameState.progress}%`;
    
    if (gameState.progress >= 100) {
        showNotification('Case solved! You have successfully identified the culprit!', 'success');
    }
}

function recomputeProgress(forceComplete = false) {
    // Progress is based on number of uniquely completed levels
    const completedCount = Object.values(gameState.completedLevels).filter(Boolean).length;
    const pct = forceComplete ? 100 : Math.floor((completedCount / gameState.totalLevels) * 100);
    gameState.progress = pct;
    progressPercentage.textContent = `${pct}%`;
    progressFill.style.width = `${pct}%`;
    
    // Save progress to backend (async, don't wait)
    if (gameState.playerId) {
        saveGameStateToBackend().catch(e => {
            console.error('Failed to save progress:', e);
        });
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add CSS for notifications
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(26, 26, 26, 0.95);
                border: 1px solid rgba(220, 20, 60, 0.3);
                border-radius: 10px;
                padding: 1rem 1.5rem;
                color: #e0e0e0;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                z-index: 10001;
                transform: translateX(400px);
                transition: transform 0.3s ease;
                backdrop-filter: blur(10px);
            }
            .notification.show {
                transform: translateX(0);
            }
            .notification-success {
                border-color: rgba(34, 197, 94, 0.5);
                background: rgba(34, 197, 94, 0.1);
            }
            .notification-error {
                border-color: rgba(239, 68, 68, 0.5);
                background: rgba(239, 68, 68, 0.1);
            }
            .notification i {
                color: #dc143c;
            }
            .notification-success i {
                color: #22c55e;
            }
            .notification-error i {
                color: #ef4444;
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function handleKeyboardShortcuts(e) {
    // Ctrl+Enter to execute query
    if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        executeQuery();
    }
    
    // Escape to close modals
    if (e.key === 'Escape') {
        closeModal();
        closeHintModal();
    }
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add some interactive effects
document.addEventListener('mousemove', function(e) {
    const cursor = document.querySelector('.cursor');
    if (!cursor) {
        const newCursor = document.createElement('div');
        newCursor.className = 'cursor';
        newCursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: radial-gradient(circle, rgba(220, 20, 60, 0.8) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.1s ease;
        `;
        document.body.appendChild(newCursor);
    }
    
    const cursorElement = document.querySelector('.cursor');
    cursorElement.style.left = e.clientX - 10 + 'px';
    cursorElement.style.top = e.clientY - 10 + 'px';
});

// Add parallax effect to background (disabled after login to avoid overriding transform)
window.addEventListener('scroll', function() {
    if (typeof gameState !== 'undefined' && gameState.isLoggedIn) return;
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.login-section');
    if (parallax) {
        const speed = scrolled * 0.5;
        parallax.style.transform = `translateY(${speed}px)`;
    }
});

// Initialize game when page loads
console.log('🔍 Murder Mystery Detective Game Initialized');
console.log('💡 Try these sample queries:');
console.log('   SELECT * FROM witnesses WHERE alibi_verified = "false"');
console.log('   SELECT * FROM suspects ORDER BY suspicion_level DESC');
console.log('   SELECT * FROM forensics WHERE significance = "Critical"');

// Global error handlers to avoid unexpected reloads and aid debugging
window.addEventListener('error', (e) => {
    try { showNotification('Script error occurred. Check console for details.', 'error'); } catch {}
});
window.addEventListener('unhandledrejection', (e) => {
    e.preventDefault();
    try { showNotification('Unexpected error occurred. Check console for details.', 'error'); } catch {}
});
