import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bill } from '../../types';
import {
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  Download,
  Search,
  Filter,
  Receipt,
  Sparkles,
} from 'lucide-react';

export const PatientBilling: React.FC = () => {
  const { currentPatientProfile, bills, payBill, showToast } = useApp();

  const [filterStatus, setFilterStatus] = useState<'All' | 'Paid' | 'Pending' | 'Cancelled'>('All');
  const [filterType, setFilterType] = useState('All');

  const patientBills = bills.filter(b => b.patientId === currentPatientProfile?.patientId);

  const filteredBills = patientBills.filter(b => {
    const matchesStatus = filterStatus === 'All' || b.status === filterStatus;
    const matchesType = filterType === 'All' || b.type === filterType;
    return matchesStatus && matchesType;
  });

  const totalSpent = patientBills
    .filter(b => b.status === 'Paid')
    .reduce((sum, b) => sum + b.amount, 0);

  const totalPending = patientBills
    .filter(b => b.status === 'Pending')
    .reduce((sum, b) => sum + b.amount, 0);

  const handleDownloadInvoice = (bill: Bill) => {
    showToast(`Downloading invoice ${bill.invoiceNumber}.pdf`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">Billing &amp; Payments</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Consolidated invoices for doctor consultations, diagnostic lab tests, and pharmacy orders
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Total Paid Invoices</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">₹{totalSpent}</p>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Settled transactions</span>
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Pending Dues</span>
          <p className="text-2xl font-bold text-amber-600 mt-1">₹{totalPending}</p>
          <span className="text-[11px] text-amber-600 font-semibold flex items-center gap-1 mt-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Awaiting settlement</span>
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Total Invoices</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">{patientBills.length}</p>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">All healthcare categories</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs py-1">
          <span className="text-slate-400 font-semibold text-[11px] mr-1">Status:</span>
          {(['All', 'Pending', 'Paid', 'Cancelled'] as const).map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                filterStatus === s
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-400 font-semibold text-[11px] mr-1">Type:</span>
          {['All', 'Consultation', 'Lab Test', 'Medicine Order'].map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                filterType === t
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Bills Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
              <tr>
                <th className="py-3.5 px-4">Invoice #</th>
                <th className="py-3.5 px-4">Service Description</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBills.map(bill => (
                <tr key={bill.billId} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-semibold text-slate-700">
                    {bill.invoiceNumber}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    {bill.referenceTitle}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                      {bill.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">{bill.date}</td>
                  <td className="py-3.5 px-4 font-extrabold text-slate-900">₹{bill.amount}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        bill.status === 'Paid'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : bill.status === 'Pending'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {bill.status === 'Paid' ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : bill.status === 'Pending' ? (
                        <Clock className="w-3 h-3" />
                      ) : (
                        <XCircle className="w-3 h-3" />
                      )}
                      <span>{bill.status}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {bill.status === 'Pending' ? (
                        <button
                          onClick={() => payBill(bill.billId)}
                          className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold shadow-xs transition-colors"
                        >
                          Pay Now
                        </button>
                      ) : (
                        <button
                          onClick={() => handleDownloadInvoice(bill)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Download Receipt"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBills.length === 0 && (
          <div className="p-12 text-center text-slate-500 text-sm">
            <Receipt className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold text-slate-700">No invoices match selected criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};
