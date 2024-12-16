package com.jcv8.framegallery.preferences.logic;

import com.jcv8.framegallery.preferences.dataaccess.entity.Preferences;
import com.jcv8.framegallery.preferences.dataaccess.repository.PreferenceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class PreferenceService {

    @Autowired
    private PreferenceRepository preferenceRepository;

    private Map<String, String> defaultPreferences = Map.of(
            "language", "en_EN",
            "theme", "dark",
            "favicon-size", "32"

    );

    public Map<String, String> getAllPreferences(){
        return preferenceRepository.findAll().get(0).getPreferences();
    }

    public String getPreferenceByKey(String key){
        return preferenceRepository.findAll().get(0).getPreferences().get(key);
    }

    public void addPreference(String key, String value){
        Preferences preferencesEntity = preferenceRepository.findAll().get(0);
        Map<String, String> preferences = preferencesEntity.getPreferences();
        preferences.put(key, value);
        preferencesEntity.setPreferences(preferences);
        preferenceRepository.save(preferencesEntity);
    }

    public void deletePreference(String key){
        Preferences preferencesEntity = preferenceRepository.findAll().get(0);
        Map<String, String> preferences = preferencesEntity.getPreferences();
        preferences.remove(key);
        preferencesEntity.setPreferences(preferences);
        preferenceRepository.save(preferencesEntity);
    }

    public void overwritePreferences(Map<String, String> preferences){
        Preferences preferencesEntity = preferenceRepository.findAll().get(0);
        preferencesEntity.setPreferences(preferences);
        preferenceRepository.save(preferencesEntity);
    }

    public void setDefaults(){
        Preferences preferencesEntity = preferenceRepository.findAll().get(0);
        mergePreferences(defaultPreferences, preferencesEntity.getPreferences());
        preferenceRepository.save(preferencesEntity);
    }

    public void mergePreferences(Map<String, String> subset, Map<String, String> preferences){
        subset.forEach((key, value) -> {
            preferences.put(key, value);
        });
    }
}
