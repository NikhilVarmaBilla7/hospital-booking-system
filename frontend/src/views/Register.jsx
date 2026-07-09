import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [fullName, setFullName]               = useState('');
  const [email, setEmail]                     = useState('');
  const [password, setPassword]               = useState('');
  const [phone, setPhone]                     = useState('');
  const [role, setRole]                       = useState('PATIENT');
  const [departmentId, setDepartmentId]       = useState('');
  const [specialization, setSpecialization]   = useState('');
  const [experience, setExperience]           = useState('');
  const [biography, setBiography]             = useState('');
  const [consultationFee, setConsultationFee] = useState('');
  const [departments, setDepartments]         = useState([]);
  const [error, setError]                     = useState('');
  const [success, setSuccess]                 = useState(false);
  const [loading, setLoading]                 = useState(false);

  const { register, api } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/admin/departments')
      .then(res => {
        setDepartments(res.data);
        if (res.data.length > 0) setDepartmentId(res.data[0].id);
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const payload = {
      fullName,
      email,
      password,
      phone,
      role,
      departmentId:    role === 'DOCTOR' ? Number(departmentId) : null,
      specialization:  role === 'DOCTOR' ? specialization       : null,
      experience:      role === 'DOCTOR' ? experience           : null,
      biography:       role === 'DOCTOR' ? biography            : null,
      consultationFee: role === 'DOCTOR' ? consultationFee      : null,
    };

    const result = await register(payload);
    setLoading(false);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="auth-wrapper" style={{ padding: '3rem 1.5rem' }}>
      <div className="auth-card" style={{ maxWidth: '600px' }}>
        <div className="auth-header">
          <div className="brand" style={{ justifyContent: 'center', marginBottom: '0.5rem' }}>
            <span>🏥</span> MEDCURE HOSPITALS
          </div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Register to book appointments or manage your clinic</p>
        </div>

        {error && (
          <div style={{ backgroundColor: 'var(--error-bg)', color: 'var(--error-color)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', fontSize: '0.9rem', border: '1px solid #fecaca', fontWeight: '500' }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success-color)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', fontSize: '0.9rem', border: '1px solid #bbf7d0', fontWeight: '500' }}>
            Registration successful! Redirecting to login...
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-input" placeholder="Rahul Mehta" value={fullName} onChange={e => setFullName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-input" placeholder="rahul@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" className="form-input" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input type="tel" className="form-input" placeholder="+91-98765-00000" value={phone} onChange={e => setPhone(e.target.value)} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Register As</label>
            <select className="form-input" value={role} onChange={e => setRole(e.target.value)} style={{ height: '42px' }}>
              <option value="PATIENT">Patient</option>
              <option value="DOCTOR">Doctor / Specialist</option>
            </select>
          </div>

          {role === 'DOCTOR' && (
            <div style={{ borderTop: '1px dashed var(--border-color)', marginTop: '1.5rem', paddingTop: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', color: 'var(--primary-color)', marginBottom: '1rem', fontWeight: '700' }}>Doctor Profile Info</h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <select className="form-input" value={departmentId} onChange={e => setDepartmentId(e.target.value)} style={{ height: '42px' }} required={role === 'DOCTOR'}>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Specialization</label>
                  <input type="text" className="form-input" placeholder="e.g. Cardiologist" value={specialization} onChange={e => setSpecialization(e.target.value)} required={role === 'DOCTOR'} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Experience</label>
                  <input type="text" className="form-input" placeholder="e.g. 10 Years" value={experience} onChange={e => setExperience(e.target.value)} required={role === 'DOCTOR'} />
                </div>
                <div className="form-group">
                  <label className="form-label">Consultation Fee</label>
                  <input type="text" className="form-input" placeholder="e.g. ₹800" value={consultationFee} onChange={e => setConsultationFee(e.target.value)} required={role === 'DOCTOR'} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Biography</label>
                <textarea className="form-input" rows="3" placeholder="Tell patients about your medical background..." value={biography} onChange={e => setBiography(e.target.value)} style={{ resize: 'none', fontFamily: 'inherit' }} required={role === 'DOCTOR'} />
              </div>
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: '600', textDecoration: 'none' }}>
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
