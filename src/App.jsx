import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MobileAppShell } from './components/MobileAppShell.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { EligibilityWizardPage } from './pages/EligibilityWizardPage.jsx';
import { ProcessingPage } from './pages/ProcessingPage.jsx';
import { ResultsPage } from './pages/ResultsPage.jsx';
import { RoadmapPage } from './pages/RoadmapPage.jsx';
import { SchemesPage } from './pages/SchemesPage.jsx';
import { ApplicationsPage } from './pages/ApplicationsPage.jsx';
import { DocumentsPage } from './pages/DocumentsPage.jsx';
import { ProfilePage } from './pages/ProfilePage.jsx';
import { LanguagePage } from './pages/LanguagePage.jsx';
import { DraftsPage } from './pages/DraftsPage.jsx';
import { VLEControlPage } from './pages/VLEControlPage.jsx';
import { HelpPage } from './pages/HelpPage.jsx';
import { ChatPage } from './pages/ChatPage.jsx';
// SignUpPage intentionally removed — auth is pre-mocked (field agent already authenticated)

export function App() {
  return (
    <Routes>
      <Route element={<MobileAppShell />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/eligibility" element={<EligibilityWizardPage />} />
        <Route path="/processing" element={<ProcessingPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/roadmap" element={<RoadmapPage />} />
        <Route path="/schemes" element={<SchemesPage />} />
        {/* /signup is bypassed — field agent is already authenticated for demo */}
        <Route path="/signup" element={<Navigate to="/home" replace />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/applications" element={<ApplicationsPage />} />
        <Route path="/documents" element={<DocumentsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/language" element={<LanguagePage />} />
        <Route path="/drafts" element={<DraftsPage />} />
        <Route path="/vle" element={<VLEControlPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
