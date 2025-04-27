package com.bugradursun.connectthedots.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AuthenticationRequestDto(
        @NotBlank(message = "Username is required")
        @Size(min=3,max=20,message = "Username must be between 3 and 20")
        String username,


        @NotBlank(message = "password is required")
        @Size(min=6,max=30,message = "password must be between 6 and 30")
        String password) {

}
