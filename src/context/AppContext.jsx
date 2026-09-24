import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_FARMER } from '../data/farmers.js';
import { SCHEMES } from '../data/schemes.js';
import { deduplicateDocuments } from '../logic/deduplication.js';
import { runOptimizationEngine } from '../logic/optimizer.js';

// ─── MOCK AUTHENTICATED FIELD AGENT SESSION ───────────────────────────────────
// For demo purposes the portal assumes the field agent is already authenticated.
// This bypasses the SignUpPage / OTP flow entirely.
const MOCK_AUTH = {
  isAuthenticated: true,
  agentId: 'VLE-MP-SEH-001',
  agentName: 'Field Agent Portal'
};

const AppContext = createContext();

const STORAGE_KEYS = {
  PROFILE: 'optimaldbt_farmer_profile',
  DRAFT: 'optimaldbt_wizard_draft',
  VLE_MODE: 'optimaldbt_vle_mode',
  APPLICATIONS: 'optimaldbt_applications',
  DOCUMENTS: 'optimaldbt_documents',
  CHECKLIST: 'optimaldbt_checklist'
};

export function AppProvider({ children }) {
  // Always authenticated — field agent is pre-logged in for demo
  const [auth] = useState(MOCK_AUTH);
  // 1. Farmer Profile
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return saved ? JSON.parse(saved) : DEFAULT_FARMER;
    } catch {
      return DEFAULT_FARMER;
    }
  });

  // 2. Wizard Draft
  const [draft, setDraft] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DRAFT);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // 3. VLE Mode
  const [vleMode, setVleMode] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.VLE_MODE) === 'true';
  });

  // 4. Optimization Engine Result
  const [optimization, setOptimization] = useState(() => runOptimizationEngine(profile));

  // 5. Deduplicated Documents
  const [documents, setDocuments] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return deduplicateDocuments(runOptimizationEngine(profile).eligibleSchemes);
  });

  // 6. Applications List
  const [applications, setApplications] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: "APP-PMK-2024-9912",
        schemeId: "pm-kisan",
        schemeName: "Pradhan Mantri Kisan Samman Nidhi",
        stage: 4,
        status: "Disbursed (₹2,000 17th Installment)",
        submittedDate: "2024-04-12",
        updatedDate: "2024-09-18",
        docsReady: 4,
        docsTotal: 4,
        nextStep: "Next installment scheduled for December 2024"
      },
      {
        id: "APP-PMFBY-2024-7721",
        schemeId: "pmfby",
        schemeName: "PM Fasal Bima Yojana (Kharif)",
        stage: 3,
        status: "Document Verification in Progress",
        submittedDate: "2024-08-05",
        updatedDate: "2024-09-20",
        docsReady: 5,
        docsTotal: 5,
        nextStep: "Patwari Crop Sowing physical inspection completed"
      },
      {
        id: "APP-PMKSY-2024-4409",
        schemeId: "pmksy",
        schemeName: "PMKSY Drip Micro-Irrigation Grant",
        stage: 2,
        status: "Under Technical Scrutiny",
        submittedDate: "2024-09-02",
        updatedDate: "2024-09-15",
        docsReady: 4,
        docsTotal: 5,
        nextStep: "Awaiting Water Source NOC confirmation"
      },
      {
        id: "APP-SHC-2024-1184",
        schemeId: "soil-health-card",
        schemeName: "Soil Health Card Sample Collection",
        stage: 4,
        status: "Card Generated & Delivered",
        submittedDate: "2024-07-10",
        updatedDate: "2024-07-28",
        docsReady: 2,
        docsTotal: 2,
        nextStep: "Apply micro-nutrient fertilizer dosage recommendation"
      }
    ];
  });

  // 7. Action Plan Checklist
  const [checklist, setChecklist] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CHECKLIST);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      step1: true,
      step2: true,
      step3: true,
      step4: false,
      step5: false
    };
  });

  // 8. Modals & Sheets State
  const [schemeModalData, setSchemeModalData] = useState(null);
  const [conflictModalOpen, setConflictModalOpen] = useState(false);
  const [cameraModalDoc, setCameraModalDoc] = useState(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // 9. Online Status
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Update optimization when profile changes
  useEffect(() => {
    const opt = runOptimizationEngine(profile);
    setOptimization(opt);
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch {}
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(documents));
    } catch {}
  }, [documents]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
    } catch {}
  }, [applications]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CHECKLIST, JSON.stringify(checklist));
    } catch {}
  }, [checklist]);

  const updateProfile = (updates) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const saveWizardDraft = (draftData) => {
    setDraft(draftData);
    try {
      localStorage.setItem(STORAGE_KEYS.DRAFT, JSON.stringify(draftData));
    } catch {}
  };

  const clearWizardDraft = () => {
    setDraft(null);
    localStorage.removeItem(STORAGE_KEYS.DRAFT);
  };

  const toggleVle = () => {
    const next = !vleMode;
    setVleMode(next);
    localStorage.setItem(STORAGE_KEYS.VLE_MODE, next ? 'true' : 'false');
  };

  const toggleChecklistItem = (taskKey) => {
    setChecklist(prev => ({ ...prev, [taskKey]: !prev[taskKey] }));
  };

  const updateDocStatus = (docId, status, details = {}) => {
    setDocuments(prev => prev.map(d => {
      if (d.id === docId) {
        return {
          ...d,
          status,
          fileSize: details.fileSize || d.fileSize || '340 KB',
          uploadedAt: details.uploadedAt || new Date().toISOString().split('T')[0]
        };
      }
      return d;
    }));
  };

  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  return (
    <AppContext.Provider
      value={{
        auth,
        profile,
        updateProfile,
        draft,
        saveWizardDraft,
        clearWizardDraft,
        vleMode,
        toggleVle,
        optimization,
        documents,
        updateDocStatus,
        applications,
        checklist,
        toggleChecklistItem,
        isOnline,
        schemeModalData,
        setSchemeModalData,
        conflictModalOpen,
        setConflictModalOpen,
        cameraModalDoc,
        setCameraModalDoc,
        notificationsOpen,
        setNotificationsOpen,
        toast,
        triggerToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
