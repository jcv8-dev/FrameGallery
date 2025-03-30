package com.jcv8.framegallery.preferences.facade;

import com.jcv8.framegallery.preferences.logic.PreferenceService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/rest/v1/preferences")
public class PreferenceController {

    @Autowired
    private PreferenceService preferenceService;

    /**
     * Get all preferences
     * @return a map of all preferences
     */
    @GetMapping("/")
    @PreAuthorize("permitAll()")
    public ResponseEntity<Map<String, String>> getAllPreferences() {
        log.info("Request to fetch all preferences");
        return new ResponseEntity<>(preferenceService.getAllPreferences(), HttpStatus.OK);
    }

    /**
     * Get a preference by key
     * @param key the key of the preference
     * @return the value of the preference
     */
    @GetMapping("/{key}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<String> getPreferenceByKey(@PathVariable String key) {
        log.info("Request to fetch a preference by key {}", key);
        String preference = preferenceService.getPreferenceByKey(key);
        if (preference == null ||preference.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(preference, HttpStatus.OK);
    }

    /**
     * Add a preference
     * @param key the key of the preference
     * @param value the value of the preference
     * @return a response entity with the status code
     */
    @PostMapping("/{key}")
    @PreAuthorize("authenticated")
    public ResponseEntity<HttpStatus> addPreference(@PathVariable String key, @RequestParam String value) {
        ResponseEntity<HttpStatus> response;
        log.info("Request to add preference with key {} and value {}", key, value);
        // todo responses can be confusing as we add after a 2xx code is sent
        if(preferenceService.getPreferenceByKey(key) != null){
            response = new ResponseEntity<>(HttpStatus.OK);
        } else {
            response = new ResponseEntity<>(HttpStatus.CREATED);
        }
        preferenceService.addPreference(key, value);
        return response;
    }

    /**
     * Overwrite all preferences
     * @param preferences a map of preferences
     * @return a response entity with the status code
     */
    @PostMapping("/")
    @PreAuthorize("authenticated")
    public ResponseEntity<HttpStatus> addAllPreferences(@RequestBody HashMap<String, String> preferences){
        log.info("Receiving new preferences");
        if(preferences != null){
            preferenceService.overwritePreferences(preferences);
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @PostMapping("/reset")
    @PreAuthorize("authenticated")
    public ResponseEntity<HttpStatus> resetPreferences(){
        log.info("Request to reset preferences");
        preferenceService.resetPreferences();
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
