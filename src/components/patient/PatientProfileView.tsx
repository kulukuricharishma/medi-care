import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Heart,
  AlertTriangle,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Activity,
} from 'lucide-react';

export const PatientProfileView: React.FC = () => {
  const { currentPatientProfile } = useApp();

  if (!currentPatientProfile) return null;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Patient Health Profile</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Authorized personal health identification, emergency contacts, and vital medical disclosures
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-700 via-cyan-700 to-teal-700 p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-white text-2xl font-bold">
              {currentPatientProfile.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white">{currentPatientProfile.name}</h3>
              <p className="text-xs text-blue-100">
                Patient ID: {currentPatientProfile.patientId} • Blood Group:{' '}
                <strong className="text-white">{currentPatientProfile.bloodGroup}</strong>
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 font-semibold">
                  {currentPatientProfile.gender}, {currentPatientProfile.age} yrs
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-400/30 text-emerald-100 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified Patient</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-6 space-y-6 text-xs">
          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Phone Contact</span>
              <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-blue-600" />
                <span>{currentPatientProfile.phone}</span>
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Email Address</span>
              <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-600" />
                <span>{currentPatientProfile.email}</span>
              </p>
            </div>

            <div className="sm:col-span-2 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Residential Address</span>
              <p className="font-medium text-slate-800 flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                <span>{currentPatientProfile.address}</span>
              </p>
            </div>
          </div>

          {/* Medical Alerts & Conditions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-rose-900">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Known Allergies (Clinical Warning)</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                {currentPatientProfile.allergies?.join(', ') || 'No recorded allergies'}
              </p>
              <span className="text-[10px] text-rose-700 block">
                * Automatically flagged to consulting doctors during prescription drafting
              </span>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-blue-900">
                <Activity className="w-4 h-4 text-blue-600" />
                <span>Chronic Health Conditions</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                {currentPatientProfile.chronicConditions?.join(', ') || 'None recorded'}
              </p>
              <span className="text-[10px] text-blue-700 block">
                * Maintained under ongoing clinical observation
              </span>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                Emergency Next of Kin Contact
              </span>
              <p className="font-bold text-slate-900">{currentPatientProfile.emergencyContact}</p>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 font-semibold text-slate-700">
              Primary Contact
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
