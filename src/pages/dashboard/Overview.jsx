import React, { useEffect, useState } from 'react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Package, Users, CheckCircle, RefreshCcw } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const COLORS = ['#22c55e', '#4f8ef7', '#ef4444'];

const Overview = () => {
  const [stats, setStats] = useState({
    totalAssets: 0,
    assignedAssets: 0,
    availableAssets: 0,
    totalEmployees: 0,
  });
  
  const [pieData, setPieData] = useState([]);
  const [recentAssignments, setRecentAssignments] = useState([]);

  // Mock data for LineChart (since real history would require a timeseries DB or complex logic)
  const lineData = [
    { name: 'Jan', assets: 40 },
    { name: 'Feb', assets: 55 },
    { name: 'Mar', assets: 80 },
    { name: 'Apr', assets: 110 },
    { name: 'May', assets: 140 },
    { name: 'Jun', assets: 190 },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [assetsRes, employeesRes, assignmentsRes] = await Promise.all([
        api.get('/assets'),
        api.get('/employees'),
        api.get('/assignments')
      ]);

      const assets = assetsRes.data;
      const employees = employeesRes.data;
      const assignments = assignmentsRes.data;

      const available = assets.filter(a => a.status === 'Available').length;
      const assigned = assets.filter(a => a.status === 'Assigned').length;
      const repair = assets.filter(a => a.status === 'Repair').length;

      setStats({
        totalAssets: assets.length,
        assignedAssets: assigned,
        availableAssets: available,
        totalEmployees: employees.length
      });

      setPieData([
        { name: 'Available', value: available },
        { name: 'Assigned', value: assigned },
        { name: 'Repair', value: repair },
      ]);

      // Get last 5 active assignments
      setRecentAssignments(
        assignments
          .filter(a => a.status === 'Active')
          .sort((a, b) => new Date(b.assignedDate) - new Date(a.assignedDate))
          .slice(0, 5)
      );
    } catch (err) {
      toast.error('Failed to load overview data');
    }
  };

  return (
    <div style={{ paddingBottom: '40px' }}>
      <h2 className="title-2" style={{ marginBottom: '24px' }}>Dashboard Overview</h2>
      
      {/* KPI Cards */}
      <div style={styles.kpiGrid}>
        <div className="nexus-card" style={styles.kpiCard}>
          <div>
            <p style={styles.kpiLabel}>Total Assets</p>
            <h3 style={styles.kpiValue}>{stats.totalAssets}</h3>
          </div>
          <Package color="var(--accent-blue)" size={40} opacity={0.8} />
        </div>
        <div className="nexus-card" style={styles.kpiCard}>
          <div>
            <p style={styles.kpiLabel}>Assigned Assets</p>
            <h3 style={styles.kpiValue}>{stats.assignedAssets}</h3>
          </div>
          <CheckCircle color="var(--accent-amber)" size={40} opacity={0.8} />
        </div>
        <div className="nexus-card" style={styles.kpiCard}>
          <div>
            <p style={styles.kpiLabel}>Available Assets</p>
            <h3 style={styles.kpiValue}>{stats.availableAssets}</h3>
          </div>
          <RefreshCcw color="var(--accent-green)" size={40} opacity={0.8} />
        </div>
        <div className="nexus-card" style={styles.kpiCard}>
          <div>
            <p style={styles.kpiLabel}>Total Employees</p>
            <h3 style={styles.kpiValue}>{stats.totalEmployees}</h3>
          </div>
          <Users color="var(--accent-cyan)" size={40} opacity={0.8} />
        </div>
      </div>

      {/* Charts */}
      <div style={styles.chartsRow}>
        <div className="nexus-card" style={{ flex: 6, height: '350px' }}>
          <h3 style={{ marginBottom: '16px', fontSize: '1.2rem' }}>Assets Over Time</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData} margin={{ top: 5, right: 20, bottom: 25, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="name" stroke="var(--text-secondary)" tick={{fill: 'var(--text-secondary)'}} />
              <YAxis stroke="var(--text-secondary)" tick={{fill: 'var(--text-secondary)'}} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: '8px' }}
                itemStyle={{ color: 'var(--text-primary)' }}
              />
              <Line type="monotone" dataKey="assets" stroke="var(--accent-blue)" strokeWidth={3} dot={{r: 4, fill: 'var(--accent-blue)', strokeWidth: 2}} activeDot={{r: 6}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="nexus-card" style={{ flex: 4, height: '350px' }}>
          <h3 style={{ marginBottom: '16px', fontSize: '1.2rem', textAlign: 'center' }}>Status Distribution</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="45%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: '8px' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="nexus-table-wrapper" style={{ marginTop: '32px' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '1.2rem' }}>Recent Assignments</h3>
        </div>
        <table style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Asset Name</th>
              <th>Assigned To</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentAssignments.length === 0 ? (
              <tr><td colSpan="4" style={{textAlign: 'center', padding: '20px', color: 'var(--text-secondary)'}}>No recent activity found.</td></tr>
            ) : (
              recentAssignments.map((assignment) => (
                <tr key={assignment._id}>
                  <td>{assignment.asset?.name || 'Unknown'}</td>
                  <td>{assignment.employee?.name || 'Unknown'}</td>
                  <td>{new Date(assignment.assignedDate).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge ${assignment.status.toLowerCase()}`}>{assignment.status}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

const styles = {
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '24px',
    marginBottom: '32px'
  },
  kpiCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '24px'
  },
  kpiLabel: {
    fontSize: '0.95rem',
    color: 'var(--text-secondary)',
    marginBottom: '8px'
  },
  kpiValue: {
    fontSize: '2rem',
    color: 'var(--text-primary)',
    fontWeight: 700
  },
  chartsRow: {
    display: 'flex',
    gap: '24px',
    alignItems: 'stretch'
  }
};

export default Overview;
