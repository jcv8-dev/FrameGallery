package com.jcv8.framegallery.preferences.facade;

import com.jcv8.framegallery.preferences.logic.PreferenceService;
import com.jcv8.framegallery.user.facade.UserController;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/rest/v1/preferences")
public class PreferenceController {
    private static final org.slf4j.Logger log = LoggerFactory.getLogger(UserController.class);
    private final Logger logger = Logger.getLogger(this.getClass().getName());

    @Autowired
    private PreferenceService preferenceService;

    @GetMapping("/all")
    public ResponseEntity<Map<String, String>> getAllPreferences() {
        Map<String, String> preferences = preferenceService.getAllPreferences();
        if (preferences.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(preferenceService.getAllPreferences(), HttpStatus.OK);
    }

    @GetMapping("/{key}")
    public ResponseEntity<String> getPreferenceByKey(@PathVariable String key) {
        String preference = preferenceService.getPreferenceByKey(key);
        if (preference.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(preference, HttpStatus.OK);
    }

    @PostMapping("/{key}")
    public ResponseEntity<HttpStatus> addPreference(@RequestParam String key, @RequestParam String value) {
        ResponseEntity response;
        if(preferenceService.getPreferenceByKey(key) != null){
            response = new ResponseEntity<>(HttpStatus.OK);
        } else {
            response = new ResponseEntity<>(HttpStatus.CREATED);
        }
        preferenceService.addPreference(key, value);
        return response;
    }

    
}
