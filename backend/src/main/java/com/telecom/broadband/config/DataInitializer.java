package com.telecom.broadband.config;

import com.telecom.broadband.entity.*;
import com.telecom.broadband.repository.AuditLogRepository;
import com.telecom.broadband.repository.InstallationRequestRepository;
import com.telecom.broadband.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final InstallationRequestRepository requestRepository;
    private final AuditLogRepository auditLogRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           InstallationRequestRepository requestRepository,
                           AuditLogRepository auditLogRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.requestRepository = requestRepository;
        this.auditLogRepository = auditLogRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            // Seed Reviewer
            User reviewer = new User(
                    "reviewer",
                    "reviewer@telecom.com",
                    passwordEncoder.encode("Reviewer@123"),
                    "Senior Review Officer",
                    "9876543210",
                    Role.ROLE_REVIEWER
            );
            userRepository.save(reviewer);

            // Seed Customer (Pushkar Waykole)
            User customer = new User(
                    "pushkar",
                    "pushkar@telecom.com",
                    passwordEncoder.encode("Customer@123"),
                    "Pushkar Waykole",
                    "9822012345",
                    Role.ROLE_CUSTOMER
            );
            userRepository.save(customer);

            // Seed Sample Installation Requests
            // Request 1: SUBMITTED
            InstallationRequest req1 = new InstallationRequest();
            req1.setRequestId("BB-2026-1001");
            req1.setCustomer(customer);
            req1.setContactName("Pushkar Waykole");
            req1.setContactPhone("9822012345");
            req1.setContactEmail("pushkar@telecom.com");
            req1.setAddressLine1("Flat 402, Highrise Palms, Shivaji Nagar");
            req1.setAddressLine2("Opposite City Center Mall");
            req1.setCity("Pune");
            req1.setState("Maharashtra");
            req1.setPostalCode("411005");
            req1.setPreferredDate(LocalDate.now().plusDays(3));
            req1.setPlanName("Fiber Ultra 300");
            req1.setPlanSpeed("300 Mbps");
            req1.setPlanPrice(49.99);
            req1.setStatus(RequestStatus.SUBMITTED);
            InstallationRequest saved1 = requestRepository.save(req1);
            auditLogRepository.save(new AuditLog(saved1.getId(), "pushkar", "SUBMISSION", null, RequestStatus.SUBMITTED, "Broadband installation request submitted by Pushkar Waykole"));

            // Request 2: UNDER_REVIEW
            InstallationRequest req2 = new InstallationRequest();
            req2.setRequestId("BB-2026-1002");
            req2.setCustomer(customer);
            req2.setContactName("Pushkar Waykole");
            req2.setContactPhone("9822012345");
            req2.setContactEmail("pushkar@telecom.com");
            req2.setAddressLine1("Tech Park Tower B, Hinjawadi Phase 1");
            req2.setCity("Pune");
            req2.setState("Maharashtra");
            req2.setPostalCode("411057");
            req2.setPreferredDate(LocalDate.now().plusDays(2));
            req2.setPlanName("GigaMax 1 Gbps");
            req2.setPlanSpeed("1000 Mbps");
            req2.setPlanPrice(89.99);
            req2.setStatus(RequestStatus.UNDER_REVIEW);
            req2.setReviewedBy("reviewer");
            req2.setReviewerRemarks("Verifying fiber optic junction box availability.");
            InstallationRequest saved2 = requestRepository.save(req2);
            auditLogRepository.save(new AuditLog(saved2.getId(), "pushkar", "SUBMISSION", null, RequestStatus.SUBMITTED, "Broadband installation request submitted"));
            auditLogRepository.save(new AuditLog(saved2.getId(), "reviewer", "STATUS_CHANGE", RequestStatus.SUBMITTED, RequestStatus.UNDER_REVIEW, "Assigned to reviewer for feasibility check"));

            // Request 3: INSTALLATION_SCHEDULED
            InstallationRequest req3 = new InstallationRequest();
            req3.setRequestId("BB-2026-1003");
            req3.setCustomer(customer);
            req3.setContactName("Pushkar Waykole");
            req3.setContactPhone("9822012345");
            req3.setContactEmail("pushkar@telecom.com");
            req3.setAddressLine1("Villa 12, Green Meadows, Baner");
            req3.setCity("Pune");
            req3.setState("Maharashtra");
            req3.setPostalCode("411045");
            req3.setPreferredDate(LocalDate.now().plusDays(1));
            req3.setPlanName("SpeedPro 500");
            req3.setPlanSpeed("500 Mbps");
            req3.setPlanPrice(69.99);
            req3.setStatus(RequestStatus.INSTALLATION_SCHEDULED);
            req3.setReviewedBy("reviewer");
            req3.setReviewerRemarks("Feasibility confirmed. Line terminal port reserved.");
            req3.setScheduledDate(LocalDate.now().plusDays(2));
            req3.setAssignedTechnician("Alex Miller (Senior Fiber Tech)");
            InstallationRequest saved3 = requestRepository.save(req3);
            auditLogRepository.save(new AuditLog(saved3.getId(), "pushkar", "SUBMISSION", null, RequestStatus.SUBMITTED, "Request submitted"));
            auditLogRepository.save(new AuditLog(saved3.getId(), "reviewer", "STATUS_CHANGE", RequestStatus.SUBMITTED, RequestStatus.APPROVED, "Documents verified & approved"));
            auditLogRepository.save(new AuditLog(saved3.getId(), "reviewer", "STATUS_CHANGE", RequestStatus.APPROVED, RequestStatus.INSTALLATION_SCHEDULED, "Technician assigned: Alex Miller"));
        }
    }
}
