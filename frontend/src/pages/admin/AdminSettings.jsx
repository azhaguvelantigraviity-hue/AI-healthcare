import React, { useState } from 'react';
import { Settings, Save, Server, Globe, CheckCircle } from 'lucide-react';

const AdminSettings = () => {
  const [formData, setFormData] = useState({
    platformName: 'HealthAI',
    supportEmail: 'support@healthai.com',
    geminiKey: '************************',
    cloudinaryUrl: '************************'
  });
  
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <Settings className="w-6 h-6 mr-2 text-teal-600" /> System Settings
        </h1>
        {saved && (
          <span className="text-green-600 flex items-center font-medium bg-green-50 px-3 py-1 rounded-full">
            <CheckCircle className="w-5 h-5 mr-1" /> Saved Successfully
          </span>
        )}
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center border-b pb-2">
          <Globe className="w-5 h-5 mr-2 text-blue-500" /> Platform Configuration
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Platform Name</label>
            <input 
              type="text" 
              value={formData.platformName}
              onChange={(e) => setFormData({...formData, platformName: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
            <input 
              type="email" 
              value={formData.supportEmail}
              onChange={(e) => setFormData({...formData, supportEmail: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500" 
            />
          </div>
        </div>


        
        <div className="mt-8 flex justify-end">
          <button 
            onClick={handleSave}
            className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-medium flex items-center transition-colors shadow-sm"
          >
            <Save className="w-5 h-5 mr-2" /> Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
