const { AIChatHistory } = require('../models/index');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const aiService = require('../services/aiService');
const { v4: uuidv4 } = require('uuid');

// @desc    Health chat
// @route   POST /api/ai/chat
// @access  Private
exports.healthChat = asyncHandler(async (req, res, next) => {
  const { message, sessionId, chatHistory = [] } = req.body;
  if (!message?.trim()) return next(new ErrorResponse('Message is required', 400));

  // Get patient context
  let patientContext = { name: req.user?.name || 'User' };
  if (req.user && req.user.role === 'patient') {
    const patient = await Patient.findOne({ user: req.user.id }).lean();
    if (patient) {
      patientContext = {
        name: req.user.name,
        bloodType: patient.bloodType,
        chronicConditions: patient.chronicConditions,
        currentMedications: patient.currentMedications,
        allergies: patient.allergies,
      };
    }
  }

  // Build message history
  const messages = [
    ...chatHistory.slice(-10), // last 10 messages for context
    { role: 'user', content: message },
  ];

  const aiResponse = await aiService.healthChat(messages, patientContext);

  // Save to chat history
  const currentSessionId = sessionId || uuidv4();
  let chatSession = await AIChatHistory.findOne({ user: req.user.id, sessionId: currentSessionId });

  if (!chatSession) {
    chatSession = await AIChatHistory.create({
      user: req.user.id,
      sessionId: currentSessionId,
      chatType: 'health_chat',
      messages: [],
    });
  }

  chatSession.messages.push(
    { role: 'user', content: message, timestamp: new Date() },
    { role: 'assistant', content: aiResponse.content, timestamp: new Date(), tokensUsed: aiResponse.tokensUsed, model: aiResponse.model }
  );
  chatSession.totalTokensUsed = (chatSession.totalTokensUsed || 0) + aiResponse.tokensUsed;
  await chatSession.save();

  res.status(200).json({
    success: true,
    data: {
      message: aiResponse.content,
      sessionId: currentSessionId,
      tokensUsed: aiResponse.tokensUsed,
    },
  });
});

// @desc    Analyze symptoms
// @route   POST /api/ai/symptoms
// @access  Private
exports.analyzeSymptoms = asyncHandler(async (req, res, next) => {
  const { symptoms, duration, severity } = req.body;
  if (!symptoms || !symptoms.length) return next(new ErrorResponse('At least one symptom is required', 400));

  let patientInfo = {};
  if (req.user && req.user.role === 'patient') {
    const patient = await Patient.findOne({ user: req.user.id }).lean();
    if (patient) {
      const user = await User.findById(req.user.id).lean();
      const age = user.dateOfBirth
        ? Math.floor((Date.now() - new Date(user.dateOfBirth)) / (365.25 * 24 * 60 * 60 * 1000))
        : null;
      patientInfo = {
        age,
        gender: user.gender,
        bloodType: patient.bloodType,
        chronicConditions: patient.chronicConditions,
        currentMedications: patient.currentMedications?.map((m) => m.name),
        duration,
        severity,
      };
    }
  }

  const analysis = await aiService.analyzeSymptoms(symptoms, patientInfo);

  // Save to chat history
  await AIChatHistory.create({
    user: req.user?.id || null,
    sessionId: uuidv4(),
    chatType: 'symptom_check',
    messages: [
      { role: 'user', content: `Symptoms: ${symptoms.join(', ')}. Duration: ${duration}. Severity: ${severity}/10` },
      { role: 'assistant', content: JSON.stringify(analysis) },
    ],
    symptoms,
    aiRecommendations: analysis.immediateActions || [],
    urgencyLevel: analysis.urgencyLevel,
  });

  res.status(200).json({ success: true, data: analysis });
});

