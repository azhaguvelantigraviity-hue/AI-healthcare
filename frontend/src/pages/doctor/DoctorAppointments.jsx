import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Clock, Video, CheckCircle, XCircle, RefreshCw, Plus, Video as VideoIcon, Building2, Ticket, FileText, UserCircle, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSocket } from '../../context/SocketContext';

const DoctorAppointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const { socket } = useSocket();

  // Modal States
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [selectedApt, setSelectedApt] = useState(null);
  const [rescheduleData, setRescheduleData] = useState({ date: '', time: '', reason: '', notify: true });

  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingData, setBookingData] = useState({ patient: '', doctor: '', date: '', time: '', type: 'general', mode: 'video', reason: '', roomNumber: '' });

  const fetchAppointments = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get('/api/appointments', config);
      setAppointments(data.data || []);
    } catch (error) {
      console.error('Error fetching appointments', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get('/api/patients?limit=100', config);
      setPatients(data.data || []);
    } catch (error) {
      console.error('Error fetching patients', error);
      toast.error('Failed to load patient list');
    }
  };

  const fetchDoctors = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get('/api/doctors', config);
      setDoctors(data.data || []);
    } catch (error) {
      console.error('Error fetching doctors', error);
    }
  };

  useEffect(() => {
    fetchAppointments();
    fetchPatients();
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (socket) {
      const handleNewNotif = (notif) => {
        if (notif.type === 'appointment' && notif.appointment) {
          // If it's a new appointment or status update, fetch or merge
          setAppointments(prev => {
            const exists = prev.find(a => a._id === notif.appointment._id);
            if (exists) {
              return prev.map(a => a._id === notif.appointment._id ? notif.appointment : a);
            }
            return [notif.appointment, ...prev];
          });
        }
      };
      socket.on('new_notification', handleNewNotif);
      return () => socket.off('new_notification', handleNewNotif);
    }
  }, [socket]);

  const updateStatus = async (id, status) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`/api/appointments/${id}/status`, { status }, config);
      fetchAppointments();
      toast.success(`Appointment marked as ${status}`);
    } catch (error) {
      console.error('Error updating appointment', error);
      toast.error('Failed to update status');
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!bookingData.patient || !bookingData.date || !bookingData.time || !bookingData.reason) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const payload = {
        doctor: bookingData.doctor || user.id,
        patient: bookingData.patient,
        appointmentDate: bookingData.date,
        appointmentTime: bookingData.time,
        reason: bookingData.reason,
        mode: bookingData.mode,
        type: bookingData.type,
        roomNumber: bookingData.roomNumber
      };

      await axios.post('/api/appointments', payload, config);
      toast.success('Appointment Booked Successfully!');
      setBookingModalOpen(false);
      setBookingData({ patient: '', doctor: '', date: '', time: '', type: 'general', mode: 'video', reason: '', roomNumber: '' });
      fetchAppointments();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to book appointment');
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'scheduled':
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'cancelled':
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'rescheduled': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'live':
      case 'consulting': return 'bg-indigo-100 text-indigo-800 border-indigo-200 animate-pulse';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredAppointments = appointments.filter(apt => {
    if (filter === 'All') return true;
    if (filter === 'Online') return apt.mode === 'video';
    if (filter === 'Offline') return apt.mode === 'in-person';
    return apt.status?.toLowerCase() === filter.toLowerCase();
  });

  if (loading) return <div className="p-8 text-center text-gray-500 flex justify-center items-center h-64">Loading schedule...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Calendar className="w-6 h-6 mr-3 text-indigo-600" /> Manage Appointments
          </h1>
          <p className="text-sm text-gray-500 mt-1">View, confirm, and schedule new online or offline consultations.</p>
        </div>
        <button 
          onClick={() => setBookingModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-md shadow-indigo-200 transition-all hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" /> Add New Appointment
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide">
        {['All', 'Online', 'Offline', 'Pending', 'Confirmed', 'Completed'].map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-5 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-all border ${
              filter === tab 
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200' 
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Appointment Cards Grid */}
      {filteredAppointments.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-16 text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
             <Calendar className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">No Appointments Found</h3>
          <p className="text-gray-500 mt-2">There are no appointments matching the '{filter}' filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAppointments.map(apt => {
            const isOnline = apt.mode === 'video';
            const statusLabel = apt.status.charAt(0).toUpperCase() + apt.status.slice(1);
            
            return (
              <div key={apt._id} className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col group">
                
                {/* Card Header (Mode Badge & Status) */}
                <div className={`px-6 py-4 border-b flex justify-between items-center ${isOnline ? 'bg-indigo-50/50 border-indigo-50' : 'bg-emerald-50/50 border-emerald-50'}`}>
                  <div className={`flex items-center gap-2 font-bold text-xs uppercase tracking-widest ${isOnline ? 'text-indigo-700' : 'text-emerald-700'}`}>
                    {isOnline ? <VideoIcon className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
                    {isOnline ? 'Online Consultation' : 'Offline Visit'}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusBadge(apt.status)}`}>
                    {statusLabel}
                  </span>
                </div>

                {/* Patient Info */}
                <div className="p-6 flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl shadow-inner ${isOnline ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {apt.patient?.name?.charAt(0) || <UserCircle className="w-8 h-8" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-indigo-600 transition-colors">{apt.patient?.name || 'Unknown Patient'}</h3>
                    <p className="text-sm text-gray-500 font-medium">#{apt.patient?._id?.substring(0, 8) || 'N/A'}</p>
                  </div>
                </div>

                {/* Details Section */}
                <div className="px-6 pb-6 space-y-4 flex-grow">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1"><Calendar className="w-3 h-3"/> Date</p>
                      <p className="text-sm font-semibold text-gray-800">{new Date(apt.appointmentDate).toLocaleDateString()}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1"><Clock className="w-3 h-3"/> Time</p>
                      <p className="text-sm font-semibold text-gray-800">{apt.appointmentTime}</p>
                    </div>
                  </div>

                  {/* Mode Specific Info */}
                  {isOnline ? (
                     <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100/50 flex items-start gap-3">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg shrink-0"><Video className="w-4 h-4" /></div>
                        <div>
                          <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider mb-0.5">Meeting Link Generated</p>
                          <p className="text-xs text-blue-800 font-medium truncate w-48" title={apt.meetingLink}>{apt.meetingLink || 'Waiting for creation...'}</p>
                        </div>
                     </div>
                  ) : (
                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-100/50 flex items-start gap-3">
                          <div className="p-2 bg-amber-100 text-amber-600 rounded-lg shrink-0"><Ticket className="w-4 h-4" /></div>
                          <div>
                            <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-0.5">Queue Token</p>
                            <p className="text-lg font-black text-amber-700 leading-none">{apt.queueNumber || '--'}</p>
                          </div>
                        </div>
                        <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100/50 flex items-start gap-3">
                          <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg shrink-0"><Building2 className="w-4 h-4" /></div>
                          <div>
                            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mb-0.5">Consult Room</p>
                            <p className="text-sm font-bold text-emerald-800">{apt.roomNumber || 'TBD'}</p>
                          </div>
                        </div>
                     </div>
                  )}

                  <div className="pt-2">
                    <p className="text-xs text-gray-500 italic">Reason: {apt.reason || 'None provided'}</p>
                  </div>
                </div>

                {/* Action Footer */}
                <div className="p-4 bg-gray-50 border-t border-gray-100 flex flex-wrap gap-2 justify-end">
                  {apt.status === 'pending' && (
                     <>
                        <button onClick={() => updateStatus(apt._id, 'confirmed')} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-sm">Approve</button>
                        <button onClick={() => updateStatus(apt._id, 'rejected')} className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-sm font-bold flex items-center gap-2 transition-all">Reject</button>
                     </>
                  )}
                  {['confirmed', 'rescheduled'].includes(apt.status) && (
                     <>
                       <button className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-100 rounded-xl text-sm font-bold text-gray-700 flex items-center gap-2 transition-all">
                         <FileText className="w-4 h-4" /> Prescribe
                       </button>
                       <button className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-100 rounded-xl text-sm font-bold text-gray-700 flex items-center gap-2 transition-all">
                         <UserCircle className="w-4 h-4" /> View History
                       </button>
                       {isOnline ? (
                         <a href={apt.meetingLink} target="_blank" rel="noreferrer" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-sm">
                           <Video className="w-4 h-4" /> Join Call
                         </a>
                       ) : (
                         <button onClick={() => updateStatus(apt._id, 'completed')} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-sm">
                           <CheckCircle className="w-4 h-4" /> Start Consult
                         </button>
                       )}
                     </>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Add New Appointment Modal */}
      {bookingModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <Calendar className="w-6 h-6 mr-2 text-indigo-600" /> Book New Appointment
              </h2>
              <button onClick={() => setBookingModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-white border border-transparent hover:border-gray-200 transition-all">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleBookingSubmit} className="p-6 space-y-6">
              
              {/* Select Patient & Doctor */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><Users className="w-4 h-4 text-indigo-500"/> Select Patient *</label>
                  <select 
                    required
                    value={bookingData.patient}
                    onChange={(e) => setBookingData({...bookingData, patient: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm font-medium bg-gray-50"
                  >
                    <option value="">-- Choose a patient --</option>
                    {patients.map(p => (
                      <option key={p._id} value={p._id}>{p.name} ({p.email})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><Building2 className="w-4 h-4 text-indigo-500"/> Select Doctor *</label>
                  <select 
                    required
                    value={bookingData.doctor}
                    onChange={(e) => setBookingData({...bookingData, doctor: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm font-medium bg-gray-50"
                  >
                    <option value="">-- Choose a doctor --</option>
                    {doctors.map(d => (
                      <option key={d._id || d.user?._id} value={d._id || d.user?._id}>{d.name || d.user?.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Mode Selection */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Appointment Type *</label>
                <div className="grid grid-cols-2 gap-4">
                  <div 
                    onClick={() => setBookingData({...bookingData, mode: 'video'})}
                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${bookingData.mode === 'video' ? 'border-indigo-500 bg-indigo-50/50' : 'border-gray-200 hover:border-indigo-300'}`}
                  >
                    <div className={`p-2 rounded-lg ${bookingData.mode === 'video' ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-500'}`}><VideoIcon className="w-5 h-5"/></div>
                    <div>
                      <p className={`font-bold ${bookingData.mode === 'video' ? 'text-indigo-900' : 'text-gray-700'}`}>Online</p>
                      <p className="text-xs text-gray-500">Video Consultation</p>
                    </div>
                  </div>
                  
                  <div 
                    onClick={() => setBookingData({...bookingData, mode: 'in-person'})}
                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${bookingData.mode === 'in-person' ? 'border-emerald-500 bg-emerald-50/50' : 'border-gray-200 hover:border-emerald-300'}`}
                  >
                    <div className={`p-2 rounded-lg ${bookingData.mode === 'in-person' ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-500'}`}><Building2 className="w-5 h-5"/></div>
                    <div>
                      <p className={`font-bold ${bookingData.mode === 'in-person' ? 'text-emerald-900' : 'text-gray-700'}`}>Offline</p>
                      <p className="text-xs text-gray-500">Hospital Visit</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Date *</label>
                  <input 
                    type="date" required
                    value={bookingData.date}
                    onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm font-medium bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Time *</label>
                  <input 
                    type="time" required
                    value={bookingData.time}
                    onChange={(e) => setBookingData({...bookingData, time: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm font-medium bg-gray-50"
                  />
                </div>
              </div>

              {/* Reason & Room */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-1">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Reason *</label>
                  <input 
                    type="text" required placeholder="e.g. General Checkup"
                    value={bookingData.reason}
                    onChange={(e) => setBookingData({...bookingData, reason: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm font-medium bg-gray-50"
                  />
                </div>
                {bookingData.mode === 'in-person' && (
                  <div className="md:col-span-1 animate-in fade-in slide-in-from-bottom-2">
                    <label className="block text-sm font-bold text-emerald-700 mb-2">Room Number (Optional)</label>
                    <input 
                      type="text" placeholder="e.g. Room 101"
                      value={bookingData.roomNumber}
                      onChange={(e) => setBookingData({...bookingData, roomNumber: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-emerald-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-sm font-medium bg-emerald-50 text-emerald-900"
                    />
                  </div>
                )}
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button type="button" onClick={() => setBookingModalOpen(false)} className="px-6 py-3 font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-all">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-3 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5">
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorAppointments;
