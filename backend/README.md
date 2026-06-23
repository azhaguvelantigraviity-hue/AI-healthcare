# 🏥 HealthCare AI System — Production Backend

A complete Node.js + Express + MongoDB backend for the AI Healthcare Assistant System with JWT auth, Cloudinary file uploads, AI integrations (Claude + Gemini), real-time sockets, email notifications, and scheduled jobs.

---

## 📁 Project Structure

```
healthcare-backend/
├── config/
│   ├── database.js          # MongoDB connection
│   └── cloudinary.js        # Cloudinary + Multer config
├── controllers/
│   ├── authController.js    # Register, login, password reset
│   ├── appointmentController.js
│   ├── reportController.js  # Medical reports + AI analysis
│   ├── prescriptionController.js # Prescriptions + reminders
│   ├── patientController.js # Patient profile + admin
│   ├── doctorController.js  # Doctor profiles + dashboard
│   └── aiController.js      # AI chat, symptoms, tips, risks
├── middleware/
│   ├── auth.js              # JWT protect + RBAC authorize
│   ├── asyncHandler.js      # Async wrapper
│   ├── errorHandler.js      # Global error handler
│   └── validator.js         # express-validator rules
├── models/
│   ├── User.js              # Auth + profile base model
│   ├── Patient.js           # Patient health profile
│   ├── Doctor.js            # Doctor profile + availability
│   ├── Appointment.js       # Appointments
│   ├── MedicalReport.js     # Reports + AI analysis
│   ├── Prescription.js      # Prescriptions
│   └── index.js             # Notification, AIChatHistory, Reminder, ActivityLog
├── routes/
│   ├── auth.js
│   ├── appointments.js
│   └── index.js             # All other routes
├── services/
│   ├── aiService.js         # Claude + Gemini AI integrations
│   ├── emailService.js      # Nodemailer email service
│   ├── notificationService.js
│   └── schedulerService.js  # node-cron jobs
├── utils/
│   ├── logger.js            # Winston logger
│   ├── errorResponse.js     # Error class
│   └── seeder.js            # DB seeder
├── logs/                    # Auto-created log files
├── uploads/                 # Local upload fallback
├── .env.example
├── package.json
└── server.js                # Entry point
```

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd healthcare-backend
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your actual values
```

### 3. Seed Database
```bash
npm run seed
```

### 4. Start Server
```bash
# Development
npm run dev

# Production
npm start
```

---

## 🔑 Demo Credentials (after seeding)

| Role    | Email                    | Password     |
|---------|--------------------------|--------------|
| Admin   | admin@healthsys.com      | Admin@123    |
| Doctor  | sarah@healthsys.com      | Doctor@123   |
| Doctor  | michael@healthsys.com    | Doctor@123   |
| Patient | james@email.com          | Patient@123  |
| Patient | emma@email.com           | Patient@123  |

---

## 📡 API Reference

### Base URL: `http://localhost:5000/api`

---

### 🔐 Auth

| Method | Route                          | Access  | Description              |
|--------|-------------------------------|---------|--------------------------|
| POST   | `/auth/register`               | Public  | Register new user        |
| POST   | `/auth/login`                  | Public  | Login, returns JWT       |
| POST   | `/auth/logout`                 | Private | Logout                   |
| GET    | `/auth/me`                     | Private | Get current user         |
| PUT    | `/auth/updateprofile`          | Private | Update profile           |
| PUT    | `/auth/updatepassword`         | Private | Change password          |
| PUT    | `/auth/avatar`                 | Private | Upload avatar (multipart)|
| POST   | `/auth/forgotpassword`         | Public  | Send reset email         |
| PUT    | `/auth/resetpassword/:token`   | Public  | Reset password           |
| GET    | `/auth/verifyemail/:token`     | Public  | Verify email             |

**Register body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password@123",
  "role": "patient",
  "phone": "+1234567890"
}
```
For doctors, also include: `"specialization": "Cardiology", "licenseNumber": "LIC123"`

**Login response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5...",
  "data": { "_id": "...", "name": "...", "email": "...", "role": "patient" }
}
```

---

### 📅 Appointments

All routes require `Authorization: Bearer <token>`.

