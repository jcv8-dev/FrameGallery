package com.jcv8.framegallery.user.logic;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.jcv8.framegallery.user.dataaccess.entity.UserInfo;
import com.jcv8.framegallery.user.dataaccess.entity.UserInfoDetails;
import com.jcv8.framegallery.user.dataaccess.repository.UserInfoRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.logging.Logger;

import static org.antlr.v4.runtime.tree.xpath.XPath.findAll;

@Slf4j

@Service
public class UserInfoService implements UserDetailsService {

    public static final int MIN_PASSWORD_LENGTH = 8;

    @Autowired
    private UserInfoRepository repository;

    @Autowired
    private PasswordEncoder encoder;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        Optional<UserInfo> userDetail = repository.findByUsername(username);

        // Converting userDetail to UserDetails
        if(userDetail.isEmpty()) {
            throw new UsernameNotFoundException("User not found");
        }
        return new UserInfoDetails(userDetail.get());
    }

    public UserInfo addUser(UserInfo userInfo) throws IllegalStateException{
        if(hasOnboarded()){
            throw new IllegalStateException("Only one user can be added");
        }
        if (userInfo.getPassword() == null || userInfo.getPassword().length() < MIN_PASSWORD_LENGTH) {
            throw new IllegalArgumentException("Password must be at least " + MIN_PASSWORD_LENGTH + " characters long");
        }
        log.info("Adding user {}", userInfo.getUsername());
        if(repository.findByUsername(userInfo.getUsername()).isEmpty()) {
            userInfo.setPassword(encoder.encode(userInfo.getPassword()));
            return repository.save(userInfo);
        }
        return null;
    }

    public Boolean hasOnboarded() {
        return !repository.findAll().isEmpty();
    }

    public Map<String, String> getArtistInfo() throws IllegalAccessException {
        List<UserInfo> artists = repository.findAll();
        if(artists.isEmpty()) throw new IllegalAccessException("There isn't any info");
        Map<String, String> artistInfo = new HashMap<>();
        artistInfo.put("name", artists.get(0).getName());
        return artistInfo;
    }

    public void updateArtistName(String name) throws IllegalAccessException {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Artist name cannot be empty");
        }
        List<UserInfo> artists = repository.findAll();
        if (artists.isEmpty()) {
            throw new IllegalAccessException("There isn't any info");
        }
        UserInfo artist = artists.get(0);
        artist.setName(name.trim());
        repository.save(artist);
    }
}