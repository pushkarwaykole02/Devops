package com.telecom.broadband.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long requestId;

    @Column(nullable = false, length = 100)
    private String performedByUsername;

    @Column(nullable = false, length = 100)
    private String action;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private RequestStatus previousStatus;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private RequestStatus newStatus;

    @Column(length = 1000)
    private String remarks;

    @Column(nullable = false, updatable = false)
    private LocalDateTime timestamp;

    public AuditLog() {
    }

    public AuditLog(Long requestId, String performedByUsername, String action, RequestStatus previousStatus, RequestStatus newStatus, String remarks) {
        this.requestId = requestId;
        this.performedByUsername = performedByUsername;
        this.action = action;
        this.previousStatus = previousStatus;
        this.newStatus = newStatus;
        this.remarks = remarks;
    }

    @PrePersist
    protected void onCreate() {
        this.timestamp = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getRequestId() {
        return requestId;
    }

    public void setRequestId(Long requestId) {
        this.requestId = requestId;
    }

    public String getPerformedByUsername() {
        return performedByUsername;
    }

    public void setPerformedByUsername(String performedByUsername) {
        this.performedByUsername = performedByUsername;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public RequestStatus getPreviousStatus() {
        return previousStatus;
    }

    public void setPreviousStatus(RequestStatus previousStatus) {
        this.previousStatus = previousStatus;
    }

    public RequestStatus getNewStatus() {
        return newStatus;
    }

    public void setNewStatus(RequestStatus newStatus) {
        this.newStatus = newStatus;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
