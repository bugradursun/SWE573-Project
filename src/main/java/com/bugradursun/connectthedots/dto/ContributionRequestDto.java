package com.bugradursun.connectthedots.dto;

import java.util.UUID;

public record ContributionRequestDto(
        UUID boardId,
        String content,
        UUID parentId,
        String createdBy
) {
}
