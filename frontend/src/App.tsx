import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { CreateMissionPage } from './pages/CreateMissionPage';
import { MissionPreviewPage } from './pages/MissionPreviewPage';
import { ActiveMissionPage } from './pages/ActiveMissionPage';
import { MissionCompletePage } from './pages/MissionCompletePage';
import { MissionHistoryPage } from './pages/MissionHistoryPage';
import { AboutPage } from './pages/AboutPage';

const AppLayout: React.FC = () => {
  const location = useLocation();
  const isActiveMission = location.pathname === '/active';

  return (
    <div className="flex flex-col min-h-screen bg-canvas text-stone-800">
      {/* Navbar rendered on all pages */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreateMissionPage />} />
          <Route path="/preview" element={<MissionPreviewPage />} />
          <Route path="/active" element={<ActiveMissionPage />} />
          <Route path="/complete" element={<MissionCompletePage />} />
          <Route path="/history" element={<MissionHistoryPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer hidden on active countdown screen to eliminate screen distractions */}
      {!isActiveMission && <Footer />}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
};

export default App;
