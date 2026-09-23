import { DEFAULT_FARMER } from '../data/farmers.js';

const STORAGE_KEYS = {
  FARMER_PROFILE: 'optimal_dbt_farmer_profile',
  DRAFT_WIZARD: 'optimal_dbt_draft_wizard',
  DOCUMENTS: 'optimal_dbt_documents',
  APPLICATIONS: 'optimal_dbt_applications',
  VLE_MODE: 'optimal_dbt_vle_mode',
  OFFLINE_QUEUE: 'optimal_dbt_offline_queue'
};

const listeners = new Set();

export function getFarmerProfile() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.FARMER_PROFILE);
    return data ? JSON.parse(data) : DEFAULT_FARMER;
  } catch (e) {
    return DEFAULT_FARMER;
  }
}

export function saveFarmerProfile(profile) {
  try {
    localStorage.setItem(STORAGE_KEYS.FARMER_PROFILE, JSON.stringify(profile));
    notifyListeners('profile', profile);
  } catch (e) {
    console.error('Failed to save profile', e);
  }
}

export function getDraftWizard() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.DRAFT_WIZARD);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
}

export function saveDraftWizard(draft) {
  try {
    localStorage.setItem(STORAGE_KEYS.DRAFT_WIZARD, JSON.stringify({
      ...draft,
      savedAt: new Date().toISOString()
    }));
    notifyListeners('draft', draft);
  } catch (e) {
    console.error('Failed to save draft', e);
  }
}

export function clearDraftWizard() {
  localStorage.removeItem(STORAGE_KEYS.DRAFT_WIZARD);
  notifyListeners('draft', null);
}

export function getVLEMode() {
  return localStorage.getItem(STORAGE_KEYS.VLE_MODE) === 'true';
}

export function setVLEMode(isVLE) {
  localStorage.setItem(STORAGE_KEYS.VLE_MODE, isVLE ? 'true' : 'false');
  notifyListeners('vleMode', isVLE);
}

export function subscribeStorage(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function notifyListeners(type, payload) {
  listeners.forEach(fn => fn(type, payload));
}

// Initial Applications mock
export function getApplications() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
    if (data) return JSON.parse(data);
  } catch (e) {}

  const defaults = [
    {
      id: "APP-PMK-2024-9912",
      schemeId: "pm-kisan",
      schemeName: "Pradhan Mantri Kisan Samman Nidhi",
      stage: 4, // 1: Submitted, 2: Under Review, 3: Verification, 4: Approved/Disbursed
      status: "Disbursed (₹2,000 17th Installment)",
      statusKey: "statusApproved",
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
      statusKey: "statusVerification",
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
      statusKey: "statusUnderReview",
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
      statusKey: "statusApproved",
      submittedDate: "2024-07-10",
      updatedDate: "2024-07-28",
      docsReady: 2,
      docsTotal: 2,
      nextStep: "Apply micro-nutrient fertilizer dosage recommendation"
    }
  ];

  localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(defaults));
  return defaults;
}
