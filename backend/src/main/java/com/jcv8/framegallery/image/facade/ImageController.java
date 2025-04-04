package com.jcv8.framegallery.image.facade;

import com.jcv8.framegallery.configuration.JwtService;
import com.jcv8.framegallery.image.dataaccess.dto.ImageInfoRequestDto;
import com.jcv8.framegallery.image.dataaccess.dto.ImageInfoResponseDto;
import com.jcv8.framegallery.image.dataaccess.entity.Image;
import com.jcv8.framegallery.image.logic.ImageDownloadService;
import com.jcv8.framegallery.image.logic.ImageInfoService;
import com.jcv8.framegallery.image.logic.ImageUploadService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.InvalidPathException;
import java.nio.file.NoSuchFileException;
import java.util.List;
import java.util.UUID;
import java.util.logging.Level;
import java.util.logging.Logger;
@Slf4j
@Controller
@RequestMapping(path = "/api/rest/v1/image")
@Tag(name = "Image", description = "Endpoints for image management")
@CrossOrigin(origins = "${cors.allowed.origin}")
public class ImageController {
    
    @Autowired
    private ImageUploadService imageUploadService;

    @Autowired
    private ImageDownloadService imageDownloadService;

    @Autowired
    private ImageInfoService imageInfoService;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtService jwtService;

    /**
     * Endpoint for retrieving filenames of images
     * @param token optional, allows to see unpublished images
     * @param showAll optional, selects whether to see unpublished images when authenticated
     * @return a list of Strings representing filenames
     */
    @GetMapping(value = "/all")
    @PreAuthorize("permitAll()")
    @Operation(summary = "Get all image filenames")
    @ApiResponses(
            value = {
                    @ApiResponse(responseCode = "200", description = "All image filenames retrieved")
            }
    )
    public ResponseEntity<?> getAllImageFilename( @RequestHeader(name="Authorization", required = false) String token, @RequestParam(required = false) Boolean showAll) {
        if(token != null){
            String username = jwtService.extractUsername(token.split(" ")[1]);
            if(showAll != null && showAll && userDetailsService.loadUserByUsername(username) != null){
                log.info("Retrieving all image paths");
                return ResponseEntity.status(HttpStatus.OK).body(imageInfoService.getAllImageFilename());
            }
        }

        log.info("Retrieving all published paths");
        return ResponseEntity.status(HttpStatus.OK).body(imageInfoService.getAllPublishedImageFilename());
    }

