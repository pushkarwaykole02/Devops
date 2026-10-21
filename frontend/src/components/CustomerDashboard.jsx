import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

const BROADBAND_PLANS = [
  { id: 'p1', name: 'Fiber Starter 100', speed: '100 Mbps', price: 29.99, tag: 'Basic' },
  { id: 'p2', name: 'Fiber Ultra 300', speed: '300 Mbps', price: 49.99, tag: 'Popular', highlight: true },
  { id: 'p3', name: 'SpeedPro 500', speed: '500 Mbps', price: 69.99, tag: 'Gaming' },
  { id: 'p4', name: 'GigaMax 1000', speed: '1000 Mbps', price: 89.99, tag: 'Ultra Fast' },
];

export default function CustomerDashboard({ user, onSelectRequest }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Submission Modal state
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(BROADBAND_PLANS[1]);
  
  // Form fields
  const [contactName, setContactName] = useState(user?.fullName || '');
  const [contactPhone, setContactPhone] = useState(user?.phoneNumber || '');
  const [contactEmail, setContactEmail] = useState(user?.email || '');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  async function fetchRequests() {
    setLoading(true);
    try {
      const res = await api.getMyRequests();
      setRequests(res.data || []);
    } catch (err) {
      console.error('Failed to load requests:', err);
    } finally {
      setLoading(false);
    }
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setFormError('File size exceeds the 10MB limit.');
        return;
      }
      setSelectedFile(file);
      setFormError('');
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');

    // Client-side validations
    if (!/^[0-9]{10}$/.test(contactPhone)) {
      setFormError('Phone number must be a valid 10-digit number.');
      return;
    }
    if (!/^[0-9]{5,6}$/.test(postalCode)) {
      setFormError('Postal code must be 5 to 6 digits.');
      return;
    }
    if (!preferredDate) {
      setFormError('Please select a preferred installation date.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        contactName,
        contactPhone,
        contactEmail,
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode,
        preferredDate,
        planName: selectedPlan.name,
        planSpeed: selectedPlan.speed,
        planPrice: selectedPlan.price,
      };

      const res = await api.submitRequest(payload);
      const createdReq = res.data;

      // Upload supporting document if selected
      if (selectedFile && createdReq?.id) {
        try {
          await api.uploadDocument(createdReq.id, selectedFile);
        } catch (uploadErr) {
          console.warn('Document upload warning:', uploadErr);
        }
      }

      setShowSubmitModal(false);
      resetForm();
      fetchRequests();
    } catch (err) {
      setFormError(err.message || 'Submission failed. Please check form values.');
    } finally {
      setSubmitting(false);
    }
  }

  function resetForm() {
    setAddressLine1('');
    setAddressLine2('');
    setCity('');
    setState('');
    setPostalCode('');
    setPreferredDate('');
    setSelectedFile(null);
    setFormError('');
  }

  // Filtered requests
  const filtered = requests.filter(r => {
    const matchSearch = (r.requestId?.toLowerCase().includes(search.toLowerCase())) ||
                        (r.planName?.toLowerCase().includes(search.toLowerCase())) ||
                        (r.city?.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = filterStatus ? r.status === filterStatus : true;
    return matchSearch && matchStatus;
  });

  // Metrics
  const stats = {
    total: requests.length,
    submitted: requests.filter(r => r.status === 'SUBMITTED').length,
    underReview: requests.filter(r => r.status === 'UNDER_REVIEW').length,
    approved: requests.filter(r => r.status === 'APPROVED').length,
    scheduled: requests.filter(r => r.status === 'INSTALLATION_SCHEDULED').length,
    rejected: requests.filter(r => r.status === 'REJECTED').length,
  };

  return (
    <div className="container" style={{ padding: '36px 24px' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '6px' }}>Customer Installation Portal</h1>
          <p>Track your active broadband connections and submit new installation orders</p>
        </div>
        <button
          id="btn-new-request"
          onClick={() => { resetForm(); setShowSubmitModal(true); }}
          className="btn btn-primary"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Request New Installation
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid-4" style={{ marginBottom: '32px' }}>
        <div className="glass-panel stat-card">
          <div className="stat-icon">&#128225;</div>
          <div>
            <div className="stat-val">{stats.total}</div>
            <div className="stat-label">Total Requests</div>
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-icon" style={{ background: 'rgba(234, 179, 8, 0.15)', color: '#facc15' }}>&#9203;</div>
          <div>
            <div className="stat-val">{stats.submitted + stats.underReview}</div>
            <div className="stat-label">In Review</div>
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-icon" style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#4ade80' }}>&#10004;</div>
          <div>
            <div className="stat-val">{stats.approved}</div>
            <div className="stat-label">Approved</div>
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-icon" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc' }}>&#128197;</div>
          <div>
            <div className="stat-val">{stats.scheduled}</div>
            <div className="stat-label">Scheduled</div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        
        {/* Search & Filters */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
          <h2 style={{ fontSize: '1.2rem' }}>My Installation Requests</h2>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <input
              id="input-customer-search"
              type="text"
              placeholder="Search by ID, plan, city..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="form-control"
              style={{ width: '220px' }}
            />
            <select
              id="select-customer-filter"
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="form-select"
              style={{ width: '180px' }}
            >
              <option value="">All Statuses</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="INSTALLATION_SCHEDULED">Scheduled</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            Loading your installation orders...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-dim)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>&#128225;</div>
            <p style={{ fontSize: '1.05rem', color: '#94a3b8' }}>No broadband requests found.</p>
            <p style={{ fontSize: '0.85rem', marginTop: '6px' }}>Click "Request New Installation" to submit your broadband application.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="telecom-table">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Broadband Plan</th>
                  <th>Location</th>
                  <th>Preferred Date</th>
                  <th>Status</th>
                  <th>Reviewer Feedback</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(req => (
                  <tr key={req.id}>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '600', color: '#38bdf8' }}>
                        {req.requestId}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: '600' }}>{req.planName}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{req.planSpeed} &bull; ${req.planPrice}/mo</div>
                    </td>
                    <td>{req.city}, {req.state}</td>
                    <td>{req.preferredDate}</td>
                    <td>
                      <span className={`badge badge-${req.status.toLowerCase()}`}>
                        {req.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      {req.status === 'REJECTED' && req.rejectionReason ? (
                        <span style={{ color: '#f87171', fontSize: '0.85rem' }}>{req.rejectionReason}</span>
                      ) : req.reviewerRemarks ? (
                        <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>{req.reviewerRemarks}</span>
                      ) : (
                        <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>Pending review</span>
                      )}
                    </td>
                    <td>
                      <button
                        id={`btn-track-${req.id}`}
                        onClick={() => onSelectRequest(req.id)}
                        className="btn btn-secondary btn-sm"
                      >
                        Track Lifecycle & Docs &rarr;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Submission Modal */}
      {showSubmitModal && (
        <div className="modal-overlay" onClick={() => setShowSubmitModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '680px' }}>
            
            <div className="modal-header">
              <h2 style={{ fontSize: '1.25rem' }}>Submit Broadband Installation Request</h2>
              <button
                onClick={() => setShowSubmitModal(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {formError && (
                  <div style={{
                    padding: '12px',
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: 'var(--radius-md)',
                    color: '#f87171',
                    fontSize: '0.85rem',
                    marginBottom: '16px'
                  }}>
                    {formError}
                  </div>
                )}

                {/* Plan Selection */}
                <div style={{ marginBottom: '20px' }}>
                  <label className="form-label">Choose Broadband Plan</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(135px, 1fr))', gap: '10px' }}>
                    {BROADBAND_PLANS.map(plan => (
                      <div
                        key={plan.id}
                        onClick={() => setSelectedPlan(plan)}
                        style={{
                          border: selectedPlan.id === plan.id ? '2px solid var(--color-brand-500)' : '1px solid var(--border-color)',
                          background: selectedPlan.id === plan.id ? 'rgba(2, 132, 199, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                          padding: '12px',
                          borderRadius: 'var(--radius-md)',
                          cursor: 'pointer',
                          textAlign: 'center',
                          transition: 'all 0.2s'
                        }}
                      >
                        <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: '700' }}>{plan.tag}</div>
                        <div style={{ fontWeight: '700', fontSize: '0.9rem', marginTop: '2px' }}>{plan.speed}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>${plan.price}/mo</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Fields */}
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Applicant Full Name *</label>
                    <input
                      id="input-req-name"
                      type="text"
                      required
                      className="form-control"
                      value={contactName}
                      onChange={e => setContactName(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">10-Digit Mobile Phone *</label>
                    <input
                      id="input-req-phone"
                      type="tel"
                      required
                      placeholder="e.g. 9822012345"
                      className="form-control"
                      value={contactPhone}
                      onChange={e => setContactPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input
                      id="input-req-email"
                      type="email"
                      required
                      className="form-control"
                      value={contactEmail}
                      onChange={e => setContactEmail(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Preferred Installation Date *</label>
                    <input
                      id="input-req-date"
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="form-control"
                      value={preferredDate}
                      onChange={e => setPreferredDate(e.target.value)}
                    />
                  </div>
                </div>

                {/* Address Fields */}
                <div className="form-group">
                  <label className="form-label">Installation Address Line 1 *</label>
                  <input
                    id="input-req-address1"
                    type="text"
                    required
                    placeholder="Flat/House No., Building, Street"
                    className="form-control"
                    value={addressLine1}
                    onChange={e => setAddressLine1(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Address Line 2 (Optional)</label>
                  <input
                    id="input-req-address2"
                    type="text"
                    placeholder="Landmark, Area"
                    className="form-control"
                    value={addressLine2}
                    onChange={e => setAddressLine2(e.target.value)}
                  />
                </div>

                <div className="grid-3">
                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <input
                      id="input-req-city"
                      type="text"
                      required
                      className="form-control"
                      value={city}
                      onChange={e => setCity(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">State *</label>
                    <input
                      id="input-req-state"
                      type="text"
                      required
                      className="form-control"
                      value={state}
                      onChange={e => setState(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Postal / PIN Code *</label>
                    <input
                      id="input-req-postal"
                      type="text"
                      required
                      placeholder="e.g. 411005"
                      className="form-control"
                      value={postalCode}
                      onChange={e => setPostalCode(e.target.value)}
                    />
                  </div>
                </div>

                {/* Document Upload */}
                <div className="form-group">
                  <label className="form-label">Upload KYC / Address Proof (PDF, PNG, JPG &lt; 10MB)</label>
                  <input
                    id="input-req-file"
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.docx"
                    className="form-control"
                    onChange={handleFileChange}
                  />
                  {selectedFile && (
                    <div style={{ marginTop: '6px', fontSize: '0.8rem', color: '#4ade80' }}>
                      Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                    </div>
                  )}
                </div>

              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  id="btn-submit-order"
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                >
                  {submitting ? 'Submitting Application...' : 'Confirm & Submit Application'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