// @desc    Generate health tips
// @route   GET /api/ai/health-tips
// @access  Private (patient)
exports.getHealthTips = asyncHandler(async (req, res) => {
  let patientProfile = {};
  const patient = await Patient.findOne({ user: req.user.id }).lean();
  const user = await User.findById(req.user.id).lean();

  if (patient) {
    const age = user.dateOfBirth
      ? Math.floor((Date.now() - new Date(user.dateOfBirth)) / (365.25 * 24 * 60 * 60 * 1000))
      : null;
    patientProfile = {
      age,
      chronicConditions: patient.chronicConditions,
      bmi: patient.height && patient.weight
        ? (patient.weight / Math.pow(patient.height / 100, 2)).toFixed(1)
        : null,
      exerciseFrequency: patient.exerciseFrequency,
      smokingStatus: patient.smokingStatus,
    };
  }

  const tips = await aiService.generateHealthTips(patientProfile);
  res.status(200).json({ success: true, data: tips });
});

// @desc    Detect health risks
// @route   GET /api/ai/risk-detection
// @access  Private (patient)
exports.detectRisks = asyncHandler(async (req, res) => {
  const patient = await Patient.findOne({ user: req.user.id }).lean();
  const user = await User.findById(req.user.id).lean();

  const age = user.dateOfBirth
    ? Math.floor((Date.now() - new Date(user.dateOfBirth)) / (365.25 * 24 * 60 * 60 * 1000))
    : null;

  const patientData = {
    age,
    vitals: patient?.vitals || [],
    currentMedications: patient?.currentMedications || [],
    chronicConditions: patient?.chronicConditions || [],
    bmi: patient?.height && patient?.weight
      ? (patient.weight / Math.pow(patient.height / 100, 2)).toFixed(1)
      : null,
    smokingStatus: patient?.smokingStatus,
  };

  const riskAnalysis = await aiService.detectHealthRisks(patientData);
  res.status(200).json({ success: true, data: riskAnalysis });
});

// @desc    Recommend doctors based on symptoms
// @route   POST /api/ai/recommend-doctor
// @access  Private (patient)
exports.recommendDoctor = asyncHandler(async (req, res, next) => {
  const { symptoms } = req.body;
  if (!symptoms?.length) return next(new ErrorResponse('Symptoms are required', 400));

  const patient = await Patient.findOne({ user: req.user.id }).lean();
  const user = await User.findById(req.user.id).lean();

  const doctors = await User.find({ role: 'doctor', isActive: true })
    .select('name _id')
    .lean();

  const doctorProfiles = await Doctor.find({ user: { $in: doctors.map((d) => d._id) } })
    .select('specialization rating experience')
    .populate('user', 'name')
    .lean();

  const availableDoctors = doctorProfiles.map((d) => ({
    name: d.user.name,
    specialization: d.specialization,
    rating: d.rating,
    experience: d.experience,
  }));

  const patientInfo = {
    age: user.dateOfBirth
      ? Math.floor((Date.now() - new Date(user.dateOfBirth)) / (365.25 * 24 * 60 * 60 * 1000))
      : null,
    gender: user.gender,
    chronicConditions: patient?.chronicConditions,
  };

  const recommendation = await aiService.recommendDoctor(symptoms, patientInfo, availableDoctors);
  res.status(200).json({ success: true, data: recommendation });
});

// @desc    Get chat history
// @route   GET /api/ai/history
// @access  Private
exports.getChatHistory = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, chatType } = req.query;
  const query = { user: req.user.id };
  if (chatType) query.chatType = chatType;

  const total = await AIChatHistory.countDocuments(query);
  const history = await AIChatHistory.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .select('-messages');

  res.status(200).json({ success: true, count: history.length, total, data: history });
});

// @desc    Get single chat session
// @route   GET /api/ai/history/:sessionId
// @access  Private
exports.getChatSession = asyncHandler(async (req, res, next) => {
  const session = await AIChatHistory.findOne({
    user: req.user.id,
    sessionId: req.params.sessionId,
  });
  if (!session) return next(new ErrorResponse('Chat session not found', 404));
  res.status(200).json({ success: true, data: session });
});
