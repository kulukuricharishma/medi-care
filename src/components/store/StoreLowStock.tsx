import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Medicine } from '../../types';
import {
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Package,
  Plus,
  ArrowRight,
  TrendingDown,
  ShieldAlert,
} from 'lucide-react';

export const StoreLowStock: React.FC = () => {
  const { currentStoreProfile, medicines, updateStock, showToast } = useApp();

  const storeMedicines = medicines.filter(m => m.storeId === currentStoreProfile?.storeId);
  const lowStockThreshold = 10;
  const lowStockItems = storeMedicines.filter(m => m.stock < lowStockThreshold);

  const handleQuickRestock = (med: Medicine, units: number) => {
    updateStock(med.medicineId, med.stock + units);
    showToast(`Restocked ${units} units for ${med.name}`, 'success');
  };

  const handleRestockAll = () => {
    lowStockItems.forEach(med => {
      updateStock(med.medicineId, med.stock + 50);
    });
    showToast(`Restocked 50 units for all ${lowStockItems.length} low-stock items!`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Low Stock Early Warning Center</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
              Threshold: &lt;10 Units
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated alerts to prevent pharmacy stockouts and keep high-demand therapeutics available
          </p>
        </div>

        {lowStockItems.length > 0 && (
          <button
            onClick={handleRestockAll}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Restock All (+50 each)</span>
          </button>
        )}
      </div>

      {/* Warning Banner */}
      {lowStockItems.length > 0 ? (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900">
            <strong className="block font-bold">Action Required: {lowStockItems.length} Critical Stock Warnings</strong>
            <span>
              The items below have fallen below the critical buffer threshold. Patients searching for these items will receive low availability warnings.
            </span>
          </div>
        </div>
      ) : (
        <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
          <h3 className="font-bold text-sm text-emerald-900">All Inventory Levels Are Healthy</h3>
          <p className="text-xs text-emerald-700">No medicines are currently running low on stock.</p>
        </div>
      )}

      {/* Low Stock Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lowStockItems.map(med => (
          <div
            key={med.medicineId}
            className="bg-white rounded-2xl border-2 border-amber-300 shadow-sm p-5 flex flex-col justify-between overflow-hidden relative"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                    {med.stock === 0 ? 'Out of Stock' : 'Depleting Fast'}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm mt-1.5">{med.name}</h3>
                  <p className="text-[11px] text-slate-500 italic mt-0.5">{med.genericName}</p>
                </div>
                <div className="text-right">
                  <span className="text-base font-extrabold text-slate-900">₹{med.price}</span>
                </div>
              </div>

              {/* Warning box */}
              <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-amber-800 font-semibold flex items-center gap-1">
                    <TrendingDown className="w-3.5 h-3.5 text-amber-600" />
                    <span>Current Inventory:</span>
                  </span>
                  <strong className="text-sm font-black text-rose-600 font-mono">
                    {med.stock} remaining
                  </strong>
                </div>
                <p className="text-[10px] text-amber-700">
                  Brand: {med.brand} • Expiry: {med.expiryDate}
                </p>
              </div>
            </div>

            {/* Quick Restock Action Bar */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <span className="text-[11px] font-semibold text-slate-500">Quick Restock:</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleQuickRestock(med, 20)}
                  className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs border border-amber-200 transition-colors"
                >
                  +20
                </button>
                <button
                  onClick={() => handleQuickRestock(med, 50)}
                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
                >
                  +50
                </button>
                <button
                  onClick={() => handleQuickRestock(med, 100)}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
                >
                  +100
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
