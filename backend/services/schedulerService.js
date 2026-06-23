const cron = require('node-cron');
const Appointment = require('../models/Appointment');
const { MedicineReminder, Notification } = require('../models/index');
const User = require('../models/User');
const emailService = require('./emailService');
const notificationService = require('./notificationService');
const logger = require('../utils/logger');

class SchedulerService {
  init(io) {
    this.io = io;
    logger.info('⏰ Starting scheduler service...');

    // Check upcoming appointments for real-time reminders - runs every minute
    cron.schedule('* * * * *', () => this.checkUpcomingAppointments());

    // Send appointment reminders - runs at 8 AM daily
    cron.schedule('0 8 * * *', () => this.sendAppointmentReminders(), { timezone: 'UTC' });

    // Send medicine reminders - runs every hour
    cron.schedule('0 * * * *', () => this.sendMedicineReminders());

    // Mark missed appointments - runs every 30 min
    cron.schedule('*/30 * * * *', () => this.markMissedAppointments());

    // Clean old notifications - runs at 2 AM on Sundays
    cron.schedule('0 2 * * 0', () => this.cleanOldNotifications());

    // Update prescription statuses - runs at midnight daily
    cron.schedule('0 0 * * *', () => this.updateExpiredPrescriptions());

    // Update adherence rates - runs at 11 PM daily
    cron.schedule('0 23 * * *', () => this.updateAdherenceRates());

    logger.info('✅ Scheduler service started');
  }

