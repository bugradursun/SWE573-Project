package com.bugradursun.connectthedots.mapper;

import org.springframework.stereotype.Component;
import com.bugradursun.connectthedots.dto.RegistrationResponseDto;
import com.bugradursun.connectthedots.dto.RegistrationRequestDto;
import com.bugradursun.connectthedots.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserRegistrationMapper {
    public User toEntity(RegistrationRequestDto registrationRequestDto){
        final var user = new User();

        user.setEmail(registrationRequestDto.email());
        user.setUsername(registrationRequestDto.username());
        user.setPassword(registrationRequestDto.password());
        user.setAge(registrationRequestDto.age());
        user.setProfession(registrationRequestDto.profession());

        return user;
    }

    public RegistrationResponseDto toRegistrationResponseDto(User user) {
        return new RegistrationResponseDto(user.getEmail(),user.getUsername() );

    }

}
