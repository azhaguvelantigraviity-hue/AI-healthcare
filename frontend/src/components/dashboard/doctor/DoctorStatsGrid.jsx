import React from 'react';
import { Users, Calendar, Clock, TrendingUp } from 'lucide-react';
import { Skeleton } from '../../ui/Skeleton';

const StatCard = ({ title, value, icon: Icon, trend, subtitle, colorClass, loading, onClick }) => {
  if (loading) {
    return <Skeleton className="h-32 w-full rounded-2xl" />;
  }

  return (
    <div 
      onClick={onClick}
      className={`bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-800 transition-all hover:shadow-md hover:-translate-y-1 ${onClick ? 'cursor-pointer hover:border-primary-200' : ''}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${colorClass}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-4 flex items-center text-sm">
        {trend && (
          <span className={`font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'} flex items-center`}>
            {trend > 0 ? '+' : ''}{trend}%
            <TrendingUp className={`w-3 h-3 ml-1 ${trend < 0 ? 'rotate-180' : ''}`} />
          </span>
        )}
        <span className="text-gray-500 dark:text-gray-400 ml-2">{subtitle}</span>
      </div>
    </div>
  );
};

const DoctorStatsGrid = ({ stats, loading, onCardClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard 
        title="Today's Appointments" 
        value={stats?.todaysAppointments || 0} 
        icon={Calendar} 
        colorClass="bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
        subtitle={`${stats?.pendingAppointments || 0} pending`}
        loading={loading}
        onClick={() => onCardClick && onCardClick('today')}
      />
      <StatCard 
        title="Pending Consultations" 
        value={stats?.pendingAppointments || 0} 
        icon={Clock} 
        colorClass="bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
        subtitle="Needs review"
        loading={loading}
        onClick={() => onCardClick && onCardClick('pending')}
      />
      <StatCard 
        title="Total Appointments" 
        value={stats?.totalAppointments || 0} 
        icon={Calendar} 
        colorClass="bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400"
        subtitle="All time"
        loading={loading}
        onClick={() => onCardClick && onCardClick('total')}
      />
      <StatCard 
        title="Total Patients" 
        value={stats?.totalPatients || 0} 
        icon={Users} 
        colorClass="bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
        trend={5.2}
        subtitle="this month"
        loading={loading}
        onClick={() => onCardClick && onCardClick('patients')}
      />
    </div>
  );
};

export default DoctorStatsGrid;
