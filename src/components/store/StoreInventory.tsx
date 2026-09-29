import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Medicine } from '../../types';
import {
  Search,
  Filter,
  ArrowUpDown,
  Plus,
  Minus,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Archive,
} from 'lucide-react';

export const StoreInventory: React.FC = () => {
  const { currentStoreProfile, medicines, updateStock, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Available' | 'Low Stock' | 'Out of Stock'>('All');
  const [sortBy, setSortBy] = useState<'name' | 'stock' | 'price' | 'expiry'>('stock');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const storeMedicines = medicines.filter(m => m.storeId === currentStoreProfile?.storeId);

  const getStatus = (stock: number): 'Available' | 'Low Stock' | 'Out of Stock' => {
    if (stock > 10) return 'Available';
    if (stock > 0) return 'Low Stock';
    return 'Out of Stock';
  };

  const filtered = storeMedicines.filter(m => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.genericName.toLowerCase().includes(searchQuery.toLowerCase());
    const status = getStatus(m.stock);
    const matchesStatus = statusFilter === 'All' || status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'name') {
      return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    }
    if (sortBy === 'stock') {
      return sortOrder === 'asc' ? a.stock - b.stock : b.stock - a.stock;
    }
    if (sortBy === 'price') {
      return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
    }
    if (sortBy === 'expiry') {
      return sortOrder === 'asc' ? a.expiryDate.localeCompare(b.expiryDate) : b.expiryDate.localeCompare(a.expiryDate);
    }
    return 0;
  });

  const handleStockDelta = (med: Medicine, delta: number) => {
    const newStock = Math.max(0, med.stock + delta);
    updateStock(med.medicineId, newStock);
  };

  const handleSortToggle = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">Inventory &amp; Stock Ledger</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Real-time batch tracking, stock replenishment, unit pricing, and expiry monitoring
        </p>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search inventory items..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 w-full"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-semibold text-[11px]">Filter:</span>
          {(['All', 'Available', 'Low Stock', 'Out of Stock'] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                statusFilter === s
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold select-none">
              <tr>
                <th
                  onClick={() => handleSortToggle('name')}
                  className="py-3.5 px-4 cursor-pointer hover:text-slate-800"
                >
                  <div className="flex items-center gap-1">
                    <span>Medicine</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSortToggle('stock')}
                  className="py-3.5 px-4 cursor-pointer hover:text-slate-800"
                >
                  <div className="flex items-center gap-1">
                    <span>Stock</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSortToggle('price')}
                  className="py-3.5 px-4 cursor-pointer hover:text-slate-800"
                >
                  <div className="flex items-center gap-1">
                    <span>Price</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSortToggle('expiry')}
                  className="py-3.5 px-4 cursor-pointer hover:text-slate-800"
                >
                  <div className="flex items-center gap-1">
                    <span>Expiry</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Quick Stock Adjustment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sorted.map(med => {
                const status = getStatus(med.stock);
                return (
                  <tr key={med.medicineId} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-bold text-slate-900 block">{med.name}</span>
                        <span className="text-[11px] text-slate-500">{med.brand} • {med.dosageForm}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-extrabold text-sm text-slate-900 font-mono">
                        {med.stock}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      ₹{med.price}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      {med.expiryDate}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          status === 'Available'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : status === 'Low Stock'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {status === 'Available' ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : status === 'Low Stock' ? (
                          <AlertTriangle className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        <span>{status}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                        <button
                          onClick={() => handleStockDelta(med, -5)}
                          disabled={med.stock < 5}
                          className="px-2 py-1 bg-white hover:bg-slate-200 text-slate-700 disabled:opacity-30 rounded-lg text-[10px] font-bold shadow-2xs"
                          title="Deduct 5"
                        >
                          -5
                        </button>
                        <button
                          onClick={() => handleStockDelta(med, -1)}
                          disabled={med.stock <= 0}
                          className="w-6 h-6 bg-white hover:bg-slate-200 text-slate-700 disabled:opacity-30 rounded-lg flex items-center justify-center font-bold shadow-2xs"
                          title="Deduct 1"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center font-bold font-mono text-slate-800">
                          {med.stock}
                        </span>
                        <button
                          onClick={() => handleStockDelta(med, 1)}
                          className="w-6 h-6 bg-white hover:bg-slate-200 text-slate-700 rounded-lg flex items-center justify-center font-bold shadow-2xs"
                          title="Add 1"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleStockDelta(med, 10)}
                          className="px-2 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[10px] font-bold shadow-2xs"
                          title="Restock 10"
                        >
                          +10
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {sorted.length === 0 && (
          <div className="p-12 text-center text-slate-500 text-sm">
            <Archive className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold text-slate-700">No inventory records found.</p>
          </div>
        )}
      </div>
    </div>
  );
};
