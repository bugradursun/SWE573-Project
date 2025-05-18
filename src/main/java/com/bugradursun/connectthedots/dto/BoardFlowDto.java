package com.bugradursun.connectthedots.dto;

import lombok.Data;

import java.util.List;
import java.util.Map;
import java.util.Objects;

@Data
public class BoardFlowDto {
    private List<NodeDto> nodes;
    private List<EdgeDto> edges;
}

