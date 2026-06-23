import React from 'react';
import { Activity, Stethoscope, FileText, Beaker } from 'lucide-react';

const PatientTimeline = () => {
  const events = [
    { id: 1, type: 'visit', title: 'General Consultation', date: 'Oct 15, 2026', doctor: 'Dr. Smith', desc: 'Patient reported mild chest pain.' },
    { id: 2, type: 'lab', title: 'Blood Test Results', date: 'Oct 10, 2026', doctor: 'Lab Tech', desc: 'All vitals normal, slightly elevated cholesterol.' },
    { id: 3, type: 'prescription', title: 'Prescribed Lipitor', date: 'Sep 22, 2026', doctor: 'Dr. Smith', desc: '10mg daily for 30 days.' },
    { id: 4, type: 'diagnosis', title: 'Hypertension Diagnosed', date: 'Aug 05, 2026', doctor: 'Dr. Smith', desc: 'Stage 1 hypertension.' },
  ];

  const getIcon = (type) => {
    switch(type) {
      case 'visit': return <Stethoscope className="w-4 h-4 text-blue-500" />;
      case 'lab': return <Beaker className="w-4 h-4 text-purple-500" />;
      case 'prescription': return <FileText className="w-4 h-4 text-green-500" />;
      case 'diagnosis': return <Activity className="w-4 h-4 text-red-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-800">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Patient Timeline</h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">Recent History</span>
      </div>

      <div className="relative border-l-2 border-gray-100 dark:border-slate-800 ml-3 space-y-6">
        {events.map((event) => (
          <div key={event.id} className="relative pl-6">
            <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-white dark:bg-slate-900 border-2 border-gray-100 dark:border-slate-700 flex items-center justify-center">
              {getIcon(event.type)}
            </div>
            
            <div>
              <div className="flex justify-between items-start mb-1">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{event.title}</h4>
                <span className="text-xs text-gray-500 dark:text-gray-400">{event.date}</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{event.desc}</p>
              <p className="text-xs text-primary-600 dark:text-primary-400 font-medium">By {event.doctor}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientTimeline;
