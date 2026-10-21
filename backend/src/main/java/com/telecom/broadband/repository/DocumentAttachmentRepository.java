package com.telecom.broadband.repository;

import com.telecom.broadband.entity.DocumentAttachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentAttachmentRepository extends JpaRepository<DocumentAttachment, Long> {
    List<DocumentAttachment> findByRequestId(Long requestId);
}
