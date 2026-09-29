import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MedicalReport } from '../../types';
import {
  FileText,
  Upload,
  Eye,
  Plus,
  X,
  Search,
  CheckCircle2,
  Calendar,
  Building,
} from 'lucide-react';

export const DoctorReports: React.FC = () => {
  const { reports, patients, uploadReport, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedReportView, setSelectedReportView] = useState<MedicalReport | null>(null);

  // Upload Form state
  const [patientId, setPatientId] = useState(patients[0]?.patientId || '');
  const [reportName, setReportName] = useState('');
  const [reportType, setReportType] = useState<MedicalReport['reportType']>('Lab Report');
  const [labName, setLabName] = useState('Apollo Diagnostics Centre');
  const [summary, setSummary] = useState('');
  const [findingsInput, setFindingsInput] = useState('');

  const filteredReports = reports.filter(
    r =>
      r.reportName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.labName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportName.trim() || !summary.trim()) return;

    const findingsArray = findingsInput
      .split('\n')
      .map(f => f.trim())
      .filter(f => f.length > 0);

    uploadReport({
      patientId,
      reportName,
      reportType,
      labName,
      summary,
      findings: findingsArray,
    });

    setIsUploadModalOpen(false);
    setReportName('');
    setSummary('');
    setFindingsInput('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Diagnostic Reports Review</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Evaluate pathology findings, imaging, and upload specialized clinical evaluations
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search reports or patient..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 w-full sm:w-56"
            />
          </div>

          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5 shrink-0"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Report</span>
          </button>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReports.map(rep => (
          <div
            key={rep.reportId}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between overflow-hidden"
          >
            <div className="p-5 space-y-3">
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  {rep.reportType}
                </span>
                <span className="text-[10px] font-bold text-slate-400 font-mono">{rep.reportId}</span>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-sm">{rep.reportName}</h3>
                <p className="text-xs text-emerald-700 font-semibold mt-0.5">
                  Patient: {rep.patientName}
                </p>
                <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                  <Building className="w-3 h-3 text-slate-400" />
                  <span>{rep.labName}</span>
                </p>
              </div>

              <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 line-clamp-3 leading-relaxed">
                {rep.summary}
              </p>

              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <Calendar className="w-3.5 h-3.5" />
                <span>Date Recorded: {rep.date}</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-medium text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified Diagnostic</span>
              </span>
              <button
                onClick={() => setSelectedReportView(rep)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-xs flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Inspect</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="p-5 bg-emerald-800 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Upload Clinical Diagnostic Document</h3>
              <button onClick={() => setIsUploadModalOpen(false)} className="p-1 text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Patient</label>
                  <select
                    value={patientId}
                    onChange={e => setPatientId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/20 bg-white"
                  >
                    {patients.map(p => (
                      <option key={p.patientId} value={p.patientId}>
                        {p.name} ({p.patientId})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Report Category</label>
                  <select
                    value={reportType}
                    onChange={e => setReportType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/20 bg-white"
                  >
                    <option value="Blood Report">Blood Report</option>
                    <option value="Lab Report">Lab Report</option>
                    <option value="Scan Report">Scan Report</option>
                    <option value="Doctor Report">Doctor Report</option>
                    <option value="Biochemistry">Biochemistry</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Document / Test Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2D Echocardiogram / Serum Creatinine & Electrolytes"
                  value={reportName}
                  onChange={e => setReportName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Supervising Facility / Lab</label>
                <input
                  type="text"
                  required
                  value={labName}
                  onChange={e => setLabName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Clinical Summary &amp; Findings</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Key observations, diagnostic interpretations..."
                  value={summary}
                  onChange={e => setSummary(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/20"
                ></textarea>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Discrete Quantitative Lab Values (One per line)
                </label>
                <textarea
                  rows={2}
                  placeholder="Hemoglobin: 14.2 g/dL&#10;Total Cholesterol: 195 mg/dL&#10;Fasting Glucose: 90 mg/dL"
                  value={findingsInput}
                  onChange={e => setFindingsInput(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/20 font-mono text-[11px]"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md"
                >
                  Publish Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {selectedReportView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="p-5 bg-gradient-to-r from-emerald-900 to-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">{selectedReportView.reportName}</h3>
                <p className="text-xs text-emerald-200">Patient: {selectedReportView.patientName}</p>
              </div>
              <button onClick={() => setSelectedReportView(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs text-slate-700">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-slate-400 block">Facility</span>
                  <span className="font-semibold text-slate-800">{selectedReportView.labName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Date</span>
                  <span className="font-semibold text-slate-800">{selectedReportView.date}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Summary</span>
                <p className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl text-emerald-950">
                  {selectedReportView.summary}
                </p>
              </div>

              {selectedReportView.findings && selectedReportView.findings.length > 0 && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Recorded Parameters
                  </span>
                  <div className="space-y-1.5">
                    {selectedReportView.findings.map((f, i) => (
                      <div key={i} className="p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono">
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 text-right">
              <button
                onClick={() => setSelectedReportView(null)}
                className="px-4 py-1.5 border border-slate-300 rounded-xl text-slate-700 font-semibold text-xs"
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
