import React from 'react';
import { MessageSquare, Video, Clock } from 'lucide-react';

const PatientCommunication = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Patient Communication</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden col-span-1 flex flex-col">
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <h2 className="font-semibold text-gray-800">Recent Chats</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            <div className="p-3 bg-teal-50 rounded-lg cursor-pointer mb-2 border border-teal-100">
              <p className="font-medium text-gray-900">Jane Doe</p>
              <p className="text-xs text-gray-500 truncate">Thanks doctor, the medicine is working...</p>
            </div>
            <div className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer mb-2">
              <p className="font-medium text-gray-900">Bob Smith</p>
              <p className="text-xs text-gray-500 truncate">Can I reschedule my video call?</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden col-span-2 flex flex-col">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <div>
              <h2 className="font-semibold text-gray-800">Chat with Jane Doe</h2>
              <p className="text-xs text-green-500 flex items-center mt-1"><span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span> Online</p>
            </div>
            <div className="flex space-x-2">
              <button className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><Video className="w-5 h-5" /></button>
            </div>
          </div>
          <div className="flex-1 p-6 bg-gray-50 flex items-center justify-center">
            <p className="text-gray-400 flex items-center"><MessageSquare className="w-5 h-5 mr-2"/> Select a message to view history</p>
          </div>
          <div className="p-4 border-t border-gray-100 bg-white">
            <div className="flex space-x-3">
              <input type="text" placeholder="Type your message..." className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-teal-500 focus:border-teal-500" />
              <button className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">Send</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientCommunication;
