package com.bugradursun.connectthedots.dto;

import lombok.Data;

import java.util.Map;
import java.util.Objects;

@Data
public class NodeDto{
    private String id;
    private String type;
    private Map<String, Object> data;
    private Map<String,Integer> position;
}
