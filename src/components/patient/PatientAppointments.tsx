import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Appointment } from '../../types';
import {
  Calendar,
  Clock,
  Video,
  Building,
  UserCheck,
  RotateCcw,
  XCircle,
  Eye,
  CheckCircle2,
  X,
  FileText,
  AlertTriangle,
} from 'lucide-react';

export const PatientAppointments: React.FC = () => {
  const {
    currentPatientProfile,
    appointments,
    cancelAppointment,
    rescheduleAppointment,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'Upcoming' | 'Completed' | 'Cancelled'>('Upcoming');
  const [selectedAppointmentForView, setSelectedAppointmentForView] = useState<Appointment | null>(null);
  const [rescheduleData, setRescheduleData] = useState<{ id: string; date: string; time: string } | null>(null);

  const patientAppointments = appointments.filter(
    a => a.patientId === currentPatientProfile?.patientId
  );

  const upcomingList = patientAppointments.filter(a => a.status === 'Upcoming');
  const completedList = patientAppointments.filter(a => a.status === 'Completed');
  const cancelledList = patientAppointments.filter(a => a.status === 'Cancelled');

  const displayedList =
    activeFilter === 'Upcoming'
      ? upcomingList
      : activeFilter === 'Completed'
      ? completedList
      : cancelledList;

  const handleConfirmReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleData) return;
    rescheduleAppointment(rescheduleData.id, rescheduleData.date, rescheduleData.time);
    setRescheduleData(null);
  };

  return (
    <div className="space-y-6">
      {/* Title & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">My Appointments</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage upcoming consultations, review past clinical notes, or reschedule visits
          </p>
        </div>

        {/* Status Tabs */}
        <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => setActiveFilter('Upcoming')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
              activeFilter === 'Upcoming'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Upcoming ({upcomingList.length})
          </button>
          <button
            onClick={() => setActiveFilter('Completed')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
              activeFilter === 'Completed'
                ? 'bg-white text-emerald-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Completed ({completedList.length})
          </button>
          <button
            onClick={() => setActiveFilter('Cancelled')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
              activeFilter === 'Cancelled'
                ? 'bg-white text-rose-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cancelled ({cancelledList.length})
          </button>
        </div>
      </div>

      {/* Appointment Cards List */}
      <div className="space-y-4">
        {displayedList.map(apt => (
          <div
            key={apt.appointmentId}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            {/* Left: Doctor & Details */}
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm">{apt.doctorName}</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  {apt.doctorSpecialization}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    apt.status === 'Upcoming'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : apt.status === 'Completed'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {apt.status}
                </span>
              </div>

              <p className="text-xs text-slate-600 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                <span>{apt.doctorHospital}</span>
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
                <div className="flex items-center gap-1 font-medium text-slate-800">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  <span>{apt.date}</span>
                </div>
                <div className="flex items-center gap-1 font-medium text-slate-800">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <span>{apt.time}</span>
                </div>
                <div className="flex items-center gap-1">
                  {apt.type === 'Video Consultation' ? (
                    <Video className="w-3.5 h-3.5 text-cyan-600" />
                  ) : (
                    <Building className="w-3.5 h-3.5 text-indigo-600" />
                  )}
                  <span>{apt.type}</span>
                </div>
                <div className="font-semibold text-emerald-700">Fee: ₹{apt.fee}</div>
              </div>

              <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-lg border border-slate-100 max-w-xl">
                Reason: "{apt.reason}"
              </p>
            </div>

            {/* Right: Actions */}
            <div className="flex flex-wrap items-center gap-2 shrink-0 self-end md:self-center">
              <button
                onClick={() => setSelectedAppointmentForView(apt)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View</span>
              </button>

              {apt.status === 'Upcoming' && (
                <>
                  <button
                    onClick={() =>
                      setRescheduleData({
                        id: apt.appointmentId,
                        date: apt.date,
                        time: apt.time,
                      })
                    }
                    className="px-3 py-1.5 rounded-lg border border-blue-200 hover:bg-blue-50 text-blue-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reschedule</span>
                  </button>

                  <button
                    onClick={() => cancelAppointment(apt.appointmentId)}
                    className="px-3 py-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Cancel</span>
                  </button>
                </>
              )}
            </div>
          </div>
        ))}

        {displayedList.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-600 text-sm font-semibold">No {activeFilter.toLowerCase()} appointments.</p>
            <p className="text-xs text-slate-400 mt-1">Book consultations with top-rated doctors across any specialty.</p>
          </div>
        )}
      </div>

      {/* View Appointment Modal */}
      {selectedAppointmentForView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="p-5 bg-gradient-to-r from-slate-900 to-cyan-950 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">Appointment Details</h3>
                <p className="text-[11px] text-cyan-200">ID: {selectedAppointmentForView.appointmentId}</p>
              </div>
              <button
                onClick={() => setSelectedAppointmentForView(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs text-slate-700">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Doctor Profile</span>
                <p className="font-bold text-sm text-slate-900">{selectedAppointmentForView.doctorName}</p>
                <p className="text-xs text-blue-600 font-medium">{selectedAppointmentForView.doctorSpecialization}</p>
                <p className="text-[11px] text-slate-500">{selectedAppointmentForView.doctorHospital}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-2.5 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 block">Date &amp; Time</span>
                  <span className="font-bold text-slate-800">
                    {selectedAppointmentForView.date} at {selectedAppointmentForView.time}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 block">Mode</span>
                  <span className="font-bold text-slate-800">{selectedAppointmentForView.type}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Stated Reason</span>
                <p className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 italic">
                  "{selectedAppointmentForView.reason}"
                </p>
              </div>

              {selectedAppointmentForView.notes && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Doctor's Clinical Notes / Preparation
                  </span>
                  <p className="bg-blue-50/70 p-2.5 rounded-lg border border-blue-200 text-blue-900">
                    {selectedAppointmentForView.notes}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-slate-500">Consultation Fee:</span>
                <span className="font-extrabold text-sm text-emerald-700">₹{selectedAppointmentForView.fee}</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 text-right">
              <button
                onClick={() => setSelectedAppointmentForView(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 text-white font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="p-4 bg-blue-600 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Reschedule Appointment</h3>
              <button onClick={() => setRescheduleData(null)} className="p-1 text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmReschedule} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select New Date</label>
                <input
                  type="date"
                  required
                  value={rescheduleData.date}
                  onChange={e => setRescheduleData({ ...rescheduleData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select New Time Slot</label>
                <select
                  value={rescheduleData.time}
                  onChange={e => setRescheduleData({ ...rescheduleData, time: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                >
                  <option value="09:30 AM">09:30 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="01:00 PM">01:00 PM</option>
                  <option value="03:30 PM">03:30 PM</option>
                  <option value="05:00 PM">05:00 PM</option>
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
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold"
                >
                  Confirm Reschedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
