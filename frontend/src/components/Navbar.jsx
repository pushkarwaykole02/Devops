import React from 'react';

export default function Navbar({ user, onLogout, onOpenAuth }) {
  return (
    <header style={{
      borderBottom: '1px solid var(--border-color)',
      background: 'rgba(11, 15, 25, 0.85)',
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '12px 0'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'var(--color-brand-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--color-brand-glow)'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12.55a11 11 0 0 1 14.08 0"></path>
              <path d="M1.42 9a16 16 0 0 1 21.16 0"></path>
              <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
              <line x1="12" y1="20" x2="12.01" y2="20"></line>
            </svg>
          </div>
          <div>
            <h1 style={{ fontSize: '1.2rem', lineHeight: '1.2' }}>Automated Broadband Portal</h1>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              DevOps Project &bull; Pushkar Waykole (23102C0012)
            </span>
          </div>
        </div>

        {/* User actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {user ? (
            <>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: '600', fontSize: '0.9rem', color: 'white' }}>{user.fullName}</div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px', alignItems: 'center' }}>
                  <span className={`badge ${user.role === 'ROLE_REVIEWER' ? 'badge-under_review' : 'badge-submitted'}`} style={{ fontSize: '0.7rem' }}>
                    {user.role === 'ROLE_REVIEWER' ? 'Telecom Reviewer' : 'Customer'}
                  </span>
                </div>
              </div>
              <button
                id="btn-logout"
                onClick={onLogout}
                className="btn btn-secondary btn-sm"
              >
                Sign Out
              </button>
            </>
          ) : (
            <button
              id="btn-open-login"
              onClick={onOpenAuth}
              className="btn btn-primary btn-sm"
            >
              Sign In / Register
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
