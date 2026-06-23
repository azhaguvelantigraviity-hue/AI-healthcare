import React from 'react';
import { AlertTriangle, FileText, Activity } from 'lucide-react';
import { Skeleton } from '../../ui/Skeleton';

const ActionItems = ({ loading }) => {
  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-800">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Action Items</h2>
        <div className="space-y-3">
          {[1, 2].map(i => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-800">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Action Items</h2>
      
      <div className="space-y-3">
        {/* Urgent Item */}
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-red-900 dark:text-red-300">Critical Lab Results</h4>
            <p className="text-xs text-red-700 dark:text-red-400/80 mt-1">2 patients have abnormal lab results requiring immediate review.</p>
            <button className="text-xs font-medium text-red-600 dark:text-red-400 mt-2 hover:underline">Review Now</button>
          </div>
        </div>

        {/* Normal Item */}
        <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300">Prescription Renewals</h4>
            <p className="text-xs text-blue-700 dark:text-blue-400/80 mt-1">3 pending requests for medication refills.</p>
            <button className="text-xs font-medium text-blue-600 dark:text-blue-400 mt-2 hover:underline">Manage Requests</button>
          </div>
        </div>

        {/* Low Priority Item */}
        <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-white dark:bg-slate-700 text-gray-600 dark:text-gray-400 shadow-sm">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-200">System Maintenance</h4>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Scheduled for tonight at 2:00 AM.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionItems;