| Method | Route                              | Access          | Description              |
|--------|------------------------------------|-----------------|--------------------------|
| GET    | `/appointments`                    | All             | List (role-filtered)     |
| POST   | `/appointments`                    | Patient         | Book appointment         |
| GET    | `/appointments/today`              | Doctor, Admin   | Today's schedule         |
| GET    | `/appointments/slots/:doctorId`    | All             | Get available time slots |
| GET    | `/appointments/:id`                | All             | Single appointment       |
| PUT    | `/appointments/:id/status`         | All             | Update status            |
| PUT    | `/appointments/:id/reschedule`     | All             | Reschedule               |
| DELETE | `/appointments/:id`                | Admin           | Delete                   |

**Book appointment:**
```json
{
  "doctor": "doctor_user_id",
  "appointmentDate": "2026-07-01",
  "appointmentTime": "10:00",
  "reason": "Chest pain",
  "type": "general",
  "mode": "in-person"
}
```

**Get slots:** `GET /appointments/slots/:doctorId?date=2026-07-01`

---

### 👨‍⚕️ Doctors

| Method | Route                    | Access  | Description         |
|--------|--------------------------|---------|---------------------|
| GET    | `/doctors`               | Public  | List doctors        |
| GET    | `/doctors/specializations`| Public | List specialties    |
| GET    | `/doctors/:id`           | Public  | Doctor details      |
| GET    | `/doctors/profile/me`    | Doctor  | Own profile         |
| GET    | `/doctors/dashboard`     | Doctor  | Dashboard stats     |
| GET    | `/doctors/patients`      | Doctor  | My patients         |
| PUT    | `/doctors/profile`       | Doctor  | Update profile      |
| POST   | `/doctors/:id/rate`      | Patient | Rate doctor (1-5)   |

**Query filters:** `?specialization=Cardiology&minRating=4&page=1&limit=12`

---

### 🧑‍⚕️ Patients

| Method | Route                  | Access          | Description         |
|--------|------------------------|-----------------|---------------------|
| GET    | `/patients/dashboard`  | Patient         | Dashboard stats     |
| GET    | `/patients/profile`    | Patient         | Own profile         |
| PUT    | `/patients/profile`    | Patient         | Update profile      |
| GET    | `/patients/vitals`     | All             | Vitals history      |
| POST   | `/patients/vitals`     | Patient, Doctor | Add vitals          |
| GET    | `/patients`            | Doctor, Admin   | All patients list   |

---

### 🤖 AI Features

| Method | Route                     | Access  | Description              |
|--------|---------------------------|---------|--------------------------|
| POST   | `/ai/chat`                | All     | AI health chatbot        |
| POST   | `/ai/symptoms`            | All     | Symptom analysis         |
| GET    | `/ai/health-tips`         | Patient | Personalized tips        |
| GET    | `/ai/risk-detection`      | Patient | Health risk detection    |
| POST   | `/ai/recommend-doctor`    | Patient | AI doctor recommendation |
| GET    | `/ai/history`             | All     | Chat history             |
| GET    | `/ai/history/:sessionId`  | All     | Single chat session      |

**Chat body:**
```json
{
  "message": "I have a headache and fever for 2 days",
  "sessionId": "optional-uuid-to-continue-session",
  "chatHistory": [
    {"role": "user", "content": "previous message"},
    {"role": "assistant", "content": "previous response"}
  ]
}
```

**Symptom analysis body:**
```json
{
  "symptoms": ["headache", "fever", "fatigue", "nausea"],
  "duration": "2 days",
  "severity": 7
}
```

---

### 📄 Medical Reports

| Method | Route                   | Access          | Description         |
|--------|-------------------------|-----------------|---------------------|
| GET    | `/reports`              | All             | List reports        |
| POST   | `/reports`              | All             | Upload (multipart)  |
| GET    | `/reports/:id`          | All             | Single report       |
| POST   | `/reports/:id/analyze`  | All             | AI analysis         |
| PUT    | `/reports/:id/share`    | Patient         | Share with doctor   |
| PUT    | `/reports/:id`          | All             | Update              |
| DELETE | `/reports/:id`          | All             | Delete              |

