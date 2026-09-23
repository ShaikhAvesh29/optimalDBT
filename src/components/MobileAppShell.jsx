import React from 'react';
import { Outlet } from 'react-router-dom';
import { MobileHeader } from './MobileHeader.jsx';
import { BottomNavigation } from './BottomNavigation.jsx';
import { WarningModal } from './WarningModal.jsx';
import { SchemeDetailModal } from './SchemeDetailModal.jsx';
import { CameraModal } from './CameraModal.jsx';
import { NotificationsDrawer } from './NotificationsDrawer.jsx';
import { Toast } from './Toast.jsx';

export function MobileAppShell() {
  return (
    <div className="min-h-full flex flex-col max-w-lg mx-auto bg-slate-50 shadow-2xl relative overflow-x-hidden border-x border-slate-200/60 pb-20">
      <MobileHeader />
      <main className="flex-1 w-full bg-slate-50">
        <Outlet />
      </main>
      <BottomNavigation />
      
      {/* Global Modals and Sheets */}
      <WarningModal />
      <SchemeDetailModal />
      <CameraModal />
      <NotificationsDrawer />
      <Toast />
    </div>
  );
}
