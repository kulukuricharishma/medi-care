import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Stethoscope,
  Building,
  GraduationCap,
  Clock,
  Star,
  DollarSign,
  UserCheck,
  ShieldCheck,
} from 'lucide-react';

export const DoctorProfileView: React.FC = () => {
  const { currentDoctorProfile } = useApp();

  if (!currentDoctorProfile) return null;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Doctor Professional Profile</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Accreditation credentials, practice schedule, affiliated medical centers, and consultation rates
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-cyan-900 p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={currentDoctorProfile.avatar}
              alt={currentDoctorProfile.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white/30"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg text-white">{currentDoctorProfile.name}</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-400/30 text-emerald-100 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified Practitioner</span>
                </span>
              </div>
              <p className="text-xs text-emerald-100 font-medium">{currentDoctorProfile.specialization}</p>
              <p className="text-[11px] text-emerald-200 mt-0.5">{currentDoctorProfile.qualification}</p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-emerald-200 block">Consultation Fee</span>
            <span className="text-2xl font-black text-white">₹{currentDoctorProfile.consultationFee}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs text-slate-700">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Clinical Experience</span>
              <p className="font-bold text-slate-900 text-sm">{currentDoctorProfile.experience}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Affiliated Hospital</span>
              <p className="font-bold text-slate-900 text-sm truncate">{currentDoctorProfile.hospital}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Patient Rating</span>
              <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                <Star className="w-4 h-4 fill-current" />
                <span>{currentDoctorProfile.rating}</span>
                <span className="text-slate-400 font-normal text-xs">({currentDoctorProfile.reviewsCount} reviews)</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Weekly Consultation Hours &amp; Shift
            </span>
            <p className="font-semibold text-slate-800 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>{currentDoctorProfile.availability}</span>
            </p>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Active Daily Slot Roster
            </span>
            <div className="flex flex-wrap gap-2">
              {currentDoctorProfile.availableSlots.map((slot, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200 text-xs"
                >
                  {slot}
                </span>
              ))}
            </div>
          </div>

          {currentDoctorProfile.about && (
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Physician Bio &amp; Clinical Focus
              </span>
              <p className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed">
                {currentDoctorProfile.about}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
