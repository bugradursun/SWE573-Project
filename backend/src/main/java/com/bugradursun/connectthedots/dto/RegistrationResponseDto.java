package com.bugradursun.connectthedots.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegistrationResponseDto(
        String username,
        String email

) {
}