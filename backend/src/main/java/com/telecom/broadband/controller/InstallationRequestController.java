package com.telecom.broadband.controller;

import com.telecom.broadband.dto.ApiResponse;
import com.telecom.broadband.dto.DashboardStatsDto;
import com.telecom.broadband.dto.RequestSubmissionDto;
import com.telecom.broadband.dto.ReviewActionDto;
import com.telecom.broadband.entity.InstallationRequest;
import com.telecom.broadband.entity.RequestStatus;
import com.telecom.broadband.service.InstallationRequestService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
public class InstallationRequestController {

    private final InstallationRequestService requestService;

    public InstallationRequestController(InstallationRequestService requestService) {
        this.requestService = requestService;
    }

    // Customer submits a new request
    @PostMapping
    public ResponseEntity<ApiResponse<InstallationRequest>> submitRequest(@Valid @RequestBody RequestSubmissionDto dto,
                                                                         Authentication authentication) {
        InstallationRequest request = requestService.submitRequest(dto, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Installation request submitted successfully", request));
    }

    // Customer retrieves their requests
    @GetMapping("/my-requests")
    public ResponseEntity<ApiResponse<List<InstallationRequest>>> getMyRequests(Authentication authentication) {
        List<InstallationRequest> list = requestService.getCustomerRequests(authentication.getName());
        return ResponseEntity.ok(ApiResponse.ok("Fetched your installation requests", list));
    }

    // Fetch single request detail (authorized for the customer owner OR reviewer/admin)
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<InstallationRequest>> getRequestDetails(@PathVariable Long id,
                                                                             Authentication authentication) {
        InstallationRequest req = requestService.getRequestById(id, authentication.getName());
        return ResponseEntity.ok(ApiResponse.ok("Request details retrieved", req));
    }

    // Reviewer lists all requests with optional status and search filters
    @GetMapping("/reviewer/all")
    @PreAuthorize("hasAnyAuthority('ROLE_REVIEWER', 'ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<List<InstallationRequest>>> getAllRequests(
            @RequestParam(required = false) RequestStatus status,
            @RequestParam(required = false) String search) {
        List<InstallationRequest> list = requestService.getAllRequests(status, search);
        return ResponseEntity.ok(ApiResponse.ok("Retrieved all installation requests", list));
    }

    // Reviewer changes status (Review, Approve, Reject, Schedule)
    @PutMapping("/reviewer/{id}/review")
    @PreAuthorize("hasAnyAuthority('ROLE_REVIEWER', 'ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<InstallationRequest>> reviewRequest(@PathVariable Long id,
                                                                         @Valid @RequestBody ReviewActionDto dto,
                                                                         Authentication authentication) {
        InstallationRequest updated = requestService.reviewRequest(id, dto, authentication.getName());
        return ResponseEntity.ok(ApiResponse.ok("Request review action recorded successfully", updated));
    }

    // Reviewer analytics KPI cards
    @GetMapping("/analytics/stats")
    @PreAuthorize("hasAnyAuthority('ROLE_REVIEWER', 'ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> getAnalyticsStats() {
        DashboardStatsDto stats = requestService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.ok("Analytics statistics retrieved", stats));
    }
}
