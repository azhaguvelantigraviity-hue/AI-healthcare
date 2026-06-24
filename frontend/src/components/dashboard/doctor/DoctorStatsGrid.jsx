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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <StatCard 
        title="Total Appointments" 
        value={stats?.totalAppointments || 0} 
        icon={Calendar} 
        colorClass="bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
        subtitle="All time"
        loading={loading}
        onClick={() => onCardClick && onCardClick('total')}
      />
      <StatCard 
        title="Completed" 
        value={stats?.completedAppointments || 0} 
        icon={Users} 
        colorClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
        subtitle="Successfully finished"
        loading={loading}
        onClick={() => onCardClick && onCardClick('completed')}
      />
      <StatCard 
        title="Upcoming" 
        value={stats?.upcomingAppointments || 0} 
        icon={Clock} 
        colorClass="bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
        subtitle="Pending/Confirmed"
        loading={loading}
        onClick={() => onCardClick && onCardClick('upcoming')}
      />
      <StatCard 
        title="No-Show" 
        value={stats?.noShowAppointments || 0} 
        icon={TrendingUp} 
        colorClass="bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
        subtitle="Missed appointments"
        loading={loading}
        onClick={() => onCardClick && onCardClick('no-show')}
      />
      <StatCard 
        title="Cancelled" 
        value={stats?.cancelledAppointments || 0} 
        icon={Calendar} 
        colorClass="bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400"
        subtitle="Cancelled by user"
        loading={loading}
        onClick={() => onCardClick && onCardClick('cancelled')}
      />
    </div>
  );
};

export default DoctorStatsGrid;
