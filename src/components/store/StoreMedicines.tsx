import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Medicine } from '../../types';
import {
  Pill,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  XCircle,
  X,
  Filter,
  AlertTriangle,
} from 'lucide-react';

export const StoreMedicines: React.FC = () => {
  const {
    currentStoreProfile,
    medicines,
    addMedicine,
    updateMedicine,
    deleteMedicine,
    showToast,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [genericName, setGenericName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState<Medicine['category']>('General');
  const [price, setPrice] = useState(50);
  const [stock, setStock] = useState(20);
  const [expiryDate, setExpiryDate] = useState('2027-12');
  const [availability, setAvailability] = useState(true);
  const [dosageForm, setDosageForm] = useState('Tablet');
  const [prescriptionRequired, setPrescriptionRequired] = useState(false);

  const storeMedicines = medicines.filter(m => m.storeId === currentStoreProfile?.storeId);

  const categories = ['All', 'Pain Relief', 'Allergy', 'Antibiotic', 'Gastrointestinal', 'Cardiology', 'Vitamins', 'General'];

  const filteredMedicines = storeMedicines.filter(m => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || m.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleOpenAddModal = () => {
    setEditingMedicine(null);
    setName('');
    setGenericName('');
    setBrand('');
    setCategory('General');
    setPrice(50);
    setStock(20);
    setExpiryDate('2027-12');
    setAvailability(true);
    setDosageForm('Tablet');
    setPrescriptionRequired(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (med: Medicine) => {
    setEditingMedicine(med);
    setName(med.name);
    setGenericName(med.genericName);
    setBrand(med.brand);
    setCategory(med.category);
    setPrice(med.price);
    setStock(med.stock);
    setExpiryDate(med.expiryDate);
    setAvailability(med.availability);
    setDosageForm(med.dosageForm);
    setPrescriptionRequired(med.prescriptionRequired);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingMedicine) {
      updateMedicine(editingMedicine.medicineId, {
        name,
        genericName,
        brand,
        category,
        price: Number(price),
        stock: Number(stock),
        expiryDate,
        availability: Number(stock) > 0 ? availability : false,
        dosageForm,
        prescriptionRequired,
      });
    } else {
      addMedicine({
        name,
        genericName,
        brand,
        category,
        price: Number(price),
        stock: Number(stock),
        expiryDate,
        availability: Number(stock) > 0 ? availability : false,
        dosageForm,
        prescriptionRequired,
      });
    }

    setIsModalOpen(false);
  };

  const handleToggleAvailability = (med: Medicine) => {
    updateMedicine(med.medicineId, { availability: !med.availability });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Medicine Master Catalog</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Add pharmaceuticals, update batch pricing, toggle availability, and maintain store inventory
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Medicine</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search catalog by name, brand, formula..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 w-full"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto py-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Medicines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMedicines.map(med => (
          <div
            key={med.medicineId}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-amber-300 transition-all flex flex-col justify-between overflow-hidden"
          >
            <div className="p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    {med.category}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm mt-1.5">{med.name}</h3>
                  <p className="text-[11px] text-slate-500 italic mt-0.5">{med.genericName}</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-slate-900">₹{med.price}</span>
                  <span className="block text-[10px] text-slate-400">Unit Retail</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">Brand:</span>
                  <span className="font-semibold text-slate-800">{med.brand}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">Form:</span>
                  <span>{med.dosageForm} ({med.prescriptionRequired ? 'Rx Req.' : 'OTC'})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">Expiry:</span>
                  <span className="font-mono text-slate-800">{med.expiryDate}</span>
                </div>
              </div>

              {/* Stock & Availability switches */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <span className="font-semibold text-slate-700">
                  Stock:{' '}
                  <strong
                    className={
                      med.stock > 10
                        ? 'text-emerald-600'
                        : med.stock > 0
                        ? 'text-amber-600'
                        : 'text-rose-600'
                    }
                  >
                    {med.stock} units
                  </strong>
                </span>

                <button
                  type="button"
                  onClick={() => handleToggleAvailability(med)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                    med.availability && med.stock > 0
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}
                >
                  {med.availability && med.stock > 0 ? 'Active / Visible' : 'Disabled'}
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => handleOpenEditModal(med)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1"
              >
                <Edit2 className="w-3 h-3" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => deleteMedicine(med.medicineId)}
                className="px-3 py-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 font-semibold text-xs transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredMedicines.length === 0 && (
        <div className="p-12 text-center text-slate-500 text-sm bg-white rounded-2xl border border-slate-200">
          <Pill className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="font-semibold text-slate-700">No medicines found.</p>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="p-5 bg-gradient-to-r from-amber-700 to-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">
                {editingMedicine ? `Edit ${editingMedicine.name}` : 'Add New Medicine to Catalog'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-amber-200 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Medicine Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Paracetamol 500mg"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Generic Formula</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acetaminophen"
                    value={genericName}
                    onChange={e => setGenericName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Brand / Mfr</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Crocin / GSK"
                    value={brand}
                    onChange={e => setBrand(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500/20 bg-white"
                  >
                    {categories.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Retail Price (₹)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={price}
                    onChange={e => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={stock}
                    onChange={e => setStock(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Expiry Date</label>
                  <input
                    type="text"
                    placeholder="YYYY-MM"
                    value={expiryDate}
                    onChange={e => setExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Dosage Form</label>
                  <select
                    value={dosageForm}
                    onChange={e => setDosageForm(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500/20 bg-white"
                  >
                    <option value="Tablet">Tablet</option>
                    <option value="Capsule">Capsule</option>
                    <option value="Syrup">Syrup</option>
                    <option value="Injection">Injection</option>
                    <option value="Ointment">Ointment</option>
                  </select>
                </div>

                <div className="pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={prescriptionRequired}
                      onChange={e => setPrescriptionRequired(e.target.checked)}
                      className="rounded text-amber-600 focus:ring-amber-500"
                    />
                    <span className="font-semibold text-slate-700">Prescription Required</span>
                  </label>
                </div>
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
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold shadow-md"
                >
                  {editingMedicine ? 'Update Medicine' : 'Save to Catalog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
