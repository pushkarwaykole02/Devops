package com.telecom.broadband.controller;

import com.telecom.broadband.dto.ApiResponse;
import com.telecom.broadband.entity.DocumentAttachment;
import com.telecom.broadband.service.DocumentStorageService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    private final DocumentStorageService documentStorageService;

    public DocumentController(DocumentStorageService documentStorageService) {
        this.documentStorageService = documentStorageService;
    }

    @PostMapping("/upload/{requestId}")
    public ResponseEntity<ApiResponse<DocumentAttachment>> uploadDocument(
            @PathVariable Long requestId,
            @RequestParam("file") MultipartFile file) {
        DocumentAttachment attachment = documentStorageService.storeDocument(requestId, file);
        return ResponseEntity.ok(ApiResponse.ok("File uploaded successfully", attachment));
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<Resource> downloadDocument(@PathVariable Long id) {
        DocumentAttachment doc = documentStorageService.getAttachment(id);
        Resource resource = documentStorageService.loadFileAsResource(id);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(doc.getFileType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + doc.getOriginalFileName() + "\"")
                .body(resource);
    }
}
