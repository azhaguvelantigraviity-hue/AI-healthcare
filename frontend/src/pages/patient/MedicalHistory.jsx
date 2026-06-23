import React from 'react';
import { Activity, AlertTriangle, Shield, Stethoscope, Clock, FileText } from 'lucide-react';

const MedicalHistory = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Activity className="w-6 h-6 mr-2 text-teal-600" /> Medical History
          </h1>
          <p className="text-gray-500 mt-1">Your comprehensive health record and medical timeline.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Quick Info */}
        <div className="lg:col-span-1 space-y-6">
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" /> Allergies
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="w-2 h-2 mt-1.5 rounded-full bg-orange-500 mr-2"></span>
                <div>
                  <p className="text-sm font-bold text-gray-900">Penicillin</p>
                  <p className="text-xs text-gray-500">Severe rash and swelling</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 mt-1.5 rounded-full bg-orange-500 mr-2"></span>
                <div>
                  <p className="text-sm font-bold text-gray-900">Peanuts</p>
                  <p className="text-xs text-gray-500">Mild hives</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-blue-500" /> Chronic Conditions
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="w-2 h-2 mt-1.5 rounded-full bg-blue-500 mr-2"></span>
                <div>
                  <p className="text-sm font-bold text-gray-900">Type 2 Diabetes</p>
                  <p className="text-xs text-gray-500">Diagnosed 2021. Managed with diet.</p>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Right Column: Timeline */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-teal-600" /> Health Timeline
            </h2>

            <div className="relative border-l-2 border-gray-100 ml-3 space-y-8 pb-4">
              
              <div className="relative pl-6">
                <div className="absolute -left-2.5 top-1 w-5 h-5 rounded-full bg-white border-2 border-teal-500 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                </div>
                <div>
                  <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded">June 15, 2026</span>
                  <h3 className="text-md font-bold text-gray-900 mt-2">Annual Physical Checkup</h3>
                  <p className="text-sm text-gray-600 mt-1">Dr. John Smith • Cardiology</p>
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm text-gray-700 flex items-start">
                    <Stethoscope className="w-4 h-4 mr-2 text-gray-400 mt-0.5 flex-shrink-0" />
                    <p>Patient is in good health. Blood pressure is normal (120/80). Recommended continuing current diet plan and exercise routine.</p>
                  </div>
                </div>
              </div>

              <div className="relative pl-6">
                <div className="absolute -left-2.5 top-1 w-5 h-5 rounded-full bg-white border-2 border-blue-500 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                </div>
                <div>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">January 10, 2026</span>
                  <h3 className="text-md font-bold text-gray-900 mt-2">Appendectomy Surgery</h3>
                  <p className="text-sm text-gray-600 mt-1">Dr. Sarah Johnson • General Surgery</p>
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm text-gray-700 flex items-start">
                    <FileText className="w-4 h-4 mr-2 text-gray-400 mt-0.5 flex-shrink-0" />
                    <p>Successful laparoscopic removal of the appendix. Patient recovered well with no post-operative complications.</p>
                  </div>
                </div>
              </div>

              <div className="relative pl-6">
                <div className="absolute -left-2.5 top-1 w-5 h-5 rounded-full bg-white border-2 border-purple-500 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                </div>
                <div>
                  <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded">November 05, 2025</span>
                  <h3 className="text-md font-bold text-gray-900 mt-2">Treatment for Severe Flu</h3>
                  <p className="text-sm text-gray-600 mt-1">Dr. Emily Chen • General Physician</p>
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm text-gray-700 flex items-start">
                    <Stethoscope className="w-4 h-4 mr-2 text-gray-400 mt-0.5 flex-shrink-0" />
                    <p>Prescribed antiviral medication and rest. Symptoms subsided after 5 days.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MedicalHistory;
