import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import CustomerDashboard from './components/CustomerDashboard';
import ReviewerDashboard from './components/ReviewerDashboard';
import AuthModal from './components/AuthModal';
import RequestDetailModal from './components/RequestDetailModal';
import { api } from './services/api';

export default function App() {
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);

  useEffect(() => {
    const savedUser = api.getCurrentUser();
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  async function handleDemoLogin(username, password) {
    try {
      const loggedUser = await api.login(username, password);
      setUser(loggedUser);
    } catch (err) {
      alert('Demo login failed: ' + err.message);
    }
  }

  function handleLogout() {
    api.logout();
    setUser(null);
    setSelectedRequestId(null);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      
      {/* Top Navigation */}
      <Navbar
        user={user}
        onLogout={handleLogout}
        onOpenAuth={() => setShowAuthModal(true)}
      />

      {/* Main View Area */}
      <main style={{ flexGrow: 1 }}>
        {!user ? (
          <LandingPage
            onDemoLogin={handleDemoLogin}
            onOpenAuth={() => setShowAuthModal(true)}
          />
        ) : user.role === 'ROLE_REVIEWER' || user.role === 'ROLE_ADMIN' ? (
          <ReviewerDashboard
            user={user}
            onSelectRequest={id => setSelectedRequestId(id)}
          />
        ) : (
          <CustomerDashboard
            user={user}
            onSelectRequest={id => setSelectedRequestId(id)}
          />
        )}
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={u => setUser(u)}
      />

      {/* Request Details & Timeline Modal */}
      {selectedRequestId && (
        <RequestDetailModal
          requestId={selectedRequestId}
          onClose={() => setSelectedRequestId(null)}
        />
      )}

      {/* Project Metadata Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-color)',
        padding: '24px 0',
        background: 'rgba(11, 15, 25, 0.95)',
        textAlign: 'center',
        fontSize: '0.85rem',
        color: 'var(--text-dim)'
      }}>
        <div className="container">
          <div style={{ color: '#e2e8f0', fontWeight: '600', marginBottom: '6px' }}>
            Automated Broadband Installation Workflow &bull; DevOps Project
          </div>
          <div>
            Student: <strong>Pushkar Waykole</strong> &bull; Roll No: <strong>23102C0012</strong> &bull; Class: <strong>BE VII, Div C</strong> &bull; Academic Year: <strong>2026–2027</strong>
          </div>
        </div>
      </footer>

    </div>
  );
}
