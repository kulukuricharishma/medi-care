import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  UserCheck,
  Calendar,
  Activity,
  FileText,
  CreditCard,
  Pill,
  Store,
  User,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import { PatientHome } from './PatientHome';
import { PatientDoctors } from './PatientDoctors';
import { PatientAppointments } from './PatientAppointments';
import { PatientLabTests } from './PatientLabTests';
import { PatientReports } from './PatientReports';
import { PatientPrescriptions } from './PatientPrescriptions';
import { PatientBilling } from './PatientBilling';
import { PatientMedicines } from './PatientMedicines';
import { PatientMedicalStores } from './PatientMedicalStores';
import { PatientProfileView } from './PatientProfileView';

interface PatientDashboardProps {
  onNavigateHome: () => void;
  activeSubTab?: string;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({
  onNavigateHome,
  activeSubTab = 'dashboard',
}) => {
  const { currentPatientProfile, logout } = useApp();
  const [activeTab, setActiveTab] = useState(activeSubTab);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchMedicineQuery, setSearchMedicineQuery] = useState('');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'doctors', label: 'Doctors', icon: UserCheck },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'lab-tests', label: 'Lab Tests', icon: Activity },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'prescriptions', label: 'Prescriptions', icon: Pill },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'medicines', label: 'Medicines', icon: Pill },
    { id: 'stores', label: 'Medical Stores', icon: Store },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileSidebarOpen(false);
  };

  const handleSearchMedicineFromHome = (query: string) => {
    setSearchMedicineQuery(query);
    setActiveTab('medicines');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 shrink-0">
        {/* User Card */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0">
            {currentPatientProfile?.name.charAt(0) || 'P'}
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-xs text-slate-900 truncate">{currentPatientProfile?.name}</h4>
            <span className="text-[10px] text-blue-600 font-semibold bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
              Patient Portal
            </span>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="flex-1 text-left">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout */}
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
              <span className="font-bold text-sm text-slate-800">Patient Navigation</span>
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
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
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
        {/* Mobile toggle bar */}
        <div className="lg:hidden flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-xs"
          >
            <Menu className="w-4 h-4" />
            <span className="capitalize">{activeTab.replace('-', ' ')}</span>
          </button>

          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
            Patient Dashboard
          </span>
        </div>

        {/* Tab switch renders */}
        {activeTab === 'dashboard' && (
          <PatientHome
            onTabChange={tab => setActiveTab(tab)}
            onSearchMedicine={handleSearchMedicineFromHome}
          />
        )}
        {activeTab === 'doctors' && <PatientDoctors />}
        {activeTab === 'appointments' && <PatientAppointments />}
        {activeTab === 'lab-tests' && <PatientLabTests />}
        {activeTab === 'reports' && <PatientReports />}
        {activeTab === 'prescriptions' && (
          <PatientPrescriptions
            onSearchMedicine={handleSearchMedicineFromHome}
            onNavigateToTab={tab => setActiveTab(tab)}
          />
        )}
        {activeTab === 'billing' && <PatientBilling />}
        {activeTab === 'medicines' && (
          <PatientMedicines
            initialSearchQuery={searchMedicineQuery}
            onClearInitialQuery={() => setSearchMedicineQuery('')}
          />
        )}
        {activeTab === 'stores' && (
          <PatientMedicalStores
            onOrderMedicineFromStore={med => {
              setSearchMedicineQuery(med.name);
              setActiveTab('medicines');
            }}
          />
        )}
        {activeTab === 'profile' && <PatientProfileView />}
      </main>
    </div>
  );
};
