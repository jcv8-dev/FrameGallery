package com.jcv8.framegallery.branding.logic;

import com.jcv8.framegallery.fileStorage.StorageService;
import com.jcv8.framegallery.fileStorage.exception.StorageFileNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.Path;

@Service
public class LogoService {

    private static final Path LOGO_PATH = Path.of("logo.png");

    @Autowired
    private StorageService storageService;

    public void save(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Logo file is empty");
        }

        try {
            BufferedImage image = ImageIO.read(file.getInputStream());
            if (image == null) {
                throw new IllegalArgumentException("Logo must be a valid image");
            }

            ByteArrayOutputStream output = new ByteArrayOutputStream();
            if (!ImageIO.write(image, "png", output)) {
                throw new IllegalArgumentException("Logo could not be converted to PNG");
            }
            storageService.store(LOGO_PATH, output.toByteArray());
        } catch (IOException e) {
            throw new IllegalArgumentException("Logo could not be read", e);
        }
    }

    public Resource load() {
        try {
            return storageService.loadAsResource(LOGO_PATH);
        } catch (StorageFileNotFoundException e) {
            return null;
        }
    }
}
