package com.jcv8.framegallery.preferences.dataaccess.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.HashMap;

@Entity
@Data
public class Preferences {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ElementCollection
    private HashMap<String, String> preferences;

}
