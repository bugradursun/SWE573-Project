package com.bugradursun.connectthedots.mapper;

import com.bugradursun.connectthedots.dto.UserProfileDto;
import com.bugradursun.connectthedots.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {
    public UserProfileDto toUserProfileDto(final User user) { // entity => DTO
        return new UserProfileDto(user.getEmail(),user.getUsername(),user.getAge(),user.getProfession(),user.getBoards(),user.getContributions());
    }
}
