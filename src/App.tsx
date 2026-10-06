/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { PassengerApp } from './components/passenger/PassengerApp';
import { DriverApp } from './components/driver/DriverApp';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { UnifiedAuthScreen } from './components/auth/UnifiedAuthScreen';
import { Wifi, BatteryMedium, Signal } from 'lucide-react';

const AppContent: React.FC = () => {
  const { isAuthenticated, role, deviceViewMode } = useApp();

  // If not authenticated, show personal data entry & automatic role detection screen
  if (!isAuthenticated) {
    return <UnifiedAuthScreen />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      <Header />

      <main className="flex-1 flex flex-col">
        {role === 'admin' ? (
          // Admin Console (Always full-width desktop SaaS view)
          <div className="flex-1">
            <AdminDashboard />
          </div>
        ) : (
          // Mobile-first Passenger & Driver Views
          <div className="flex-1 flex items-center justify-center p-0 sm:py-6 sm:px-4 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
            {deviceViewMode === 'mobile' ? (
              // Smartphone Frame Mockup
              <div className="relative w-full sm:max-w-[410px] h-[100dvh] sm:h-[840px] sm:max-h-[92vh] sm:rounded-[44px] sm:border-[8px] sm:border-slate-800 sm:ring-1 sm:ring-slate-700/60 shadow-2xl overflow-hidden bg-slate-900 flex flex-col">
                {/* Simulated Phone Notch / Speaker Island */}
                <div className="hidden sm:flex items-center justify-between px-6 pt-3 pb-1 bg-slate-950 text-slate-400 text-[11px] font-mono select-none z-50">
                  <span className="font-bold text-white">07:25</span>
                  {/* Dynamic Island slit */}
                  <div className="h-4 w-24 rounded-full bg-slate-800 flex items-center justify-end px-2">
                    <span className="h-2 w-2 rounded-full bg-slate-900"></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Signal className="h-3 w-3" />
                    <Wifi className="h-3 w-3" />
                    <BatteryMedium className="h-3.5 w-3.5 text-emerald-400" />
                  </div>
                </div>

                {/* Internal App Screen */}
                <div className="flex-1 overflow-hidden relative">
                  {role === 'passenger' ? <PassengerApp /> : <DriverApp />}
                </div>

                {/* Home Indicator Bar */}
                <div className="hidden sm:flex h-4 items-center justify-center bg-slate-950">
                  <div className="h-1 w-32 rounded-full bg-slate-700"></div>
                </div>
              </div>
            ) : (
              // Full-Width / Responsive Container
              <div className="w-full max-w-2xl min-h-[85vh] bg-slate-900 sm:rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col">
                {role === 'passenger' ? <PassengerApp /> : <DriverApp />}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
