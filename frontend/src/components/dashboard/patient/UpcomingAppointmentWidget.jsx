import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Video, User } from 'lucide-react';
import { Card, Button } from '../../ui/SharedUI';
import { colors } from '../../../theme/colors';

const UpcomingAppointmentWidget = ({ nextAppt, loading }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <Card>
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  if (!nextAppt) {
    return (
      <Card>
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
            <Calendar className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-gray-900 font-semibold mb-1">No Upcoming Appointments</h3>
          <p className="text-sm text-gray-500 mb-4">You have no scheduled visits.</p>
          <Button size="sm" onClick={() => navigate("/dashboard/appointments")}>Book Now</Button>
        </div>
      </Card>
    );
  }

  return (
    <Card style={{ borderLeft: `4px solid ${colors.primary}` }}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-gray-900 text-lg flex items-center">
            Upcoming Visit
            {nextAppt.type === 'video' && <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full flex items-center"><Video className="w-3 h-3 mr-1"/> Telehealth</span>}
          </h3>
          <p className="text-sm text-gray-500 mt-1">{nextAppt.reasonForVisit || 'General Consultation'}</p>
        </div>
        <div className="bg-primary-50 text-primary-700 px-3 py-1.5 rounded-lg text-center">
          <div className="text-xs font-semibold uppercase">{new Date(nextAppt.appointmentDate || nextAppt.date).toLocaleDateString('en-US', { month: 'short' })}</div>
          <div className="text-xl font-bold">{new Date(nextAppt.appointmentDate || nextAppt.date).getDate()}</div>
        </div>
      </div>
      
      <div className="space-y-3 mb-5">
        <div className="flex items-center text-sm text-gray-600">
          <User className="w-4 h-4 mr-2 text-gray-400" />
          <span>Dr. {nextAppt.doctor?.name || nextAppt.doctorName || 'Assigned Doctor'}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="w-4 h-4 mr-2 text-gray-400" />
          <span>{nextAppt.appointmentTime || nextAppt.timeSlot}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="primary" className="flex-1" onClick={() => navigate("/dashboard/appointments")}>Details</Button>
        <Button variant="outline" className="flex-1" onClick={() => navigate("/dashboard/appointments")}>Reschedule</Button>
      </div>
    </Card>
  );
};

export default UpcomingAppointmentWidget;
