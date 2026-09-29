import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  Pill,
  Clock,
  User,
  Sparkles,
  LogOut,
  Menu,
  X,
  Stethoscope,
} from 'lucide-react';
import { DoctorHome } from './DoctorHome';
import { DoctorPatients } from './DoctorPatients';
import { DoctorAppointments } from './DoctorAppointments';
import { DoctorReports } from './DoctorReports';
import { DoctorPrescriptions } from './DoctorPrescriptions';
import { DoctorFollowUps } from './DoctorFollowUps';
import { DoctorProfileView } from './DoctorProfileView';

interface DoctorDashboardProps {
  onNavigateHome: () => void;
  activeSubTab?: string;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({
  onNavigateHome,
  activeSubTab = 'dashboard',
}) => {
  const { currentDoctorProfile, logout, setIsAIAssistantOpen } = useApp();
  const [activeTab, setActiveTab] = useState(activeSubTab);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [targetPatientForAction, setTargetPatientForAction] = useState<string | undefined>(undefined);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'prescriptions', label: 'Prescriptions', icon: Pill },
    { id: 'followups', label: 'Follow-ups', icon: Clock },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'ai-assistant', label: 'AI Assistant', icon: Sparkles, isAction: true },
  ];

  const handleNavClick = (id: string, isAction?: boolean) => {
    if (isAction && id === 'ai-assistant') {
      setIsAIAssistantOpen(true);
      setMobileSidebarOpen(false);
      return;
    }
    setActiveTab(id);
    setMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 shrink-0">
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <img
            src={currentDoctorProfile?.avatar}
            alt={currentDoctorProfile?.name}
            className="w-10 h-10 rounded-xl object-cover ring-2 ring-emerald-100"
          />
          <div className="min-w-0">
            <h4 className="font-bold text-xs text-slate-900 truncate">{currentDoctorProfile?.name}</h4>
            <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              Doctor Cockpit
            </span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id, item.isAction)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.id === 'ai-assistant' ? 'text-emerald-500' : 'text-slate-400'}`} />
                <span className="flex-1 text-left">{item.label}</span>
                {item.id === 'ai-assistant' && (
                  <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                    AI
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-100">
          <button
            onClick={() => {
              logout();
              onNavigateHome();
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
            onClick={() => setMobileSidebarOpen(false)}
          ></div>
          <div className="relative w-64 bg-white flex flex-col h-full shadow-2xl z-10">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <span className="font-bold text-sm text-slate-800">Doctor Navigation</span>
              <button onClick={() => setMobileSidebarOpen(false)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id, item.isAction)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="lg:hidden flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-xs"
          >
            <Menu className="w-4 h-4" />
            <span className="capitalize">{activeTab}</span>
          </button>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md">
            Doctor Portal
          </span>
        </div>

        {activeTab === 'dashboard' && <DoctorHome onTabChange={tab => setActiveTab(tab)} />}
        {activeTab === 'patients' && (
          <DoctorPatients
            onPrescribeForPatient={id => {
              setTargetPatientForAction(id);
              setActiveTab('prescriptions');
            }}
            onScheduleFollowUpForPatient={id => {
              setTargetPatientForAction(id);
              setActiveTab('followups');
            }}
          />
        )}
        {activeTab === 'appointments' && (
          <DoctorAppointments
            onPrescribeForPatient={id => {
              setTargetPatientForAction(id);
              setActiveTab('prescriptions');
            }}
          />
        )}
        {activeTab === 'reports' && <DoctorReports />}
        {activeTab === 'prescriptions' && (
          <DoctorPrescriptions initialPatientId={targetPatientForAction} />
        )}
        {activeTab === 'followups' && (
          <DoctorFollowUps initialPatientId={targetPatientForAction} />
        )}
        {activeTab === 'profile' && <DoctorProfileView />}
      </main>
    </div>
  );
};
