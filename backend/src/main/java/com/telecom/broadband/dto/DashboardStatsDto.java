package com.telecom.broadband.dto;

public class DashboardStatsDto {
    private long totalRequests;
    private long pendingReviews;
    private long approvedRequests;
    private long rejectedRequests;
    private long scheduledInstallations;

    public DashboardStatsDto() {
    }

    public DashboardStatsDto(long totalRequests, long pendingReviews, long approvedRequests, long rejectedRequests, long scheduledInstallations) {
        this.totalRequests = totalRequests;
        this.pendingReviews = pendingReviews;
        this.approvedRequests = approvedRequests;
        this.rejectedRequests = rejectedRequests;
        this.scheduledInstallations = scheduledInstallations;
    }

    public long getTotalRequests() {
        return totalRequests;
    }

    public void setTotalRequests(long totalRequests) {
        this.totalRequests = totalRequests;
    }

    public long getPendingReviews() {
        return pendingReviews;
    }

    public void setPendingReviews(long pendingReviews) {
        this.pendingReviews = pendingReviews;
    }

    public long getApprovedRequests() {
        return approvedRequests;
    }

    public void setApprovedRequests(long approvedRequests) {
        this.approvedRequests = approvedRequests;
    }

    public long getRejectedRequests() {
        return rejectedRequests;
    }

    public void setRejectedRequests(long rejectedRequests) {
        this.rejectedRequests = rejectedRequests;
    }

    public long getScheduledInstallations() {
        return scheduledInstallations;
    }

    public void setScheduledInstallations(long scheduledInstallations) {
        this.scheduledInstallations = scheduledInstallations;
    }
}
