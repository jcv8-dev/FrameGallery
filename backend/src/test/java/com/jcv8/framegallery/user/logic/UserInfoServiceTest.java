package com.jcv8.framegallery.user.logic;

import com.jcv8.framegallery.user.dataaccess.entity.UserInfo;
import com.jcv8.framegallery.user.dataaccess.repository.UserInfoRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserInfoServiceTest {

    @Mock
    private UserInfoRepository repository;

    @Mock
    private PasswordEncoder encoder;

    @InjectMocks
    private UserInfoService service;

    @Test
    void rejectsPasswordsShorterThanMinimum() {
        UserInfo userInfo = new UserInfo(0, "user", "User", "short");
        when(repository.findAll()).thenReturn(List.of());

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> service.addUser(userInfo)
        );

        assertEquals("Password must be at least 8 characters long", exception.getMessage());
        verify(repository, never()).save(any());
        verify(encoder, never()).encode(any());
    }

    @Test
    void storesValidPasswordEncoded() {
        UserInfo userInfo = new UserInfo(0, "user", "User", "long-enough");
        when(repository.findAll()).thenReturn(List.of());
        when(repository.findByUsername("user")).thenReturn(java.util.Optional.empty());
        when(encoder.encode("long-enough")).thenReturn("encoded");
        when(repository.save(userInfo)).thenReturn(userInfo);

        service.addUser(userInfo);

        assertEquals("encoded", userInfo.getPassword());
        verify(repository).save(userInfo);
    }
}