    @PutMapping(value = "/add")
    @Operation(summary = "Add an image")
    @PreAuthorize("authenticated")
    @ApiResponses(
            value = {
                    @ApiResponse(responseCode = "200", description = "Image added successfully"),
                    @ApiResponse(responseCode = "400", description = "Invalid Path"),
                    @ApiResponse(responseCode = "400", description = "Empty file")
            }
    )
    public ResponseEntity<?> addImage(@RequestParam("image") MultipartFile image) {
        try{
            Image savedImage = imageUploadService.saveImage(image);
            log.info("Adding image " + image.getOriginalFilename() + " as " + savedImage.getPath());
            return ResponseEntity.status(HttpStatus.OK).body(savedImage);
        } catch (InvalidPathException e ){
            log.warn("Add Image Request with invalid Path");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (NullPointerException e) {
            log.warn("Add Image Request with empty file");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    /**
     * Request for an Images Information
     * @param id the images id
     * @return the information from the database
     */
    @GetMapping(value = "/{id:[0-9a-zA-Z-]{36}}")
    @Operation(summary = "Get image info by id")
    @PreAuthorize("permitAll()")
    @ApiResponses(
            value = {
                    @ApiResponse(responseCode = "200", description = "Image info retrieved"),
                    @ApiResponse(responseCode = "404", description = "Image not found")
            }
    )
    public ResponseEntity<?> getImageInfoById(@PathVariable("id") UUID id) {
        try{
            Image image = imageInfoService.getImageInfoById(id);
            log.info("Retrieving image info for " + id);
            return ResponseEntity.status(HttpStatus.OK).body(new ImageInfoResponseDto(image));
        } catch (NoSuchFileException e) {
            log.warn("Request for non-existing image with id " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PutMapping(value = "/{id:[0-9a-zA-Z-]{36}}")
    @Operation(summary = "Set image info by id")
    @PreAuthorize("authenticated")
    @ApiResponses(
            value = {
                    @ApiResponse(responseCode = "200", description = "Image info updated"),
                    @ApiResponse(responseCode = "404", description = "Image not found")
            }
    )
    public ResponseEntity<?> setImageInfo(@PathVariable("id") UUID id, @RequestBody ImageInfoRequestDto info) {
        try{
            imageInfoService.setImageInfo(id, info);
            log.info("Updating image with UUID{}", id);
            return ResponseEntity.status(HttpStatus.OK).body("");
        } catch (FileNotFoundException e) {
            log.warn("Request for non-existing image with id " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }


    @GetMapping(value = "/{filename:[0-9a-zA-Z-]{36}\\.[a-zA-Z]{3,4}}")
    @Operation(summary = "Get image by filename")
    @PreAuthorize("permitAll()")
    @ApiResponses(
            value = {
                    @ApiResponse(responseCode = "200", description = "Image retrieved"),
                    @ApiResponse(responseCode = "404", description = "Image not found")
            }
    )
    public ResponseEntity<?> getImageById(@PathVariable("filename") String filename, HttpServletRequest request) {
        try{
            Resource image = imageDownloadService.getImageFileByFilename(filename);

            // Try to determine file's content type
            String contentType = null;
            try {
                contentType = request.getServletContext().getMimeType(image.getFile().getAbsolutePath());
            } catch (IOException ex) {
                log.error("Could not determine file type.");
            }

            // Fallback to the default content type if type could not be determined
            if(contentType == null) {
                contentType = "application/octet-stream";
            }

            log.info("Request for {}", filename);
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(image);

        } catch (NoSuchFileException e) {
            log.warn("Request for non-existing image " + filename);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @DeleteMapping(value = "/{id:[0-9a-zA-Z-]{36}}")
    @Operation(summary = "Delete image by id")
    @PreAuthorize("authenticated")
    @ApiResponses(
            value = {
                    @ApiResponse(responseCode = "200", description = "Image deleted"),
                    @ApiResponse(responseCode = "404", description = "Image not found")
            }
    )
    public ResponseEntity<?> deleteImageById(@PathVariable("id") UUID id) {
        try{
            imageDownloadService.deleteImageById(id);
            log.info("Deleting image with id " + id);
            return ResponseEntity.status(HttpStatus.OK).body("Deleted image " + id);
        } catch (IOException e) {
            log.warn("Delete request for non-existing image with id " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping(value = "/orphans")
    @Operation(summary = "Get orphan images")
    @PreAuthorize("authenticated")
    @ApiResponses(
            value = {
                    @ApiResponse(responseCode = "200", description = "Orphan images retrieved")
            }
    )
    public ResponseEntity<?> getOrphanImages() {
        List<String> fileNames = imageInfoService.getOrphans().stream().map(path -> path.getFileName().toString()).toList();
        return ResponseEntity.status(HttpStatus.OK).body(fileNames);
    }

    @PostMapping(value = "/orphans/index")
    @Operation(summary = "Reindex orphan images")
    @PreAuthorize("authenticated")
    @ApiResponses(
            value = {
                    @ApiResponse(responseCode = "200", description = "Orphan images reindexed")
            }
    )
    public ResponseEntity<?> reIndexOrphans() {
        log.info("Reindexing orphan images");
        imageInfoService.indexOrphans();
        return ResponseEntity.status(HttpStatus.OK).body(imageInfoService.getOrphans());
    }

    @DeleteMapping(value = "/orphans")
    @Operation(summary = "Delete orphan images")
    @PreAuthorize("authenticated")
    @ApiResponses(
            value = {
                    @ApiResponse(responseCode = "200", description = "Orphan images deleted"),
                    @ApiResponse(responseCode = "500", description = "Could not delete all orphans")
            }
    )
    public ResponseEntity<?> deleteOrphanImages() {
        try{
            List<String> fileNames = imageInfoService.getOrphans().stream().map(path -> path.getFileName().toString()).toList();
            imageInfoService.deleteOrphans();
            return ResponseEntity.status(HttpStatus.OK).body(fileNames);
        } catch (IOException e) {
            log.warn("Delete request for non-existing orphan images");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Could not delete all orphans");
        }
    }
}
