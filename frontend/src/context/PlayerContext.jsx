import React, { createContext, useContext, useState, useEffect } from 'react';
import canonicalDb from '../data/canonicalData.js';
import { getApiUrl } from '../api/config.js';

const PlayerContext = createContext();

const DEFAULT_PLAYER = {
  name: 'Guest Detective',
  email: '',
  xp: 0,
  totalStars: 0,
  rank: 'Investigation Intern',
  completedCases: [],
  unlockedCases: [0, 1],
  caseProgress: {}
};

export const PlayerProvider = ({ children }) => {
  const [player, setPlayer] = useState(DEFAULT_PLAYER);
  const [activeCaseId, setActiveCaseId] = useState(0);
  const [db, setDb] = useState(canonicalDb);
  const [toast, setToast] = useState(null);

  // Show Toast notification
  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Helper to fetch stored local user accounts
  const getUserAccounts = () => {
    try {
      const raw = localStorage.getItem('vritra_user_accounts');
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  };

  // Load player state on mount
  useEffect(() => {
    const loadInitialState = async () => {
      try {
        const sessionEmail = localStorage.getItem('vritra_current_session_email');
        const accounts = getUserAccounts();

        // Purge legacy Prasoon default session from browser storage if present
        if (sessionEmail && sessionEmail.toLowerCase().includes('prasoon')) {
          localStorage.removeItem('vritra_current_session_email');
        }

        const saved = localStorage.getItem('vritra_player_state');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && (parsed.name === 'Prasoon Pathak' || parsed.email?.toLowerCase().includes('prasoon'))) {
            localStorage.removeItem('vritra_player_state');
            localStorage.removeItem('vritra_current_session_email');
            setPlayer(DEFAULT_PLAYER);
            return;
          }
          if (parsed && parsed.email && parsed.name && parsed.name !== 'Guest Detective') {
            setPlayer(parsed);
            return;
          }
        }

        if (sessionEmail && accounts[sessionEmail.toLowerCase()] && !sessionEmail.toLowerCase().includes('prasoon')) {
          setPlayer(accounts[sessionEmail.toLowerCase()]);
          return;
        }

        setPlayer(DEFAULT_PLAYER);
      } catch (err) {
        console.error('Failed to load initial state:', err);
        setPlayer(DEFAULT_PLAYER);
      }
    };

    loadInitialState();
  }, []);

  // Save Player state to LocalStorage & Supabase API
  const savePlayerState = async (newPlayerState) => {
    const updated = newPlayerState || player;
    setPlayer(updated);

    try {
      if (updated.email) {
        const emailKey = updated.email.toLowerCase();
        localStorage.setItem('vritra_current_session_email', emailKey);
        const accounts = getUserAccounts();
        accounts[emailKey] = updated;
        localStorage.setItem('vritra_user_accounts', JSON.stringify(accounts));

        // Background sync to Supabase Express API
        try {
          fetch(getApiUrl('/api/profile/sync'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ player: updated })
          }).catch(err => console.log('Supabase sync notice:', err.message));
        } catch (apiErr) {
          console.log('Supabase sync background notice:', apiErr.message);
        }
      }
      localStorage.setItem('vritra_player_state', JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to save player state:', err);
    }
  };

  // Helper to strictly check if a case is unlocked
  const isCaseUnlocked = (caseId) => {
    const id = parseInt(caseId, 10);
    if (id === 0 || id === 1) return true;
    if (player.completedCases.includes(id)) return true;
    if (player.unlockedCases.includes(id)) return true;
    if (player.completedCases.includes(id - 1)) return true;
    return false;
  };

  // Login / Switch Credentials
  const loginUser = async (name, email) => {
    const emailKey = email.toLowerCase();
    const accounts = getUserAccounts();

    let loadedPlayer = null;

    // Try fetching from Supabase DB first
    try {
      const res = await fetch(getApiUrl(`/api/profile/sync?email=${encodeURIComponent(emailKey)}`));
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          loadedPlayer = { ...DEFAULT_PLAYER, ...json.data, name, email };
          showToast(`⚡ Restored cloud progress from Supabase for Agent ${name}!`, 'success');
        }
      }
    } catch (err) {
      console.log('Supabase fetch fallback to local storage');
    }

    if (!loadedPlayer) {
      if (accounts[emailKey]) {
        loadedPlayer = { ...accounts[emailKey], name, email };
        showToast(`🔑 Welcome back, Agent ${name}! Progress restored.`, 'success');
      } else {
        loadedPlayer = {
          name,
          email,
          xp: 0,
          totalStars: 0,
          rank: 'Investigation Intern',
          completedCases: [],
          unlockedCases: [0, 1],
          caseProgress: {}
        };
        showToast(`✅ Welcome to the Task Force, Agent ${name}! Designated as Investigation Intern.`, 'success');
      }
    }

    await savePlayerState(loadedPlayer);
  };

  // Logout User
  const logoutUser = () => {
    localStorage.removeItem('vritra_current_session_email');
    localStorage.removeItem('vritra_player_state');
    setPlayer(DEFAULT_PLAYER);
    showToast('🚪 Logged out successfully. Reverted session to Guest Detective.', 'info');
  };

  // Complete a case
  const completeCase = (caseId, score = 500, stars = 3) => {
    const id = parseInt(caseId, 10);
    const completed = player.completedCases.includes(id) 
      ? player.completedCases 
      : [...player.completedCases, id];
      
    const nextCaseId = id + 1;
    const unlocked = (nextCaseId <= 18 && !player.unlockedCases.includes(nextCaseId))
      ? [...player.unlockedCases, nextCaseId]
      : player.unlockedCases;

    const newXp = player.completedCases.includes(id) ? player.xp : player.xp + score;
    const newStars = player.completedCases.includes(id) ? player.totalStars : player.totalStars + stars;

    // Check rank promotion
    let newRank = player.rank;
    if (db && db.rank_progression) {
      const ranks = [...db.rank_progression].reverse();
      for (const r of ranks) {
        if (completed.length >= r.minCases && newXp >= r.minXP) {
          if (newRank !== r.rank) {
            newRank = r.rank;
            showToast(`🎖️ Promotion! You have attained the rank of ${r.rank}`, 'success');
          }
          break;
        }
      }
    }

    const updated = {
      ...player,
      xp: newXp,
      totalStars: newStars,
      rank: newRank,
      completedCases: completed,
      unlockedCases: unlocked,
      caseProgress: {
        ...player.caseProgress,
        [id]: { score, stars, completedAt: new Date().toISOString() }
      }
    };

    savePlayerState(updated);
  };

  // Deduct XP to unlock clue or query template
  const unlockClueOrTemplate = (key, xpCost = 25) => {
    const unlocked = player.unlockedClues || [];
    if (unlocked.includes(key)) {
      return true; // Already unlocked
    }

    if (player.xp < xpCost) {
      showToast(`❌ Insufficient XP! Unlocking requires ${xpCost} XP (Current: ${player.xp} XP). Complete cases to earn XP!`, 'error');
      return false;
    }

    const newXp = player.xp - xpCost;
    const updated = {
      ...player,
      xp: newXp,
      unlockedClues: [...unlocked, key]
    };

    savePlayerState(updated);
    showToast(`🔓 Unlocked intelligence file! Deducted ${xpCost} XP. (Remaining: ${newXp} XP)`, 'success');
    return true;
  };

  const isClueUnlocked = (key) => {
    return Boolean(player.unlockedClues?.includes(key));
  };

  // Award XP to player for successful query execution or milestone
  const awardXP = (amount = 25, reason = 'SQL Evidence Query Executed') => {
    const newXp = (player.xp || 0) + amount;
    
    // Check rank promotion
    let newRank = player.rank || 'Investigation Intern';
    if (db && db.rank_progression) {
      const ranks = [...db.rank_progression].reverse();
      for (const r of ranks) {
        if ((player.completedCases || []).length >= r.minCases && newXp >= r.minXP) {
          if (newRank !== r.rank) {
            newRank = r.rank;
            showToast(`🎖️ Promotion! You have attained the rank of ${r.rank}`, 'success');
          }
          break;
        }
      }
    }

    const updated = {
      ...player,
      xp: newXp,
      rank: newRank,
    };

    savePlayerState(updated);
    showToast(`⚡ +${amount} XP Earned! (${reason})`, 'success');
  };

  return (
    <PlayerContext.Provider value={{
      player,
      activeCaseId,
      setActiveCaseId,
      db,
      toast,
      showToast,
      isCaseUnlocked,
      loginUser,
      logoutUser,
      savePlayerState,
      completeCase,
      unlockClueOrTemplate,
      isClueUnlocked,
      awardXP
    }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);
