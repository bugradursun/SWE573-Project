package com.bugradursun.connectthedots.dto;

import lombok.Data;

@Data
public class EdgeDto {
    private String id;
    private String source;
    private String target;
    private String type;
}
