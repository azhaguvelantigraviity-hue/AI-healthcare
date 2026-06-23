import { useState, useEffect, useRef, useCallback } from "react";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

// ═══════════════════════════════════════════════════════════
// DESIGN TOKENS
// ═══════════════════════════════════════════════════════════
const colors = {
  primary: "#0EA5E9",
  primaryDark: "#0284C7",
  primaryLight: "#E0F2FE",
  secondary: "#6366F1",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  info: "#3B82F6",
  teal: "#14B8A6",
  purple: "#8B5CF6",
  bg: "#F8FAFC",
  surface: "#FFFFFF",
  surfaceAlt: "#F1F5F9",
  border: "#E2E8F0",
  borderLight: "#F1F5F9",
  text: "#0F172A",
  textMuted: "#64748B",
  textLight: "#94A3B8",
  sidebar: "#0F172A",
  sidebarText: "#CBD5E1",
  sidebarActive: "#0EA5E9",
};

// ═══════════════════════════════════════════════════════════
// MOCK DATABASE
// ═══════════════════════════════════════════════════════════
const DB = {
  users: [
    { id: "u1", name: "Dr. Sarah Chen", email: "sarah@healthsys.com", password: "doctor123", role: "doctor", specialty: "Cardiology", avatar: "SC", verified: true },
    { id: "u2", name: "James Wilson", email: "james@email.com", password: "patient123", role: "patient", dob: "1985-03-15", blood: "A+", avatar: "JW" },
    { id: "u3", name: "Admin User", email: "admin@healthsys.com", password: "admin123", role: "admin", avatar: "AU" },
    { id: "u4", name: "Dr. Marcus Lee", email: "marcus@healthsys.com", password: "doctor123", role: "doctor", specialty: "Neurology", avatar: "ML", verified: true },
    { id: "u5", name: "Priya Sharma", email: "priya@email.com", password: "patient123", role: "patient", dob: "1992-07-22", blood: "B+", avatar: "PS" },
  ],
  appointments: [
    { id: "a1", patientId: "u2", doctorId: "u1", date: "2025-07-15", time: "10:00", status: "confirmed", type: "Cardiology Checkup", notes: "Regular follow-up" },
    { id: "a2", patientId: "u2", doctorId: "u4", date: "2025-07-20", time: "14:00", status: "pending", type: "Neurology Consultation", notes: "Headache evaluation" },
    { id: "a3", patientId: "u5", doctorId: "u1", date: "2025-07-18", time: "11:30", status: "confirmed", type: "Cardiac Screening", notes: "" },
  ],
  reports: [
    { id: "r1", patientId: "u2", name: "Blood Panel Results", type: "Lab Report", date: "2025-06-28", status: "analyzed", summary: "All markers within normal range. Cholesterol slightly elevated at 205 mg/dL. Recommend dietary adjustments and follow-up in 3 months." },
    { id: "r2", patientId: "u2", name: "Chest X-Ray", type: "Imaging", date: "2025-07-01", status: "analyzed", summary: "No abnormalities detected. Lung fields clear. Heart size normal." },
    { id: "r3", patientId: "u5", name: "ECG Report", type: "Cardiology", date: "2025-07-05", status: "pending", summary: "" },
  ],
  prescriptions: [
    { id: "p1", patientId: "u2", doctorId: "u1", doctorName: "Dr. Sarah Chen", date: "2025-06-28", medicines: [{ name: "Atorvastatin", dose: "20mg", freq: "Once daily", duration: "90 days" }, { name: "Aspirin", dose: "81mg", freq: "Once daily", duration: "Ongoing" }], notes: "Take with food. Avoid grapefruit." },
  ],
  notifications: [
    { id: "n1", userId: "u2", message: "Your appointment with Dr. Chen is confirmed for July 15th", type: "info", read: false, time: "2h ago" },
    { id: "n2", userId: "u2", message: "Blood Panel results are ready", type: "success", read: false, time: "1d ago" },
    { id: "n3", userId: "u2", message: "Medicine reminder: Atorvastatin - Take now", type: "warning", read: true, time: "6h ago" },
  ],
  vitals: [
    { date: "Jan", bp: 120, hr: 72, glucose: 95 },
    { date: "Feb", bp: 118, hr: 75, glucose: 98 },
    { date: "Mar", bp: 125, hr: 71, glucose: 92 },
    { date: "Apr", bp: 122, hr: 78, glucose: 101 },
    { date: "May", bp: 119, hr: 73, glucose: 96 },
    { date: "Jun", bp: 121, hr: 70, glucose: 94 },
    { date: "Jul", bp: 117, hr: 74, glucose: 97 },
  ],
};

// ═══════════════════════════════════════════════════════════
// AUTH CONTEXT & HOOKS
// ═══════════════════════════════════════════════════════════
let currentUser = null;

function useAuth() {
  const [user, setUser] = useState(currentUser);
  const login = (email, password) => {
    const found = DB.users.find(u => u.email === email && u.password === password);
    if (found) { currentUser = found; setUser(found); return { success: true, user: found }; }
    return { success: false, error: "Invalid credentials" };
  };
  const logout = () => { currentUser = null; setUser(null); };
  const register = (data) => {
    const newUser = { id: `u${Date.now()}`, ...data, role: "patient", avatar: data.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() };
    DB.users.push(newUser);
    currentUser = newUser;
    setUser(newUser);
    return { success: true };
  };
  return { user, login, logout, register };
}

// ═══════════════════════════════════════════════════════════
// AI SERVICE (Claude API)
// ═══════════════════════════════════════════════════════════
async function callAI(prompt, systemPrompt = "") {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      system: systemPrompt || "You are MediAI, a professional healthcare assistant. Provide helpful, accurate medical information. Always recommend consulting a healthcare professional for actual medical advice. Keep responses concise and clear.",
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const data = await res.json();
  return data.content?.[0]?.text || "I apologize, I couldn't process your request.";
}

// ═══════════════════════════════════════════════════════════
// SHARED UI COMPONENTS
// ═══════════════════════════════════════════════════════════
const Avatar = ({ name, size = 36, bg = colors.primary }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: bg, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 600, fontSize: size * 0.36, flexShrink: 0 }}>
    {name?.slice(0, 2).toUpperCase()}
  </div>
);

const Badge = ({ label, color = colors.primary, light = false }) => (
  <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: light ? color + "18" : color, color: light ? color : "#fff", letterSpacing: 0.3 }}>{label}</span>
);

const Card = ({ children, style = {}, onClick }) => (
  <div onClick={onClick} style={{ background: colors.surface, borderRadius: 12, border: `1px solid ${colors.border}`, padding: "20px 24px", ...style, cursor: onClick ? "pointer" : "default" }}>{children}</div>
);

const StatCard = ({ icon, label, value, sub, color = colors.primary, trend }) => (
  <Card style={{ display: "flex", alignItems: "center", gap: 16 }}>
    <div style={{ width: 52, height: 52, borderRadius: 12, background: color + "15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>{icon}</div>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 12, color: colors.textMuted, marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 700, color: colors.text }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: trend === "up" ? colors.success : trend === "down" ? colors.danger : colors.textMuted, marginTop: 2 }}>{sub}</div>}
    </div>
  </Card>
);

const Button = ({ children, onClick, variant = "primary", size = "md", disabled, style = {} }) => {
  const variants = {
    primary: { background: colors.primary, color: "#fff", border: "none" },
    secondary: { background: colors.surfaceAlt, color: colors.text, border: `1px solid ${colors.border}` },
    danger: { background: colors.danger, color: "#fff", border: "none" },
    ghost: { background: "transparent", color: colors.primary, border: `1px solid ${colors.primary}` },
    success: { background: colors.success, color: "#fff", border: "none" },
  };
  const sizes = { sm: { padding: "6px 14px", fontSize: 13 }, md: { padding: "9px 20px", fontSize: 14 }, lg: { padding: "12px 28px", fontSize: 15 } };
  return (
    <button onClick={onClick} disabled={disabled} style={{ borderRadius: 8, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.6 : 1, transition: "all 0.15s", ...variants[variant], ...sizes[size], ...style }}>
      {children}
    </button>
  );
};

const Input = ({ label, type = "text", value, onChange, placeholder, icon, style = {} }) => (
  <div style={{ marginBottom: 16, ...style }}>
    {label && <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: colors.text, marginBottom: 6 }}>{label}</label>}
    <div style={{ position: "relative" }}>
      {icon && <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 18 }}>{icon}</span>}
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} style={{ width: "100%", boxSizing: "border-box", padding: icon ? "10px 12px 10px 40px" : "10px 12px", borderRadius: 8, border: `1px solid ${colors.border}`, fontSize: 14, color: colors.text, background: colors.surface, outline: "none" }} />
    </div>
  </div>
);

const Select = ({ label, value, onChange, options }) => (
  <div style={{ marginBottom: 16 }}>
    {label && <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: colors.text, marginBottom: 6 }}>{label}</label>}
    <select value={value} onChange={onChange} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${colors.border}`, fontSize: 14, color: colors.text, background: colors.surface, outline: "none" }}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

const Spinner = ({ size = 24, color = colors.primary }) => (
  <div style={{ width: size, height: size, border: `3px solid ${color}20`, borderTop: `3px solid ${color}`, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
);

const Modal = ({ open, onClose, title, children, width = 520 }) => {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}>
      <div style={{ background: colors.surface, borderRadius: 16, width: "100%", maxWidth: width, maxHeight: "90vh", overflow: "auto" }}>
        <div style={{ padding: "20px 24px", borderBottom: `1px solid ${colors.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: colors.text }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, color: colors.textMuted }}>✕</button>
        </div>
        <div style={{ padding: "20px 24px" }}>{children}</div>
      </div>
    </div>
  );
};

