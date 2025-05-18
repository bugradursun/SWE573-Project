package com.bugradursun.connectthedots.controller;

import com.bugradursun.connectthedots.dto.UserProfileDto;
import com.bugradursun.connectthedots.dto.UserUpdateRequestDto;
import com.bugradursun.connectthedots.mapper.UserMapper;
import com.bugradursun.connectthedots.service.UserService;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserProfileController {

    private final UserService userService;
    private final UserMapper userMapper;

    @GetMapping("/me")
    public ResponseEntity<UserProfileDto> getUserProfile(final Authentication authentication) {
        final var user = userService.getByUsername(authentication.getName());

        return ResponseEntity.ok(userMapper.toUserProfileDto(user)); // user entity => userProfileDto
    }

    @PostMapping("/update")
    public ResponseEntity<UserProfileDto> updateUserProfile(final Authentication authentication, @RequestBody UserUpdateRequestDto updateDto) {
        final var updatedUser = userService.updateUser(authentication.getName(), updateDto);
        return ResponseEntity.ok(userMapper.toUserProfileDto(updatedUser));
    }
}
