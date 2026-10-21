package com.telecom.broadband.repository;

import com.telecom.broadband.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findByRequestIdOrderByTimestampAsc(Long requestId);
}
