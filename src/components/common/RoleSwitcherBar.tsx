import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserCheck, Stethoscope, Store, RotateCcw } from 'lucide-react';

export const RoleSwitcherBar: React.FC = () => {
  const { currentRole, loginAsRole, resetDemoData } = useApp();

  return (
    <aside aria-label="Interactive Demo Switcher" className="bg-slate-900 text-slate-100 text-xs py-2 px-3 sm:px-6 sticky top-0 z-50 border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-semibold text-[11px] border border-cyan-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            Role Switcher
          </span>
          <span className="text-slate-400 hidden sm:inline">
            Active view:{' '}
            <strong className="text-white capitalize">
              {currentRole === 'store' ? 'Medical Store' : currentRole}
            </strong>
          </span>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => loginAsRole('patient')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all font-medium ${
              currentRole === 'patient'
                ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-400'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Patient</span>
          </button>

          <button
            onClick={() => loginAsRole('doctor')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all font-medium ${
              currentRole === 'doctor'
                ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Doctor</span>
          </button>

          <button
            onClick={() => loginAsRole('store')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all font-medium ${
              currentRole === 'store'
                ? 'bg-amber-600 text-white shadow-sm ring-1 ring-amber-400'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Medical Store</span>
          </button>

          <div className="h-4 w-px bg-slate-700 mx-1 hidden sm:block"></div>

          <button
            onClick={resetDemoData}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-slate-400 hover:text-rose-300 hover:bg-slate-800/80 transition-colors"
            title="Reset sample data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Reset Data</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
