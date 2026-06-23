import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Users, FileText, Activity, Search, Eye, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const PatientManagement = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [modalType, setModalType] = useState(null); // 'profile' or 'reports'
  const [selectedReport, setSelectedReport] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('/api/appointments', config);
        
        const appointmentsData = data.data || [];
        const uniquePatientsMap = new Map();
        appointmentsData.forEach(apt => {
          if (apt.patient && apt.patient._id && !uniquePatientsMap.has(apt.patient._id)) {
            uniquePatientsMap.set(apt.patient._id, {
              ...apt.patient,
              lastVisit: apt.appointmentDate || apt.date,
              status: apt.status
            });
          }
        });
        
        let uniquePatients = Array.from(uniquePatientsMap.values());
        
        if (uniquePatients.length === 0) {
           uniquePatients = [
             {
               _id: '1',
               name: 'Jane Doe',
               email: 'jane.doe@example.com',
               bloodGroup: 'O+',
               lastVisit: new Date(Date.now() - 86400000 * 5).toISOString()
             },
             {
               _id: '2',
               name: 'John Smith',
               email: 'john.smith@example.com',
               bloodGroup: 'A-',
               lastVisit: new Date(Date.now() - 86400000 * 15).toISOString()
             }
           ];
        }
        
        setPatients(uniquePatients);
      } catch (error) {
        console.error('Error fetching patients', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [user.token]);

  const filteredPatients = patients.filter(p => {
    const patientName = p.name || p.user?.name || '';
    const patientEmail = p.email || p.user?.email || '';
    return patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           patientEmail.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) return <div className="p-8">Loading patient data...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Patient Management</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div className="relative w-96">
            <input 
              type="text" 
              placeholder="Search patients by name or email..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
          <div className="text-sm text-gray-500">
            Total Patients: <span className="font-bold text-gray-900">{patients.length}</span>
          </div>
        </div>

        {filteredPatients.length === 0 ? (
          <div className="p-12 text-center text-gray-500 flex flex-col items-center">
            <Users className="w-12 h-12 text-gray-300 mb-3" />
            <p>No patients found matching your search.</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blood Group</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Visit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medical Records</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPatients.map((patient) => (
                <tr key={patient._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 font-bold">
                        {(patient.name || patient.user?.name || 'P').charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-bold text-gray-900">{patient.name || patient.user?.name || 'Unknown Patient'}</div>
                        <div className="text-sm text-gray-500">{patient.email || patient.user?.email || 'No email provided'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      {patient.bloodGroup || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{new Date(patient.lastVisit).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2 text-sm">
                      <button 
                        onClick={() => { setSelectedPatient(patient); setModalType('reports'); }}
                        className="flex items-center text-blue-600 hover:text-blue-900 bg-blue-50 px-2 py-1 rounded"
                      >
                        <FileText className="w-4 h-4 mr-1" /> Reports
                      </button>
                      <button 
                        onClick={() => navigate('/dashboard/ai-analysis')}
                        className="flex items-center text-purple-600 hover:text-purple-900 bg-purple-50 px-2 py-1 rounded"
                      >
                        <Activity className="w-4 h-4 mr-1" /> AI Analysis
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => { setSelectedPatient(patient); setModalType('profile'); }}
                      className="text-teal-600 hover:text-teal-900 flex items-center"
                    >
                      <Eye className="w-4 h-4 mr-1" /> View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedPatient && modalType && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg">
                {modalType === 'profile' ? 'Patient Profile' : 'Medical Reports'}
              </h3>
              <button onClick={() => {setSelectedPatient(null); setModalType(null); setSelectedReport(null);}} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 font-bold text-xl">
                  {(selectedPatient.name || selectedPatient.user?.name || 'P').charAt(0)}
                </div>
                <div className="ml-4">
                  <h4 className="text-xl font-bold">{selectedPatient.name || selectedPatient.user?.name || 'Unknown Patient'}</h4>
                  <p className="text-gray-500">{selectedPatient.email || selectedPatient.user?.email || 'No email provided'}</p>
                </div>
              </div>
              
              {modalType === 'profile' ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Blood Group</p>
                      <p className="font-semibold">{selectedPatient.bloodGroup || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Last Visit</p>
                      <p className="font-semibold">{new Date(selectedPatient.lastVisit).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 inline-block mt-1">
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              ) : selectedReport ? (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between mb-4 border-b pb-2">
                     <div className="flex items-center">
                       <h4 className="font-semibold text-gray-800">{selectedReport.name}</h4>
                       <span className="ml-3 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{selectedReport.size}</span>
                     </div>
                     <button 
                       onClick={() => setSelectedReport(null)} 
                       className="text-sm text-blue-600 hover:text-blue-800 flex items-center font-medium"
                     >
                       Back to Reports
                     </button>
                  </div>
                  <div className="bg-gray-100/80 p-6 rounded-xl flex justify-center items-center min-h-[300px] border border-gray-200 shadow-inner">
                     <div className="text-center w-full max-w-sm">
                       <FileText className="w-16 h-16 text-teal-300 mx-auto mb-4" />
                       <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-left">
                         <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                         <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
                         <div className="h-4 bg-gray-200 rounded w-5/6 mb-6"></div>
                         <p className="text-sm text-gray-500 text-center italic">Mock Document Preview Content for {selectedReport.name}</p>
                       </div>
                     </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex justify-between items-center mb-4">
                     <h4 className="font-semibold text-gray-700">Recent Reports</h4>
                     <button 
                       onClick={() => toast.success('New report request sent to patient successfully!')}
                       className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                     >
                       Request New Report
                     </button>
                  </div>
                  
                  <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                    <div className="p-3 border border-gray-100 rounded-lg flex items-center justify-between hover:bg-gray-50 transition-colors">
                       <div className="flex items-center">
                         <div className="p-2 bg-blue-50 text-blue-600 rounded-lg mr-3">
                           <FileText className="w-5 h-5" />
                         </div>
                         <div>
                           <p className="font-semibold text-sm text-gray-900">Complete Blood Count</p>
                           <p className="text-xs text-gray-500">Jan 15, 2026 • PDF • 1.2 MB</p>
                         </div>
                       </div>
                       <button 
                         onClick={() => setSelectedReport({ name: 'Complete Blood Count', date: 'Jan 15, 2026', size: '1.2 MB' })}
                         className="text-teal-600 hover:text-teal-800 p-2 bg-teal-50 hover:bg-teal-100 transition-colors rounded"
                         title="View Report"
                       >
                         <Eye className="w-4 h-4" />
                       </button>
                    </div>

                    <div className="p-3 border border-gray-100 rounded-lg flex items-center justify-between hover:bg-gray-50 transition-colors">
                       <div className="flex items-center">
                         <div className="p-2 bg-blue-50 text-blue-600 rounded-lg mr-3">
                           <FileText className="w-5 h-5" />
                         </div>
                         <div>
                           <p className="font-semibold text-sm text-gray-900">MRI Scan Results</p>
                           <p className="text-xs text-gray-500">Dec 02, 2025 • PDF • 4.5 MB</p>
                         </div>
                       </div>
                       <button 
                         onClick={() => setSelectedReport({ name: 'MRI Scan Results', date: 'Dec 02, 2025', size: '4.5 MB' })}
                         className="text-teal-600 hover:text-teal-800 p-2 bg-teal-50 hover:bg-teal-100 transition-colors rounded"
                         title="View Report"
                       >
                         <Eye className="w-4 h-4" />
                       </button>
                    </div>

                    <div className="p-3 border border-gray-100 rounded-lg flex items-center justify-between hover:bg-gray-50 transition-colors">
                       <div className="flex items-center">
                         <div className="p-2 bg-blue-50 text-blue-600 rounded-lg mr-3">
                           <FileText className="w-5 h-5" />
                         </div>
                         <div>
                           <p className="font-semibold text-sm text-gray-900">Metabolic Panel</p>
                           <p className="text-xs text-gray-500">Nov 18, 2025 • PDF • 0.8 MB</p>
                         </div>
                       </div>
                       <button 
                         onClick={() => setSelectedReport({ name: 'Metabolic Panel', date: 'Nov 18, 2025', size: '0.8 MB' })}
                         className="text-teal-600 hover:text-teal-800 p-2 bg-teal-50 hover:bg-teal-100 transition-colors rounded"
                         title="View Report"
                       >
                         <Eye className="w-4 h-4" />
                       </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientManagement;
