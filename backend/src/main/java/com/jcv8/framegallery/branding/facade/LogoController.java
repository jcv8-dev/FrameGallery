package com.jcv8.framegallery.branding.facade;

import com.jcv8.framegallery.branding.logic.LogoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/rest/v1/branding")
@CrossOrigin(origins = "${cors.allowed.origin}")
public class LogoController {

    @Autowired
    private LogoService logoService;

    @GetMapping("/logo")
    @PreAuthorize("permitAll()")
    public ResponseEntity<Resource> getLogo() {
        Resource logo = logoService.load();
        if (logo == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().contentType(MediaType.IMAGE_PNG).body(logo);
    }

    @PutMapping(value = "/logo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("authenticated")
    public ResponseEntity<String> uploadLogo(@RequestParam("logo") MultipartFile logo) {
        try {
            logoService.save(logo);
            return ResponseEntity.ok("Logo uploaded successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
