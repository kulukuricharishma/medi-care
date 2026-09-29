import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Prescription } from '../../types';
import {
  FileText,
  Pill,
  Calendar,
  UserCheck,
  Eye,
  Printer,
  X,
  ArrowRight,
  ShieldCheck,
  Clock,
  Sparkles,
} from 'lucide-react';

interface PatientPrescriptionsProps {
  onSearchMedicine: (medName: string) => void;
  onNavigateToTab: (tab: string) => void;
}

export const PatientPrescriptions: React.FC<PatientPrescriptionsProps> = ({
  onSearchMedicine,
  onNavigateToTab,
}) => {
  const { currentPatientProfile, prescriptions, showToast } = useApp();

  const [selectedRx, setSelectedRx] = useState<Prescription | null>(null);

  const patientRxList = prescriptions.filter(
    p => p.patientId === currentPatientProfile?.patientId
  );

  const handlePrint = (rx: Prescription) => {
    showToast(`Generating printable prescription #${rx.prescriptionId}`, 'info');
  };

  const handleOrderMed = (medName: string) => {
    onSearchMedicine(medName);
    onNavigateToTab('medicines');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">E-Prescriptions</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Digitally validated medical prescriptions authored by your consulting physicians
          </p>
        </div>
      </div>

      {/* Prescription Cards */}
      <div className="space-y-5">
        {patientRxList.map(rx => (
          <div
            key={rx.prescriptionId}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-teal-300 transition-all p-5 space-y-4"
          >
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-900">{rx.doctorName}</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-teal-50 text-teal-700 border border-teal-200">
                      {rx.doctorSpecialization}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Prescribed on <strong className="text-slate-700">{rx.date}</strong> • RX #{rx.prescriptionId}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedRx(rx)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Full View</span>
                </button>
                <button
                  onClick={() => handlePrint(rx)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
              </div>
            </div>

            {/* Diagnosis */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Clinical Diagnosis</span>
              <p className="font-bold text-slate-800 text-sm">{rx.diagnosis}</p>
              {rx.additionalNotes && (
                <p className="text-slate-600 text-xs mt-1 italic">Notes: "{rx.additionalNotes}"</p>
              )}
            </div>

            {/* Medicines List */}
            <div className="space-y-2">
              <span className="text-[11px] uppercase font-bold text-slate-400 block">Prescribed Medicines</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {rx.medicines.map((med, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-teal-200 transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                          <Pill className="w-3.5 h-3.5 text-teal-600" />
                          {med.medicineName}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-700">
                          {med.dosage}
                        </span>
                      </div>

                      <div className="mt-2 space-y-1 text-[11px] text-slate-600">
                        <p>
                          <strong className="text-slate-700">Frequency:</strong> {med.frequency}
                        </p>
                        <p>
                          <strong className="text-slate-700">Duration:</strong> {med.duration}
                        </p>
                        <p className="text-slate-500 italic">"{med.instructions}"</p>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex justify-end">
                      <button
                        onClick={() => handleOrderMed(med.medicineName)}
                        className="text-[11px] font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1"
                      >
                        <span>Check Pharmacy Stock</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Follow-up Note */}
            {rx.followUpDate && (
              <div className="flex items-center gap-2 text-xs text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Doctor recommended follow-up review on <strong className="font-bold">{rx.followUpDate}</strong>.
                </span>
              </div>
            )}
          </div>
        ))}

        {patientRxList.length === 0 && (
          <div className="p-12 text-center text-slate-500 text-sm bg-white rounded-2xl border border-slate-200">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold text-slate-700">No prescriptions found.</p>
            <p className="text-xs text-slate-400 mt-1">Prescriptions issued during consultations appear here immediately.</p>
          </div>
        )}
      </div>

      {/* Full View Prescription Modal */}
      {selectedRx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="p-5 bg-gradient-to-r from-teal-800 to-cyan-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">Official E-Prescription</h3>
                <p className="text-[11px] text-teal-200">RX ID: {selectedRx.prescriptionId}</p>
              </div>
              <button onClick={() => setSelectedRx(null)} className="p-1 text-teal-200 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 gap-2 text-slate-700">
                <div>
                  <span className="text-[10px] text-slate-400 block">Doctor</span>
                  <span className="font-bold text-slate-900">{selectedRx.doctorName}</span>
                  <span className="block text-[11px] text-teal-700">{selectedRx.doctorSpecialization}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Date of Issue</span>
                  <span className="font-bold text-slate-900">{selectedRx.date}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Diagnosis</span>
                <p className="p-2.5 rounded-lg bg-teal-50/50 border border-teal-200 text-teal-950 font-semibold">
                  {selectedRx.diagnosis}
                </p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">
                  Prescription Regimen
                </span>
                <div className="space-y-2">
                  {selectedRx.medicines.map((m, i) => (
                    <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <div className="flex items-center justify-between font-bold text-slate-900">
                        <span>{i + 1}. {m.medicineName}</span>
                        <span className="text-teal-700 font-semibold">{m.dosage}</span>
                      </div>
                      <div className="text-[11px] text-slate-600">
                        Frequency: <strong>{m.frequency}</strong> • Duration: <strong>{m.duration}</strong>
                      </div>
                      <div className="text-[11px] text-slate-500 italic">Instructions: {m.instructions}</div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedRx.additionalNotes && (
                <div className="text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <strong className="block text-slate-800 text-[11px]">Doctor Advice:</strong>
                  {selectedRx.additionalNotes}
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => handlePrint(selectedRx)}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Copy</span>
              </button>
              <button
                onClick={() => setSelectedRx(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl font-semibold text-xs hover:bg-slate-100"
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
