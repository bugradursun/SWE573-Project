package com.bugradursun.connectthedots.service;

import com.bugradursun.connectthedots.dto.UserUpdateRequestDto;
import com.bugradursun.connectthedots.entity.User;
import com.bugradursun.connectthedots.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.server.ResponseStatusException;

import static org.springframework.http.HttpStatus.GONE;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User getByUsername(final String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(GONE,
                        "The user account has been deleted or inactivated "));

    }

    public void save(User user) {
        userRepository.save(user);
    }

    public User updateUser(String username, UserUpdateRequestDto updateDto) {
        User user = getByUsername(username); // fetch user

        if(updateDto.profession() !=null) user.setProfession(updateDto.profession());
        if(updateDto.age() !=null) user.setAge(updateDto.age());
        if(updateDto.email() !=null) user.setEmail(updateDto.email());
        if(updateDto.password() !=null) user.setPassword(updateDto.password());
        if(updateDto.username() !=null) user.setUsername(updateDto.username());

        return userRepository.save(user);
    }

}
