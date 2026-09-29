import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PatientProfile } from '../../types';
import {
  Users,
  Search,
  Eye,
  FileText,
  Calendar,
  Activity,
  AlertTriangle,
  X,
  Phone,
  Mail,
  MapPin,
  Pill,
  Plus,
  CheckCircle2,
  Lock,
} from 'lucide-react';

interface DoctorPatientsProps {
  onPrescribeForPatient?: (patientId: string) => void;
  onScheduleFollowUpForPatient?: (patientId: string) => void;
}

export const DoctorPatients: React.FC<DoctorPatientsProps> = ({
  onPrescribeForPatient,
  onScheduleFollowUpForPatient,
}) => {
  const { patients, appointments, prescriptions, reports, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<PatientProfile | null>(null);
  const [activeProfileTab, setActiveProfileTab] = useState<'overview' | 'appointments' | 'reports' | 'prescriptions' | 'notes'>('overview');
  const [consultationNote, setConsultationNote] = useState('');
  const [patientNotesList, setPatientNotesList] = useState<{ [patientId: string]: string[] }>({
    pat_1: ['2026-09-18: Patient presented with seasonal viral symptoms. Advised fluid intake and paracetamol.'],
  });

  const filteredPatients = patients.filter(
    p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.includes(searchQuery) ||
      p.bloodGroup.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveConsultationNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient || !consultationNote.trim()) return;

    const newNote = `${new Date().toISOString().split('T')[0]}: ${consultationNote.trim()}`;
    setPatientNotesList(prev => ({
      ...prev,
      [selectedPatient.patientId]: [newNote, ...(prev[selectedPatient.patientId] || [])],
    }));

    setConsultationNote('');
    showToast(`Consultation note recorded for ${selectedPatient.name}`, 'success');
  };

  const getPatientAppointments = (patientId: string) => {
    return appointments.filter(a => a.patientId === patientId);
  };

  const getPatientReports = (patientId: string) => {
    return reports.filter(r => r.patientId === patientId);
  };

  const getPatientPrescriptions = (patientId: string) => {
    return prescriptions.filter(p => p.patientId === patientId);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Authorized Patient Directory</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Encrypted clinical medical histories, consultation archives, and diagnostic records
          </p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search patients by name, phone, blood group..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 w-full sm:w-72"
          />
        </div>
      </div>

      {/* Patients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.map(pat => {
          const apts = getPatientAppointments(pat.patientId);
          const rxList = getPatientPrescriptions(pat.patientId);

          return (
            <div
              key={pat.patientId}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
            >
              <div className="p-5 space-y-3.5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold flex items-center justify-center text-base">
                      {pat.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{pat.name}</h3>
                      <p className="text-[11px] text-slate-500">
                        {pat.gender}, {pat.age} yrs • Blood: <strong className="text-slate-700">{pat.bloodGroup}</strong>
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                    {pat.patientId}
                  </span>
                </div>

                {/* Contact info */}
                <div className="space-y-1 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{pat.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{pat.email}</span>
                  </div>
                </div>

                {/* Allergies Warning */}
                {pat.allergies && pat.allergies.length > 0 && (
                  <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 text-[11px] flex items-start gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Allergies: </strong>
                      {pat.allergies.join(', ')}
                    </span>
                  </div>
                )}

                {/* Chronic conditions */}
                {pat.chronicConditions && pat.chronicConditions.length > 0 && (
                  <div className="p-2 rounded-lg bg-slate-50 text-[11px] text-slate-600">
                    <strong>Conditions: </strong> {pat.chronicConditions.join(', ')}
                  </div>
                )}
              </div>

              {/* Action Bar */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {apts.length} visits • {rxList.length} prescriptions
                </span>
                <button
                  onClick={() => {
                    setSelectedPatient(pat);
                    setActiveProfileTab('overview');
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Clinical File</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200">
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-lg font-bold">
                  {selectedPatient.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-white">{selectedPatient.name}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                      Authorized Record
                    </span>
                  </div>
                  <p className="text-xs text-emerald-100">
                    {selectedPatient.gender}, {selectedPatient.age} yrs • Blood Group: {selectedPatient.bloodGroup} • ID: {selectedPatient.patientId}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPatient(null)}
                className="p-1 text-emerald-200 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sub-tabs inside modal */}
            <div className="flex border-b border-slate-200 bg-slate-50 px-4 text-xs font-semibold overflow-x-auto shrink-0">
              {(['overview', 'appointments', 'reports', 'prescriptions', 'notes'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setActiveProfileTab(t)}
                  className={`py-3 px-3 capitalize border-b-2 transition-all ${
                    activeProfileTab === t
                      ? 'border-emerald-600 text-emerald-700 bg-white'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Content area */}
            <div className="flex-1 overflow-y-auto p-5 text-xs text-slate-700 space-y-4">
              {activeProfileTab === 'overview' && (
                <div className="space-y-4">
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Phone</span>
                      <span className="font-semibold text-slate-800">{selectedPatient.phone}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Email</span>
                      <span className="font-semibold text-slate-800">{selectedPatient.email}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-[10px] text-slate-400 block">Address</span>
                      <span className="font-medium text-slate-800">{selectedPatient.address}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-[10px] text-slate-400 block">Emergency Next of Kin</span>
                      <span className="font-semibold text-slate-800">{selectedPatient.emergencyContact}</span>
                    </div>
                  </div>

                  <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-950 space-y-1">
                    <span className="font-bold flex items-center gap-1.5 text-rose-900">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      Known Allergies &amp; Drug Contraindications
                    </span>
                    <p className="text-xs">{selectedPatient.allergies?.join(', ') || 'No recorded drug allergies'}</p>
                  </div>

                  <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-950 space-y-1">
                    <span className="font-bold flex items-center gap-1.5 text-blue-900">
                      <Activity className="w-4 h-4 text-blue-600" />
                      Chronic Medical Conditions
                    </span>
                    <p className="text-xs">{selectedPatient.chronicConditions?.join(', ') || 'None on record'}</p>
                  </div>
                </div>
              )}

              {activeProfileTab === 'appointments' && (
                <div className="space-y-2">
                  {getPatientAppointments(selectedPatient.patientId).map(apt => (
                    <div key={apt.appointmentId} className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <div className="flex items-center justify-between font-bold text-slate-900">
                        <span>{apt.date} at {apt.time} ({apt.type})</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200">{apt.status}</span>
                      </div>
                      <p className="text-slate-600 mt-1">Reason: "{apt.reason}"</p>
                      {apt.notes && <p className="text-[11px] text-blue-800 mt-1">Notes: {apt.notes}</p>}
                    </div>
                  ))}
                </div>
              )}

              {activeProfileTab === 'reports' && (
                <div className="space-y-2">
                  {getPatientReports(selectedPatient.patientId).map(r => (
                    <div key={r.reportId} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <div className="flex items-center justify-between font-bold text-slate-900">
                        <span>{r.reportName}</span>
                        <span className="text-emerald-700 text-[10px] font-semibold">{r.status}</span>
                      </div>
                      <p className="text-slate-500 text-[11px]">{r.labName} • {r.date}</p>
                      <p className="text-slate-600 bg-white p-2 rounded border border-slate-100">{r.summary}</p>
                    </div>
                  ))}
                  {getPatientReports(selectedPatient.patientId).length === 0 && (
                    <p className="text-center py-6 text-slate-400">No reports recorded for this patient.</p>
                  )}
                </div>
              )}

              {activeProfileTab === 'prescriptions' && (
                <div className="space-y-3">
                  {getPatientPrescriptions(selectedPatient.patientId).map(rx => (
                    <div key={rx.prescriptionId} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                      <div className="flex items-center justify-between font-bold text-slate-900">
                        <span>Diagnosis: {rx.diagnosis}</span>
                        <span className="text-xs text-slate-500">{rx.date}</span>
                      </div>
                      <div className="space-y-1">
                        {rx.medicines.map((m, i) => (
                          <div key={i} className="text-[11px] bg-white p-1.5 rounded border border-slate-100 flex items-center justify-between">
                            <span className="font-semibold text-slate-800">{m.medicineName} ({m.dosage})</span>
                            <span className="text-slate-500">{m.frequency}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeProfileTab === 'notes' && (
                <div className="space-y-4">
                  <form onSubmit={handleSaveConsultationNote} className="space-y-2">
                    <label className="block font-semibold text-slate-700">Add Clinical Consultation Note</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Enter physician observations, differential diagnosis, patient progress..."
                      value={consultationNote}
                      onChange={e => setConsultationNote(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    ></textarea>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-xs"
                    >
                      Save Clinical Note
                    </button>
                  </form>

                  <div className="space-y-2 pt-2 border-t border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Note History</span>
                    {(patientNotesList[selectedPatient.patientId] || []).map((n, i) => (
                      <div key={i} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800">
                        {n}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (onPrescribeForPatient) onPrescribeForPatient(selectedPatient.patientId);
                    setSelectedPatient(null);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs"
                >
                  Prescribe Medicine
                </button>
                <button
                  onClick={() => {
                    if (onScheduleFollowUpForPatient) onScheduleFollowUpForPatient(selectedPatient.patientId);
                    setSelectedPatient(null);
                  }}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs"
                >
                  Schedule Follow-up
                </button>
              </div>

              <button
                onClick={() => setSelectedPatient(null)}
                className="px-4 py-1.5 border border-slate-300 text-slate-700 rounded-xl font-semibold text-xs hover:bg-slate-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
