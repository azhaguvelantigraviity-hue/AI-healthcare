const express = require('express');
const router = express.Router();
const { endConsultation, getConsultationByAppointment } = require('../controllers/consultationController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.post('/end', authorize('doctor'), endConsultation);
router.get('/appointment/:appointmentId', getConsultationByAppointment);

module.exports = router;
