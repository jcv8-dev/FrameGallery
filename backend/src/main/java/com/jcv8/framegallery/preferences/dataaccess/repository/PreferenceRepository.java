package com.jcv8.framegallery.preferences.dataaccess.repository;

import com.jcv8.framegallery.preferences.dataaccess.entity.Preferences;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PreferenceRepository extends JpaRepository<Preferences, Integer> {
}
