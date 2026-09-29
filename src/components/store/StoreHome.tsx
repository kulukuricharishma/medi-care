import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Pill,
  ShoppingBag,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  Store,
  ChevronRight,
  Plus,
} from 'lucide-react';

interface StoreHomeProps {
  onTabChange: (tab: string) => void;
}

export const StoreHome: React.FC<StoreHomeProps> = ({ onTabChange }) => {
  const { currentStoreProfile, medicines, orders, updateOrderStatus } = useApp();

  const storeMedicines = medicines.filter(m => m.storeId === currentStoreProfile?.storeId);
  const storeOrders = orders.filter(o => o.storeId === currentStoreProfile?.storeId);

  const availableCount = storeMedicines.filter(m => m.stock > 10).length;
  const lowStockCount = storeMedicines.filter(m => m.stock > 0 && m.stock <= 10).length;
  const outOfStockCount = storeMedicines.filter(m => m.stock === 0).length;

  const pendingOrders = storeOrders.filter(o => o.status === 'Pending' || o.status === 'Preparing');
  const recentOrders = storeOrders.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-amber-700 via-orange-700 to-amber-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-xs mb-3">
            Pharmacy Operations Control
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {currentStoreProfile?.name || 'HealthPlus Pharmacy'}
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-amber-100 leading-relaxed">
            Owner: <strong className="text-white">{currentStoreProfile?.owner}</strong> • {currentStoreProfile?.address}
          </p>
          <p className="mt-1 text-xs text-white/90">
            You have <strong className="underline">{lowStockCount} medicine(s)</strong> flagged with low inventory and{' '}
            <strong className="underline">{pendingOrders.length} pending order(s)</strong> awaiting fulfillment.
          </p>
        </div>

        <div className="absolute right-0 top-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div
          onClick={() => onTabChange('medicines')}
          className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs hover:border-amber-400 transition-all cursor-pointer group"
        >
          <span className="text-[11px] font-semibold text-slate-500 block">Total Medicines</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">{storeMedicines.length}</p>
          <span className="text-[10px] text-amber-600 font-medium flex items-center gap-0.5 mt-1">
            <span>Catalog</span>
            <ChevronRight className="w-3 h-3" />
          </span>
        </div>

        <div
          onClick={() => onTabChange('inventory')}
          className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs hover:border-emerald-400 transition-all cursor-pointer group"
        >
          <span className="text-[11px] font-semibold text-slate-500 block">Sufficient Stock</span>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{availableCount}</p>
          <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-0.5 mt-1">
            <span>&gt;10 units</span>
            <ChevronRight className="w-3 h-3" />
          </span>
        </div>

        <div
          onClick={() => onTabChange('low-stock')}
          className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs hover:border-amber-400 transition-all cursor-pointer group"
        >
          <span className="text-[11px] font-semibold text-amber-600 block">Low Stock Alert</span>
          <p className="text-2xl font-bold text-amber-600 mt-1">{lowStockCount}</p>
          <span className="text-[10px] text-amber-600 font-medium flex items-center gap-0.5 mt-1">
            <span>Needs Reorder</span>
            <ChevronRight className="w-3 h-3" />
          </span>
        </div>

        <div
          onClick={() => onTabChange('inventory')}
          className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs hover:border-rose-400 transition-all cursor-pointer group"
        >
          <span className="text-[11px] font-semibold text-rose-600 block">Out of Stock</span>
          <p className="text-2xl font-bold text-rose-600 mt-1">{outOfStockCount}</p>
          <span className="text-[10px] text-rose-600 font-medium flex items-center gap-0.5 mt-1">
            <span>0 units</span>
            <ChevronRight className="w-3 h-3" />
          </span>
        </div>

        <div
          onClick={() => onTabChange('orders')}
          className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs hover:border-blue-400 transition-all cursor-pointer group"
        >
          <span className="text-[11px] font-semibold text-slate-500 block">Pending Orders</span>
          <p className="text-2xl font-bold text-blue-600 mt-1">{pendingOrders.length}</p>
          <span className="text-[10px] text-blue-600 font-medium flex items-center gap-0.5 mt-1">
            <span>In progress</span>
            <ChevronRight className="w-3 h-3" />
          </span>
        </div>

        <div
          onClick={() => onTabChange('orders')}
          className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-400 transition-all cursor-pointer group"
        >
          <span className="text-[11px] font-semibold text-slate-500 block">Total Orders</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">{storeOrders.length}</p>
          <span className="text-[10px] text-slate-500 font-medium flex items-center gap-0.5 mt-1">
            <span>All time</span>
            <ChevronRight className="w-3 h-3" />
          </span>
        </div>
      </div>

      {/* Main Grid: Recent Orders & Quick Low Stock preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders List */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">Recent Patient Orders</h3>
              </div>
              <button
                onClick={() => onTabChange('orders')}
                className="text-xs font-semibold text-amber-600 hover:underline"
              >
                View All Orders
              </button>
            </div>

            <div className="space-y-3">
              {recentOrders.map(order => (
                <div
                  key={order.orderId}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">Order #{order.orderId}</span>
                      <span className="text-slate-500">for {order.patientName}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          order.status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-700'
                            : order.status === 'Preparing' || order.status === 'Ready'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div className="text-slate-600">
                      {order.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}
                    </div>

                    <div className="text-[11px] text-slate-400">
                      {order.orderDate} • Payment: {order.paymentMethod} • Total: <strong className="text-slate-800">₹{order.totalPrice}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {order.status === 'Pending' && (
                      <button
                        onClick={() => updateOrderStatus(order.orderId, 'Accepted')}
                        className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold transition-colors shadow-xs"
                      >
                        Accept
                      </button>
                    )}
                    {order.status === 'Accepted' && (
                      <button
                        onClick={() => updateOrderStatus(order.orderId, 'Preparing')}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors shadow-xs"
                      >
                        Start Preparing
                      </button>
                    )}
                    {order.status === 'Preparing' && (
                      <button
                        onClick={() => updateOrderStatus(order.orderId, 'Ready')}
                        className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold transition-colors shadow-xs"
                      >
                        Mark Ready
                      </button>
                    )}
                    {order.status === 'Ready' && (
                      <button
                        onClick={() => updateOrderStatus(order.orderId, 'Completed')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors shadow-xs"
                      >
                        Complete Order
                      </button>
                    )}
                    {order.status === 'Completed' && (
                      <span className="font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Fulfilled</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {recentOrders.length === 0 && (
                <div className="text-center py-8 text-slate-500 text-xs">
                  <p>No patient orders yet.</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">Need to update inventory prices or stock?</span>
            <button
              onClick={() => onTabChange('medicines')}
              className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition-colors flex items-center gap-1 shadow-xs"
            >
              <span>Manage Catalog</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Low Stock Watchlist */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">Low Stock Watch</h3>
              </div>
              <button
                onClick={() => onTabChange('low-stock')}
                className="text-xs font-semibold text-rose-600 hover:underline"
              >
                Manage
              </button>
            </div>

            <div className="space-y-3">
              {storeMedicines
                .filter(m => m.stock < 10)
                .slice(0, 4)
                .map(m => (
                  <div
                    key={m.medicineId}
                    className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/40 flex items-center justify-between text-xs"
                  >
                    <div>
                      <h4 className="font-bold text-slate-900">{m.name}</h4>
                      <p className="text-[11px] text-slate-500">{m.brand} • ₹{m.price}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-extrabold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                        {m.stock} units left
                      </span>
                    </div>
                  </div>
                ))}

              {storeMedicines.filter(m => m.stock < 10).length === 0 && (
                <div className="p-8 text-center text-slate-400 text-xs">
                  All inventory items are currently above safety thresholds.
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={() => onTabChange('low-stock')}
              className="w-full py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-semibold text-xs transition-colors text-center border border-amber-200"
            >
              Open Low-Stock Restocker
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
