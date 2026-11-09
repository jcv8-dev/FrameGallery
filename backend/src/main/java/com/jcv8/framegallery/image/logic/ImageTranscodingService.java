package com.jcv8.framegallery.image.logic;

import com.jcv8.framegallery.fileStorage.StorageService;
import com.jcv8.framegallery.image.dataaccess.entity.Image;
import com.jcv8.framegallery.image.dataaccess.entity.TranscodingStatus;
import com.jcv8.framegallery.image.dataaccess.repository.ImageRepository;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.Path;

@Service
public class ImageTranscodingService {

    @Autowired
    private StorageService storageService;

    @Autowired
    private ImageRepository imageRepository;

    @Async
    public void transcode(Image image) {
        image.setTranscodingStatus(TranscodingStatus.PROCESSING);
        imageRepository.save(image);

        try {
            for (Integer resolution : ImageUploadService.PREDEFINED_RESOLUTIONS) {
                try (ByteArrayOutputStream output = new ByteArrayOutputStream();
                     var input = storageService.loadAsResource(image.getPath()).getInputStream()) {
                    Thumbnails.of(input)
                            .size(resolution, resolution)
                            .outputFormat("webp")
                            .outputQuality(0.85)
                            .toOutputStream(output);
                    storageService.store(
                            Path.of(ImageUploadService.derivativeFilename(image.getId(), resolution)),
                            output.toByteArray());
                }
            }
            image.setTranscodingStatus(TranscodingStatus.COMPLETE);
        } catch (IOException | RuntimeException e) {
            image.setTranscodingStatus(TranscodingStatus.FAILED);
        }
        imageRepository.save(image);
    }
}
