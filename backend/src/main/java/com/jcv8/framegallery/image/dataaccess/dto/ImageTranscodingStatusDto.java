package com.jcv8.framegallery.image.dataaccess.dto;

import com.jcv8.framegallery.image.dataaccess.entity.Image;
import com.jcv8.framegallery.image.dataaccess.entity.TranscodingStatus;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.UUID;

@Data
@AllArgsConstructor
public class ImageTranscodingStatusDto {
    private UUID id;
    private TranscodingStatus status;
    private Boolean published;

    public ImageTranscodingStatusDto(Image image) {
        this(
                image.getId(),
                image.getTranscodingStatus() == null
                        ? TranscodingStatus.COMPLETE
                        : image.getTranscodingStatus(),
                image.getPublished()
        );
    }
}
