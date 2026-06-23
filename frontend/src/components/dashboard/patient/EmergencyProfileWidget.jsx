import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Droplet, PhoneCall } from 'lucide-react';
import { Card } from '../../ui/SharedUI';

const EmergencyProfileWidget = () => {
  const navigate = useNavigate();

  return (
    <Card className="border-red-100 bg-red-50/30">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-red-700 text-lg flex items-center">
          <ShieldAlert className="w-5 h-5 mr-2" /> Emergency Info
        </h3>
        <button onClick={() => navigate("/dashboard/emergency")} className="text-xs font-semibold bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200 transition-colors">
          View Card
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white p-3 rounded-lg border border-red-50">
          <div className="flex items-center text-red-500 mb-1"><Droplet className="w-4 h-4 mr-1"/> Blood Group</div>
          <div className="font-bold text-xl text-gray-900">O+</div>
        </div>
        <div className="bg-white p-3 rounded-lg border border-red-50">
          <div className="text-xs text-gray-500 mb-1">Allergies</div>
          <div className="font-semibold text-sm text-gray-900">Penicillin</div>
        </div>
      </div>

      <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-lg flex items-center justify-center transition-colors">
        <PhoneCall className="w-4 h-4 mr-2" /> SOS Contact
      </button>
    </Card>
  );
};

export default EmergencyProfileWidget;
