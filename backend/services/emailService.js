const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT == 465,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendEmail({ to, subject, html, text }) {
    const mailOptions = {
      from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
      to,
      subject,
      html,
      text,
    };
    try {
      const info = await this.transporter.sendMail(mailOptions);
      logger.info(`Email sent to ${to}: ${info.messageId}`);
      return info;
    } catch (error) {
      logger.error(`Email failed to ${to}: ${error.message}`);
      throw error;
    }
  }

  // Welcome email
  async sendWelcome(user) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb; border-radius: 10px;">
        <div style="background: #0EA5E9; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0;">🏥 HealthCare AI</h1>
        </div>
        <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px;">
          <h2 style="color: #1e293b;">Welcome, ${user.name}!</h2>
          <p style="color: #475569;">Your account has been created successfully. You can now access all healthcare services powered by AI.</p>
          <a href="${process.env.CLIENT_URL}/login" style="display: inline-block; background: #0EA5E9; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin: 20px 0;">Login to Your Account</a>
          <p style="color: #94a3b8; font-size: 12px; margin-top: 30px;">If you did not create this account, please ignore this email.</p>
        </div>
      </div>`;
    return this.sendEmail({ to: user.email, subject: 'Welcome to HealthCare AI System', html });
  }

  // Email verification
  async sendEmailVerification(user, token) {
    const url = `${process.env.CLIENT_URL}/verify-email/${token}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #0EA5E9;">Verify Your Email Address</h2>
        <p>Hello ${user.name}, please verify your email to activate your account.</p>
        <a href="${url}" style="display: inline-block; background: #0EA5E9; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin: 20px 0;">Verify Email</a>
        <p style="color: #94a3b8;">This link expires in 24 hours.</p>
        <p style="color: #94a3b8; font-size: 12px;">Or copy: ${url}</p>
      </div>`;
    return this.sendEmail({ to: user.email, subject: 'Verify Your Email - HealthCare AI', html });
  }

  // Password reset
  async sendPasswordReset(user, token) {
    const url = `${process.env.CLIENT_URL}/reset-password/${token}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #0EA5E9;">Reset Your Password</h2>
        <p>Hello ${user.name}, you requested a password reset.</p>
        <a href="${url}" style="display: inline-block; background: #EF4444; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin: 20px 0;">Reset Password</a>
        <p style="color: #94a3b8;">This link expires in 1 hour. If you did not request this, ignore this email.</p>
      </div>`;
    return this.sendEmail({ to: user.email, subject: 'Password Reset Request - HealthCare AI', html });
  }

  // Appointment confirmation
  async sendAppointmentConfirmation(appointment, patient, doctor) {
    const date = new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #0EA5E9;">Appointment Confirmed ✅</h2>
        <p>Hello ${patient.name}, your appointment has been confirmed.</p>
        <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Doctor:</strong> Dr. ${doctor.name}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Time:</strong> ${appointment.appointmentTime}</p>
          <p><strong>Type:</strong> ${appointment.type}</p>
          <p><strong>Mode:</strong> ${appointment.mode}</p>
          ${appointment.meetingLink ? `<p><strong>Meeting Link:</strong> <a href="${appointment.meetingLink}">${appointment.meetingLink}</a></p>` : ''}
        </div>
        <p style="color: #94a3b8;">Please arrive 10 minutes early for in-person appointments.</p>
      </div>`;
    return this.sendEmail({
      to: patient.email,
      subject: `Appointment Confirmed - ${date}`,
      html,
    });
  }

  // Appointment reminder
  async sendAppointmentReminder(appointment, patient, doctor) {
    const date = new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #F59E0B;">⏰ Appointment Reminder</h2>
        <p>Hello ${patient.name}, this is a reminder for your upcoming appointment.</p>
        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #F59E0B;">
          <p><strong>Doctor:</strong> Dr. ${doctor.name}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Time:</strong> ${appointment.appointmentTime}</p>
        </div>
      </div>`;
    return this.sendEmail({ to: patient.email, subject: 'Appointment Reminder - HealthCare AI', html });
  }

  // Medicine reminder
  async sendMedicineReminder(patient, medicines) {
    const medicineList = medicines.map((m) => `<li>${m.name} - ${m.dosage} (${m.frequency})</li>`).join('');
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #10B981;">💊 Medicine Reminder</h2>
        <p>Hello ${patient.name}, time to take your medications:</p>
        <ul style="background: #f0fdf4; padding: 20px; border-radius: 8px; list-style: none;">${medicineList}</ul>
        <p style="color: #94a3b8;">Stay consistent with your medication schedule for best results.</p>
      </div>`;
    return this.sendEmail({ to: patient.email, subject: '💊 Medicine Reminder - HealthCare AI', html });
  }

  // Critical report alert
  async sendCriticalReportAlert(patient, report) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #EF4444;">⚠️ Critical Report Alert</h2>
        <p>Hello ${patient.name}, your recent medical report "${report.title}" has been flagged as critical.</p>
        <p>Please contact your doctor or visit the nearest healthcare facility immediately.</p>
        <div style="background: #fef2f2; padding: 20px; border-radius: 8px; border-left: 4px solid #EF4444; margin: 20px 0;">
          <p><strong>Report:</strong> ${report.title}</p>
          <p><strong>Date:</strong> ${new Date(report.reportDate).toLocaleDateString()}</p>
        </div>
        <a href="${process.env.CLIENT_URL}/reports" style="display: inline-block; background: #EF4444; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none;">View Report</a>
      </div>`;
    return this.sendEmail({ to: patient.email, subject: '⚠️ URGENT: Critical Medical Report Alert', html });
  }
}

module.exports = new EmailService();
