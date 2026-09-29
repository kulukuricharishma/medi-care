import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { UserRole } from './types';
import { RoleSwitcherBar } from './components/common/RoleSwitcherBar';
import { Navbar } from './components/common/Navbar';
import { Toast } from './components/common/Toast';
import { AIAssistantModal } from './components/common/AIAssistantModal';
import { AuthModal } from './components/auth/AuthModal';
import { LandingPage } from './components/landing/LandingPage';
import { PatientDashboard } from './components/patient/PatientDashboard';
import { DoctorDashboard } from './components/doctor/DoctorDashboard';
import { StoreDashboard } from './components/store/StoreDashboard';

const MainApp: React.FC = () => {
  const { currentRole, isLoggedIn } = useApp();

  const [currentView, setCurrentView] = useState<string>('landing');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authRole, setAuthRole] = useState<UserRole>('patient');

  // Handle open auth modal
  const handleOpenAuth = (mode: 'login' | 'register' = 'login', role: UserRole = 'patient') => {
    setAuthMode(mode);
    setAuthRole(role);
    setAuthModalOpen(true);
  };

  const handleSuccessfulLogin = (role: UserRole) => {
    setCurrentView(`dashboard-${role}`);
  };

  const handleNavigateToDashboard = (role: UserRole) => {
    setCurrentView(`dashboard-${role}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      {/* Top Demo Role Switcher Bar */}
      <RoleSwitcherBar />

      {/* Primary Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={view => setCurrentView(view)}
        onOpenAuth={handleOpenAuth}
      />

      {/* Main Views */}
      <div className="flex-1 flex flex-col">
        {currentView === 'landing' ? (
          <LandingPage
            onOpenAuth={handleOpenAuth}
            onNavigateToDashboard={handleNavigateToDashboard}
          />
        ) : currentRole === 'patient' ? (
          <PatientDashboard onNavigateHome={() => setCurrentView('landing')} />
        ) : currentRole === 'doctor' ? (
          <DoctorDashboard onNavigateHome={() => setCurrentView('landing')} />
        ) : (
          <StoreDashboard onNavigateHome={() => setCurrentView('landing')} />
        )}
      </div>

      {/* Floating Global AI Assistant */}
      <AIAssistantModal />

      {/* Interactive Toast Notifications */}
      <Toast />

      {/* Role-Based Authentication & Registration Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultMode={authMode}
        defaultRole={authRole}
        onSuccessfulLogin={handleSuccessfulLogin}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
