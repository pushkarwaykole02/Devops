package com.telecom.broadband.repository;

import com.telecom.broadband.entity.InstallationRequest;
import com.telecom.broadband.entity.RequestStatus;
import com.telecom.broadband.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InstallationRequestRepository extends JpaRepository<InstallationRequest, Long> {
    
    Optional<InstallationRequest> findByRequestId(String requestId);

    List<InstallationRequest> findByCustomerOrderByCreatedAtDesc(User customer);

    List<InstallationRequest> findAllByOrderByCreatedAtDesc();

    List<InstallationRequest> findByStatusOrderByCreatedAtDesc(RequestStatus status);

    long countByStatus(RequestStatus status);

    @Query("SELECT COUNT(r) FROM InstallationRequest r WHERE r.status = 'UNDER_REVIEW' OR r.status = 'SUBMITTED'")
    long countPendingReview();
}
