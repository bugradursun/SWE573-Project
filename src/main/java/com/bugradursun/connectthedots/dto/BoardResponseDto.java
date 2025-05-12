package com.bugradursun.connectthedots.dto;

import java.time.Instant;
import java.util.UUID;
public record BoardResponseDto(
        UUID id,
        String label,
        String title,
        String content,
        String createdBy,
        String description,
        Instant createdAt,
        Instant updatedAt
) {
}
