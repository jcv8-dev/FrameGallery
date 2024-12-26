package com.jcv8.framegallery.user.facade;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.jcv8.framegallery.configuration.JwtService;
import com.jcv8.framegallery.user.dataaccess.dto.AuthRequestDto;
import com.jcv8.framegallery.user.dataaccess.entity.UserInfo;
import com.jcv8.framegallery.user.logic.UserInfoService;
import java.util.HashMap;
import java.util.Map;

@Slf4j

@RestController
@RequestMapping("/api/rest/v1/artist")
@Tag(name = "User", description = "User related operations")
@CrossOrigin(origins = "${cors.allowed.origin}")
public class UserController {

    @Autowired
    private UserInfoService service;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserInfoService userInfoService;

    @PostMapping("/auth/register")
    @Operation(summary = "Register a new user")
    @ApiResponses(
            value = {
                    @ApiResponse(responseCode = "201", description = "User registered successfully"),
                    @ApiResponse(responseCode = "401", description = "User already exists")
            }
    )
    public ResponseEntity<?> addNewUser(@RequestBody UserInfo userInfo) {
        log.info("Request to register new User " + userInfo);
        try{
            UserInfo newUser = service.addUser(userInfo);
            return ResponseEntity.status(HttpStatus.CREATED).body(newUser);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("");
        }
    }

    @PostMapping("/auth/login")
    @Operation(summary = "Authenticate and get a token")
    @ApiResponses(
            value = {
                    @ApiResponse(responseCode = "200", description = "Authentication successful"),
                    @ApiResponse(responseCode = "401", description = "Authentication failed")
            }
    )
    public ResponseEntity<?> authenticateAndGetToken(@RequestBody AuthRequestDto authRequest) {
        log.info("Login request from " + authRequest.getUsername());
        try{
            Authentication authentication = new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword());
            authenticationManager.authenticate(authentication);
            String jwt = jwtService.generateToken(authRequest.getUsername());
            Map<String, Object> responseMap = new HashMap<>();
            responseMap.put("token", jwt);
            log.info("Authentication Success");
            return ResponseEntity.status(HttpStatus.OK).body(responseMap);
        } catch (Exception e) {
            log.info("Authentication Failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    /**
     * Lets the frontend check whether to allow the onboarding page to load
     * @return true, if there is no registered user
     */
    @GetMapping("/auth/onboarding")
    @Operation(summary = "Check if onboarding is necessary")
    @ApiResponses(
            value = {
                    @ApiResponse(responseCode = "200", description = "Onboarding necessary"),
                    @ApiResponse(responseCode = "403", description = "Onboarding not necessary")
            }
    )
    public ResponseEntity<?> onboarding() {
        log.info("Running Onboarding check");
        if(userInfoService.hasOnboarded()){
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("");
        } else {
            return ResponseEntity.status(HttpStatus.OK).body("");
        }
    }

    @GetMapping("/info")
    @Operation(summary = "Get the artist information")
    @ApiResponses(
            value = {
                    @ApiResponse(responseCode = "200", description = "Artist information retrieved"),
                    @ApiResponse(responseCode = "404", description = "Artist information not found")
            }
    )
    public ResponseEntity<?> artistInfo(){
        log.info("Processing info request");
        try{
            return ResponseEntity.status(HttpStatus.OK).body(userInfoService.getArtistInfo());
        } catch (IllegalAccessException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("");
        }
    }
}
