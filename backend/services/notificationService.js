const { Notification } = require('../models/index');
const emailService = require('./emailService');
const logger = require('../utils/logger');

class NotificationService {
  // Create in-app notification
  async create({ userId, title, message, type = 'general', priority = 'normal', link, metadata, channels = {} }) {
    try {
      const notification = await Notification.create({
        user: userId,
        title,
        message,
        type,
        priority,
        link,
        metadata,
        channels: { inApp: true, email: false, sms: false, ...channels },
      });
      return notification;
    } catch (error) {
      logger.error(`Failed to create notification: ${error.message}`);
    }
  }

  // Send appointment notification
  async appointmentBooked(patient, doctor, appointment) {
    await this.create({
      userId: patient._id,
      title: 'Appointment Booked',
      message: `Your appointment with Dr. ${doctor.name} on ${new Date(appointment.appointmentDate).toDateString()} at ${appointment.appointmentTime} is pending confirmation.`,
      type: 'appointment',
      priority: 'normal',
      link: '/appointments',
      metadata: { appointmentId: appointment._id, senderId: doctor._id, receiverId: patient._id, status: 'Pending' },
    });

    // Notify doctor
    await this.create({
      userId: doctor._id,
      title: 'New Appointment Request',
      message: `${patient.name} has booked an appointment on ${new Date(appointment.appointmentDate).toDateString()} at ${appointment.appointmentTime}.`,
      type: 'appointment',
      priority: 'normal',
      link: '/doctor/appointments',
      metadata: { appointmentId: appointment._id, senderId: patient._id, receiverId: doctor._id, status: 'Pending' },
    });

    // Send email if enabled
    if (patient.preferences?.notifications?.email) {
      try {
        await emailService.sendAppointmentConfirmation(appointment, patient, doctor);
      } catch (e) {
        logger.error(`Appointment email error: ${e.message}`);
      }
    }
  }

  // Appointment status change
  async appointmentStatusChanged(patient, doctor, appointment, newStatus, senderId = doctor._id) {
    const messages = {
      confirmed: `Your appointment with Dr. ${doctor.name} has been confirmed for ${new Date(appointment.appointmentDate).toDateString()} at ${appointment.appointmentTime}.`,
      cancelled: `Your appointment with Dr. ${doctor.name} on ${new Date(appointment.appointmentDate).toDateString()} has been cancelled.`,
      rejected: `Your appointment request has been rejected by Dr. ${doctor.name}. Please select another available time or doctor.`,
      completed: `Your appointment with Dr. ${doctor.name} has been completed. Thank you for visiting!`,
      rescheduled: `Your appointment with Dr. ${doctor.name} has been rescheduled.`,
    };

    if (messages[newStatus]) {
      await this.create({
        userId: patient._id,
        title: `Appointment ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`,
        message: messages[newStatus],
        type: 'appointment',
        priority: (newStatus === 'cancelled' || newStatus === 'rejected') ? 'high' : 'normal',
        link: '/appointments',
        metadata: { appointmentId: appointment._id, status: newStatus, senderId, receiverId: patient._id },
      });
    }
  }

  // New prescription notification
  async prescriptionCreated(patient, doctor, prescription) {
    await this.create({
      userId: patient._id,
      title: 'New Prescription Available',
      message: `Dr. ${doctor.name} has created a new prescription for you. Please check your prescriptions section.`,
      type: 'prescription',
      priority: 'high',
      link: '/prescriptions',
      metadata: { prescriptionId: prescription._id },
    });
  }

  // Report uploaded notification
  async reportUploaded(patientId, reportTitle) {
    await this.create({
      userId: patientId,
      title: 'Medical Report Uploaded',
      message: `Your report "${reportTitle}" has been uploaded successfully.`,
      type: 'report',
      priority: 'normal',
      link: '/reports',
    });
  }

  // Critical report alert
  async criticalReportAlert(patient, report) {
    await this.create({
      userId: patient._id,
      title: '⚠️ Critical Report Alert',
      message: `Your report "${report.title}" has been flagged as critical. Please contact your doctor immediately.`,
      type: 'ai_alert',
      priority: 'urgent',
      link: '/reports',
      metadata: { reportId: report._id },
    });

    try {
      await emailService.sendCriticalReportAlert(patient, report);
    } catch (e) {
      logger.error(`Critical alert email error: ${e.message}`);
    }
  }

  // Medicine reminder notification
  async medicineReminder(patient, medicines) {
    await this.create({
      userId: patient._id,
      title: '💊 Time to take your medicine',
      message: `Reminder: ${medicines.map((m) => m.name).join(', ')}`,
      type: 'reminder',
      priority: 'high',
      link: '/reminders',
    });
  }

  // Get user notifications
  async getUserNotifications(userId, { page = 1, limit = 20, unreadOnly = false } = {}) {
    const query = { user: userId };
    if (unreadOnly) query.isRead = false;

    const total = await Notification.countDocuments(query);
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const unreadCount = await Notification.countDocuments({ user: userId, isRead: false });

    return { notifications, total, unreadCount, page, pages: Math.ceil(total / limit) };
  }

  // Mark as read
  async markRead(notificationId, userId) {
    return Notification.findOneAndUpdate(
      { _id: notificationId, user: userId },
      { isRead: true, readAt: new Date() },
      { new: true }
    );
  }

  // Mark all as read
  async markAllRead(userId) {
    return Notification.updateMany(
      { user: userId, isRead: false },
      { isRead: true, readAt: new Date() }
    );
  }
}

module.exports = new NotificationService();
