package com.telecom.broadband.service;

import com.telecom.broadband.dto.DashboardStatsDto;
import com.telecom.broadband.dto.RequestSubmissionDto;
import com.telecom.broadband.dto.ReviewActionDto;
import com.telecom.broadband.entity.*;
import com.telecom.broadband.repository.AuditLogRepository;
import com.telecom.broadband.repository.InstallationRequestRepository;
import com.telecom.broadband.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

@Service
public class InstallationRequestService {

    private final InstallationRequestRepository requestRepository;
    private final UserRepository userRepository;
    private final AuditLogRepository auditLogRepository;

    public InstallationRequestService(InstallationRequestRepository requestRepository,
                                      UserRepository userRepository,
                                      AuditLogRepository auditLogRepository) {
        this.requestRepository = requestRepository;
        this.userRepository = userRepository;
        this.auditLogRepository = auditLogRepository;
    }

    private synchronized String generateUniqueRequestId() {
        int randomNum = ThreadLocalRandom.current().nextInt(1000, 9999);
        String id = "BB-2026-" + randomNum;
        while (requestRepository.findByRequestId(id).isPresent()) {
            randomNum = ThreadLocalRandom.current().nextInt(1000, 9999);
            id = "BB-2026-" + randomNum;
        }
        return id;
    }

    @Transactional
    public InstallationRequest submitRequest(RequestSubmissionDto dto, String username) {
        User customer = userRepository.findByUsername(username)
                .orElseThrow(() -> new NoSuchElementException("User not found: " + username));

        InstallationRequest req = new InstallationRequest();
        req.setRequestId(generateUniqueRequestId());
        req.setCustomer(customer);
        req.setContactName(dto.getContactName());
        req.setContactPhone(dto.getContactPhone());
        req.setContactEmail(dto.getContactEmail());
        req.setAddressLine1(dto.getAddressLine1());
        req.setAddressLine2(dto.getAddressLine2());
        req.setCity(dto.getCity());
        req.setState(dto.getState());
        req.setPostalCode(dto.getPostalCode());
        req.setPreferredDate(dto.getPreferredDate());
        req.setPlanName(dto.getPlanName());
        req.setPlanSpeed(dto.getPlanSpeed());
        req.setPlanPrice(dto.getPlanPrice());
        req.setStatus(RequestStatus.SUBMITTED);

        InstallationRequest saved = requestRepository.save(req);

        // Record Initial Audit Log
        AuditLog audit = new AuditLog(
                saved.getId(),
                customer.getUsername(),
                "SUBMISSION",
                null,
                RequestStatus.SUBMITTED,
                "Installation request submitted by customer: " + customer.getFullName()
        );
        auditLogRepository.save(audit);

        return saved;
    }

    public List<InstallationRequest> getCustomerRequests(String username) {
        User customer = userRepository.findByUsername(username)
                .orElseThrow(() -> new NoSuchElementException("User not found: " + username));
        return requestRepository.findByCustomerOrderByCreatedAtDesc(customer);
    }

    public InstallationRequest getRequestById(Long id, String username) {
        InstallationRequest request = requestRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Request not found with id: " + id));

        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new NoSuchElementException("User not found: " + username));

        // Authorization check: Customer can only access their own request
        if (currentUser.getRole() == Role.ROLE_CUSTOMER &&
                !request.getCustomer().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("Unauthorized: You can only view your own installation requests.");
        }

        return request;
    }

    public List<InstallationRequest> getAllRequests(RequestStatus status, String search) {
        List<InstallationRequest> list = (status != null)
                ? requestRepository.findByStatusOrderByCreatedAtDesc(status)
                : requestRepository.findAllByOrderByCreatedAtDesc();

        if (search != null && !search.trim().isEmpty()) {
            String lower = search.toLowerCase().trim();
            return list.stream()
                    .filter(r -> (r.getRequestId() != null && r.getRequestId().toLowerCase().contains(lower))
                            || (r.getContactName() != null && r.getContactName().toLowerCase().contains(lower))
                            || (r.getContactEmail() != null && r.getContactEmail().toLowerCase().contains(lower))
                            || (r.getCity() != null && r.getCity().toLowerCase().contains(lower))
                            || (r.getPlanName() != null && r.getPlanName().toLowerCase().contains(lower)))
                    .collect(Collectors.toList());
        }

        return list;
    }

    @Transactional
    public InstallationRequest reviewRequest(Long id, ReviewActionDto dto, String reviewerUsername) {
        InstallationRequest request = requestRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Request not found with id: " + id));

        RequestStatus previousStatus = request.getStatus();
        RequestStatus newStatus = dto.getStatus();

        request.setStatus(newStatus);
        request.setReviewedBy(reviewerUsername);
        request.setReviewedAt(LocalDateTime.now());

        if (dto.getRemarks() != null && !dto.getRemarks().trim().isEmpty()) {
            request.setReviewerRemarks(dto.getRemarks());
        }

        if (newStatus == RequestStatus.REJECTED) {
            request.setRejectionReason(dto.getRejectionReason() != null ? dto.getRejectionReason() : dto.getRemarks());
        }

        if (dto.getScheduledDate() != null) {
            request.setScheduledDate(dto.getScheduledDate());
        }
        if (dto.getAssignedTechnician() != null) {
            request.setAssignedTechnician(dto.getAssignedTechnician());
        }

        InstallationRequest updated = requestRepository.save(request);

        // Record Audit Log
        String actionDescription = "Status changed from " + previousStatus + " to " + newStatus;
        if (dto.getRemarks() != null && !dto.getRemarks().isEmpty()) {
            actionDescription += " | Remarks: " + dto.getRemarks();
        }
        if (dto.getRejectionReason() != null && !dto.getRejectionReason().isEmpty()) {
            actionDescription += " | Reason: " + dto.getRejectionReason();
        }

        AuditLog audit = new AuditLog(
                updated.getId(),
                reviewerUsername,
                "STATUS_CHANGE",
                previousStatus,
                newStatus,
                actionDescription
        );
        auditLogRepository.save(audit);

        return updated;
    }

    public DashboardStatsDto getDashboardStats() {
        long total = requestRepository.count();
        long pending = requestRepository.countPendingReview();
        long approved = requestRepository.countByStatus(RequestStatus.APPROVED);
        long rejected = requestRepository.countByStatus(RequestStatus.REJECTED);
        long scheduled = requestRepository.countByStatus(RequestStatus.INSTALLATION_SCHEDULED);

        return new DashboardStatsDto(total, pending, approved, rejected, scheduled);
    }
}
