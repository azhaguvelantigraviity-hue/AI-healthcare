const axios = require('axios');
const jwt = require('jsonwebtoken');

async function testBooking() {
  try {
    // 1. Get doctor token
    const loginRes = await axios.post('https://ai-healthcare-ohi4.onrender.com/api/auth/login', {
      email: 'sarah@healthsys.com',
      password: 'Doctor@123'
    });
    const doctorToken = loginRes.data.token;
    const doctorId = loginRes.data.data._id;
    console.log('Doctor token acquired.');

    // 2. Get a patient
    const patientsRes = await axios.get('https://ai-healthcare-ohi4.onrender.com/api/patients?limit=1', {
      headers: { Authorization: `Bearer ${doctorToken}` }
    });
    const patientId = patientsRes.data.data[0]._id;
    console.log('Patient ID acquired:', patientId);

    // 3. Try to book appointment
    const payload = {
      doctor: doctorId,
      patient: patientId,
      appointmentDate: '2026-06-30',
      appointmentTime: '10:00',
      reason: 'General Checkup',
      mode: 'in-person',
      type: 'general',
      roomNumber: 'Room 101'
    };
    
    console.log('Sending payload:', payload);

    const bookRes = await axios.post('https://ai-healthcare-ohi4.onrender.com/api/appointments', payload, {
      headers: { Authorization: `Bearer ${doctorToken}` }
    });
    console.log('Success:', bookRes.data);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

testBooking();
