import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PrescribedMedicineItem, Prescription } from '../../types';
import {
  FileText,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  User,
  Pill,
  Send,
  Eye,
  X,
  History,
} from 'lucide-react';

interface DoctorPrescriptionsProps {
  initialPatientId?: string;
}

export const DoctorPrescriptions: React.FC<DoctorPrescriptionsProps> = ({ initialPatientId }) => {
  const {
    patients,
    currentDoctorProfile,
    prescriptions,
    createPrescription,
    showToast,
  } = useApp();

  const [activeView, setActiveView] = useState<'create' | 'history'>('create');
  const [patientId, setPatientId] = useState(initialPatientId || patients[0]?.patientId || '');
  const [diagnosis, setDiagnosis] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [followUpDate, setFollowUpDate] = useState('2026-10-10');

  // Medicine items in the current form
  const [medicineItems, setMedicineItems] = useState<PrescribedMedicineItem[]>([
    {
      medicineName: 'Paracetamol 500mg',
      dosage: '1 tablet (500mg)',
      frequency: '1-0-1 (Morning & Night, after food)',
      duration: '4 days',
      instructions: 'Take if temperature exceeds 99.5°F',
    },
  ]);

  const [viewingRx, setViewingRx] = useState<Prescription | null>(null);

  // Doctor's history
  const doctorPrescriptions = prescriptions.filter(
    p => p.doctorId === currentDoctorProfile?.doctorId
  );

  const handleAddMedicineRow = () => {
    setMedicineItems(prev => [
      ...prev,
      {
        medicineName: '',
        dosage: '1 tablet',
        frequency: '1-0-1 (After food)',
        duration: '5 days',
        instructions: 'Take with warm water',
      },
    ]);
  };

  const handleRemoveMedicineRow = (index: number) => {
    setMedicineItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdateMedicineRow = (index: number, field: keyof PrescribedMedicineItem, val: string) => {
    setMedicineItems(prev =>
      prev.map((item, i) => (i === index ? { ...item, [field]: val } : item))
    );
  };

  const handleSavePrescription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!diagnosis.trim()) {
      showToast('Please provide a clinical diagnosis', 'error');
      return;
    }
    if (medicineItems.some(m => !m.medicineName.trim())) {
      showToast('Please specify all medicine names', 'error');
      return;
    }

    createPrescription({
      patientId,
      medicines: medicineItems,
      diagnosis,
      additionalNotes,
      followUpDate: followUpDate || undefined,
    });

    // Reset form
    setDiagnosis('');
    setAdditionalNotes('');
    setMedicineItems([
      {
        medicineName: '',
        dosage: '1 tablet',
        frequency: '1-0-1',
        duration: '5 days',
        instructions: '',
      },
    ]);
    setActiveView('history');
  };

  return (
    <div className="space-y-6">
      {/* Title & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">E-Prescription Studio</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Author digitally signed prescriptions that synchronize directly into the patient &amp; pharmacy portal
          </p>
        </div>

        <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => setActiveView('create')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
              activeView === 'create'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Create Prescription
          </button>
          <button
            onClick={() => setActiveView('history')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
              activeView === 'history'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Prescription History ({doctorPrescriptions.length})
          </button>
        </div>
      </div>

      {activeView === 'create' ? (
        <form onSubmit={handleSavePrescription} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
          {/* Patient Selection & Diagnosis */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Select Patient</label>
              <select
                value={patientId}
                onChange={e => setPatientId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/20 bg-white"
              >
                {patients.map(p => (
                  <option key={p.patientId} value={p.patientId}>
                    {p.name} ({p.gender}, {p.age}y - Blood: {p.bloodGroup})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Clinical Diagnosis</label>
              <input
                type="text"
                required
                placeholder="e.g. Acute Bronchitis, Type 2 DM Titration..."
                value={diagnosis}
                onChange={e => setDiagnosis(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          {/* Medicines Dynamic Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Prescribed Medicines &amp; Regimen
              </h3>
              <button
                type="button"
                onClick={handleAddMedicineRow}
                className="px-3 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-semibold text-xs flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Medicine</span>
              </button>
            </div>

            <div className="space-y-3">
              {medicineItems.map((med, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700">Medicine #{index + 1}</span>
                    {medicineItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMedicineRow(index)}
                        className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                        title="Remove medicine"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-slate-500 text-[11px] mb-1">Medicine Name &amp; Strength</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Paracetamol 500mg, Cetirizine 10mg..."
                        value={med.medicineName}
                        onChange={e => handleUpdateMedicineRow(index, 'medicineName', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-500 text-[11px] mb-1">Dosage Form</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 1 Tablet, 5ml"
                        value={med.dosage}
                        onChange={e => handleUpdateMedicineRow(index, 'dosage', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-500 text-[11px] mb-1">Duration</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 5 days, 14 days"
                        value={med.duration}
                        onChange={e => handleUpdateMedicineRow(index, 'duration', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-500 text-[11px] mb-1">Frequency Schedule</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 1-0-1 (Morning & Night, After food)"
                        value={med.frequency}
                        onChange={e => handleUpdateMedicineRow(index, 'frequency', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-500 text-[11px] mb-1">Specific Patient Instructions</label>
                      <input
                        type="text"
                        placeholder="e.g. Take with warm water, avoid dairy"
                        value={med.instructions}
                        onChange={e => handleUpdateMedicineRow(index, 'instructions', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Notes & Followup Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2 border-t border-slate-200">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Doctor Advice / Lifestyle Notes</label>
              <textarea
                rows={2}
                placeholder="Dietary precautions, hydration advice, red-flag symptoms to watch..."
                value={additionalNotes}
                onChange={e => setAdditionalNotes(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/20"
              ></textarea>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Recommended Follow-up Review Date</label>
              <input
                type="date"
                value={followUpDate}
                onChange={e => setFollowUpDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/20"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                * Automatically posts a reminder to both the doctor's and patient's follow-up queue
              </span>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Prescription will be digitally stamped and immediately synced.
            </span>
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save &amp; Publish Prescription</span>
            </button>
          </div>
        </form>
      ) : (
        /* History View */
        <div className="space-y-4">
          {doctorPrescriptions.map(rx => (
            <div
              key={rx.prescriptionId}
              className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-xs"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    RX #{rx.prescriptionId}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm mt-1">Patient: {rx.patientName}</h3>
                  <p className="text-xs text-slate-500">Diagnosis: <strong className="text-slate-800">{rx.diagnosis}</strong> • Date: {rx.date}</p>
                </div>

                <button
                  onClick={() => setViewingRx(rx)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Details</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
                {rx.medicines.map((m, i) => (
                  <div key={i} className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <span className="font-semibold text-slate-800">{m.medicineName}</span>
                    <span className="text-slate-500">{m.dosage} ({m.frequency})</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {doctorPrescriptions.length === 0 && (
            <div className="p-12 text-center text-slate-500 text-sm bg-white rounded-2xl border border-slate-200">
              <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="font-semibold text-slate-700">No prescriptions authored yet.</p>
            </div>
          )}
        </div>
      )}

      {/* View Modal */}
      {viewingRx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="p-5 bg-gradient-to-r from-emerald-800 to-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">Prescription #{viewingRx.prescriptionId}</h3>
                <p className="text-xs text-emerald-200">Patient: {viewingRx.patientName}</p>
              </div>
              <button onClick={() => setViewingRx(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs text-slate-700">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Diagnosis</span>
                <span className="font-bold text-slate-900 text-sm">{viewingRx.diagnosis}</span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Medicines</span>
                <div className="space-y-1.5">
                  {viewingRx.medicines.map((m, i) => (
                    <div key={i} className="p-2 bg-slate-50 border border-slate-200 rounded-lg">
                      <p className="font-bold text-slate-800">{m.medicineName} - {m.dosage}</p>
                      <p className="text-slate-600 text-[11px]">{m.frequency} for {m.duration}</p>
                      <p className="text-slate-500 italic text-[11px]">{m.instructions}</p>
                    </div>
                  ))}
                </div>
              </div>

              {viewingRx.additionalNotes && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Notes</span>
                  <p className="bg-slate-50 p-2 rounded border border-slate-200">{viewingRx.additionalNotes}</p>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 text-right">
              <button
                onClick={() => setViewingRx(null)}
                className="px-4 py-1.5 border border-slate-300 rounded-xl text-slate-700 font-semibold text-xs"
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
