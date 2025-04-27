package com.bugradursun.connectthedots.service;

import com.bugradursun.connectthedots.dto.AuthenticationRequestDto;
import com.bugradursun.connectthedots.dto.AuthenticationResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final AuthenticationManager authenticationManager; // kullanici kontrolu yapilan kisim
    private final JwtService jwtService;

    public AuthenticationResponseDto authenticate (final AuthenticationRequestDto request) {
        final var authToken = UsernamePasswordAuthenticationToken.unauthenticated(request.username(),request.password());
        final var authentication = authenticationManager.authenticate(authToken);

        final var token = jwtService.generateToken(request.username());
        final String message = "ok";
        return new AuthenticationResponseDto(token,message);
    }
}
