package com.bugradursun.connectthedots.dto;

public record AuthenticationResponseDto(
        String token,String message,String username) {
}
