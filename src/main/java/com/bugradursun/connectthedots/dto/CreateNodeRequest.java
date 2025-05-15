package com.bugradursun.connectthedots.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class CreateNodeRequest {
    private String content;
    private UUID boardId;
    private String createdBy;
}
