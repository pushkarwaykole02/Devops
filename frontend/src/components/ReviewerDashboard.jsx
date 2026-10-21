import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function ReviewerDashboard({ user, onSelectRequest }) {
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({ totalRequests: 0, pendingReviews: 0, approvedRequests: 0, rejectedRequests: 0, scheduledInstallations: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  // Review Action Modal
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [reviewAction, setReviewAction] = useState('UNDER_REVIEW');
  const [remarks, setRemarks] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [assignedTechnician, setAssignedTechnician] = useState('');
  const [submittingAction, setSubmittingAction] = useState(false);
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    loadData();
  }, [statusFilter, search]);

  async function loadData() {
    setLoading(true);
    try {
      const [reqsRes, statsRes] = await Promise.all([
        api.getAllRequests(statusFilter, search),
        api.getAnalyticsStats(),
      ]);
      setRequests(reqsRes.data || []);
      if (statsRes.data) setStats(statsRes.data);
    } catch (err) {
      console.error('Failed to load reviewer data:', err);
    } finally {
      setLoading(false);
    }
  }

  function openReviewModal(req) {
    setSelectedRequest(req);
    // Pre-set default action based on current status
    if (req.status === 'SUBMITTED') {
      setReviewAction('UNDER_REVIEW');
    } else if (req.status === 'UNDER_REVIEW') {
      setReviewAction('APPROVED');
    } else if (req.status === 'APPROVED') {
      setReviewAction('INSTALLATION_SCHEDULED');
    } else {
      setReviewAction(req.status);
    }
    setRemarks(req.reviewerRemarks || '');
    setRejectionReason(req.rejectionReason || '');
    setScheduledDate(req.scheduledDate || '');
    setAssignedTechnician(req.assignedTechnician || '');
    setActionError('');
  }

  async function handleReviewSubmit(e) {
    e.preventDefault();
    setActionError('');

    if (reviewAction === 'REJECTED' && !rejectionReason.trim()) {
      setActionError('A rejection reason is strictly required when rejecting a request.');
      return;
    }

    if (reviewAction === 'INSTALLATION_SCHEDULED' && (!scheduledDate || !assignedTechnician.trim())) {
      setActionError('Scheduled date and technician name are required to schedule installation.');
      return;
    }

    setSubmittingAction(true);
    try {
      const payload = {
        status: reviewAction,
        remarks,
        rejectionReason: reviewAction === 'REJECTED' ? rejectionReason : null,
        scheduledDate: scheduledDate || null,
        assignedTechnician: assignedTechnician || null,
      };

      await api.reviewRequest(selectedRequest.id, payload);
      setSelectedRequest(null);
      loadData();
    } catch (err) {
      setActionError(err.message || 'Failed to update request status.');
    } finally {
      setSubmittingAction(false);
    }
  }

  return (
    <div className="container" style={{ padding: '36px 24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '6px' }}>Broadband Reviewer Operations</h1>
          <p>Feasibility verification, document auditing, and installation scheduling console</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={loadData} className="btn btn-secondary btn-sm">
            &#8635; Refresh Data
          </button>
        </div>
      </div>

      {/* Analytics KPI Summary Cards */}
      <div className="grid-4" style={{ marginBottom: '32px' }}>
        <div className="glass-panel stat-card">
          <div className="stat-icon">&#128224;</div>
          <div>
            <div className="stat-val">{stats.totalRequests}</div>
            <div className="stat-label">Total Submissions</div>
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-icon" style={{ background: 'rgba(234, 179, 8, 0.15)', color: '#facc15' }}>&#9200;</div>
          <div>
            <div className="stat-val">{stats.pendingReviews}</div>
            <div className="stat-label">Pending Review</div>
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-icon" style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#4ade80' }}>&#10003;</div>
          <div>
            <div className="stat-val">{stats.approvedRequests}</div>
            <div className="stat-label">Approved</div>
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-icon" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc' }}>&#128666;</div>
          <div>
            <div className="stat-val">{stats.scheduledInstallations}</div>
            <div className="stat-label">Scheduled Field Jobs</div>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        
        {/* Controls Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
          
          {/* Status Filter Tabs */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { id: '', label: 'All Requests' },
              { id: 'SUBMITTED', label: 'Submitted' },
              { id: 'UNDER_REVIEW', label: 'Under Review' },
              { id: 'APPROVED', label: 'Approved' },
              { id: 'INSTALLATION_SCHEDULED', label: 'Scheduled' },
              { id: 'REJECTED', label: 'Rejected' },
            ].map(tab => (
              <button
                key={tab.id}
                id={`tab-${tab.id || 'all'}`}
                onClick={() => setStatusFilter(tab.id)}
                className={`btn btn-sm ${statusFilter === tab.id ? 'btn-primary' : 'btn-secondary'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div>
            <input
              id="input-reviewer-search"
              type="text"
              placeholder="Search ID, customer, city..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="form-control"
              style={{ width: '240px' }}
            />
          </div>

        </div>

        {/* Table */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            Loading requests from database...
          </div>
        ) : requests.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-dim)' }}>
            No installation requests found for current filters.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="telecom-table">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Customer</th>
                  <th>Contact Info</th>
                  <th>Location</th>
                  <th>Plan</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map(req => (
                  <tr key={req.id}>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '600', color: '#38bdf8' }}>
                        {req.requestId}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: '600' }}>{req.contactName}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>User: {req.customer?.username}</div>
                    </td>
                    <td>
                      <div>{req.contactPhone}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{req.contactEmail}</div>
                    </td>
                    <td>{req.city}, {req.state}</td>
                    <td>
                      <div style={{ fontWeight: '600' }}>{req.planName}</div>
                      <div style={{ fontSize: '0.78rem', color: '#38bdf8' }}>{req.planSpeed}</div>
                    </td>
                    <td>
                      <span className={`badge badge-${req.status.toLowerCase()}`}>
                        {req.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          id={`btn-review-${req.id}`}
                          onClick={() => openReviewModal(req)}
                          className="btn btn-primary btn-sm"
                        >
                          Review & Action
                        </button>
                        <button
                          id={`btn-view-${req.id}`}
                          onClick={() => onSelectRequest(req.id)}
                          className="btn btn-secondary btn-sm"
                        >
                          Timeline
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Review Modal */}
      {selectedRequest && (
        <div className="modal-overlay" onClick={() => setSelectedRequest(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            
            <div className="modal-header">
              <div>
                <h2 style={{ fontSize: '1.25rem' }}>Review Request: {selectedRequest.requestId}</h2>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Customer: {selectedRequest.contactName} &bull; {selectedRequest.contactPhone}
                </span>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleReviewSubmit}>
              <div className="modal-body">
                {actionError && (
                  <div style={{
                    padding: '12px',
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: 'var(--radius-md)',
                    color: '#f87171',
                    fontSize: '0.85rem',
                    marginBottom: '16px'
                  }}>
                    {actionError}
                  </div>
                )}

                {/* Request Overview */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '20px',
                  fontSize: '0.9rem'
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                    <div><span style={{ color: 'var(--text-muted)' }}>Address:</span> {selectedRequest.addressLine1}, {selectedRequest.city} ({selectedRequest.postalCode})</div>
                    <div><span style={{ color: 'var(--text-muted)' }}>Requested Plan:</span> {selectedRequest.planName} ({selectedRequest.planSpeed})</div>
                    <div><span style={{ color: 'var(--text-muted)' }}>Preferred Date:</span> {selectedRequest.preferredDate}</div>
                    <div><span style={{ color: 'var(--text-muted)' }}>Current Status:</span> <span className={`badge badge-${selectedRequest.status.toLowerCase()}`}>{selectedRequest.status}</span></div>
                  </div>

                  {/* Attached Documents */}
                  <div style={{ marginTop: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Supporting KYC Documents:</span>
                    {selectedRequest.documents && selectedRequest.documents.length > 0 ? (
                      <div style={{ display: 'flex', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
                        {selectedRequest.documents.map(doc => (
                          <a
                            key={doc.id}
                            href={api.getDocumentDownloadUrl(doc.id)}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: '0.78rem' }}
                          >
                            &#128196; {doc.originalFileName} ({(doc.fileSize / 1024).toFixed(0)} KB)
                          </a>
                        ))}
                      </div>
                    ) : (
                      <span style={{ marginLeft: '8px', fontSize: '0.8rem', color: 'var(--text-dim)' }}>No documents uploaded.</span>
                    )}
                  </div>
                </div>

                {/* Action Selector */}
                <div className="form-group">
                  <label className="form-label">Review Action / Status Transition</label>
                  <select
                    id="select-review-action"
                    className="form-select"
                    value={reviewAction}
                    onChange={e => setReviewAction(e.target.value)}
                  >
                    <option value="UNDER_REVIEW">Move to "Under Review" (Feasibility Check)</option>
                    <option value="APPROVED">Approve Installation Request</option>
                    <option value="INSTALLATION_SCHEDULED">Schedule Installation & Dispatch Technician</option>
                    <option value="REJECTED">Reject Request</option>
                  </select>
                </div>

                {/* Rejection Reason (Mandatory if Reject) */}
                {reviewAction === 'REJECTED' && (
                  <div className="form-group">
                    <label className="form-label" style={{ color: '#f87171' }}>Rejection Reason (Visible to Customer) *</label>
                    <input
                      id="input-rejection-reason"
                      type="text"
                      required
                      placeholder="e.g. Fiber line terminal unavailable in Baner area / Incomplete KYC document"
                      className="form-control"
                      value={rejectionReason}
                      onChange={e => setRejectionReason(e.target.value)}
                    />
                  </div>
                )}

                {/* Scheduling inputs */}
                {(reviewAction === 'INSTALLATION_SCHEDULED' || reviewAction === 'APPROVED') && (
                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Scheduled Installation Date</label>
                      <input
                        id="input-scheduled-date"
                        type="date"
                        className="form-control"
                        value={scheduledDate}
                        onChange={e => setScheduledDate(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Assigned Field Technician</label>
                      <input
                        id="input-assigned-technician"
                        type="text"
                        placeholder="e.g. Alex Miller (Senior Tech)"
                        className="form-control"
                        value={assignedTechnician}
                        onChange={e => setAssignedTechnician(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {/* Remarks */}
                <div className="form-group">
                  <label className="form-label">Reviewer Remarks / Notes</label>
                  <textarea
                    id="input-reviewer-remarks"
                    rows="3"
                    placeholder="Enter inspection remarks, line test findings, or customer notes..."
                    value={remarks}
                    onChange={e => setRemarks(e.target.value)}
                  />
                </div>

              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setSelectedRequest(null)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  id="btn-confirm-review"
                  type="submit"
                  disabled={submittingAction}
                  className={reviewAction === 'REJECTED' ? 'btn btn-outline-danger' : 'btn btn-primary'}
                >
                  {submittingAction ? 'Recording Action...' : 'Record Decision & Notify Customer'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
