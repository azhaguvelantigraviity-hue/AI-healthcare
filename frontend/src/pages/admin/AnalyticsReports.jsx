import React from 'react';
import { BarChart3, TrendingUp, Users, Activity } from 'lucide-react';

const AnalyticsReports = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <BarChart3 className="w-6 h-6 mr-2 text-teal-600" /> Analytics & Reports
          </h1>
          <p className="text-gray-500 mt-1">System-wide statistics and performance metrics.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Patients</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">1,284</h3>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm text-green-600 font-medium mt-4 flex items-center">
            <TrendingUp className="w-4 h-4 mr-1" /> +12% from last month
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">AI Tokens Used</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">45.2k</h3>
            </div>
            <div className="p-3 bg-teal-50 rounded-lg text-teal-600">
              <Activity className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm text-green-600 font-medium mt-4 flex items-center">
            <TrendingUp className="w-4 h-4 mr-1" /> Gemini API active
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center min-h-[300px] flex flex-col items-center justify-center">
         <BarChart3 className="w-16 h-16 text-gray-200 mb-4" />
         <h2 className="text-xl font-bold text-gray-700">Detailed Charts Coming Soon</h2>
         <p className="text-gray-500 max-w-md mt-2">Integration with Chart.js to visualize patient growth, appointment frequency, and AI feature usage over time.</p>
      </div>
    </div>
  );
};

export default AnalyticsReports;
