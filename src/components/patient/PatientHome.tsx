import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  FileText,
  Activity,
  CreditCard,
  Search,
  Clock,
  ArrowRight,
  Stethoscope,
  Pill,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Building,
} from 'lucide-react';

interface PatientHomeProps {
  onTabChange: (tab: string) => void;
  onSearchMedicine: (query: string) => void;
}

export const PatientHome: React.FC<PatientHomeProps> = ({ onTabChange, onSearchMedicine }) => {
  const {
    currentPatientProfile,
    appointments,
    prescriptions,
    reports,
    bills,
    medicines,
    payBill,
  } = useApp();

  const [medQuery, setMedQuery] = useState('');

  // Stats calculation
  const upcomingAppointments = appointments.filter(
    a => a.patientId === currentPatientProfile?.patientId && a.status === 'Upcoming'
  );
  const completedAppointments = appointments.filter(
    a => a.patientId === currentPatientProfile?.patientId && a.status === 'Completed'
  );
  const patientReports = reports.filter(r => r.patientId === currentPatientProfile?.patientId);
  const patientPrescriptions = prescriptions.filter(p => p.patientId === currentPatientProfile?.patientId);

  // Latest entities
  const nextAppointment = upcomingAppointments[0];
  const latestPrescription = patientPrescriptions[0];
  const latestReport = patientReports[0];
  const pendingBill = bills.find(
    b => b.patientId === currentPatientProfile?.patientId && b.status === 'Pending'
  );

  const handleMedicineSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (medQuery.trim()) {
      onSearchMedicine(medQuery.trim());
      onTabChange('medicines');
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-xs mb-3">
            Patient Health Cockpit
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Welcome back, {currentPatientProfile?.name || 'Rahul'}!
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-blue-50 leading-relaxed">
            Your personal healthcare dashboard is active. You have{' '}
            <strong className="text-white underline">{upcomingAppointments.length} upcoming appointment(s)</strong> and{' '}
            <strong className="text-white underline">{patientReports.length} diagnostic report(s)</strong> on file.
          </p>

          {/* Quick search input in banner */}
          <form onSubmit={handleMedicineSearchSubmit} className="mt-5 flex items-center gap-2 max-w-md">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={medQuery}
                onChange={e => setMedQuery(e.target.value)}
                placeholder="Quick search medicine (e.g. Paracetamol, Cetirizine)..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-white shadow-sm"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm shrink-0"
            >
              Search
            </button>
          </form>
        </div>

        {/* Background decorative blob */}
        <div className="absolute right-0 top-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => onTabChange('appointments')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-blue-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Upcoming Appointments</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{upcomingAppointments.length}</p>
          <p className="text-[11px] text-blue-600 font-medium mt-1 flex items-center gap-1">
            <span>View schedule</span>
            <ChevronRight className="w-3 h-3" />
          </p>
        </div>

        <div
          onClick={() => onTabChange('appointments')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-emerald-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Completed Visits</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{completedAppointments.length}</p>
          <p className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <span>Past consultations</span>
            <ChevronRight className="w-3 h-3" />
          </p>
        </div>

        <div
          onClick={() => onTabChange('reports')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-indigo-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Medical Reports</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{patientReports.length}</p>
          <p className="text-[11px] text-indigo-600 font-medium mt-1 flex items-center gap-1">
            <span>Lab &amp; blood files</span>
            <ChevronRight className="w-3 h-3" />
          </p>
        </div>

        <div
          onClick={() => onTabChange('prescriptions')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-teal-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Active Prescriptions</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{patientPrescriptions.length}</p>
          <p className="text-[11px] text-teal-600 font-medium mt-1 flex items-center gap-1">
            <span>Medication details</span>
            <ChevronRight className="w-3 h-3" />
          </p>
        </div>
      </div>

      {/* Main Grid: Upcoming Appointment & Recent Prescription */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointment Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                  <Calendar className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">Next Upcoming Appointment</h3>
              </div>
              <button
                onClick={() => onTabChange('appointments')}
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                View All
              </button>
            </div>

            {nextAppointment ? (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{nextAppointment.doctorName}</h4>
                    <p className="text-xs text-blue-600 font-medium">{nextAppointment.doctorSpecialization}</p>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <Building className="w-3 h-3" />
                      <span>{nextAppointment.doctorHospital}</span>
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
                    {nextAppointment.type}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-200">
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{nextAppointment.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{nextAppointment.time}</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-600 italic bg-white p-2 rounded-lg border border-slate-100">
                  "{nextAppointment.reason}"
                </p>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 text-xs">
                <p>No upcoming appointments.</p>
                <button
                  onClick={() => onTabChange('doctors')}
                  className="mt-2 text-blue-600 font-semibold underline"
                >
                  Book a consultation with a doctor
                </button>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">Need to see a specialist?</span>
            <button
              onClick={() => onTabChange('doctors')}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors flex items-center gap-1 shadow-xs"
            >
              <span>Find Doctors</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Recent Prescription Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-teal-50 text-teal-600">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">Recent Prescription</h3>
              </div>
              <button
                onClick={() => onTabChange('prescriptions')}
                className="text-xs font-semibold text-teal-600 hover:underline"
              >
                View History
              </button>
            </div>

            {latestPrescription ? (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Diagnosis</span>
                    <h4 className="font-bold text-sm text-slate-900">{latestPrescription.diagnosis}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Prescribed by {latestPrescription.doctorName} on {latestPrescription.date}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-800">
                    ID: {latestPrescription.prescriptionId}
                  </span>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Medicines Prescribed</span>
                  {latestPrescription.medicines.map((med, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs bg-white p-2 rounded-lg border border-slate-100">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                        <Pill className="w-3.5 h-3.5 text-teal-600" />
                        <span>{med.medicineName}</span>
                        <span className="text-[10px] font-normal text-slate-500">({med.dosage})</span>
                      </div>
                      <span className="text-[11px] text-slate-600 font-medium">{med.frequency}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 text-xs">
                <p>No prescriptions recorded yet.</p>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">Need medicine refills?</span>
            <button
              onClick={() => onTabChange('medicines')}
              className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition-colors flex items-center gap-1 shadow-xs"
            >
              <span>Search Pharmacy Stock</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Row: Recent Report & Pending Bill */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Report */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                <Activity className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">Latest Medical Report</h3>
            </div>
            <button
              onClick={() => onTabChange('reports')}
              className="text-xs font-semibold text-indigo-600 hover:underline"
            >
              All Reports
            </button>
          </div>

          {latestReport ? (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{latestReport.reportName}</h4>
                  <p className="text-xs text-slate-500">{latestReport.labName} • {latestReport.date}</p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {latestReport.status}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed bg-white p-2.5 rounded-lg border border-slate-100">
                {latestReport.summary}
              </p>
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => onTabChange('reports')}
                  className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
                >
                  <span>View Full Diagnostics</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-4 text-center">No reports uploaded yet.</p>
          )}
        </div>

        {/* Pending Bill */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                <CreditCard className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">Billing &amp; Invoices</h3>
            </div>
            <button
              onClick={() => onTabChange('billing')}
              className="text-xs font-semibold text-amber-600 hover:underline"
            >
              Billing Ledger
            </button>
          </div>

          {pendingBill ? (
            <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">Pending Payment</span>
                  <h4 className="font-bold text-sm text-slate-900">{pendingBill.referenceTitle}</h4>
                  <p className="text-xs text-slate-500">Invoice: {pendingBill.invoiceNumber} • Date: {pendingBill.date}</p>
                </div>
                <div className="text-right">
                  <span className="text-base font-extrabold text-slate-900">₹{pendingBill.amount}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-amber-200/60">
                <span className="text-[11px] text-amber-900 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Due upon consultation</span>
                </span>
                <button
                  onClick={() => payBill(pendingBill.billId)}
                  className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors shadow-xs"
                >
                  Pay Now ₹{pendingBill.amount}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center py-6">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-1.5" />
              <p className="font-semibold text-xs text-emerald-900">All Bills Settled</p>
              <p className="text-[11px] text-emerald-700 mt-0.5">You have no outstanding invoices or pending payments.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
