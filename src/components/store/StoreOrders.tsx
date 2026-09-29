import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  Package,
  Truck,
  ArrowRight,
  Filter,
  Search,
  MapPin,
  CreditCard,
  User,
} from 'lucide-react';

export const StoreOrders: React.FC = () => {
  const { currentStoreProfile, orders, updateOrderStatus, showToast } = useApp();

  const [statusFilter, setStatusFilter] = useState<'All' | OrderStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const storeOrders = orders.filter(o => o.storeId === currentStoreProfile?.storeId);

  const statuses: ('All' | OrderStatus)[] = ['All', 'Pending', 'Accepted', 'Preparing', 'Ready', 'Completed', 'Cancelled'];

  const filteredOrders = storeOrders.filter(order => {
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    const matchesSearch =
      order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Accepted':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Preparing':
        return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      case 'Ready':
        return 'bg-teal-50 text-teal-800 border-teal-200';
      case 'Completed':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-800 border-rose-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">Patient Order Fulfillment</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Process incoming prescriptions, prepare medicine packaging, and mark orders ready for pickup or delivery
        </p>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search orders by ID, patient, medicine..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 w-full"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 text-xs">
          {statuses.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all ${
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

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map(order => (
          <div
            key={order.orderId}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-amber-300 transition-all p-5 space-y-4"
          >
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-900">Order #{order.orderId}</h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Placed by <strong className="text-slate-800">{order.patientName}</strong> on {order.orderDate}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 block uppercase font-semibold">Total Revenue</span>
                <span className="text-base font-black text-slate-900">₹{order.totalPrice}</span>
                <span className="block text-[10px] text-slate-500">Method: {order.paymentMethod}</span>
              </div>
            </div>

            {/* Items Table */}
            <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200/70 space-y-2 text-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Ordered Items</span>
              <div className="space-y-1.5">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-100"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-800">{item.name}</span>
                      <span className="text-slate-500 text-[11px]">(₹{item.price} each)</span>
                    </div>
                    <div className="font-mono font-bold text-slate-900">
                      Qty: {item.quantity} • Subtotal: ₹{item.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery address */}
            {order.deliveryAddress && (
              <div className="flex items-start gap-1.5 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-800">Dispatch Address: </strong>
                  {order.deliveryAddress}
                </span>
              </div>
            )}

            {/* Workflow Action Progression */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <span>Current Stage:</span>
                <span className="font-bold text-slate-800 capitalize">{order.status}</span>
              </div>

              {/* Status advancement buttons */}
              <div className="flex flex-wrap items-center gap-2">
                {order.status === 'Pending' && (
                  <>
                    <button
                      onClick={() => updateOrderStatus(order.orderId, 'Accepted')}
                      className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-colors"
                    >
                      Accept Order
                    </button>
                    <button
                      onClick={() => updateOrderStatus(order.orderId, 'Cancelled')}
                      className="px-3 py-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 font-semibold text-xs"
                    >
                      Reject Order
                    </button>
                  </>
                )}

                {order.status === 'Accepted' && (
                  <button
                    onClick={() => updateOrderStatus(order.orderId, 'Preparing')}
                    className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1"
                  >
                    <Package className="w-3.5 h-3.5" />
                    <span>Begin Preparing</span>
                  </button>
                )}

                {order.status === 'Preparing' && (
                  <button
                    onClick={() => updateOrderStatus(order.orderId, 'Ready')}
                    className="px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mark as Ready for Pickup</span>
                  </button>
                )}

                {order.status === 'Ready' && (
                  <button
                    onClick={() => updateOrderStatus(order.orderId, 'Completed')}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Complete Order &amp; Handover</span>
                  </button>
                )}

                {order.status === 'Completed' && (
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Order Fulfilled</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="p-12 text-center text-slate-500 text-sm bg-white rounded-2xl border border-slate-200">
            <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold text-slate-700">No orders match filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};
