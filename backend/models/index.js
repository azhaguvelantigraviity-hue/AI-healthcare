const mongoose = require('mongoose');

// =====================
// NOTIFICATION MODEL
// =====================
const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ['appointment', 'prescription', 'report', 'reminder', 'system', 'ai_alert', 'general'],
      default: 'general',
    },
    priority: { type: String, enum: ['low', 'normal', 'high', 'urgent'], default: 'normal' },
    isRead: { type: Boolean, default: false },
    readAt: Date,
    link: String, // frontend route to navigate to
    metadata: mongoose.Schema.Types.Mixed,
    channels: {
      inApp: { type: Boolean, default: true },
      email: { type: Boolean, default: false },
      sms: { type: Boolean, default: false },
    },
    emailSent: { type: Boolean, default: false },
    smsSent: { type: Boolean, default: false },
    expiresAt: Date,
  },
  { timestamps: true }
);

notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index

const Notification = mongoose.model('Notification', notificationSchema);

// =====================
// AI CHAT HISTORY MODEL
// =====================
const aiChatHistorySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sessionId: { type: String, required: true },
    chatType: {
      type: String,
      enum: ['health_chat', 'symptom_check', 'report_analysis', 'general'],
      default: 'health_chat',
    },
    messages: [
      {
        role: { type: String, enum: ['user', 'assistant'], required: true },
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        tokensUsed: Number,
        model: String,
      },
    ],
    summary: String,
    symptoms: [String],
    aiRecommendations: [String],
    urgencyLevel: { type: String, enum: ['low', 'moderate', 'high', 'emergency'] },
    totalTokensUsed: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    endedAt: Date,
  },
  { timestamps: true }
);

aiChatHistorySchema.index({ user: 1, createdAt: -1 });
aiChatHistorySchema.index({ sessionId: 1 });

const AIChatHistory = mongoose.model('AIChatHistory', aiChatHistorySchema);

// =====================
// MEDICINE REMINDER MODEL
// =====================
const medicineReminderSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    prescription: { type: mongoose.Schema.Types.ObjectId, ref: 'Prescription' },
    medicineName: { type: String, required: true },
    dosage: String,
    frequency: { type: String, required: true },
    times: [String], // ["08:00", "14:00", "20:00"]
    startDate: { type: Date, required: true },
    endDate: Date,
    instructions: String,
    isActive: { type: Boolean, default: true },
    adherenceLog: [
      {
        scheduledTime: Date,
        takenAt: Date,
        status: { type: String, enum: ['taken', 'missed', 'skipped'], default: 'missed' },
        notes: String,
      },
    ],
    notificationEnabled: { type: Boolean, default: true },
    adherenceRate: { type: Number, default: 0 }, // percentage
  },
  { timestamps: true }
);

medicineReminderSchema.index({ patient: 1, isActive: 1 });

const MedicineReminder = mongoose.model('MedicineReminder', medicineReminderSchema);

// =====================
// ACTIVITY LOG MODEL
// =====================
const activityLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    action: { type: String, required: true },
    resource: String,
    resourceId: mongoose.Schema.Types.ObjectId,
    details: String,
    ipAddress: String,
    userAgent: String,
    method: String,
    statusCode: Number,
    responseTime: Number,
    isSuccess: { type: Boolean, default: true },
  },
  { timestamps: true }
);

activityLogSchema.index({ user: 1, createdAt: -1 });
activityLogSchema.index({ action: 1, createdAt: -1 });

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

module.exports = { Notification, AIChatHistory, MedicineReminder, ActivityLog };
