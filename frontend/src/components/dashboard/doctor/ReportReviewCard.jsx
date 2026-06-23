import React, { useState } from 'react';
import { Eye, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const ReportReviewCard = () => {
  const [reports, setReports] = useState([
    { id: 1, patient: 'Alice Johnson', type: 'Blood Test', date: 'Today, 09:30 AM', status: 'Pending', critical: false },
    { id: 2, patient: 'Bob Smith', type: 'MRI Scan', date: 'Yesterday', status: 'Pending', critical: true },
  ]);

  const handleReview = (id) => {
    setReports(reports.filter(r => r.id !== id));
    toast.success('Report marked as reviewed');
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-800">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Report Review</h2>
        <span className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 text-xs font-semibold px-2 py-1 rounded-full">
          {reports.length} Pending
        </span>
      </div>

      <div className="space-y-3">
        {reports.length === 0 ? (
          <div className="text-center text-sm text-gray-500 py-6">All caught up! No reports to review.</div>
        ) : (
          reports.map((report) => (
            <div key={report.id} className="p-4 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/30">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{report.patient}</h4>
                  {report.critical && <AlertCircle className="w-4 h-4 text-red-500" />}
                </div>
                <span className="text-xs text-gray-500">{report.date}</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">{report.type}</p>
              
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-1 text-xs font-medium py-1.5 px-3 rounded-lg bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-600">
                  <Eye className="w-3.5 h-3.5" /> View
                </button>
                <button 
                  onClick={() => handleReview(report.id)}
                  className="flex-1 flex items-center justify-center gap-1 text-xs font-medium py-1.5 px-3 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/40"
                >
                  <CheckCircle className="w-3.5 h-3.5" /> Mark Reviewed
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReportReviewCard;
