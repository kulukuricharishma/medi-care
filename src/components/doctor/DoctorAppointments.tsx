import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Appointment } from '../../types';
import {
  Calendar,
  Clock,
  Video,
  Building,
  CheckCircle2,
  XCircle,
  Eye,
  FileEdit,
  RotateCcw,
  X,
  Search,
  Filter,
} from 'lucide-react';

interface DoctorAppointmentsProps {
  onPrescribeForPatient?: (patientId: string) => void;
}

export const DoctorAppointments: React.FC<DoctorAppointmentsProps> = ({ onPrescribeForPatient }) => {
  const {
    currentDoctorProfile,
    appointments,
    updateAppointmentStatus,
    rescheduleAppointment,
    showToast,
  } = useApp();

  const [filterType, setFilterType] = useState<'All' | 'Today' | 'Upcoming' | 'Completed' | 'Cancelled'>('All');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [noteText, setNoteText] = useState('');
  const [rescheduleData, setRescheduleData] = useState<{ id: string; date: string; time: string } | null>(null);

  const doctorAppointments = appointments.filter(
    a => a.doctorId === currentDoctorProfile?.doctorId
  );

  const filteredAppointments = doctorAppointments.filter(apt => {
    if (filterType === 'Today') return apt.date === '2026-09-29' || apt.status === 'Upcoming';
    if (filterType === 'Upcoming') return apt.status === 'Upcoming';
    if (filterType === 'Completed') return apt.status === 'Completed';
    if (filterType === 'Cancelled') return apt.status === 'Cancelled';
    return true;
  });

  const handleSaveNotes = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppointment) return;
    updateAppointmentStatus(selectedAppointment.appointmentId, selectedAppointment.status, noteText);
    setSelectedAppointment(null);
  };

  const handleConfirmReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleData) return;
    rescheduleAppointment(rescheduleData.id, rescheduleData.date, rescheduleData.time);
    setRescheduleData(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Clinical Appointment Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage incoming consultation requests, patient queue, and clinical notes
          </p>
        </div>

        {/* Filter Pills */}
        <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
          {(['All', 'Today', 'Upcoming', 'Completed', 'Cancelled'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilterType(tab)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                filterType === tab
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-3.5">
        {filteredAppointments.map(apt => (
          <div
            key={apt.appointmentId}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-emerald-300 transition-all p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold text-sm text-slate-900">{apt.patientName}</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                  ID: {apt.patientId}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    apt.status === 'Upcoming'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : apt.status === 'Completed'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {apt.status}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                <span className="flex items-center gap-1 font-semibold text-slate-800">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  {apt.date} at {apt.time}
                </span>
                <span className="flex items-center gap-1">
                  {apt.type === 'Video Consultation' ? (
                    <Video className="w-3.5 h-3.5 text-cyan-600" />
                  ) : (
                    <Building className="w-3.5 h-3.5 text-indigo-600" />
                  )}
                  <span>{apt.type}</span>
                </span>
                <span>Fee: ₹{apt.fee}</span>
              </div>

              <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100 max-w-2xl">
                Chief Complaint: <span className="italic">"{apt.reason}"</span>
              </p>

              {apt.notes && (
                <p className="text-[11px] text-blue-900 bg-blue-50 p-2 rounded-lg border border-blue-200">
                  Doctor Notes: {apt.notes}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2 shrink-0 self-end md:self-center">
              {apt.status === 'Upcoming' && (
                <>
                  <button
                    onClick={() => updateAppointmentStatus(apt.appointmentId, 'Completed')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors"
                  >
                    Mark Completed
                  </button>

                  {onPrescribeForPatient && (
                    <button
                      onClick={() => onPrescribeForPatient(apt.patientId)}
                      className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-xs shadow-xs transition-colors"
                    >
                      Prescribe
                    </button>
                  )}

                  <button
                    onClick={() =>
                      setRescheduleData({
                        id: apt.appointmentId,
                        date: apt.date,
                        time: apt.time,
                      })
                    }
                    className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold"
                    title="Reschedule appointment"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => updateAppointmentStatus(apt.appointmentId, 'Cancelled')}
                    className="px-2.5 py-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-semibold"
                    title="Reject or cancel appointment"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                  </button>
                </>
              )}

              <button
                onClick={() => {
                  setSelectedAppointment(apt);
                  setNoteText(apt.notes || '');
                }}
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1.5"
              >
                <FileEdit className="w-3.5 h-3.5" />
                <span>Notes</span>
              </button>
            </div>
          </div>
        ))}

        {filteredAppointments.length === 0 && (
          <div className="p-12 text-center text-slate-500 text-sm bg-white rounded-2xl border border-slate-200">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold text-slate-700">No appointments under "{filterType}".</p>
          </div>
        )}
      </div>

      {/* Add / Edit Notes Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">Consultation Notes</h3>
                <p className="text-[11px] text-slate-400">Patient: {selectedAppointment.patientName}</p>
              </div>
              <button onClick={() => setSelectedAppointment(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNotes} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Physician's Consultation Observations
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Record vitals, diagnosis, recommendations, tests to order..."
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedAppointment(null)}
                  className="px-3.5 py-1.5 border border-slate-300 rounded-lg text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold"
                >
                  Save Notes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="p-4 bg-emerald-700 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Reschedule Slot</h3>
              <button onClick={() => setRescheduleData(null)} className="p-1 text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmReschedule} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">New Date</label>
                <input
                  type="date"
                  required
                  value={rescheduleData.date}
                  onChange={e => setRescheduleData({ ...rescheduleData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">New Time Slot</label>
                <select
                  value={rescheduleData.time}
                  onChange={e => setRescheduleData({ ...rescheduleData, time: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
                >
                  <option value="09:30 AM">09:30 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="01:00 PM">01:00 PM</option>
                  <option value="04:30 PM">04:30 PM</option>
                  <option value="05:30 PM">05:30 PM</option>
                  <option value="06:30 PM">06:30 PM</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRescheduleData(null)}
                  className="px-3.5 py-1.5 border border-slate-300 rounded-lg text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold"
                >
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
