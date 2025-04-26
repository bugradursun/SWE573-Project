package com.bugradursun.connectthedots.service;

import com.bugradursun.connectthedots.dto.RegistrationRequestDto;
import com.bugradursun.connectthedots.entity.User;
import com.bugradursun.connectthedots.repository.UserRepository;
import jakarta.transaction.Transactional;
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;

import static org.springframework.http.HttpStatus.CONFLICT;

//https://medium.com/@max.difranco/building-a-user-registration-and-jwt-authentication-service-with-spring-boot-3-66cf76233204
@Service
@RequiredArgsConstructor
public class UserRegistrationService {
    // REGISTER SERVICE

    private final UserRepository userRepository; //dep injection with @RequiredArgsConstructor, constructor injection yapıldı
    private final PasswordEncoder passwordEncoder; // same with above

    @Transactional
    public User registerUser(User user) {
        final var errors = new HashMap<String,String>();
        if(userRepository.existsByEmail(user.getEmail())) {
            errors.put("email","Email [%s] is already taken".formatted(user.getEmail()));
        }
        if(userRepository.existsByUsername(user.getUsername())) {
            errors.put("username","Username [%s] is already taken".formatted(user.getUsername()));
        }
        if(!errors.isEmpty()) {
            throw new ValidationException(errors.toString());
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return userRepository.save(user);
    }
}
