import React from 'react';

export default function LandingPage({ onDemoLogin, onOpenAuth }) {
  return (
    <div className="container" style={{ padding: '60px 24px' }}>
      
      {/* Hero Section */}
      <div style={{ textAlign: 'center', maxWidth: '850px', margin: '0 auto 60px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '9999px',
          background: 'rgba(2, 132, 199, 0.15)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          color: '#38bdf8',
          fontSize: '0.85rem',
          fontWeight: '600',
          marginBottom: '20px'
        }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#38bdf8', display: 'inline-block' }}></span>
          Next-Gen Telecommunications Workflow System
        </div>

        <h1 style={{ fontSize: '2.8rem', lineHeight: '1.2', marginBottom: '20px', fontWeight: '800' }}>
          Automated Broadband <br />
          <span style={{
            background: 'var(--color-brand-gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Installation Workflow
          </span>
        </h1>

        <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '36px' }}>
          Eliminate manual paperwork, disconnected spreadsheets, and fragmented customer communications.
          A centralized, role-based pipeline with automated validation, reviewer decision audit trails,
          and real-time lifecycle tracking.
        </p>

        {/* Demo Fast Login Cards */}
        <div style={{
          background: 'rgba(17, 24, 39, 0.7)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '28px',
          marginBottom: '40px',
          backdropFilter: 'blur(10px)'
        }}>
          <h2 style={{ fontSize: '1rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
            Quick Demo Portals (1-Click Instant Login)
          </h2>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              id="btn-demo-customer"
              onClick={() => onDemoLogin('pushkar', 'Customer@123')}
              className="btn btn-primary"
              style={{ minWidth: '220px', padding: '14px 20px' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Customer Portal (Pushkar)
            </button>

            <button
              id="btn-demo-reviewer"
              onClick={() => onDemoLogin('reviewer', 'Reviewer@123')}
              className="btn btn-secondary"
              style={{ minWidth: '220px', padding: '14px 20px', background: 'rgba(56, 189, 248, 0.1)', borderColor: 'rgba(56, 189, 248, 0.3)' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              Reviewer Portal (Officer)
            </button>
          </div>
          <div style={{ marginTop: '14px', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
            Or register your own custom account via the sign-in modal.
          </div>
        </div>
      </div>

      {/* 4-Step Process Section */}
      <div style={{ marginBottom: '60px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '1.8rem', marginBottom: '32px' }}>
          End-to-End Automated Workflow
        </h2>
        <div className="grid-4">
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              background: 'rgba(59, 130, 246, 0.15)',
              color: '#60a5fa',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              marginBottom: '16px'
            }}>01</div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Request Submission</h3>
            <p style={{ fontSize: '0.875rem' }}>
              Customers pick a broadband plan, enter contact and geolocation data, and upload supporting KYC proofs.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              background: 'rgba(234, 179, 8, 0.15)',
              color: '#facc15',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              marginBottom: '16px'
            }}>02</div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Automated Validation</h3>
            <p style={{ fontSize: '0.875rem' }}>
              Server-side checking of phone, email, postal code format, and file integrity (MIME type and size limit).
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              background: 'rgba(34, 197, 94, 0.15)',
              color: '#4ade80',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              marginBottom: '16px'
            }}>03</div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Reviewer Action</h3>
            <p style={{ fontSize: '0.875rem' }}>
              Telecom officers inspect feasibility, examine attached documents, record remarks, and approve or reject.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              background: 'rgba(168, 85, 247, 0.15)',
              color: '#c084fc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              marginBottom: '16px'
            }}>04</div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Installation Scheduled</h3>
            <p style={{ fontSize: '0.875rem' }}>
              Field technician is dispatched, installation date confirmed, and customer timeline updated in real-time.
            </p>
          </div>
        </div>
      </div>

      {/* DevOps Stack Section */}
      <div className="glass-panel" style={{ padding: '32px', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>
          DevOps & Enterprise Architecture Stack
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
          {['Java 21 Spring Boot', 'React.js 18', 'MySQL / H2', 'JWT Stateless Auth', 'Docker & Compose', 'Jenkins Declarative CI/CD', 'Selenium WebDriver & JUnit', 'Ansible Provisioning', 'Nginx Reverse Proxy', 'Git & GitHub'].map(tech => (
            <span key={tech} style={{
              padding: '6px 14px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              color: '#e2e8f0',
              fontWeight: '500'
            }}>
              {tech}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
}
