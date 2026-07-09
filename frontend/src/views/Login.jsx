import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const { login }  = useAuth();
  const navigate   = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      const role = result.role.toUpperCase();
      if (role === 'PATIENT') navigate('/patient');
      else if (role === 'DOCTOR') navigate('/doctor');
      else if (role === 'ADMIN')  navigate('/admin');
    } else {
      setError(result.error);
    }
  };

  const fillDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <div className="brand" style={{ justifyContent: 'center', marginBottom: '0.5rem' }}>
            <span>🏥</span> MEDCURE HOSPITALS
          </div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to manage your appointments &amp; medical records</p>
        </div>

        {error && (
          <div style={{ backgroundColor: 'var(--error-bg)', color: 'var(--error-color)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', fontSize: '0.9rem', border: '1px solid #fecaca', fontWeight: '500' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="name@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
          Don&apos;t have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary-color)', fontWeight: '600', textDecoration: 'none' }}>
            Register here
          </Link>
        </div>

        <div style={{ marginTop: '2rem', borderTop: '1px dashed var(--border-color)', paddingTop: '1.25rem' }}>
          <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem', fontWeight: '600' }}>
            DEMO CREDENTIALS QUICK FILL:
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button
              className="btn btn-outline"
              style={{ fontSize: '0.8rem', padding: '0.4rem', justifyContent: 'flex-start' }}
              onClick={() => fillDemo('rahul.mehta@gmail.com', 'patient123')}
            >
              👤 Patient: rahul.mehta@gmail.com
            </button>
            <button
              className="btn btn-outline"
              style={{ fontSize: '0.8rem', padding: '0.4rem', justifyContent: 'flex-start' }}
              onClick={() => fillDemo('rajesh.kumar@medcure.com', 'doctor123')}
            >
              🩺 Doctor: rajesh.kumar@medcure.com
            </button>
            <button
              className="btn btn-outline"
              style={{ fontSize: '0.8rem', padding: '0.4rem', justifyContent: 'flex-start' }}
              onClick={() => fillDemo('admin@medcure.com', 'admin123')}
            >
              ⚙️ Admin: admin@medcure.com
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
