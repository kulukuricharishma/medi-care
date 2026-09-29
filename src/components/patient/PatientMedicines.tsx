import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Medicine, MedicalStore } from '../../types';
import {
  Search,
  Filter,
  Pill,
  Store,
  MapPin,
  Phone,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShoppingBag,
  X,
  CreditCard,
  Plus,
  Minus,
  Sparkles,
} from 'lucide-react';

interface PatientMedicinesProps {
  initialSearchQuery?: string;
  onClearInitialQuery?: () => void;
}

export const PatientMedicines: React.FC<PatientMedicinesProps> = ({
  initialSearchQuery = '',
  onClearInitialQuery,
}) => {
  const { medicines, stores, placeOrder, currentPatientProfile } = useApp();

  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [selectedStore, setSelectedStore] = useState('All');

  // Ordering Modal state
  const [orderingMedicine, setOrderingMedicine] = useState<Medicine | null>(null);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'Cash on Pickup' | 'Online Paid' | 'Card on Delivery'>('Online Paid');
  const [deliveryAddress, setDeliveryAddress] = useState(currentPatientProfile?.address || '');

  useEffect(() => {
    if (initialSearchQuery) {
      setSearchQuery(initialSearchQuery);
    }
  }, [initialSearchQuery]);

  const categories = ['All', 'Pain Relief', 'Allergy', 'Antibiotic', 'Gastrointestinal', 'Cardiology', 'Vitamins', 'General'];

  // Enrich medicines with store address and phone
  const enrichedMedicines = medicines.map(med => {
    const store = stores.find(s => s.storeId === med.storeId);
    return {
      ...med,
      storeAddress: store ? store.address : 'Indiranagar, Bengaluru',
      storePhone: store ? store.phone : '+91 98333 44556',
      storeStatus: store ? store.status : 'Open',
    };
  });

  const filteredMedicines = enrichedMedicines.filter(med => {
    const matchesSearch =
      med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.storeName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || med.category === selectedCategory;
    const matchesAvailability = !onlyAvailable || med.stock > 0;
    const matchesStore = selectedStore === 'All' || med.storeName === selectedStore;

    return matchesSearch && matchesCategory && matchesAvailability && matchesStore;
  });

  const handleOpenOrder = (med: Medicine) => {
    setOrderingMedicine(med);
    setOrderQuantity(1);
    setDeliveryAddress(currentPatientProfile?.address || '');
  };

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderingMedicine) return;

    placeOrder(
      orderingMedicine.storeId,
      [
        {
          medicineId: orderingMedicine.medicineId,
          name: orderingMedicine.name,
          price: orderingMedicine.price,
          quantity: orderQuantity,
        },
      ],
      paymentMethod,
      deliveryAddress
    );

    setOrderingMedicine(null);
    if (onClearInitialQuery) onClearInitialQuery();
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">Find &amp; Order Medicines</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Real-time pharmacy stock lookup, generic alternatives, price comparisons, and direct orders
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by brand, generic formula (e.g. Paracetamol 500mg, Cetirizine)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 w-full"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedStore}
              onChange={e => setSelectedStore(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-teal-500/20 text-slate-700"
            >
              <option value="All">All Partner Pharmacies</option>
              {stores.map(s => (
                <option key={s.storeId} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>

            <label className="flex items-center gap-1.5 text-xs text-slate-700 font-medium px-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={e => setOnlyAvailable(e.target.checked)}
                className="rounded text-teal-600 focus:ring-teal-500"
              />
              <span>In Stock Only</span>
            </label>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Medicines Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMedicines.map(med => (
          <div
            key={med.medicineId}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-teal-300 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
          >
            <div className="p-5 space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100">
                    {med.category}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm mt-1.5">{med.name}</h3>
                  <p className="text-[11px] text-slate-500 italic mt-0.5">{med.genericName}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-lg font-black text-slate-900">₹{med.price}</span>
                  <span className="block text-[10px] text-slate-400">per pack</span>
                </div>
              </div>

              {/* Medicine details */}
              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-slate-400 text-[11px]">Brand / Mfr:</span>
                  <span className="font-semibold text-slate-800">{med.brand}</span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-slate-400 text-[11px]">Form &amp; Rx:</span>
                  <span>
                    {med.dosageForm} • {med.prescriptionRequired ? 'Prescription Req.' : 'OTC'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-slate-400 text-[11px]">Expiry:</span>
                  <span className="font-mono text-slate-700">{med.expiryDate}</span>
                </div>
              </div>

              {/* Pharmacy Store Location & Stock info */}
              <div className="space-y-1.5 text-xs pt-1">
                <div className="flex items-start gap-1.5 font-semibold text-slate-800">
                  <Store className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                  <span>{med.storeName}</span>
                </div>

                <div className="flex items-start gap-1.5 text-[11px] text-slate-500 pl-5">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                  <span className="line-clamp-1">{med.storeAddress}</span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 pl-5">
                  <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>{med.storePhone}</span>
                </div>
              </div>

              {/* Stock status indicator */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">Live Inventory:</span>
                {med.stock > 10 ? (
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>In Stock ({med.stock} units)</span>
                  </span>
                ) : med.stock > 0 ? (
                  <span className="inline-flex items-center gap-1 text-amber-700 font-bold text-[11px]">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                    <span>Low Stock (Only {med.stock} left)</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-rose-600 font-bold text-[11px]">
                    <XCircle className="w-3.5 h-3.5 text-rose-500" />
                    <span>Out of Stock</span>
                  </span>
                )}
              </div>
            </div>

            {/* Action */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Home Delivery Available</span>
              <button
                disabled={med.stock <= 0}
                onClick={() => handleOpenOrder(med)}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-40 disabled:hover:bg-teal-600 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{med.stock > 0 ? 'Order / Request' : 'Notify Stock'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredMedicines.length === 0 && (
        <div className="p-12 text-center text-slate-500 text-sm bg-white rounded-2xl border border-slate-200">
          <Pill className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="font-semibold text-slate-700">No medicines found for "{searchQuery}".</p>
          <p className="text-xs text-slate-400 mt-1">Try searching for "Paracetamol", "Cetirizine", or "Omeprazole".</p>
        </div>
      )}

      {/* Order Modal */}
      {orderingMedicine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="p-5 bg-gradient-to-r from-teal-700 to-cyan-800 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">Place Pharmacy Order</h3>
                <p className="text-xs text-teal-100">{orderingMedicine.storeName}</p>
              </div>
              <button
                onClick={() => setOrderingMedicine(null)}
                className="p-1 text-teal-200 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmOrder} className="p-5 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900">{orderingMedicine.name}</h4>
                  <p className="text-[11px] text-slate-500">{orderingMedicine.brand} • ₹{orderingMedicine.price} per unit</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Available Units</span>
                  <span className="font-bold text-emerald-600">{orderingMedicine.stock} in stock</span>
                </div>
              </div>

              {/* Quantity selection */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Quantity</label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={orderQuantity <= 1}
                    onClick={() => setOrderQuantity(prev => Math.max(1, prev - 1))}
                    className="w-8 h-8 rounded-lg border border-slate-300 flex items-center justify-center text-slate-700 disabled:opacity-30 hover:bg-slate-50"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-extrabold text-sm w-8 text-center">{orderQuantity}</span>
                  <button
                    type="button"
                    disabled={orderQuantity >= orderingMedicine.stock}
                    onClick={() => setOrderQuantity(prev => Math.min(orderingMedicine.stock, prev + 1))}
                    className="w-8 h-8 rounded-lg border border-slate-300 flex items-center justify-center text-slate-700 disabled:opacity-30 hover:bg-slate-50"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] text-slate-500 ml-2">
                    Subtotal: <strong>₹{orderingMedicine.price * orderQuantity}</strong>
                  </span>
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Delivery / Pickup Address
                </label>
                <textarea
                  rows={2}
                  required
                  value={deliveryAddress}
                  onChange={e => setDeliveryAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                ></textarea>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Online Paid', 'Cash on Pickup', 'Card on Delivery'] as const).map(method => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`p-2 rounded-xl border text-[11px] text-center font-medium transition-all ${
                        paymentMethod === method
                          ? 'border-teal-600 bg-teal-50 text-teal-800 ring-2 ring-teal-500/20 font-bold'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {/* Order Total summary */}
              <div className="p-3 bg-teal-50/60 border border-teal-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-teal-700 block">Total Due</span>
                  <span className="text-slate-600 text-[11px]">Free express dispatch</span>
                </div>
                <span className="text-base font-extrabold text-teal-900">
                  ₹{orderingMedicine.price * orderQuantity}
                </span>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setOrderingMedicine(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold shadow-md"
                >
                  Confirm &amp; Place Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
