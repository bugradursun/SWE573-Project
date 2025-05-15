package com.bugradursun.connectthedots.dto;


import lombok.Data;

import java.util.UUID;

public record NodeDto(
        UUID id,
        String label,
        UUID boardId,
        String createdBy
        ) {
}
