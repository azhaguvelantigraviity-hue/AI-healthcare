import React, { useState } from 'react';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';

const ClinicalNotesCard = () => {
  const [notes, setNotes] = useState({
    subjective: '',
    objective: '',
    assessment: '',
    plan: ''
  });

  const handleChange = (e) => {
    setNotes({ ...notes, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // Backend API simulation
    toast.success('Clinical notes saved successfully');
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-800">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">SOAP Notes</h2>
        <button 
          onClick={handleSave}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-medium rounded-lg transition-colors"
        >
          <Save className="w-3.5 h-3.5" /> Save Notes
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Subjective</label>
          <textarea 
            name="subjective"
            value={notes.subjective}
            onChange={handleChange}
            className="w-full text-sm p-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
            rows="2"
            placeholder="Patient's symptoms and history..."
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Objective</label>
          <textarea 
            name="objective"
            value={notes.objective}
            onChange={handleChange}
            className="w-full text-sm p-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
            rows="2"
            placeholder="Physical exam findings, vitals..."
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Assessment</label>
          <input 
            type="text"
            name="assessment"
            value={notes.assessment}
            onChange={handleChange}
            className="w-full text-sm p-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
            placeholder="Diagnosis / medical impression..."
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Plan</label>
          <textarea 
            name="plan"
            value={notes.plan}
            onChange={handleChange}
            className="w-full text-sm p-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
            rows="2"
            placeholder="Treatment plan, next steps..."
          />
        </div>
      </div>
    </div>
  );
};

export default ClinicalNotesCard;
