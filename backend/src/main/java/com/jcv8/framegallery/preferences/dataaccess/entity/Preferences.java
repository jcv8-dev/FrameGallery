package com.jcv8.framegallery.preferences.dataaccess.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;
import org.hibernate.annotations.Type;

import java.util.Map;

@Entity
@Data
public class Preferences {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;


    @Type(type = "json")
    private Map<String, String> preferences;

}
