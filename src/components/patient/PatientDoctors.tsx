import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DoctorProfile } from '../../types';
import {
  Search,
  Filter,
  Star,
  MapPin,
  Clock,
  Calendar,
  Video,
  UserCheck,
  CheckCircle,
  X,
  Building,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

export const PatientDoctors: React.FC = () => {
  const { doctors, bookAppointment } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState<DoctorProfile | null>(null);

  // Booking Form State
  const [bookingDate, setBookingDate] = useState('2026-10-02');
  const [bookingSlot, setBookingSlot] = useState('');
  const [bookingType, setBookingType] = useState<'In-Person' | 'Video Consultation'>('In-Person');
  const [bookingReason, setBookingReason] = useState('');

  // Extract specializations
  const specializations = ['All', ...new Set(doctors.map(d => d.specialization))];

  // Filtering
  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.hospital.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'All' || doc.specialization === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const handleOpenBooking = (doc: DoctorProfile) => {
    setSelectedDoctorForBooking(doc);
    setBookingSlot(doc.availableSlots[0] || '10:00 AM');
    setBookingReason('');
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctorForBooking) return;

    bookAppointment({
      doctorId: selectedDoctorForBooking.doctorId,
      date: bookingDate,
      time: bookingSlot,
      type: bookingType,
      reason: bookingReason || 'General medical consultation',
    });

    setSelectedDoctorForBooking(null);
  };

  return (
    <div className="space-y-6">
      {/* Title & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Find Specialists &amp; Doctors</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Book in-person or video consultations with accredited medical professionals
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by doctor, specialty, clinic..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-full sm:w-64"
            />
          </div>

          {/* Specialty filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {specializations.map(spec => (
              <button
                key={spec}
                onClick={() => setSelectedSpecialty(spec)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedSpecialty === spec
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {spec}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Doctor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map(doc => (
          <div
            key={doc.doctorId}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between overflow-hidden"
          >
            <div className="p-5">
              {/* Doctor Header */}
              <div className="flex items-start gap-3.5">
                <img
                  src={doc.avatar}
                  alt={doc.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-slate-100 shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-slate-900 text-sm truncate">{doc.name}</h3>
                    <UserCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  </div>
                  <p className="text-xs font-semibold text-blue-600 truncate">{doc.specialization}</p>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <GraduationCap className="w-3 h-3 text-slate-400" />
                    <span className="truncate">{doc.qualification}</span>
                  </p>
                </div>
              </div>

              {/* Badges & Meta */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-slate-400 text-[11px]">Experience</span>
                  <span className="font-semibold text-slate-800">{doc.experience}</span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-slate-400 text-[11px]">Hospital / Clinic</span>
                  <span className="font-medium text-slate-800 text-right truncate max-w-[180px]">
                    {doc.hospital}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-slate-400 text-[11px]">Consultation Fee</span>
                  <span className="font-bold text-emerald-700">₹{doc.consultationFee}</span>
                </div>

                <div className="flex items-start gap-1.5 text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{doc.availability}</span>
                </div>
              </div>

              {/* Available Slots Preview */}
              <div className="mt-3">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">
                  Available Slots Today / Next:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {doc.availableSlots.slice(0, 3).map((slot, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-medium"
                    >
                      {slot}
                    </span>
                  ))}
                  {doc.availableSlots.length > 3 && (
                    <span className="px-1.5 py-0.5 text-[10px] text-slate-400">
                      +{doc.availableSlots.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Card Action */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{doc.rating}</span>
                <span className="text-slate-400 font-normal text-[11px]">({doc.reviewsCount})</span>
              </div>

              <button
                onClick={() => handleOpenBooking(doc)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                Book Appointment
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredDoctors.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
          <p className="text-slate-500 text-sm">No doctors matched your criteria.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedSpecialty('All');
            }}
            className="mt-2 text-xs text-blue-600 font-semibold underline"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Booking Modal */}
      {selectedDoctorForBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-700 to-cyan-700 text-white p-5 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={selectedDoctorForBooking.avatar}
                  alt={selectedDoctorForBooking.name}
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-white/30"
                />
                <div>
                  <h3 className="font-bold text-base">{selectedDoctorForBooking.name}</h3>
                  <p className="text-xs text-blue-100">
                    {selectedDoctorForBooking.specialization} • {selectedDoctorForBooking.hospital}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDoctorForBooking(null)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleConfirmBooking} className="p-5 space-y-4 text-xs">
              {/* Type Selection */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Consultation Mode</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setBookingType('In-Person')}
                    className={`p-2.5 rounded-xl border text-center font-semibold transition-all flex items-center justify-center gap-2 ${
                      bookingType === 'In-Person'
                        ? 'border-blue-600 bg-blue-50 text-blue-800 ring-2 ring-blue-500/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <Building className="w-4 h-4 text-blue-600" />
                    <span>In-Person Clinic Visit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBookingType('Video Consultation')}
                    className={`p-2.5 rounded-xl border text-center font-semibold transition-all flex items-center justify-center gap-2 ${
                      bookingType === 'Video Consultation'
                        ? 'border-blue-600 bg-blue-50 text-blue-800 ring-2 ring-blue-500/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <Video className="w-4 h-4 text-blue-600" />
                    <span>Video Consultation</span>
                  </button>
                </div>
              </div>

              {/* Date & Time Slot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Select Date</label>
                  <input
                    type="date"
                    required
                    value={bookingDate}
                    onChange={e => setBookingDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Available Slot</label>
                  <select
                    value={bookingSlot}
                    onChange={e => setBookingSlot(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                  >
                    {selectedDoctorForBooking.availableSlots.map(slot => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Reason for Appointment */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Reason for Visit / Symptoms
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Describe your current symptoms or purpose of checkup..."
                  value={bookingReason}
                  onChange={e => setBookingReason(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                ></textarea>
              </div>

              {/* Consultation Fee Summary */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-500 block">Consultation Fee</span>
                  <span className="font-bold text-slate-800">Standard Specialist Rate</span>
                </div>
                <div className="text-right">
                  <span className="text-base font-extrabold text-emerald-600">
                    ₹{selectedDoctorForBooking.consultationFee}
                  </span>
                  <span className="block text-[10px] text-slate-400">Payable via billing</span>
                </div>
              </div>

              {/* Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedDoctorForBooking(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md transition-all"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
