package com.bugradursun.connectthedots.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegistrationRequestDto(

        @NotBlank(message = "username is required")
        @Size(min = 3,max = 20,message = "Username must be between 3 and 20")
        String username,

        @NotBlank(message="mail is required")
        @Email(message = "Please provide a valid email address")
        String email,

        @NotBlank(message = "password is required")
        @Size(min = 6,max = 30,message = "password must be between 6 and 30")
        String password,

        @NotBlank(message = "age is required")
        @Size(min = 1,max = 4,message = "age must be between 1 and 4")
        String age,

        @NotBlank(message = "profession is required")
        @Size(min = 1,max = 30,message = "profession must be between 1 and 30")
        String profession




) {
}