import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MedicalReport } from '../../types';
import {
  FileText,
  Download,
  Eye,
  Activity,
  CheckCircle2,
  Calendar,
  X,
  FileCheck,
  Search,
  Filter,
} from 'lucide-react';

export const PatientReports: React.FC = () => {
  const { currentPatientProfile, reports, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [viewingReport, setViewingReport] = useState<MedicalReport | null>(null);

  const patientReports = reports.filter(r => r.patientId === currentPatientProfile?.patientId);

  const reportTypes = ['All', 'Blood Report', 'Lab Report', 'Scan Report', 'Doctor Report'];

  const filteredReports = patientReports.filter(r => {
    const matchesSearch =
      r.reportName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.labName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'All' || r.reportType === selectedType;
    return matchesSearch && matchesType;
  });

  const handleDownloadReport = (rep: MedicalReport) => {
    showToast(`Downloading certified PDF: "${rep.reportName}.pdf"`, 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Medical Reports &amp; Diagnostics</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified laboratory tests, blood panels, electrocardiograms, and clinical imaging records
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search reports by test name, lab..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 w-full sm:w-60"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {reportTypes.map(t => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedType === t
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reports Table / Card List */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="divide-y divide-slate-100">
          {filteredReports.map(rep => (
            <div
              key={rep.reportId}
              className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-900">{rep.reportName}</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {rep.reportType}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{rep.status}</span>
                    </span>
                  </div>

                  <p className="text-xs text-slate-500">
                    Source: <strong className="text-slate-700">{rep.labName}</strong>
                    {rep.doctorName && ` • Supervised by ${rep.doctorName}`}
                  </p>

                  <p className="text-xs text-slate-600 line-clamp-1 max-w-2xl">{rep.summary}</p>

                  <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>Date: {rep.date}</span>
                    </span>
                    <span>Document ID: {rep.reportId}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                <button
                  onClick={() => setViewingReport(rep)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Details</span>
                </button>

                <button
                  onClick={() => handleDownloadReport(rep)}
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          ))}

          {filteredReports.length === 0 && (
            <div className="p-12 text-center text-slate-500 text-sm">
              <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="font-semibold text-slate-700">No medical reports found.</p>
              <p className="text-xs text-slate-400 mt-1">Book lab tests or request clinic upload to view results here.</p>
            </div>
          )}
        </div>
      </div>

      {/* Report View Modal */}
      {viewingReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="p-5 bg-gradient-to-r from-indigo-900 to-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-300 tracking-wider">
                  {viewingReport.reportType}
                </span>
                <h3 className="font-bold text-sm text-white">{viewingReport.reportName}</h3>
              </div>
              <button
                onClick={() => setViewingReport(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-2 gap-2 text-slate-700">
                <div>
                  <span className="text-[10px] text-slate-400 block">Patient Name</span>
                  <span className="font-bold">{viewingReport.patientName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Date of Test</span>
                  <span className="font-bold">{viewingReport.date}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Accredited Laboratory</span>
                  <span className="font-medium text-slate-800">{viewingReport.labName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Verification Status</span>
                  <span className="font-bold text-emerald-600">{viewingReport.status} (Digitally Signed)</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Clinical Summary &amp; Interpretation
                </span>
                <p className="bg-blue-50/60 border border-blue-200 p-3 rounded-xl text-blue-950 leading-relaxed">
                  {viewingReport.summary}
                </p>
              </div>

              {viewingReport.findings && viewingReport.findings.length > 0 && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">
                    Lab Indices &amp; Quantitative Values
                  </span>
                  <div className="space-y-1.5">
                    {viewingReport.findings.map((f, i) => (
                      <div
                        key={i}
                        className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between"
                      >
                        <span className="font-medium text-slate-800">{f}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => handleDownloadReport(viewingReport)}
                className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Certified PDF</span>
              </button>
              <button
                onClick={() => setViewingReport(null)}
                className="px-4 py-1.5 rounded-lg border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-100"
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
