import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Search, Calendar, Clock, User, Heart, MessageSquare, 
  LogOut, Bell, FileText, CheckCircle, XCircle, AlertCircle 
} from 'lucide-react';

const PatientDashboard = () => {
  const { user, logout, api } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  
  // Reschedule targeting
  const [rescheduleAppointmentId, setRescheduleAppointmentId] = useState(null);
  const [rescheduleDoctorId, setRescheduleDoctorId] = useState(null);

  const [appointments, setAppointments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [activeTab, setActiveTab] = useState('search'); // 'search', 'appointments', 'records'
  const [confirmCancelId, setConfirmCancelId] = useState(null); // ID of appointment to confirm cancel

  // Chatbot state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: 'Hello! I am your MEDCURE Medical Assistant. How can I help you today? Ask me about booking, doctors, or services.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    fetchDoctors();
    fetchMyAppointments();
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  const fetchDoctors = async (query = '') => {
    try {
      const res = await api.get(`/api/doctors?query=${query}`);
      setDoctors(res.data);
    } catch (err) {
      console.error('Error fetching doctors', err);
    }
  };

  const fetchMyAppointments = async () => {
    try {
      const res = await api.get('/api/appointments/my');
      setAppointments(res.data);
    } catch (err) {
      console.error('Error fetching appointments', err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/api/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error('Error fetching notifications', err);
    }
  };

  const markNotificationRead = async (id) => {
    try {
      await api.put(`/api/notifications/${id}/read`);
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDoctors(searchQuery);
  };

  const handleSelectDoctor = async (doc) => {
    setSelectedDoctor(doc);
    setRescheduleAppointmentId(null);
    try {
      const res = await api.get(`/api/doctors/${doc.id}/slots?available=true`);
      setAvailableSlots(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const startReschedule = async (appt) => {
    setRescheduleAppointmentId(appt.id);
    setRescheduleDoctorId(appt.doctor.id);
    try {
      const res = await api.get(`/api/doctors/${appt.doctor.id}/slots?available=true`);
      setAvailableSlots(res.data);
      // Automatically focus on slot picking view/modal
      setSelectedDoctor(appt.doctor);
      showToast("Select a new slot to reschedule", "info");
    } catch (err) {
      console.error(err);
    }
  };

  const handleBookSlot = async (slotId) => {
    try {
      if (rescheduleAppointmentId) {
        // Rescheduling flow
        await api.put(`/api/appointments/${rescheduleAppointmentId}/reschedule`, { newSlotId: slotId });
        showToast("Appointment rescheduled successfully!");
        setRescheduleAppointmentId(null);
        setRescheduleDoctorId(null);
      } else {
        // Booking flow
        await api.post('/api/appointments/book', { slotId });
        showToast("Appointment booked successfully!");
      }
      setSelectedDoctor(null);
      fetchMyAppointments();
      fetchNotifications();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || "Operation failed.";
      showToast(msg, "error");
    }
  };

  const handleCancelAppointment = async () => {
    const apptId = confirmCancelId;
    setConfirmCancelId(null);
    try {
      await api.delete(`/api/appointments/${apptId}`);
      showToast("Appointment cancelled successfully.", "warning");
      fetchMyAppointments();
      fetchNotifications();
    } catch (err) {
      showToast("Failed to cancel appointment.", "error");
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setChatMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setChatInput('');
    setChatLoading(true);

    try {
      const res = await api.post('/api/chat', { message: userText });
      setChatMessages(prev => [...prev, { sender: 'bot', text: res.data.reply }]);
    } catch (err) {
      setChatMessages(prev => [...prev, { sender: 'bot', text: "I'm having trouble connecting. Please try again shortly." }]);
    } finally {
      setChatLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'SCHEDULED': return <span className="badge badge-primary">Scheduled</span>;
      case 'RESCHEDULED': return <span className="badge badge-warning">Rescheduled</span>;
      case 'CANCELLED': return <span className="badge badge-danger">Cancelled</span>;
      case 'COMPLETED': return <span className="badge badge-success">Completed</span>;
      default: return <span className="badge">{status}</span>;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <nav className="navbar">
        <div className="brand" onClick={() => setActiveTab('search')}>
          <span>🏥</span> MEDCURE HOSPITALS
        </div>
        
        <div className="nav-links">
          <button 
            className="btn btn-outline" 
            style={{ position: 'relative', padding: '0.5rem 0.75rem' }}
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span style={{ position: 'absolute', top: '-4px', right: '-4px', backgroundColor: 'var(--error-color)', color: 'white', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>
                {unreadCount}
              </span>
            )}
          </button>
          
          <div className="nav-user">
            <span className="user-badge">{user?.fullName}</span>
            <button className="btn btn-secondary" onClick={logout} style={{ padding: '0.5rem' }}>
              <LogOut size={18} />
            </button>
          </div>
        </div>

        {/* Notifications dropdown menu */}
        {showNotifications && (
          <div style={{ position: 'absolute', top: '65px', right: '2rem', width: '320px', backgroundColor: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', zIndex: 110, maxHeight: '400px', overflowY: 'auto', padding: '1rem' }}>
            <h4 style={{ marginBottom: '0.75rem', color: 'var(--primary-color)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Notifications</h4>
            {notifications.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No notifications yet</p>
            ) : (
              notifications.map((n) => (
                <div key={n.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', borderBottom: '1px solid #f5f5f4', padding: '0.5rem 0', opacity: n.isRead ? 0.6 : 1 }}>
                  <p style={{ fontSize: '0.85rem' }}>{n.message}</p>
                  {!n.isRead && (
                    <button 
                      style={{ border: 'none', background: 'none', color: 'var(--primary-color)', fontSize: '0.75rem', cursor: 'pointer', alignSelf: 'flex-end', fontWeight: '600' }}
                      onClick={() => markNotificationRead(n.id)}
                    >
                      Mark read
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </nav>

      {/* Main Grid View */}
      <div className="dashboard-grid">
        {/* Sidebar Nav */}
        <aside className="dashboard-sidebar">
          <a 
            href="#search" 
            className={`sidebar-link ${activeTab === 'search' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); setActiveTab('search'); }}
          >
            <Search size={18} /> Search Doctors
          </a>
          <a 
            href="#appointments" 
            className={`sidebar-link ${activeTab === 'appointments' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); setActiveTab('appointments'); }}
          >
            <Calendar size={18} /> Booked Appointments
          </a>
          <a 
            href="#records" 
            className={`sidebar-link ${activeTab === 'records' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); setActiveTab('records'); }}
          >
            <FileText size={18} /> Clinical History
          </a>
        </aside>

        {/* Dashboard Content Panel */}
        <main className="dashboard-content">
          {/* Custom Toast Banner */}
          {toast.show && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: toast.type === 'error' ? 'var(--error-bg)' : toast.type === 'warning' ? 'var(--warning-bg)' : 'var(--success-bg)', color: toast.type === 'error' ? 'var(--error-color)' : toast.type === 'warning' ? 'var(--warning-color)' : 'var(--success-color)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: `1px solid ${toast.type === 'error' ? '#fca5a5' : toast.type === 'warning' ? '#fcd34d' : '#86efac'}`, marginBottom: '1.5rem', fontWeight: '500' }}>
              <AlertCircle size={20} />
              <span>{toast.message}</span>
            </div>
          )}

          {/* Tab 1: Search Doctors */}
          {activeTab === 'search' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-color)', fontWeight: '700' }}>Find & Book a Doctor</h2>
                  <p style={{ color: 'var(--text-muted)' }}>Choose specialized medical professionals and view slots</p>
                </div>

                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', minWidth: '300px' }}>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Search by name or specialty..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
                    <Search size={18} />
                  </button>
                </form>
              </div>

              {doctors.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
                  <p style={{ color: 'var(--text-muted)' }}>No doctors found. Try a different search term.</p>
                </div>
              ) : (
                <div className="grid-container">
                  {doctors.map((doc) => (
                    <div key={doc.id} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: 'var(--primary-color)' }}>
                          🩺
                        </div>
                        <div>
                          <h3 className="card-title" style={{ margin: 0 }}>{doc.user.fullName}</h3>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>{doc.department.name} • {doc.specialization}</p>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Exp: {doc.experience}</p>
                        </div>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', flex: 1, marginBottom: '1rem' }}>
                        {doc.biography}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', marginTop: 'auto' }}>
                        <span style={{ fontWeight: '700', color: 'var(--primary-color)' }}>Fee: {doc.consultationFee}</span>
                        <button className="btn btn-primary" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }} onClick={() => handleSelectDoctor(doc)}>
                          Book Slot
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Booked Appointments */}
          {activeTab === 'appointments' && (
            <div>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-color)', fontWeight: '700', marginBottom: '1rem' }}>Your Appointments</h2>
              {appointments.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                  <p style={{ color: 'var(--text-muted)' }}>You haven't scheduled any appointments yet.</p>
                  <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => setActiveTab('search')}>
                    Find Doctor
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {appointments.map((appt) => (
                    <div key={appt.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                          <h3 style={{ fontSize: '1.1rem', margin: 0, fontWeight: '700' }}>{appt.doctor.user.fullName}</h3>
                          {getStatusBadge(appt.status)}
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Calendar size={14} /> {appt.slot.date} | <Clock size={14} /> {appt.slot.startTime} - {appt.slot.endTime}
                        </p>
                      </div>
                      
                      {appt.status !== 'CANCELLED' && appt.status !== 'COMPLETED' && (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button className="btn btn-outline" style={{ fontSize: '0.85rem' }} onClick={() => startReschedule(appt)}>
                            Reschedule
                          </button>
                          <button className="btn btn-danger" style={{ fontSize: '0.85rem' }} onClick={() => setConfirmCancelId(appt.id)}>
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Clinical History / Medical Records */}
          {activeTab === 'records' && (
            <div>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-color)', fontWeight: '700', marginBottom: '1rem' }}>Medical & Clinical History</h2>
              
              {appointments.filter(a => a.status === 'COMPLETED' || a.clinicalNotes || a.prescription).length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                  <p style={{ color: 'var(--text-muted)' }}>No medical notes or prescriptions found.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {appointments.filter(a => a.status === 'COMPLETED' || a.clinicalNotes || a.prescription).map((appt) => (
                    <div key={appt.id} className="card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                        <div>
                          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', margin: 0 }}>Dr. {appt.doctor.user.fullName}</h3>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{appt.doctor.specialization} • Visited on {appt.slot.date}</p>
                        </div>
                        <span className="badge badge-success">Completed Visit</span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', flexWrap: 'wrap' }}>
                        <div>
                          <h4 style={{ fontSize: '0.9rem', color: 'var(--primary-color)', marginBottom: '0.25rem' }}>Clinical & Treatment Notes</h4>
                          <p style={{ fontSize: '0.9rem', backgroundColor: '#fafaf9', padding: '0.75rem', borderRadius: 'var(--radius-sm)', minHeight: '60px' }}>
                            {appt.clinicalNotes || "No notes added by doctor."}
                          </p>
                        </div>
                        <div>
                          <h4 style={{ fontSize: '0.9rem', color: 'var(--primary-color)', marginBottom: '0.25rem' }}>Prescriptions</h4>
                          <p style={{ fontSize: '0.9rem', backgroundColor: '#f0fdfa', padding: '0.75rem', borderRadius: 'var(--radius-sm)', minHeight: '60px', color: 'var(--primary-color)', fontWeight: '500' }}>
                            {appt.prescription || "No prescriptions issued."}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Modal: Select Slots / Book Appointment */}
      {selectedDoctor && (
        <div className="modal-overlay" onClick={() => setSelectedDoctor(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-color)', marginBottom: '0.5rem', fontWeight: '700' }}>
              {rescheduleAppointmentId ? 'Reschedule Appointment' : 'Book Appointment'}
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Pick a convenient time slot with <strong>{selectedDoctor.user.fullName}</strong> ({selectedDoctor.specialization}).
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '250px', overflowY: 'auto', marginBottom: '1.5rem' }}>
              {availableSlots.length === 0 ? (
                <p style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  No available slots.
                </p>
              ) : (
                availableSlots.map((slot) => (
                  <button 
                    key={slot.id} 
                    className="btn btn-outline" 
                    style={{ justifyContent: 'space-between', padding: '0.75rem 1rem' }}
                    onClick={() => handleBookSlot(slot.id)}
                  >
                    <span style={{ fontWeight: '600' }}>{slot.date}</span>
                    <span style={{ color: 'var(--primary-color)', fontWeight: '600' }}>{slot.startTime} - {slot.endTime}</span>
                  </button>
                ))
              )}
            </div>

            <button className="btn btn-secondary btn-full" onClick={() => setSelectedDoctor(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Chatbot Widget */}
      <div className="chatbot-widget">
        {!chatOpen ? (
          <button className="chatbot-btn" onClick={() => setChatOpen(true)}>
            <MessageSquare size={24} />
          </button>
        ) : (
          <div className="chatbot-window">
            <div className="chatbot-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
                <span>🏥</span> MEDCURE Assistant
              </div>
              <button 
                style={{ border: 'none', background: 'transparent', color: 'white', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' }}
                onClick={() => setChatOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="chatbot-messages">
              {chatMessages.map((m, idx) => (
                <div key={idx} className={`chat-bubble ${m.sender === 'user' ? 'bubble-user' : 'bubble-bot'}`}>
                  {m.text}
                </div>
              ))}
              {chatLoading && (
                <div className="chat-bubble bubble-bot" style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>
                  Typing response...
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="chatbot-input-area">
              <input 
                type="text" 
                className="chatbot-input" 
                placeholder="Ask about booking, slots, doctors..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
              />
              <button type="submit" className="chatbot-send">Send</button>
            </form>
          </div>
        )}
      </div>

      {/* ── Custom Cancel Confirmation Modal ── */}
      {confirmCancelId !== null && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999
        }}>
          <div style={{
            background: 'white', borderRadius: 'var(--radius-md)', padding: '2rem',
            width: '380px', maxWidth: '90vw', boxShadow: 'var(--shadow-lg)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>⚠️</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '0.5rem' }}>
              Cancel Appointment?
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              This action cannot be undone. The appointment slot will be freed.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                className="btn btn-outline"
                style={{ minWidth: '110px' }}
                onClick={() => setConfirmCancelId(null)}
              >
                Keep It
              </button>
              <button
                className="btn btn-danger"
                style={{ minWidth: '110px' }}
                onClick={handleCancelAppointment}
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
