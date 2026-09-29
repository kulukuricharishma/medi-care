import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Activity,
  Sparkles,
  Menu,
  X,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Layers,
} from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenAuth: (mode?: 'login' | 'register', role?: 'patient' | 'doctor' | 'store') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, onOpenAuth }) => {
  const {
    currentUser,
    currentRole,
    isLoggedIn,
    logout,
    setIsAIAssistantOpen,
    loginAsRole,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const isDashboardView = currentView.startsWith('dashboard');

  const roleBadgeConfig = {
    patient: { label: 'Patient Portal', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    doctor: { label: 'Doctor Portal', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    store: { label: 'Medical Store', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('landing')}
              className="flex items-center gap-2.5 group text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-teal-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                <Activity className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 via-cyan-900 to-teal-800 bg-clip-text text-transparent">
                  MediBridge<span className="text-cyan-600 font-black">.AI</span>
                </span>
                <span className="block text-[10px] uppercase font-bold tracking-widest text-slate-400">
                  Healthcare Platform
                </span>
              </div>
            </button>

            {isLoggedIn && isDashboardView && (
              <span
                className={`hidden md:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${roleBadgeConfig[currentRole].color} ml-2`}
              >
                {roleBadgeConfig[currentRole].label}
              </span>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {!isDashboardView ? (
              <>
                <button
                  onClick={() => onNavigate('landing')}
                  className="text-sm font-medium text-slate-700 hover:text-cyan-600 transition-colors"
                >
                  Home
                </button>
                <a
                  href="#about"
                  className="text-sm font-medium text-slate-700 hover:text-cyan-600 transition-colors"
                >
                  About
                </a>
                <a
                  href="#services"
                  className="text-sm font-medium text-slate-700 hover:text-cyan-600 transition-colors"
                >
                  Services
                </a>
                <a
                  href="#contact"
                  className="text-sm font-medium text-slate-700 hover:text-cyan-600 transition-colors"
                >
                  Contact
                </a>

                {isLoggedIn ? (
                  <button
                    onClick={() => onNavigate(`dashboard-${currentRole}`)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium shadow-sm transition-all shadow-cyan-600/20"
                  >
                    <Layers className="w-4 h-4" />
                    <span>Go to Dashboard</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-3 pl-2">
                    <button
                      onClick={() => onOpenAuth('login')}
                      className="px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-cyan-600 transition-colors"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => onOpenAuth('register')}
                      className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium shadow-sm transition-all shadow-cyan-600/25"
                    >
                      Get Started
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* When in dashboard */}
                <button
                  onClick={() => onNavigate('landing')}
                  className="text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
                >
                  ← Public Site
                </button>

                {/* AI Assistant quick launch */}
                <button
                  onClick={() => setIsAIAssistantOpen(true)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500/10 to-teal-500/10 text-cyan-800 border border-cyan-200 hover:border-cyan-300 text-xs font-semibold shadow-sm transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
                  <span>AI Assistant</span>
                </button>

                {/* User dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    <img
                      src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                      alt={currentUser.name}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-200"
                    />
                    <div className="text-left hidden lg:block">
                      <p className="text-xs font-bold text-slate-800 leading-tight">{currentUser.name}</p>
                      <p className="text-[10px] text-slate-500 capitalize">{currentRole}</p>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95">
                      <div className="px-3.5 py-2 border-b border-slate-100">
                        <p className="text-xs font-semibold text-slate-900">{currentUser.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                        <span className="inline-block mt-1 text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {currentRole}
                        </span>
                      </div>

                      <div className="py-1">
                        <p className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400">Switch Demo Role</p>
                        <button
                          onClick={() => {
                            loginAsRole('patient');
                            setProfileDropdownOpen(false);
                            onNavigate('dashboard-patient');
                          }}
                          className={`w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between ${
                            currentRole === 'patient' ? 'text-blue-700 font-bold bg-blue-50' : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span>Patient (Rahul Verma)</span>
                          {currentRole === 'patient' && <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>}
                        </button>
                        <button
                          onClick={() => {
                            loginAsRole('doctor');
                            setProfileDropdownOpen(false);
                            onNavigate('dashboard-doctor');
                          }}
                          className={`w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between ${
                            currentRole === 'doctor' ? 'text-emerald-700 font-bold bg-emerald-50' : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span>Doctor (Dr. Rahul Sharma)</span>
                          {currentRole === 'doctor' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>}
                        </button>
                        <button
                          onClick={() => {
                            loginAsRole('store');
                            setProfileDropdownOpen(false);
                            onNavigate('dashboard-store');
                          }}
                          className={`w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between ${
                            currentRole === 'store' ? 'text-amber-700 font-bold bg-amber-50' : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span>Store (HealthPlus Pharma)</span>
                          {currentRole === 'store' && <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>}
                        </button>
                      </div>

                      <div className="border-t border-slate-100 pt-1">
                        <button
                          onClick={() => {
                            logout();
                            setProfileDropdownOpen(false);
                            onNavigate('landing');
                          }}
                          className="w-full text-left px-3.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </nav>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsAIAssistantOpen(true)}
              className="p-2 rounded-lg bg-cyan-50 text-cyan-700"
              title="AI Assistant"
            >
              <Sparkles className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2">
          {!isDashboardView ? (
            <>
              <button
                onClick={() => {
                  onNavigate('landing');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 text-sm font-medium text-slate-700"
              >
                Home
              </button>
              <a
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-left py-2 text-sm font-medium text-slate-700"
              >
                About
              </a>
              <a
                href="#services"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-left py-2 text-sm font-medium text-slate-700"
              >
                Services
              </a>
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-left py-2 text-sm font-medium text-slate-700"
              >
                Contact
              </a>
              <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                <button
                  onClick={() => {
                    onOpenAuth('login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 text-center text-sm font-medium text-slate-700 border border-slate-200 rounded-lg"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    onOpenAuth('register');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 text-center text-sm font-medium bg-cyan-600 text-white rounded-lg shadow-sm"
                >
                  Get Started
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-3 py-2 border-b border-slate-100">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-sm text-slate-800">{currentUser.name}</p>
                  <p className="text-xs text-slate-500 capitalize">{currentRole} portal</p>
                </div>
              </div>

              <div className="py-1 space-y-1">
                <p className="text-xs uppercase font-bold text-slate-400">Switch Demo Role</p>
                <button
                  onClick={() => {
                    loginAsRole('patient');
                    setMobileMenuOpen(false);
                    onNavigate('dashboard-patient');
                  }}
                  className="w-full text-left p-2 rounded text-xs bg-slate-50 font-medium"
                >
                  Patient (Rahul Verma)
                </button>
                <button
                  onClick={() => {
                    loginAsRole('doctor');
                    setMobileMenuOpen(false);
                    onNavigate('dashboard-doctor');
                  }}
                  className="w-full text-left p-2 rounded text-xs bg-slate-50 font-medium"
                >
                  Doctor (Dr. Rahul Sharma)
                </button>
                <button
                  onClick={() => {
                    loginAsRole('store');
                    setMobileMenuOpen(false);
                    onNavigate('dashboard-store');
                  }}
                  className="w-full text-left p-2 rounded text-xs bg-slate-50 font-medium"
                >
                  Medical Store (HealthPlus)
                </button>
              </div>

              <button
                onClick={() => {
                  onNavigate('landing');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 text-center text-sm font-medium text-slate-700 border border-slate-200 rounded-lg"
              >
                Go to Public Landing
              </button>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                  onNavigate('landing');
                }}
                className="w-full py-2 text-center text-sm font-medium text-rose-600 border border-rose-200 rounded-lg"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
