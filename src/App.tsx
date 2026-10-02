import React, { useState } from 'react';
import { PdsProvider, usePds } from './context/PdsContext';
import { Header } from './components/common/Header';
import { VoiceModal } from './components/common/VoiceModal';
import { BlastModal } from './components/common/BlastModal';
import { LanguagePickerModal } from './components/common/LanguagePickerModal';
import { FallbackChannelModal } from './components/citizen/FallbackChannelModal';
import { MapsGroundingModal } from './components/common/MapsGroundingModal';
import { VoiceAssistantGuidance } from './components/common/VoiceAssistantGuidance';
import { LoginPage } from './components/auth/LoginPage';
import { CitizenView } from './components/citizen/CitizenView';
import { FpsDealerView } from './components/dealer/FpsDealerView';
import { OfficerSuite } from './components/officer/OfficerSuite';

const MainLayout: React.FC = () => {
  const { currentRole, mapsModal, closeMapsModal, setCurrentRole } = usePds();

  // If no role is selected, show the Login Page first
  const isOnLoginPage = !currentRole;
  const [activeNavTab, setActiveNavTab] = useState<string>('home');

  return (
    <div className="min-h-screen bg-[#FAF6F8] text-slate-800 flex flex-col font-serif selection:bg-[#6B1870] selection:text-white">
      {/* 1. If not authenticated, show the Dedicated 3-Option Login Page */}
      {isOnLoginPage ? (
        <LoginPage onEnterAsGuest={() => setCurrentRole('citizen')} />
      ) : (
        <>
          {/* 2. Official PDS Demand Sync Header */}
          <Header
            onGoToLogin={() => setCurrentRole(null)}
            activeNavTab={activeNavTab}
            onSelectNavTab={(tab) => setActiveNavTab(tab)}
          />

          {/* 3. Strict Role-Segregated Views (Only role-specific features and zero extraneous filler) */}
          <main className="flex-1">
            {currentRole === 'citizen' && <CitizenView />}
            {currentRole === 'dealer' && <FpsDealerView />}
            {currentRole === 'officer' && <OfficerSuite />}
          </main>
        </>
      )}

      {/* Global Accessibility Modals */}
      <VoiceModal />
      <BlastModal />
      <LanguagePickerModal />
      <FallbackChannelModal />
      <MapsGroundingModal
        isOpen={mapsModal.isOpen}
        onClose={closeMapsModal}
        defaultQuery={mapsModal.query}
        defaultLocation={mapsModal.location}
        placeTitle={mapsModal.title}
      />
      <VoiceAssistantGuidance />
    </div>
  );
};

export default function App() {
  return (
    <PdsProvider>
      <MainLayout />
    </PdsProvider>
  );
}
