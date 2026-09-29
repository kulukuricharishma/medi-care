import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MedicalStore, Medicine } from '../../types';
import {
  Store,
  MapPin,
  Phone,
  Clock,
  Star,
  CheckCircle2,
  Search,
  X,
  Pill,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';

interface PatientMedicalStoresProps {
  onOrderMedicineFromStore?: (med: Medicine) => void;
}

export const PatientMedicalStores: React.FC<PatientMedicalStoresProps> = ({
  onOrderMedicineFromStore,
}) => {
  const { stores, medicines, placeOrder, currentPatientProfile } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStoreForModal, setSelectedStoreForModal] = useState<MedicalStore | null>(null);

  const filteredStores = stores.filter(
    s =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.owner.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStoreMedicines = (storeId: string) => {
    return medicines.filter(m => m.storeId === storeId);
  };

  const handleQuickOrder = (med: Medicine) => {
    if (onOrderMedicineFromStore) {
      onOrderMedicineFromStore(med);
    } else {
      placeOrder(med.storeId, [{ medicineId: med.medicineId, name: med.name, price: med.price, quantity: 1 }], 'Cash on Pickup');
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Partner Medical Stores &amp; Pharmacies</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Locate certified pharmaceutical stores, verify real-time stock, and place order requests
          </p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search pharmacies by name, location..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 w-full sm:w-64"
          />
        </div>
      </div>

      {/* Stores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStores.map(store => {
          const storeMeds = getStoreMedicines(store.storeId);
          const availableCount = storeMeds.filter(m => m.stock > 0).length;

          return (
            <div
              key={store.storeId}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-amber-300 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
            >
              <div className="p-5 space-y-3.5">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
                      <Store className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{store.name}</h3>
                      <p className="text-[11px] text-slate-500">License Holder: {store.owner}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {store.status}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span className="text-[11px]">{store.address}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="text-[11px] font-medium text-slate-800">{store.phone}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="text-[11px]">{store.openingHours}</span>
                  </div>
                </div>

                {/* Available medicines badge */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 text-[11px]">Listed Medicines:</span>
                  <span className="font-bold text-teal-700">{availableCount} in stock</span>
                </div>

                {/* Services preview */}
                <div className="flex flex-wrap gap-1">
                  {store.availableServices.slice(0, 2).map((srv, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[10px] font-medium border border-amber-100"
                    >
                      {srv}
                    </span>
                  ))}
                  {store.availableServices.length > 2 && (
                    <span className="px-1.5 py-0.5 text-[10px] text-slate-400">
                      +{store.availableServices.length - 2} more
                    </span>
                  )}
                </div>
              </div>

              {/* Action */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{store.rating}</span>
                </div>

                <button
                  onClick={() => setSelectedStoreForModal(store)}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  View Store &amp; Stock
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Store View Modal */}
      {selectedStoreForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200">
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-amber-700 to-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Store className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">{selectedStoreForModal.name}</h3>
                  <p className="text-xs text-amber-200">{selectedStoreForModal.address}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStoreForModal(null)}
                className="p-1 text-amber-200 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Store details info */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 text-xs grid grid-cols-1 sm:grid-cols-3 gap-3 shrink-0">
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Pharmacist</span>
                <span className="font-medium text-slate-800">{selectedStoreForModal.owner}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Direct Phone</span>
                <span className="font-medium text-slate-800">{selectedStoreForModal.phone}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Store Hours</span>
                <span className="font-medium text-slate-800">{selectedStoreForModal.openingHours}</span>
              </div>
            </div>

            {/* Medicines List in Store */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              <h4 className="font-bold text-xs uppercase text-slate-400 tracking-wider">
                Current Medicine Stock at {selectedStoreForModal.name}
              </h4>

              <div className="space-y-2">
                {getStoreMedicines(selectedStoreForModal.storeId).map(med => (
                  <div
                    key={med.medicineId}
                    className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-3 hover:border-amber-200 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-xs">{med.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                          {med.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Brand: {med.brand} • Generic: {med.genericName}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <span className="font-extrabold text-sm text-slate-900">₹{med.price}</span>
                        <span
                          className={`block text-[10px] font-bold ${
                            med.stock > 10
                              ? 'text-emerald-600'
                              : med.stock > 0
                              ? 'text-amber-600'
                              : 'text-rose-600'
                          }`}
                        >
                          {med.stock > 0 ? `${med.stock} in stock` : 'Out of stock'}
                        </span>
                      </div>

                      <button
                        disabled={med.stock <= 0}
                        onClick={() => {
                          handleQuickOrder(med);
                          setSelectedStoreForModal(null);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white font-semibold text-xs transition-colors flex items-center gap-1 shadow-xs"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Order</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 text-right shrink-0">
              <button
                onClick={() => setSelectedStoreForModal(null)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-semibold text-xs hover:bg-slate-100"
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
