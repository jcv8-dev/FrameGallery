package com.jcv8.framegallery.preferences.facade;

import com.jcv8.framegallery.preferences.logic.PreferenceService;
import com.jcv8.framegallery.user.facade.UserController;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/rest/v1/preferences")
public class PreferenceController {

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
        log.info("Request to get preference by key " + key);
        String preference = preferenceService.getPreferenceByKey(key);
        if (preference.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(preference, HttpStatus.OK);
    }

    @PostMapping("/{key}")
    public ResponseEntity<HttpStatus> addPreference(@PathVariable String key, @RequestParam String value) {
        ResponseEntity<HttpStatus> response;
        log.info("Request to add preference with key " + key + " and value " + value);
        // todo responses can be confusing as we add after a 2xx code is sent
        if(preferenceService.getPreferenceByKey(key) != null){
            response = new ResponseEntity<>(HttpStatus.OK);
        } else {
            response = new ResponseEntity<>(HttpStatus.CREATED);
        }
        preferenceService.addPreference(key, value);
        return response;
    }


}
