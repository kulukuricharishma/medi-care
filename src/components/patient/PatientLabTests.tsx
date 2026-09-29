import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LabTest } from '../../types';
import {
  Activity,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  X,
  FileCheck,
  Search,
} from 'lucide-react';

export const PatientLabTests: React.FC = () => {
  const { labTests, bookLabTest } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTestForBooking, setSelectedTestForBooking] = useState<LabTest | null>(null);
  const [bookingDate, setBookingDate] = useState('2026-10-01');
  const [bookingSlot, setBookingSlot] = useState('08:00 AM - 09:00 AM (Home Pickup)');

  const filteredTests = labTests.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTestForBooking) return;
    bookLabTest(selectedTestForBooking.testId, bookingDate, bookingSlot);
    setSelectedTestForBooking(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Diagnostic &amp; Lab Tests</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Book certified pathology tests with doorstep phlebotomist sample collection or walk-in lab visit
          </p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search lab tests (e.g. CBC, Sugar, Thyroid)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-full sm:w-64"
          />
        </div>
      </div>

      {/* Tests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTests.map(test => (
          <div
            key={test.testId}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between overflow-hidden"
          >
            <div className="p-5 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                    {test.category}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm mt-1.5">{test.name}</h3>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-base font-extrabold text-indigo-700">₹{test.price}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{test.description}</p>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-start gap-1.5 text-[11px]">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <span className="leading-snug">
                    <strong className="text-slate-700">Preparation: </strong>
                    {test.preparationInstructions}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{test.availableDays}</span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span>{test.turnaroundTime}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">Verified Partner Diagnostics</span>
              <button
                onClick={() => setSelectedTestForBooking(test)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                Book Test
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Book Test Modal */}
      {selectedTestForBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="p-5 bg-gradient-to-r from-indigo-700 to-blue-700 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">Schedule Lab Diagnostic</h3>
                <p className="text-xs text-indigo-100">{selectedTestForBooking.name}</p>
              </div>
              <button
                onClick={() => setSelectedTestForBooking(null)}
                className="p-1 text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmBooking} className="p-5 space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Preparation Instructions</strong>
                  <span>{selectedTestForBooking.preparationInstructions}</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Appointment Date</label>
                <input
                  type="date"
                  required
                  value={bookingDate}
                  onChange={e => setBookingDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Time Slot &amp; Mode</label>
                <select
                  value={bookingSlot}
                  onChange={e => setBookingSlot(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                >
                  <option value="07:00 AM - 08:00 AM (Home Sample Collection)">
                    07:00 AM - 08:00 AM (Home Sample Collection)
                  </option>
                  <option value="08:00 AM - 09:00 AM (Home Sample Collection)">
                    08:00 AM - 09:00 AM (Home Sample Collection)
                  </option>
                  <option value="09:30 AM - 10:30 AM (Walk-in Diagnostic Clinic)">
                    09:30 AM - 10:30 AM (Walk-in Diagnostic Clinic)
                  </option>
                  <option value="11:00 AM - 12:00 PM (Walk-in Diagnostic Clinic)">
                    11:00 AM - 12:00 PM (Walk-in Diagnostic Clinic)
                  </option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-500 block">Total Payable</span>
                  <span className="font-bold text-slate-800">Includes phlebotomist visit</span>
                </div>
                <span className="text-base font-extrabold text-indigo-700">₹{selectedTestForBooking.price}</span>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedTestForBooking(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md"
                >
                  Confirm &amp; Book Test
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
