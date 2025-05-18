package com.bugradursun.connectthedots.dto;

public record UserUpdateRequestDto(
        String profession,
        String age,
        String email,
        String password,
        String username
) {
}
