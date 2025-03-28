package com.example.ConnectTheDotsApi.auth;

import com.example.ConnectTheDotsApi.role.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor //for 'final' variables
public class AuthenticationService {

    private final RoleRepository roleRepository; // bunu final olarak işaretledigimiz icin @RequiredArgsConstructor ile constructor oluşturulur ve DI yapılmıs olur

    public void register(RegistrationRequest request) {

    }
}
