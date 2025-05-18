package com.bugradursun.connectthedots.dto;

public record ErrorResponseDto(
        String error,
        int status
) {
}