**Upload report (multipart/form-data):**
- `file`: PDF or image file
- `title`: Report title
- `reportType`: `lab|xray|mri|ct-scan|ultrasound|ecg|prescription|discharge|other`
- `description`, `reportDate`, `labName`, `doctorName`

---

### 💊 Prescriptions & Reminders

| Method | Route                                  | Access  | Description         |
|--------|----------------------------------------|---------|---------------------|
| GET    | `/prescriptions`                       | All     | List prescriptions  |
| POST   | `/prescriptions`                       | Doctor  | Create prescription |
| GET    | `/prescriptions/:id`                   | All     | Single prescription |
| PUT    | `/prescriptions/:id`                   | Doctor  | Update status       |
| GET    | `/prescriptions/reminders`             | Patient | My reminders        |
| POST   | `/prescriptions/reminders`             | Patient | Add reminder        |
| PUT    | `/prescriptions/reminders/:id/adherence`| Patient| Log adherence      |
| DELETE | `/prescriptions/reminders/:id`         | Patient | Delete reminder     |

---

### 🔔 Notifications

| Method | Route                     | Access  | Description          |
|--------|---------------------------|---------|----------------------|
| GET    | `/notifications`          | All     | My notifications     |
| PUT    | `/notifications/:id/read` | All     | Mark one as read     |
| PUT    | `/notifications/read-all` | All     | Mark all as read     |
| DELETE | `/notifications/:id`      | All     | Delete notification  |

**Query:** `?page=1&limit=20&unreadOnly=true`

---

### 👑 Admin

| Method | Route                       | Access | Description        |
|--------|-----------------------------|--------|--------------------|
| GET    | `/admin/dashboard`          | Admin  | System stats       |
| GET    | `/admin/users`              | Admin  | All users          |
| PUT    | `/admin/users/:id/status`   | Admin  | Suspend/activate   |
| DELETE | `/admin/users/:id`          | Admin  | Delete user        |
| GET    | `/admin/activity-logs`      | Admin  | Activity logs      |
| GET    | `/admin/analytics`          | Admin  | Analytics data     |

---

## 🔌 Frontend Integration (React)

```javascript
// api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});

// Attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto logout on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;

// Usage examples
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/updateprofile', data),
};

export const appointmentAPI = {
  getAll: (params) => api.get('/appointments', { params }),
  book: (data) => api.post('/appointments', data),
  getSlots: (doctorId, date) => api.get(`/appointments/slots/${doctorId}`, { params: { date } }),
  updateStatus: (id, data) => api.put(`/appointments/${id}/status`, data),
};

export const aiAPI = {
  chat: (data) => api.post('/ai/chat', data),
  analyzeSymptoms: (data) => api.post('/ai/symptoms', data),
  getHealthTips: () => api.get('/ai/health-tips'),
  detectRisks: () => api.get('/ai/risk-detection'),
};
```

---

## 🔐 Security Features

- **JWT** with httpOnly cookies + Bearer token
- **bcrypt** password hashing (rounds: 12)
- **Account lockout** after 5 failed attempts (2hr lock)
- **Rate limiting** — global (100/15min) + auth (10/15min) + AI (20/15min)
- **Helmet** security headers
- **MongoDB sanitization** (prevent NoSQL injection)
- **XSS protection**
- **HTTP Parameter Pollution** prevention
- **Input validation** with express-validator
- **Role-Based Access Control** (patient / doctor / admin)

---

## ⏰ Scheduled Jobs (node-cron)

| Schedule        | Job                              |
|-----------------|----------------------------------|
| 8:00 AM daily   | Send appointment reminders       |
| Every hour      | Send medicine reminders          |
| Every 30 min    | Mark missed appointments as no-show |
| 12:00 AM daily  | Expire old prescriptions         |
| 11:00 PM daily  | Update adherence rates           |
| 2:00 AM Sunday  | Clean old read notifications     |

---

## 🌐 Real-Time (Socket.IO)

Connect from frontend:
```javascript
import { io } from 'socket.io-client';
const socket = io('http://localhost:5000');
socket.emit('join', userId);
socket.on('receive_message', (msg) => console.log(msg));
```

---

## 📧 Email Templates

- Welcome email on registration
- Email verification
- Password reset
- Appointment confirmation
- Appointment reminder
- Medicine reminder
- Critical report alert
