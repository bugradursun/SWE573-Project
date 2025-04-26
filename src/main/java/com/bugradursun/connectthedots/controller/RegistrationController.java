package com.bugradursun.connectthedots.controller;

import com.bugradursun.connectthedots.mapper.UserRegistrationMapper;
import com.bugradursun.connectthedots.dto.RegistrationRequestDto;
import com.bugradursun.connectthedots.dto.RegistrationResponseDto;
import com.bugradursun.connectthedots.mapper.UserRegistrationMapper;
import com.bugradursun.connectthedots.service.UserRegistrationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor // automatic constructor for final variables
public class RegistrationController {
    private final UserRegistrationService userRegistrationService;
    private final UserRegistrationMapper userRegistrationMapper;

    @PostMapping("/register")
    public ResponseEntity<RegistrationResponseDto> registerUser(@Valid @RequestBody final RegistrationRequestDto registrationDTO) {
        final var registeredUser = userRegistrationService.registerUser(userRegistrationMapper.toEntity(registrationDTO));

        return ResponseEntity.ok(userRegistrationMapper.toRegistrationResponseDto(registeredUser)); // return 200 ok HTTP status code
    }

}
