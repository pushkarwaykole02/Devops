import React, { useState } from 'react';
import { api } from '../services/api';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState('ROLE_CUSTOMER');

  if (!isOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        const user = await api.register({
          username,
          password,
          email,
          fullName,
          phoneNumber,
          role,
        });
        onAuthSuccess(user);
      } else {
        const user = await api.login(username, password);
        onAuthSuccess(user);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  }

  function handleAutoFill(type) {
    if (type === 'customer') {
      setUsername('pushkar');
      setPassword('Customer@123');
    } else {
      setUsername('reviewer');
      setPassword('Reviewer@123');
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        
        <div className="modal-header">
          <h2 style={{ fontSize: '1.25rem' }}>
            {isRegister ? 'Create an Account' : 'Welcome Back'}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '1.5rem',
              cursor: 'pointer'
            }}
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div style={{
                padding: '12px',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: 'var(--radius-md)',
                color: '#f87171',
                fontSize: '0.85rem',
                marginBottom: '16px'
              }}>
                {error}
              </div>
            )}

            {!isRegister && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.04)',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Quick Autofill:</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => handleAutoFill('customer')}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                  >
                    Customer
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAutoFill('reviewer')}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                  >
                    Reviewer
                  </button>
                </div>
              </div>
            )}

            {isRegister && (
              <>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    id="input-fullname"
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g. Pushkar Waykole"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    id="input-email"
                    type="email"
                    required
                    className="form-control"
                    placeholder="name@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    id="input-phone"
                    type="tel"
                    required
                    className="form-control"
                    placeholder="10-digit mobile number"
                    pattern="[0-9]{10}"
                    maxLength="10"
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value.replace(/\\D/g, '').slice(0,10))}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Role</label>
                  <select
                    id="select-role"
                    className="form-select"
                    value={role}
                    onChange={e => setRole(e.target.value)}
                  >
                    <option value="ROLE_CUSTOMER">Customer</option>
                    <option value="ROLE_REVIEWER">Telecom Reviewer</option>
                  </select>
                </div>
              </>
            )}

            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                id="input-username"
                type="text"
                required
                className="form-control"
                placeholder="Enter username"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                id="input-password"
                type="password"
                required
                className="form-control"
                placeholder="Enter password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
            <button
              id="btn-auth-submit"
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              {loading ? 'Please wait...' : (isRegister ? 'Complete Registration' : 'Sign In')}
            </button>

            <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>
                {isRegister ? 'Already registered?' : "Don't have an account?"}
              </span>{' '}
              <button
                type="button"
                onClick={() => { setIsRegister(!isRegister); setError(''); }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--color-brand-500)',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                {isRegister ? 'Sign In here' : 'Register now'}
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
}
