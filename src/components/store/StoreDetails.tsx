import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Store,
  MapPin,
  Phone,
  Clock,
  User,
  CheckCircle2,
  Plus,
  X,
  ShieldCheck,
} from 'lucide-react';

export const StoreDetails: React.FC = () => {
  const { currentStoreProfile, updateStoreDetails, showToast } = useApp();

  const [name, setName] = useState(currentStoreProfile?.name || 'HealthPlus Pharmacy');
  const [owner, setOwner] = useState(currentStoreProfile?.owner || 'Ramesh Patel (D.Pharm)');
  const [address, setAddress] = useState(currentStoreProfile?.address || '');
  const [phone, setPhone] = useState(currentStoreProfile?.phone || '');
  const [openingHours, setOpeningHours] = useState(currentStoreProfile?.openingHours || '');
  const [servicesInput, setServicesInput] = useState(
    currentStoreProfile?.availableServices.join(', ') || ''
  );
  const [status, setStatus] = useState<'Open' | 'Closed'>(currentStoreProfile?.status || 'Open');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const services = servicesInput
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    updateStoreDetails({
      name,
      owner,
      address,
      phone,
      openingHours,
      availableServices: services,
      status,
    });
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Medical Store &amp; Pharmacy Details</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Public pharmacy identity, licensed pharmacist details, dispatch contact, and operational schedule
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-700 to-slate-900 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-amber-300">
              <Store className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white">{name}</h3>
              <p className="text-xs text-amber-200">Registered Pharmacy Branch #{currentStoreProfile?.storeId}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                status === 'Open' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300'
              }`}
            >
              {status} for Orders
            </span>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Pharmacy / Store Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Registered Owner / Pharmacist</label>
              <input
                type="text"
                required
                value={owner}
                onChange={e => setOwner(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500/20"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Physical Address &amp; Landmark</label>
            <textarea
              rows={2}
              required
              value={address}
              onChange={e => setAddress(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500/20"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Contact Phone</label>
              <input
                type="text"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Operating Hours</label>
              <input
                type="text"
                required
                value={openingHours}
                onChange={e => setOpeningHours(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500/20 bg-white"
              >
                <option value="Open">Open (Taking Orders)</option>
                <option value="Closed">Closed (Paused)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Available Services (Comma separated)
            </label>
            <input
              type="text"
              value={servicesInput}
              onChange={e => setServicesInput(e.target.value)}
              placeholder="e.g. Express Home Delivery, Cold Chain Storage, Prescription Verification"
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500/20"
            />
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save Pharmacy Details</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
