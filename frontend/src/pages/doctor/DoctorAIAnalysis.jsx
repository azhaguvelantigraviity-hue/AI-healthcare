import React from 'react';
import { Activity, AlertTriangle, ShieldCheck, Cpu, Users, ArrowUpRight, ArrowDownRight, Scale, HeartPulse, ShieldAlert, CheckCircle2 } from 'lucide-react';

const DoctorAIAnalysis = () => {
  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      
      {/* Premium Header */}
      <div className="relative overflow-hidden bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex justify-between items-center z-10">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-full blur-3xl opacity-60 z-0"></div>
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-40 h-40 bg-gradient-to-tr from-teal-50 to-emerald-50 rounded-full blur-2xl opacity-60 z-0"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <Cpu className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">AI Health Analysis</h1>
              <p className="text-gray-500 font-medium mt-1">Automated clinical insights, population health metrics, and triage.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Population BMI AI Report */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden relative">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
          <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><Scale className="w-5 h-5" /></div>
          <h2 className="text-xl font-bold text-gray-900">Population BMI Analysis</h2>
          <span className="ml-auto px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full uppercase tracking-wider border border-indigo-100">AI Generated Report</span>
        </div>
        
        <div className="p-8">
          {/* Executive Summary */}
          <div className="mb-8 p-6 bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl"></div>
            <h3 className="font-bold text-lg text-indigo-300 mb-2 uppercase tracking-widest flex items-center gap-2"><Activity className="w-5 h-5" /> Executive Summary</h3>
            <p className="text-slate-200 leading-relaxed text-sm md:text-base">
              The clinic's current population of <strong>142 patients</strong> maintains an average BMI of <strong>24.5</strong>. 
              While the majority (59.9%) maintain a healthy weight, there is a significant subset (31.7%) falling into overweight and obese categories, alongside an 8.5% underweight population. Targeted clinical interventions are recommended for both high-risk outlier groups.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Cohort Stats */}
            <div className="space-y-4">
              <h4 className="font-bold text-gray-900 flex items-center gap-2"><Users className="w-5 h-5 text-gray-400" /> Patient Cohorts</h4>
              
              <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-emerald-200 bg-emerald-50/30 transition-colors">
                <div>
                  <p className="font-bold text-gray-900">Normal Weight</p>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Healthy Range</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-emerald-600">85</p>
                  <p className="text-xs text-emerald-600 font-bold">59.9%</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-amber-200 bg-amber-50/30 transition-colors">
                <div>
                  <p className="font-bold text-gray-900">Overweight</p>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">At Risk</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-amber-600">32</p>
                  <p className="text-xs text-amber-600 font-bold">22.5%</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-red-200 bg-red-50/30 transition-colors relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
                <div>
                  <p className="font-bold text-gray-900">Obese</p>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">High Risk</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-red-600">13</p>
                  <p className="text-xs text-red-600 font-bold">9.2%</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-blue-200 bg-blue-50/30 transition-colors relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
                <div>
                  <p className="font-bold text-gray-900">Underweight</p>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Moderate Risk</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-blue-600">12</p>
                  <p className="text-xs text-blue-600 font-bold">8.5%</p>
                </div>
              </div>
            </div>

            {/* AI Insights & Actions */}
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><HeartPulse className="w-5 h-5 text-rose-500" /> Associated Health Risks</h4>
                <div className="p-5 bg-rose-50 border border-rose-100 rounded-xl">
                  <p className="text-sm text-rose-800 font-medium mb-3">Based on the prevalence of the 45 overweight/obese patients, proactively screen for:</p>
                  <ul className="grid grid-cols-2 gap-2 text-sm text-rose-900 font-semibold">
                    <li className="flex items-center gap-2"><AlertTriangle className="w-3.5 h-3.5" /> Hypertension</li>
                    <li className="flex items-center gap-2"><AlertTriangle className="w-3.5 h-3.5" /> Type 2 Diabetes</li>
                    <li className="flex items-center gap-2"><AlertTriangle className="w-3.5 h-3.5" /> Sleep Apnea</li>
                    <li className="flex items-center gap-2"><AlertTriangle className="w-3.5 h-3.5" /> Osteoarthritis</li>
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-indigo-500" /> Prioritized Physician Actions</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</div>
                    <p className="text-sm text-gray-700"><strong>Flag Health Records:</strong> Systematically flag the 13 obese and 12 underweight patients in the EHR for mandatory review.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</div>
                    <p className="text-sm text-gray-700"><strong>Proactive Outreach:</strong> Initiate automated secure messaging to the 45 high-weight patients offering nutritional counseling.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">3</div>
                    <p className="text-sm text-gray-700"><strong>Audit Lab Orders:</strong> Review recent lab work and proactively order overdue metabolic, glycemic, or thyroid panels.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Existing Widgets in smaller grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><Activity className="w-24 h-24 text-blue-900" /></div>
          <h2 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center">
            <Activity className="w-6 h-6 mr-2 text-blue-500" /> 
            AI Symptom Triage Queue
          </h2>
          <div className="space-y-4 relative z-10">
            <div className="p-5 border border-red-100 bg-white hover:bg-red-50/50 rounded-2xl transition-colors shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-gray-900">Bob Smith</h3>
                <span className="px-3 py-1 bg-red-100 text-red-700 text-[10px] uppercase tracking-widest font-black rounded-full border border-red-200">Critical</span>
              </div>
              <p className="text-sm text-gray-600"><strong>Detection:</strong> Severe chest pain and shortness of breath. Suggests immediate cardiology review.</p>
            </div>
            <div className="p-5 border border-amber-100 bg-white hover:bg-amber-50/50 rounded-2xl transition-colors shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-gray-900">Alice Ray</h3>
                <span className="px-3 py-1 bg-amber-100 text-amber-700 text-[10px] uppercase tracking-widest font-black rounded-full border border-amber-200">Moderate</span>
              </div>
              <p className="text-sm text-gray-600"><strong>Detection:</strong> Persistent fever for 4 days with dry cough. Possible viral infection.</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><ShieldCheck className="w-24 h-24 text-emerald-900" /></div>
          <h2 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center">
            <ShieldCheck className="w-6 h-6 mr-2 text-emerald-500" /> 
            Automated Report Summaries
          </h2>
          <div className="text-center py-16 px-4 bg-gray-50/50 border-2 border-dashed border-gray-200 rounded-2xl relative z-10">
             <Cpu className="w-10 h-10 text-gray-300 mx-auto mb-3" />
             <p className="text-gray-500 font-medium text-sm">Upload a patient's medical PDF to generate an instant AI summary.</p>
             <button className="mt-4 bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 px-5 py-2 rounded-xl text-sm font-bold shadow-sm transition-all">Browse Files</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorAIAnalysis;
