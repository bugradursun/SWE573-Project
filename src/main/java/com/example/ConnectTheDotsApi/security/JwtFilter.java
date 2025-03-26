package com.example.ConnectTheDotsApi.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/*
* Gelen HTTP isteklerinden Authorization:Bearer<TOKEN> basligini okur
* JWT token gecerli olup olmadıgını kontrol eder
* Token valid ise => auth yaparak Spring security context'e ekler
* */
@Service
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain)
            throws ServletException, IOException {
        if(request.getServletPath().contains("/api/v1/auth")) {
            filterChain.doFilter(request,response);
            return;
        }
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        final String jwt;
        final String userEmail; // will extract from token

        if(authHeader == null || !authHeader.startsWith("Bearer ")){ // the case we are not expecting
            filterChain.doFilter(request,response);
            return;
        }
        jwt = authHeader.substring(7); // starting from Bearer
        userEmail = jwtService.extractUsername(jwt);



    }
}
