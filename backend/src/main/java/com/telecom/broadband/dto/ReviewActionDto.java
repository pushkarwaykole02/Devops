package com.telecom.broadband.dto;

import com.telecom.broadband.entity.RequestStatus;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class ReviewActionDto {

    @NotNull(message = "Action status is required")
    private RequestStatus status; // UNDER_REVIEW, APPROVED, REJECTED, INSTALLATION_SCHEDULED

    private String remarks;
    private String rejectionReason;
    private LocalDate scheduledDate;
    private String assignedTechnician;

    public ReviewActionDto() {
    }

    public RequestStatus getStatus() {
        return status;
    }

    public void setStatus(RequestStatus status) {
        this.status = status;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }

    public LocalDate getScheduledDate() {
        return scheduledDate;
    }

    public void setScheduledDate(LocalDate scheduledDate) {
        this.scheduledDate = scheduledDate;
    }

    public String getAssignedTechnician() {
        return assignedTechnician;
    }

    public void setAssignedTechnician(String assignedTechnician) {
        this.assignedTechnician = assignedTechnician;
    }
}
