import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme/colors';
import { StatCard, Card } from '../../components/ui/SharedUI';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: colors.text, margin: "0 0 6px" }}>Admin Portal Overview</h1>
        <p style={{ color: colors.textMuted, margin: 0 }}>Enterprise system health and management.</p>
      </div>

      {/* Enterprise Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
        <StatCard onClick={() => navigate('/dashboard/users')} icon="👥" label="Total Patients" value="1,245" sub="+12% this month" color={colors.primary} trend="up" />
        <StatCard onClick={() => navigate('/dashboard/doctors')} icon="🧑‍⚕️" label="Total Doctors" value="48" sub="+2 new" color={colors.indigo || colors.primary} />
        <StatCard onClick={() => navigate('/dashboard/appointments')} icon="🗓️" label="Total Appointments" value="3,890" sub="+156 this week" color={colors.teal} />
        <StatCard onClick={() => navigate('/dashboard/appointments')} icon="⌛" label="Today's Appointments" value="124" sub="42 pending" color={colors.warning} />
        <StatCard onClick={() => navigate('/dashboard/users')} icon="📈" label="Active Users" value="892" sub="Currently online" color={colors.purple} />
        <StatCard onClick={() => navigate('/dashboard/appointments')} icon="⚠️" label="Emergency Cases" value="3" sub="Requires attention!" color={colors.danger} trend="down" />
        <StatCard onClick={() => navigate('/dashboard/analytics')} icon="⚡" label="AI Usage Stats" value="12.5K" sub="API calls this month" color={colors.warning} />
        <StatCard onClick={() => navigate('/dashboard/settings')} icon="🛡️" label="System Health" value="99.9%" sub="All systems operational" color={colors.success} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <Card>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: colors.text, margin: "0 0 16px" }}>Recent Doctor Registrations</h2>
          <div style={{ textAlign: "center", padding: "40px 0", color: colors.textMuted, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 32 }}>🧑‍⚕️</span>
            <div>No pending approvals required.</div>
          </div>
        </Card>
        
        <Card>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: colors.text, margin: "0 0 16px" }}>Live System Alerts</h2>
          <div style={{ textAlign: "center", padding: "40px 0", color: colors.textMuted, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
             <span style={{ fontSize: 32 }}>🛡️</span>
             <div>System is running smoothly.</div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
