import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Calendar,
  Clock,
  Activity,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Stethoscope,
  Video,
  Building,
  ArrowRight,
  FileText,
  UserCheck,
} from 'lucide-react';

interface DoctorHomeProps {
  onTabChange: (tab: string) => void;
}

export const DoctorHome: React.FC<DoctorHomeProps> = ({ onTabChange }) => {
  const {
    currentDoctorProfile,
    patients,
    appointments,
    reports,
    followUps,
    updateAppointmentStatus,
  } = useApp();

  const doctorAppointments = appointments.filter(
    a => a.doctorId === currentDoctorProfile?.doctorId
  );

  // Today's appointments (for demo purposes, appointments with 2026-09-29 or upcoming)
  const todayAppointments = doctorAppointments.filter(
    a => a.date === '2026-09-29' || (a.status === 'Upcoming' && a.date <= '2026-09-30')
  );

  const upcomingAppointments = doctorAppointments.filter(a => a.status === 'Upcoming');
  const pendingFollowUps = followUps.filter(
    f => f.doctorId === currentDoctorProfile?.doctorId && f.status === 'Scheduled'
  );
  const recentReports = reports.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-800 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-xs mb-3">
            Clinical Practitioner Cockpit
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Welcome, {currentDoctorProfile?.name || 'Dr. Sharma'}!
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-emerald-100 leading-relaxed">
            {currentDoctorProfile?.specialization} • {currentDoctorProfile?.hospital}
          </p>
          <p className="mt-1 text-xs text-white/90">
            You have <strong className="underline">{todayAppointments.length} appointment(s)</strong> scheduled for today and{' '}
            <strong className="underline">{pendingFollowUps.length} pending clinical follow-up(s)</strong>.
          </p>
        </div>

        <div className="absolute right-0 top-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div
          onClick={() => onTabChange('patients')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-emerald-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Patients</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{patients.length}</p>
          <p className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <span>Patient records</span>
            <ChevronRight className="w-3 h-3" />
          </p>
        </div>

        <div
          onClick={() => onTabChange('appointments')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-blue-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Today's Visits</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{todayAppointments.length}</p>
          <p className="text-[11px] text-blue-600 font-medium mt-1 flex items-center gap-1">
            <span>Daily queue</span>
            <ChevronRight className="w-3 h-3" />
          </p>
        </div>

        <div
          onClick={() => onTabChange('appointments')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-cyan-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Upcoming Total</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center group-hover:bg-cyan-600 group-hover:text-white transition-colors">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{upcomingAppointments.length}</p>
          <p className="text-[11px] text-cyan-600 font-medium mt-1 flex items-center gap-1">
            <span>All booked</span>
            <ChevronRight className="w-3 h-3" />
          </p>
        </div>

        <div
          onClick={() => onTabChange('followups')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-amber-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Pending Follow-ups</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{pendingFollowUps.length}</p>
          <p className="text-[11px] text-amber-600 font-medium mt-1 flex items-center gap-1">
            <span>Review required</span>
            <ChevronRight className="w-3 h-3" />
          </p>
        </div>

        <div
          onClick={() => onTabChange('reports')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-indigo-400 transition-all cursor-pointer group col-span-2 lg:col-span-1"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Recent Reports</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{recentReports.length}</p>
          <p className="text-[11px] text-indigo-600 font-medium mt-1 flex items-center gap-1">
            <span>Lab findings</span>
            <ChevronRight className="w-3 h-3" />
          </p>
        </div>
      </div>

      {/* Main Grid: Today's Appointments & Pending Followups */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Appointments Schedule */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                  <Calendar className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">Today's Appointment Queue</h3>
              </div>
              <button
                onClick={() => onTabChange('appointments')}
                className="text-xs font-semibold text-emerald-600 hover:underline"
              >
                Manage All
              </button>
            </div>

            <div className="space-y-3">
              {todayAppointments.map(apt => (
                <div
                  key={apt.appointmentId}
                  className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/60 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{apt.patientName}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-700">
                        {apt.time}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-200 text-slate-700">
                        {apt.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Reason: <span className="italic font-medium">"{apt.reason}"</span>
                    </p>
                    {apt.notes && (
                      <p className="text-[11px] text-blue-800 bg-blue-50/80 px-2 py-1 rounded border border-blue-100">
                        Note: {apt.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {apt.status === 'Upcoming' ? (
                      <>
                        <button
                          onClick={() => updateAppointmentStatus(apt.appointmentId, 'Completed')}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-xs"
                        >
                          Complete
                        </button>
                        <button
                          onClick={() => onTabChange('prescriptions')}
                          className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors"
                        >
                          Prescribe
                        </button>
                      </>
                    ) : (
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Completed</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {todayAppointments.length === 0 && (
                <div className="text-center py-8 text-slate-500 text-xs">
                  <p>No more appointments scheduled for today.</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">Need to prescribe medication?</span>
            <button
              onClick={() => onTabChange('prescriptions')}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors flex items-center gap-1 shadow-xs"
            >
              <span>Draft Prescription</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Pending Follow-ups */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                  <Clock className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">Pending Follow-ups</h3>
              </div>
              <button
                onClick={() => onTabChange('followups')}
                className="text-xs font-semibold text-amber-600 hover:underline"
              >
                All
              </button>
            </div>

            <div className="space-y-3">
              {pendingFollowUps.map(f => (
                <div
                  key={f.followUpId}
                  className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/40 space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{f.patientName}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                      Due: {f.date}
                    </span>
                  </div>
                  <p className="text-slate-600 line-clamp-2">{f.reason}</p>
                  {f.notes && <p className="text-[11px] text-slate-500 italic">Notes: {f.notes}</p>}
                </div>
              ))}

              {pendingFollowUps.length === 0 && (
                <p className="text-xs text-slate-400 py-6 text-center">No pending follow-ups.</p>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={() => onTabChange('followups')}
              className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors text-center"
            >
              Schedule New Follow-up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
