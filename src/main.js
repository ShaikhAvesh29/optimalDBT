import './index.css';
import { onLanguageChange } from './i18n/index.js';
import { subscribeStorage } from './logic/storage.js';
import { renderHeader, bindHeaderEvents } from './components/Header.js';
import { renderBottomNav } from './components/BottomNav.js';
import { renderWarningModal, closeConflictWarningModal } from './components/WarningModal.js';
import { renderSchemeDetailModal, closeSchemeModal } from './components/SchemeDetailModal.js';
import { renderCameraModal, bindCameraModalEvents } from './components/CameraModal.js';

// Pages
import { renderLandingPage, bindLandingEvents } from './pages/LandingPage.js';
import { renderWizardPage, bindWizardEvents } from './pages/WizardPage.js';
import { renderProcessingPage, bindProcessingEvents } from './pages/ProcessingPage.js';
import { renderDashboardPage, bindDashboardEvents } from './pages/DashboardPage.js';
import { renderRoadmapPage, bindRoadmapEvents } from './pages/RoadmapPage.js';
import { renderDocumentLockerPage, bindDocumentLockerEvents } from './pages/DocumentLockerPage.js';
import { renderTrackerPage, bindTrackerEvents } from './pages/TrackerPage.js';
import { renderExplorerPage, bindExplorerEvents } from './pages/ExplorerPage.js';
import { renderVLEControlPanel, bindVLEEvents } from './pages/VLEControlPanel.js';
import { renderProfilePage, bindProfileEvents } from './pages/ProfilePage.js';

function getRoute() {
  const hash = window.location.hash.replace(/^#/, '');
  if (!hash || hash === '') return 'home';
  return hash;
}

function renderApp() {
  const app = document.getElementById('app');
  if (!app) return;

  const route = getRoute();

  let pageContent = '';
  switch (route) {
    case 'home':
      pageContent = renderLandingPage();
      break;
    case 'wizard':
      pageContent = renderWizardPage();
      break;
    case 'processing':
      pageContent = renderProcessingPage();
      break;
    case 'dashboard':
      pageContent = renderDashboardPage();
      break;
    case 'roadmap':
      pageContent = renderRoadmapPage();
      break;
    case 'locker':
      pageContent = renderDocumentLockerPage();
      break;
    case 'tracker':
      pageContent = renderTrackerPage();
      break;
    case 'explorer':
      pageContent = renderExplorerPage();
      break;
    case 'vle-panel':
      pageContent = renderVLEControlPanel();
      break;
    case 'profile':
      pageContent = renderProfilePage();
      break;
    default:
      pageContent = renderLandingPage();
      break;
  }

  app.innerHTML = `
    ${renderHeader(route)}
    <main class="flex-1 w-full bg-slate-50">
      ${pageContent}
    </main>
    ${renderBottomNav(route)}
    ${renderWarningModal()}
    ${renderSchemeDetailModal()}
    ${renderCameraModal()}
  `;

  // Bind Global & Page-specific events
  bindHeaderEvents();
  bindModalGlobalEvents();
  bindCameraModalEvents((docId) => {
    // Refresh locker if on locker page
    if (getRoute() === 'locker') {
      window.dispatchEvent(new CustomEvent('render-app'));
    }
  });

  switch (route) {
    case 'home':
      bindLandingEvents();
      break;
    case 'wizard':
      bindWizardEvents();
      break;
    case 'processing':
      bindProcessingEvents();
      break;
    case 'dashboard':
      bindDashboardEvents();
      break;
    case 'roadmap':
      bindRoadmapEvents();
      break;
    case 'locker':
      bindDocumentLockerEvents();
      break;
    case 'tracker':
      bindTrackerEvents();
      break;
    case 'explorer':
      bindExplorerEvents();
      break;
    case 'vle-panel':
      bindVLEEvents();
      break;
    case 'profile':
      bindProfileEvents();
      break;
  }

  // Scroll to top on route change
  window.scrollTo(0, 0);
}

function bindModalGlobalEvents() {
  // Warning Modal close buttons
  const btnCancelConflict = document.getElementById('btn-cancel-conflict-modal');
  const btnKeepOptimal = document.getElementById('btn-keep-optimal-modal');
  if (btnCancelConflict) btnCancelConflict.addEventListener('click', closeConflictWarningModal);
  if (btnKeepOptimal) btnKeepOptimal.addEventListener('click', closeConflictWarningModal);

  // Scheme Detail Modal close buttons
  const btnCloseScheme = document.getElementById('btn-close-scheme-modal');
  const btnCloseSchemeBottom = document.getElementById('btn-close-scheme-modal-bottom');
  if (btnCloseScheme) btnCloseScheme.addEventListener('click', closeSchemeModal);
  if (btnCloseSchemeBottom) btnCloseSchemeBottom.addEventListener('click', closeSchemeModal);
}

// Event Listeners
window.addEventListener('hashchange', renderApp);
window.addEventListener('render-app', renderApp);
onLanguageChange(() => renderApp());
subscribeStorage((type) => {
  if (type === 'vleMode') {
    renderApp();
  }
});

// Initial boot
document.addEventListener('DOMContentLoaded', () => {
  renderApp();
});
renderApp();
