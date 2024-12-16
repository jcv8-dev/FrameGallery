package com.jcv8.framegallery.preferences.logic;

import com.jcv8.framegallery.preferences.dataaccess.entity.Preferences;
import com.jcv8.framegallery.preferences.dataaccess.repository.PreferenceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class PreferenceService {

    @Autowired
    private PreferenceRepository preferenceRepository;

    private final HashMap<String, String> defaultPreferences = new HashMap<>(
        Map.of(
        "theme", "light",
        "language", "en",
        "font-size", "16",
        "favicon-size", "32"
        )
    );

    public Map<String, String> getAllPreferences(){
        return preferenceRepository.findAll().get(0).getPreferences();
    }

    public String getPreferenceByKey(String key){
        return preferenceRepository.findAll().get(0).getPreferences().get(key);
    }

    public void addPreference(String key, String value){
        Preferences preferencesEntity = preferenceRepository.findAll().get(0);
        HashMap<String, String> preferences = preferencesEntity.getPreferences();
        preferences.put(key, value);
        preferencesEntity.setPreferences(preferences);
        preferenceRepository.save(preferencesEntity);
    }

    public void deletePreference(String key){
        Preferences preferencesEntity = preferenceRepository.findAll().get(0);
        HashMap<String, String> preferences = preferencesEntity.getPreferences();
        preferences.remove(key);
        preferencesEntity.setPreferences(preferences);
        preferenceRepository.save(preferencesEntity);
    }

    public void overwritePreferences(HashMap<String, String> preferences){
        Preferences preferencesEntity = preferenceRepository.findAll().get(0);
        preferencesEntity.setPreferences(preferences);
        preferenceRepository.save(preferencesEntity);
    }

    public void setDefaults(){
        Preferences preferencesEntity = preferenceRepository.findAll().get(0);
        mergePreferences(defaultPreferences, preferencesEntity.getPreferences());
        preferenceRepository.save(preferencesEntity);
    }

    public void mergePreferences(HashMap<String, String> subset, Map<String, String> preferences){
        preferences.putAll(subset);
    }
}