const Toast = ({ msg, type, onClose }) => {
  const typeColors = { success: colors.success, error: colors.danger, info: colors.info, warning: colors.warning };
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, []);
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, background: colors.surface, border: `1px solid ${colors.border}`, borderLeft: `4px solid ${typeColors[type] || colors.primary}`, borderRadius: 10, padding: "14px 20px", boxShadow: "0 4px 24px rgba(0,0,0,0.12)", zIndex: 2000, maxWidth: 360, display: "flex", alignItems: "center", gap: 12 }}>
      <span style={{ fontSize: 20 }}>{type === "success" ? "✅" : type === "error" ? "❌" : type === "warning" ? "⚠️" : "ℹ️"}</span>
      <span style={{ fontSize: 14, color: colors.text, flex: 1 }}>{msg}</span>
      <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: colors.textMuted }}>✕</button>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// SIDEBAR NAVIGATION
// ═══════════════════════════════════════════════════════════
const navItems = {
  patient: [
    { id: "dashboard", label: "Dashboard", icon: "🏠" },
    { id: "appointments", label: "Appointments", icon: "📅" },
    { id: "ai-chat", label: "AI Health Chat", icon: "🤖" },
    { id: "symptom-checker", label: "Symptom Checker", icon: "🔍" },
    { id: "reports", label: "Medical Reports", icon: "📋" },
    { id: "prescriptions", label: "Prescriptions", icon: "💊" },
    { id: "reminders", label: "Reminders", icon: "⏰" },
    { id: "profile", label: "Profile", icon: "👤" },
  ],
  doctor: [
    { id: "dashboard", label: "Dashboard", icon: "🏠" },
    { id: "appointments", label: "Appointments", icon: "📅" },
    { id: "patients", label: "My Patients", icon: "👥" },
    { id: "prescriptions", label: "Prescriptions", icon: "💊" },
    { id: "analytics", label: "Analytics", icon: "📊" },
    { id: "profile", label: "Profile", icon: "👤" },
  ],
  admin: [
    { id: "dashboard", label: "Dashboard", icon: "🏠" },
    { id: "users", label: "Manage Users", icon: "👥" },
    { id: "appointments", label: "Appointments", icon: "📅" },
    { id: "reports", label: "Reports", icon: "📋" },
    { id: "analytics", label: "Analytics", icon: "📊" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ],
};

function Sidebar({ user, activePage, onNav, onLogout, sidebarOpen }) {
  const items = navItems[user.role] || [];
  return (
    <div style={{ width: sidebarOpen ? 260 : 68, background: colors.sidebar, height: "100vh", display: "flex", flexDirection: "column", transition: "width 0.25s", flexShrink: 0, overflow: "hidden" }}>
      <div style={{ padding: "20px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ fontSize: 28, flexShrink: 0 }}>🏥</div>
        {sidebarOpen && <div><div style={{ color: "#fff", fontWeight: 700, fontSize: 16, whiteSpace: "nowrap" }}>MediCare AI</div><div style={{ color: colors.sidebarText, fontSize: 11 }}>Healthcare System</div></div>}
      </div>
      {sidebarOpen && (
        <div style={{ padding: "16px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Avatar name={user.avatar} size={38} bg={colors.primary} />
            <div>
              <div style={{ color: "#fff", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 150 }}>{user.name}</div>
              <div style={{ color: colors.sidebarText, fontSize: 11, textTransform: "capitalize" }}>{user.role}</div>
            </div>
          </div>
        </div>
      )}
      <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto" }}>
        {items.map(item => (
          <button key={item.id} onClick={() => onNav(item.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 8, border: "none", cursor: "pointer", background: activePage === item.id ? `${colors.primary}20` : "transparent", color: activePage === item.id ? colors.sidebarActive : colors.sidebarText, fontSize: 14, fontWeight: activePage === item.id ? 600 : 400, marginBottom: 2, transition: "all 0.15s", textAlign: "left" }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
            {sidebarOpen && <span style={{ whiteSpace: "nowrap" }}>{item.label}</span>}
          </button>
        ))}
      </nav>
      <div style={{ padding: "12px 8px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <button onClick={onLogout} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 8, border: "none", cursor: "pointer", background: "transparent", color: "#EF4444", fontSize: 14 }}>
          <span style={{ fontSize: 18 }}>🚪</span>
          {sidebarOpen && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// HEADER
// ═══════════════════════════════════════════════════════════
function Header({ user, onToggleSidebar, notifications, onPageChange }) {
  const [showNotif, setShowNotif] = useState(false);
  const unread = notifications.filter(n => !n.read).length;
  return (
    <div style={{ height: 60, background: colors.surface, borderBottom: `1px solid ${colors.border}`, display: "flex", alignItems: "center", padding: "0 20px", gap: 16, position: "sticky", top: 0, zIndex: 100 }}>
      <button onClick={onToggleSidebar} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, color: colors.textMuted }}>☰</button>
      <div style={{ flex: 1 }} />
      <div style={{ position: "relative" }}>
        <button onClick={() => setShowNotif(!showNotif)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, position: "relative" }}>
          🔔
          {unread > 0 && <span style={{ position: "absolute", top: -4, right: -4, background: colors.danger, color: "#fff", borderRadius: "50%", width: 18, height: 18, fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>{unread}</span>}
        </button>
        {showNotif && (
          <div style={{ position: "absolute", right: 0, top: 40, width: 320, background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 12, boxShadow: "0 8px 32px rgba(0,0,0,0.12)", zIndex: 200 }}>
            <div style={{ padding: "14px 16px", borderBottom: `1px solid ${colors.border}`, fontWeight: 700, fontSize: 14 }}>Notifications</div>
            {notifications.map(n => (
              <div key={n.id} style={{ padding: "12px 16px", borderBottom: `1px solid ${colors.borderLight}`, background: n.read ? "transparent" : `${colors.primary}06`, display: "flex", gap: 10 }}>
                <span style={{ fontSize: 20 }}>{n.type === "success" ? "✅" : n.type === "warning" ? "⚠️" : "ℹ️"}</span>
                <div>
                  <div style={{ fontSize: 13, color: colors.text }}>{n.message}</div>
                  <div style={{ fontSize: 11, color: colors.textMuted, marginTop: 3 }}>{n.time}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Avatar name={user.avatar} size={34} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// LANDING PAGE
// ═══════════════════════════════════════════════════════════
function LandingPage({ onGetStarted, onLogin }) {
  const features = [
    { icon: "🤖", title: "AI-Powered Diagnostics", desc: "Advanced symptom analysis and health guidance using cutting-edge AI technology." },
    { icon: "📅", title: "Smart Scheduling", desc: "Book appointments with top specialists instantly, with AI-based doctor matching." },
    { icon: "📋", title: "Digital Health Records", desc: "Secure, centralized storage for all your medical history, reports, and prescriptions." },
    { icon: "💊", title: "Medicine Reminders", desc: "Never miss a dose with intelligent medication tracking and reminder system." },
    { icon: "🔬", title: "Report Analysis", desc: "AI-powered analysis of lab reports and imaging with clear, actionable summaries." },
    { icon: "🔐", title: "Enterprise Security", desc: "Military-grade encryption protecting your sensitive medical information." },
  ];

  const stats = [
    { num: "50K+", label: "Patients Served" },
    { num: "500+", label: "Specialist Doctors" },
    { num: "98%", label: "Satisfaction Rate" },
    { num: "24/7", label: "AI Support" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "'Inter', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap'); @keyframes spin{to{transform:rotate(360deg)}} @keyframes fadeIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>
      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, background: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)", borderBottom: `1px solid ${colors.border}`, padding: "0 40px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 28 }}>🏥</span>
          <span style={{ fontSize: 20, fontWeight: 800, color: colors.text }}>MediCare<span style={{ color: colors.primary }}> AI</span></span>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <Button variant="secondary" onClick={onLogin} size="sm">Sign In</Button>
          <Button variant="primary" onClick={onGetStarted} size="sm">Get Started Free</Button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ background: `linear-gradient(135deg, #EFF6FF 0%, #F0FDF4 50%, #FFF7ED 100%)`, padding: "80px 40px", textAlign: "center" }}>
        <div style={{ display: "inline-block", background: `${colors.primary}15`, color: colors.primary, borderRadius: 20, padding: "6px 18px", fontSize: 13, fontWeight: 600, marginBottom: 24, border: `1px solid ${colors.primary}30` }}>
          🚀 Next-Generation Healthcare Platform
        </div>
        <h1 style={{ fontSize: "clamp(32px, 5vw, 60px)", fontWeight: 800, color: colors.text, margin: "0 0 20px", lineHeight: 1.15, maxWidth: 700, marginLeft: "auto", marginRight: "auto" }}>
          Your Health, Powered by<br /><span style={{ color: colors.primary }}>Artificial Intelligence</span>
        </h1>
        <p style={{ fontSize: 18, color: colors.textMuted, maxWidth: 560, margin: "0 auto 40px", lineHeight: 1.7 }}>
          Experience personalized healthcare with AI-driven symptom analysis, instant doctor appointments, and intelligent medical record management.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <Button variant="primary" onClick={onGetStarted} size="lg">🚀 Start Free Today</Button>
          <Button variant="ghost" onClick={onLogin} size="lg">👨‍⚕️ Doctor Login</Button>
        </div>
        <div style={{ display: "flex", gap: 32, justifyContent: "center", marginTop: 48, flexWrap: "wrap" }}>
          {stats.map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: colors.primary }}>{s.num}</div>
              <div style={{ fontSize: 13, color: colors.textMuted }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "80px 40px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: colors.text, margin: "0 0 12px" }}>Everything You Need for Better Health</h2>
          <p style={{ fontSize: 16, color: colors.textMuted }}>Comprehensive healthcare management in one intelligent platform</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
          {features.map(f => (
            <div key={f.title} style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 16, padding: 28, transition: "all 0.2s" }}>
              <div style={{ fontSize: 36, marginBottom: 14 }}>{f.icon}</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: colors.text, margin: "0 0 8px" }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: colors.textMuted, margin: 0, lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: colors.primary, padding: "60px 40px", textAlign: "center" }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, color: "#fff", margin: "0 0 16px" }}>Ready to Transform Your Healthcare?</h2>
        <p style={{ fontSize: 16, color: "rgba(255,255,255,0.8)", margin: "0 0 32px" }}>Join thousands of patients and doctors already using MediCare AI</p>
        <Button onClick={onGetStarted} style={{ background: "#fff", color: colors.primary, padding: "14px 36px", fontSize: 16, fontWeight: 700, border: "none", borderRadius: 10, cursor: "pointer" }}>
          Get Started — It's Free
        </Button>
      </section>

      <footer style={{ padding: "32px 40px", background: colors.sidebar, textAlign: "center", color: colors.sidebarText, fontSize: 13 }}>
        © 2025 MediCare AI • Secure • HIPAA Compliant • Powered by Anthropic Claude
      </footer>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// AUTH PAGES
// ═══════════════════════════════════════════════════════════
function AuthPage({ mode, onAuth, onSwitch, onBack }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "patient" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const quickLogins = [
    { label: "Patient", email: "james@email.com", password: "patient123", icon: "🙋" },
    { label: "Doctor", email: "sarah@healthsys.com", password: "doctor123", icon: "👨‍⚕️" },
    { label: "Admin", email: "admin@healthsys.com", password: "admin123", icon: "🛡️" },
  ];

  const handleSubmit = async () => {
    if (!form.email || !form.password) { setError("Please fill all fields"); return; }
    setLoading(true); setError("");
    await new Promise(r => setTimeout(r, 600));
    const result = onAuth(form);
    if (!result.success) { setError(result.error || "An error occurred"); setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(135deg, #EFF6FF, #F0FDF4)`, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: colors.surface, borderRadius: 20, padding: "40px", width: "100%", maxWidth: 420, border: `1px solid ${colors.border}` }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: colors.primary, fontSize: 14, marginBottom: 24, display: "flex", alignItems: "center", gap: 6 }}>← Back to Home</button>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🏥</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: colors.text, margin: "0 0 6px" }}>{mode === "login" ? "Welcome Back" : "Create Account"}</h1>
          <p style={{ fontSize: 14, color: colors.textMuted, margin: 0 }}>MediCare AI Healthcare Platform</p>
        </div>

        {mode === "login" && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 12, color: colors.textMuted, marginBottom: 10, textAlign: "center" }}>Quick Demo Login</div>
            <div style={{ display: "flex", gap: 8 }}>
              {quickLogins.map(q => (
                <button key={q.label} onClick={() => { set("email", q.email); set("password", q.password); }} style={{ flex: 1, padding: "8px 4px", borderRadius: 8, border: `1px solid ${colors.border}`, background: colors.surfaceAlt, cursor: "pointer", fontSize: 12, color: colors.text, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <span style={{ fontSize: 20 }}>{q.icon}</span>
                  <span style={{ fontWeight: 600 }}>{q.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {mode === "register" && <Input label="Full Name" value={form.name} onChange={e => set("name", e.target.value)} placeholder="John Doe" icon="👤" />}
        <Input label="Email Address" type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="you@example.com" icon="📧" />
        <Input label="Password" type="password" value={form.password} onChange={e => set("password", e.target.value)} placeholder="••••••••" icon="🔒" />
        {mode === "register" && (
          <Select label="Register As" value={form.role} onChange={e => set("role", e.target.value)} options={[{ value: "patient", label: "Patient" }, { value: "doctor", label: "Doctor" }]} />
        )}
        {error && <div style={{ background: `${colors.danger}15`, color: colors.danger, borderRadius: 8, padding: "10px 14px", fontSize: 13, marginBottom: 16 }}>⚠️ {error}</div>}
        <Button variant="primary" onClick={handleSubmit} disabled={loading} style={{ width: "100%", padding: "13px", fontSize: 15 }}>
          {loading ? "Please wait..." : mode === "login" ? "Sign In →" : "Create Account →"}
        </Button>
        <div style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: colors.textMuted }}>
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <button onClick={onSwitch} style={{ background: "none", border: "none", color: colors.primary, cursor: "pointer", fontWeight: 600 }}>
            {mode === "login" ? "Sign Up" : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// PATIENT DASHBOARD
// ═══════════════════════════════════════════════════════════
function PatientDashboard({ user, onNavigate, showToast }) {
  const userAppointments = DB.appointments.filter(a => a.patientId === user.id);
  const userNotifications = DB.notifications.filter(n => n.userId === user.id);
  const nextAppt = userAppointments.find(a => a.status === "confirmed");

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: colors.text, margin: "0 0 6px" }}>Good morning, {user.name.split(" ")[0]} 👋</h1>
        <p style={{ color: colors.textMuted, margin: 0 }}>Here's your health overview for today</p>
      </div>

      {/* Alert Banner */}
      {nextAppt && (
        <div style={{ background: `${colors.primary}12`, border: `1px solid ${colors.primary}30`, borderRadius: 12, padding: "16px 20px", marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontWeight: 700, color: colors.primary, fontSize: 14 }}>📅 Upcoming Appointment</div>
            <div style={{ fontSize: 13, color: colors.text, marginTop: 3 }}>{nextAppt.type} • {nextAppt.date} at {nextAppt.time}</div>
          </div>
          <Button size="sm" onClick={() => onNavigate("appointments")}>View Details</Button>
        </div>
      )}

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
        <StatCard icon="📅" label="Upcoming Appointments" value={userAppointments.filter(a => a.status !== "completed").length} sub="Next: July 15th" color={colors.primary} />
        <StatCard icon="📋" label="Medical Reports" value={DB.reports.filter(r => r.patientId === user.id).length} sub="2 analyzed" color={colors.teal} trend="up" />
        <StatCard icon="💊" label="Active Prescriptions" value={DB.prescriptions.filter(p => p.patientId === user.id).length} sub="All up to date" color={colors.success} />
        <StatCard icon="🔔" label="Notifications" value={userNotifications.filter(n => !n.read).length} sub="unread" color={colors.warning} />
      </div>

      {/* Charts Row */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginBottom: 24 }}>
        <Card>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16, color: colors.text }}>📈 Vital Signs Trend</div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={DB.vitals}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area type="monotone" dataKey="bp" stroke={colors.primary} fill={`${colors.primary}20`} name="Blood Pressure" />
              <Area type="monotone" dataKey="hr" stroke={colors.success} fill={`${colors.success}15`} name="Heart Rate" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16, color: colors.text }}>Health Score</div>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 56, fontWeight: 800, color: colors.success }}>87</div>
            <div style={{ fontSize: 13, color: colors.textMuted }}>out of 100</div>
            <Badge label="Good Health" color={colors.success} light />
          </div>
          {[{ label: "Heart", value: 92, color: colors.danger }, { label: "Lungs", value: 88, color: colors.primary }, { label: "Metabolic", value: 78, color: colors.warning }].map(m => (
            <div key={m.label} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4, color: colors.textMuted }}>
                <span>{m.label}</span><span style={{ fontWeight: 600 }}>{m.value}%</span>
              </div>
              <div style={{ height: 6, background: colors.border, borderRadius: 3 }}>
                <div style={{ height: "100%", width: `${m.value}%`, background: m.color, borderRadius: 3 }} />
              </div>
            </div>
          ))}
        </Card>
      </div>

      {/* Quick Actions */}
      <Card style={{ marginBottom: 24 }}>
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16, color: colors.text }}>Quick Actions</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
          {[
            { icon: "🤖", label: "AI Health Chat", page: "ai-chat", color: colors.primary },
            { icon: "🔍", label: "Check Symptoms", page: "symptom-checker", color: colors.secondary },
            { icon: "📅", label: "Book Appointment", page: "appointments", color: colors.teal },
            { icon: "📋", label: "Upload Report", page: "reports", color: colors.warning },
          ].map(a => (
            <button key={a.label} onClick={() => onNavigate(a.page)} style={{ background: `${a.color}10`, border: `1px solid ${a.color}30`, borderRadius: 10, padding: 16, cursor: "pointer", textAlign: "center", transition: "all 0.15s" }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{a.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: a.color }}>{a.label}</div>
            </button>
          ))}
        </div>
      </Card>

      {/* Recent Notifications */}
      <Card>
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16, color: colors.text }}>Recent Notifications</div>
        {userNotifications.map(n => (
          <div key={n.id} style={{ display: "flex", gap: 12, padding: "12px 0", borderBottom: `1px solid ${colors.borderLight}` }}>
            <span style={{ fontSize: 20 }}>{n.type === "success" ? "✅" : n.type === "warning" ? "⚠️" : "ℹ️"}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, color: colors.text }}>{n.message}</div>
              <div style={{ fontSize: 11, color: colors.textMuted, marginTop: 2 }}>{n.time}</div>
            </div>
            {!n.read && <span style={{ width: 8, height: 8, borderRadius: "50%", background: colors.primary, flexShrink: 0, marginTop: 6 }} />}
          </div>
        ))}
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// AI CHATBOT PAGE
// ═══════════════════════════════════════════════════════════
function AIChatPage({ user }) {
  const [messages, setMessages] = useState([
    { id: 1, role: "assistant", text: "Hello! I'm MediAI, your personal health assistant. I can help you understand symptoms, provide health guidance, answer medical questions, and more. How can I assist you today?", time: new Date() }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const quickPrompts = ["What are common cold symptoms?", "How do I manage high blood pressure?", "Explain my cholesterol results", "Tips for better sleep"];

  const sendMessage = async (text = input) => {
    if (!text.trim() || loading) return;
    setInput("");
    const userMsg = { id: Date.now(), role: "user", text, time: new Date() };
    setMessages(m => [...m, userMsg]);
    setLoading(true);
    try {
      const response = await callAI(text, "You are MediAI, an empathetic AI healthcare assistant. Provide clear, helpful medical information. Always recommend professional consultation for serious concerns. Format responses clearly with bullet points where helpful.");
      setMessages(m => [...m, { id: Date.now() + 1, role: "assistant", text: response, time: new Date() }]);
    } catch {
      setMessages(m => [...m, { id: Date.now() + 1, role: "assistant", text: "I'm having trouble connecting right now. Please check your API key or try again shortly.", time: new Date() }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 160px)" }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: colors.text, margin: "0 0 6px" }}>🤖 AI Health Assistant</h1>
        <p style={{ color: colors.textMuted, margin: 0, fontSize: 14 }}>Powered by Claude AI • Available 24/7 • Not a substitute for medical advice</p>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {quickPrompts.map(p => (
          <button key={p} onClick={() => sendMessage(p)} style={{ padding: "6px 14px", borderRadius: 20, border: `1px solid ${colors.primary}40`, background: `${colors.primary}08`, color: colors.primary, fontSize: 13, cursor: "pointer", fontWeight: 500 }}>{p}</button>
        ))}
      </div>

      <div style={{ flex: 1, background: colors.surfaceAlt, borderRadius: 16, border: `1px solid ${colors.border}`, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
          {messages.map(msg => (
            <div key={msg.id} style={{ display: "flex", gap: 12, flexDirection: msg.role === "user" ? "row-reverse" : "row", alignItems: "flex-start" }}>
              {msg.role === "assistant" ? (
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${colors.primary}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>🤖</div>
              ) : (
                <Avatar name={user.avatar} size={36} />
              )}
              <div style={{ maxWidth: "72%", background: msg.role === "user" ? colors.primary : colors.surface, color: msg.role === "user" ? "#fff" : colors.text, borderRadius: msg.role === "user" ? "16px 4px 16px 16px" : "4px 16px 16px 16px", padding: "12px 16px", fontSize: 14, lineHeight: 1.6, border: msg.role === "user" ? "none" : `1px solid ${colors.border}`, whiteSpace: "pre-wrap" }}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${colors.primary}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🤖</div>
              <div style={{ background: colors.surface, borderRadius: "4px 16px 16px 16px", padding: "14px 18px", border: `1px solid ${colors.border}`, display: "flex", gap: 6, alignItems: "center" }}>
                {[0, 1, 2].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: colors.primary, animation: `bounce 1.2s ${i * 0.2}s infinite` }} />)}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div style={{ padding: "16px 20px", borderTop: `1px solid ${colors.border}`, background: colors.surface, display: "flex", gap: 12 }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()} placeholder="Ask me anything about your health..." style={{ flex: 1, padding: "10px 16px", borderRadius: 10, border: `1px solid ${colors.border}`, fontSize: 14, outline: "none" }} />
          <Button variant="primary" onClick={() => sendMessage()} disabled={!input.trim() || loading} style={{ padding: "10px 20px" }}>Send →</Button>
        </div>
      </div>
      <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}`}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SYMPTOM CHECKER
// ═══════════════════════════════════════════════════════════
function SymptomChecker({ user }) {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [duration, setDuration] = useState("1-3 days");
  const [severity, setSeverity] = useState("Moderate");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const allSymptoms = [
    "Headache", "Fever", "Cough", "Fatigue", "Nausea", "Chest Pain",
    "Shortness of Breath", "Dizziness", "Stomach Pain", "Back Pain",
    "Sore Throat", "Runny Nose", "Muscle Aches", "Joint Pain", "Rash",
    "Vomiting", "Diarrhea", "Loss of Appetite", "Chills", "Sweating"
  ];

  const toggleSymptom = s => setSelectedSymptoms(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const analyze = async () => {
    if (!selectedSymptoms.length) return;
    setLoading(true); setResult(null);
    const prompt = `Patient symptoms: ${selectedSymptoms.join(", ")}. Duration: ${duration}. Severity: ${severity}. 

Please provide:
1. Most likely conditions (2-3 possibilities) with brief explanations
2. Urgency level (Emergency/Urgent/Routine)
3. Recommended specialist type
4. Self-care tips
5. Warning signs requiring immediate ER visit

Format clearly with sections. Be concise but thorough.`;
    try {
      const response = await callAI(prompt, "You are a medical AI assistant. Analyze symptoms and provide structured, helpful guidance. Always emphasize the importance of professional medical consultation.");
      setResult(response);
    } catch {
      setResult("Unable to analyze symptoms. Please ensure your API key is configured.");
    }
    setLoading(false);
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: colors.text, margin: "0 0 6px" }}>🔍 AI Symptom Checker</h1>
        <p style={{ color: colors.textMuted, margin: 0, fontSize: 14 }}>Select your symptoms for AI-powered health analysis</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div>
          <Card style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14, color: colors.text }}>Select Symptoms</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {allSymptoms.map(s => (
                <button key={s} onClick={() => toggleSymptom(s)} style={{ padding: "6px 14px", borderRadius: 20, border: `1px solid ${selectedSymptoms.includes(s) ? colors.primary : colors.border}`, background: selectedSymptoms.includes(s) ? `${colors.primary}15` : "transparent", color: selectedSymptoms.includes(s) ? colors.primary : colors.textMuted, fontSize: 13, cursor: "pointer", fontWeight: selectedSymptoms.includes(s) ? 600 : 400, transition: "all 0.15s" }}>
                  {selectedSymptoms.includes(s) ? "✓ " : ""}{s}
                </button>
              ))}
            </div>
          </Card>

          <Card style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14, color: colors.text }}>Symptom Details</div>
            <Select label="Duration" value={duration} onChange={e => setDuration(e.target.value)} options={["Less than 24 hours", "1-3 days", "3-7 days", "1-2 weeks", "More than 2 weeks"].map(v => ({ value: v, label: v }))} />
            <Select label="Severity Level" value={severity} onChange={e => setSeverity(e.target.value)} options={["Mild", "Moderate", "Severe"].map(v => ({ value: v, label: v }))} />
          </Card>

          {selectedSymptoms.length > 0 && (
            <Card style={{ marginBottom: 16, background: `${colors.primary}08`, border: `1px solid ${colors.primary}30` }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10, color: colors.primary }}>Selected: {selectedSymptoms.length} symptoms</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {selectedSymptoms.map(s => <Badge key={s} label={s} color={colors.primary} light />)}
              </div>
            </Card>
          )}

          <Button variant="primary" onClick={analyze} disabled={!selectedSymptoms.length || loading} style={{ width: "100%", padding: 13, fontSize: 15 }}>
            {loading ? "🤖 Analyzing..." : "🔍 Analyze Symptoms with AI"}
          </Button>
        </div>

        <div>
          {loading && (
            <Card style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400, gap: 16 }}>
              <Spinner size={48} />
              <div style={{ fontSize: 16, fontWeight: 600, color: colors.primary }}>AI is analyzing your symptoms...</div>
              <div style={{ fontSize: 13, color: colors.textMuted }}>This usually takes 5-10 seconds</div>
            </Card>
          )}
          {result && !loading && (
            <Card>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div style={{ fontWeight: 700, fontSize: 16, color: colors.text }}>🤖 AI Analysis Result</div>
                <Badge label="AI Generated" color={colors.secondary} light />
              </div>
              <div style={{ fontSize: 14, color: colors.text, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{result}</div>
              <div style={{ marginTop: 20, padding: "12px 16px", background: `${colors.warning}12`, border: `1px solid ${colors.warning}30`, borderRadius: 10 }}>
                <div style={{ fontSize: 12, color: colors.warning, fontWeight: 600 }}>⚠️ Medical Disclaimer</div>
                <div style={{ fontSize: 12, color: colors.textMuted, marginTop: 4 }}>This is AI-generated information only and not a medical diagnosis. Please consult a qualified healthcare professional for proper evaluation and treatment.</div>
              </div>
            </Card>
          )}
          {!result && !loading && (
            <Card style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400, textAlign: "center" }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>🩺</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: colors.text, marginBottom: 8 }}>Ready to Analyze</div>
              <div style={{ fontSize: 14, color: colors.textMuted }}>Select your symptoms on the left and click analyze for AI-powered health insights</div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// APPOINTMENTS PAGE
// ═══════════════════════════════════════════════════════════
function AppointmentsPage({ user, showToast }) {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ doctorId: "u1", date: "", time: "10:00", type: "General Consultation", notes: "" });
  const [appointments, setAppointments] = useState(DB.appointments.filter(a => user.role === "patient" ? a.patientId === user.id : a.doctorId === user.id));

  const doctors = DB.users.filter(u => u.role === "doctor");
  const statusColors = { confirmed: colors.success, pending: colors.warning, cancelled: colors.danger, completed: colors.textMuted };

  const book = () => {
    if (!form.date) { showToast("Please select a date", "error"); return; }
    const newAppt = { id: `a${Date.now()}`, patientId: user.id, ...form, status: "pending" };
    DB.appointments.push(newAppt);
    setAppointments(prev => [...prev, newAppt]);
    setShowModal(false);
    showToast("Appointment booked successfully!", "success");
  };

  const updateStatus = (id, status) => {
    const idx = DB.appointments.findIndex(a => a.id === id);
    if (idx >= 0) { DB.appointments[idx].status = status; }
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    showToast(`Appointment ${status}`, "success");
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: colors.text, margin: "0 0 6px" }}>📅 Appointments</h1>
          <p style={{ color: colors.textMuted, margin: 0, fontSize: 14 }}>Manage your healthcare appointments</p>
        </div>
        {user.role === "patient" && <Button onClick={() => setShowModal(true)}>+ Book Appointment</Button>}
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        {[{ label: "All", count: appointments.length }, { label: "Confirmed", count: appointments.filter(a => a.status === "confirmed").length }, { label: "Pending", count: appointments.filter(a => a.status === "pending").length }].map(f => (
          <div key={f.label} style={{ padding: "8px 16px", borderRadius: 8, border: `1px solid ${colors.border}`, background: colors.surface, fontSize: 13, color: colors.textMuted, cursor: "pointer" }}>
            {f.label} <span style={{ background: colors.surfaceAlt, borderRadius: 10, padding: "2px 8px", fontWeight: 600, marginLeft: 6 }}>{f.count}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {appointments.length === 0 && (
          <Card style={{ textAlign: "center", padding: 48 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📅</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: colors.text, marginBottom: 8 }}>No Appointments</div>
            <div style={{ fontSize: 14, color: colors.textMuted, marginBottom: 20 }}>Book your first appointment with a specialist</div>
            {user.role === "patient" && <Button onClick={() => setShowModal(true)}>Book Appointment</Button>}
          </Card>
        )}
        {appointments.map(appt => {
          const doctor = DB.users.find(u => u.id === appt.doctorId);
          const patient = DB.users.find(u => u.id === appt.patientId);
          return (
            <Card key={appt.id} style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 52, height: 52, borderRadius: 12, background: `${colors.primary}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>📅</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: colors.text }}>{appt.type}</div>
                <div style={{ fontSize: 13, color: colors.textMuted, marginTop: 3 }}>
                  {user.role === "patient" ? `With ${doctor?.name}` : `Patient: ${patient?.name}`} • {appt.date} at {appt.time}
                </div>
                {appt.notes && <div style={{ fontSize: 12, color: colors.textLight, marginTop: 4 }}>{appt.notes}</div>}
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <Badge label={appt.status.charAt(0).toUpperCase() + appt.status.slice(1)} color={statusColors[appt.status]} light />
                {user.role === "doctor" && appt.status === "pending" && (
                  <>
                    <Button size="sm" variant="success" onClick={() => updateStatus(appt.id, "confirmed")}>Confirm</Button>
                    <Button size="sm" variant="danger" onClick={() => updateStatus(appt.id, "cancelled")}>Decline</Button>
                  </>
                )}
                {user.role === "patient" && appt.status === "pending" && (
                  <Button size="sm" variant="danger" onClick={() => updateStatus(appt.id, "cancelled")}>Cancel</Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Book New Appointment">
        <Select label="Select Doctor" value={form.doctorId} onChange={e => setForm(f => ({ ...f, doctorId: e.target.value }))} options={doctors.map(d => ({ value: d.id, label: `${d.name} — ${d.specialty}` }))} />
        <Input label="Appointment Date" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
        <Select label="Time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} options={["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"].map(t => ({ value: t, label: t }))} />
        <Input label="Consultation Type" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} placeholder="e.g. General Checkup" />
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: colors.text, marginBottom: 6 }}>Notes (optional)</label>
          <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Describe your concern..." style={{ width: "100%", boxSizing: "border-box", padding: 10, borderRadius: 8, border: `1px solid ${colors.border}`, fontSize: 14, minHeight: 80, outline: "none", resize: "vertical" }} />
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={book}>Book Appointment</Button>
        </div>
      </Modal>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MEDICAL REPORTS PAGE
// ═══════════════════════════════════════════════════════════
function ReportsPage({ user, showToast }) {
  const [reports, setReports] = useState(DB.reports.filter(r => user.role === "patient" ? r.patientId === user.id : true));
  const [analyzing, setAnalyzing] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [form, setForm] = useState({ name: "", type: "Lab Report" });

  const analyzeReport = async (report) => {
    setAnalyzing(report.id);
    const prompt = `Analyze this medical report and provide a patient-friendly summary:
Report Name: ${report.name}
Type: ${report.type}
Date: ${report.date}

Please provide:
1. Simple explanation of what this report typically contains
2. Key findings to look for
3. What normal vs abnormal ranges mean
4. Questions to ask your doctor
Keep it concise and easy to understand.`;
    try {
      const summary = await callAI(prompt);
      const idx = DB.reports.findIndex(r => r.id === report.id);
      if (idx >= 0) { DB.reports[idx].summary = summary; DB.reports[idx].status = "analyzed"; }
      setReports(prev => prev.map(r => r.id === report.id ? { ...r, summary, status: "analyzed" } : r));
      showToast("Report analyzed successfully!", "success");
    } catch {
      showToast("Failed to analyze report", "error");
    }
    setAnalyzing(null);
  };

  const uploadReport = () => {
    if (!form.name) { showToast("Please enter report name", "error"); return; }
    const newReport = { id: `r${Date.now()}`, patientId: user.id, ...form, date: new Date().toISOString().split("T")[0], status: "pending", summary: "" };
    DB.reports.push(newReport);
    setReports(prev => [...prev, newReport]);
    setShowUpload(false); setForm({ name: "", type: "Lab Report" });
    showToast("Report uploaded successfully!", "success");
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: colors.text, margin: "0 0 6px" }}>📋 Medical Reports</h1>
          <p style={{ color: colors.textMuted, margin: 0, fontSize: 14 }}>View and manage your medical documents with AI analysis</p>
        </div>
        {user.role === "patient" && <Button onClick={() => setShowUpload(true)}>+ Upload Report</Button>}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
        <StatCard icon="📋" label="Total Reports" value={reports.length} color={colors.primary} />
        <StatCard icon="✅" label="AI Analyzed" value={reports.filter(r => r.status === "analyzed").length} color={colors.success} />
        <StatCard icon="⏳" label="Pending Analysis" value={reports.filter(r => r.status === "pending").length} color={colors.warning} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {reports.map(report => (
          <Card key={report.id}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: report.summary ? 16 : 0 }}>
              <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                <div style={{ width: 50, height: 50, borderRadius: 12, background: `${colors.primary}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>
                  {report.type === "Lab Report" ? "🧪" : report.type === "Imaging" ? "🔬" : "📄"}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: colors.text }}>{report.name}</div>
                  <div style={{ fontSize: 13, color: colors.textMuted, marginTop: 3 }}>{report.type} • {report.date}</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <Badge label={report.status === "analyzed" ? "AI Analyzed" : "Pending"} color={report.status === "analyzed" ? colors.success : colors.warning} light />
                {report.status === "pending" && (
                  <Button size="sm" onClick={() => analyzeReport(report)} disabled={analyzing === report.id}>
                    {analyzing === report.id ? "⏳ Analyzing..." : "🤖 Analyze with AI"}
                  </Button>
                )}
              </div>
            </div>
            {report.summary && (
              <div style={{ background: `${colors.success}08`, border: `1px solid ${colors.success}25`, borderRadius: 10, padding: "14px 16px" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: colors.success, marginBottom: 8 }}>🤖 AI Summary</div>
                <div style={{ fontSize: 13, color: colors.text, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{report.summary}</div>
              </div>
            )}
          </Card>
        ))}
      </div>

      <Modal open={showUpload} onClose={() => setShowUpload(false)} title="Upload Medical Report">
        <Input label="Report Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Blood Panel Results" />
        <Select label="Report Type" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} options={["Lab Report", "Imaging", "Cardiology", "Pathology", "Other"].map(v => ({ value: v, label: v }))} />
        <div style={{ border: `2px dashed ${colors.border}`, borderRadius: 12, padding: 32, textAlign: "center", marginBottom: 20, background: colors.surfaceAlt }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📁</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: colors.text, marginBottom: 6 }}>Drop your file here or click to browse</div>
          <div style={{ fontSize: 12, color: colors.textMuted }}>Supports PDF, JPG, PNG (max 10MB)</div>
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
          <Button variant="secondary" onClick={() => setShowUpload(false)}>Cancel</Button>
          <Button variant="primary" onClick={uploadReport}>Upload Report</Button>
        </div>
      </Modal>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// PRESCRIPTIONS PAGE
// ═══════════════════════════════════════════════════════════
function PrescriptionsPage({ user, showToast }) {
  const [prescriptions, setPrescriptions] = useState(DB.prescriptions.filter(p => user.role === "patient" ? p.patientId === user.id : p.doctorId === user.id));
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ patientId: "u2", medicines: [{ name: "", dose: "", freq: "Once daily", duration: "" }], notes: "" });

  const addMedicine = () => setForm(f => ({ ...f, medicines: [...f.medicines, { name: "", dose: "", freq: "Once daily", duration: "" }] }));
  const updateMed = (i, k, v) => setForm(f => ({ ...f, medicines: f.medicines.map((m, idx) => idx === i ? { ...m, [k]: v } : m) }));

  const save = () => {
    const newPres = { id: `p${Date.now()}`, doctorId: user.id, doctorName: user.name, date: new Date().toISOString().split("T")[0], ...form };
    DB.prescriptions.push(newPres);
    setPrescriptions(prev => [...prev, newPres]);
    setShowModal(false);
    showToast("Prescription saved!", "success");
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: colors.text, margin: "0 0 6px" }}>💊 Prescriptions</h1>
          <p style={{ color: colors.textMuted, margin: 0, fontSize: 14 }}>Your medication history and active prescriptions</p>
        </div>
        {user.role === "doctor" && <Button onClick={() => setShowModal(true)}>+ New Prescription</Button>}
      </div>

      {prescriptions.length === 0 ? (
        <Card style={{ textAlign: "center", padding: 48 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>💊</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: colors.text }}>No Prescriptions</div>
        </Card>
      ) : prescriptions.map(pres => (
        <Card key={pres.id} style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: colors.text }}>Prescription #{pres.id}</div>
              <div style={{ fontSize: 13, color: colors.textMuted, marginTop: 3 }}>By {pres.doctorName} • {pres.date}</div>
            </div>
            <Badge label="Active" color={colors.success} light />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10, marginBottom: 16 }}>
            {pres.medicines.map((med, i) => (
              <div key={i} style={{ background: `${colors.primary}08`, border: `1px solid ${colors.primary}20`, borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: colors.primary }}>{med.name}</div>
                <div style={{ fontSize: 12, color: colors.textMuted, marginTop: 4 }}>{med.dose} • {med.freq}</div>
                <div style={{ fontSize: 12, color: colors.textMuted }}>Duration: {med.duration}</div>
              </div>
            ))}
          </div>
          {pres.notes && <div style={{ fontSize: 13, color: colors.textMuted, background: colors.surfaceAlt, borderRadius: 8, padding: "10px 14px" }}>📝 {pres.notes}</div>}
        </Card>
      ))}

      <Modal open={showModal} onClose={() => setShowModal(false)} title="New Prescription" width={580}>
        <Select label="Patient" value={form.patientId} onChange={e => setForm(f => ({ ...f, patientId: e.target.value }))} options={DB.users.filter(u => u.role === "patient").map(u => ({ value: u.id, label: u.name }))} />
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>Medicines</div>
            <Button size="sm" variant="ghost" onClick={addMedicine}>+ Add</Button>
          </div>
          {form.medicines.map((med, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 100px 1fr 100px", gap: 8, marginBottom: 8 }}>
              <input value={med.name} onChange={e => updateMed(i, "name", e.target.value)} placeholder="Medicine name" style={{ padding: "8px 10px", borderRadius: 6, border: `1px solid ${colors.border}`, fontSize: 13 }} />
              <input value={med.dose} onChange={e => updateMed(i, "dose", e.target.value)} placeholder="Dose" style={{ padding: "8px 10px", borderRadius: 6, border: `1px solid ${colors.border}`, fontSize: 13 }} />
              <select value={med.freq} onChange={e => updateMed(i, "freq", e.target.value)} style={{ padding: "8px 10px", borderRadius: 6, border: `1px solid ${colors.border}`, fontSize: 13 }}>
                {["Once daily", "Twice daily", "Three times daily", "As needed"].map(o => <option key={o}>{o}</option>)}
              </select>
              <input value={med.duration} onChange={e => updateMed(i, "duration", e.target.value)} placeholder="Duration" style={{ padding: "8px 10px", borderRadius: 6, border: `1px solid ${colors.border}`, fontSize: 13 }} />
            </div>
          ))}
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: colors.text, marginBottom: 6 }}>Notes</label>
          <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Additional instructions..." style={{ width: "100%", boxSizing: "border-box", padding: 10, borderRadius: 8, border: `1px solid ${colors.border}`, fontSize: 14, minHeight: 80, outline: "none" }} />
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={save}>Save Prescription</Button>
        </div>
      </Modal>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MEDICINE REMINDERS PAGE
// ═══════════════════════════════════════════════════════════
function RemindersPage({ user, showToast }) {
  const [reminders, setReminders] = useState([
    { id: 1, medicine: "Atorvastatin", dose: "20mg", time: "08:00", taken: true, days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
    { id: 2, medicine: "Aspirin", dose: "81mg", time: "08:00", taken: false, days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
    { id: 3, medicine: "Vitamin D", dose: "1000 IU", time: "13:00", taken: false, days: ["Mon", "Wed", "Fri"] },
  ]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ medicine: "", dose: "", time: "08:00" });

  const markTaken = (id) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, taken: !r.taken } : r));
    showToast("Medication marked as taken!", "success");
  };

  const addReminder = () => {
    if (!form.medicine) return;
    setReminders(prev => [...prev, { id: Date.now(), ...form, taken: false, days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] }]);
    setForm({ medicine: "", dose: "", time: "08:00" });
    setShowAdd(false);
    showToast("Reminder added!", "success");
  };

  const today = new Date().toLocaleDateString("en-US", { weekday: "short" }).slice(0, 3);
  const taken = reminders.filter(r => r.taken).length;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: colors.text, margin: "0 0 6px" }}>⏰ Medicine Reminders</h1>
          <p style={{ color: colors.textMuted, margin: 0, fontSize: 14 }}>Track your daily medications</p>
        </div>
        <Button onClick={() => setShowAdd(true)}>+ Add Reminder</Button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
        <StatCard icon="💊" label="Total Medications" value={reminders.length} color={colors.primary} />
        <StatCard icon="✅" label="Taken Today" value={taken} sub={`${Math.round(taken / reminders.length * 100)}% adherence`} color={colors.success} trend="up" />
        <StatCard icon="⏳" label="Remaining" value={reminders.length - taken} color={colors.warning} />
      </div>

      <Card style={{ marginBottom: 20, background: `${colors.success}08`, border: `1px solid ${colors.success}20` }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: colors.text }}>Today's Progress</div>
          <span style={{ fontSize: 14, fontWeight: 700, color: colors.success }}>{taken}/{reminders.length} taken</span>
        </div>
        <div style={{ height: 10, background: colors.border, borderRadius: 5 }}>
          <div style={{ height: "100%", width: `${(taken / reminders.length) * 100}%`, background: colors.success, borderRadius: 5, transition: "width 0.5s" }} />
        </div>
      </Card>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {reminders.map(r => (
          <Card key={r.id} style={{ display: "flex", alignItems: "center", gap: 16, opacity: r.taken ? 0.7 : 1 }}>
            <button onClick={() => markTaken(r.id)} style={{ width: 44, height: 44, borderRadius: "50%", border: `2px solid ${r.taken ? colors.success : colors.border}`, background: r.taken ? `${colors.success}15` : "transparent", cursor: "pointer", fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {r.taken ? "✅" : "💊"}
            </button>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ fontWeight: 700, fontSize: 15, color: colors.text, textDecoration: r.taken ? "line-through" : "none" }}>{r.medicine}</span>
                <Badge label={r.dose} color={colors.primary} light />
              </div>
              <div style={{ fontSize: 13, color: colors.textMuted, marginTop: 4 }}>
                🕐 {r.time} • {r.days.includes(today) ? "Scheduled today" : "Not today"}
              </div>
            </div>
            <Badge label={r.taken ? "Taken" : "Pending"} color={r.taken ? colors.success : colors.warning} light />
          </Card>
        ))}
      </div>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Medicine Reminder">
        <Input label="Medicine Name" value={form.medicine} onChange={e => setForm(f => ({ ...f, medicine: e.target.value }))} placeholder="e.g. Metformin" />
        <Input label="Dosage" value={form.dose} onChange={e => setForm(f => ({ ...f, dose: e.target.value }))} placeholder="e.g. 500mg" />
        <Input label="Reminder Time" type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
          <Button variant="secondary" onClick={() => setShowAdd(false)}>Cancel</Button>
          <Button variant="primary" onClick={addReminder}>Add Reminder</Button>
        </div>
      </Modal>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// PROFILE PAGE
// ═══════════════════════════════════════════════════════════
function ProfilePage({ user, showToast }) {
  const [form, setForm] = useState({ name: user.name, email: user.email, phone: "+1 (555) 234-5678", dob: user.dob || "1985-03-15", blood: user.blood || "A+", address: "123 Main St, New York, NY 10001", emergency: "Jane Wilson", emergencyPhone: "+1 (555) 987-6543", emergencyRelation: "Spouse" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const save = () => showToast("Profile updated successfully!", "success");

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: colors.text, margin: "0 0 24px" }}>👤 Profile Settings</h1>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 20 }}>
        <div>
          <Card style={{ textAlign: "center", marginBottom: 16 }}>
            <Avatar name={user.avatar} size={80} bg={colors.primary} />
            <div style={{ marginTop: 16, fontWeight: 700, fontSize: 18, color: colors.text }}>{user.name}</div>
            <div style={{ fontSize: 13, color: colors.textMuted, marginTop: 4, textTransform: "capitalize" }}>{user.role}</div>
            {user.specialty && <Badge label={user.specialty} color={colors.primary} light />}
            <Button size="sm" variant="ghost" style={{ marginTop: 14, width: "100%" }} onClick={() => showToast("Photo upload coming soon!", "info")}>Change Photo</Button>
          </Card>

          <Card>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12, color: colors.text }}>Quick Info</div>
            {[
              { label: "Blood Type", value: form.blood },
              { label: "Date of Birth", value: form.dob },
              { label: "Account Type", value: user.role },
            ].map(item => (
              <div key={item.label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${colors.borderLight}`, fontSize: 14 }}>
                <span style={{ color: colors.textMuted }}>{item.label}</span>
                <span style={{ fontWeight: 600, color: colors.text, textTransform: "capitalize" }}>{item.value}</span>
              </div>
            ))}
          </Card>
        </div>

        <div>
          <Card style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16, color: colors.text }}>Personal Information</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
              <Input label="Full Name" value={form.name} onChange={e => set("name", e.target.value)} style={{ marginRight: 8 }} />
              <Input label="Email" type="email" value={form.email} onChange={e => set("email", e.target.value)} />
              <Input label="Phone" value={form.phone} onChange={e => set("phone", e.target.value)} style={{ marginRight: 8 }} />
              <Input label="Date of Birth" type="date" value={form.dob} onChange={e => set("dob", e.target.value)} />
            </div>
            <Input label="Address" value={form.address} onChange={e => set("address", e.target.value)} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
              <Select label="Blood Type" value={form.blood} onChange={e => set("blood", e.target.value)} options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(v => ({ value: v, label: v }))} />
            </div>
          </Card>

          <Card style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16, color: colors.text }}>🚨 Emergency Contact</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
              <Input label="Contact Name" value={form.emergency} onChange={e => set("emergency", e.target.value)} style={{ marginRight: 8 }} />
              <Input label="Phone Number" value={form.emergencyPhone} onChange={e => set("emergencyPhone", e.target.value)} />
              <Input label="Relationship" value={form.emergencyRelation} onChange={e => set("emergencyRelation", e.target.value)} style={{ marginRight: 8 }} />
            </div>
          </Card>

          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <Button variant="secondary">Discard Changes</Button>
            <Button variant="primary" onClick={save}>Save Profile</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// DOCTOR DASHBOARD
// ═══════════════════════════════════════════════════════════
function DoctorDashboard({ user }) {
  const myAppointments = DB.appointments.filter(a => a.doctorId === user.id);
  const today = new Date().toISOString().split("T")[0];
  const todayAppts = myAppointments.filter(a => a.date === "2025-07-15");

  const weekData = [
    { day: "Mon", patients: 6 }, { day: "Tue", patients: 8 }, { day: "Wed", patients: 5 },
    { day: "Thu", patients: 9 }, { day: "Fri", patients: 7 }, { day: "Sat", patients: 3 }, { day: "Sun", patients: 0 },
  ];

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: colors.text, margin: "0 0 6px" }}>Welcome, {user.name} 👨‍⚕️</h1>
        <p style={{ color: colors.textMuted, margin: 0 }}>{user.specialty} • Today: {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        <StatCard icon="📅" label="Today's Appointments" value={todayAppts.length || 3} color={colors.primary} />
        <StatCard icon="👥" label="Total Patients" value={12} sub="+2 this week" color={colors.teal} trend="up" />
        <StatCard icon="⏳" label="Pending Reviews" value={myAppointments.filter(a => a.status === "pending").length} color={colors.warning} />
        <StatCard icon="💊" label="Prescriptions Issued" value={DB.prescriptions.filter(p => p.doctorId === user.id).length} color={colors.success} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 20, marginBottom: 24 }}>
        <Card>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16, color: colors.text }}>📊 Weekly Patient Load</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weekData}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="patients" fill={colors.primary} radius={[4, 4, 0, 0]} name="Patients" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16, color: colors.text }}>Today's Schedule</div>
          {[
            { time: "09:00", patient: "John Doe", type: "Cardiac Checkup" },
            { time: "10:30", patient: "Maria Garcia", type: "Follow-up" },
            { time: "14:00", patient: "Robert Chen", type: "New Consultation" },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: `1px solid ${colors.borderLight}` }}>
              <div style={{ width: 50, flexShrink: 0, fontSize: 12, fontWeight: 700, color: colors.primary, paddingTop: 2 }}>{s.time}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: colors.text }}>{s.patient}</div>
                <div style={{ fontSize: 12, color: colors.textMuted }}>{s.type}</div>
              </div>
            </div>
          ))}
        </Card>
      </div>

      <Card>
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16, color: colors.text }}>Pending Appointments</div>
        {myAppointments.filter(a => a.status === "pending").map(appt => {
          const patient = DB.users.find(u => u.id === appt.patientId);
          return (
            <div key={appt.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderBottom: `1px solid ${colors.borderLight}` }}>
              <Avatar name={patient?.avatar} size={38} bg={colors.secondary} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: colors.text }}>{patient?.name}</div>
                <div style={{ fontSize: 13, color: colors.textMuted }}>{appt.type} • {appt.date} at {appt.time}</div>
              </div>
              <Badge label="Pending" color={colors.warning} light />
            </div>
          );
        })}
        {myAppointments.filter(a => a.status === "pending").length === 0 && (
          <div style={{ textAlign: "center", padding: "20px 0", color: colors.textMuted }}>No pending appointments</div>
        )}
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// PATIENTS PAGE (Doctor)
// ═══════════════════════════════════════════════════════════
function PatientsPage({ user }) {
  const patients = DB.users.filter(u => u.role === "patient");
  const [selected, setSelected] = useState(null);

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: colors.text, margin: "0 0 24px" }}>👥 My Patients</h1>
      <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 1fr" : "1fr", gap: 20 }}>
        <div>
          {patients.map(p => (
            <Card key={p.id} onClick={() => setSelected(selected?.id === p.id ? null : p)} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12, cursor: "pointer", border: selected?.id === p.id ? `2px solid ${colors.primary}` : `1px solid ${colors.border}` }}>
              <Avatar name={p.avatar} size={44} bg={colors.teal} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: colors.text }}>{p.name}</div>
                <div style={{ fontSize: 13, color: colors.textMuted }}>{p.email} • Blood: {p.blood || "A+"}</div>
              </div>
              <div style={{ fontSize: 13, color: colors.textMuted }}>{DB.appointments.filter(a => a.patientId === p.id).length} visits</div>
            </Card>
          ))}
        </div>
        {selected && (
          <Card>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <Avatar name={selected.avatar} size={60} bg={colors.teal} />
              <div style={{ fontWeight: 700, fontSize: 18, marginTop: 12 }}>{selected.name}</div>
              <div style={{ color: colors.textMuted, fontSize: 13 }}>{selected.email}</div>
            </div>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>Appointments</div>
            {DB.appointments.filter(a => a.patientId === selected.id).map(a => (
              <div key={a.id} style={{ padding: "10px 0", borderBottom: `1px solid ${colors.borderLight}` }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{a.type}</div>
                <div style={{ fontSize: 12, color: colors.textMuted }}>{a.date} • {a.status}</div>
              </div>
            ))}
            <div style={{ fontWeight: 700, fontSize: 15, marginTop: 16, marginBottom: 10 }}>Reports</div>
            {DB.reports.filter(r => r.patientId === selected.id).map(r => (
              <div key={r.id} style={{ padding: "10px 0", borderBottom: `1px solid ${colors.borderLight}` }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{r.name}</div>
                <div style={{ fontSize: 12, color: colors.textMuted }}>{r.date} • {r.status}</div>
              </div>
            ))}
          </Card>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// ANALYTICS PAGE (Doctor/Admin)
// ═══════════════════════════════════════════════════════════
function AnalyticsPage({ user }) {
  const monthData = [
    { month: "Jan", appointments: 45, reports: 32 }, { month: "Feb", appointments: 52, reports: 38 },
    { month: "Mar", appointments: 48, reports: 41 }, { month: "Apr", appointments: 61, reports: 45 },
    { month: "May", appointments: 55, reports: 39 }, { month: "Jun", appointments: 67, reports: 52 },
    { month: "Jul", appointments: 58, reports: 44 },
  ];
  const pieData = [
    { name: "Cardiology", value: 35 }, { name: "Neurology", value: 25 },
    { name: "General", value: 20 }, { name: "Other", value: 20 },
  ];
  const PCOLORS = [colors.primary, colors.secondary, colors.success, colors.warning];

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: colors.text, margin: "0 0 24px" }}>📊 Analytics Dashboard</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        <StatCard icon="👥" label="Total Patients" value="248" sub="+12% this month" color={colors.primary} trend="up" />
        <StatCard icon="📅" label="Appointments" value="1,247" sub="+8% this month" color={colors.success} trend="up" />
        <StatCard icon="🤖" label="AI Queries" value="3,892" sub="This month" color={colors.secondary} />
        <StatCard icon="📋" label="Reports Analyzed" value="562" sub="By AI" color={colors.teal} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginBottom: 20 }}>
        <Card>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Appointments vs Reports (Monthly)</div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={monthData}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="appointments" stroke={colors.primary} strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="reports" stroke={colors.success} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Consultation Types</div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {pieData.map((entry, i) => <Cell key={i} fill={PCOLORS[i % PCOLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
            {pieData.map((d, i) => (
              <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: colors.textMuted }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: PCOLORS[i] }} />
                {d.name} ({d.value}%)
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// ADMIN DASHBOARD
// ═══════════════════════════════════════════════════════════
function AdminDashboard({ user }) {
  const stats = [
    { icon: "👥", label: "Total Patients", value: DB.users.filter(u => u.role === "patient").length, color: colors.primary },
    { icon: "👨‍⚕️", label: "Doctors", value: DB.users.filter(u => u.role === "doctor").length, color: colors.teal },
    { icon: "📅", label: "Appointments", value: DB.appointments.length, color: colors.secondary },
    { icon: "📋", label: "Reports", value: DB.reports.length, color: colors.warning },
  ];

  const activityLog = [
    { action: "New patient registered", user: "Priya Sharma", time: "2 minutes ago", type: "success" },
    { action: "Appointment booked", user: "James Wilson", time: "15 minutes ago", type: "info" },
    { action: "Report uploaded", user: "James Wilson", time: "1 hour ago", type: "info" },
    { action: "AI analysis completed", user: "System", time: "2 hours ago", type: "success" },
    { action: "Doctor login", user: "Dr. Sarah Chen", time: "3 hours ago", type: "info" },
  ];

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: colors.text, margin: "0 0 6px" }}>🛡️ Admin Dashboard</h1>
        <p style={{ color: colors.textMuted, margin: 0 }}>System overview and management</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
        <Card>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>User Distribution</div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={[{ name: "Patients", value: 2 }, { name: "Doctors", value: 2 }, { name: "Admin", value: 1 }]} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                {[colors.primary, colors.teal, colors.secondary].map((c, i) => <Cell key={i} fill={c} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Activity Log</div>
          <div style={{ maxHeight: 220, overflowY: "auto" }}>
            {activityLog.map((log, i) => (
              <div key={i} style={{ display: "flex", gap: 10, padding: "10px 0", borderBottom: `1px solid ${colors.borderLight}` }}>
                <span style={{ fontSize: 16 }}>{log.type === "success" ? "✅" : "ℹ️"}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>{log.action}</div>
                  <div style={{ fontSize: 12, color: colors.textMuted }}>{log.user} • {log.time}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>All Users</div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: colors.surfaceAlt }}>
              {["Name", "Email", "Role", "Status"].map(h => (
                <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 12, fontWeight: 700, color: colors.textMuted, borderBottom: `1px solid ${colors.border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DB.users.map(u => (
              <tr key={u.id} style={{ borderBottom: `1px solid ${colors.borderLight}` }}>
                <td style={{ padding: "12px 14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Avatar name={u.avatar} size={30} bg={u.role === "doctor" ? colors.teal : u.role === "admin" ? colors.secondary : colors.primary} />
                    <span style={{ fontSize: 14, fontWeight: 600, color: colors.text }}>{u.name}</span>
                  </div>
                </td>
                <td style={{ padding: "12px 14px", fontSize: 13, color: colors.textMuted }}>{u.email}</td>
                <td style={{ padding: "12px 14px" }}><Badge label={u.role} color={u.role === "doctor" ? colors.teal : u.role === "admin" ? colors.secondary : colors.primary} light /></td>
                <td style={{ padding: "12px 14px" }}><Badge label="Active" color={colors.success} light /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// ADMIN MANAGE PAGES
// ═══════════════════════════════════════════════════════════
function ManageUsersPage({ user, showToast }) {
  const [users, setUsers] = useState(DB.users);
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? users : users.filter(u => u.role === filter);

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: colors.text, margin: "0 0 24px" }}>👥 Manage Users</h1>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {["all", "patient", "doctor", "admin"].map(r => (
          <button key={r} onClick={() => setFilter(r)} style={{ padding: "8px 16px", borderRadius: 8, border: `1px solid ${filter === r ? colors.primary : colors.border}`, background: filter === r ? `${colors.primary}15` : "transparent", color: filter === r ? colors.primary : colors.textMuted, cursor: "pointer", fontSize: 13, fontWeight: filter === r ? 600 : 400, textTransform: "capitalize" }}>{r}</button>
        ))}
      </div>
      <Card>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: colors.surfaceAlt }}>
              {["User", "Email", "Role", "Actions"].map(h => <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 12, fontWeight: 700, color: colors.textMuted, borderBottom: `1px solid ${colors.border}` }}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id} style={{ borderBottom: `1px solid ${colors.borderLight}` }}>
                <td style={{ padding: "12px 14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Avatar name={u.avatar} size={32} bg={u.role === "doctor" ? colors.teal : colors.primary} />
                    <span style={{ fontSize: 14, fontWeight: 600 }}>{u.name}</span>
                  </div>
                </td>
                <td style={{ padding: "12px 14px", fontSize: 13, color: colors.textMuted }}>{u.email}</td>
                <td style={{ padding: "12px 14px" }}><Badge label={u.role} color={u.role === "doctor" ? colors.teal : colors.primary} light /></td>
                <td style={{ padding: "12px 14px" }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Button size="sm" variant="ghost" onClick={() => showToast("Edit user coming soon", "info")}>Edit</Button>
                    {u.id !== user.id && <Button size="sm" variant="danger" onClick={() => showToast("User suspended", "warning")}>Suspend</Button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function SettingsPage({ showToast }) {
  const [settings, setSettings] = useState({ emailNotif: true, smsNotif: false, twoFactor: false, aiAnalysis: true, darkMode: false, dataSharing: true });
  const toggle = k => setSettings(s => ({ ...s, [k]: !s[k] }));

  const Toggle = ({ val, onToggle }) => (
    <div onClick={onToggle} style={{ width: 44, height: 24, borderRadius: 12, background: val ? colors.primary : colors.border, cursor: "pointer", position: "relative", transition: "background 0.2s" }}>
      <div style={{ position: "absolute", top: 2, left: val ? 22 : 2, width: 20, height: 20, borderRadius: "50%", background: "#fff", transition: "left 0.2s" }} />
    </div>
  );

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: colors.text, margin: "0 0 24px" }}>⚙️ System Settings</h1>
      {[
        { title: "Notifications", items: [{ key: "emailNotif", label: "Email Notifications", desc: "Receive appointment reminders via email" }, { key: "smsNotif", label: "SMS Notifications", desc: "Get SMS alerts for important updates" }] },
        { title: "Security", items: [{ key: "twoFactor", label: "Two-Factor Authentication", desc: "Add extra security to your account" }] },
        { title: "AI Features", items: [{ key: "aiAnalysis", label: "AI Report Analysis", desc: "Automatically analyze uploaded medical reports" }, { key: "dataSharing", label: "Data Sharing for AI Improvement", desc: "Help improve AI accuracy with anonymized data" }] },
      ].map(section => (
        <Card key={section.title} style={{ marginBottom: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16, color: colors.text }}>{section.title}</div>
          {section.items.map((item, i) => (
            <div key={item.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: i < section.items.length - 1 ? `1px solid ${colors.borderLight}` : "none" }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: colors.text }}>{item.label}</div>
                <div style={{ fontSize: 12, color: colors.textMuted, marginTop: 3 }}>{item.desc}</div>
              </div>
              <Toggle val={settings[item.key]} onToggle={() => toggle(item.key)} />
            </div>
          ))}
        </Card>
      ))}
      <Button variant="primary" onClick={() => showToast("Settings saved!", "success")}>Save Settings</Button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════
export default function App() {
  const { user, login, logout, register } = useAuth();
  const [screen, setScreen] = useState("landing"); // landing, login, register, app
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "info") => setToast({ msg, type, id: Date.now() });

  const handleAuth = (form) => {
    if (screen === "login") {
      const result = login(form.email, form.password);
      if (result.success) { setScreen("app"); setActivePage("dashboard"); }
      return result;
    } else {
      const result = register(form);
      if (result.success) { setScreen("app"); setActivePage("dashboard"); }
      return result;
    }
  };

  const handleLogout = () => { logout(); setScreen("landing"); setActivePage("dashboard"); };

  const renderPage = () => {
    if (!user) return null;
    const props = { user, showToast, onNavigate: setActivePage, onPageChange: setActivePage };
    const pages = {
      dashboard: user.role === "patient" ? <PatientDashboard {...props} /> : user.role === "doctor" ? <DoctorDashboard {...props} /> : <AdminDashboard {...props} />,
      "ai-chat": <AIChatPage {...props} />,
      "symptom-checker": <SymptomChecker {...props} />,
      appointments: <AppointmentsPage {...props} />,
      reports: <ReportsPage {...props} />,
      prescriptions: <PrescriptionsPage {...props} />,
      reminders: <RemindersPage {...props} />,
      profile: <ProfilePage {...props} />,
      patients: <PatientsPage {...props} />,
      analytics: <AnalyticsPage {...props} />,
      users: <ManageUsersPage {...props} />,
      settings: <SettingsPage {...props} />,
    };
    return pages[activePage] || <PatientDashboard {...props} />;
  };

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", minHeight: "100vh" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes bounce { 0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)} }
        body { background: #F8FAFC; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 3px; }
        input:focus, select:focus, textarea:focus { border-color: #0EA5E9 !important; box-shadow: 0 0 0 3px rgba(14,165,233,0.15); }
      `}</style>

      {screen === "landing" && <LandingPage onGetStarted={() => setScreen("register")} onLogin={() => setScreen("login")} />}
      {(screen === "login" || screen === "register") && (
        <AuthPage mode={screen} onAuth={handleAuth} onSwitch={() => setScreen(screen === "login" ? "register" : "login")} onBack={() => setScreen("landing")} />
      )}
      {screen === "app" && user && (
        <div style={{ display: "flex", height: "100vh", background: colors.bg }}>
          <Sidebar user={user} activePage={activePage} onNav={setActivePage} onLogout={handleLogout} sidebarOpen={sidebarOpen} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <Header user={user} onToggleSidebar={() => setSidebarOpen(o => !o)} notifications={DB.notifications.filter(n => n.userId === user.id)} onPageChange={setActivePage} />
            <main style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
              {renderPage()}
            </main>
          </div>
        </div>
      )}

      {toast && <Toast key={toast.id} msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
