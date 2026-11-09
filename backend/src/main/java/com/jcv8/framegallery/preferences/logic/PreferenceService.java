package com.jcv8.framegallery.preferences.logic;

import com.jcv8.framegallery.preferences.dataaccess.entity.Preferences;
import com.jcv8.framegallery.preferences.dataaccess.repository.PreferenceRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Slf4j

@Service
public class PreferenceService {

    @Autowired
    private PreferenceRepository preferenceRepository;

    @Transactional
    public synchronized Map<String, String> getAllPreferences(){
        if(preferenceRepository.findAll().isEmpty()){
            log.info("Initializing Preferences with default values");
            preferenceRepository.save(new Preferences(new HashMap<>(Preferences.defaultPreferences)));
        }
        addDefaults();
        return preferenceRepository.findAll().get(0).getPreferences();
    }

    @Transactional
    public synchronized String getPreferenceByKey(String key){
        if(preferenceRepository.findAll().isEmpty()){
            log.info("Initializing Preferences with default values");
            preferenceRepository.save(new Preferences(new HashMap<>(Preferences.defaultPreferences)));
        }
        addDefaults();
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
        preferencesEntity.setPreferences(new HashMap<>(preferences));
        preferenceRepository.save(preferencesEntity);
    }

    /**
     * Applies default values in case new defaults get added
     */
    public synchronized void addDefaults(){
        Preferences preferencesEntity = preferenceRepository.findAll().get(0);
        Map<String, String> preferences = new HashMap<>(preferencesEntity.getPreferences());
        boolean changed = false;
        for (Map.Entry<String, String> entry : Preferences.defaultPreferences.entrySet()){
            if(!preferences.containsKey(entry.getKey())){
                preferences.put(entry.getKey(), entry.getValue());
                changed = true;
                log.info("Added new default value for {} to preferences", entry.getKey());
            }
        }
        if (changed) {
            preferencesEntity.setPreferences(preferences);
            preferenceRepository.save(preferencesEntity);
        }
    }

    public void resetPreferences(){
        Preferences preferencesEntity = preferenceRepository.findAll().get(0);
        preferencesEntity.setPreferences(new HashMap<>(Preferences.defaultPreferences));
        preferenceRepository.save(preferencesEntity);
    }
}
