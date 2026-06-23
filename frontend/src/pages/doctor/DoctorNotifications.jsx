import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle } from 'lucide-react';
import { realtimeService } from '../../services/realtimeService';

const DoctorNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Start listening to the realtime service we created earlier
    realtimeService.startMocking();
    const unsubscribe = realtimeService.subscribe('notification', (notif) => {
      setNotifications(prev => [notif, ...prev]);
    });

    return () => {
      unsubscribe();
      realtimeService.stopMocking();
    };
  }, []);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <Bell className="w-6 h-6 mr-3 text-primary-500" /> Notifications
        </h1>
        {notifications.some(n => !n.read) && (
          <button 
            onClick={markAllRead}
            className="flex items-center text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors bg-primary-50 dark:bg-primary-900/30 px-4 py-2 rounded-lg"
          >
            <CheckCircle className="w-4 h-4 mr-2" /> Mark all as read
          </button>
        )}
      </div>
      
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
        {notifications.length === 0 ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">
            <Bell className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-lg font-medium">No new notifications</p>
            <p className="text-sm mt-1">You're all caught up!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-slate-800">
            {notifications.map(notif => (
              <div 
                key={notif.id} 
                className={`p-6 transition-colors flex items-start justify-between ${
                  !notif.read ? 'bg-primary-50/50 dark:bg-primary-900/20' : 'hover:bg-gray-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`mt-1 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    notif.type === 'appointment' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 
                    notif.type === 'report' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' :
                    'bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-gray-400'
                  }`}>
                    {notif.type === 'appointment' ? '📅' : notif.type === 'report' ? '📄' : '🔔'}
                  </div>
                  <div>
                    <h3 className={`font-semibold ${!notif.read ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                      {notif.type === 'appointment' ? 'Appointment Update' : notif.type === 'report' ? 'New Medical Report' : 'Notification'}
                    </h3>
                    <p className={`mt-1 text-sm ${!notif.read ? 'text-gray-800 dark:text-gray-200' : 'text-gray-500 dark:text-gray-400'}`}>
                      {notif.message}
                    </p>
                    
                    {/* Rich Details rendering */}
                    {notif.details && (
                      <div className="mt-3 bg-gray-50 dark:bg-slate-800/80 rounded-xl p-4 border border-gray-100 dark:border-slate-700 shadow-sm text-sm">
                        <div className="grid grid-cols-2 gap-y-3 gap-x-6">
                          <div>
                            <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider mb-1">Patient</p>
                            <p className="font-medium text-gray-900 dark:text-white flex items-center">
                              👤 {notif.details.patientName}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider mb-1">Status</p>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50">
                              {notif.details.status}
                            </span>
                          </div>
                          <div>
                            <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider mb-1">Date</p>
                            <p className="font-medium text-gray-900 dark:text-white flex items-center">
                              📅 {notif.details.date}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider mb-1">Time</p>
                            <p className="font-medium text-gray-900 dark:text-white flex items-center">
                              ⏰ {notif.details.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
                      {new Date(notif.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                {!notif.read && (
                  <button 
                    onClick={() => markAsRead(notif.id)}
                    className="flex-shrink-0 text-xs font-medium text-primary-600 hover:text-primary-700 bg-white border border-gray-200 px-3 py-1.5 rounded-full shadow-sm hover:bg-gray-50 transition-colors"
                  >
                    Mark read
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorNotifications;
