import React from 'react';
import { MessageSquare, Video, Phone, Paperclip } from 'lucide-react';

const DoctorCommunication = () => {
  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-8rem)]">
      <h1 className="text-2xl font-bold text-gray-900">Communication</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 flex-1 min-h-0">
        {/* Contacts Sidebar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden col-span-1 flex flex-col">
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <h2 className="font-semibold text-gray-800">My Doctors</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            <div className="p-3 bg-teal-50 rounded-lg cursor-pointer border border-teal-100">
              <div className="flex justify-between items-start">
                <p className="font-bold text-gray-900">Dr. John Smith</p>
                <span className="w-2 h-2 rounded-full bg-green-500 mt-1.5"></span>
              </div>
              <p className="text-xs text-teal-700">Cardiologist</p>
              <p className="text-xs text-gray-500 truncate mt-1">Hello, please take your medicine...</p>
            </div>
            <div className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer border border-transparent">
              <div className="flex justify-between items-start">
                <p className="font-bold text-gray-900">Dr. Emily Chen</p>
                <span className="w-2 h-2 rounded-full bg-gray-300 mt-1.5"></span>
              </div>
              <p className="text-xs text-gray-500">General Physician</p>
              <p className="text-xs text-gray-500 truncate mt-1">Your test results are normal.</p>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden col-span-3 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white z-10">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center font-bold mr-3">
                JS
              </div>
              <div>
                <h2 className="font-bold text-gray-900">Dr. John Smith</h2>
                <p className="text-xs text-green-500 font-medium flex items-center">
                   Online
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors" title="Start Video Call">
                <Video className="w-5 h-5" />
              </button>
              <button className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors" title="Audio Call">
                <Phone className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Messages */}
          <div className="flex-1 p-6 bg-gray-50 overflow-y-auto space-y-4">
            <div className="flex justify-center">
              <span className="text-xs text-gray-400 bg-gray-200/50 px-2 py-1 rounded-full">Yesterday</span>
            </div>
            
            {/* Received Message */}
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 text-gray-800 p-3 rounded-2xl rounded-tl-none max-w-md shadow-sm">
                <p className="text-sm">Hello Jane. I have reviewed your recent blood test reports. Everything looks mostly normal, but your cholesterol is slightly elevated.</p>
                <p className="text-[10px] text-gray-400 mt-1 text-right">09:41 AM</p>
              </div>
            </div>

            {/* Sent Message */}
            <div className="flex justify-end">
              <div className="bg-teal-600 text-white p-3 rounded-2xl rounded-tr-none max-w-md shadow-sm">
                <p className="text-sm">Oh, I see. Do I need to change my diet or start any medication?</p>
                <p className="text-[10px] text-teal-100 mt-1 text-right">09:45 AM</p>
              </div>
            </div>
            
            {/* Received Message */}
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 text-gray-800 p-3 rounded-2xl rounded-tl-none max-w-md shadow-sm">
                <p className="text-sm">Just a slight diet modification for now. Try to reduce fried foods. I've updated your prescription with a mild statin just in case.</p>
                <p className="text-[10px] text-gray-400 mt-1 text-right">09:50 AM</p>
              </div>
            </div>
          </div>
          
          {/* Input Area */}
          <div className="p-4 border-t border-gray-100 bg-white">
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-teal-600 transition-colors">
                <Paperclip className="w-5 h-5" />
              </button>
              <input 
                type="text" 
                placeholder="Type your message to Dr. Smith..." 
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:ring-teal-500 focus:border-teal-500 text-sm" 
              />
              <button className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-full font-medium transition-colors flex items-center">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorCommunication;
