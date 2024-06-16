package main.java.com.jcv8.framegallery.image.dataaccess.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.Setter;
import main.java.com.jcv8.framegallery.image.dataaccess.entity.ImageProperty.ImageProperty;

import java.util.List;

@Getter
@Setter
@Entity
public class Image {
    private String path;
    private String title;

    @ManyToMany
    private List<Keyword> keywords;

    @OneToMany
    private List<ImageProperty<?>> imageProperties;

    @Id
    private Long id;

}
