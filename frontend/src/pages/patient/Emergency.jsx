import React, { useState } from 'react';
import { AlertCircle, Phone, MapPin, Navigation, Heart, ShieldAlert, X } from 'lucide-react';
import { Card, Button } from '../../components/ui/SharedUI';
import toast from 'react-hot-toast';

const Emergency = () => {
  const [sosActive, setSosActive] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [timer, setTimer] = useState(null);

  const handleSosClick = () => {
    if (sosActive) return;
    setSosActive(true);
    let count = 3;
    setCountdown(count);
    
    const t = setInterval(() => {
      count -= 1;
      setCountdown(count);
      if (count <= 0) {
        clearInterval(t);
        triggerEmergency();
      }
    }, 1000);
    setTimer(t);
  };

  const cancelSos = () => {
    if (timer) clearInterval(timer);
    setSosActive(false);
    setCountdown(3);
  };

  const triggerEmergency = () => {
    setSosActive(false);
    toast.error('Emergency Services and Contacts Notified!', { duration: 5000, icon: '🚑' });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* SOS Banner */}
      <div className="bg-red-600 rounded-2xl p-8 md:p-12 text-center text-white shadow-xl relative overflow-hidden">
        {/* Background pulse effect */}
        <div className="absolute inset-0 bg-red-500 animate-pulse opacity-50"></div>
        <div className="relative z-10">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 flex items-center justify-center tracking-tight">
            <ShieldAlert className="w-10 h-10 md:w-14 md:h-14 mr-3" /> EMERGENCY SOS
          </h1>
          <p className="text-red-100 mb-8 max-w-2xl mx-auto text-lg">
            If you are experiencing a life-threatening medical emergency, do not wait. Dispatch an ambulance immediately.
          </p>
          
          {!sosActive ? (
            <button 
              onClick={handleSosClick}
              className="bg-white text-red-600 text-2xl font-bold px-12 py-5 rounded-full shadow-2xl transition-transform transform hover:scale-105 active:scale-95 flex items-center mx-auto ring-4 ring-white/30"
            >
              <Phone className="w-7 h-7 mr-3" /> CALL AMBULANCE
            </button>
          ) : (
            <div className="flex flex-col items-center justify-center animate-in zoom-in duration-300">
              <div className="w-24 h-24 bg-white text-red-600 rounded-full flex items-center justify-center text-5xl font-black mb-4 shadow-2xl ring-8 ring-white/50 animate-pulse">
                {countdown}
              </div>
              <button 
                onClick={cancelSos}
                className="flex items-center text-white bg-red-800 hover:bg-red-900 px-6 py-2 rounded-full font-medium transition-colors"
              >
                <X className="w-4 h-4 mr-1.5" /> Cancel Request
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-rose-100">
          <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center">
            <Heart className="w-6 h-6 mr-2 text-rose-500" /> Emergency Contacts
          </h2>
          <ul className="space-y-4">
            <li className="flex justify-between items-center p-4 bg-gray-50 rounded-xl hover:bg-rose-50 transition-colors border border-transparent hover:border-rose-100">
              <div>
                <p className="font-bold text-gray-900 text-lg">John Doe <span className="text-sm font-medium text-gray-500 font-normal ml-1">(Husband)</span></p>
                <p className="text-gray-600 font-medium">+1 (234) 567-8900</p>
              </div>
              <button className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center hover:bg-green-200 transition-colors shadow-sm"><Phone className="w-5 h-5" /></button>
            </li>
            <li className="flex justify-between items-center p-4 bg-gray-50 rounded-xl hover:bg-rose-50 transition-colors border border-transparent hover:border-rose-100">
              <div>
                <p className="font-bold text-gray-900 text-lg">Dr. Smith <span className="text-sm font-medium text-gray-500 font-normal ml-1">(Primary Care)</span></p>
                <p className="text-gray-600 font-medium">+1 (098) 765-4321</p>
              </div>
              <button className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center hover:bg-green-200 transition-colors shadow-sm"><Phone className="w-5 h-5" /></button>
            </li>
          </ul>
          <Button variant="outline" className="w-full mt-4 text-rose-600 border-rose-200 hover:bg-rose-50">Manage Contacts</Button>
        </Card>

        <Card className="border-blue-100">
          <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center">
            <MapPin className="w-6 h-6 mr-2 text-blue-500" /> Nearest Hospitals
          </h2>
          <ul className="space-y-4">
            <li className="flex justify-between items-center p-4 border border-gray-100 rounded-xl hover:border-blue-200 hover:bg-blue-50/30 transition-colors">
              <div>
                <p className="font-bold text-gray-900 text-lg">City General Hospital</p>
                <p className="text-sm text-gray-500 font-medium">1.2 miles away • Open 24/7</p>
              </div>
              <button className="flex items-center text-blue-700 hover:text-blue-900 bg-blue-100 px-4 py-2 rounded-lg font-bold transition-colors">
                <Navigation className="w-4 h-4 mr-2" /> Navigate
              </button>
            </li>
            <li className="flex justify-between items-center p-4 border border-gray-100 rounded-xl hover:border-blue-200 hover:bg-blue-50/30 transition-colors">
              <div>
                <p className="font-bold text-gray-900 text-lg">Mercy Medical Center</p>
                <p className="text-sm text-gray-500 font-medium">3.5 miles away • Open 24/7</p>
              </div>
              <button className="flex items-center text-blue-700 hover:text-blue-900 bg-blue-100 px-4 py-2 rounded-lg font-bold transition-colors">
                <Navigation className="w-4 h-4 mr-2" /> Navigate
              </button>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default Emergency;
