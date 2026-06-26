import React, { useState, useEffect } from 'react';
import API from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import { 
  HeartPulse, Activity, Droplets, Thermometer, Wind, Scale, 
  AlertTriangle, Pill, Stethoscope, ShieldAlert, BadgeInfo 
} from 'lucide-react';
import toast from 'react-hot-toast';

const HealthSummary = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await API.get('/api/patients/profile/me', config);
      setProfile(data.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load health summary');
    } finally {
      setLoading(false);
    }
  };

  const calculateBMI = (weight, height) => {
    if (!weight || !height) return null;
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 font-medium flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin"></div>
          Loading your health summary...
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
        <BadgeInfo className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900">Profile Not Found</h3>
        <p className="text-gray-500 mt-2">We couldn't locate your medical profile data.</p>
      </div>
    );
  }

  const latestVitals = profile.vitals && profile.vitals.length > 0 
    ? profile.vitals[profile.vitals.length - 1] 
    : null;

  const bmi = calculateBMI(profile.weight, profile.height);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12 max-w-6xl mx-auto">
      
      {/* Header Banner - Health Score */}
      <div className="bg-gradient-to-r from-rose-900 to-rose-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-widest mb-4 backdrop-blur-md">
            <Activity className="w-3 h-3" /> Comprehensive Overview
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-3 text-white">Your Health Summary</h1>
          <p className="text-rose-100 text-lg opacity-90 leading-relaxed">
            A complete, real-time overview of your vital signs, medical conditions, and key physical metrics.
          </p>
        </div>

        {/* Health Score Ring */}
        <div className="relative z-10 flex flex-col items-center justify-center p-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-white/20"
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-white"
                strokeDasharray={`${profile.healthScore || 0}, 100`}
                strokeWidth="3"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black">{profile.healthScore || '--'}</span>
            </div>
          </div>
          <p className="text-sm font-bold uppercase tracking-widest mt-3 text-rose-100">Health Score</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Key Metrics & Vitals */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Key Metrics */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-rose-500" /> Key Metrics
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Blood Type</p>
                <p className="text-xl font-bold text-rose-600 flex items-center gap-2">
                  <Droplets className="w-4 h-4" /> {profile.bloodType || '--'}
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">BMI</p>
                <p className="text-xl font-bold text-gray-900">{bmi || '--'}</p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Weight</p>
                <p className="text-xl font-bold text-gray-900">{profile.weight ? `${profile.weight} kg` : '--'}</p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Height</p>
                <p className="text-xl font-bold text-gray-900">{profile.height ? `${profile.height} cm` : '--'}</p>
              </div>
            </div>
          </div>

          {/* Latest Vitals */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5">
              <HeartPulse className="w-32 h-32 text-rose-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2 relative z-10">
              <HeartPulse className="w-5 h-5 text-rose-500" /> Latest Vitals
            </h3>

            {latestVitals ? (
              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-3 text-gray-600">
                    <div className="p-2 bg-rose-50 rounded-lg text-rose-500"><HeartPulse className="w-4 h-4" /></div>
                    <span className="font-medium text-sm">Heart Rate</span>
                  </div>
                  <span className="font-bold text-gray-900">{latestVitals.heartRate || '--'} bpm</span>
                </div>
                
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-3 text-gray-600">
                    <div className="p-2 bg-blue-50 rounded-lg text-blue-500"><Activity className="w-4 h-4" /></div>
                    <span className="font-medium text-sm">Blood Pressure</span>
                  </div>
                  <span className="font-bold text-gray-900">
                    {latestVitals.bloodPressure?.systolic && latestVitals.bloodPressure?.diastolic 
                      ? `${latestVitals.bloodPressure.systolic}/${latestVitals.bloodPressure.diastolic}` 
                      : '--'}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-3 text-gray-600">
                    <div className="p-2 bg-orange-50 rounded-lg text-orange-500"><Thermometer className="w-4 h-4" /></div>
                    <span className="font-medium text-sm">Temperature</span>
                  </div>
                  <span className="font-bold text-gray-900">{latestVitals.temperature || '--'} °C</span>
                </div>

                <div className="flex items-center justify-between pb-1">
                  <div className="flex items-center gap-3 text-gray-600">
                    <div className="p-2 bg-cyan-50 rounded-lg text-cyan-500"><Wind className="w-4 h-4" /></div>
                    <span className="font-medium text-sm">SpO2</span>
                  </div>
                  <span className="font-bold text-gray-900">{latestVitals.oxygenSaturation ? `${latestVitals.oxygenSaturation}%` : '--'}</span>
                </div>
                
                <p className="text-xs text-center text-gray-400 font-medium mt-4 pt-4 border-t border-gray-100">
                  Recorded on {new Date(latestVitals.date).toLocaleDateString()}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500 relative z-10">No vitals recorded yet.</p>
            )}
          </div>
        </div>

        {/* Right Column: Medical History */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Allergies & Chronic Conditions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 h-full">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-500" /> Allergies
              </h3>
              {profile.allergies && profile.allergies.length > 0 ? (
                <ul className="space-y-3">
                  {profile.allergies.map((allergy, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-gray-700 font-medium bg-amber-50/50 p-3 rounded-xl border border-amber-100/50">
                      <div className="w-2 h-2 rounded-full bg-amber-400"></div> {allergy}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-6">
                  <p className="text-sm text-gray-500">No known allergies.</p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 h-full">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-purple-500" /> Chronic Conditions
              </h3>
              {profile.chronicConditions && profile.chronicConditions.length > 0 ? (
                <ul className="space-y-3">
                  {profile.chronicConditions.map((condition, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-gray-700 font-medium bg-purple-50/50 p-3 rounded-xl border border-purple-100/50">
                      <div className="w-2 h-2 rounded-full bg-purple-400"></div> {condition}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-6">
                  <p className="text-sm text-gray-500">No chronic conditions recorded.</p>
                </div>
              )}
            </div>
            
          </div>

          {/* Current Medications */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Pill className="w-5 h-5 text-teal-500" /> Current Medications
            </h3>
            
            {profile.currentMedications && profile.currentMedications.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400">
                      <th className="pb-3 font-bold">Medication Name</th>
                      <th className="pb-3 font-bold">Dosage</th>
                      <th className="pb-3 font-bold">Frequency</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profile.currentMedications.map((med, idx) => (
                      <tr key={idx} className="border-b border-gray-50 last:border-0">
                        <td className="py-4 text-sm font-bold text-gray-900">{med.name}</td>
                        <td className="py-4 text-sm text-gray-600 font-medium">{med.dosage}</td>
                        <td className="py-4 text-sm text-gray-600 font-medium">{med.frequency}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <Pill className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                <p className="text-sm font-bold text-gray-500">No active medications.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default HealthSummary;
