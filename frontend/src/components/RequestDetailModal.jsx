import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function RequestDetailModal({ requestId, onClose }) {
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (requestId) {
      loadDetail();
    }
  }, [requestId]);

  async function loadDetail() {
    setLoading(true);
    try {
      const res = await api.getRequestDetails(requestId);
      setRequest(res.data);
    } catch (err) {
      setError(err.message || 'Failed to retrieve request details');
    } finally {
      setLoading(false);
    }
  }

  if (!requestId) return null;

  // Compute status step index
  // 0: SUBMITTED, 1: UNDER_REVIEW, 2: APPROVED / REJECTED, 3: INSTALLATION_SCHEDULED
  function getStepStatus(stepIndex, currentStatus) {
    if (currentStatus === 'REJECTED') {
      if (stepIndex === 0 || stepIndex === 1) return 'completed';
      if (stepIndex === 2) return 'rejected';
      return '';
    }

    const order = {
      SUBMITTED: 0,
      UNDER_REVIEW: 1,
      APPROVED: 2,
      INSTALLATION_SCHEDULED: 3
    };

    const cur = order[currentStatus] ?? 0;
    if (stepIndex < cur) return 'completed';
    if (stepIndex === cur) return 'active';
    return '';
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '720px' }}>
        
        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontSize: '1.3rem' }}>Request Lifecycle Tracker</h2>
              {request && (
                <span className={`badge badge-${request.status.toLowerCase()}`}>
                  {request.status.replace('_', ' ')}
                </span>
              )}
            </div>
            {request && (
              <span style={{ fontSize: '0.85rem', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                {request.requestId}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}
          >
            &times;
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              Loading request details...
            </div>
          ) : error ? (
            <div style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', borderRadius: 'var(--radius-md)' }}>
              {error}
            </div>
          ) : request && (
            <>
              {/* Visual Workflow Progress Timeline */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '20px',
                marginBottom: '24px'
              }}>
                <h3 style={{ fontSize: '0.95rem', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
                  Workflow Progress Pipeline
                </h3>

                <div className="timeline">
                  {/* Step 1: Submission */}
                  <div className={`timeline-step ${getStepStatus(0, request.status)}`}>
                    <div className="timeline-indicator">1</div>
                    <div className="timeline-content">
                      <div className="timeline-title">Request Submitted</div>
                      <div className="timeline-desc">Customer order placed with required applicant & location info.</div>
                      <div className="timeline-time">{new Date(request.createdAt).toLocaleString()}</div>
                    </div>
                  </div>

                  {/* Step 2: Under Review */}
                  <div className={`timeline-step ${getStepStatus(1, request.status)}`}>
                    <div className="timeline-indicator">2</div>
                    <div className="timeline-content">
                      <div className="timeline-title">Feasibility & Document Verification</div>
                      <div className="timeline-desc">
                        Telecom officer validates address coverage, junction box, and KYC proof.
                      </div>
                      {request.reviewedAt && (
                        <div className="timeline-time">Assigned Reviewer: {request.reviewedBy || 'Senior Officer'}</div>
                      )}
                    </div>
                  </div>

                  {/* Step 3: Decision (Approved or Rejected) */}
                  <div className={`timeline-step ${getStepStatus(2, request.status)}`}>
                    <div className="timeline-indicator">
                      {request.status === 'REJECTED' ? '✕' : '3'}
                    </div>
                    <div className="timeline-content">
                      <div className="timeline-title">
                        {request.status === 'REJECTED' ? 'Application Rejected' : 'Application Approved'}
                      </div>
                      <div className="timeline-desc">
                        {request.status === 'REJECTED' ? (
                          <span style={{ color: '#f87171' }}>Reason: {request.rejectionReason}</span>
                        ) : (
                          'Connection feasibility confirmed and order approved.'
                        )}
                      </div>
                      {request.reviewerRemarks && (
                        <div style={{ marginTop: '4px', fontSize: '0.82rem', color: '#94a3b8' }}>
                          Remarks: <em>"{request.reviewerRemarks}"</em>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Step 4: Scheduled */}
                  {request.status !== 'REJECTED' && (
                    <div className={`timeline-step ${getStepStatus(3, request.status)}`}>
                      <div className="timeline-indicator">4</div>
                      <div className="timeline-content">
                        <div className="timeline-title">Field Installation Scheduled</div>
                        <div className="timeline-desc">
                          {request.scheduledDate ? (
                            <span>
                              Scheduled for <strong style={{ color: '#c084fc' }}>{request.scheduledDate}</strong> by technician <strong style={{ color: '#e2e8f0' }}>{request.assignedTechnician || 'Assigned Tech'}</strong>
                            </span>
                          ) : (
                            'Technician dispatch and fiber pulling pending.'
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Request Details Grid */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '20px',
                marginBottom: '24px'
              }}>
                <h3 style={{ fontSize: '0.95rem', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
                  Installation & Plan Details
                </h3>

                <div className="grid-2" style={{ fontSize: '0.9rem' }}>
                  <div>
                    <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>Customer Name</div>
                    <div style={{ fontWeight: '600' }}>{request.contactName}</div>
                  </div>

                  <div>
                    <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>Contact Info</div>
                    <div>{request.contactPhone} &bull; {request.contactEmail}</div>
                  </div>

                  <div>
                    <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>Installation Address</div>
                    <div>{request.addressLine1} {request.addressLine2 ? `, ${request.addressLine2}` : ''}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{request.city}, {request.state} - {request.postalCode}</div>
                  </div>

                  <div>
                    <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>Broadband Plan</div>
                    <div style={{ fontWeight: '600', color: '#38bdf8' }}>{request.planName} ({request.planSpeed})</div>
                    <div style={{ fontSize: '0.85rem' }}>${request.planPrice}/month</div>
                  </div>
                </div>

                {/* Supporting Documents */}
                <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border-color)' }}>
                  <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem', marginBottom: '8px' }}>KYC / Address Documents</div>
                  {request.documents && request.documents.length > 0 ? (
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      {request.documents.map(doc => (
                        <a
                          key={doc.id}
                          href={api.getDocumentDownloadUrl(doc.id)}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-secondary btn-sm"
                        >
                          &#128196; Download {doc.originalFileName} ({(doc.fileSize / 1024).toFixed(1)} KB)
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>No supporting documents uploaded with this request.</div>
                  )}
                </div>
              </div>

              {/* Immutable Audit Trail Log */}
              {request.auditLogs && request.auditLogs.length > 0 && (
                <div style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '20px'
                }}>
                  <h3 style={{ fontSize: '0.95rem', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
                    System Audit Trail (Immutable Log)
                  </h3>

                  <div className="table-responsive">
                    <table className="telecom-table" style={{ fontSize: '0.825rem' }}>
                      <thead>
                        <tr>
                          <th>Timestamp</th>
                          <th>User</th>
                          <th>Action</th>
                          <th>Transition</th>
                          <th>Remarks / Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {request.auditLogs.map(log => (
                          <tr key={log.id}>
                            <td style={{ fontFamily: 'var(--font-mono)' }}>
                              {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </td>
                            <td><strong>{log.performedByUsername}</strong></td>
                            <td>{log.action}</td>
                            <td>
                              {log.previousStatus ? `${log.previousStatus} → ` : ''}
                              <span style={{ color: '#38bdf8' }}>{log.newStatus}</span>
                            </td>
                            <td style={{ color: '#cbd5e1' }}>{log.remarks}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-secondary">
            Close Tracker
          </button>
        </div>

      </div>
    </div>
  );
}
