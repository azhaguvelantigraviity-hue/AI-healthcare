import React from 'react';
import { Bell, AlertTriangle, Info, CheckCircle } from 'lucide-react';

const AdminNotifications = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 flex items-center">
        <Bell className="w-6 h-6 mr-2 text-teal-600" /> Notifications
      </h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
        <div className="flex p-4 bg-red-50 rounded-lg border border-red-100">
          <AlertTriangle className="w-5 h-5 text-red-500 mr-3 mt-0.5" />
          <div>
            <h3 className="font-bold text-red-900">High Server Load</h3>
            <p className="text-sm text-red-700 mt-1">Database CPU usage exceeded 80% for the last 5 minutes.</p>
            <p className="text-xs text-red-500 mt-2">10 mins ago</p>
          </div>
        </div>
        
        <div className="flex p-4 bg-blue-50 rounded-lg border border-blue-100">
          <Info className="w-5 h-5 text-blue-500 mr-3 mt-0.5" />
          <div>
            <h3 className="font-bold text-blue-900">New Doctor Registration</h3>
            <p className="text-sm text-blue-700 mt-1">Dr. Michael Lee has registered and is awaiting approval.</p>
            <p className="text-xs text-blue-500 mt-2">1 hour ago</p>
          </div>
        </div>
        
        <div className="flex p-4 bg-green-50 rounded-lg border border-green-100">
          <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
          <div>
            <h3 className="font-bold text-green-900">System Backup Complete</h3>
            <p className="text-sm text-green-700 mt-1">Daily automated backup completed successfully.</p>
            <p className="text-xs text-green-500 mt-2">3 hours ago</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;
