package com.bugradursun.connectthedots.dto;

public record BoardRequestDto(
        String label,
        String title,
        String content,
        String createdBy,
        String username,
        String description
) {}
