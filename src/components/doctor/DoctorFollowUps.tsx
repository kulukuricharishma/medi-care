import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Clock,
  Plus,
  CheckCircle2,
  X,
  User,
  AlertCircle,
  Search,
} from 'lucide-react';

interface DoctorFollowUpsProps {
  initialPatientId?: string;
}

export const DoctorFollowUps: React.FC<DoctorFollowUpsProps> = ({ initialPatientId }) => {
  const {
    currentDoctorProfile,
    patients,
    followUps,
    scheduleFollowUp,
    markFollowUpCompleted,
    showToast,
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patientId, setPatientId] = useState(initialPatientId || patients[0]?.patientId || '');
  const [date, setDate] = useState('2026-10-12');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');

  const doctorFollowUps = followUps.filter(
    f => f.doctorId === currentDoctorProfile?.doctorId
  );

  const pendingList = doctorFollowUps.filter(f => f.status === 'Scheduled');
  const completedList = doctorFollowUps.filter(f => f.status === 'Completed');

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      showToast('Please state a reason for follow-up', 'error');
      return;
    }

    scheduleFollowUp(patientId, date, reason, notes);
    setIsModalOpen(false);
    setReason('');
    setNotes('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Post-Consultation Follow-ups</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor recovery timelines, medication compliance reviews, and proactive health checkpoints
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Follow-up</span>
        </button>
      </div>

      {/* Pending Follow-ups */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Pending &amp; Scheduled Follow-ups ({pendingList.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pendingList.map(f => (
            <div
              key={f.followUpId}
              className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900">{f.patientName}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Due: {f.date}</span>
                  </span>
                </div>

                <p className="text-xs text-slate-700 font-medium leading-relaxed">
                  Reason: {f.reason}
                </p>

                {f.notes && (
                  <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                    Clinical Notes: {f.notes}
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">ID: {f.followUpId}</span>
                <button
                  onClick={() => markFollowUpCompleted(f.followUpId)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-semibold text-xs transition-colors flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark Completed</span>
                </button>
              </div>
            </div>
          ))}

          {pendingList.length === 0 && (
            <div className="col-span-2 p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
              No pending follow-ups scheduled.
            </div>
          )}
        </div>
      </div>

      {/* Completed Follow-ups */}
      {completedList.length > 0 && (
        <div className="space-y-3 pt-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Completed Follow-ups ({completedList.length})
          </h3>

          <div className="space-y-2">
            {completedList.map(f => (
              <div
                key={f.followUpId}
                className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs text-slate-600"
              >
                <div>
                  <span className="font-bold text-slate-800 mr-2">{f.patientName}</span>
                  <span>{f.reason}</span>
                </div>
                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Completed on {f.date}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="p-5 bg-gradient-to-r from-emerald-800 to-teal-800 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Schedule Clinical Follow-up</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Patient</label>
                <select
                  value={patientId}
                  onChange={e => setPatientId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/20 bg-white"
                >
                  {patients.map(p => (
                    <option key={p.patientId} value={p.patientId}>
                      {p.name} ({p.patientId})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Follow-up Target Date</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reason / Clinical Objective</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Blood pressure titration review, check antibiotic response"
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Instructions / Specific Tests to Bring</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Bring fasting blood sugar log, bring completed CBC report"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/20"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md"
                >
                  Confirm Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
