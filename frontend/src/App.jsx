import React, { useState } from 'react';
import { PlayerProvider, usePlayer } from './context/PlayerContext';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import BriefingModal from './components/BriefingModal';
import CaseSolvedModal from './components/CaseSolvedModal';

import HomeView from './views/HomeView';
import CasesDossierView from './views/CasesDossierView';
import InvestigationWorkbenchView from './views/InvestigationWorkbenchView';
import LoreIntelView from './views/LoreIntelView';
import TaskForceView from './views/TaskForceView';
import LeaderboardView from './views/LeaderboardView';
import ProgressView from './views/ProgressView';
import CredentialsView from './views/CredentialsView';
import GuideView from './views/GuideView';

function AppContent() {
  const { db, toast } = usePlayer();
  const [currentView, setCurrentView] = useState('home');
  const [activeCaseId, setActiveCaseId] = useState(0);

  // Modals state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [briefingCaseId, setBriefingCaseId] = useState(null);
  const [solvedData, setSolvedData] = useState(null);

  const handleNavigate = (viewId) => {
    setCurrentView(viewId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenBriefing = (caseId) => {
    setBriefingCaseId(caseId);
  };

  const handleStartInvestigation = (caseId) => {
    setActiveCaseId(caseId);
    handleNavigate('investigation');
  };

  const handleShowCaseSolved = (caseId, culprit) => {
    setSolvedData({ caseId, culprit });
  };

  const briefingCaseData = db?.game_cases?.find((c) => c.id === briefingCaseId);

  return (
    <div className="min-h-screen bg-[#070709] text-[#e0e0e0] font-sans antialiased flex flex-col selection:bg-[#d4af37]/30 selection:text-[#d4af37]">
      {/* Toast Notification Banner */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#141419] border border-[#d4af37]/50 text-[#e0e0e0] px-4 py-3 rounded-lg shadow-2xl font-semibold text-xs animate-in slide-in-from-bottom-5 duration-200">
          {toast.message}
        </div>
      )}

      {/* Main Header Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1 pt-16">
        {currentView === 'home' && (
          <HomeView
            onNavigate={handleNavigate}
            onOpenBriefing={handleOpenBriefing}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        )}

        {currentView === 'cases' && (
          <CasesDossierView
            onStartInvestigation={handleStartInvestigation}
            onOpenBriefing={handleOpenBriefing}
          />
        )}

        {currentView === 'investigation' && (
          <InvestigationWorkbenchView
            selectedCaseId={activeCaseId}
            onSelectCase={setActiveCaseId}
            onShowCaseSolved={handleShowCaseSolved}
          />
        )}

        {currentView === 'story' && <LoreIntelView />}
        {currentView === 'team' && <TaskForceView />}
        {currentView === 'leaderboard' && <LeaderboardView />}
        {currentView === 'progress' && <ProgressView />}
        {currentView === 'credentials' && <CredentialsView />}
        {currentView === 'guide' && <GuideView />}
      </main>

      {/* Shared Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      <BriefingModal
        caseData={briefingCaseData}
        isOpen={briefingCaseId !== null}
        onClose={() => setBriefingCaseId(null)}
        onStartInvestigation={handleStartInvestigation}
      />

      <CaseSolvedModal
        isOpen={solvedData !== null}
        onClose={() => setSolvedData(null)}
        caseId={solvedData?.caseId || 1}
        culprit={solvedData?.culprit || 'Suspect'}
        onNextCase={handleStartInvestigation}
      />
    </div>
  );
}

export default function App() {
  return (
    <PlayerProvider>
      <AppContent />
    </PlayerProvider>
  );
}
