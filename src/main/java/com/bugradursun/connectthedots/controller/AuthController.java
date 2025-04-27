package com.bugradursun.connectthedots.controller;

import com.bugradursun.connectthedots.dto.AuthenticationRequestDto;
import com.bugradursun.connectthedots.dto.AuthenticationResponseDto;
import com.bugradursun.connectthedots.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationService authenticationService;

    public AuthController (AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponseDto> authenticate(@RequestBody final AuthenticationRequestDto authenticationRequestDto) {
        try{
            AuthenticationResponseDto response = authenticationService.authenticate(authenticationRequestDto);
            return ResponseEntity.ok(response);
        } catch(BadCredentialsException e) {
            AuthenticationResponseDto errorResponse = new AuthenticationResponseDto(null,"Wrong credentials");
            return ResponseEntity.status(401).body(errorResponse);
        }
    }
}