  async checkUpcomingAppointments() {
    try {
      const now = new Date();
      const startOfDay = new Date(now);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59, 999);

      const upcoming = await Appointment.find({
        status: 'confirmed',
        appointmentDate: { $gte: startOfDay, $lte: endOfDay }
      }).populate('patient', 'name email').populate('doctor', 'name email');

      for (const apt of upcoming) {
        if (!apt.appointmentTime) continue;
        
        const [hours, minutes] = apt.appointmentTime.split(':').map(Number);
        const aptDateTime = new Date(apt.appointmentDate);
        aptDateTime.setHours(hours, minutes, 0, 0);

        const diffMinutes = Math.round((aptDateTime.getTime() - now.getTime()) / 60000);

        if ([15, 10, 5].includes(diffMinutes)) {
          // Check if we already sent THIS specific reminder to avoid spam within the exact minute
          const existingNotif = await Notification.findOne({
            user: apt.patient._id,
            'metadata.appointmentId': apt._id,
            'metadata.reminderTime': diffMinutes
          });

          if (!existingNotif) {
            await this.sendRealTimeReminder(apt, diffMinutes);
          }
        }
      }
    } catch (error) {
      logger.error(`Check upcoming appointments error: ${error.message}`);
    }
  }

  async sendRealTimeReminder(appointment, minutesLeft) {
    const isOnline = appointment.mode === 'video';
    const message = isOnline 
      ? `Your appointment with Dr. ${appointment.doctor.name} is starting in ${minutesLeft} minutes. Please join the consultation on time.`
      : `Your hospital visit with Dr. ${appointment.doctor.name} is scheduled in ${minutesLeft} minutes. Please reach the hospital on time.`;

    await notificationService.create({
      userId: appointment.patient._id,
      title: isOnline ? '📹 Online Appointment Reminder' : '🏥 Hospital Visit Reminder',
      message: message,
      type: 'reminder',
      priority: 'high',
      link: '/appointments',
      metadata: { 
        appointmentId: appointment._id, 
        senderId: appointment.doctor._id,
        receiverId: appointment.patient._id,
        status: 'reminder',
        reminderTime: minutesLeft 
      },
    });

    if (this.io) {
      this.io.to(`user_${appointment.patient._id.toString()}`).emit('appointment_reminder', {
        title: '🔔 Appointment Reminder',
        message: message,
        type: 'reminder',
        appointment: appointment,
        minutesLeft: minutesLeft
      });
    }
  }

  async sendAppointmentReminders() {
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dayAfter = new Date(tomorrow);
      dayAfter.setDate(dayAfter.getDate() + 1);

      const upcomingAppointments = await Appointment.find({
        appointmentDate: { $gte: tomorrow, $lt: dayAfter },
        status: { $in: ['pending', 'confirmed'] },
        reminderSent: false,
      })
        .populate('patient', 'name email preferences')
        .populate('doctor', 'name email');

      for (const appointment of upcomingAppointments) {
        // In-app notification
        await notificationService.create({
          userId: appointment.patient._id,
          title: '⏰ Appointment Tomorrow',
          message: `Reminder: You have an appointment with Dr. ${appointment.doctor.name} tomorrow at ${appointment.appointmentTime}.`,
          type: 'appointment',
          priority: 'high',
          link: '/appointments',
          metadata: { appointmentId: appointment._id },
        });

        // Email reminder
        if (appointment.patient.preferences?.notifications?.email) {
          try {
            await emailService.sendAppointmentReminder(appointment, appointment.patient, appointment.doctor);
          } catch (emailErr) {
            logger.error(`Appointment reminder email error: ${emailErr.message}`);
          }
        }

        appointment.reminderSent = true;
        await appointment.save();
      }

      if (upcomingAppointments.length > 0) {
        logger.info(`Sent ${upcomingAppointments.length} appointment reminders`);
      }
    } catch (error) {
      logger.error(`Appointment reminder job error: ${error.message}`);
    }
  }

  async sendMedicineReminders() {
    try {
      const now = new Date();
      const currentHour = String(now.getHours()).padStart(2, '0');
      const currentMinute = String(now.getMinutes()).padStart(2, '0');
      const currentTime = `${currentHour}:${currentMinute}`;

      // Round to nearest 30 minutes for matching
      const roundedMinutes = now.getMinutes() < 30 ? '00' : '30';
      const roundedTime = `${currentHour}:${roundedMinutes}`;

      const reminders = await MedicineReminder.find({
        isActive: true,
        notificationEnabled: true,
        startDate: { $lte: now },
        $or: [{ endDate: null }, { endDate: { $gte: now } }],
        times: { $in: [currentTime, roundedTime] },
      }).populate('patient', 'name email preferences');

      for (const reminder of reminders) {
        await notificationService.create({
          userId: reminder.patient._id,
          title: '💊 Medicine Reminder',
          message: `Time to take ${reminder.medicineName} - ${reminder.dosage}`,
          type: 'reminder',
          priority: 'high',
          link: '/reminders',
          metadata: { reminderId: reminder._id },
        });
      }

      if (reminders.length > 0) {
        logger.info(`Sent ${reminders.length} medicine reminders at ${currentTime}`);
      }
    } catch (error) {
      logger.error(`Medicine reminder job error: ${error.message}`);
    }
  }

  async markMissedAppointments() {
    try {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const result = await Appointment.updateMany(
        {
          appointmentDate: { $lt: oneHourAgo },
          status: { $in: ['pending', 'confirmed'] },
        },
        { status: 'no-show' }
      );

      if (result.modifiedCount > 0) {
        logger.info(`Marked ${result.modifiedCount} appointments as no-show`);
      }
    } catch (error) {
      logger.error(`Mark missed appointments error: ${error.message}`);
    }
  }

  async cleanOldNotifications() {
    try {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const result = await Notification.deleteMany({
        createdAt: { $lt: thirtyDaysAgo },
        isRead: true,
      });
      logger.info(`Cleaned ${result.deletedCount} old notifications`);
    } catch (error) {
      logger.error(`Clean notifications error: ${error.message}`);
    }
  }

  async updateExpiredPrescriptions() {
    try {
      const Prescription = require('../models/Prescription');
      const result = await Prescription.updateMany(
        { validUntil: { $lt: new Date() }, status: 'active' },
        { status: 'expired' }
      );
      if (result.modifiedCount > 0) {
        logger.info(`Marked ${result.modifiedCount} prescriptions as expired`);
      }
    } catch (error) {
      logger.error(`Update prescriptions error: ${error.message}`);
    }
  }

  async updateAdherenceRates() {
    try {
      const reminders = await MedicineReminder.find({ isActive: true });
      for (const reminder of reminders) {
        if (reminder.adherenceLog.length > 0) {
          const taken = reminder.adherenceLog.filter((l) => l.status === 'taken').length;
          reminder.adherenceRate = Math.round((taken / reminder.adherenceLog.length) * 100);
          await reminder.save();
        }
      }
      logger.info('Updated adherence rates');
    } catch (error) {
      logger.error(`Update adherence rates error: ${error.message}`);
    }
  }
}

module.exports = new SchedulerService();
