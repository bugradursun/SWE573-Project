package com.bugradursun.connectthedots.dto;

import lombok.Data;

import java.util.UUID;

//package com.bugradursun.connectthedots.dto;

import lombok.Data;

import java.util.UUID;

public record EdgeDto (UUID id,
                       UUID sourceId,
                       UUID targetId,
                       UUID boardId,
                       String title,
                       String createdBy) {

}
