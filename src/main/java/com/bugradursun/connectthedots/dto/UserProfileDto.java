package com.bugradursun.connectthedots.dto;

import java.util.ArrayList;
import java.util.List;

public record UserProfileDto(String email, String username, String age, String profession, List<String> boards, List<String> contributions) {
}
