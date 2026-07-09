import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Calendar, Clock, Plus, CheckCircle,
  LogOut, AlertCircle, RefreshCw, Clipboard,
} from 'lucide-react';

const DoctorDashboard = () => {
  const { user, logout, api } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [date, setDate]                 = useState('');
  const [startTime, setStartTime]       = useState('09:00');
  const [endTime, setEndTime]           = useState('09:30');
  const [activeAppointment, setActiveAppointment] = useState(null);
  const [clinicalNotes, setClinicalNotes]         = useState('');
  const [prescription, setPrescription]           = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchAppointments(); }, []);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  const fetchAppointments = async () => {
    try {
      const res = await api.get('/api/doctor/appointments');
      setAppointments(res.data);
    } catch {}
  };

  const handleAddSlot = async e => {
    e.preventDefault();
    if (!date) { showToast('Please choose a valid date.', 'error'); return; }
    setLoading(true);
    try {
      await api.post('/api/doctor/slots', { date, startTime, endTime });
      showToast('Availability slot added successfully!');
      setDate('');
    } catch (err) {
      showToast(err.response?.data || 'Failed to add slot.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openNotesModal = appt => {
    setActiveAppointment(appt);
    setClinicalNotes(appt.clinicalNotes || '');
    setPrescription(appt.prescription  || '');
  };

  const handleSaveNotes = async e => {
    e.preventDefault();
    try {
      await api.put(`/api/doctor/appointments/${activeAppointment.id}/clinical`, { clinicalNotes, prescription });
      showToast('Clinical notes and prescription updated!');
      setActiveAppointment(null);
      fetchAppointments();
    } catch {
      showToast('Failed to save notes.', 'error');
    }
  };

  const handleCompleteAppointment = async apptId => {
    try {
      await api.put(`/api/doctor/appointments/${apptId}/complete`);
      showToast('Appointment marked as Completed!');
      fetchAppointments();
    } catch {
      showToast('Failed to mark appointment completed.', 'error');
    }
  };

  const getStatusBadge = status => {
    switch (status) {
      case 'SCHEDULED':   return <span className="badge badge-primary">Scheduled</span>;
      case 'RESCHEDULED': return <span className="badge badge-warning">Rescheduled</span>;
      case 'CANCELLED':   return <span className="badge badge-danger">Cancelled</span>;
      case 'COMPLETED':   return <span className="badge badge-success">Completed</span>;
      default:            return <span className="badge">{status}</span>;
    }
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="brand"><span>🩺</span> MEDCURE HOSPITALS</div>
        <div className="nav-links">
          <div className="nav-user">
            <span className="user-badge">{user?.fullName}</span>
            <button className="btn btn-secondary" onClick={logout} style={{ padding: '0.5rem' }}>
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </nav>

      <div className="main-content">
        {toast.show && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: toast.type === 'error' ? 'var(--error-bg)' : 'var(--success-bg)', color: toast.type === 'error' ? 'var(--error-color)' : 'var(--success-color)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: `1px solid ${toast.type === 'error' ? '#fca5a5' : '#86efac'}`, marginBottom: '1.5rem', fontWeight: '500' }}>
            <AlertCircle size={20} />
            <span>{toast.message}</span>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', alignItems: 'flex-start' }}>
          <div className="card">
            <h2 style={{ fontSize: '1.25rem', color: 'var(--primary-color)', marginBottom: '1.25rem', fontWeight: '700', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              Add Availability Slot
            </h2>
            <form onSubmit={handleAddSlot}>
              <div className="form-group">
                <label className="form-label">Date</label>
                <input type="date" className="form-input" value={date} onChange={e => setDate(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Start Time</label>
                <input type="time" className="form-input" value={startTime} onChange={e => setStartTime(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">End Time</label>
                <input type="time" className="form-input" value={endTime} onChange={e => setEndTime(e.target.value)} required />
              </div>
              <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: '0.5rem' }} disabled={loading}>
                <Plus size={18} /> Add Time Slot
              </button>
            </form>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.4rem', color: 'var(--primary-color)', fontWeight: '700' }}>Clinic Appointments</h2>
              <button className="btn btn-outline" onClick={fetchAppointments} style={{ padding: '0.4rem 0.75rem' }}>
                <RefreshCw size={16} />
              </button>
            </div>

            {appointments.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                <p style={{ color: 'var(--text-muted)' }}>No appointments yet. Add availability slots so patients can book.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {appointments.map(appt => (
                  <div key={appt.id} className="card" style={{ borderLeft: appt.status === 'COMPLETED' ? '6px solid var(--success-color)' : appt.status === 'CANCELLED' ? '6px solid var(--error-color)' : '6px solid var(--primary-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', margin: 0 }}>{appt.patient.fullName}</h3>
                          {getStatusBadge(appt.status)}
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.25rem' }}>
                          <Calendar size={14} /> {appt.slot.date} | <Clock size={14} /> {appt.slot.startTime} – {appt.slot.endTime}
                        </p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>📞 {appt.patient.phone}</p>
                      </div>

                      {appt.status !== 'CANCELLED' && (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }} onClick={() => openNotesModal(appt)}>
                            <Clipboard size={14} /> Notes
                          </button>
                          {appt.status !== 'COMPLETED' && (
                            <button className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }} onClick={() => handleCompleteAppointment(appt.id)}>
                              <CheckCircle size={14} /> Complete
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {(appt.clinicalNotes || appt.prescription) && (
                      <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#fafaf9', borderRadius: 'var(--radius-sm)', borderTop: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
                        {appt.clinicalNotes && <div><strong>Notes:</strong> {appt.clinicalNotes}</div>}
                        {appt.prescription  && <div style={{ marginTop: '0.25rem', color: 'var(--primary-color)' }}><strong>Prescription:</strong> {appt.prescription}</div>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {activeAppointment && (
        <div className="modal-overlay" onClick={() => setActiveAppointment(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-color)', marginBottom: '0.5rem', fontWeight: '700' }}>
              Add Clinical Records
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Recording for <strong>{activeAppointment.patient.fullName}</strong>
            </p>
            <form onSubmit={handleSaveNotes}>
              <div className="form-group">
                <label className="form-label">Clinical &amp; Treatment Notes</label>
                <textarea className="form-input" rows="3" value={clinicalNotes} onChange={e => setClinicalNotes(e.target.value)} placeholder="Describe diagnosis, observations, or follow-up instructions..." style={{ resize: 'none', fontFamily: 'inherit' }} />
              </div>
              <div className="form-group">
                <label className="form-label">Prescription Details</label>
                <textarea className="form-input" rows="2" value={prescription} onChange={e => setPrescription(e.target.value)} placeholder="e.g. Paracetamol 500mg – Twice daily for 5 days" style={{ resize: 'none', fontFamily: 'inherit' }} />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary btn-full">Save Records</button>
                <button type="button" className="btn btn-secondary btn-full" onClick={() => setActiveAppointment(null)}>Close</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
