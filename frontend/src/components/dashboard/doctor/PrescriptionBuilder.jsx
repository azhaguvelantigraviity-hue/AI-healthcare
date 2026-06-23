import React, { useState } from 'react';
import { Plus, Download, X, Stethoscope, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const PrescriptionBuilder = () => {
  const [meds, setMeds] = useState([]);
  const [form, setForm] = useState({ name: '', dosage: '', frequency: '', duration: '' });

  const handleAdd = () => {
    if (!form.name || !form.dosage) {
      toast.error('Medicine name and dosage are required');
      return;
    }
    setMeds([...meds, { ...form, id: Date.now() }]);
    setForm({ name: '', dosage: '', frequency: '', duration: '' });
  };

  const handleRemove = (id) => {
    setMeds(meds.filter(m => m.id !== id));
  };

  const handleDownload = () => {
    if (meds.length === 0) {
      toast.error('Add at least one medicine');
      return;
    }
    toast.success('Prescription PDF generating...');
  };

  return (
    <div className="bg-white rounded-3xl flex flex-col h-full max-h-[85vh]">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 pr-16 shrink-0">
        <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
          <div className="p-2 bg-teal-50 rounded-lg"><Stethoscope className="w-5 h-5 text-teal-600" /></div>
          Rx Builder
        </h2>
        <p className="text-sm text-gray-500 mt-1 font-medium">Add medications to generate a new digital prescription.</p>
      </div>

      {/* Body */}
      <div className="p-6 overflow-y-auto flex-1 bg-gray-50/50">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm mb-6">
          <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Add Medicine</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <input 
                type="text" 
                placeholder="Medicine Name (e.g. Amoxicillin)" 
                value={form.name}
                onChange={(e) => setForm({...form, name: e.target.value})}
                className="w-full text-sm p-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all font-medium"
              />
            </div>
            <div>
              <input 
                type="text" 
                placeholder="Dosage (500mg)" 
                value={form.dosage}
                onChange={(e) => setForm({...form, dosage: e.target.value})}
                className="w-full text-sm p-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all font-medium"
              />
            </div>
            <div>
              <input 
                type="text" 
                placeholder="Frequency (1x daily)" 
                value={form.frequency}
                onChange={(e) => setForm({...form, frequency: e.target.value})}
                className="w-full text-sm p-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all font-medium"
              />
            </div>
            <div className="col-span-2 flex gap-3">
              <input 
                type="text" 
                placeholder="Duration (7 days)" 
                value={form.duration}
                onChange={(e) => setForm({...form, duration: e.target.value})}
                className="flex-1 text-sm p-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all font-medium"
              />
              <button 
                onClick={handleAdd}
                className="bg-gray-900 hover:bg-gray-800 text-white px-5 rounded-xl flex items-center justify-center transition-all shadow-md hover:shadow-lg active:scale-95"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center justify-between">
            Prescription List
            <span className="bg-teal-100 text-teal-700 py-0.5 px-2.5 rounded-full text-xs">{meds.length} items</span>
          </h3>
          
          {meds.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-2xl bg-white">
              <p className="text-sm font-medium text-gray-500">No medicines added yet.</p>
              <p className="text-xs text-gray-400 mt-1">Use the form above to add medications.</p>
            </div>
          ) : (
            meds.map((med) => (
              <div key={med.id} className="group flex justify-between items-center p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:border-teal-200 transition-all">
                <div className="flex items-start gap-3">
                  <div className="mt-1 w-2 h-2 rounded-full bg-teal-500"></div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">{med.name}</div>
                    <div className="text-xs font-medium text-gray-500 mt-0.5 flex gap-2">
                      <span>{med.dosage}</span>
                      <span className="text-gray-300">•</span>
                      <span>{med.frequency}</span>
                      <span className="text-gray-300">•</span>
                      <span>{med.duration}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => handleRemove(med.id)} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-xl transition-all opacity-0 group-hover:opacity-100 focus:opacity-100">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-5 border-t border-gray-100 shrink-0 flex gap-4 bg-white rounded-b-3xl">
        <button 
          onClick={handleDownload}
          className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-3.5 rounded-2xl text-sm font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" /> Save & Issue Prescription
        </button>
        <button 
          onClick={handleDownload}
          className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 px-6 py-3.5 rounded-2xl text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2"
        >
          <Download className="w-5 h-5" /> PDF
        </button>
      </div>
    </div>
  );
};

export default PrescriptionBuilder;
