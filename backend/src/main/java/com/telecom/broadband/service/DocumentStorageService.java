package com.telecom.broadband.service;

import com.telecom.broadband.entity.DocumentAttachment;
import com.telecom.broadband.repository.DocumentAttachmentRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.util.*;

@Service
public class DocumentStorageService {

    private final Path fileStorageLocation;
    private final DocumentAttachmentRepository documentRepository;

    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList("pdf", "png", "jpg", "jpeg", "docx");
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    public DocumentStorageService(@Value("${app.upload.dir:./uploads}") String uploadDir,
                                  DocumentAttachmentRepository documentRepository) {
        this.documentRepository = documentRepository;
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();

        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create upload directory", ex);
        }
    }

    public DocumentAttachment storeDocument(Long requestId, MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Cannot upload an empty file");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("File size exceeds 10MB limit");
        }

        String originalFileName = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        String fileExtension = "";
        int dotIndex = originalFileName.lastIndexOf('.');
        if (dotIndex > 0) {
            fileExtension = originalFileName.substring(dotIndex + 1).toLowerCase();
        }

        if (!ALLOWED_EXTENSIONS.contains(fileExtension)) {
            throw new IllegalArgumentException("Invalid file type: ." + fileExtension + ". Allowed types: PDF, PNG, JPG, JPEG, DOCX");
        }

        String storedFileName = UUID.randomUUID() + "_" + originalFileName.replaceAll("[^a-zA-Z0-9.-]", "_");

        try {
            Path targetLocation = this.fileStorageLocation.resolve(storedFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            DocumentAttachment doc = new DocumentAttachment(
                    requestId,
                    storedFileName,
                    originalFileName,
                    file.getContentType() != null ? file.getContentType() : "application/octet-stream",
                    file.getSize(),
                    targetLocation.toString()
            );

            return documentRepository.save(doc);
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + originalFileName, ex);
        }
    }

    public Resource loadFileAsResource(Long documentId) {
        DocumentAttachment attachment = documentRepository.findById(documentId)
                .orElseThrow(() -> new NoSuchElementException("Document not found with id: " + documentId));

        try {
            Path filePath = this.fileStorageLocation.resolve(attachment.getFileName()).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new NoSuchElementException("File not found on disk: " + attachment.getOriginalFileName());
            }
        } catch (MalformedURLException ex) {
            throw new NoSuchElementException("File path is invalid", ex);
        }
    }

    public DocumentAttachment getAttachment(Long documentId) {
        return documentRepository.findById(documentId)
                .orElseThrow(() -> new NoSuchElementException("Document not found with id: " + documentId));
    }
}
