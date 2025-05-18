package com.bugradursun.connectthedots.mapper;

import com.bugradursun.connectthedots.dto.NodeDto;
import com.bugradursun.connectthedots.entity.Node;
import org.springframework.stereotype.Component;

@Component
public class NodeMapper {

    public static NodeDto toDto(Node node) {
        NodeDto dto = new NodeDto(
                node.getId(),
                node.getContent(),
                node.getBoard().getId(),
                node.getCreatedBy()
        );
        return dto;


    }
}
