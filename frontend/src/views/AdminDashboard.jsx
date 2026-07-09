import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Users, Activity, Building, Calendar, Trash2, 
  Plus, LogOut, AlertCircle, RefreshCw
} from 'lucide-react';

const AdminDashboard = () => {
  const { user, logout, api } = useAuth();
  const [reports, setReports] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  
  // Department addition state
  const [deptName, setDeptName] = useState('');
  const [deptDesc, setDeptDesc] = useState('');

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [loading, setLoading] = useState(false);

  // Custom confirm modal state — replaces window.confirm (which silently fails)
  const [confirmModal, setConfirmModal] = useState({ open: false, title: '', message: '', onConfirm: null });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  const openConfirm = (title, message, onConfirm) => {
    setConfirmModal({ open: true, title, message, onConfirm });
  };

  const closeConfirm = () => {
    setConfirmModal({ open: false, title: '', message: '', onConfirm: null });
  };

  const fetchDashboardData = async () => {
    try {
      const reportRes = await api.get('/api/admin/reports');
      setReports(reportRes.data);

      const deptRes = await api.get('/api/admin/departments');
      setDepartments(deptRes.data);

      const docRes = await api.get('/api/doctors');
      setDoctors(docRes.data);
    } catch (err) {
      console.error(err);
      showToast("Failed to fetch analytics or departments.", "error");
    }
  };

  const handleAddDepartment = async (e) => {
    e.preventDefault();
    if (!deptName.trim()) return;

    setLoading(true);
    try {
      await api.post('/api/admin/departments', {
        name: deptName,
        description: deptDesc
      });
      showToast("Department added successfully!");
      setDeptName('');
      setDeptDesc('');
      fetchDashboardData();
    } catch (err) {
      const msg = err.response?.data || "Failed to add department.";
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDepartment = (id, name) => {
    openConfirm(
      "Delete Department?",
      `Are you sure you want to delete the "${name}" department? This cannot be undone.`,
      async () => {
        closeConfirm();
        try {
          await api.delete(`/api/admin/departments/${id}`);
          showToast("Department deleted successfully.");
          fetchDashboardData();
        } catch (err) {
          showToast("Failed to delete department.", "error");
        }
      }
    );
  };

  const handleDeleteDoctor = (id, name) => {
    openConfirm(
      "Remove Doctor?",
      `Are you sure you want to remove ${name}? This will delete their user account and all associated data.`,
      async () => {
        closeConfirm();
        try {
          await api.delete(`/api/admin/doctors/${id}`);
          showToast("Doctor profile removed successfully.");
          fetchDashboardData();
        } catch (err) {
          showToast("Failed to remove doctor profile.", "error");
        }
      }
    );
  };

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <nav className="navbar">
        <div className="brand">
          <span>⚙️</span> MEDCURE HOSPITALS
        </div>
        <div className="nav-links">
          <div className="nav-user">
            <span className="user-badge">{user?.fullName}</span>
            <button className="btn btn-secondary" onClick={logout} style={{ padding: '0.5rem' }}>
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Grid Content */}
      <div className="main-content">
        {toast.show && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: toast.type === 'error' ? 'var(--error-bg)' : 'var(--success-bg)', color: toast.type === 'error' ? 'var(--error-color)' : 'var(--success-color)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: `1px solid ${toast.type === 'error' ? '#fca5a5' : '#86efac'}`, marginBottom: '1.5rem', fontWeight: '500' }}>
            <AlertCircle size={20} />
            <span>{toast.message}</span>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-color)', fontWeight: '700' }}>Dashboard Analytics</h2>
            <p style={{ color: 'var(--text-muted)' }}>Hospital booking status and system overview</p>
          </div>
          <button className="btn btn-outline" onClick={fetchDashboardData}>
            <RefreshCw size={16} /> Refresh
          </button>
        </div>

        {/* Analytics Grid */}
        {reports && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ padding: '0.75rem', backgroundColor: 'var(--primary-light)', borderRadius: '50%', color: 'var(--primary-color)' }}>
                <Users size={24} />
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{reports.totalPatients}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Patients</div>
              </div>
            </div>

            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ padding: '0.75rem', backgroundColor: 'var(--primary-light)', borderRadius: '50%', color: 'var(--primary-color)' }}>
                <Activity size={24} />
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{reports.totalDoctors}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Active Doctors</div>
              </div>
            </div>

            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ padding: '0.75rem', backgroundColor: 'var(--primary-light)', borderRadius: '50%', color: 'var(--primary-color)' }}>
                <Calendar size={24} />
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{reports.totalAppointments}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Bookings</div>
              </div>
            </div>

            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ padding: '0.75rem', backgroundColor: 'var(--success-bg)', borderRadius: '50%', color: 'var(--success-color)' }}>
                <Calendar size={24} />
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--success-color)' }}>{reports.completedAppointments}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Completed</div>
              </div>
            </div>

            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ padding: '0.75rem', backgroundColor: 'var(--error-bg)', borderRadius: '50%', color: 'var(--error-color)' }}>
                <Calendar size={24} />
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--error-color)' }}>{reports.cancelledAppointments}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Cancelled</div>
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', flexWrap: 'wrap' }}>
          {/* Section: Departments */}
          <div>
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-color)', marginBottom: '1rem', fontWeight: '700' }}>Add Department</h3>
              <form onSubmit={handleAddDepartment}>
                <div className="form-group">
                  <label className="form-label">Department Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. Cardiology"
                    value={deptName}
                    onChange={(e) => setDeptName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Description of treatments offered..."
                    value={deptDesc}
                    onChange={(e) => setDeptDesc(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ fontSize: '0.9rem', width: '100%' }} disabled={loading}>
                  <Plus size={16} /> Save Department
                </button>
              </form>
            </div>

            <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-color)', marginBottom: '0.75rem', fontWeight: '700' }}>Departments</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {departments.map((dept) => (
                <div key={dept.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
                  <div>
                    <h4 style={{ margin: 0, fontWeight: '700' }}>{dept.name}</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{dept.description}</p>
                  </div>
                  <button 
                    className="btn btn-danger" 
                    style={{ padding: '0.4rem' }} 
                    onClick={() => handleDeleteDepartment(dept.id, dept.name)}
                    title={`Delete ${dept.name}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Doctors Management */}
          <div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-color)', marginBottom: '0.75rem', fontWeight: '700' }}>Active Doctors</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {doctors.map((doc) => (
                <div key={doc.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: 0, fontWeight: '700' }}>{doc.user.fullName}</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{doc.department.name} • {doc.specialization}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>📧 {doc.user.email}</p>
                  </div>
                  <button 
                    className="btn btn-danger" 
                    style={{ padding: '0.5rem' }} 
                    onClick={() => handleDeleteDoctor(doc.id, doc.user.fullName)}
                    title={`Remove ${doc.user.fullName}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {doctors.length === 0 && (
                <div className="card" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                  No doctors registered yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Custom Confirmation Modal (replaces window.confirm) ── */}
      {confirmModal.open && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999
        }}>
          <div style={{
            background: 'white', borderRadius: 'var(--radius-md)', padding: '2rem',
            width: '400px', maxWidth: '90vw', boxShadow: 'var(--shadow-lg)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>⚠️</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '0.5rem' }}>
              {confirmModal.title}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              {confirmModal.message}
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                className="btn btn-outline"
                style={{ minWidth: '110px' }}
                onClick={closeConfirm}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                style={{ minWidth: '110px' }}
                onClick={confirmModal.onConfirm}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
