package com.bugradursun.connectthedots.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class CreateEdgeRequest {
    private UUID sourceId;
    private UUID targetId;
    private UUID boardId;
    private String createdBy;
}
