import React from 'react';
import { Activity, ArrowRight, HeartPulse, Droplets } from 'lucide-react';
import { Card, Badge } from '../../ui/SharedUI';
import { colors } from '../../../theme/colors';

const AIInsightsWidget = () => {
  return (
    <Card className="bg-gradient-to-br from-indigo-50 to-white border-indigo-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-900 text-lg flex items-center">
          <Activity className="w-5 h-5 mr-2 text-indigo-500" /> AI Health Insights
        </h3>
        <Badge label="New" color={colors.primary} />
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-xl p-3 border border-indigo-50/50 shadow-sm flex items-start gap-3">
          <div className="mt-0.5 p-1.5 bg-blue-100 text-blue-600 rounded-md"><Droplets className="w-4 h-4"/></div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Hydration Alert</p>
            <p className="text-xs text-gray-600 mt-0.5">Your recorded water intake is below average for the past 3 days. Try drinking 2 more glasses today.</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-3 border border-indigo-50/50 shadow-sm flex items-start gap-3">
          <div className="mt-0.5 p-1.5 bg-rose-100 text-rose-600 rounded-md"><HeartPulse className="w-4 h-4"/></div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Cardio Check</p>
            <p className="text-xs text-gray-600 mt-0.5">Your recent vital signs show excellent stability. Keep up your current light exercise routine!</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AIInsightsWidget;
